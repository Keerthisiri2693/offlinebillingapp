import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  NativeModules,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useFocusEffect,
  useRouter,
} from "expo-router";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  getDB,
  getProducts,
  getInvoiceCustomers,
  insertNewInvoice,
  insertNewInvoiceItem
} from "../database/sqlite";




// =====================================================
// TYPES
// =====================================================

type Product = {
  id: string;

  productcode?: string;
  productenglishname?: string;
  producttamilName?: string;

  category?: string;
  subcategory?: string;

  productimage?: string;

  purchase?: number;
  retail?: number;
  mrp?: number;

  stockquantity?: number;

  unittype?: string;
  uom?: string;

  sgst?: number;
  cgst?: number;
  igst?: number;

  hsn?: string;
  hsncode?: string;
  barcode?: string;
};


type Customer = {
  customer?: string;
  mobileno?: string;
  invoiceCount?: number;
  totalAmount?: number;
};


type InvoiceItem = {
  id: string;

  productId: string;
  product: string;
  productcode: string;
  productimage: string;

  category: string;
  subcategory: string;

  qty: number;
  rate: number;

  unit: string;
  uom: string;

  discount: number;

  sgstRate: number;
  cgstRate: number;
  igstRate: number;

  sgst: number;
  cgst: number;
  igst: number;

  taxableAmount: number;
  amount: number;
  totalAmount: number;
};


// =====================================================
// HELPERS
// =====================================================

const money = (value: number) =>
  `₹${Number(value || 0).toFixed(2)}`;


const createId = () =>
  `${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;


const formatDate = (date = new Date()) => {

  const day =
    String(date.getDate())
      .padStart(2, "0");

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const year =
    date.getFullYear();

  return `${day}-${month}-${year}`;
};


// =====================================================
// SCREEN
// =====================================================

export default function BillingScreen() {

  const router = useRouter();


  // ===================================================
  // BASIC INVOICE
  // ===================================================

  const [invoiceId, setInvoiceId] =
    useState<string>(createId);

  // Prevent duplicate invoice saves when Print is tapped repeatedly.
  const isSavingRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  const [invoiceNo, setInvoiceNo] =
    useState("");

  const [invoiceDate, setInvoiceDate] =
    useState(formatDate());


  const [gstNo, setGstNo] =
    useState("");

    const [savedInvoiceId, setSavedInvoiceId] =
  useState<string>("");

  const [paymentMode, setPaymentMode] =
    useState("Cash");


  const [taxEnabled, setTaxEnabled] =
    useState(true);


  // ===================================================
  // CUSTOMER
  // ===================================================

  const [customerName, setCustomerName] =
    useState("");

  const [customerMobile, setCustomerMobile] =
    useState("");


  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [showCustomerModal, setShowCustomerModal] =
    useState(false);


  // ===================================================
  // PRODUCTS
  // ===================================================

  const [products, setProducts] =
    useState<Product[]>([]);

  const [items, setItems] =
    useState<InvoiceItem[]>([]);


  const [showProductModal, setShowProductModal] =
    useState(false);

  const [productSearch, setProductSearch] =
    useState("");


  // ===================================================
  // PAYMENT MODAL
  // ===================================================

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);


  const paymentModes = [
    "Cash",
    "UPI",
    "Card",
    "Credit",
  ];


  // ===================================================
  // REFRESH
  // ===================================================

  const [refreshing, setRefreshing] =
    useState(false);


  // ===================================================
  // LOAD DATA
  // ===================================================

  const loadData = async () => {

    try {

      console.log(
        "🔄 BILLING: Loading data..."
      );


      const productResult =
        await getProducts();

      setProducts(
        Array.isArray(productResult)
          ? productResult
          : []
      );


      try {

        const customerResult =
          await getInvoiceCustomers();

        setCustomers(
          Array.isArray(customerResult)
            ? customerResult
            : []
        );

      } catch (customerError) {

        console.log(
          "⚠️ Customer history unavailable:",
          customerError
        );

        setCustomers([]);

      }


      await generateInvoiceNo();

    } catch (error) {

      console.log(
        "❌ BILLING LOAD ERROR:",
        error
      );

    }

  };


  useFocusEffect(
    useCallback(() => {

      loadData();

    }, [])
  );


  // ===================================================
  // GENERATE INVOICE NUMBER
  // ===================================================

  const generateInvoiceNo = async () => {
  try {
    const database = await getDB();

    if (!database) {
      console.log(
        "❌ generateInvoiceNo: DATABASE NOT FOUND"
      );
      return;
    }

    const result =
      await database.getFirstAsync<{
        maxInvoiceNo: number | null;
      }>(
        `
        SELECT
          MAX(
            CAST(invoiceNo AS INTEGER)
          ) AS maxInvoiceNo
        FROM newinvoice
        `
      );

    const maxInvoiceNo =
      Number(
        result?.maxInvoiceNo || 0
      );

    const nextInvoiceNo =
      maxInvoiceNo + 1;

    console.log(
      "🧾 MAX INVOICE NO:",
      maxInvoiceNo
    );

    console.log(
      "🧾 NEXT INVOICE NO:",
      nextInvoiceNo
    );

    setInvoiceNo(
      String(nextInvoiceNo)
    );

  } catch (error) {

    console.log(
      "❌ generateInvoiceNo ERROR:",
      error
    );

    // Safe fallback
    const fallback =
      Math.floor(
        100000 +
        Math.random() * 900000
      );

    setInvoiceNo(
      String(fallback)
    );
  }
};


  // ===================================================
  // PRODUCT SEARCH
  // ===================================================

  const filteredProducts =
    useMemo(() => {

      const keyword =
        productSearch
          .trim()
          .toLowerCase();


      return products.filter(
        product => {

          if (!keyword) {
            return true;
          }


          return (

            product.productenglishname
              ?.toLowerCase()
              .includes(keyword)

            ||

            product.producttamilName
              ?.toLowerCase()
              .includes(keyword)

            ||

            product.productcode
              ?.toLowerCase()
              .includes(keyword)

            ||

            product.barcode
              ?.toLowerCase()
              .includes(keyword)

          );

        }
      );

    }, [
      products,
      productSearch,
    ]);


  // ===================================================
  // ADD PRODUCT
  // ===================================================

  const addProduct = (
    product: Product
  ) => {

    const productId =
      String(product.id);


    const existingIndex =
      items.findIndex(
        item =>
          item.productId ===
          productId
      );


    if (existingIndex >= 0) {

      const updated =
        [...items];

      const oldItem =
        updated[existingIndex];


      const newQty =
        oldItem.qty + 1;


      updated[existingIndex] =
        calculateItem({
          ...oldItem,
          qty: newQty,
        });


      setItems(updated);

    } else {

      const rate =
        Number(
          product.retail || 0
        );


      const newItem =
        calculateItem({

          id: createId(),

          productId,

          product:
            product.productenglishname ||
            "",

          productcode:
            product.productcode ||
            "",

          productimage:
            product.productimage ||
            "",

          category:
            product.category ||
            "",

          subcategory:
            product.subcategory ||
            "",

          qty: 1,

          rate,

          unit:
            product.unittype ||
            product.uom ||
            "Unit",

          uom:
            product.uom ||
            product.unittype ||
            "Unit",

          discount: 0,

          sgstRate:
            Number(
              product.sgst || 0
            ),

          cgstRate:
            Number(
              product.cgst || 0
            ),

          igstRate:
            Number(
              product.igst || 0
            ),

          sgst: 0,
          cgst: 0,
          igst: 0,

          taxableAmount: 0,
          amount: 0,
          totalAmount: 0,

        });

      setItems([
        ...items,
        newItem,
      ]);

    }


    setShowProductModal(false);
    setProductSearch("");

  };


  // ===================================================
  // CALCULATE ITEM
  // ===================================================

  const calculateItem = (
    item: InvoiceItem
  ): InvoiceItem => {

    const qty =
      Math.max(
        0,
        Number(item.qty || 0)
      );


    const rate =
      Math.max(
        0,
        Number(item.rate || 0)
      );


    const discount =
      Math.max(
        0,
        Number(item.discount || 0)
      );


    const gross =
      qty * rate;


    const taxableAmount =
      Math.max(
        0,
        gross - discount
      );


    const sgst =
      taxEnabled
        ? taxableAmount *
          Number(
            item.sgstRate || 0
          ) /
          100
        : 0;


    const cgst =
      taxEnabled
        ? taxableAmount *
          Number(
            item.cgstRate || 0
          ) /
          100
        : 0;


    const igst =
      taxEnabled
        ? taxableAmount *
          Number(
            item.igstRate || 0
          ) /
          100
        : 0;


    const tax =
      sgst +
      cgst +
      igst;


    return {

      ...item,

      qty,
      rate,
      discount,

      taxableAmount,

      sgst,
      cgst,
      igst,

      amount:
        taxableAmount,

      totalAmount:
        taxableAmount + tax,

    };

  };


  // ===================================================
  // UPDATE ITEM
  // ===================================================

  const updateItem = (
    id: string,
    field:
      | "qty"
      | "rate"
      | "discount",
    value: string
  ) => {

    const numericValue =
      Number(
        value.replace(
          /[^0-9.]/g,
          ""
        )
      ) || 0;


    setItems(
      current =>
        current.map(item => {

          if (item.id !== id) {
            return item;
          }


          return calculateItem({
            ...item,
            [field]:
              numericValue,
          });

        })
    );

  };


  // ===================================================
  // REMOVE ITEM
  // ===================================================

  const removeItem = (
    id: string
  ) => {

    setItems(
      current =>
        current.filter(
          item =>
            item.id !== id
        )
    );

  };


  // ===================================================
  // TOTALS
  // ===================================================

  const subtotal =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.qty * item.rate
        ),
      0
    );


  const discount =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.discount || 0
        ),
      0
    );


  const taxableAmount =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.taxableAmount || 0
        ),
      0
    );


  const sgst =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.sgst || 0
        ),
      0
    );


  const cgst =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.cgst || 0
        ),
      0
    );


  const igst =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.igst || 0
        ),
      0
    );


  const tax =
    sgst +
    cgst +
    igst;


  const grandTotal =
    taxableAmount +
    tax;


  // ===================================================
  // SAVE INVOICE
  // ===================================================

const handleSaveInvoice = async () => {
  // Prevent duplicate taps / duplicate invoice insertion.
  if (isSavingRef.current) return;

  // VALIDATION
  if (!items.length) {
    Alert.alert("Add Product", "Please select at least one product.");
    return;
  }

  if (!customerName.trim()) {
    Alert.alert("Customer Required", "Please enter customer name.");
    return;
  }

  if (!customerMobile.trim()) {
    Alert.alert("Phone Required", "Please enter customer phone number.");
    return;
  }

  if (items.some(item => Number(item.qty || 0) <= 0)) {
    Alert.alert("Invalid Quantity", "Product quantity must be greater than zero.");
    return;
  }

  // STOCK CHECK
  for (const item of items) {
    const product = products.find(
      p => String(p.id) === String(item.productId)
    );

    if (
      product &&
      Number(product.stockquantity || 0) < Number(item.qty || 0)
    ) {
      Alert.alert(
        "Insufficient Stock",
        `${item.product || "Product"} has only ${Number(
          product.stockquantity || 0
        )} ${item.uom || ""}.`
      );
      return;
    }
  }

  isSavingRef.current = true;
  setIsSaving(true);

  // Snapshot current values before asynchronous operations.
  const currentInvoiceId = String(invoiceId);
  const currentInvoiceNo = String(invoiceNo || "");
  const currentItems = [...items];

  const invoice = {
    id: currentInvoiceId,
    invoiceNo: currentInvoiceNo,
    invoiceDate: invoiceDate || new Date().toISOString(),
    customerId: "",
    customerName: customerName.trim(),
    customerMobile: customerMobile.trim(),
    gstNo: gstNo.trim(),
    paymentMode: paymentMode || "Cash",
    taxType: taxEnabled ? "GST" : "No Tax",
    billType: "Retail",
    subtotal: Number(subtotal || 0),
    discount: Number(discount || 0),
    taxableAmount: Number(subtotal || 0) - Number(discount || 0),
    sgst: Number(sgst || 0),
    cgst: Number(cgst || 0),
    igst: Number(igst || 0),
    tax: Number(tax || 0),
    totalAmount: Number(grandTotal || 0),
    paidAmount:
      paymentMode === "Credit" ? 0 : Number(grandTotal || 0),
    balanceAmount:
      paymentMode === "Credit" ? Number(grandTotal || 0) : 0,
    status: paymentMode === "Credit" ? "UNPAID" : "PAID",
    notes: "",
    createdAt: new Date().toISOString(),
  };

  // PREPARE ITEMS
  const safeItems = currentItems.map((item, index) => {
    const quantity = Number(item.qty || 0);
    const rate = Number(item.rate || 0);
    const amount = Number(item.amount ?? quantity * rate);
    const itemDiscount = Number(item.discount || 0);
    const itemTaxableAmount = Number(
      item.taxableAmount ?? (amount - itemDiscount)
    );
    const itemSgst = Number(item.sgst || 0);
    const itemCgst = Number(item.cgst || 0);
    const itemIgst = Number(item.igst || 0);
    const itemTaxAmount = itemSgst + itemCgst + itemIgst;
    const itemTotalAmount = Number(
      item.totalAmount ?? (itemTaxableAmount + itemTaxAmount)
    );

    return {
      id: `${currentInvoiceId}_${item.productId || index}`,
      invoiceId: currentInvoiceId,
      productId: item.productId ? String(item.productId) : "",
      productcode: item.productcode || "",
      productName: item.product || "",
      productimage: item.productimage || "",
      category: item.category || "",
      subcategory: item.subcategory || "",
      quantity,
      rate,
      amount,
      unit: item.unit || "",
      uom: item.uom || "",
      discount: itemDiscount,
      taxableAmount: itemTaxableAmount,
      sgst: itemSgst,
      cgst: itemCgst,
      igst: itemIgst,
      taxAmount: itemTaxAmount,
      totalAmount: itemTotalAmount,
    };
  });

  try {
    // 1. SAVE INVOICE HEADER AND ITEMS TO LOCAL SQLITE
    const database = await getDB();

    if (!database) {
      throw new Error("Unable to open SQLite database.");
    }

    const invoiceInserted = await insertNewInvoice(database, invoice);

    if (!invoiceInserted) {
      throw new Error("Unable to insert invoice header.");
    }

    console.log("✅ INVOICE HEADER INSERTED:", currentInvoiceId);

    for (const item of safeItems) {
      const itemInserted = await insertNewInvoiceItem(database, item);

      if (!itemInserted) {
        throw new Error(
          `Unable to insert invoice item: ${item.productName || "Unknown"}`
        );
      }

      console.log("✅ INVOICE ITEM INSERTED:", item.productName);
    }

    // 2. UPDATE PRODUCT STOCK AFTER ALL INVOICE ITEMS ARE INSERTED
    for (const item of safeItems) {
      if (!item.productId) continue;

      await database.runAsync(
        `
        UPDATE products
        SET stockquantity = MAX(
          0,
          COALESCE(stockquantity, 0) - ?
        )
        WHERE id = ?
        `,
        [Number(item.quantity || 0), String(item.productId)]
      );

      console.log("📦 STOCK UPDATED:", item.productName, item.quantity);
    }

    setSavedInvoiceId(currentInvoiceId);
    console.log("🎉 INVOICE SAVED LOCALLY:", currentInvoiceId);

    // 3. SEND THE SAVED RECEIPT TO THE UROVO NATIVE PRINTER MODULE
    const printReceipt = async (): Promise<boolean> => {
      try {
        const printer = NativeModules.UrovoPrinter;

        if (!printer || typeof printer.printReceipt !== "function") {
          throw new Error(
            "UROVO built-in printer module is not registered. Check MainApplication.kt and UrovoPrinterPackage.java."
          );
        }

        const receiptData = {
          paperWidth: 58, // 58mm paper = 2-inch receipt width
          shopName: "AST OFFLINE BILLING",
          address: "",
          invoiceNo: invoice.invoiceNo,
          invoiceDate: invoice.invoiceDate,
          customerName: invoice.customerName,
          customerMobile: invoice.customerMobile,
          gstNo: invoice.gstNo,
          paymentMode: invoice.paymentMode,
          items: safeItems.map(item => ({
            name: item.productName,
            quantity: item.quantity,
            rate: item.rate,
            total: item.totalAmount,
            uom: item.uom,
          })),
          subtotal: invoice.subtotal,
          discount: invoice.discount,
          taxableAmount: invoice.taxableAmount,
          sgst: invoice.sgst,
          cgst: invoice.cgst,
          igst: invoice.igst,
          tax: invoice.tax,
          grandTotal: invoice.totalAmount,
          footer: "THANK YOU! VISIT AGAIN",
        };

        const result = await printer.printReceipt(JSON.stringify(receiptData));
        console.log("🖨️ UROVO PRINT RESULT:", result);
        return true;
      } catch (printError) {
        console.log("❌ UROVO PRINT ERROR:", printError);
        return false;
      }
    };

    const navigateToSavedInvoice = () => {
      setItems([]);
      setCustomerName("");
      setCustomerMobile("");
      setGstNo("");
      setPaymentMode("Cash");

      // Create a fresh ID for the next invoice.
      setInvoiceId(createId());
      setSavedInvoiceId("");
      generateInvoiceNo();

      router.push({
        pathname: "/src/screens/ViewNewBilling",
        params: { invoiceId: currentInvoiceId },
      });
    };

    const printed = await printReceipt();

    if (printed) {
      Alert.alert(
        "Invoice Saved & Printed",
        `Invoice #${currentInvoiceNo} was saved locally and sent to the printer.`,
        [{ text: "OK", onPress: navigateToSavedInvoice }]
      );
    } else {
      Alert.alert(
        "Invoice Saved - Print Not Available",
        `Invoice #${currentInvoiceNo} and its items are saved in SQLite. Printing could not be completed because the UROVO printer module is not configured or the printer returned an error.`,
        [
          { text: "View Bill", onPress: navigateToSavedInvoice },
          {
            text: "Retry Print",
            onPress: async () => {
              const retryPrinted = await printReceipt();

              if (retryPrinted) {
                Alert.alert(
                  "Print Successful",
                  `Invoice #${currentInvoiceNo} printed successfully.`,
                  [{ text: "OK", onPress: navigateToSavedInvoice }]
                );
              } else {
                Alert.alert(
                  "Print Failed",
                  "The invoice remains saved locally. Check the UROVO printer connection and SDK configuration, then try again."
                );
              }
            },
          },
        ]
      );
    }
  } catch (error: any) {
    console.log("❌ SAVE INVOICE ERROR:", error);

    Alert.alert(
      "Invoice Save Failed",
      String(error?.message || error || "Unable to save invoice.")
    );
  } finally {
    isSavingRef.current = false;
    setIsSaving(false);
  }
};

  // PRODUCT MODAL
  // ===================================================

  const ProductModal = () => (

    <Modal
      visible={
        showProductModal
      }
      animationType="slide"
      transparent
      onRequestClose={() =>
        setShowProductModal(false)
      }
    >

      <View
        style={
          styles.modalOverlay
        }
      >

        <View
          style={
            styles.productModal
          }
        >

          <View
            style={
              styles.modalHeader
            }
          >

            <View>

              <Text
                style={
                  styles.modalTitle
                }
              >
                Select Product
              </Text>

              <Text
                style={
                  styles.modalSubtitle
                }
              >
                Retail price is used automatically
              </Text>

            </View>


            <TouchableOpacity
              onPress={() =>
                setShowProductModal(false)
              }
              style={
                styles.closeButton
              }
            >

              <MaterialCommunityIcons
                name="close"
                size={22}
                color="#475569"
              />

            </TouchableOpacity>

          </View>


          <View
            style={
              styles.modalSearch
            }
          >

            <MaterialCommunityIcons
              name="magnify"
              size={21}
              color="#94A3B8"
            />

            <TextInput
              value={productSearch}
              onChangeText={
                setProductSearch
              }
              placeholder="Search product..."
              placeholderTextColor="#94A3B8"
              style={
                styles.modalSearchInput
              }
              autoFocus
            />

          </View>


          <FlatProductList
            products={
              filteredProducts
            }
            onSelect={
              addProduct
            }
          />

        </View>

      </View>

    </Modal>

  );


  // ===================================================
  // CUSTOMER MODAL
  // ===================================================

  const CustomerModal = () => (

    <Modal
      visible={
        showCustomerModal
      }
      animationType="slide"
      transparent
      onRequestClose={() =>
        setShowCustomerModal(false)
      }
    >

      <View
        style={
          styles.modalOverlay
        }
      >

        <View
          style={
            styles.customerModal
          }
        >

          <View
            style={
              styles.modalHeader
            }
          >

            <View>

              <Text
                style={
                  styles.modalTitle
                }
              >
                Select Customer
              </Text>

              <Text
                style={
                  styles.modalSubtitle
                }
              >
                Previous invoice customers
              </Text>

            </View>


            <TouchableOpacity
              onPress={() =>
                setShowCustomerModal(false)
              }
              style={
                styles.closeButton
              }
            >

              <MaterialCommunityIcons
                name="close"
                size={22}
                color="#475569"
              />

            </TouchableOpacity>

          </View>


          <ScrollView
            showsVerticalScrollIndicator={false}
          >

            {customers.length === 0 ? (

              <View
                style={
                  styles.emptyModal
                }
              >

                <MaterialCommunityIcons
                  name="account-off-outline"
                  size={45}
                  color="#CBD5E1"
                />

                <Text
                  style={
                    styles.emptyModalText
                  }
                >
                  No previous customers
                </Text>

              </View>

            ) : (

              customers.map(
                (customer, index) => (

                  <TouchableOpacity
                    key={`${customer.customer}-${index}`}
                    style={
                      styles.customerRow
                    }
                    onPress={() => {

                      setCustomerName(
                        customer.customer ||
                        ""
                      );

                      setCustomerMobile(
                        customer.mobileno ||
                        ""
                      );

                      setShowCustomerModal(
                        false
                      );

                    }}
                  >

                    <View
                      style={
                        styles.customerAvatar
                      }
                    >

                      <MaterialCommunityIcons
                        name="account"
                        size={21}
                        color="#4F46E5"
                      />

                    </View>


                    <View
                      style={
                        styles.customerInfo
                      }
                    >

                      <Text
                        style={
                          styles.customerName
                        }
                      >
                        {customer.customer}
                      </Text>

                      <Text
                        style={
                          styles.customerPhone
                        }
                      >
                        {customer.mobileno ||
                          "No phone"}
                      </Text>

                    </View>


                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={22}
                      color="#94A3B8"
                    />

                  </TouchableOpacity>

                )
              )

            )}

          </ScrollView>

        </View>

      </View>

    </Modal>

  );


  // ===================================================
  // PAYMENT MODAL
  // ===================================================

  const PaymentModal = () => (

    <Modal
      visible={
        showPaymentModal
      }
      transparent
      animationType="fade"
      onRequestClose={() =>
        setShowPaymentModal(false)
      }
    >

      <View
        style={
          styles.modalOverlay
        }
      >

        <View
          style={
            styles.paymentModal
          }
        >

          <Text
            style={
              styles.modalTitle
            }
          >
            Payment Type
          </Text>


          {paymentModes.map(
            mode => (

              <TouchableOpacity
                key={mode}
                style={
                  styles.paymentOption
                }
                onPress={() => {

                  setPaymentMode(
                    mode
                  );

                  setShowPaymentModal(
                    false
                  );

                }}
              >

                <View
                  style={
                    styles.paymentIcon
                  }
                >

                  <MaterialCommunityIcons
                    name={
                      mode === "Cash"
                        ? "cash"
                        : mode === "UPI"
                        ? "cellphone"
                        : mode === "Card"
                        ? "credit-card-outline"
                        : "account-clock-outline"
                    }
                    size={20}
                    color="#4F46E5"
                  />

                </View>


                <Text
                  style={
                    styles.paymentText
                  }
                >
                  {mode}
                </Text>


                {paymentMode ===
                  mode && (

                  <MaterialCommunityIcons
                    name="check-circle"
                    size={21}
                    color="#4F46E5"
                  />

                )}

              </TouchableOpacity>

            )
          )}

        </View>

      </View>

    </Modal>

  );


  // ===================================================
  // PRODUCT ITEM
  // ===================================================

  const renderInvoiceItem = (
    item: InvoiceItem
  ) => (

    <View
      key={item.id}
      style={
        styles.invoiceItem
      }
    >

      <View
        style={
          styles.itemTop
        }
      >

        <View
          style={
            styles.itemImageContainer
          }
        >

          {item.productimage ? (

            <Image
              source={{
                uri:
                  item.productimage,
              }}
              style={
                styles.itemImage
              }
            />

          ) : (

            <MaterialCommunityIcons
              name="package-variant"
              size={28}
              color="#6366F1"
            />

          )}

        </View>


        <View
          style={
            styles.itemMain
          }
        >

          <Text
            style={
              styles.itemName
            }
            numberOfLines={1}
          >
            {item.product}
          </Text>

          <Text
            style={
              styles.itemCode
            }
          >
            Code: {item.productcode || "-"}
          </Text>

        </View>


        <TouchableOpacity
          onPress={() =>
            removeItem(item.id)
          }
          style={
            styles.deleteItemButton
          }
        >

          <MaterialCommunityIcons
            name="delete-outline"
            size={21}
            color="#DC2626"
          />

        </TouchableOpacity>

      </View>


      {/* QUANTITY / RATE / UNIT */}

      <View
        style={
          styles.itemInputs
        }
      >

        <View
          style={
            styles.smallField
          }
        >

          <Text
            style={
              styles.fieldLabel
            }
          >
            Quantity
          </Text>

          <TextInput
            value={String(
              item.qty
            )}
            onChangeText={value =>
              updateItem(
                item.id,
                "qty",
                value
              )
            }
            keyboardType="decimal-pad"
            style={
              styles.smallInput
            }
          />

        </View>


        <View
          style={
            styles.smallField
          }
        >

          <Text
            style={
              styles.fieldLabel
            }
          >
            Rate
          </Text>

          <TextInput
            value={String(
              item.rate
            )}
            onChangeText={value =>
              updateItem(
                item.id,
                "rate",
                value
              )
            }
            keyboardType="decimal-pad"
            style={
              styles.smallInput
            }
          />

        </View>


        <View
          style={
            styles.unitField
          }
        >

          <Text
            style={
              styles.fieldLabel
            }
          >
            Unit
          </Text>

          <Text
            style={
              styles.unitValue
            }
            numberOfLines={1}
          >
            {item.uom ||
              item.unit ||
              "Unit"}
          </Text>

        </View>

      </View>


      {/* DISCOUNT */}

      <View
        style={
          styles.discountRow
        }
      >

        <View
          style={
            styles.discountInputContainer
          }
        >

          <Text
            style={
              styles.fieldLabel
            }
          >
            Discount
          </Text>

          <View
            style={
              styles.discountInputRow
            }
          >

            <Text
              style={
                styles.rupee
              }
            >
              ₹
            </Text>

            <TextInput
              value={String(
                item.discount
              )}
              onChangeText={value =>
                updateItem(
                  item.id,
                  "discount",
                  value
                )
              }
              keyboardType="decimal-pad"
              style={
                styles.discountInput
              }
            />

          </View>

        </View>


        <View
          style={
            styles.itemAmountBox
          }
        >

          <Text
            style={
              styles.fieldLabel
            }
          >
            Amount
          </Text>

          <Text
            style={
              styles.itemAmount
            }
          >
            {money(
              item.totalAmount
            )}
          </Text>

        </View>

      </View>


      {/* GST */}

      {taxEnabled && (

        <View
          style={
            styles.gstRow
          }
        >

          <View
            style={
              styles.gstPill
            }
          >

            <Text
              style={
                styles.gstLabel
              }
            >
              CGST {item.cgstRate}%
            </Text>

            <Text
              style={
                styles.gstValue
              }
            >
              {money(
                item.cgst
              )}
            </Text>

          </View>


          <View
            style={
              styles.gstPill
            }
          >

            <Text
              style={
                styles.gstLabel
              }
            >
              SGST {item.sgstRate}%
            </Text>

            <Text
              style={
                styles.gstValue
              }
            >
              {money(
                item.sgst
              )}
            </Text>

          </View>

        </View>

      )}

    </View>

  );


  // ===================================================
  // SCREEN
  // ===================================================

  return (

    <KeyboardAvoidingView
      style={
        styles.container
      }
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <StatusBar
        backgroundColor="#4F46E5"
        barStyle="light-content"
      />


      {/* HEADER */}

      <View
        style={
          styles.header
        }
      >

        <TouchableOpacity
          onPress={() =>
            router.back()
          }
          style={
            styles.headerBack
          }
        >

          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#FFFFFF"
          />

        </TouchableOpacity>


        <View
          style={
            styles.headerText
          }
        >

          <Text
            style={
              styles.headerSmall
            }
          >
            RETAIL BILLING
          </Text>

          <Text
            style={
              styles.headerTitle
            }
          >
            Create Invoice
          </Text>

        </View>


        <View
          style={
            styles.headerInvoiceBadge
          }
        >

          <Text
            style={
              styles.headerInvoiceLabel
            }
          >
            INVOICE
          </Text>

          <Text
            style={
              styles.headerInvoiceNo
            }
          >
            #{invoiceNo || "..."}
          </Text>

        </View>

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={async () => {

              setRefreshing(true);

              await loadData();

              setRefreshing(false);

            }}
          />
        }
        contentContainerStyle={
          styles.content
        }
      >

        {/* =========================================
            INVOICE DETAILS
        ========================================= */}

        <View
          style={
            styles.card
          }
        >

          <View
            style={
              styles.cardHeader
            }
          >

            <View
              style={
                styles.sectionIcon
              }
            >

              <MaterialCommunityIcons
                name="file-document-outline"
                size={20}
                color="#4F46E5"
              />

            </View>

            <View>

              <Text
                style={
                  styles.cardTitle
                }
              >
                Invoice Details
              </Text>

              <Text
                style={
                  styles.cardSubtitle
                }
              >
                Basic billing information
              </Text>

            </View>

          </View>


          <View
            style={
              styles.twoColumn
            }
          >

            <View
              style={
                styles.halfField
              }
            >

              <Text
                style={
                  styles.inputLabel
                }
              >
                Invoice Number
              </Text>

              <View
                style={
                  styles.readonlyInput
                }
              >

                <MaterialCommunityIcons
                  name="numeric"
                  size={18}
                  color="#4F46E5"
                />

                <Text
                  style={
                    styles.readonlyText
                  }
                >
                  {invoiceNo}
                </Text>

              </View>

            </View>


            <View
              style={
                styles.halfField
              }
            >

              <Text
                style={
                  styles.inputLabel
                }
              >
                Date
              </Text>

              <View
                style={
                  styles.readonlyInput
                }
              >

                <MaterialCommunityIcons
                  name="calendar"
                  size={18}
                  color="#4F46E5"
                />

                <Text
                  style={
                    styles.readonlyText
                  }
                >
                  {invoiceDate}
                </Text>

              </View>

            </View>

          </View>


          <Text
            style={
              styles.inputLabel
            }
          >
            GST Number
            <Text
              style={
                styles.optional
              }
            >
              {" "}Optional
            </Text>
          </Text>

          <View
            style={
              styles.inputContainer
            }
          >

            <MaterialCommunityIcons
              name="card-account-details-outline"
              size={19}
              color="#64748B"
            />

            <TextInput
              value={gstNo}
              onChangeText={
                setGstNo
              }
              placeholder="Enter GST number"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              style={
                styles.input
              }
            />

          </View>


          <View
            style={
              styles.twoColumn
            }
          >

            <View
              style={
                styles.halfField
              }
            >

              <Text
                style={
                  styles.inputLabel
                }
              >
                Payment Type
              </Text>

              <TouchableOpacity
                style={
                  styles.selectInput
                }
                onPress={() =>
                  setShowPaymentModal(
                    true
                  )
                }
              >

                <MaterialCommunityIcons
                  name="cash-multiple"
                  size={19}
                  color="#4F46E5"
                />

                <Text
                  style={
                    styles.selectText
                  }
                >
                  {paymentMode}
                </Text>

                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#94A3B8"
                />

              </TouchableOpacity>

            </View>


            <View
              style={
                styles.halfField
              }
            >

              <Text
                style={
                  styles.inputLabel
                }
              >
                Tax
              </Text>

              <TouchableOpacity
                style={[
                  styles.taxToggle,
                  taxEnabled
                    ? styles.taxOn
                    : styles.taxOff,
                ]}
                onPress={() => {

                  const next =
                    !taxEnabled;

                  setTaxEnabled(
                    next
                  );

                  setItems(
                    current =>
                      current.map(
                        item =>
                          calculateItem(
                            item
                          )
                      )
                  );

                }}
              >

                <MaterialCommunityIcons
                  name={
                    taxEnabled
                      ? "check-circle"
                      : "close-circle-outline"
                  }
                  size={19}
                  color={
                    taxEnabled
                      ? "#15803D"
                      : "#64748B"
                  }
                />

                <Text
                  style={[
                    styles.taxToggleText,
                    taxEnabled
                      ? styles.taxOnText
                      : styles.taxOffText,
                  ]}
                >
                  {taxEnabled
                    ? "GST Enabled"
                    : "No Tax"}
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </View>


        {/* =========================================
            CUSTOMER
        ========================================= */}

        <View
          style={
            styles.card
          }
        >

          <View
            style={
              styles.cardHeader
            }
          >

            <View
              style={
                styles.sectionIcon
              }
            >

              <MaterialCommunityIcons
                name="account-outline"
                size={20}
                color="#4F46E5"
              />

            </View>

            <View
              style={
                styles.customerHeaderText
              }
            >

              <Text
                style={
                  styles.cardTitle
                }
              >
                Customer
              </Text>

              <Text
                style={
                  styles.cardSubtitle
                }
              >
                Customer details for this bill
              </Text>

            </View>


            <TouchableOpacity
              style={
                styles.selectCustomerButton
              }
              onPress={() =>
                setShowCustomerModal(
                  true
                )
              }
            >

              <MaterialCommunityIcons
                name="account-search-outline"
                size={17}
                color="#4F46E5"
              />

              <Text
                style={
                  styles.selectCustomerText
                }
              >
                Select
              </Text>

            </TouchableOpacity>

          </View>


          <Text
            style={
              styles.inputLabel
            }
          >
            Customer Name
          </Text>

          <View
            style={
              styles.inputContainer
            }
          >

            <MaterialCommunityIcons
              name="account"
              size={19}
              color="#64748B"
            />

            <TextInput
              value={
                customerName
              }
              onChangeText={
                setCustomerName
              }
              placeholder="Enter customer name"
              placeholderTextColor="#94A3B8"
              style={
                styles.input
              }
            />

          </View>


          <Text
            style={
              styles.inputLabel
            }
          >
            Phone Number
          </Text>

          <View
            style={
              styles.inputContainer
            }
          >

            <MaterialCommunityIcons
              name="phone-outline"
              size={19}
              color="#64748B"
            />

            <TextInput
              value={
                customerMobile
              }
              onChangeText={
                setCustomerMobile
              }
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={15}
              style={
                styles.input
              }
            />

          </View>

        </View>


        {/* =========================================
            PRODUCTS
        ========================================= */}

        <View
          style={
            styles.card
          }
        >

          <View
            style={
              styles.cardHeader
            }
          >

            <View
              style={
                styles.sectionIcon
              }
            >

              <MaterialCommunityIcons
                name="package-variant"
                size={20}
                color="#4F46E5"
              />

            </View>

            <View
              style={
                styles.customerHeaderText
              }
            >

              <Text
                style={
                  styles.cardTitle
                }
              >
                Products
              </Text>

              <Text
                style={
                  styles.cardSubtitle
                }
              >
                Add retail products to this invoice
              </Text>

            </View>


            <View
              style={
                styles.itemsCountBadge
              }
            >

              <Text
                style={
                  styles.itemsCountText
                }
              >
                {items.length}
              </Text>

            </View>

          </View>


          <TouchableOpacity
            activeOpacity={0.85}
            style={
              styles.addProductButton
            }
            onPress={() =>
              setShowProductModal(
                true
              )
            }
          >

            <View
              style={
                styles.addProductIcon
              }
            >

              <MaterialCommunityIcons
                name="plus"
                size={23}
                color="#FFFFFF"
              />

            </View>

            <View
              style={
                styles.addProductText
              }
            >

              <Text
                style={
                  styles.addProductTitle
                }
              >
                Select Product
              </Text>

              <Text
                style={
                  styles.addProductSubtitle
                }
              >
                Choose from your inventory
              </Text>

            </View>


            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#4F46E5"
            />

          </TouchableOpacity>


          {items.length === 0 ? (

            <View
              style={
                styles.emptyProducts
              }
            >

              <MaterialCommunityIcons
                name="cart-outline"
                size={45}
                color="#CBD5E1"
              />

              <Text
                style={
                  styles.emptyProductsTitle
                }
              >
                No products added
              </Text>

              <Text
                style={
                  styles.emptyProductsText
                }
              >
                Select a product above to start the bill.
              </Text>

            </View>

          ) : (

            <View
              style={
                styles.itemsList
              }
            >

              {items.map(
                renderInvoiceItem
              )}

            </View>

          )}

        </View>


        {/* =========================================
            SUMMARY
        ========================================= */}

        <View
          style={
            styles.summaryCard
          }
        >

          <View
            style={
              styles.summaryHeader
            }
          >

            <MaterialCommunityIcons
              name="receipt-text-outline"
              size={21}
              color="#4F46E5"
            />

            <Text
              style={
                styles.summaryTitle
              }
            >
              Invoice Summary
            </Text>

          </View>


          <SummaryRow
            label="Subtotal"
            value={
              money(subtotal)
            }
          />


          <SummaryRow
            label="Discount"
            value={
              money(discount)
            }
            valueStyle={
              discount > 0
                ? styles.discountValue
                : undefined
            }
          />


          <SummaryRow
            label="Taxable Amount"
            value={
              money(
                taxableAmount
              )
            }
          />


          {taxEnabled && (

            <>

              <SummaryRow
                label="CGST"
                value={
                  money(cgst)
                }
                valueStyle={
                  styles.taxValue
                }
              />

              <SummaryRow
                label="SGST"
                value={
                  money(sgst)
                }
                valueStyle={
                  styles.taxValue
                }
              />

              {igst > 0 && (

                <SummaryRow
                  label="IGST"
                  value={
                    money(igst)
                  }
                  valueStyle={
                    styles.taxValue
                  }
                />

              )}

            </>

          )}


          <View
            style={
              styles.summaryDivider
            }
          />


          <View
            style={
              styles.grandTotalRow
            }
          >

            <Text
              style={
                styles.grandTotalLabel
              }
            >
              Grand Total
            </Text>

            <Text
              style={
                styles.grandTotalValue
              }
            >
              {money(
                grandTotal
              )}
            </Text>

          </View>

        </View>


        {/* =========================================
            SAVE
        ========================================= */}

<View style={styles.bottomButtonRow}>

  {/* SAVE INVOICE */}
  <TouchableOpacity
    activeOpacity={0.88}
    style={[
      styles.saveButton,
      styles.saveButtonHalf,
      { opacity: isSaving ? 0.6 : 1 },
    ]}
    onPress={handleSaveInvoice}
    disabled={isSaving}
  >
    <MaterialCommunityIcons
      name="content-save-check-outline"
      size={21}
      color="#FFFFFF"
    />

    <Text style={styles.saveButtonText}>
      {isSaving ? "SAVING..." : "SAVE & PRINT"}
    </Text>
  </TouchableOpacity>


  {/* VIEW BILL */}
  <TouchableOpacity
    activeOpacity={0.88}
    style={[
      styles.saveButton,
      styles.viewBillButton,
    ]}
    onPress={() => {

      

      router.push({
        pathname:
          "/src/screens/ViewNewBillingScreen",
        
      });
    }}
  >
    <MaterialCommunityIcons
      name="receipt-text-outline"
      size={21}
      color="#4F46E5"
    />

    <Text style={styles.viewBillButtonText}>
      VIEW BILL
    </Text>
  </TouchableOpacity>

</View>
        <View
          style={
            styles.bottomSpace
          }
        />

      </ScrollView>


      <ProductModal />
      <CustomerModal />
      <PaymentModal />

    </KeyboardAvoidingView>

  );

}


// =====================================================
// PRODUCT LIST COMPONENT
// =====================================================

function FlatProductList({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (
    product: Product
  ) => void;
}) {

  return (

    <ScrollView
      style={
        styles.productModalList
      }
      showsVerticalScrollIndicator={
        false
      }
      keyboardShouldPersistTaps="handled"
    >

      {products.length === 0 ? (

        <View
          style={
            styles.emptyModal
          }
        >

          <MaterialCommunityIcons
            name="package-variant-closed"
            size={50}
            color="#CBD5E1"
          />

          <Text
            style={
              styles.emptyModalText
            }
          >
            No products found
          </Text>

        </View>

      ) : (

        products.map(
          product => (

            <TouchableOpacity
              key={
                String(product.id)
              }
              activeOpacity={0.88}
              style={
                styles.productSelectRow
              }
              onPress={() =>
                onSelect(
                  product
                )
              }
            >

              <View
                style={
                  styles.productSelectImageContainer
                }
              >

                {product.productimage ? (

                  <Image
                    source={{
                      uri:
                        product.productimage,
                    }}
                    style={
                      styles.productSelectImage
                    }
                  />

                ) : (

                  <MaterialCommunityIcons
                    name="package-variant"
                    size={27}
                    color="#4F46E5"
                  />

                )}

              </View>


              <View
                style={
                  styles.productSelectInfo
                }
              >

                <Text
                  style={
                    styles.productSelectName
                  }
                  numberOfLines={1}
                >
                  {product.productenglishname ||
                    "Unnamed Product"}
                </Text>


                {!!product.producttamilName && (

                  <Text
                    style={
                      styles.productSelectTamil
                    }
                    numberOfLines={1}
                  >
                    {product.producttamilName}
                  </Text>

                )}


                <View
                  style={
                    styles.productSelectMeta
                  }
                >

                  <Text
                    style={
                      styles.productCode
                    }
                  >
                    #{product.productcode || "-"}
                  </Text>

                  <Text
                    style={
                      styles.productStock
                    }
                  >
                    Stock:{" "}
                    {Number(
                      product.stockquantity || 0
                    )}
                  </Text>

                </View>

              </View>


              <View
                style={
                  styles.productSelectRight
                }
              >

                <Text
                  style={
                    styles.productSelectPrice
                  }
                >
                  {money(
                    Number(
                      product.retail || 0
                    )
                  )}
                </Text>

                <Text
                  style={
                    styles.productSelectUnit
                  }
                >
                  /{" "}
                  {product.uom ||
                    product.unittype ||
                    "Unit"}
                </Text>

                <MaterialCommunityIcons
                  name="plus-circle"
                  size={23}
                  color="#4F46E5"
                  style={{
                    marginTop: 7,
                  }}
                />

              </View>

            </TouchableOpacity>

          )
        )

      )}

    </ScrollView>

  );

}


// =====================================================
// SUMMARY ROW
// =====================================================

function SummaryRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: any;
}) {

  return (

    <View
      style={
        styles.summaryRow
      }
    >

      <Text
        style={
          styles.summaryRowLabel
        }
      >
        {label}
      </Text>

      <Text
        style={[
          styles.summaryRowValue,
          valueStyle,
        ]}
      >
        {value}
      </Text>

    </View>

  );

}


// =====================================================
// STYLES
// =====================================================

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#F8FAFC",
    },

    content: {
      paddingBottom: 30,
    },


    // =================================================
    // HEADER
    // =================================================

    header: {
      backgroundColor: "#4F46E5",

      paddingTop: 50,
      paddingHorizontal: 16,
      paddingBottom: 22,

      flexDirection: "row",
      alignItems: "center",

      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },

    headerBack: {
      width: 43,
      height: 43,

      borderRadius: 13,

      backgroundColor:
        "rgba(255,255,255,0.16)",

      justifyContent: "center",
      alignItems: "center",

      marginRight: 12,
    },

    headerText: {
      flex: 1,
    },

    headerSmall: {
      color: "#C7D2FE",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    headerTitle: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "900",
      marginTop: 2,
    },

    headerInvoiceBadge: {
      alignItems: "flex-end",

      paddingLeft: 8,
    },

    headerInvoiceLabel: {
      color: "#C7D2FE",
      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1,
    },

    headerInvoiceNo: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "900",
      marginTop: 2,
    },


    // =================================================
    // CARD
    // =================================================

    card: {
      backgroundColor: "#FFFFFF",

      marginHorizontal: 14,
      marginTop: 14,

      borderRadius: 19,

      padding: 15,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      elevation: 2,
    },

    cardHeader: {
      flexDirection: "row",
      alignItems: "center",

      marginBottom: 15,
    },

    sectionIcon: {
      width: 40,
      height: 40,

      borderRadius: 12,

      backgroundColor: "#EEF2FF",

      justifyContent: "center",
      alignItems: "center",

      marginRight: 10,
    },

    cardTitle: {
      color: "#0F172A",
      fontSize: 16,
      fontWeight: "900",
    },

    cardSubtitle: {
      color: "#94A3B8",
      fontSize: 10,
      marginTop: 2,
    },

    customerHeaderText: {
      flex: 1,
    },


    // =================================================
    // INPUT
    // =================================================

    inputLabel: {
      color: "#475569",
      fontSize: 10,
      fontWeight: "800",

      marginBottom: 6,
      marginTop: 3,
    },

    optional: {
      color: "#94A3B8",
      fontWeight: "600",
    },

    inputContainer: {
      minHeight: 48,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      borderRadius: 13,

      backgroundColor: "#FFFFFF",

      paddingHorizontal: 12,

      flexDirection: "row",
      alignItems: "center",

      marginBottom: 12,
    },

    input: {
      flex: 1,

      color: "#0F172A",
      fontSize: 13,

      marginLeft: 8,

      paddingVertical: 0,
    },

    twoColumn: {
      flexDirection: "row",
      gap: 10,
    },

    halfField: {
      flex: 1,
    },

    readonlyInput: {
      height: 48,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      borderRadius: 13,

      backgroundColor: "#F8FAFC",

      paddingHorizontal: 11,

      flexDirection: "row",
      alignItems: "center",
    },

    readonlyText: {
      color: "#334155",
      fontSize: 13,
      fontWeight: "800",
      marginLeft: 7,
    },

    selectInput: {
      height: 48,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      borderRadius: 13,

      paddingHorizontal: 11,

      flexDirection: "row",
      alignItems: "center",
    },

    selectText: {
      flex: 1,
      color: "#334155",
      fontSize: 13,
      fontWeight: "800",
      marginLeft: 7,
    },

    taxToggle: {
      height: 48,

      borderRadius: 13,

      paddingHorizontal: 10,

      flexDirection: "row",
      alignItems: "center",

      borderWidth: 1,
    },

    taxOn: {
      backgroundColor: "#F0FDF4",
      borderColor: "#BBF7D0",
    },

    taxOff: {
      backgroundColor: "#F8FAFC",
      borderColor: "#E2E8F0",
    },

    taxToggleText: {
      fontSize: 11,
      fontWeight: "900",
      marginLeft: 6,
    },

    taxOnText: {
      color: "#15803D",
    },

    taxOffText: {
      color: "#64748B",
    },


    // =================================================
    // CUSTOMER
    // =================================================

    selectCustomerButton: {
      flexDirection: "row",
      alignItems: "center",

      backgroundColor: "#EEF2FF",

      paddingHorizontal: 9,
      paddingVertical: 7,

      borderRadius: 9,
    },

    selectCustomerText: {
      color: "#4F46E5",
      fontSize: 10,
      fontWeight: "900",
      marginLeft: 4,
    },


    // =================================================
    // PRODUCTS
    // =================================================

    itemsCountBadge: {
      minWidth: 29,
      height: 29,

      borderRadius: 10,

      backgroundColor: "#EEF2FF",

      justifyContent: "center",
      alignItems: "center",
    },

    itemsCountText: {
      color: "#4F46E5",
      fontSize: 11,
      fontWeight: "900",
    },

    addProductButton: {
      minHeight: 65,

      backgroundColor: "#F8FAFF",

      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: "#A5B4FC",

      borderRadius: 15,

      paddingHorizontal: 11,

      flexDirection: "row",
      alignItems: "center",
    },

    addProductIcon: {
      width: 40,
      height: 40,

      borderRadius: 12,

      backgroundColor: "#4F46E5",

      justifyContent: "center",
      alignItems: "center",
    },

    addProductText: {
      flex: 1,
      marginLeft: 10,
    },

    addProductTitle: {
      color: "#1E293B",
      fontSize: 13,
      fontWeight: "900",
    },

    addProductSubtitle: {
      color: "#94A3B8",
      fontSize: 10,
      marginTop: 2,
    },

    emptyProducts: {
      alignItems: "center",

      paddingVertical: 28,
    },

    emptyProductsTitle: {
      color: "#64748B",
      fontSize: 14,
      fontWeight: "900",
      marginTop: 8,
    },

    emptyProductsText: {
      color: "#94A3B8",
      fontSize: 11,
      textAlign: "center",
      marginTop: 3,
    },

    itemsList: {
      marginTop: 12,
    },


    // =================================================
    // INVOICE ITEM
    // =================================================

    invoiceItem: {
      backgroundColor: "#F8FAFC",

      borderRadius: 15,

      padding: 11,

      marginBottom: 10,

      borderWidth: 1,
      borderColor: "#E2E8F0",
    },

    itemTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    itemImageContainer: {
      width: 49,
      height: 49,

      borderRadius: 12,

      backgroundColor: "#EEF2FF",

      justifyContent: "center",
      alignItems: "center",

      overflow: "hidden",
    },

    itemImage: {
      width: "100%",
      height: "100%",
    },

    itemMain: {
      flex: 1,
      marginLeft: 10,
    },

    itemName: {
      color: "#0F172A",
      fontSize: 14,
      fontWeight: "900",
    },

    itemCode: {
      color: "#94A3B8",
      fontSize: 9,
      marginTop: 2,
    },

    deleteItemButton: {
      width: 34,
      height: 34,

      borderRadius: 10,

      backgroundColor: "#FEF2F2",

      justifyContent: "center",
      alignItems: "center",
    },

    itemInputs: {
      flexDirection: "row",
      alignItems: "flex-end",

      marginTop: 12,

      gap: 8,
    },

    smallField: {
      width: 76,
    },

    unitField: {
      flex: 1,
    },

    fieldLabel: {
      color: "#94A3B8",
      fontSize: 8,
      fontWeight: "800",
      marginBottom: 4,
    },

    smallInput: {
      height: 38,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      borderRadius: 10,

      backgroundColor: "#FFFFFF",

      color: "#0F172A",

      fontSize: 12,
      fontWeight: "800",

      paddingHorizontal: 9,
      paddingVertical: 0,
    },

    unitValue: {
      height: 38,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      borderRadius: 10,

      backgroundColor: "#FFFFFF",

      color: "#475569",

      fontSize: 11,
      fontWeight: "800",

      paddingHorizontal: 9,

      textAlignVertical: "center",
    },

    discountRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",

      marginTop: 10,
    },

    discountInputContainer: {
      width: 110,
    },

    discountInputRow: {
      height: 38,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      borderRadius: 10,

      backgroundColor: "#FFFFFF",

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 8,
    },

    rupee: {
      color: "#64748B",
      fontSize: 12,
      fontWeight: "800",
    },

    discountInput: {
      flex: 1,

      color: "#0F172A",
      fontSize: 12,
      fontWeight: "800",

      paddingVertical: 0,
      paddingHorizontal: 4,
    },

    itemAmountBox: {
      alignItems: "flex-end",
    },

    itemAmount: {
      color: "#4F46E5",
      fontSize: 16,
      fontWeight: "900",
    },

    gstRow: {
      flexDirection: "row",

      marginTop: 10,

      gap: 7,
    },

    gstPill: {
      flex: 1,

      backgroundColor: "#FFFFFF",

      borderRadius: 9,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      paddingHorizontal: 9,
      paddingVertical: 7,

      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    gstLabel: {
      color: "#64748B",
      fontSize: 9,
      fontWeight: "800",
    },

    gstValue: {
      color: "#4F46E5",
      fontSize: 10,
      fontWeight: "900",
    },


    // =================================================
    // SUMMARY
    // =================================================

    summaryCard: {
      backgroundColor: "#FFFFFF",

      marginHorizontal: 14,
      marginTop: 14,

      borderRadius: 19,

      padding: 16,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      elevation: 2,
    },

    summaryHeader: {
      flexDirection: "row",
      alignItems: "center",

      marginBottom: 12,
    },

    summaryTitle: {
      color: "#0F172A",
      fontSize: 16,
      fontWeight: "900",
      marginLeft: 8,
    },

    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",

      paddingVertical: 6,
    },

    summaryRowLabel: {
      color: "#64748B",
      fontSize: 12,
      fontWeight: "700",
    },

    summaryRowValue: {
      color: "#334155",
      fontSize: 12,
      fontWeight: "800",
    },

    discountValue: {
      color: "#DC2626",
    },

    taxValue: {
      color: "#4F46E5",
    },

    summaryDivider: {
      height: 1,

      backgroundColor: "#E2E8F0",

      marginVertical: 9,
    },

    grandTotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    grandTotalLabel: {
      color: "#0F172A",
      fontSize: 16,
      fontWeight: "900",
    },

    grandTotalValue: {
      color: "#4F46E5",
      fontSize: 22,
      fontWeight: "900",
    },


    // =================================================
    // SAVE
    // =================================================

    saveButton: {
      marginHorizontal: 14,
      marginTop: 14,

      minHeight: 55,

      borderRadius: 16,

      backgroundColor: "#4F46E5",

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 16,

      elevation: 3,
    },

    saveButtonText: {
      flex: 1,

      color: "#FFFFFF",

      fontSize: 13,
      fontWeight: "900",

      marginLeft: 9,
    },

    saveButtonAmount: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "900",
    },

    bottomSpace: {
      height: 25,
    },


    // =================================================
    // MODALS
    // =================================================

    modalOverlay: {
      flex: 1,

      backgroundColor:
        "rgba(15,23,42,0.45)",

      justifyContent: "flex-end",
    },

    productModal: {
      height: "88%",

      backgroundColor: "#F8FAFC",

      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,

      paddingTop: 18,
    },

    customerModal: {
      maxHeight: "78%",

      backgroundColor: "#F8FAFC",

      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,

      padding: 18,
    },

    paymentModal: {
      width: "88%",

      backgroundColor: "#FFFFFF",

      borderRadius: 22,

      padding: 18,

      alignSelf: "center",
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",

      paddingHorizontal: 18,
      paddingBottom: 14,
    },

    modalTitle: {
      color: "#0F172A",
      fontSize: 19,
      fontWeight: "900",
    },

    modalSubtitle: {
      color: "#94A3B8",
      fontSize: 10,
      marginTop: 3,
    },

    closeButton: {
      width: 38,
      height: 38,

      borderRadius: 12,

      backgroundColor: "#FFFFFF",

      justifyContent: "center",
      alignItems: "center",
    },

    modalSearch: {
      height: 48,

      backgroundColor: "#FFFFFF",

      marginHorizontal: 18,
      marginBottom: 10,

      borderRadius: 13,

      paddingHorizontal: 12,

      flexDirection: "row",
      alignItems: "center",

      borderWidth: 1,
      borderColor: "#E2E8F0",
    },

    modalSearchInput: {
      flex: 1,

      color: "#0F172A",

      fontSize: 13,

      marginLeft: 8,

      paddingVertical: 0,
    },

    productModalList: {
      paddingHorizontal: 18,
    },

    productSelectRow: {
      backgroundColor: "#FFFFFF",

      borderRadius: 15,

      padding: 10,

      marginBottom: 9,

      flexDirection: "row",
      alignItems: "center",

      borderWidth: 1,
      borderColor: "#E2E8F0",
    },

    productSelectImageContainer: {
      width: 58,
      height: 58,

      borderRadius: 13,

      backgroundColor: "#EEF2FF",

      justifyContent: "center",
      alignItems: "center",

      overflow: "hidden",
    },

    productSelectImage: {
      width: "100%",
      height: "100%",
    },

    productSelectInfo: {
      flex: 1,

      marginLeft: 10,
    },

    productSelectName: {
      color: "#0F172A",
      fontSize: 14,
      fontWeight: "900",
    },

    productSelectTamil: {
      color: "#64748B",
      fontSize: 10,
      marginTop: 2,
    },

    productSelectMeta: {
      flexDirection: "row",
      alignItems: "center",

      marginTop: 6,
    },

    productCode: {
      color: "#4F46E5",
      backgroundColor: "#EEF2FF",

      fontSize: 8,
      fontWeight: "900",

      paddingHorizontal: 6,
      paddingVertical: 3,

      borderRadius: 6,
    },

    productStock: {
      color: "#64748B",
      fontSize: 9,
      fontWeight: "700",
      marginLeft: 6,
    },

    productSelectRight: {
      alignItems: "flex-end",

      marginLeft: 6,
    },

    productSelectPrice: {
      color: "#4F46E5",
      fontSize: 14,
      fontWeight: "900",
    },

    productSelectUnit: {
      color: "#94A3B8",
      fontSize: 8,
      marginTop: 1,
    },

    emptyModal: {
      alignItems: "center",
      paddingVertical: 45,
    },

    emptyModalText: {
      color: "#94A3B8",
      fontSize: 13,
      fontWeight: "800",
      marginTop: 10,
    },


    // =================================================
    // CUSTOMER MODAL
    // =================================================

    customerRow: {
      backgroundColor: "#FFFFFF",

      borderRadius: 14,

      padding: 11,

      marginBottom: 8,

      flexDirection: "row",
      alignItems: "center",

      borderWidth: 1,
      borderColor: "#E2E8F0",
    },

    customerAvatar: {
      width: 43,
      height: 43,

      borderRadius: 13,

      backgroundColor: "#EEF2FF",

      justifyContent: "center",
      alignItems: "center",
    },

    customerInfo: {
      flex: 1,
      marginLeft: 10,
    },

    customerName: {
      color: "#0F172A",
      fontSize: 13,
      fontWeight: "900",
    },

    customerPhone: {
      color: "#64748B",
      fontSize: 10,
      marginTop: 2,
    },


    // =================================================
    // PAYMENT
    // =================================================

    paymentOption: {
      minHeight: 52,

      borderRadius: 13,

      backgroundColor: "#F8FAFC",

      marginTop: 8,

      paddingHorizontal: 10,

      flexDirection: "row",
      alignItems: "center",

      borderWidth: 1,
      borderColor: "#E2E8F0",
    },

    paymentIcon: {
      width: 34,
      height: 34,

      borderRadius: 10,

      backgroundColor: "#EEF2FF",

      justifyContent: "center",
      alignItems: "center",
    },

    paymentText: {
      flex: 1,

      color: "#334155",
      fontSize: 13,
      fontWeight: "800",

      marginLeft: 9,
    },

    bottomButtonRow: {
  marginHorizontal: 14,
  marginTop: 14,

  flexDirection: "row",
  gap: 10,
},

saveButtonHalf: {
  flex: 0.9,
  marginHorizontal: 0,
  marginTop: 0,

  justifyContent: "center",
},

viewBillButton: {
  flex: 1.1,

  marginHorizontal: 0,
  marginTop: 0,

  backgroundColor: "#FFFFFF",

  borderWidth: 1.5,
  borderColor: "#4F46E5",

  justifyContent: "center",
},

viewBillButtonText: {
  color: "#4F46E5",
  fontSize: 12,
  fontWeight: "900",

  marginLeft: 7,
},

viewBillAmount: {
  color: "#4F46E5",
  fontSize: 12,
  fontWeight: "900",

  marginLeft: "auto",
},
  });
