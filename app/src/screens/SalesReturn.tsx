import React,
{
  useState,useEffect
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import {
  TextInput,
  Card,
  Menu,
} from 'react-native-paper';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import styles
from "../style/SalesReturnStyle";

import {
  getDB,
  saveSalesReturn,
  getLedgers,
} from '../database/sqlite';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {
  useRouter,
} from 'expo-router';

const createEmptySalesReturnItem = () => ({
  id: Date.now().toString() + Math.random().toString(36).slice(2),
  productcode: '',
  producttype: '',
  product: '',
  qty: 1,
  rate: 0,
  stock: '',
  unittype: '',
  uom: '',
  sgst: '',
  cgst: '',
  igst: '',
  weight: '',
  netRate: '',
  mc: '',
  mcTotal: '',
  totalWeight: '',
  isSelected: false,
});

export default function FullBillingScreen() {



 useEffect(() => {

  loadLedgers();
  loadProducts();

}, []);

const [
  productList,
  setProductList,
] = useState([]);


const loadProducts = async () => {

  const db = await getDB();

  const data =
    await db.getAllAsync(
      `SELECT * FROM products`
    );

  console.log(
    "PRODUCT MASTER:",
    data.length
  );

  setProductList(data);
};



const loadLedgers =
  async () => {

  try {

    const data =
      await getLedgers();

    setLedgerList(

      Array.isArray(data)
        ? data
        : []

    );

  } catch (e) {

    console.log(
      '❌ loadLedgers:',
      e
    );
  }
};


const filterProductsByFirstLetter = (
  text
) => {

  console.log(
    "SEARCH TEXT:",
    text
  );

  console.log(
    "PRODUCTS:",
    productList?.length
  );

  const result =
    productList.filter(
      item =>
        item?.productenglishname
          ?.toLowerCase()
          .includes(
            text.toLowerCase()
          )
    );

  console.log(
    "RESULT:",
    result.length
  );

  return result;
};

const [activeIndex,
  setActiveIndex] =
  useState(null);

const [suggestions,
  setSuggestions] =
  useState([]);


const [ledgerMenuVisible,
  setLedgerMenuVisible] =
  useState(false);


  const [
  salesTypeMenuVisible,
  setSalesTypeMenuVisible,
] = useState(false);

const [
  paidTypeMenuVisible,
  setPaidTypeMenuVisible,
] = useState(false);

const [selectedLedger,
  setSelectedLedger] =
  useState('COMMON CASH');

const [ledgerList,
  setLedgerList] =
  useState([]);

  const navigation =
    useNavigation();

  const route =
    useRoute();

const [subTotal, setSubTotal] = useState(0);

  const router =
    useRouter();

  const params =
    route.params || {};

  const isEdit =
    !!params?.id;

  // ================= DATE =================

  const [date,
    setDate] =
    useState(
      new Date()
    );

  const [showDatePicker,
    setShowDatePicker] =
    useState(false);


  const [

  selectedTaxType,

  setSelectedTaxType

] = useState(
  'DOUBLE TAX'
);

  // ================= HEADER =================

  const [invoiceNo,
    setInvoiceNo] =
    useState("");

  const [ledger,
    setLedger] =
    useState(
      "COMMON CASH"
    );

  const [customer,
    setCustomer] =
    useState('');

  const [salesType,
    setSalesType] =
    useState("CASH");

  const [paidType,
    setPaidType] =
    useState("CASH");

  const [stateVal,
    setStateVal] =
    useState(
      " "
    );

  const [city,
    setCity] =
    useState('');


  const [mobileNo, setMobileNo] = useState('');

  // ================= SUMMARY =================

  const [cashDiscount,
    setCashDiscount] =
    useState(0);

  const [discountPercent,
    setDiscountPercent] =
    useState(0);

  const [previousBalance,
    setPreviousBalance] =
    useState(0);

  // ================= EXPAND =================

  const [expandedId,
    setExpandedId] =
    useState(null);

  // ================= ITEMS =================

  const [items,
  setItems] =
  useState([
    {
      id:
        Date.now()
          .toString(),

      productcode: '',

      producttype: '',

      product: '',

      qty: 1,

      rate: 0,

      stock: '',

      unittype: '',

      uom: '',

      sgst: '',

      cgst: '',

      igst: '',

      weight: '',

      netRate: '',

      mc: '',

      mcTotal: '',

      totalWeight: '',
    },
  ]);

  // ================= SAFE ITEMS =================

  const safeItems =
    Array.isArray(items)
      ? items
      : [];

  // ================= AUTO CALCULATION =================

  // SUBTOTAL

  const subtotal =

    safeItems.reduce(

      (sum, item) => {

        const qty =
          Number(
            item.qty
          ) || 0;

        const rate =
          Number(
            item.rate
          ) || 0;

        return (
          sum +
          (qty * rate)
        );

      },

      0
    );

  // ACTUAL AMOUNT

  const actualAmount =
    subtotal;

  // DISCOUNT AMOUNT

  const discountAmount =

    actualAmount *

    (
      Number(
        discountPercent
      ) || 0
    ) / 100;

  // GROSS AMOUNT

  const grossAmount =

    Math.max(

      actualAmount -

      discountAmount -

      (
        Number(
          cashDiscount
        ) || 0
      ),

      0
    );

  // NET AMOUNT

  const netAmount =
    grossAmount;

  // FINAL TOTAL

  const total =

    netAmount +

    (
      Number(
        previousBalance
      ) || 0
    );



  // ================= SAVE =================

const handleSave =
  async () => {

  try {

    // =========================
    // SAFE ITEMS
    // =========================

    const safeItems =

      Array.isArray(items)
        ? items
        : [];

    // =========================
    // VALID ITEMS
    // =========================

    const validItems =

      safeItems.filter(

        i =>

          i?.product?.trim()

      );

    // =========================
    // EMPTY VALIDATION
    // =========================

    if (
      !validItems.length
    ) {

      alert(
        "Add at least one product"
      );

      return;

    }

    // =========================
    // INVALID QTY
    // =========================

    const hasInvalidQty =

      validItems.some(

        i =>

          Number(
            i.qty || 0
          ) <= 0

      );

    if (hasInvalidQty) {

      alert(
        'Enter valid quantity'
      );

      return;

    }

    // =========================
    // CREATE ID
    // =========================

    const id =

      Date.now()
        .toString();

    // =========================
    // HEADER DATA
    // =========================

    const data = {

      id,

      date:

        date.toLocaleDateString(
          'en-GB'
        ),

      invoiceNo:
        String(invoiceNo || '').trim(),

      customer:
        customer || '',

      ledger:
        ledger || '',

      salesType:
        salesType || '',

      paidType:
        paidType || '',

      state:
        stateVal || '',

      city:
        city || '',

      cashDiscount:

        Number(
          cashDiscount || 0
        ),

      actualAmount:

        Number(
          actualAmount || 0
        ),

      discountPercent:

        Number(
          discountPercent || 0
        ),

      grossAmount:

        Number(
          grossAmount || 0
        ),

      netAmount:

        Number(
          netAmount || 0
        ),

      previousBalance:

        Number(
          previousBalance || 0
        ),

      total:

        Number(
          total || 0
        ),

      createdAt:
        new Date()
          .toISOString(),

    };

    // =========================
    // CLEAN ITEMS
    // =========================

    const cleanItems =

      validItems.map(
        item => ({

          id:

            Date.now()
              .toString() +

            Math.random(),

          salesReturnId:
            id,

          product:
            item.product || '',

          qty:

            Number(
              item.qty || 0
            ),

          rate:

            Number(
              item.rate || 0
            ),

          amount:

            Number(
              item.amount ||

              (
                Number(
                  item.qty || 0
                ) *

                Number(
                  item.rate || 0
                )

              )

            ),

          batch:
            item.batch || '',

          unit:
            item.unit || '',

          uom:
            item.uom || '',

          weight:
            item.weight || '',

          netRate:

            Number(
              item.netRate || 0
            ),

          sgst:

            Number(
              item.sgst || 0
            ),

          cgst:

            Number(
              item.cgst || 0
            ),

          igst:

            Number(
              item.igst || 0
            ),

        })
      );

    console.log(
      "📦 Saving:",
      data,
      cleanItems
    );

    // =========================
    // SAVE
    // =========================

    const res =

      await saveSalesReturn(
        data,
        cleanItems
      );

    // =========================
    // FAILED
    // =========================

    if (!res) {

      alert(
        "Save failed"
      );

      return;

    }

    // =========================
    // SUCCESS
    // =========================

    alert(
      'Sales Return Saved'
    );

    router.push({

      pathname:
        "/src/screens/ViewSalesReturn",

      params: {
        id
      }

    });

  } catch (e) {

    console.log(
      '❌ handleSave:',
      e
    );

    alert(
      'Failed to save'
    );

  }

};

  // ================= ADD ROW =================

 const addRow = () => {

  setItems([
    ...safeItems,

    {
      id:
        Date.now()
          .toString(),

      productcode: '',

      producttype: '',

      product: '',

      qty: 1,

      rate: 0,

      stock: '',

      unittype: '',

      uom: '',

      sgst: '',

      cgst: '',

      igst: '',

      weight: '',

      netRate: '',

      mc: '',

      mcTotal: '',

      totalWeight: '',
    },
  ]);

};

  // ================= UPDATE ITEM =================

const updateItem = (
  index,
  key,
  value,
) => {
  const newItems = [...safeItems];

  newItems[index] = {
    ...newItems[index],
    [key]: value,
  };

  setItems(newItems);
};
  // ================= REMOVE =================

  const removeItem =
    id => {

    if (
      safeItems.length === 1
    ) return;

    setItems(

      safeItems.filter(
        item =>
          item.id !== id
      )

    );

  };

  // ================= RESET =================

 const handleReset =
  () => {

  setInvoiceNo('');

  setCustomer('');
  setMobileNo('');
  setStateVal('');
  setCity('');

  setLedger(
    'COMMON CASH'
  );

  setSalesType('RETAIL');
  setPaidType('CASH');
  setCashDiscount(0);

  setDiscountPercent(0);

  setPreviousBalance(0);

  setItems([
    {
      id:
        Date.now()
          .toString(),

      productcode: '',

      producttype: '',

      product: '',

      qty: 1,

      rate: 0,

      stock: '',

      unittype: '',

      uom: '',

      sgst: '',

      cgst: '',

      igst: '',

      weight: '',

      netRate: '',

      mc: '',

      mcTotal: '',

      totalWeight: '',
    },
  ]);

};

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          '#f4f6f8',
      }}>
      <StatusBar
        backgroundColor="#203a43"
        barStyle="light-content"
      />

      {/* HEADER */}
<LinearGradient
  colors={["#4F46E5", "#6366F1"]}
  style={{
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  }}
>
  <SafeAreaView>

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left Side */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor:
              "rgba(255,255,255,0.15)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text
          style={{
            color: "#FFF",
            fontSize: 22,
            fontWeight: "800",
            marginLeft: 12,
          }}
        >
          Sales Return
        </Text>
      </View>

     
    </View>

    {/* Subtitle */}

    <Text
      style={{
        color: "rgba(255,255,255,0.8)",
        fontSize: 13,
        marginTop: 8,
        marginLeft: 52,
      }}
    >
      Create and manage sales returns
    </Text>

  </SafeAreaView>
</LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled">



        {/* DETAILS */}



        <Card style={styles.card}>
         <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  }}
>
  <MaterialCommunityIcons
    name="clipboard-text"
    size={22}
    color="#4F46E5"
  />

  <Text
    style={{
      fontSize: 20,
      fontWeight: "800",
      color: "#111827",
      marginLeft: 8,
    }}
  >
    Sales Return
  </Text>
</View>

<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  }}
>
  {/* DATE */}

  <TouchableOpacity
    style={{
      width: "48%",
    }}
    onPress={() =>
      setShowDatePicker(true)
    }
  >
    <View
      style={{
        backgroundColor: "#EEF2FF",
        borderRadius: 16,
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="calendar"
          size={16}
          color="#4F46E5"
        />

        <Text
          style={{
            marginLeft: 6,
            fontSize: 11,
            color: "#4F46E5",
            fontWeight: "700",
          }}
        >
          DATE
        </Text>
      </View>

      <Text
        style={{
          marginTop: 4,
          fontSize: 15,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {date.toLocaleDateString("en-GB")}
      </Text>
    </View>
  </TouchableOpacity>

  {/* INVOICE */}

<View
  style={{
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    marginRight: 40,
    borderColor: "#C7D2FE",
    marginBottom: 10,
  }}
>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <MaterialCommunityIcons
      name="file-document-outline"
      size={16}
      color="#4F46E5"
    />

    <Text
      style={{
        marginLeft: 10,
        fontSize: 10,
        fontWeight: "500",
        color: "#4F46E5",
      }}
    >
      INVOICE NO
    </Text>
  </View>


   <TextInput
  mode="flat"
  value={invoiceNo}
  placeholder="Search Invoice..."
  keyboardType="numeric"
  underlineColor="transparent"
  activeUnderlineColor="transparent"

  onChangeText={async (value) => {

    // =================================================
    // SET INPUT
    // =================================================

    setInvoiceNo(value);

    const searchValue = String(value || "").trim();

    // =================================================
    // EMPTY INPUT
    // =================================================

    if (!searchValue) {

      setItems([createEmptySalesReturnItem()]);

      setCustomer("");
      setMobileNo("");
      setLedger("COMMON CASH");
      setStateVal("");
      setCity("");
      setSalesType("RETAIL");
      setPaidType("CASH");
      setCashDiscount(0);
      setDiscountPercent(0);
      setPreviousBalance(0);

      return;
    }

    try {

      const db = await getDB();

      // =================================================
      // INVOICE NUMBER
      // =================================================

      // newinvoice.invoiceNo is declared as TEXT.
      // Keep the entered value as a string for an exact lookup.
      const invoiceNumber = searchValue;

      // =================================================
      // GET INVOICE
      // =================================================

      const invoice =
        await db.getFirstAsync(
          `
          SELECT *
          FROM newinvoice
          WHERE invoiceNo = ?
          LIMIT 1
          `,
          [String(invoiceNumber)]
        );

      console.log(
        "📦 INVOICE:",
        invoice
      );

      // =================================================
      // INVOICE NOT FOUND
      // =================================================

      if (!invoice) {

        console.log(
          "❌ INVOICE NOT FOUND:",
          invoiceNumber
        );

        setItems([createEmptySalesReturnItem()]);
        setCustomer("");
        setMobileNo("");
        setLedger("COMMON CASH");
        setStateVal("");
        setCity("");
        setSalesType("RETAIL");
        setPaidType("CASH");
        setCashDiscount(0);
        setPreviousBalance(0);

        return;
      }

      // =================================================
      // HEADER DETAILS
      // =================================================

      // -------------------------------------------------
      // CUSTOMER DETAILS
      // newinvoice schema columns:
      // customerName, customerMobile, billType, paymentMode,
      // discount, balanceAmount.
      // -------------------------------------------------

      setCustomer(
        String(invoice.customerName ?? "")
      );

      const mobile = String(
        invoice.customerMobile ?? ""
      )
        .replace(/^\+91\s*/, "")
        .trim();

      setMobileNo(mobile);

      // `ledger`, `state`, and `city` are not columns
      // in the supplied newinvoice table.
      // Keep the screen defaults until customer-master
      // lookup is connected using invoice.customerId.
      setLedger("COMMON CASH");
      setStateVal("");
      setCity("");

      // -------------------------------------------------
      // SALES TYPE
      // -------------------------------------------------

      setSalesType(
        String(invoice.billType ?? "RETAIL")
      );

      // -------------------------------------------------
      // PAYMENT TYPE
      // -------------------------------------------------

      setPaidType(
        String(invoice.paymentMode ?? "CASH")
      );

      // -------------------------------------------------
      // CASH DISCOUNT
      // -------------------------------------------------

      setCashDiscount(
        Number(invoice.discount ?? 0)
      );

      // -------------------------------------------------
      // BALANCE
      // NOTE: balanceAmount is the invoice's outstanding
      // amount in the supplied schema. It is mapped here
      // to the existing Previous Balance field to preserve
      // the current screen calculation.
      // -------------------------------------------------

      setPreviousBalance(
        Number(invoice.balanceAmount ?? 0)
      );

      // =================================================
      // LOAD INVOICE ITEMS BY invoiceId
      // =================================================

      let invoiceItems =
        await db.getAllAsync(
          `
          SELECT *
          FROM newinvoice_items
          WHERE invoiceId = ?
          `,
          [
            String(
              invoice.id
            )
          ]
        );

      console.log(
        "📦 ITEMS BY ID:",
        invoiceItems
      );

      // =================================================
      // FALLBACK
      // =================================================

      if (
        !Array.isArray(invoiceItems) ||
        invoiceItems.length === 0
      ) {

        console.log(
          "⚠️ ITEMS NOT FOUND BY ID"
        );

        invoiceItems =
          await db.getAllAsync(
            `
            SELECT *
            FROM invoice_items
            WHERE invoiceId = ?
            `,
            [
              String(
                invoice.invoiceNo
              )
            ]
          );

        console.log(
          "📦 ITEMS BY INVOICE NO:",
          invoiceItems
        );
      }

      // =================================================
      // NO ITEMS
      // =================================================

      if (
        !Array.isArray(invoiceItems) ||
        invoiceItems.length === 0
      ) {

        console.log(
          "❌ NO ITEMS FOUND FOR INVOICE:",
          invoiceNumber
        );

        setItems([createEmptySalesReturnItem()]);

        return;
      }

      // =================================================
      // FORMAT ITEMS
      // =================================================

      // Load Product Master once. Invoice item rows may not contain
      // producttype, so use product code/name to retrieve it.
      const productMasterRows = await db.getAllAsync(
        `SELECT * FROM products`
      );

      const normalise = (value: unknown) =>
        String(value ?? "").trim().toLowerCase();

      const formattedItems = invoiceItems.map((item: any, index: number) => {
        console.log("🔎 RAW INVOICE ITEM:", item);

        const productName = String(
          item?.product ??
          item?.productenglishname ??
          item?.productName ??
          item?.productname ??
          ""
        ).trim();

        const productCode = String(
          item?.productcode ??
          item?.productCode ??
          item?.code ??
          ""
        ).trim();

        // Match by product code first, then by English product name.
        const masterProduct =
          (productCode
            ? productMasterRows.find((product: any) =>
                normalise(product?.productcode ?? product?.productCode ?? product?.code) ===
                normalise(productCode)
              )
            : undefined) ??
          (productName
            ? productMasterRows.find((product: any) =>
                normalise(
                  product?.productenglishname ??
                  product?.productName ??
                  product?.productname
                ) === normalise(productName)
              )
            : undefined);

        const finalProductType = String(
          item?.producttype ??
          item?.productType ??
          item?.product_type ??
          masterProduct?.producttype ??
          masterProduct?.productType ??
          masterProduct?.product_type ??
          ""
        ).trim();

        console.log("🔍 PRODUCT TYPE MATCH:", {
          productName,
          productCode,
          invoiceProductType:
            item?.producttype ?? item?.productType ?? item?.product_type,
          masterProductType:
            masterProduct?.producttype ??
            masterProduct?.productType ??
            masterProduct?.product_type,
          finalProductType,
          matchedProductId: masterProduct?.id,
        });

        return {
          id: String(item?.id || `${invoice.id}_${index}`),

          product: productName,

          productcode:
            productCode ||
            String(
              masterProduct?.productcode ??
              masterProduct?.productCode ??
              masterProduct?.code ??
              ""
            ),

          // Product Type from invoice item, or Product Master fallback.
          producttype: finalProductType,

          qty: Number(item?.qty || 0),

          rate: Number(
            item?.rate ??
            masterProduct?.retail ??
            0
          ),

          amount: Number(
            item?.amount ||
            (
              Number(item?.qty || 0) *
              Number(item?.rate ?? masterProduct?.retail ?? 0)
            )
          ),

          stock: Number(
            item?.stock ??
            item?.stockquantity ??
            masterProduct?.stockquantity ??
            0
          ),

          uom: String(
            item?.uom ??
            item?.unit ??
            masterProduct?.uom ??
            ""
          ),

          weight: String(item?.weight ?? ""),

          netRate: Number(
            item?.netRate ??
            item?.rate ??
            0
          ),

          mc: item?.mc ?? "",
          mcTotal: item?.mcTotal ?? "",
          totalWeight: item?.totalWeight ?? "",

          sgst: Number(item?.sgst || 0),
          cgst: Number(item?.cgst || 0),
          igst: Number(item?.igst || 0),

          isSelected: false,
        };
      });

console.log(
  "===================================="
);

console.log(
  "✅ FORMATTED INVOICE ITEMS:",
  formattedItems
);

console.log(
  "PRODUCT NAMES:",
  formattedItems.map(
    item => item.product
  )
);

console.log(
  "===================================="
);

setItems(formattedItems);

      // =================================================
      // LOG
      // =================================================

      console.log(
        "===================================="
      );

      console.log(
        "✅ INVOICE LOADED"
      );

      console.log(
        "Invoice No:",
        invoice.invoiceNo
      );

      console.log(
        "Invoice ID:",
        invoice.id
      );

      console.log(
        "Customer:",
        invoice.customerName
      );

      console.log(
        "Items:",
        formattedItems
      );

      console.log(
        "===================================="
      );

      // =================================================
      // SET ITEMS
      // =================================================

      setItems(
        formattedItems
      );

    } catch (error) {

      console.log(
        "===================================="
      );

      console.log(
        "❌ LOAD INVOICE ERROR"
      );

      console.log(
        "MESSAGE:",
        error?.message
      );

      console.log(
        "ERROR:",
        error
      );

      console.log(
        "===================================="
      );

    }

  }}

  style={{
    backgroundColor: "transparent",
    height: 34,
  }}

  contentStyle={{
    padding: 0,
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  }}
/>

</View>
</View>

<View style={{ marginBottom: 12 }}>
  <Menu
    visible={ledgerMenuVisible}
    onDismiss={() =>
      setLedgerMenuVisible(false)
    }
    anchor={
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          setLedgerMenuVisible(true)
        }
      >
        <View
          style={{
            backgroundColor: "#EEF2FF",
            borderRadius: 16,
            padding: 12,
            borderWidth: 1,
            borderColor: "#C7D2FE",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <MaterialCommunityIcons
                name="account-cash"
                size={18}
                color="#4F46E5"
              />

              <View
                style={{
                  marginLeft: 8,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: "#4F46E5",
                    fontWeight: "700",
                  }}
                >
                  LEDGER
                </Text>

                <Text
                  numberOfLines={1}
                  style={{
                    marginTop: 2,
                    fontSize: 15,
                    fontWeight: "800",
                    color: "#111827",
                  }}
                >
                  {ledger || "Select Ledger"}
                </Text>
              </View>
            </View>

            <MaterialCommunityIcons
              name="chevron-down"
              size={22}
              color="#4F46E5"
            />
          </View>
        </View>
      </TouchableOpacity>
    }
  >
    {ledgerList.map(item => (
      <Menu.Item
        key={item.id}
        title={item.nameEnglish}
        onPress={() => {
          setLedger(item.nameEnglish);
          setLedgerMenuVisible(false);
        }}
      />
    ))}

    <Menu.Item
      title="+ Add Ledger"
      onPress={() => {
        setLedgerMenuVisible(false);
        router.push(
          "/src/screens/LedgerMaster"
        );
      }}
    />
  </Menu>
</View>


  {/* SALES TYPE */}

  <Menu
    visible={salesTypeMenuVisible}
    onDismiss={() =>
      setSalesTypeMenuVisible(false)
    }
    anchor={
      <TouchableOpacity
        style={{ width: "100%" }}
        activeOpacity={0.9}
        onPress={() =>
          setSalesTypeMenuVisible(true)
        }
      >
        <View
          style={{
            backgroundColor: "#FEF3C7",
            borderRadius: 12,
            minHeight: 60,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: "#FCD34D",
            justifyContent: "center",
            marginBottom:10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              
            }}
          >
            <MaterialCommunityIcons
              name="cart-outline"
              size={14}
              color="#D97706"
            />

            <Text
              style={{
                marginLeft: 5,
                fontSize: 9,
                color: "#D97706",
                fontWeight: "700",
              }}
            >
              SALES TYPE
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginTop: 3,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: "800",
                color: "#111827",
              }}
            >
              {salesType ||
                "Select Type"}
            </Text>

            <MaterialCommunityIcons
              name="chevron-down"
              size={16}
              color="#D97706"
            />
          </View>
        </View>
      </TouchableOpacity>
    }
  >
    <Menu.Item
      title="RETAIL"
      onPress={() => {
        setSalesType("RETAIL");
        setSalesTypeMenuVisible(
          false
        );
      }}
    />

    <Menu.Item
      title="WHOLESALE"
      onPress={() => {
        setSalesType(
          "WHOLESALE"
        );
        setSalesTypeMenuVisible(
          false
        );
      }}
    />
  </Menu>

 



 {/* PAYMENT TYPE */}

  <Menu
    visible={paidTypeMenuVisible}
    onDismiss={() =>
      setPaidTypeMenuVisible(false)
    }
    anchor={
      <TouchableOpacity
        style={{ width: "100%" }}
        activeOpacity={0.9}
        onPress={() =>
          setPaidTypeMenuVisible(true)
        }
      >
        <View
          style={{
            backgroundColor: "#DBEAFE",
            borderRadius: 12,
            minHeight: 60,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: "#BFDBFE",
            justifyContent: "center",
            marginBottom:10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="cash-multiple"
              size={14}
              color="#2563EB"
            />

            <Text
              style={{
                marginLeft: 5,
                fontSize: 9,
                color: "#2563EB",
                fontWeight: "700",
              }}
            >
              PAYMENT TYPE
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginTop: 3,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: "800",
                color: "#111827",
              }}
            >
              {paidType ||
                "Select Payment"}
            </Text>

            <MaterialCommunityIcons
              name="chevron-down"
              size={16}
              color="#2563EB"
            />
          </View>
        </View>
      </TouchableOpacity>
    }
  >
    <Menu.Item
      title="CASH"
      onPress={() => {
        setPaidType("CASH");
        setPaidTypeMenuVisible(
          false
        );
      }}
    />

    <Menu.Item
      title="UPI"
      onPress={() => {
        setPaidType("UPI");
        setPaidTypeMenuVisible(
          false
        );
      }}
    />

    <Menu.Item
      title="CARD"
      onPress={() => {
        setPaidType("CARD");
        setPaidTypeMenuVisible(
          false
        );
      }}
    />

    <Menu.Item
      title="CREDIT"
      onPress={() => {
        setPaidType("CREDIT");
        setPaidTypeMenuVisible(
          false
        );
      }}
    />
  </Menu>
<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  }}
>
  {/* CUSTOMER */}

  <View
    style={{
      width: "48%",
      backgroundColor: "#EEF2FF",
      borderRadius: 16,
      padding: 10,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="account"
        size={16}
        color="#4F46E5"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          color: "#4F46E5",
          fontWeight: "700",
        }}
      >
        CUSTOMER
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={customer}
      onChangeText={setCustomer}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 34,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 15,
        fontWeight: "700",
      }}
    />
  </View>

  {/* MOBILE */}

  <View
    style={{
      width: "48%",
      backgroundColor: "#DCFCE7",
      borderRadius: 16,
      padding: 10,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="phone"
        size={16}
        color="#16A34A"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          color: "#16A34A",
          fontWeight: "700",
        }}
      >
        MOBILE
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={mobileNo}
      onChangeText={setMobileNo}
      keyboardType="phone-pad"
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 34,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 15,
        fontWeight: "700",
      }}
    />
  </View>
</View>



<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  }}
>
  {/* STATE */}

  <View
    style={{
      width: "48%",
      backgroundColor: "#F3E8FF",
      borderRadius: 16,
      padding: 10,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="map-marker-radius"
        size={16}
        color="#7C3AED"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          color: "#7C3AED",
          fontWeight: "700",
        }}
      >
        STATE
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={stateVal}
      onChangeText={setStateVal}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 34,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 15,
        fontWeight: "700",
      }}
    />
  </View>

  {/* CITY */}

  <View
    style={{
      width: "48%",
      backgroundColor: "#ECFDF5",
      borderRadius: 16,
      padding: 10,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="city"
        size={16}
        color="#059669"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          color: "#059669",
          fontWeight: "700",
        }}
      >
        CITY
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={city}
      onChangeText={setCity}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 20,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 15,
        fontWeight: "700",
      }}
    />
  </View>
</View>


          
        </Card>

 

      {/* PRODUCTS */}
{items.map((item, index) => {
  const amount =
    (Number(item.qty) || 0) *
    (Number(item.rate) || 0);

  const isOpen = expandedId === item.id;

  return (

    
    <View key={item.id} style={styles.productCard}>
      <Text style={styles.sectionTitle}>Product Details</Text>

<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  }}
>

  {/* RETURN CHECKBOX */}

  <TouchableOpacity
    onPress={() => {

      const updatedItems =
        [...items];

      updatedItems[index] = {

        ...updatedItems[index],

        isSelected:
          !updatedItems[index]
            ?.isSelected,

      };

      setItems(
        updatedItems
      );

    }}
    style={{
      marginRight: 10,
      justifyContent: "center",
      alignItems: "center",
    }}
  >

    <MaterialCommunityIcons
      name={
        item?.isSelected
          ? "checkbox-marked"
          : "checkbox-blank-outline"
      }
      size={28}
      color={
        item?.isSelected
          ? "#10B981"
          : "#9CA3AF"
      }
    />

  </TouchableOpacity>

  {/* PRODUCT DETAILS */}

  <View
    style={{
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  >

    {/* PRODUCT TYPE */}

    <View
      style={{
        flex: 1,
        backgroundColor: "#FEF3C7",
        borderRadius: 12,
        padding: 10,
        marginRight: 6,
        borderWidth: 1,
        borderColor: "#FCD34D",
      }}
    >
      <Text
        style={{
          fontSize: 9,
          color: "#D97706",
          fontWeight: "700",
        }}
      >
        PRODUCT TYPE
      </Text>

      <Text
        numberOfLines={1}
        style={{
          marginTop: 3,
          fontSize: 14,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {String(item.producttype ?? "").trim() || "Not assigned"}
      </Text>
    </View>

    {/* PRODUCT CODE */}

    <View
      style={{
        flex: 1,
        backgroundColor: "#DBEAFE",
        borderRadius: 12,
        padding: 10,
        marginLeft: 6,
        borderWidth: 1,
        borderColor: "#BFDBFE",
      }}
    >
      <Text
        style={{
          fontSize: 9,
          color: "#2563EB",
          fontWeight: "700",
        }}
      >
        PRODUCT CODE
      </Text>

      <Text
        numberOfLines={1}
        style={{
          marginTop: 3,
          fontSize: 14,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {item.productcode || "-"}
      </Text>
    </View>

  </View>

</View>

<View
  style={{
    position: "relative",
    zIndex:
      activeIndex === index
        ? 99999
        : 1,
    elevation:
      activeIndex === index
        ? 99999
        : 1,
    marginBottom: 10,
  }}
>
  {/* PRODUCT SEARCH CARD */}

  <View
    style={{
      backgroundColor: "#EEF2FF",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#C7D2FE",
      paddingHorizontal: 12,
      paddingVertical: 8,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="package-variant"
        size={16}
        color="#4F46E5"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          fontWeight: "700",
          color: "#4F46E5",
        }}
      >
        PRODUCT
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={item?.product ?? ""}
      placeholder="Search Product..."
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 34,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 15,
        fontWeight: "700",
      }}
      onFocus={() => {
        setActiveIndex(index);

        const result =
          filterProductsByFirstLetter(
            item?.product || ""
          );

        setSuggestions(
          Array.isArray(result)
            ? result
            : []
        );
      }}
      onChangeText={value => {
        updateItem(
          index,
          "product",
          value
        );

        const result =
          filterProductsByFirstLetter(
            value
          );

        setSuggestions(
          Array.isArray(result)
            ? result
            : []
        );
      }}
      right={
        <TextInput.Icon
          icon="magnify"
        />
      }
    />
  </View>

  {/* DROPDOWN */}

  {activeIndex === index &&
    suggestions?.length > 0 && (
      <View
        style={{
          position: "absolute",
          top: "100%",
          marginTop: 4,
          left: 0,
          right: 0,
          backgroundColor: "#FFF",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          elevation: 20,
          zIndex: 99999,
          maxHeight: 250,
          overflow: "hidden",
        }}
      >
        <ScrollView
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        >
          {suggestions.map(
            product => (
              <TouchableOpacity
                key={
                  product?.id
                }
                activeOpacity={
                  0.8
                }
                style={{
                  padding: 12,
                  borderBottomWidth:
                    1,
                  borderBottomColor:
                    "#F3F4F6",
                }}
                onPress={() => {
                  const updatedItems =
                    [...safeItems];

                  updatedItems[
                    index
                  ] = {
                    ...updatedItems[
                      index
                    ],

                    product:
                      product?.productenglishname ||
                      "",

                    producttype: String(
                      product?.producttype ??
                      product?.productType ??
                      product?.product_type ??
                      ""
                    ).trim(),

                    productcode:
                      product?.productcode ||
                      "",

                    rate:
                      Number(
                        product?.retail
                      ) || 0,

                    stock:
                      Number(
                        product?.stockquantity
                      ) || 0,

                    uom:
                      product?.uom ||
                      "",

                    sgst:
                      Number(
                        product?.sgst
                      ) || 0,

                    cgst:
                      Number(
                        product?.cgst
                      ) || 0,

                    igst:
                      Number(
                        product?.igst
                      ) || 0,
                  };

                  setItems(
                    updatedItems
                  );

                  setSuggestions(
                    []
                  );

                  setActiveIndex(
                    null
                  );
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight:
                      "700",
                  }}
                >
                  {
                    product?.productenglishname
                  }
                </Text>

                <Text
                  style={{
                    fontSize: 11,
                    color:
                      "#6B7280",
                    marginTop: 2,
                  }}
                >
                  {
                    product?.productcode
                  }{" "}
                  •{" "}
                  {
                    product?.producttype
                  }
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>
    )}
</View>

    <View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  }}
>
  {/* QTY */}

  <View
    style={{
      flex: 1,
      backgroundColor: "#EEF2FF",
      borderRadius: 12,
      padding: 10,
      marginRight: 6,
      borderWidth: 1,
      borderColor: "#C7D2FE",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="counter"
        size={14}
        color="#4F46E5"
      />

      <Text
        style={{
          marginLeft: 5,
          fontSize: 9,
          color: "#4F46E5",
          fontWeight: "700",
        }}
      >
        QUANTITY
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={String(item.qty)}
      keyboardType="numeric"
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      onChangeText={v =>
        updateItem(
          index,
          "qty",
          parseInt(v) || 0
        )
      }
      style={{
        backgroundColor: "transparent",
        height: 30,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 16,
        fontWeight: "800",
      }}
    />
  </View>

  {/* RATE */}

  <View
    style={{
      flex: 1,
      backgroundColor: "#DCFCE7",
      borderRadius: 12,
      padding: 10,
      marginLeft: 6,
      borderWidth: 1,
      borderColor: "#BBF7D0",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="currency-inr"
        size={14}
        color="#16A34A"
      />

      <Text
        style={{
          marginLeft: 5,
          fontSize: 9,
          color: "#16A34A",
          fontWeight: "700",
        }}
      >
        RATE
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={String(item.rate)}
      keyboardType="numeric"
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      onChangeText={v =>
        updateItem(
          index,
          "rate",
          parseFloat(v) || 0
        )
      }
      style={{
        backgroundColor: "transparent",
        height: 30,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 16,
        fontWeight: "800",
      }}
    />
  </View>
</View>

      <View
  style={{
    backgroundColor: "#DCFCE7",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginTop: 8,
  }}
>
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="cash"
        size={16}
        color="#16A34A"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          fontWeight: "700",
          color: "#16A34A",
        }}
      >
        AMOUNT
      </Text>
    </View>

    <Text
      style={{
        fontSize: 18,
        fontWeight: "900",
        color: "#111827",
      }}
    >
      ₹{amount.toFixed(2)}
    </Text>
  </View>
</View>

      <TouchableOpacity
        style={styles.expandBtn}
        onPress={() =>
          setExpandedId(isOpen ? null : item.id)
        }>
        <Text style={{ color: '#2196F3' }}>
          {isOpen ? 'Hide Details ▲' : 'More Details ▼'}
        </Text>
      </TouchableOpacity>

 {isOpen && (
  <View
    style={{
      backgroundColor: "#F8FAFC",
      borderRadius: 16,
      padding: 12,
      marginTop: 10,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    }}
  >
    {/* DETAILS HEADER */}

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <MaterialCommunityIcons
        name="information-outline"
        size={18}
        color="#4F46E5"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 14,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        Product Details
      </Text>
    </View>

    {/* ROW 1 */}

    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#DBEAFE",
          borderRadius: 12,
          padding: 10,
          marginRight: 4,
        }}
      >
        <Text
          style={{
            fontSize: 9,
            color: "#2563EB",
            fontWeight: "700",
          }}
        >
          STOCK
        </Text>

        <TextInput
          mode="flat"
          value={item.stock || ""}
          onChangeText={v =>
            updateItem(index, "stock", v)
          }
          underlineColor="transparent"
          style={{
            backgroundColor: "transparent",
            height: 30,
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#DCFCE7",
          borderRadius: 12,
          padding: 10,
          marginLeft: 4,
        }}
      >
        <Text
          style={{
            fontSize: 9,
            color: "#16A34A",
            fontWeight: "700",
          }}
        >
          UOM
        </Text>

        <TextInput
          mode="flat"
          value={item.uom || ""}
          onChangeText={v =>
            updateItem(index, "uom", v)
          }
          underlineColor="transparent"
          style={{
            backgroundColor: "transparent",
            height: 30,
          }}
        />
      </View>
    </View>

    {/* ROW 2 */}

    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#FEF3C7",
          borderRadius: 12,
          padding: 10,
          marginRight: 4,
        }}
      >
        <Text
          style={{
            fontSize: 9,
            color: "#D97706",
            fontWeight: "700",
          }}
        >
          WEIGHT
        </Text>

        <TextInput
          mode="flat"
          keyboardType="numeric"
          value={item.weight || ""}
          onChangeText={v =>
            updateItem(index, "weight", v)
          }
          underlineColor="transparent"
          style={{
            backgroundColor: "transparent",
            height: 30,
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#EEF2FF",
          borderRadius: 12,
          padding: 10,
          marginLeft: 4,
        }}
      >
        <Text
          style={{
            fontSize: 9,
            color: "#4F46E5",
            fontWeight: "700",
          }}
        >
          NET RATE
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 15,
            fontWeight: "800",
          }}
        >
          ₹ {item.netRate || 0}
        </Text>
      </View>
    </View>

    {/* ROW 3 */}

    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#FCE7F3",
          borderRadius: 12,
          padding: 10,
          marginRight: 4,
        }}
      >
        <Text
          style={{
            fontSize: 9,
            color: "#DB2777",
            fontWeight: "700",
          }}
        >
          MC %
        </Text>

        <TextInput
          mode="flat"
          keyboardType="numeric"
          value={item.mc || ""}
          onChangeText={v =>
            updateItem(index, "mc", v)
          }
          underlineColor="transparent"
          style={{
            backgroundColor: "transparent",
            height: 30,
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#ECFCCB",
          borderRadius: 12,
          padding: 10,
          marginLeft: 4,
        }}
      >
        <Text
          style={{
            fontSize: 9,
            color: "#65A30D",
            fontWeight: "700",
          }}
        >
          MC TOTAL
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 15,
            fontWeight: "800",
          }}
        >
          ₹ {item.mcTotal || 0}
        </Text>
      </View>
    </View>

    {/* TOTAL WEIGHT */}

    <View
      style={{
        backgroundColor: "#4F46E5",
        borderRadius: 14,
        padding: 12,
      }}
    >
      <Text
        style={{
          color: "#C7D2FE",
          fontSize: 10,
          fontWeight: "700",
        }}
      >
        TOTAL WEIGHT
      </Text>

      <Text
        style={{
          color: "#FFF",
          fontSize: 20,
          fontWeight: "900",
          marginTop: 2,
        }}
      >
        {item.totalWeight || 0}
      </Text>
    </View>
  </View>
)}
     <View
  style={{
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
  }}
>
  {/* ADD ROW */}

  <TouchableOpacity
    onPress={addRow}
    style={{
      marginRight: 15,
    }}
  >
    <MaterialCommunityIcons
      name="plus-circle"
      size={24}
      color="#16A34A"
    />
  </TouchableOpacity>

  {/* DELETE */}

  <TouchableOpacity
    onPress={() =>
      removeItem(item.id)
    }
  >
    <MaterialCommunityIcons
      name="delete"
      size={22}
      color="#EF4444"
    />
  </TouchableOpacity>
</View>
    </View>
  );
})}


        

        {/* SUMMARY */}
<Card
  style={{
    borderRadius: 20,
    padding: 14,
    marginTop: 12,
    backgroundColor: "#FFF",
    elevation: 3,
  }}
>
  {/* HEADER */}

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    }}
  >
    <MaterialCommunityIcons
      name="calculator-variant"
      size={20}
      color="#4F46E5"
    />

    <Text
      style={{
        marginLeft: 8,
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
      }}
    >
      Summary
    </Text>
  </View>

  {/* ROW 1 */}

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    }}
  >
    <View
      style={{
        width: "48%",
        backgroundColor: "#FEF3C7",
        borderRadius: 14,
        padding: 10,
      }}
    >
      <Text
        style={{
          fontSize: 9,
          color: "#D97706",
          fontWeight: "700",
        }}
      >
        CASH DISCOUNT
      </Text>

      <TextInput
        mode="flat"
        value={String(cashDiscount)}
        keyboardType="numeric"
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        onChangeText={v =>
          setCashDiscount(
            Number(v) || 0
          )
        }
        style={{
          backgroundColor: "transparent",
          height: 30,
        }}
      />
    </View>

    <View
      style={{
        width: "48%",
        backgroundColor: "#EEF2FF",
        borderRadius: 14,
        padding: 10,
      }}
    >
      <Text
        style={{
          fontSize: 9,
          color: "#4F46E5",
          fontWeight: "700",
        }}
      >
        ACTUAL AMOUNT
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 16,
          fontWeight: "800",
        }}
      >
        ₹ {actualAmount.toFixed(2)}
      </Text>
    </View>
  </View>

  {/* ROW 2 */}

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    }}
  >
    <View
      style={{
        width: "48%",
        backgroundColor: "#FCE7F3",
        borderRadius: 14,
        padding: 10,
      }}
    >
      <Text
        style={{
          fontSize: 9,
          color: "#DB2777",
          fontWeight: "700",
        }}
      >
        DISCOUNT %
      </Text>

      <TextInput
        mode="flat"
        value={String(discountPercent)}
        keyboardType="numeric"
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        onChangeText={v =>
          setDiscountPercent(
            Number(v) || 0
          )
        }
        style={{
          backgroundColor: "transparent",
          height: 30,
        }}
      />
    </View>

    <View
      style={{
        width: "48%",
        backgroundColor: "#DCFCE7",
        borderRadius: 14,
        padding: 10,
      }}
    >
      <Text
        style={{
          fontSize: 9,
          color: "#16A34A",
          fontWeight: "700",
        }}
      >
        GROSS AMOUNT
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 16,
          fontWeight: "800",
        }}
      >
        ₹ {grossAmount.toFixed(2)}
      </Text>
    </View>
  </View>

  {/* ROW 3 */}

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    }}
  >
    <View
      style={{
        width: "48%",
        backgroundColor: "#DBEAFE",
        borderRadius: 14,
        padding: 10,
      }}
    >
      <Text
        style={{
          fontSize: 9,
          color: "#2563EB",
          fontWeight: "700",
        }}
      >
        NET AMOUNT
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 16,
          fontWeight: "800",
        }}
      >
        ₹ {netAmount.toFixed(2)}
      </Text>
    </View>

    <View
      style={{
        width: "48%",
        backgroundColor: "#F3F4F6",
        borderRadius: 14,
        padding: 10,
      }}
    >
      <Text
        style={{
          fontSize: 9,
          color: "#6B7280",
          fontWeight: "700",
        }}
      >
        PREVIOUS BALANCE
      </Text>

      <TextInput
        mode="flat"
        value={String(previousBalance)}
        keyboardType="numeric"
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        onChangeText={v =>
          setPreviousBalance(
            Number(v) || 0
          )
        }
        style={{
          backgroundColor: "transparent",
          height: 30,
        }}
      />
    </View>
  </View>

  {/* TOTAL */}

  <View
    style={{
      backgroundColor: "#4F46E5",
      borderRadius: 18,
      padding: 16,
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color: "#C7D2FE",
        fontSize: 11,
        fontWeight: "700",
      }}
    >
      GRAND TOTAL
    </Text>

    <Text
      style={{
        color: "#FFF",
        fontSize: 28,
        fontWeight: "900",
        marginTop: 4,
      }}
    >
      ₹ {total.toFixed(2)}
    </Text>
  </View>
</Card>
        {/* BUTTONS */}
<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 20,
  }}
>
  {/* VIEW BILL */}

  <TouchableOpacity
    style={{
      flex: 1,
      marginRight: 6,
      backgroundColor: "#DBEAFE",
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    }}
    onPress={() =>
      router.push(
        "/src/screens/ViewSalesReturn"
      )
    }
  >
    <MaterialCommunityIcons
      name="file-document-outline"
      size={18}
      color="#2563EB"
    />

    <Text
      style={{
        marginLeft: 5,
        color: "#2563EB",
        fontWeight: "700",
      }}
    >
      View
    </Text>
  </TouchableOpacity>

  {/* SAVE */}

  <TouchableOpacity
    style={{
      flex: 1,
      marginHorizontal: 3,
      backgroundColor: "#16A34A",
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    }}
    onPress={handleSave}
  >
    <MaterialCommunityIcons
      name="content-save"
      size={18}
      color="#FFF"
    />

    <Text
      style={{
        marginLeft: 5,
        color: "#FFF",
        fontWeight: "700",
      }}
    >
      Save
    </Text>
  </TouchableOpacity>

  {/* RESET */}

  <TouchableOpacity
    style={{
      flex: 1,
      marginLeft: 6,
      backgroundColor: "#FEE2E2",
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    }}
    onPress={handleReset}
  >
    <MaterialCommunityIcons
      name="refresh"
      size={18}
      color="#DC2626"
    />

    <Text
      style={{
        marginLeft: 5,
        color: "#DC2626",
        fontWeight: "700",
      }}
    >
      Reset
    </Text>
  </TouchableOpacity>
</View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);

              if (event?.type !== 'dismissed' && selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}
