import React,
{
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import {
  TextInput,
  Button,
  Card,Menu,
} from 'react-native-paper';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import styles
from '../style/PurchaseStyle';



import {
  useRouter,useLocalSearchParams,
} from 'expo-router';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import DateTimePicker
from '@react-native-community/datetimepicker';

import {
  CameraView,
  useCameraPermissions
} from "expo-camera";


import {
  getDB,
  savePurchase,
  getPurchaseById,
  getPurchaseItemsById,
  searchProductsByFirstLetter,
  getParty,
  getProductByBarcode,
} from "../database/sqlite";
export default function Purchase() {

  useEffect(() => {
  
    if (
      permission &&
      !permission.granted
    ) {
  
      requestPermission();
  
    }
  
  }, [permission]);



    const { id, mode } = useLocalSearchParams();

    const isEditMode = mode === "edit";



    useEffect(() => {

  if (!isEditMode || !id) {
    return;
  }

  loadPurchaseForEdit();

}, [isEditMode, id]);


const loadPurchaseForEdit = async () => {

  try {

    console.log(
      "✏️ EDIT MODE",
    );

    console.log(
      "📌 PURCHASE ID:",
      id
    );

    const purchase =
      await getPurchaseById(
        String(id)
      );

    if (!purchase) {

      Alert.alert(
        "Error",
        "Purchase not found"
      );

      return;
    }

    const purchaseItems =
  await getPurchaseItemsById(
    String(purchase.purchaseNo)
  );

    console.log(
      "📦 EDIT PURCHASE:",
      purchase
    );

    console.log(
      "📦 EDIT ITEMS:",
      purchaseItems
    );

    // =========================
    // HEADER
    // =========================

    setSupplier(
      String(
        purchase.supplier || ""
      )
    );

    setpurchaseMobileNo(
      String(
        purchase.purchaseMobileNo || ""
      )
    );

    setbillNo(
      String(
        purchase.billNo || ""
      )
    );

    setGstNo(
      String(
        purchase.gstNo || ""
      )
    );

    // =========================
    // LEDGER
    // =========================

    setSelectedLedger(
      purchase.ledger ||
      "COMMON CASH"
    );

    // =========================
    // TAX
    // =========================

    setSelectedTaxType(
      purchase.taxType ||
      "DOUBLE TAX"
    );

    // =========================
    // PAYMENT
    // =========================

    setSelectedPaymentMode(
      purchase.paidType ||
      "CASH"
    );

    // =========================
    // DATE
    // =========================

    if (purchase.date) {

      const parts =
        String(
          purchase.date
        ).split("/");

      if (
        parts.length === 3
      ) {

        const day =
          Number(parts[0]);

        const month =
          Number(parts[1]) - 1;

        const year =
          Number(parts[2]);

        setDate(
          new Date(
            year,
            month,
            day
          )
        );
      }
    }

    // =========================
    // DISCOUNT
    // =========================

    setDiscountAmount(
      String(
        purchase.discount || 0
      )
    );

    // =========================
    // ITEMS
    // =========================

    const formattedItems =
      Array.isArray(
        purchaseItems
      )
        ? purchaseItems.map(
            (item) => ({

              id:
                String(
                  item.id ||
                  `${Date.now()}_${Math.random()}`
                ),

              product:
                item.product || "",

              productcode:
                item.productcode || "",

              barcode:
                item.barcode || "",

              qty:
                Number(
                  item.qty || 1
                ),

              rate:
                Number(
                  item.rate || 0
                ),

              amount:
                Number(
                  item.amount ||
                  (
                    Number(item.qty || 0) *
                    Number(item.rate || 0)
                  )
                ),

              purchase:
                Number(
                  item.purchase ||
                  item.pRate ||
                  0
                ),

              pRate:
                Number(
                  item.pRate ||
                  item.purchase ||
                  0
                ),

              batch:
                item.batch || "",

              uom:
                item.uom || "",

              weight:
                item.weight || "",

              hsn:
                item.hsn || "",

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

              stockquantity:
                Number(
                  item.stockquantity || 0
                ),

              wsProfit: 0,
              wsPrice: 0,

              rProfit: 0,
              rPrice: 0,

              taxAmount: 0,

              discount: 0,
            })
          )
        : [];

    setItems(
      formattedItems.length > 0
        ? formattedItems
        : [
            {
              id: Date.now().toString(),
              product: "",
              productcode: "",
              barcode: "",
              stockquantity: 0,
              qty: 1,
              rate: 0,
              amount: 0,
              purchase: 0,
              pRate: 0,
              batch: "",
              uom: "",
              weight: "",
              hsn: "",
              netRate: 0,
              sgst: 0,
              cgst: 0,
              igst: 0,
              taxAmount: 0,
              wsProfit: 0,
              wsPrice: 0,
              rProfit: 0,
              rPrice: 0,
              discount: 0,
            },
          ]
    );

    console.log(
      "✅ PURCHASE LOADED FOR EDIT"
    );

  } catch (error) {

    console.log(
      "❌ LOAD EDIT PURCHASE:",
      error
    );

    Alert.alert(
      "Error",
      "Unable to load purchase"
    );
  }
};

    const [showScanner,
      setShowScanner] =
      useState(false);
    
    const [scanned,
      setScanned] =
      useState(false);

    const [wholesale,setwholesale]=useState('');
    const [retail,setretail] =useState('');
    
     const [stockquantity,setstockquantity] =useState('');
    
    const [
      permission,
      requestPermission
    ] = useCameraPermissions();

  const [data, setData] =
  useState([]);


  const [suggestionsMap, setSuggestionsMap] =
  useState({});

  const router =
    useRouter();


    const [paymentMenuVisible, setPaymentMenuVisible] =
  useState(false);

const [selectedPaymentMode, setSelectedPaymentMode] =
  useState("CASH");

  const navigation: any =
    useNavigation();

const [suggestions,
  setSuggestions] =
  useState([]);

const [activeIndex,
  setActiveIndex] =
  useState(null);
  const route: any =
    useRoute();



  const [ledgerMenuVisible,
  setLedgerMenuVisible] =
  useState(false);

const [selectedLedger,
  setSelectedLedger] =
  useState('COMMON CASH');

const [ledgerList,
  setLedgerList] =
  useState([]);

  const params =
    route.params || {};

  // ================= HEADER =================

  const [supplier,
    setSupplier] =
    useState('');

  const [purchaseMobileNo,
    setpurchaseMobileNo] =
    useState('');

  const [gstNo,
    setGstNo] =
    useState('');

  const [billNo,
    setbillNo] =
    useState('');


  const [taxMenuVisible,
  setTaxMenuVisible] =
  useState(false);

  const [selectedTaxType,
  setSelectedTaxType] =
  useState(
    'DOUBLE TAX'
  );


  const taxOptions = [

  {
    label: 'Single Tax',
    value: 'SINGLE TAX',
  },

  {
    label: 'Double Tax',
    value: 'DOUBLE TAX',
  },

];



useEffect(() => {

  loadLedgers();

}, []);

const loadLedgers = async () => {

  try {

    const data =
      await getParty();

    const ledgers =
      Array.isArray(data)
        ? data
        : [];

    setLedgerList(
      ledgers
    );

    console.log(
      "📒 Ledgers:",
      ledgers.length
    );

  } catch (e) {

    console.log(
      "❌ loadLedgers:",
      e
    );

    setLedgerList([]);

  }

};

  // ================= DATE =================

  const [date,
    setDate] =
    useState(
      new Date()
    );

  const [showDatePicker,
    setShowDatePicker] =
    useState(false);

  // ================= EXPAND =================

  const [
    expandedId,
    setExpandedId,
  ] = useState<
    string | null
  >(null);

  // ================= ITEMS =================

 const [items, setItems] = useState([
  {
    // ================= BASIC =================

    id: Date.now().toString(),

    product: '',
    productcode: '',
    barcode: '',

    // ================= QTY =================

    qty: 1,

    // ================= PRICE =================

    purchase: 0,

    rate: 0,

    total: 0,

    // ================= PURCHASE DETAILS =================

    batch: '',

    uom: '',

    weight: '',

    hsn: '',

    // ================= PURCHASE RATE =================

    pRate: 0,

    // ================= NET =================

    netRate: 0,

    // ================= WHOLESALE =================

    wsProfit: 0,

    wsPrice: 0,

    // ================= RETAIL =================

    rProfit: 0,

    rPrice: 0,

    // ================= STOCK =================

    stockquantity: 0,

    // ================= TAX =================

    sgst: 0,

    cgst: 0,

    igst: 0,

    taxAmount: 0,

    // ================= EXTRA =================

    discount: 0,
  },
]);
  // ================= SAFE ITEMS =================

  const safeItems =
    Array.isArray(items)
      ? items
      : [];


      
const sgstAmount =
  selectedTaxType === "DOUBLE TAX"
    ? safeItems.reduce(
        (sum, item) => {

          const amount =
            Number(item.qty || 0) *
            Number(item.rate || 0);

          return (
            sum +
            (
              amount *
              Number(item.sgst || 0)
            ) / 100
          );

        },
        0
      )
    : 0;

const cgstAmount =
  selectedTaxType === "DOUBLE TAX"
    ? safeItems.reduce(
        (sum, item) => {

          const amount =
            Number(item.qty || 0) *
            Number(item.rate || 0);

          return (
            sum +
            (
              amount *
              Number(item.cgst || 0)
            ) / 100
          );

        },
        0
      )
    : 0;

const igstAmount =
  selectedTaxType === "SINGLE TAX"
    ? safeItems.reduce(
        (sum, item) => {

          const amount =
            Number(item.qty || 0) *
            Number(item.rate || 0);

          return (
            sum +
            (
              amount *
              Number(item.igst || 0)
            ) / 100
          );

        },
        0
      )
    : 0;

  // ================= CALCULATION =================

  const [discountAmount,
    setDiscountAmount] =
    useState('0');

  const [discountPercent,
    setDiscountPercent] =
    useState('0');

  const [taxPercent,
    setTaxPercent] =
    useState('0');

  const [previousBalance,
    setPreviousBalance] =
    useState('0');

  const [givenAmount,
    setGivenAmount] =
    useState('0');

  const [roundOff,
    setRoundOff] =
    useState('0');

  // ================= SUBTOTAL =================

  const subtotal =
    safeItems.reduce(

      (sum, item) => {

        const qty =
          Number(
            item?.qty
          ) || 0;

        const rate =
          Number(
            item?.pRate
          ) || 0;

        return (
          sum +
          (qty * rate)
        );

      },

      0
    );

  // ================= DISCOUNT =================

  const discountFromPercent =

    subtotal *

    (
      Number(
        discountPercent
      ) || 0
    ) / 100;

  const finalDiscount =

    Number(
      discountAmount
    ) > 0

      ? Number(
          discountAmount
        )

      : discountFromPercent;

      // ================= ACTUAL AMOUNT =================

const actualAmount =
  subtotal;
  // ================= GROSS =================

 const grossAmount = Math.max(
  subtotal - finalDiscount,
  0
);


  // ================= TAX =================

const taxAmount =
  safeItems.reduce(
    (total, item) => {

      const amount =
        Number(item?.qty || 0) *
        Number(item?.rate || 0);

      if (
        selectedTaxType ===
        "SINGLE TAX"
      ) {

        return (
          total +
          (
            amount *
            Number(
              item?.igst || 0
            )
          ) / 100
        );

      }

      return (
        total +
        (
          amount *
          (
            Number(
              item?.sgst || 0
            ) +
            Number(
              item?.cgst || 0
            )
          )
        ) / 100
      );

    },
    0
  );

  // ================= NET =================

  const netAmount =

    grossAmount +
    taxAmount;

  // ================= TOTAL BALANCE =================

  const totalBalance =

    netAmount +

    (
      Number(
        previousBalance
      ) || 0
    );

  // ================= BALANCE =================

  const balanceAmount =

    Math.max(

      totalBalance -

      (
        Number(
          givenAmount
        ) || 0
      ),

      0
    );

  // ================= FINAL TOTAL =================

  const finalTotal =

    balanceAmount +

    (
      Number(
        roundOff
      ) || 0
    );

  // ================= SAFE TOTAL =================

  const total =
    Number(
      finalTotal
    ) || 0;

  const safeTotal =
    isNaN(total)
      ? 0
      : total;

  // ================= AUTO PRICE =================
useEffect(() => {

  if (!Array.isArray(safeItems)) {
    return;
  }

  const updatedItems = safeItems.map(item => {

    // ================= SAFE VALUES =================

    const pRate =
      Number(item?.pRate || 0);

    const wsProfit =
      Number(item?.wsProfit || 0);

    const rProfit =
      Number(item?.rProfit || 0);

    const qty =
      Number(item?.qty || 0);

    const rate =
      Number(item?.rate || 0);

    // ================= WHOLESALE PRICE =================

    const wsPrice =
      pRate +
      (pRate * wsProfit / 100);

    // ================= RETAIL PRICE =================

    const rPrice =
      pRate +
      (pRate * rProfit / 100);

    // ================= NET RATE =================

    const netRate =
      (wsPrice + rPrice) / 2;

    // ================= TAXABLE AMOUNT =================

    const amount =
      qty * rate;

    // ================= TAX CALCULATION =================

    let taxAmount = 0;

    if (
      selectedTaxType ===
      "SINGLE TAX"
    ) {

      taxAmount =
        amount *
        (
          Number(
            item?.igst || 0
          ) / 100
        );

    } else {

      taxAmount =
        amount *
        (
          (
            Number(
              item?.sgst || 0
            ) +
            Number(
              item?.cgst || 0
            )
          ) / 100
        );

    }

    return {

      ...item,

      wsPrice:
        Number(
          wsPrice.toFixed(2)
        ),

      rPrice:
        Number(
          rPrice.toFixed(2)
        ),

      netRate:
        Number(
          netRate.toFixed(2)
        ),

      taxAmount:
        Number(
          taxAmount.toFixed(2)
        ),
    };

  });

  const changed = updatedItems.some(
    (item, index) =>
      JSON.stringify(item) !==
      JSON.stringify(
        safeItems[index]
      )
  );

  if (changed) {
    setItems(updatedItems);
  }

}, [
  selectedTaxType,
  safeItems,
]);



  // ================= ADD ROW =================
const addRow = () => {

  setItems([
    ...items,

    {
      id: Date.now().toString(),

      // ================= BASIC =================

      product: '',
      productcode: '',
      barcode: '',

      // ================= QTY =================

      qty: 1,

      // ================= PRICE =================

      purchase: 0,
      rate: 0,
      total: 0,

      // ================= DETAILS =================

      batch: '',
      uom: '',
      weight: '',
      hsn: '',

      // ================= PURCHASE =================

      pRate: 0,

      // ================= NET =================

      netRate: 0,

      // ================= WHOLESALE =================

      wsProfit: 0,
      wsPrice: 0,

      // ================= RETAIL =================

      rProfit: 0,
      rPrice: 0,

      // ================= STOCK =================

      stockquantity: 0,

      // ================= TAX =================

      sgst: 0,
      cgst: 0,
      igst: 0,
      taxAmount: 0,

      // ================= EXTRA =================

      discount: 0,
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

  if (!newItems[index]) {
    return;
  }

  newItems[index] = {

    ...newItems[index],

    [key]: value,

  };

  // ================= SAFE VALUES =================

  const qty =
    Number(
      newItems[index]?.qty ?? 0
    );

  const rate =
    Number(
      newItems[index]?.rate ?? 0
    );

  const pRate =
    Number(
      newItems[index]?.pRate ?? 0
    );

  const wsProfit =
    Number(
      newItems[index]?.wsProfit ?? 0
    );

  const rProfit =
    Number(
      newItems[index]?.rProfit ?? 0
    );

  // ================= PRICE CALCULATION =================

  const wsPrice =
    pRate +
    ((pRate * wsProfit) / 100);

  const rPrice =
    pRate +
    ((pRate * rProfit) / 100);

  const netRate =
    (wsPrice + rPrice) / 2;

  // ================= AMOUNT =================

  const amount =
    qty * rate;

  // ================= TAX =================

  const taxPercent =
    selectedTaxType ===
    "SINGLE TAX"

      ? Number(
          newItems[index]?.igst || 0
        )

      : Number(
          newItems[index]?.sgst || 0
        ) +
        Number(
          newItems[index]?.cgst || 0
        );

  const taxAmount =
    (amount * taxPercent) / 100;

  // ================= UPDATE VALUES =================

  newItems[index].wsPrice =
    Number(
      wsPrice.toFixed(2)
    );

  newItems[index].rPrice =
    Number(
      rPrice.toFixed(2)
    );

  newItems[index].netRate =
    Number(
      netRate.toFixed(2)
    );

  newItems[index].amount =
    Number(
      amount.toFixed(2)
    );

  newItems[index].taxAmount =
    Number(
      taxAmount.toFixed(2)
    );

  setItems(newItems);

};



  // ================= REMOVE =================

  const removeItem = (
  id: string,
) => {

  if (safeItems.length === 1) {

    alert(
      'At least one item required'
    );

    return;
  }

  setItems(
    safeItems.filter(
      i => i.id !== id,
    ),
  );

};
const handleSave = async (goToView = false) => {
  try {
    console.log("====================================");
    console.log("💾 HANDLE SAVE PURCHASE");
    console.log("====================================");

    // =====================================================
    // SAFE ITEMS
    // =====================================================

    const safeItems = Array.isArray(items) ? items : [];

    // =====================================================
    // VALID PRODUCTS
    // =====================================================

    const validItems = safeItems.filter(
      (item) =>
        String(item?.product || "").trim().length > 0
    );

    if (validItems.length === 0) {
      alert("Add at least one product");
      return;
    }

    // =====================================================
    // VALIDATE QTY
    // =====================================================

    const invalidQty = validItems.some(
      (item) => Number(item?.qty || 0) <= 0
    );

    if (invalidQty) {
      alert("Enter valid quantity");
      return;
    }

    // =====================================================
    // VALIDATE RATE
    // =====================================================

    const invalidRate = validItems.some(
      (item) => Number(item?.rate || 0) <= 0
    );

    if (invalidRate) {
      alert("Enter valid rate");
      return;
    }

    // =====================================================
    // DATABASE
    // =====================================================

    const db = await getDB();

    if (!db) {
      alert("Database not available");
      return;
    }

    // =====================================================
    // NEXT PURCHASE NUMBER
    // =====================================================

    const maxPurchase = await db.getFirstAsync(`
      SELECT
        COALESCE(MAX(purchaseNo), 0) AS maxNo
      FROM purchases
    `);

    const nextNo =
      Number(maxPurchase?.maxNo || 0) + 1;

    const purchaseId =
      String(nextNo).padStart(4, "0");

    console.log(
      "📦 NEW PURCHASE ID:",
      purchaseId
    );

    // =====================================================
    // PURCHASE HEADER
    // =====================================================

    const tax = Number(taxAmount || 0);

    const isDoubleTax =
      selectedTaxType === "DOUBLE TAX";

    const isSingleTax =
      selectedTaxType === "SINGLE TAX";

    const purchase = {
      id: purchaseId,

      purchaseNo: nextNo,

      billNo: String(
        billNo || ""
      ).trim(),

      supplier: String(
        supplier || ""
      ).trim(),

      purchaseMobileNo: String(
        purchaseMobileNo || ""
      ).trim(),

      gstNo: String(
        gstNo || ""
      ).trim(),

      ledger: String(
        selectedLedger || "COMMON CASH"
      ),

      taxType: String(
        selectedTaxType || ""
      ),

      paidType: "CASH",

      billType: "",

      purchaseType: "",

      date: date.toLocaleDateString("en-GB"),

      subtotal: Number(
        subtotal || 0
      ),

      discount: Number(
        finalDiscount || 0
      ),

      tax: tax,

      sgst: isDoubleTax
        ? tax / 2
        : 0,

      cgst: isDoubleTax
        ? tax / 2
        : 0,

      igst: isSingleTax
        ? tax
        : 0,

      total: Number(
        safeTotal || 0
      ),

      createdAt:
        new Date().toISOString(),
    };

    // =====================================================
    // CLEAN ITEMS
    // =====================================================

    const cleanItems = validItems.map(
      (item, index) => {
        const qty =
          Number(item?.qty || 0);

        const rate =
          Number(item?.rate || 0);

        const purchaseRate =
          Number(
            item?.purchase ??
            item?.pRate ??
            rate ??
            0
          );

        return {
          id:
            `${purchaseId}_${index}_${Date.now()}`,

          purchaseId:
            purchaseId,

          purchaseNo:
            String(nextNo),

          billNo:
            String(
              billNo || ""
            ).trim(),

          product:
            String(
              item?.product || ""
            ).trim(),

          productcode:
            String(
              item?.productcode || ""
            ),

          barcode:
            String(
              item?.barcode || ""
            ),

          hsn:
            String(
              item?.hsn || ""
            ),

          purchase:
            purchaseRate,

          pRate:
            Number(
              item?.pRate ??
              purchaseRate
            ),

          qty:
            qty,

          rate:
            rate,

          amount:
            qty * rate,

          batch:
            String(
              item?.batch || ""
            ),

          uom:
            String(
              item?.uom ||
              item?.unittype ||
              ""
            ),

          weight:
            String(
              item?.weight || ""
            ),

          netRate:
            Number(
              item?.netRate ??
              rate
            ),

          sgst:
            Number(
              item?.sgst || 0
            ),

          cgst:
            Number(
              item?.cgst || 0
            ),

          igst:
            Number(
              item?.igst || 0
            ),

          stockquantity:
            qty,
        };
      }
    );

    console.log(
      "📦 SAVE PURCHASE:",
      JSON.stringify(
        purchase,
        null,
        2
      )
    );

    console.log(
      "📦 PURCHASE ITEMS:",
      JSON.stringify(
        cleanItems,
        null,
        2
      )
    );

    // =====================================================
    // SAVE
    // =====================================================

    const saved =
      await savePurchase(
        purchase,
        cleanItems
      );

    if (!saved) {
      alert(
        "Purchase could not be saved"
      );
      return;
    }

    console.log(
      "===================================="
    );

    console.log(
      "✅ PURCHASE SAVED:",
      purchaseId
    );

    console.log(
      "===================================="
    );

    // =====================================================
    // RESET FORM
    // =====================================================

    setItems([
      {
        id:
          Date.now().toString(),

        product: "",
        productcode: "",
        barcode: "",
        hsn: "",

        stockquantity: 0,

        qty: 1,

        rate: 0,

        amount: 0,

        purchase: 0,

        pRate: 0,

        batch: "",

        uom: "",

        weight: "",

        netRate: 0,

        sgst: 0,

        cgst: 0,

        igst: 0,

        taxAmount: 0,

        wsProfit: 0,

        wsPrice: 0,

        rProfit: 0,

        rPrice: 0,

        discount: 0,
      },
    ]);

    setSupplier("");
    setpurchaseMobileNo("");
    setbillNo("");

    // =====================================================
    // NAVIGATE
    // =====================================================

    router.push({
      pathname:
        "/src/screens/ViewPurchaseScreen",

      params: {
        id: purchaseId,
      },
    });

  } catch (e) {
    console.log(
      "===================================="
    );

    console.log(
      "❌ handleSave ERROR"
    );

    console.log(
      "MESSAGE:",
      e?.message
    );

    console.log(
      "ERROR:",
      e
    );

    console.log(
      "===================================="
    );

    alert(
      e?.message ||
      "Failed to save purchase"
    );
  }
};


 



  // ================= VIEW BILL =================

  
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
       colors={[
          "#4C1D95",
          "#6D28D9",
          "#8B5CF6",
        ]}
        style={
          styles.header
        }>
        <SafeAreaView>
          <View
            style={
              styles.headerRow
            }>
            <TouchableOpacity
              onPress={() =>
                navigation.goBack()
              }>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>

            <Text
              style={
                styles.title
              }>
              Purchase
              Transaction
            </Text>

            <TouchableOpacity
              onPress={
                addRow
              }>
              <MaterialCommunityIcons
                name="plus-circle"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled">
        {/* DETAILS */}
     <Card
  style={{
    margin: 12,
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#fff",
    elevation: 4,
  }}
>
  
 <View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  }}
>
  <Text
    style={{
      fontSize: 22,
      fontWeight: "800",
      color: "#111827",
    }}
  >
    Purchase Invoice
  </Text>

  <TouchableOpacity
    
    activeOpacity={0.9}
  >
    <LinearGradient
      colors={["#10B981", "#059669"]}
      style={{
        width: 52,
        height: 52,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="barcode-scan"
        size={26}
        color="#fff"
      />
    </LinearGradient>
  </TouchableOpacity>


  {showScanner && (
  
    <View
      style={{
        position: "absolute",
  
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
  
        backgroundColor:
          "#000",
  
        zIndex: 999999,
      }}>
  
    <CameraView
    style={{
      width: "100%",
      height: 300,
    }}
  
    
    barcodeScannerSettings={{
      barcodeTypes: [
        "ean13",
        "ean8",
        "upc_a",
        "upc_e",
        "code128",
        "code39",
        "code93",
        "itf14",
        "codabar",
        "qr",
      ],
    }}
  
    onBarcodeScanned={
    scanned
      ? undefined
      : async ({ data }) => {
  
          setScanned(true);
  
          console.log(
            "Scanned Barcode:",
            data
          );
  
          const product =
            await getProductByBarcode(
              data
            );
  
          console.log(
            "Product:",
            product
          );
  
          if (!product) {
  
            Alert.alert(
              "Not Found",
              "Product not found"
            );
  
            setScanned(false);
  
            return;
          }
  
         const updatedItems =
  [...items];

updatedItems[0] = {

  ...updatedItems[0],

  product:
    product.productenglishname,

  productcode:
    product.productcode || "",

  barcode:
    product.barcode || "",

  hsn:
    product.hsn || "",

  pRate:
    Number(
      product.purchase || 0
    ),

  rate:
    Number(
      product.retail || 0
    ),

  qty: 1,

  unittype:
    product.unittype || "",

  uom:
    product.uom || "",

  stockquantity:
    Number(product?.stockquantity || 0),

  sgst:
    Number(
      product.sgst || 0
    ),

  cgst:
    Number(
      product.cgst || 0
    ),

  igst:
    Number(
      product.igst || 0
    ),

  batch:
    product.batch || "",

};
  
          setItems(
            updatedItems
          );
  
          setShowScanner(
            false
          );
        }
  }
      />
  
      {/* CLOSE BUTTON */}
  
      <TouchableOpacity
        onPress={() =>
          setShowScanner(false)
        }
        style={{
          position: "absolute",
  
          top: 60,
          right: 20,
  
          width: 50,
          height: 50,
  
          borderRadius: 25,
  
          backgroundColor:
            "rgba(0,0,0,0.6)",
  
          justifyContent:
            "center",
  
          alignItems:
            "center",
        }}>
  
        <MaterialCommunityIcons
          name="close"
          size={30}
          color="#fff"
        />
  
      </TouchableOpacity>
  
    </View>
  
  )}
  
</View>
  {/* Date & Bill No */}
 <View
  style={{
    flexDirection: "row",
    marginBottom: 16,
  }}
>
  <TouchableOpacity
    style={{
      flex: 1,
      marginRight: 8,
    }}
    onPress={() => setShowDatePicker(true)}
  >
    <LinearGradient
      colors={["#EEF2FF", "#F8FAFF"]}
      style={{
        height: 65,
        borderRadius: 20,
        paddingHorizontal: 15,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 11,
          color: "#6366F1",
          fontWeight: "800",
        }}
      >
        DATE
      </Text>

      <Text
        style={{
          fontSize: 15,
          fontWeight: "700",
          color: "#111827",
        }}
      >
        {date.toLocaleDateString("en-GB")}
      </Text>
    </LinearGradient>
  </TouchableOpacity>

  <View
    style={{
      flex: 1,
      marginLeft: 8,
    }}
  >
    <TextInput
      label="Bill No"
      value={billNo}
      onChangeText={setbillNo}
      mode="outlined"
      outlineStyle={{
        borderRadius: 20,
      }}
    />
  </View>
</View>

  {/* Ledger */}

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
      <LinearGradient
        colors={[
          "#ECFDF5",
          "#F8FFFC",
        ]}
        style={{
          height: 75,
          borderRadius: 22,
          paddingHorizontal: 15,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            backgroundColor:
              "#10B981",
            justifyContent:
              "center",
            alignItems:
              "center",
            marginRight: 14,
          }}
        >
          <MaterialCommunityIcons
            name="account-group"
            size={24}
            color="#fff"
          />
        </View>

        <View
          style={{ flex: 1 }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "#10B981",
              fontWeight: "800",
            }}
          >
            LEDGER
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            {selectedLedger ||
              "Select Ledger"}
          </Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-down"
          size={26}
          color="#10B981"
        />
      </LinearGradient>
    </TouchableOpacity>
  }
>
  {ledgerList.map(item => (
    <Menu.Item
      key={item.id}
      title={item.nameEnglish}
      onPress={() => {
        setSelectedLedger(
          item.nameEnglish
        );
        setLedgerMenuVisible(
          false
        );
      }}
    />
  ))}

  <Menu.Item
    title="+ Add Ledger"
    onPress={() => {
      setLedgerMenuVisible(
        false
      );
      router.push(
        "/src/screens/LedgerMaster"
      );
    }}
  />
</Menu>



  {/* Name & Mobile */}
 <View
  style={{
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 15,
    marginBottom: 16,
  }}
>
  <Text
    style={{
      fontSize: 14,
      fontWeight: "800",
      color: "#475569",
      marginBottom: 12,
    }}
  >
    Supplier Information
  </Text>

  <TextInput
    label="Supplier Name"
    value={supplier}
    onChangeText={setSupplier}
    mode="outlined"
    style={{
      marginBottom: 12,
      backgroundColor: "#fff",
    }}
    outlineStyle={{
      borderRadius: 18,
    }}
    left={
      <TextInput.Icon
        icon="account"
      />
    }
  />

  <TextInput
    label="Mobile Number"
    value={purchaseMobileNo}
    onChangeText={
      setpurchaseMobileNo
    }
    keyboardType="phone-pad"
    mode="outlined"
    style={{
      backgroundColor: "#fff",
    }}
    outlineStyle={{
      borderRadius: 18,
    }}
    left={
      <TextInput.Icon
        icon="phone"
      />
    }
  />
</View>


  {/* Tax & Payment */}
 <View
  style={{
    flexDirection: "row",
    marginBottom: 16,
  }}
>

  {/* TAX TYPE */}

  <Menu
    visible={taxMenuVisible}
    onDismiss={() =>
      setTaxMenuVisible(false)
    }
    anchor={
      <TouchableOpacity
        style={{
          flex: 1,
          marginRight: 8,
        }}
        activeOpacity={0.9}
        onPress={() =>
          setTaxMenuVisible(true)
        }
      >
       <LinearGradient
  colors={[
    "#FEF3C7",
    "#FFF7ED",
  ]}
  style={{
    width:160,
    height: 58,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
  }}
>
  <Text
    style={{
      fontSize: 10,
      color: "#EA580C",
      fontWeight: "800",
    }}
  >
    TAX TYPE
  </Text>

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 2,
    }}
  >
    <Text
      numberOfLines={1}
      style={{
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
        flex: 1,
      }}
    >
      {selectedTaxType}
    </Text>

    <MaterialCommunityIcons
      name="chevron-down"
      size={18}
      color="#EA580C"
    />
  </View>
</LinearGradient>
      </TouchableOpacity>
    }
  >
    {taxOptions.map(item => (
      <Menu.Item
        key={item.value}
        title={item.label}
        onPress={() => {
          setSelectedTaxType(
            item.value
          );
          setTaxMenuVisible(false);
        }}
      />
    ))}
  </Menu>

  {/* PAYMENT MODE */}

  <Menu
    visible={paymentMenuVisible}
    onDismiss={() =>
      setPaymentMenuVisible(false)
    }
    anchor={
      <TouchableOpacity
        style={{
          flex: 1,
          marginLeft: 8,
        }}
        activeOpacity={0.9}
        onPress={() =>
          setPaymentMenuVisible(true)
        }
      >
      <LinearGradient
  colors={[
    "#DCFCE7",
    "#F0FDF4",
  ]}
  style={{
    height: 58,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
  }}
>
  <Text
    style={{
      fontSize: 10,
      color: "#16A34A",
      fontWeight: "800",
    }}
  >
    PAYMENT MODE
  </Text>

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 2,
    }}
  >
    <Text
      numberOfLines={1}
      style={{
        flex: 1,
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
      }}
    >
      {selectedPaymentMode}
    </Text>

    <MaterialCommunityIcons
      name="chevron-down"
      size={18}
      color="#16A34A"
    />
  </View>
</LinearGradient>
      </TouchableOpacity>
    }
  >
    <Menu.Item
      title="CASH"
      onPress={() => {
        setSelectedPaymentMode(
          "CASH"
        );
        setPaymentMenuVisible(
          false
        );
      }}
    />

    <Menu.Item
      title="UPI"
      onPress={() => {
        setSelectedPaymentMode(
          "UPI"
        );
        setPaymentMenuVisible(
          false
        );
      }}
    />

    <Menu.Item
      title="CARD"
      onPress={() => {
        setSelectedPaymentMode(
          "CARD"
        );
        setPaymentMenuVisible(
          false
        );
      }}
    />

    <Menu.Item
      title="BANK"
      onPress={() => {
        setSelectedPaymentMode(
          "BANK"
        );
        setPaymentMenuVisible(
          false
        );
      }}
    />
  </Menu>

</View>

  {/* GST */}
 <TextInput
  label="GST Number"
  value={gstNo}
  onChangeText={setGstNo}
  mode="outlined"
  style={{
    backgroundColor: "#fff",
  }}
  outlineStyle={{
    borderRadius: 22,
  }}
  left={
    <TextInput.Icon
      icon="file-document-outline"
    />
  }
/>


</Card>

        {/* DATE PICKER */}

{showDatePicker && (

<DateTimePicker
  value={date}

  mode="date"

  display="default"

  onChange={(
    event,
    selectedDate
  ) => {

    setShowDatePicker(
      false
    );

    if (
      selectedDate
    ) {

      setDate(
        selectedDate
      );
    }

  }}
/>

)}

     
      {/* ITEMS */}

{items.map(
  (
    item,
    index,
  ) => {

    const amount =
  Number(item?.qty ?? 0) *
  Number(item?.rate ?? 0);

    const isOpen =
      expandedId ===
      item.id;

    return (

      <View
        key={item.id}

        style={
          styles.productCard
        }>

        {/* PRODUCT */}

   <View
  style={{
    zIndex:
      activeIndex === index
        ? 999
        : 1,

    marginBottom: 10,
  }}>

<TouchableOpacity
  activeOpacity={0.95}
  onPress={() =>
    setActiveIndex(index)
  }
>
  <View
    style={{
      backgroundColor: "#FFFFFF",

      borderRadius: 20,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      paddingHorizontal: 14,
      paddingVertical: 12,

      flexDirection: "row",

      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 42,
        height: 42,

        borderRadius: 14,

        backgroundColor:
          "#EEF2FF",

        justifyContent:
          "center",

        alignItems:
          "center",
      }}
    >
      <MaterialCommunityIcons
        name="package-variant-closed"
        size={22}
        color="#4F46E5"
      />
    </View>

    <View
      style={{
        flex: 1,
        marginLeft: 12,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          color: "#94A3B8",
          fontWeight: "700",
        }}
      >
        PRODUCT
      </Text>

  <TextInput
  mode="flat"
  value={item?.product || ""}
  placeholder="Search Product"
  underlineColor="transparent"
  activeUnderlineColor="transparent"
  style={{
    backgroundColor: "transparent",
    height: 30,
  }}
  contentStyle={{
    padding: 0,
    fontSize: 16,
    fontWeight: "700",
  }}
  onFocus={() => {
    setActiveIndex(index);
  }}
  onChangeText={async (value) => {

    // UPDATE CURRENT ROW
    setItems(prev => {

      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        product: value,
      };

      return updated;
    });

    setActiveIndex(index);

    const searchText = value.trim();

    // CLEAR SUGGESTIONS
    if (!searchText) {

      setSuggestionsMap(prev => ({
        ...prev,
        [index]: [],
      }));

      return;
    }

    try {

      const result =
        await searchProductsByFirstLetter(
          searchText
        );

        console.log("result:",result);
      setSuggestionsMap(prev => ({
        ...prev,
        [index]:
          Array.isArray(result)
            ? result
            : [],
      }));


    } catch (error) {

      console.log(
        "❌ Product Search Error:",
        error
      );

      setSuggestionsMap(prev => ({
        ...prev,
        [index]: [],
      }));

    }

  }}
/>
    </View>

    <View
      style={{
        width: 38,
        height: 38,

        borderRadius: 12,

        backgroundColor:
          "#F8FAFC",

        justifyContent:
          "center",

        alignItems:
          "center",
      }}
    >
      <MaterialCommunityIcons
        name="magnify"
        size={22}
        color="#64748B"
      />
    </View>
  </View>
</TouchableOpacity>


{
  activeIndex === index &&
  Array.isArray(
    suggestionsMap[index]
  ) &&
  suggestionsMap[index].length > 0 && (

    <Card
      style={{
        position: "absolute",
        top: 70,
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 10,
        backgroundColor: "#fff",
      }}
    >

      {suggestionsMap[index].map(
        (product, i) => {

          return (

            <TouchableOpacity
              key={
                product?.id?.toString() ||
                i.toString()
              }
           onPress={() => {

  setItems(prevItems => {

    console.log(
      "Before Update:",
      JSON.stringify(prevItems, null, 2)
    );

    const updatedItems = [...prevItems];

    if (!updatedItems[index]) {
      console.log(
        "❌ Invalid index:",
        index
      );
      return prevItems;
    }

    updatedItems[index] = {
      ...updatedItems[index],

      product:
        product?.productenglishname || "",

      productcode:
        product?.productcode || "",

      barcode:
        product?.barcode || "",

      purchase:
        Number(product?.purchase || 0),

      pRate:
        Number(product?.purchase || 0),

      rate:
        Number(product?.retail || 0),

      qty:
        Number(
          updatedItems[index]?.qty || 1
        ),

      sgst:
        Number(product?.sgst || 0),

      cgst:
        Number(product?.cgst || 0),

      igst:
        Number(product?.igst || 0),

      uom:
        product?.uom || "",

      batch:
        product?.batch || "",

      hsn:
        product?.hsn || "",

      stockquantity:
        Number(
          product?.stockquantity || 0
        ),

      weight:
        product?.weight || "",

      amount:
        Number(
          updatedItems[index]?.qty || 1
        ) *
        Number(
          product?.retail || 0
        ),
    };

    setstockquantity(
  Number(
    product?.stockquantity || 0
  )
);
    console.log(
      "Selected Row:",
      index
    );

    console.log(
      "Selected Product:",
      product?.productenglishname
    );

    console.log(
      "After Update:",
      JSON.stringify(updatedItems, null, 2)
    );

    return updatedItems;
  });

  setSuggestionsMap(prev => ({
    ...prev,
    [index]: [],
  }));

  setActiveIndex(null);
}}  
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#E5E7EB",
              }}
            >

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                {product.productenglishname}
              </Text>

              <Text
                style={{
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                ₹{product.retail}
              </Text>

               <Text
                style={{
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                Stock:{product.stockquantity}
              </Text>

            </TouchableOpacity>

          );

        }
      )}

    </Card>

  )
}

</View>

        {/* QTY + RATE */}

<View
  style={{
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 8,
  }}
>
  {/* QTY */}

 <View
  style={{
    flex: 1,
    marginRight: 6,
  }}
>
  <Text
    style={{
      fontSize: 10,
      color: "#64748B",
      fontWeight: "700",
      marginBottom: 4,
    }}
  >
    QTY
  </Text>

  <View
    style={{
      backgroundColor: "#F1F5F9",

      borderRadius: 16,

      height: 48,

      justifyContent: "center",

      paddingHorizontal: 14,
    }}
  >
    <TextInput
      mode="flat"
      dense
      value={String(item.qty ?? "")}
      keyboardType="numeric"
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 32,
      }}
      contentStyle={{
        fontSize: 20,
        fontWeight: "800",
        padding: 0,
      }}
      onChangeText={v => {
        updateItem(index, "qty", v);
      }}
    />
  </View>
</View>

  {/* RATE */}

 <View
  style={{
    flex: 1,
    marginLeft: 6,
  }}
>
  <Text
    style={{
      fontSize: 10,
      color: "#2563EB",
      fontWeight: "700",
      marginBottom: 4,
    }}
  >
    RATE
  </Text>

  <View
    style={{
      backgroundColor: "#EFF6FF",

      borderRadius: 16,

      height: 48,

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 12,

      borderWidth: 1,
      borderColor: "#BFDBFE",
    }}
  >
    <MaterialCommunityIcons
      name="currency-inr"
      size={18}
      color="#2563EB"
      style={{
        marginRight: 6,
      }}
    />

    <TextInput
      mode="flat"
      dense
      value={String(item?.rate ?? "")}
      keyboardType="numeric"
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        flex: 1,
        height: 32,
        backgroundColor:
          "transparent",
      }}
      contentStyle={{
        paddingVertical: 0,
        paddingHorizontal: 0,

        fontSize: 20,
        fontWeight: "800",

        color: "#0F172A",
      }}
   onChangeText={v => {

  const rate =
    parseFloat(v) || 0;

  setItems(prev => {

    const updated = [...prev];

    if (!updated[index]) {
      return prev;
    }

    const qty =
      Number(
        updated[index]?.qty || 0
      );

    const total =
      qty * rate;

    updated[index] = {

      ...updated[index],

      rate,

      total:
        Number(
          total.toFixed(2)
        ),

    };

    return updated;

  });

}}
    />
  </View>
</View>
</View>

        {/* AMOUNT */}
<LinearGradient
  colors={[
    "#ECFDF5",
    "#F0FDF4",
  ]}
  style={{
    marginTop: 10,

    borderRadius: 18,

    paddingHorizontal: 16,
    paddingVertical: 12,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    borderWidth: 1,
    borderColor: "#BBF7D0",
  }}
>
  <View>
    <Text
      style={{
        fontSize: 11,
        color: "#16A34A",
        fontWeight: "700",
        letterSpacing: 1,
      }}
    >
      TOTAL AMOUNT
    </Text>

    <Text
      style={{
        marginTop: 2,
        fontSize: 12,
        color: "#64748B",
      }}
    >
      Qty × Rate
    </Text>
  </View>

  <Text
    style={{
      fontSize: 24,
      fontWeight: "900",
      color: "#15803D",
    }}
  >
    ₹{amount.toFixed(2)}
  </Text>
</LinearGradient>

        {/* MORE DETAILS */}

        <TouchableOpacity
          style={
            styles.expandBtn
          }

          onPress={() =>
            setExpandedId(
              isOpen
                ? null
                : item.id,
            )
          }>

          <Text
            style={{
              color:
                '#2196F3',
            }}>

            {isOpen
              ? 'Hide Details ▲'
              : 'More Details ▼'}

          </Text>

        </TouchableOpacity>

        {/* EXTRA DETAILS */}



{isOpen && (() => {

  // ================= CALCULATIONS =================

  const pRate =

    Number(
      item.pRate
    ) || 0;

  const wsProfit =

    Number(
      item.wsProfit
    ) || 0;

  const rProfit =

    Number(
      item.rProfit
    ) || 0;

  // ================= WS PRICE =================

  const wsPrice =

    pRate +

    (
      pRate *
      wsProfit / 100
    );

  // ================= RETAIL PRICE =================

  const rPrice =

    pRate +

    (
      pRate *
      rProfit / 100
    );

  // ================= NET RATE =================

  const netRate =

    (
      wholesale +
      retail
    ) / 2;

  return (

    <View
      style={
        styles.extraSection
      }>

      {/* ================= ROW 1 ================= */}

     <View style={styles.row}>

  <TextInput
    label="Batch"
    mode="outlined"
    dense
    value={item?.batch ?? ""}
    onChangeText={(v) =>
      updateItem(index, "batch", v)
    }
    left={
      <TextInput.Icon
        icon="package-variant"
      />
    }
   style={{
      ...styles.halfInput,
      backgroundColor: "#ECFDF5",
    }}
    outlineStyle={{
      borderRadius: 12,
      borderColor: "#10B981",
    }}
  />

  <TextInput
    label="UOM"
    mode="outlined"
    dense
    value={item?.uom ?? ""}
    onChangeText={(v) =>
      updateItem(index, "uom", v)
    }
    left={
      <TextInput.Icon
        icon="scale-balance"
      />
    }
   style={{
      ...styles.halfInput,
      backgroundColor: "#ECFDF5",
    }}
    outlineStyle={{
      borderRadius: 12,
      borderColor: "#10B981",
    }}
  />

</View>
      {/* ================= ROW 2 ================= */}

   <View style={styles.row}>

  <TextInput
    label="Weight"
    mode="outlined"
    dense
    value={item?.weight ?? ""}
    onChangeText={(v) =>
      updateItem(index, "weight", v)
    }
    left={
      <TextInput.Icon icon="weight-kilogram" />
    }
    style={{
      ...styles.halfInput,
      backgroundColor: "#ECFDF5",
    }}
    outlineStyle={{
      borderRadius: 12,
      borderColor: "#10B981",
    }}
  />

  <TextInput
    label="P-Rate"
    mode="outlined"
    dense
    keyboardType="numeric"
    value={
      item?.pRate
        ? String(item.pRate)
        : ""
    }
    onChangeText={(v) =>
      updateItem(
        index,
        "pRate",
        parseFloat(v) || 0
      )
    }
    left={
      <TextInput.Icon icon="currency-inr" />
    }
  style={{
      ...styles.halfInput,
      backgroundColor: "#ECFDF5",
    }}
    outlineStyle={{
      borderRadius: 12,
      borderColor: "#10B981",
    }}
  />

</View>

      {/* ================= ROW 3 ================= */}

<View style={styles.row}>
  <TextInput
  label="Net Rate"
  mode="outlined"
  dense
  editable={false}
  value={String(
    pRate.toFixed(2)
  )}
  left={
    <TextInput.Icon
      icon="cash-check"
    />
  }
  style={{
    width: "48%",
    height: 44,
    marginTop:10,
    marginBottom:10,
    backgroundColor: "#ECFDF5",
  }}
  outlineStyle={{
    borderRadius: 12,
    borderColor: "#10B981",
  }}
  />

 <TextInput
  label="Stock"
  mode="outlined"
  dense
  editable={false}
  value={String(stockquantity)}
  left={
    <TextInput.Icon
      icon="cash-check"
    />
  }
  style={{
    width: "50%",
    height: 44,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#ECFDF5",
  }}
  outlineStyle={{
    borderRadius: 12,
    borderColor: "#10B981",
  }}
/>

</View>



      {/* ================= ROW 4 ================= */}

    <View style={styles.row}>

  <TextInput
    label="WS Profit %"
    mode="outlined"
    dense
    keyboardType="numeric"
    value={
      item?.wsProfit
        ? String(item.wsProfit)
        : ""
    }
    onChangeText={(v) =>
      updateItem(
        index,
        "wsProfit",
        parseFloat(v) || 0
      )
    }
    left={
      <TextInput.Icon
        icon="percent"
      />
    }
   style={{
      ...styles.halfInput,
      backgroundColor: "#ECFDF5",
    }}
    outlineStyle={{
      borderRadius: 12,
      borderColor: "#10B981",
    }}
  />

  <TextInput
    label="WS Price"
    mode="outlined"
    dense
    editable={false}
    value={String(
      wsPrice.toFixed(2)
    )}
    left={
      <TextInput.Icon
        icon="cash"
      />
    }
    style={{
      ...styles.halfInput,
      backgroundColor: "#ECFDF5",
    }}
    outlineStyle={{
      borderRadius: 12,
      borderColor: "#10B981",
    }}
  />

</View>

      {/* ================= ROW 5 ================= */}

      <View
        style={
          styles.row
        }>

        <TextInput
          label="R Profit %"

          mode="outlined"

          keyboardType="numeric"

         value={
  item?.rProfit
    ? String(item.rProfit)
    : ''
}

          onChangeText={v =>
            updateItem(
              index,
              'rProfit',

              parseFloat(v) || 0,
            )
          }

         style={{
      ...styles.halfInput,
      backgroundColor: "#ECFDF5",
    }}
    outlineStyle={{
      borderRadius: 12,
      borderColor: "#10B981",
    }}
        />

        <TextInput
          label="R Price"

          mode="outlined"

          editable={false}

          value={String(
            rPrice.toFixed(2)
          )}

         style={{
      ...styles.halfInput,
      backgroundColor: "#ECFDF5",
    }}
    outlineStyle={{
      borderRadius: 12,
      borderColor: "#10B981",
    }}
        />

      </View>

    </View>

  );

})()}

        {/* DELETE */}


  <View
 style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  }}
>
  <TouchableOpacity
    onPress={() =>
      removeItem(item.id)
    }
    style={{
      marginRight: 12,
    }}
  >
    <MaterialCommunityIcons
      name="delete"
      size={22}
      color="red"
    />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() =>
      addRow()
    }
  >
    <MaterialCommunityIcons
      name="plus-circle"
      size={22}
      color="#10B981"
    />
  </TouchableOpacity>
</View>

      </View>
    );
  },
)}
       
       {/* SUMMARY */}

<Card
  style={
    styles.card
  }>

  <Text
    style={
      styles.sectionTitle
    }>

    Summary

  </Text>

  {/* ================= AMOUNT ================= */}

<View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>
    Amount Details
  </Text>
</View>

<View style={styles.amountRow}>

  {/* Discount */}

  <View style={styles.amountBox}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
      }}
    >
      <MaterialCommunityIcons
        name="sale"
        size={16}
        color="#F59E0B"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 12,
          fontWeight: "700",
          color: "#6B7280",
        }}
      >
        Discount
      </Text>
    </View>

    <TextInput
      mode="flat"
      keyboardType="numeric"
      value={discountAmount}
      onChangeText={setDiscountAmount}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={styles.boxInput}
    />
  </View>

  {/* Actual Amount */}

  <View style={styles.amountBox}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
      }}
    >
      <MaterialCommunityIcons
        name="cash"
        size={16}
        color="#10B981"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 12,
          fontWeight: "700",
          color: "#6B7280",
        }}
      >
        Actual Amount
      </Text>
    </View>

    <Text style={styles.amountValue}>
      ₹ {actualAmount.toFixed(2)}
    </Text>
  </View>

</View>

{/* Row 2 */}
<View style={styles.amountRow}>

  {/* Discount % */}

  <View style={styles.amountBox}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
      }}
    >
      <MaterialCommunityIcons
        name="percent"
        size={16}
        color="#F59E0B"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 12,
          fontWeight: "700",
          color: "#6B7280",
        }}
      >
        Discount %
      </Text>
    </View>

    <TextInput
      mode="flat"
      keyboardType="numeric"
      value={discountPercent}
      onChangeText={setDiscountPercent}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={styles.boxInput}
    />
  </View>

  {/* Gross Amount */}

  <View style={styles.amountBox}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
      }}
    >
      <MaterialCommunityIcons
        name="cash-multiple"
        size={16}
        color="#10B981"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 12,
          fontWeight: "700",
          color: "#6B7280",
        }}
      >
        Gross Amount
      </Text>
    </View>

    <Text
      style={{
        fontSize: 18,
        fontWeight: "900",
        color: "#111827",
      }}
    >
      ₹ {grossAmount.toFixed(2)}
    </Text>
  </View>

</View>


{/* Row 3 */}

<View style={styles.taxCard}>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    }}
  >
    <MaterialCommunityIcons
      name="percent-circle"
      size={16}
      color="#F59E0B"
    />

<View>
 <Text
      style={{
        marginLeft: 6,
        fontSize: 12,
        fontWeight: "700",
        color: "#6B7280",
      }}
    >
      Tax %
    </Text>
</View>
   
  </View>

  <TextInput
    mode="flat"
    keyboardType="numeric"
    value={
      selectedTaxType === "SINGLE TAX"
        ? String(
            safeItems[0]?.igst || 0
          )
        : String(
            (safeItems[0]?.sgst || 0) +
            (safeItems[0]?.cgst || 0)
          )
    }
    onChangeText={(value) => {

      const tax =
        Number(value) || 0;

      const updatedItems =
        safeItems.map(item => ({

          ...item,

          igst:
            selectedTaxType ===
            "SINGLE TAX"
              ? tax
              : item.igst,

          sgst:
            selectedTaxType ===
            "DOUBLE TAX"
              ? tax / 2
              : item.sgst,

          cgst:
            selectedTaxType ===
            "DOUBLE TAX"
              ? tax / 2
              : item.cgst,

        }));

      setItems(updatedItems);

    }}
    underlineColor="transparent"
    activeUnderlineColor="transparent"
    style={{
      backgroundColor: "transparent",
      height: 40,
    }}
    contentStyle={{
      fontSize: 20,
      fontWeight: "900",
      textAlign: "center",
    }}
  />
</View>

{/* Row 4 */}


<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  }}
>
  <View style={styles.taxCard}>
    <Text
      style={{
        fontSize: 12,
        fontWeight: "700",
        color: "#6B7280",
      }}
    >
      SGST
    </Text>

    <Text style={styles.taxValue}>
      ₹ {sgstAmount.toFixed(2)}
    </Text>
  </View>

  <View style={styles.taxCard}>
    <Text
      style={{
        fontSize: 12,
        fontWeight: "700",
        color: "#6B7280",
      }}
    >
      CGST
    </Text>

    <Text style={styles.taxValue}>
      ₹ {cgstAmount.toFixed(2)}
    </Text>
  </View>

  <View style={styles.taxCard}>
    <Text
      style={{
        fontSize: 12,
        fontWeight: "700",
        color: "#6B7280",
      }}
    >
      IGST
    </Text>

    <Text style={styles.taxValue}>
      ₹ {igstAmount.toFixed(2)}
    </Text>
  </View>
</View>


<View style={styles.netAmountCard}>

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    }}
  >
    <MaterialCommunityIcons
      name="cash-check"
      size={18}
      color="#FFFFFF"
    />

    <Text
      style={{
        marginLeft: 8,
        fontSize: 12,
        fontWeight: "700",
        color: "#FFFFFF",
      }}
    >
      Total Tax Amount
    </Text>
  </View>

  <Text
    style={{
      fontSize: 22,
      fontWeight: "900",
      color: "#FFFFFF",
      marginLeft:20,
    }}
  >
     ₹ {netAmount.toFixed(2)}
  </Text>

</View>

  {/* ================= BALANCE ================= */}

 <Text
  style={{
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    marginTop: 8,
  }}
>
  Balance Summary
</Text>

<View
  style={{
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  }}
>
  {/* PREVIOUS */}
  <View
    style={{
      width: "48%",
      backgroundColor: "#EEF2FF",
      borderRadius: 14,
      padding: 8,
      marginBottom: 8,
      minHeight: 62,
    }}
  >
    <Text
      style={{
        fontSize: 9,
        color: "#4F46E5",
        fontWeight: "700",
      }}
    >
      PREVIOUS
    </Text>

    <TextInput
      mode="flat"
      dense
      value={previousBalance}
      onChangeText={setPreviousBalance}
      keyboardType="numeric"
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 28,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 16,
        fontWeight: "900",
      }}
    />
  </View>

  {/* CURRENT BILL */}
  <View
    style={{
      width: "48%",
      backgroundColor: "#DCFCE7",
      borderRadius: 14,
      padding: 8,
      marginBottom: 8,
      minHeight: 62,
    }}
  >
    <Text
      style={{
        fontSize: 9,
        color: "#16A34A",
        fontWeight: "700",
      }}
    >
      CURRENT BILL
    </Text>

    <Text
      style={{
        marginTop: 2,
        fontSize: 16,
        fontWeight: "900",
        color: "#111827",
      }}
    >
      ₹{netAmount.toFixed(2)}
    </Text>
  </View>

  {/* TOTAL */}
  <View
    style={{
      width: "48%",
      backgroundColor: "#FEF3C7",
      borderRadius: 14,
      padding: 8,
      marginBottom: 8,
      minHeight: 62,
    }}
  >
    <Text
      style={{
        fontSize: 9,
        color: "#D97706",
        fontWeight: "700",
      }}
    >
      TOTAL
    </Text>

    <Text
      style={{
        marginTop: 2,
        fontSize: 16,
        fontWeight: "900",
        color: "#111827",
      }}
    >
      ₹{totalBalance.toFixed(2)}
    </Text>
  </View>

  {/* RECEIVED */}
  <View
    style={{
      width: "48%",
      backgroundColor: "#EFF6FF",
      borderRadius: 14,
      padding: 8,
      marginBottom: 8,
      minHeight: 62,
    }}
  >
    <Text
      style={{
        fontSize: 9,
        color: "#2563EB",
        fontWeight: "700",
      }}
    >
      RECEIVED
    </Text>

    <TextInput
      mode="flat"
      dense
      value={givenAmount}
      onChangeText={setGivenAmount}
      keyboardType="numeric"
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 28,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 16,
        fontWeight: "900",
      }}
    />
  </View>
</View>

  {/* ================= PAYMENT ================= */}

 <Text
  style={{
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    marginTop: 8,
  }}
>
  Payment Details
</Text>

<View
  style={{
    flexDirection: "row",
    marginBottom: 8,
  }}
>
  {/* LEDGER BALANCE */}

  <View
    style={{
      flex: 1,
      marginRight: 4,
      backgroundColor: "#EEF2FF",
      borderRadius: 14,
      padding: 8,
      borderWidth: 1,
      borderColor: "#C7D2FE",
    }}
  >
    <Text
      style={{
        fontSize: 9,
        color: "#4F46E5",
        fontWeight: "700",
      }}
    >
      LEDGER BALANCE
    </Text>

    <Text
      style={{
        marginTop: 2,
        fontSize: 18,
        fontWeight: "900",
        color: "#111827",
      }}
    >
      ₹{balanceAmount.toFixed(2)}
    </Text>
  </View>

  {/* ROUND OFF */}

  <View
    style={{
      flex: 1,
      marginLeft: 4,
      backgroundColor: "#FEFCE8",
      borderRadius: 14,
      padding: 8,
      borderWidth: 1,
      borderColor: "#FDE68A",
    }}
  >
    <Text
      style={{
        fontSize: 9,
        color: "#CA8A04",
        fontWeight: "700",
      }}
    >
      ROUND OFF
    </Text>

    <TextInput
      mode="flat"
      dense
      value={roundOff}
      onChangeText={setRoundOff}
      keyboardType="numeric"
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 28,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 18,
        fontWeight: "900",
        color: "#111827",
      }}
    />
  </View>
</View>

  {/* ================= TOTAL ================= */}

<LinearGradient
  colors={["#4F46E5", "#7C3AED"]}
  style={{
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <View>
    <Text
      style={{
        color: "rgba(255,255,255,0.8)",
        fontSize: 10,
        fontWeight: "700",
      }}
    >
      GRAND TOTAL
    </Text>

    <Text
      style={{
        color: "rgba(255,255,255,0.9)",
        fontSize: 11,
      }}
    >
      Including Taxes
    </Text>
  </View>

  <Text
    style={{
      color: "#FFF",
      fontSize: 22,
      fontWeight: "900",
    }}
  >
    ₹{finalTotal.toFixed(2)}
  </Text>
</LinearGradient>

</Card>

        {/* BUTTONS */}
<View
  style={{
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 10,
  }}
>

  {/* VIEW BILL */}

  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() =>
      router.push(
        "/src/screens/ViewPurchaseScreen"
      )
    }
    style={{
      flex: 1,
      marginRight: 6,
    }}
  >
    <LinearGradient
      colors={[
        "#EEF2FF",
        "#E0E7FF",
      ]}
      style={{
        height: 55,
        borderRadius: 16,

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="file-document-outline"
        size={20}
        color="#4F46E5"
      />

      <Text
        style={{
          marginLeft: 6,
          color: "#4F46E5",
          fontWeight: "800",
          fontSize: 13,
        }}
      >
        View Bill
      </Text>
    </LinearGradient>
  </TouchableOpacity>

  {/* SAVE */}

  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() =>
      handleSave(false)
    }
    style={{
      flex: 1,
      marginHorizontal: 3,
    }}
  >
    <LinearGradient
      colors={[
        "#10B981",
        "#059669",
      ]}
      style={{
        height: 55,
        borderRadius: 16,

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="content-save"
        size={20}
        color="#FFF"
      />

      <Text
        style={{
          marginLeft: 6,
          color: "#FFF",
          fontWeight: "800",
          fontSize: 13,
        }}
      >
        Save
      </Text>
    </LinearGradient>
  </TouchableOpacity>

  {/* RESET */}

  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => {
      // Reset Logic
    }}
    style={{
      flex: 1,
      marginLeft: 6,
    }}
  >
    <View
      style={{
        height: 55,

        borderRadius: 16,

        borderWidth: 1.5,
        borderColor: "#FCA5A5",

        backgroundColor: "#FEF2F2",

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="refresh"
        size={20}
        color="#DC2626"
      />

      <Text
        style={{
          marginLeft: 6,
          color: "#DC2626",
          fontWeight: "800",
          fontSize: 13,
        }}
      >
        Reset
      </Text>
    </View>
  </TouchableOpacity>

</View>
      </ScrollView>
    </View>
  );
}

