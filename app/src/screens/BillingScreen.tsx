import React, { useState, useEffect,useCallback,useRef } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Image,
} from "react-native";


import * as FileSystem from "expo-file-system/legacy";

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';


import {
  CameraView,
  useCameraPermissions
} from "expo-camera";

import {
  TextInput,
  Button,
  Card,
  Menu,
} from 'react-native-paper';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import DateTimePicker from '@react-native-community/datetimepicker';

import * as SQLite from 'expo-sqlite';


import { useRouter } from 'expo-router';

import styles from '../style/BillingScreenStyle';

import {
  saveInvoice,
  searchProductsByFirstLetter,getCustomers,
  getLedgers,getInvoiceById,getInvoiceItems, saveProductIfNotExists,getProductByBarcode
} from '../database/sqlite';

import {getDB} from '../database/sqlite';

import {
  useLocalSearchParams,
} from "expo-router";






export default function FullBillingScreen() {


useEffect(() => {

  if (
    permission &&
    !permission.granted
  ) {

    requestPermission();

  }

}, [permission]);


const productInputRefs = useRef({});

const [showScanner,
  setShowScanner] =
  useState(false);

const [scanned,
  setScanned] =
  useState(false);

const [barcode,setbarcode] = useState("");

const [
  permission,
  requestPermission
] = useCameraPermissions();

const saveProductImage = async (uri: string) => {
  try {
    const fileName =
      `product_${Date.now()}.jpg`;

    const permanentUri =
      FileSystem.documentDirectory +
      fileName;

    await FileSystem.copyAsync({
      from: uri,
      to: permanentUri,
    });

    console.log(
      "✅ PRODUCT IMAGE SAVED:",
      permanentUri
    );

    return permanentUri;

  } catch (error) {
    console.log(
      "❌ IMAGE COPY ERROR:",
      error
    );

    return uri;
  }
};


  
useFocusEffect(

  useCallback(() => {

    loadLedgers();

  }, [])

);


const searchBarcodeProduct =
  async () => {

  try {

    if (!barcode?.trim()) {

      Alert.alert(
        "Barcode",
        "Enter barcode"
      );

      return;
    }

    const product =
      await getProductByBarcode(
        barcode.trim()
      );

    console.log(
      "PRODUCT:",
      product
    );

    if (!product) {

      Alert.alert(
        "Not Found",
        "Product not found"
      );

      return;
    }

    const updatedItems =
      [...items];

    updatedItems[0] = {

      ...updatedItems[0],

      product:
        product.productenglishname || "",

      productimage:
        product.productimage || "",

      category:
        product.category || "",

      subcategory:
        product.subcategory || "",

      productcode:
        product.productcode || "",

      barcode:
        product.barcode || "",

      qty: 1,

      rate:
        Number(
          product.retail || 0
        ),

      purchase:
        Number(
          product.purchase || 0
        ),

      uom:
        product.uom || "",

      unittype:
        product.unittype || "",

      hsn:
        product.hsn || "",

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

      pricetype:
        product.pricetype  || "",
    };

    setItems(
      updatedItems
    );

  } catch (error) {

    console.log(
      "BARCODE ERROR:",
      error
    );

    Alert.alert(
      "Error",
      "Failed to search product"
    );

  }

};


const handleBarcodeChange =
  async (text) => {

  setbarcode(text);

  if (!text?.trim()) return;

  try {

    const product =
      await getProductByBarcode(
        text.trim()
      );

    console.log(
      "BARCODE PRODUCT:",
      product
    );

    if (!product) {
      return;
    }

    const updatedItems =
      [...items];

    updatedItems[0] = {

      ...updatedItems[0],

      product:
        product.productenglishname || "",

      productimage:
        product.productimage || "",

      category:
        product.category || "",

      subcategory:
        product.subcategory || "",

      productcode:
        product.productcode || "",

      barcode:
        product.barcode || "",

      qty: 1,

      rate:
        Number(
          product.retail || 0
        ),

      purchase:
        Number(
          product.purchase || 0
        ),

      unittype:
        product.unittype || "",

      uom:
        product.uom || "",

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

      hsn:
        product.hsn || "",
    };

    setItems(
      updatedItems
    );

  } catch (error) {

    console.log(
      "BARCODE SEARCH ERROR:",
      error
    );

  }

};



const params =
  useLocalSearchParams();

const invoiceId =

  Array.isArray(
    params?.invoiceId
  )

    ? params.invoiceId[0]

    : params?.invoiceId;


const [gstno,
  setGstno] =
  useState("");

const [billType,
  setBillType] =
  useState("3 inch Bill");

const [salesType,
  setSalesType] =
  useState("RETAIL");

const [paidType,
  setPaidType] =
  useState("CASH");

const isEdit =
  params?.isEdit === "true";




useEffect(() => {

  if (
    isEdit &&
    invoiceId
  ) {

    loadInvoiceData();

  }

  console.log(
  "📦 invoiceId =",
  invoiceId
);

}, [
  invoiceId,
  isEdit,
]);



  useState(false);

 

const loadInvoiceData =
  async () => {

  try {

    // =========================
    // CHECK ID
    // =========================

    if (!invoiceId) {

      console.log(
        "❌ invoiceId missing"
      );

      return;

    }

    console.log(
      "📦 invoiceId:",
      invoiceId
    );

    // =========================
    // LOAD INVOICE
    // =========================

    const invoice =

      await getInvoiceById(
        String(invoiceId)
      );

    console.log(
      "📦 INVOICE:",
      invoice
    );

    // =========================
    // LOAD ITEMS
    // =========================

    const invoiceItems =

      await getInvoiceItems(
        String(invoiceId)
      );

    console.log(
      "📦 ITEMS:",
      invoiceItems
    );

    // =========================
    // VALIDATE
    // =========================

    if (!invoice) {

      console.log(
        "❌ Invoice not found"
      );

      Alert.alert(
        "Error",
        "Invoice not found"
      );

      return;

    }

    // =========================
    // BASIC DETAILS
    // =========================

    setCustomer(
      invoice?.customer || ""
    );

const formatMobileForDisplay = (
  mobile: string = ""
) => {
  return String(mobile)
    .trim()
    .replace(/^\+91/, "");
};

  setMobileno(
  formatMobileForDisplay(
    invoice?.mobileno || ""
  )
);

    setDiscount(
      String(
        invoice?.discount || 0
      )
    );

    setTax(
      String(
        invoice?.tax || 0
      )
    );

    setTaxpercent(
      Number(
        invoice?.tax || 0
      )
    );

    setInvoiceDate(
      invoice?.date ||

      invoice?.invoiceDate ||

      ""
    );

    setSelectedLedger(
      invoice?.ledger || ""
    );

    setPaidType(
      invoice?.paidType ||
      "CASH"
    );

    setInvoiceno(
      String(

        invoice?.invoiceNo ||

        invoice?.invoiceno ||

        ""

      )
    );

    setSelectedTaxType(

      invoice?.taxType ||

      "DOUBLE TAX"

    );

    // =========================
    // ITEMS
    // =========================

    if (

      Array.isArray(
        invoiceItems
      ) &&

      invoiceItems.length > 0

    ) {

      const formattedItems =

        invoiceItems.map(
          (item) => ({

            id:
              item?.id?.toString() ||

              Date.now()
                .toString(),

            product:
              item?.product || "",

            productimage:
              item?.productimage || "",

            qty:
              Number(
                item?.qty
              ) || 1,

            rate:
              Number(
                item?.rate
              ) || 0,

            batch:
              item?.batch || "",

            unittype:
              item?.unittype || "",

            uom:
              item?.uom || "",

            weight:
              item?.weight || "",

            sgst:
              Number(
                item?.sgst
              ) || 0,

            cgst:
              Number(
                item?.cgst
              ) || 0,

            igst:
              Number(
                item?.igst
              ) || 0,

            taxAmount:
              Number(
                item?.taxAmount
              ) || 0,

            netRate:
              Number(
                item?.netRate
              ) || 0,

            discount:
              Number(
                item?.discount
              ) || 0,

          })
        );

      setItems(
        formattedItems
      );


      // =========================
// AUTO TAX DETECTION
// =========================

if (
  formattedItems.length > 0
) {

  const firstItem =
    formattedItems[0];

  // =====================
  // SINGLE TAX
  // =====================

  if (
    Number(
      firstItem.igst
    ) > 0
  ) {

    const igst =
      Number(
        firstItem.igst
      );

    setSelectedTaxType(
      "SINGLE TAX"
    );

    setTaxpercent(
      igst
    );

    setTax(
      String(igst)
    );

  }

  // =====================
  // DOUBLE TAX
  // =====================

  else {

    const totalTax =

      Number(
        firstItem.sgst
      ) +

      Number(
        firstItem.cgst
      );

    setSelectedTaxType(
      "DOUBLE TAX"
    );

    setTaxpercent(
      totalTax
    );

    setTax(
      String(totalTax)
    );

  }

}

    }

    // =========================
    // EMPTY ITEMS
    // =========================

    else {

      setItems([
        {
          id:
            Date.now()
              .toString(),

          product: "",

          qty: 1,

          rate: 0,

          batch: "",

          unittype: "",

          uom: "",

          weight: "",

          sgst: 0,

          cgst: 0,

          igst: 0,

          taxAmount: 0,

          netRate: 0,

          discount: 0,
        },
      ]);

    }

    console.log(
      "✅ Invoice loaded successfully"
    );

  } catch (e) {

    console.log(
      "❌ loadInvoiceData:",
      e
    );

    Alert.alert(
      "Error",
      "Failed to load invoice"
    );

  }

};

useEffect(() => {

  generateInvoiceNo();

}, []);


const generateInvoiceNo = async () => {

  try {

    const db =
      await getDB();

    if (!db) {

      return;

    }

    const lastInvoice =

      await db.getFirstAsync(

        `
        SELECT invoiceNo

        FROM invoices

        ORDER BY

        CAST(invoiceNo AS INTEGER)

        DESC

        LIMIT 1
        `

      );

    const nextInvoiceNo =

      lastInvoice?.invoiceNo

        ? Number(
            lastInvoice.invoiceNo
          ) + 1

        : 101;

    setInvoiceno(
      nextInvoiceNo
    );

    console.log(
      '📦 Invoice No:',
      nextInvoiceNo
    );

  } catch (e) {

    console.log(
      '❌ generateInvoiceNo:',
      e
    );

  }

};

const loadLedgers = async () => {

  try {

    const result =
      await getCustomers();

    console.log(
      "📦 Customers:",
      result
    );

    setLedgerList(
      Array.isArray(result)
        ? result
        : []
    );

  } catch (e) {

    console.log(
      "❌ loadLedgers:",
      e
    );

    setLedgerList([]);

  }

};


  const navigation =
    useNavigation();

  const route =
    useRoute();

  const router =
    useRouter();



const [suggestions,
  setSuggestions] =
  useState([]);

const [activeIndex,
  setActiveIndex] =
  useState(null);


  const [billMenuVisible,
  setBillMenuVisible] =
  useState(false);

const [salesMenuVisible,
  setSalesMenuVisible] =
  useState(false);

const [paidMenuVisible,
  setPaidMenuVisible] =
  useState(false);


const [visible, setVisible] =
  useState(false);


  const [invoiceno,setInvoiceno] = useState("");

  const [customer,
    setCustomer] =
    useState("");

  const [mobileno,
    setMobileno] =
    useState("");

  const [expandedId,
    setExpandedId] =
    useState(null);

  const [taxpercent,setTaxpercent] = useState(0);

  const [invoiceDate,
  setInvoiceDate] =
  useState(

    new Date()
      .toLocaleDateString(
        'en-GB'
      )

  );

  const [ledgerMenuVisible,
  setLedgerMenuVisible] =
  useState(false);

  const [selectedLedger,
  setSelectedLedger] =
  useState('COMMON CASH');

  const [ledgerList,
  setLedgerList] =
  useState([]);


  const [ledgers, setLedgers] =
  useState([]);

  // ================= DATE PICKER =================

 const [showDate,
  setShowDate] =
  useState(false);

const [selectedDate,
  setSelectedDate] =
  useState(new Date());


  // ================= EXTRA CHARGES =================

  const [discount,
    setDiscount] =
    useState("0");

  const [tax,
    setTax] =
    useState("");


    const [subtotal, setSubtotal] =
  useState(0);

const [
  discountAmount,
  setDiscountAmount
] = useState(0);

const [taxAmount, setTaxAmount] =
  useState(0);

const [finalTotal, setFinalTotal] =
  useState(0);


  const [
  selectedTaxType,
  setSelectedTaxType
] = useState(
  "DOUBLE TAX"
);


  // ================= ITEMS =================

const [items,
  setItems] =
  useState([
    {
      id:
        Date.now().toString(),

      product: '',

      productimage: '',

      qty: 1,

      rate: 0,

      batch: '',

      unittype: '',

      uom: '',

      weight: '',

      sgst: '',

      cgst: '',

      igst: '',

      taxAmount: 0,

      netRate: 0,
    },
  ]);

 // ================= ADD ROW =================


 const addRow = () => {
  const newItem = {
    id:
      `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`,

    product: "",
    productcode: "",
    productimage: "",

    category: "",
    subcategory: "",

    producttype: "",
    subtype: "",
    brandname: "",

    qty: 1,

    rate: 0,
    amount: 0,

    purchase: 0,
    wholesale: 0,
    retail: 0,
    mrp: 0,

    discount: 0,
    finalprice: 0,

    netRate: 0,

    batch: "",
    unit: "",
    unittype: "",
    uom: "",
    weight: "",

    sgst: 0,
    cgst: 0,
    igst: 0,

    taxAmount: 0,

    barcode: "",
    sellingcode: "",

    hsn: "",
    hsncode: "",

    mfd: "",
    exp: "",
    bestbefore: "",
  };

  setItems((prevItems) => [
    ...prevItems,
    newItem,
  ]);

  setActiveIndex(null);
  setSuggestions([]);
};


  // ================= UPDATE ITEM =================

const updateItem = (
  index,
  key,
  value
) => {
  try {

    // =====================================================
    // COPY CURRENT ITEMS
    // =====================================================

    const data = [...items];

    if (!data[index]) {
      console.log(
        "❌ INVALID ITEM INDEX:",
        index
      );
      return;
    }


    // =====================================================
    // UPDATE FIELD
    // =====================================================

    data[index] = {
      ...data[index],
      [key]: value,
    };


    // =====================================================
    // CURRENT ITEM
    // =====================================================

    const item = data[index];


    // =====================================================
    // SAFE NUMERIC VALUES
    // =====================================================

    const qty =
      Number(item.qty) || 0;

    const rate =
      Number(item.rate) || 0;


    // =====================================================
    // AMOUNT
    // =====================================================

    const amount =
      qty * rate;


    // =====================================================
    // TAX VALUES
    // =====================================================

    let taxPercent = 0;

    let taxAmount = 0;

    let sgst = 0;
    let cgst = 0;
    let igst = 0;


    // =====================================================
    // SINGLE TAX
    // =====================================================

    if (
      selectedTaxType ===
      "SINGLE TAX"
    ) {

      igst =
        Number(item.igst) || 0;

      taxPercent =
        igst;

      taxAmount =
        amount *
        (igst / 100);

    }


    // =====================================================
    // DOUBLE TAX
    // =====================================================

    else {

      sgst =
        Number(item.sgst) || 0;

      cgst =
        Number(item.cgst) || 0;

      taxPercent =
        sgst + cgst;

      taxAmount =
        amount *
        (
          taxPercent / 100
        );
    }


    // =====================================================
    // UPDATE CALCULATED VALUES
    // =====================================================

    data[index] = {

      ...item,

      qty,

      rate,

      amount,

      sgst,

      cgst,

      igst,

      taxAmount,

      netRate:
        rate +
        taxAmount,

    };


    // =====================================================
    // UPDATE GLOBAL TAX %
    // =====================================================

    setTaxpercent(
      taxPercent
    );


    // =====================================================
    // SAVE STATE
    // =====================================================

    setItems(data);


    console.log(
      "🧾 ITEM UPDATED:",
      {
        index,

        product:
          data[index].product,

        productcode:
          data[index].productcode,

        productimage:
          data[index].productimage,

        category:
          data[index].category,

        subcategory:
          data[index].subcategory,

        qty,

        rate,

        amount,

        sgst,

        cgst,

        igst,

        taxAmount,

        netRate:
          data[index].netRate,
      }
    );

  } catch (e) {

    console.log(
      "❌ updateItem ERROR:",
      e
    );

  }
};

  // ================= REMOVE ITEM =================

 const removeItem = (id) => {
  try {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter(
        (item) => item.id !== id
      );

      console.log(
        "🗑️ ITEM REMOVED:",
        id
      );

      console.log(
        "📦 REMAINING ITEMS:",
        updatedItems.length
      );

      return updatedItems;
    });
  } catch (error) {
    console.log(
      "❌ removeItem ERROR:",
      error
    );
  }
};


useEffect(() => {

  // SUBTOTAL

  const calculatedSubtotal =

    items.reduce(

      (sum, item) => {

        return (

          sum +

          (
            Number(item.qty || 0) *

            Number(item.rate || 0)
          )

        );

      },

      0

    );

  // DISCOUNT

  const calculatedDiscount =

    Number(discount || 0);

  // TAXABLE

  const taxableAmount =

    calculatedSubtotal -

    calculatedDiscount;

  // TAX

  const calculatedTax =

    items.reduce(

      (sum, item) => {

        const qty =

          Number(item.qty || 0);

        const rate =

          Number(item.rate || 0);

        const amount =

          qty * rate;

        let itemTax = 0;

        // SINGLE TAX

        if (

          selectedTaxType ===

          'SINGLE TAX'

        ) {

          const igst =

            Number(
              item.igst || 0
            );

          itemTax =

            amount *

            (igst / 100);

        }

        // DOUBLE TAX

        else {

          const sgst =

            Number(
              item.sgst || 0
            );

          const cgst =

            Number(
              item.cgst || 0
            );

          const totalTax =

            sgst + cgst;

          itemTax =

            amount *

            (totalTax / 100);

        }

        return sum + itemTax;

      },

      0

    );

  // FINAL TOTAL

  const calculatedFinalTotal =

    taxableAmount +

    calculatedTax;

  // SET STATES

  setSubtotal(
    calculatedSubtotal
  );

  setDiscountAmount(
    calculatedDiscount
  );

  setTaxAmount(
    calculatedTax
  );

  setFinalTotal(
    calculatedFinalTotal
  );

}, [

  items,

  discount,

  tax,

  selectedTaxType,

]);







const [taxMenuVisible,
  setTaxMenuVisible] =
  useState(false);

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


/* ================= TOTAL TAX ================= */
const totalTax =

  items.reduce(

    (
      sum,
      item
    ) => {

      const productTax =

        (
          Number(
            item.sgst
          ) || 0
        ) +

        (
          Number(
            item.cgst
          ) || 0
        ) +

        (
          Number(
            item.igst
          ) || 0
        );

      const itemTaxAmount =

        (
          item.qty *
          item.rate
        ) *

        (
          productTax / 100
        );

      return (
        sum +
        itemTaxAmount
      );

    },

    0
  );

  // ================= SAVE =================
const handleSave = async () => {
  try {

    // =====================================================
    // CUSTOMER VALIDATION
    // =====================================================

    if (!customer?.trim()) {
      alert("Please enter customer name");
      return;
    }


    // =====================================================
    // MOBILE VALIDATION
    // =====================================================

    if (!mobileno?.trim()) {
      alert("Please enter mobile number");
      return;
    }

    if (mobileno.length !== 10) {
      alert(
        "Please enter valid 10 digit mobile number"
      );
      return;
    }


    // =====================================================
    // ITEM VALIDATION
    // =====================================================

    if (!items || items.length === 0) {
      alert("Please add products");
      return;
    }


    // =====================================================
    // EMPTY PRODUCT
    // =====================================================

    const hasEmptyProduct = items.some(
      (item) =>
        !item.product ||
        !String(item.product).trim()
    );

    if (hasEmptyProduct) {
      alert("Please select product");
      return;
    }


    // =====================================================
    // INVALID QTY
    // =====================================================

    const hasInvalidQty = items.some(
      (item) =>
        Number(item.qty || 0) <= 0
    );

    if (hasInvalidQty) {
      alert("Please enter valid quantity");
      return;
    }


    // =====================================================
    // DATABASE
    // =====================================================

    const db = await getDB();

    if (!db) {
      alert("Database not found");
      return;
    }


    // =====================================================
    // NEXT INVOICE NUMBER
    // =====================================================

    const lastInvoice =
      await db.getFirstAsync(
        `
        SELECT invoiceNo
        FROM invoices
        ORDER BY CAST(invoiceNo AS INTEGER) DESC
        LIMIT 1
        `
      );

    const nextInvoiceNo =
      lastInvoice?.invoiceNo
        ? Number(lastInvoice.invoiceNo) + 1
        : 100;


    // =====================================================
    // INVOICE ID
    // =====================================================

    const invoiceId =
      Date.now().toString();


    // =====================================================
    // GST
    // =====================================================

    let invoiceSgst = 0;
    let invoiceCgst = 0;
    let invoiceIgst = 0;

    if (
      selectedTaxType === "DOUBLE TAX"
    ) {

      invoiceSgst =
        Number(taxAmount || 0) / 2;

      invoiceCgst =
        Number(taxAmount || 0) / 2;

    } else {

      invoiceIgst =
        Number(taxAmount || 0);

    }


    // =====================================================
    // NORMALIZE ITEMS
    // =====================================================
    // ⭐ IMPORTANT:
    // Make sure productimage is carried into invoice items.
    // =====================================================

    const invoiceItems = items.map(
      (item, index) => {

        const quantity =
          Number(item.qty || 0);

        const rate =
          Number(item.rate || 0);

        const amount =
          Number(
            item.amount ??
            quantity * rate
          );

        const productImage =
          item.productimage ||
          item.productImage ||
          item.image ||
          "";

        const normalizedItem = {

          ...item,

          id:
            item.id ||
            `${Date.now()}_${index}`,

          invoiceId:

            invoiceId,

          product:
            String(
              item.product || ""
            ),

          productcode:
            String(
              item.productcode || ""
            ),

          // ⭐ IMAGE
          productimage:
            String(
              productImage
            ),

          category:
            String(
              item.category || ""
            ),

          subcategory:
            String(
              item.subcategory || ""
            ),

          barcode:
            String(
              item.barcode || ""
            ),

          qty:
            quantity,

          rate:
            rate,

          amount:
            amount,

          batch:
            String(
              item.batch || ""
            ),

          unit:
            String(
              item.unit ||
              item.unittype ||
              ""
            ),

          uom:
            String(
              item.uom || ""
            ),

          weight:
            String(
              item.weight || ""
            ),

          netRate:
            Number(
              item.netRate ??
              rate
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

          createdAt:
            item.createdAt ||
            new Date().toISOString(),
        };


        // DEBUG
        console.log(
          "🖼️ INVOICE ITEM IMAGE:",
          normalizedItem.product,
          normalizedItem.productimage
        );


        return normalizedItem;
      }
    );


    // =====================================================
    // INVOICE DATA
    // =====================================================

    const invoiceData = {

      id:
        invoiceId,

      invoiceNo:
        nextInvoiceNo,

      customer:
        customer.trim(),

      mobileno:
        "+91" + mobileno,

      ledger:
        selectedLedger ||
        "COMMON CASH",

      gstNo:
        "",

      taxType:
        selectedTaxType,

      paidType:
        "CASH",

      billType:
        "3Inch RECEIPT",

      salesType:
        "RETAIL",

      date:
        invoiceDate,

      subtotal:
        Number(
          subtotal || 0
        ),

      discount:
        Number(
          discountAmount || 0
        ),

      tax:
        Number(
          taxAmount || 0
        ),

      sgst:
        Number(
          invoiceSgst || 0
        ),

      cgst:
        Number(
          invoiceCgst || 0
        ),

      igst:
        Number(
          invoiceIgst || 0
        ),

      total:
        Number(
          finalTotal || 0
        ),

      createdAt:
        new Date().toISOString(),
    };


    console.log(
      "📦 SAVING INVOICE:",
      JSON.stringify(
        invoiceData,
        null,
        2
      )
    );


    // =====================================================
    // SAVE / UPDATE PRODUCTS
    // =====================================================

    for (
      const item of invoiceItems
    ) {

      const existingProduct =
        await db.getFirstAsync(
          `
          SELECT *
          FROM products
          WHERE productenglishname = ?
          LIMIT 1
          `,
          [
            item.product
          ]
        );


      // ===================================================
      // PRODUCT DOES NOT EXIST
      // ===================================================

      if (!existingProduct) {

        const codeResult =
          await db.getFirstAsync(
            `
            SELECT MAX(
              CAST(productcode AS INTEGER)
            ) AS maxCode
            FROM products
            `
          );


        const productCode =
          codeResult?.maxCode
            ? String(
                Number(
                  codeResult.maxCode
                ) + 1
              )
            : "1";


        const productId =
          Date.now().toString() +
          Math.floor(
            Math.random() * 10000
          );


        await db.runAsync(
          `
          INSERT INTO products (

            id,

            productcode,

            productenglishname,

            producttamilName,

            category,

            subcategory,

            producttype,

            unittype,

            uom,

            purchase,

            profit,

            loss,

            wholesale,

            retail,

            mrp,

            stockquantity,

            stockvalue,

            productimage,

            barcode,

            mfd,

            exp,

            sgst,

            cgst,

            igst,

            hsn,

            hsncode,

            createdAt

          )

          VALUES (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?
          )
          `,
          [

            productId,

            productCode,

            item.product || "",

            item.producttamilName ||
              "",

            // ⭐ CATEGORY
            item.category || "",

            // ⭐ SUBCATEGORY
            item.subcategory || "",

            item.producttype ||
              "",

            item.unittype ||
              "",

            item.uom ||
              "",

            Number(
              item.purchase || 0
            ),

            Number(
              item.profit || 0
            ),

            Number(
              item.loss || 0
            ),

            Number(
              item.wholesale || 0
            ),

            Number(
              item.rate || 0
            ),

            Number(
              item.mrp ||
              item.rate ||
              0
            ),

            Number(
              item.qty || 0
            ),

            Number(
              item.rate || 0
            ) *
              Number(
                item.qty || 0
              ),

            // ⭐ PRODUCT IMAGE
            item.productimage ||
              "",

            item.barcode ||
              "",

            item.mfd ||
              "",

            item.exp ||
              "",

            Number(
              item.sgst || 0
            ),

            Number(
              item.cgst || 0
            ),

            Number(
              item.igst || 0
            ),

            item.hsn ||
              "",

            item.hsncode ||
              "",

            new Date()
              .toISOString(),
          ]
        );


        console.log(
          "✅ NEW PRODUCT SAVED:",
          item.product
        );

        console.log(
          "🖼️ PRODUCT IMAGE:",
          item.productimage
        );

      } else {

        // =================================================
        // EXISTING PRODUCT
        // =================================================
        // Update image/category if missing.
        // =================================================

        await db.runAsync(
          `
          UPDATE products
          SET

            productimage =
              CASE
                WHEN ? != ""
                THEN ?
                ELSE productimage
              END,

            category =
              CASE
                WHEN ? != ""
                THEN ?
                ELSE category
              END,

            subcategory =
              CASE
                WHEN ? != ""
                THEN ?
                ELSE subcategory
              END

          WHERE id = ?
          `,
          [

            item.productimage || "",
            item.productimage || "",

            item.category || "",
            item.category || "",

            item.subcategory || "",
            item.subcategory || "",

            existingProduct.id,
          ]
        );


        console.log(
          "✅ EXISTING PRODUCT CHECKED:",
          item.product
        );

        console.log(
          "🖼️ EXISTING PRODUCT IMAGE:",
          item.productimage
        );
      }
    }


    // =====================================================
    // SAVE INVOICE + INVOICE ITEMS
    // =====================================================

    const success =
      await saveInvoice(
        invoiceData,
        invoiceItems
      );


    if (!success) {

      alert(
        "Failed to save invoice"
      );

      return;
    }


    // =====================================================
    // VERIFY SAVED ITEMS
    // =====================================================

    const savedItems =
      await getInvoiceItems(
        invoiceId
      );

    console.log(
      "✅ SAVED INVOICE ITEMS:",
      JSON.stringify(
        savedItems,
        null,
        2
      )
    );


    // =====================================================
    // SUCCESS
    // =====================================================

    alert(
      "Invoice Saved Successfully"
    );


    // =====================================================
    // RESET
    // =====================================================

    setCustomer("");

    setMobileno("");

    setItems([]);

    setSubtotal(0);

    setDiscountAmount(0);

    setTaxAmount(0);

    setFinalTotal(0);


    // =====================================================
    // NAVIGATE
    // =====================================================

    router.push(
      "/src/screens/ViewInvoiceScreen"
    );

  } catch (e) {

    console.log(
      "❌ handleSave ERROR:",
      e
    );

    alert(
      "Failed to save invoice"
    );
  }
};



const autoTax =

  Array.isArray(items)

    ? items.reduce(

        (
          total,
          currentItem
        ) => {

          const qty =

            Number(
              currentItem?.qty
            ) || 0;

          const rate =

            Number(
              currentItem?.rate
            ) || 0;

          const amount =
            qty * rate;

          // SINGLE TAX

          if (
            selectedTaxType ===
            'SINGLE TAX'
          ) {

            const igst =

              Number(
                currentItem?.igst
              ) || 0;

            return (

              total +

              (
                amount *
                (igst / 100)
              )

            );

          }

          // DOUBLE TAX

          const sgst =

            Number(
              currentItem?.sgst
            ) || 0;

          const cgst =

            Number(
              currentItem?.cgst
            ) || 0;

          const totalGst =
            sgst + cgst;

          return (

            total +

            (
              amount *
              (totalGst / 100)
            )

          );

        },

        0

      )

    : 0;

  return (

    <View
      style={{
        flex: 1,
        backgroundColor:
          '#f4f6f8',
      }}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#2c5364"
      />

      {/* HEADER */}

      <LinearGradient
 colors={[
  "#7C3AED",
  "#6D28D9",
  "#8B5CF6",
]}
  start={{
    x: 0,
    y: 0,
  }}
  end={{
    x: 1,
    y: 1,
  }}
  style={{
    paddingTop: 16,
    paddingBottom: 18,

    paddingHorizontal: 18,

    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    elevation: 10,
  }}>

  <SafeAreaView>

    <View
      style={{
        flexDirection: "row",

        alignItems: "center",

        justifyContent:
          "space-between",

        height: 62,
      }}>

      {/* ========================= */}
      {/* BACK BUTTON */}
      {/* ========================= */}

      <TouchableOpacity
        activeOpacity={0.9}

        onPress={() =>
          navigation.goBack()
        }

        style={{
          width: 46,
          height: 46,

          borderRadius: 16,

        
          justifyContent:
            "center",

          alignItems:
            "center",

          borderWidth: 1,
          borderColor:
            "rgba(255,255,255,0.08)",
        }}>

        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color="#fff"
        />

      </TouchableOpacity>

      {/* ========================= */}
      {/* TITLE */}
      {/* ========================= */}

      <View
        style={{
          flex: 1,

          alignItems: "center",

          paddingHorizontal: 12,
        }}>

        <Text
          numberOfLines={1}
          style={{
            color: "#fff",

            fontSize: 22,

            fontWeight: "800",

            letterSpacing: 0.4,
          }}>

          {isEdit
            ? "Edit Invoice"
            : "Sales Invoice"}

        </Text>

        <Text
          style={{
            marginTop: 2,

            fontSize: 12,

            color:
              "rgba(255,255,255,0.7)",

            fontWeight: "600",
          }}>

          Manage billing details

        </Text>

      </View>

     

      

    </View>

  </SafeAreaView>

</LinearGradient>

      <ScrollView
        style={{ flex: 1 }}

        contentContainerStyle={{
          padding: 15,
          paddingBottom: 120,
        }}

        showsVerticalScrollIndicator={false}

        keyboardShouldPersistTaps="handled">

        {/* INVOICE DETAILS */}

      <Card
  style={[
    styles.card,
    {
      borderRadius: 28,
      padding: 18,

      backgroundColor: "#FFFFFF",

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.06,
      shadowRadius: 10,

      elevation: 5,
    },
  ]}>

  {/* ========================= */}
  {/* HEADER */}
  {/* ========================= */}
<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  }}>

  {/* LEFT SIDE */}

  <View style={{ flex: 1 }}>

    <Text
      style={{
        fontSize: 20,
        fontWeight: "800",
        color: "#111827",
      }}>
      Invoice Details
    </Text>

    <Text
      style={{
        marginTop: 3,
        fontSize: 13,
        color: "#64748B",
      }}>
      Create and manage invoice
    </Text>

  </View>
  <LinearGradient
      colors={[
        "#4F46E5",
        "#7C3AED",
      ]}
      style={{
        width: 52,
        height: 52,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
      }}>

      <MaterialCommunityIcons
        name="receipt-text-outline"
        size={26}
        color="#fff"
      />

    </LinearGradient>


</View>

  {/* INVOICE NO */}

<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom:20,
  }}
>

  {/* INVOICE NO */}

 <TextInput
  mode="outlined"
  value={barcode}
  onChangeText={handleBarcodeChange}
  placeholder="Bar Code"
  dense
  style={{
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    marginRight: 10,
  }}
  outlineColor="#D1D5DB"
  activeOutlineColor="#4F46E5"
  left={
    <TextInput.Icon
      icon="barcode"
    />
  }
/>

{/* BARCODE BUTTON */}

<TouchableOpacity
  onPress={() => {
    setScanned(false);
    setShowScanner(true);
  }}
  activeOpacity={0.9}
>
  <LinearGradient
    colors={["#10B981", "#059669"]}
    style={{
      width: 50,
      height: 50,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <MaterialCommunityIcons
      name="barcode-scan"
      size={24}
      color="#FFF"
    />
  </LinearGradient>
</TouchableOpacity>

{/* SCANNER */}

{showScanner && (

  <View
    style={{
      position: "absolute",
      height:300,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#000",
      zIndex: 999999,
    }}
  >

    <CameraView
      style={{
        flex: 1,
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
                "SCANNED:",
                data
              );

              const product =
                await getProductByBarcode(
                  data
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
                  product.productenglishname || "",

                productcode:
                  product.productcode || "",

                barcode:
                  product.barcode || "",

                qty: 1,

                rate:
                  Number(
                    product.retail || 0
                  ),

                purchase:
                  Number(
                    product.purchase || 0
                  ),

                uom:
                  product.uom || "",

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

              setbarcode(data);

              setShowScanner(false);
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
        bottom: -70,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor:
          "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="close"
        size={30}
        color="#FFF"
      />
    </TouchableOpacity>

  </View>

)}

</View>

  {/* ========================= */}
  {/* DATE + INVOICE */}
  {/* ========================= */}

  <View
    style={{
      flexDirection: "row",
      marginBottom: 16,
    }}>

    {/* DATE */}

    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() =>
        setShowDate(true)
      }
      style={{
        flex: 1,
        marginRight: 8,
      }}>

      <LinearGradient
        colors={[
          "#EEF2FF",
          "#F8FAFF",
        ]}
        style={{
          height: 62,

          borderRadius: 20,

          paddingHorizontal: 14,

          flexDirection: "row",

          alignItems: "center",

          justifyContent:
            "space-between",

          borderWidth: 1,
          borderColor: "#E0E7FF",
        }}>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>

          <View
            style={{
              width: 40,
              height: 40,

              borderRadius: 14,

              backgroundColor:
                "#6366F1",

              justifyContent:
                "center",

              alignItems:
                "center",

              marginRight: 12,
            }}>

            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={20}
              color="#fff"
            />

          </View>

          <View>

            <Text
              style={{
                fontSize: 11,

                color: "#6366F1",

                fontWeight: "800",

                letterSpacing: 1,
              }}>

              DATE

            </Text>

            <Text
              style={{
                marginTop: 2,

                fontSize: 15,

                fontWeight: "700",

                color: "#111827",
              }}>

              {invoiceDate}

            </Text>

          </View>

        </View>

       

      </LinearGradient>

    </TouchableOpacity>

    {/* INVOICE */}

    <View
      style={{
        flex: 1,
        marginLeft: 8,
      }}>

      <TextInput
        label="Invoice No"

        value={String(invoiceno)}

        editable={false}

        mode="outlined"

        style={{
          backgroundColor: "#fff",
        }}

        contentStyle={{
          fontSize: 15,
          fontWeight: "700",
        }}

        outlineStyle={{
          borderRadius: 20,
          borderWidth: 1.2,
          borderColor: "#E2E8F0",
        }}

        left={
          <TextInput.Icon
            icon="receipt"
            color="#10B981"
          />
        }
      />

    </View>

  </View>


{/* ========================= */}
{/* EXTRA DETAILS */}
{/* ========================= */}

<View
  style={{
    flexDirection: "row",
    marginBottom: 14,
  }}>

  {/* GST NO */}

  <TextInput
    label="GST No"

    value={gstno}

    onChangeText={setGstno}

    mode="outlined"

    style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: "#fff",
    }}

    outlineStyle={{
      borderRadius: 20,
      borderWidth: 1.2,
      borderColor: "#E2E8F0",
    }}

    left={
      <TextInput.Icon
        icon="file-certificate-outline"
        color="#F59E0B"
      />
    }
  />

 

</View>

{/* ========================= */}
{/* TAX + SALES + PAID */}
{/* ========================= */}
 {/* BILL TYPE */}

  <Menu
    visible={billMenuVisible}

    onDismiss={() =>
      setBillMenuVisible(false)
    }

    anchor={

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          setBillMenuVisible(true)
        }
        style={{
          flex: 1,
          marginLeft: 8,
        }}>

        <View pointerEvents="none">

          <TextInput
            label="Bill Type"

            value={billType}

            editable={false}

            mode="outlined"

            style={{
              backgroundColor: "#fff",
            }}

            outlineStyle={{
              borderRadius: 20,
              borderWidth: 1.2,
              borderColor: "#E2E8F0",
            }}

            left={
              <TextInput.Icon
                icon="file-document-outline"
                color="#EF4444"
              />
            }

            right={
              <TextInput.Icon
                icon="chevron-down"
                color="#64748B"
              />
            }
          />

        </View>

      </TouchableOpacity>

    }>

    <Menu.Item
      title="4 inch BILL"

      leadingIcon="file-document"

      onPress={() => {

        setBillType(
          "4 - inch BILL"
        );

        setBillMenuVisible(
          false
        );

      }}
    />

    <Menu.Item
      title="3 - inch Bill"

      leadingIcon="file-outline"

      onPress={() => {

        setBillType(
          "3 inch Bill"
        );

        setBillMenuVisible(
          false
        );

      }}
    />

  </Menu>



<View
  style={{
    flexDirection: "row",
    marginTop:15,
    marginBottom: 10,
  }}>



  

  {/* PAID TYPE */}

  <View
    style={{
      flex: 1,
      marginLeft: 6,
    }}>

    <Menu
      visible={paidMenuVisible}

      onDismiss={() =>
        setPaidMenuVisible(false)
      }

      anchor={

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            setPaidMenuVisible(true)
          }>

          <View pointerEvents="none">

            <TextInput
              label="Paid Type"

              value={paidType}

              editable={false}

              mode="outlined"

              style={{
                backgroundColor: "#fff",
              }}

              outlineStyle={{
                borderRadius: 20,
                borderWidth: 1.2,
                borderColor: "#E2E8F0",
              }}

              left={
                <TextInput.Icon
                  icon="cash-multiple"
                  color="#EC4899"
                />
              }

              right={
                <TextInput.Icon
                  icon="chevron-down"
                  color="#64748B"
                />
              }
            />

          </View>

        </TouchableOpacity>

      }>

      <Menu.Item
        title="CASH"

        leadingIcon="cash"

        onPress={() => {

          setPaidType(
            "CASH"
          );

          setPaidMenuVisible(
            false
          );

        }}
      />

      <Menu.Item
        title="CARD"

        leadingIcon="credit-card-outline"

        onPress={() => {

          setPaidType(
            "CARD"
          );

          setPaidMenuVisible(
            false
          );

        }}
      />

      <Menu.Item
        title="UPI"

        leadingIcon="qrcode-scan"

        onPress={() => {

          setPaidType(
            "UPI"
          );

          setPaidMenuVisible(
            false
          );

        }}
      />

    </Menu>

  </View>

</View>


{/* SALES TYPE */}



  <View
    style={{
      flex: 1,
      marginHorizontal: 6,
    }}>

    <Menu
      visible={salesMenuVisible}

      onDismiss={() =>
        setSalesMenuVisible(false)
      }

      anchor={

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            setSalesMenuVisible(true)
          }>

          <View pointerEvents="none">

            <TextInput
              label="Sales Type"

              value={salesType}

              editable={false}

              mode="outlined"

              style={{
                backgroundColor: "#fff",
              }}

              outlineStyle={{
                borderRadius: 20,
                borderWidth: 1.2,
                borderColor: "#E2E8F0",
              }}

              left={
                <TextInput.Icon
                  icon="cart-outline"
                  color="#10B981"
                />
              }

              right={
                <TextInput.Icon
                  icon="chevron-down"
                  color="#64748B"
                />
              }
            />

          </View>

        </TouchableOpacity>

      }>

      <Menu.Item
        title="RETAIL"

        leadingIcon="storefront-outline"

        onPress={() => {

          setSalesType(
            "RETAIL"
          );

          setSalesMenuVisible(
            false
          );

        }}
      />

      <Menu.Item
        title="WHOLESALE"

        leadingIcon="warehouse"

        onPress={() => {

          setSalesType(
            "WHOLESALE"
          );

          setSalesMenuVisible(
            false
          );

        }}
      />

    </Menu>

  </View>


  {/* TAX TYPE */}

  <View
    style={{
      flex: 1,
      marginTop:15,
      marginBottom:10,
      marginRight: 6,
    }}>

    <Menu
      visible={taxMenuVisible}

      onDismiss={() =>
        setTaxMenuVisible(false)
      }

      anchor={

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            setTaxMenuVisible(true)
          }>

          <View pointerEvents="none">

            <TextInput
              label="Tax Type"

              value={selectedTaxType}

              editable={false}

              mode="outlined"

              style={{
                backgroundColor: "#fff",
              }}

              outlineStyle={{
                borderRadius: 20,
                borderWidth: 1.2,
                borderColor: "#E2E8F0",
              }}

              left={
                <TextInput.Icon
                  icon="calculator-variant-outline"
                  color="#6366F1"
                />
              }

              right={
                <TextInput.Icon
                  icon="chevron-down"
                  color="#64748B"
                />
              }
            />

          </View>

        </TouchableOpacity>

      }>

      <Menu.Item
        title="SINGLE TAX"

        leadingIcon="percent-outline"

        onPress={() => {

          setSelectedTaxType(
            "SINGLE TAX"
          );

          setTaxMenuVisible(
            false
          );

        }}
      />

      <Menu.Item
        title="DOUBLE TAX"

        leadingIcon="calculator"

        onPress={() => {

          setSelectedTaxType(
            "DOUBLE TAX"
          );

          setTaxMenuVisible(
            false
          );

        }}
      />

    </Menu>

  </View>


  {/* DATE MODAL */}

  {showDate && (

    <DateTimePicker
      value={selectedDate}

      mode="date"

      display="default"

      onChange={(
        event,
        date
      ) => {

        setShowDate(false);

        if (date) {

          setSelectedDate(
            date
          );

          setInvoiceDate(

            date.toLocaleDateString(
              "en-GB"
            )

          );

        }

      }}
    />

  )}

  {/* ========================= */}
  {/* LEDGER */}
  {/* ========================= */}

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
        }>

        <View pointerEvents="none">

          <TextInput
            label="Select Ledger"

            value={selectedLedger}

            editable={false}

            mode="outlined"

            style={{
              backgroundColor: "#fff",
              marginBottom: 16,
            }}

            contentStyle={{
              fontWeight: "700",
            }}

            outlineStyle={{
              borderRadius: 20,
              borderWidth: 1.2,
              borderColor: "#E2E8F0",
            }}

            left={
              <TextInput.Icon
                icon="account-cash-outline"
                color="#F59E0B"
              />
            }

            right={
              <TextInput.Icon
                icon="chevron-down"
                color="#64748B"
              />
            }
          />

        </View>

      </TouchableOpacity>

    }>

    {Array.isArray(ledgerList) &&

      ledgerList.map((item) => (

        <Menu.Item
          key={String(item.id)}

          title={
            item.nameEnglish ||
            "Ledger"
          }

          leadingIcon="account-outline"

          onPress={() => {

            setSelectedLedger(

              item.nameEnglish || ""

            );

            setLedgerMenuVisible(
              false
            );

          }}
        />

      ))}

    {ledgerList?.length === 0 && (

      <Menu.Item
        title="No Ledgers Found"
        disabled
      />

    )}

    <Menu.Item
      title="+ Add Ledger"

      leadingIcon="plus-circle-outline"

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

  {/* ========================= */}
  {/* CUSTOMER DETAILS */}
  {/* ========================= */}

  <View
    style={{
      flexDirection: "row",
      marginBottom: 14,
    }}>

    <TextInput
      label="Customer Name"

      value={customer}

      onChangeText={setCustomer}

      mode="outlined"

      style={{
        flex: 1,
        marginRight: 8,
        backgroundColor: "#fff",
      }}

      outlineStyle={{
        borderRadius: 20,
        borderWidth: 1.2,
        borderColor: "#E2E8F0",
      }}

      left={
        <TextInput.Icon
          icon="account-outline"
          color="#6366F1"
        />
      }
    />

    <TextInput
      label="Mobile No"

      value={mobileno}

      onChangeText={setMobileno}

      keyboardType="numeric"

      mode="outlined"

      style={{
        flex: 1,
        marginLeft: 8,
        backgroundColor: "#fff",
      }}

      outlineStyle={{
        borderRadius: 20,
        borderWidth: 1.2,
        borderColor: "#E2E8F0",
      }}

      left={
        <TextInput.Icon
          icon="phone-outline"
          color="#10B981"
        />
      }
    />

  </View>

</Card>

        {/* DATE PICKER */}

      {showDate && (

  <DateTimePicker

    value={
      selectedDate ||
      new Date()
    }

    mode="date"

    display="default"

    onChange={(
      event,
      date
    ) => {

      setShowDate(false);

      if (date) {

        setSelectedDate(
          date
        );

        updateField(

          'date',

          date.toLocaleDateString(
            'en-GB'
          )

        );

      }

    }}

  />

)}
     
{/* ========================= */
/* PRODUCTS */
/* ========================= */}

{items.map((item, index) => {

  const amount =
    (Number(item.qty) || 0) *
    (Number(item.rate) || 0);

  const isOpen =
    expandedId === item.id;

  return (

    <View
      key={item.id}
      style={{
        backgroundColor: "#fff",

        borderRadius: 28,

        padding: 16,

        marginBottom: 18,

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,

        elevation: 4,

        borderWidth: 1,
        borderColor: "#EEF2F7",

        position: "relative",

        zIndex:
          activeIndex === index
            ? 999
            : 1,
      }}>

      {/* ========================= */}
      {/* SELECTED PRODUCT PREVIEW */}
      {/* ========================= */}
      {!!item.product && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            padding: 10,
            borderRadius: 18,
            backgroundColor: "#F8FAFC",
            borderWidth: 1,
            borderColor: "#EEF2F7",
          }}
        >
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 15,
              backgroundColor: "#EEF2FF",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              marginRight: 12,
            }}
          >
            {item.productimage ? (
              <Image
                source={{ uri: item.productimage }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={25}
                color="#6366F1"
              />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: "#111827",
              }}
            >
              {item.product}
            </Text>

            {(item.category || item.subcategory) && (
              <Text
                numberOfLines={1}
                style={{
                  marginTop: 3,
                  fontSize: 11,
                  color: "#64748B",
                }}
              >
                {item.category || "No Category"}
                {item.subcategory ? ` • ${item.subcategory}` : ""}
              </Text>
            )}
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: "#10B981",
              }}
            >
              ₹{Number(item.rate || 0).toFixed(2)}
            </Text>
            {!!item.productcode && (
              <Text style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>
                #{item.productcode}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* ========================= */}
      {/* PRODUCT INPUT */}
      {/* ========================= */}
<TextInput
  label="Product"
  value={item.product || ""}
  mode="outlined"

  style={{
    backgroundColor: "#fff",
  }}

  contentStyle={{
    fontSize: 15,
    fontWeight: "700",
  }}

  outlineStyle={{
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
  }}

  // =====================================================
  // FOCUS
  // =====================================================

  onFocus={() => {

    // Only remember current row.
    // DO NOT SEARCH HERE.

    setActiveIndex(index);

    // Clear previous suggestions
    setSuggestions([]);
  }}


  // =====================================================
  // BLUR
  // =====================================================

  onBlur={() => {

    setTimeout(() => {

      setActiveIndex(null);

      setSuggestions([]);

    }, 250);

  }}


  // =====================================================
  // TYPE PRODUCT NAME
  // =====================================================

  onChangeText={async (value) => {

    // Update current row
    updateItem(
      index,
      "product",
      value
    );


    // =================================================
    // EMPTY TEXT
    // =================================================

    if (!value.trim()) {

      setSuggestions([]);

      return;
    }


    // =================================================
    // SEARCH
    // =================================================

    try {

      // Make this row active
      setActiveIndex(index);


      console.log(
        "🔍 SEARCH PRODUCT:",
        value
      );


      const result =
        await searchProductsByFirstLetter(
          value.trim()
        );


      console.log(
        "📦 SEARCH RESULT:",
        result
      );


      // =================================================
      // SHOW RESULTS
      // =================================================

      setSuggestions(
        Array.isArray(result)
          ? result
          : []
      );

    } catch (error) {

      console.log(
        "❌ PRODUCT SEARCH ERROR:",
        error
      );

      setSuggestions([]);

    }

  }}


  // =====================================================
  // LEFT ICON
  // =====================================================

  left={
    <TextInput.Icon
      icon="package-variant-closed"
      color="#6366F1"
    />
  }


  // =====================================================
  // ADD PRODUCT
  // =====================================================

  right={

    <TextInput.Icon

      icon="plus-circle-outline"

      color="#10B981"

      onPress={() => {

        router.push({
          pathname:
            "/src/screens/ProductScreen",

          params: {
            from: "invoice",
          },
        });

      }}

    />

  }
/>


{/* ===================================================== */}
{/* PRODUCT SEARCH DROPDOWN */}
{/* ===================================================== */}

{activeIndex === index &&
 suggestions.length > 0 && (

  <View
    style={{

      position: "absolute",

      top: 84,

      left: 16,

      right: 16,

      backgroundColor: "#FFFFFF",

      borderRadius: 22,

      overflow: "hidden",

      shadowColor: "#000",

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.08,

      shadowRadius: 10,

      elevation: 10,

      borderWidth: 1,

      borderColor: "#E5E7EB",

      zIndex: 9999,

      maxHeight: 280,

    }}
  >

    <ScrollView
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
    >

      {suggestions.map(
        (product) => (

          <TouchableOpacity
            key={String(product.id)}

            activeOpacity={0.85}

            style={{
              padding: 15,

              borderBottomWidth: 1,

              borderBottomColor:
                "#F1F5F9",
            }}

            onPress={() => {

              // =================================================
              // GST
              // =================================================

              const sgst =
                Number(
                  product.sgst || 0
                );

              const cgst =
                Number(
                  product.cgst || 0
                );

              const igst =
                Number(
                  product.igst || 0
                );


              // =================================================
              // CURRENT QUANTITY
              // =================================================

              const qty =
                Number(
                  items[index]?.qty || 1
                );


              // =================================================
              // RETAIL PRICE
              // =================================================

              const rate =
                Number(
                  product.retail || 0
                );


              // =================================================
              // AMOUNT
              // =================================================

              const amount =
                qty * rate;


              // =================================================
              // TAX
              // =================================================

              let taxAmount = 0;


              if (
                selectedTaxType ===
                "SINGLE TAX"
              ) {

                taxAmount =
                  amount *
                  (igst / 100);

              } else {

                taxAmount =
                  amount *
                  (
                    (sgst + cgst) /
                    100
                  );

              }


              // =================================================
              // UPDATE ITEM
              // =================================================

              const updatedItems =
                [...items];


              updatedItems[index] = {

                ...updatedItems[index],


                // =========================
                // PRODUCT
                // =========================

                product:
                  product.productenglishname ||
                  "",

                productcode:
                  product.productcode ||
                  "",

                productimage:
                  product.productimage ||
                  "",


                // =========================
                // CATEGORY
                // =========================

                category:
                  product.category ||
                  "",

                subcategory:
                  product.subcategory ||
                  "",


                // =========================
                // PRODUCT DETAILS
                // =========================

                producttype:
                  product.producttype ||
                  "",

                subtype:
                  product.subtype ||
                  "",

                brandname:
                  product.brandname ||
                  "",


                // =========================
                // PRICE
                // =========================

                purchase:
                  Number(
                    product.purchase || 0
                  ),

                wholesale:
                  Number(
                    product.wholesale || 0
                  ),

                retail:
                  Number(
                    product.retail || 0
                  ),

                mrp:
                  Number(
                    product.mrp || 0
                  ),


                rate,

                amount,


                // =========================
                // UNIT
                // =========================

                unittype:
                  product.unittype ||
                  "",

                uom:
                  product.uom ||
                  "",

                unit:
                  product.unit ||
                  "",


                // =========================
                // STOCK
                // =========================

                stockquantity:
                  Number(
                    product.stockquantity ||
                    0
                  ),


                // =========================
                // BARCODE
                // =========================

                barcode:
                  product.barcode ||
                  "",

                sellingcode:
                  product.sellingcode ||
                  "",


                // =========================
                // GST
                // =========================

                sgst,

                cgst,

                igst,


                // =========================
                // TAX
                // =========================

                taxAmount,


                netRate:
                  rate +
                  taxAmount,


                // =========================
                // HSN
                // =========================

                hsn:
                  product.hsn ||
                  "",

                hsncode:
                  product.hsncode ||
                  "",


                // =========================
                // BATCH
                // =========================

                batch:
                  product.batch ||
                  "",

              };


              // =================================================
              // SAVE
              // =================================================

              setItems(
                updatedItems
              );


              // =================================================
              // CLOSE DROPDOWN
              // =================================================

              setSuggestions([]);

              setActiveIndex(null);

            }}
          >

            {/* ================================================= */}
            {/* PRODUCT ROW */}
            {/* ================================================= */}

            <View
              style={{
                flexDirection: "row",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",
              }}
            >

              {/* ================================================= */}
              {/* LEFT */}
              {/* ================================================= */}

              <View
                style={{
                  flexDirection:
                    "row",

                  alignItems:
                    "center",

                  flex: 1,
                }}
              >

                {/* PRODUCT IMAGE */}

                <View
                  style={{
                    width: 56,

                    height: 56,

                    borderRadius: 16,

                    backgroundColor:
                      "#F1F5F9",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    marginRight: 12,

                    overflow:
                      "hidden",
                  }}
                >

                  {product.productimage ? (

                    <Image
                      source={{
                        uri:
                          product.productimage,
                      }}

                      style={{
                        width: "100%",

                        height: "100%",
                      }}

                      resizeMode="cover"
                    />

                  ) : (

                    <MaterialCommunityIcons
                      name={
                        "package-variant-closed"
                      }

                      size={26}

                      color="#6366F1"
                    />

                  )}

                </View>


                {/* PRODUCT NAME */}

                <View
                  style={{
                    flex: 1,
                  }}
                >

                  <Text
                    numberOfLines={1}

                    style={{
                      fontSize: 15,

                      fontWeight: "800",

                      color:
                        "#111827",
                    }}
                  >

                    {
                      product.productenglishname
                    }

                  </Text>


                  {!!product.producttamilName && (

                    <Text
                      numberOfLines={1}

                      style={{
                        marginTop: 3,

                        color:
                          "#64748B",

                        fontSize: 12,
                      }}
                    >

                      {
                        product.producttamilName
                      }

                    </Text>

                  )}


                  {!!product.category && (

                    <Text
                      numberOfLines={1}

                      style={{
                        marginTop: 3,

                        color:
                          "#94A3B8",

                        fontSize: 11,
                      }}
                    >

                      {product.category}

                      {product.subcategory
                        ? ` • ${product.subcategory}`
                        : ""}

                    </Text>

                  )}

                </View>

              </View>


              {/* ================================================= */}
              {/* RIGHT */}
              {/* ================================================= */}

              <View
                style={{
                  alignItems:
                    "flex-end",

                  marginLeft: 8,
                }}
              >

                <Text
                  style={{
                    fontSize: 15,

                    fontWeight: "800",

                    color:
                      "#10B981",
                  }}
                >

                  ₹
                  {Number(
                    product.retail || 0
                  ).toFixed(2)}

                </Text>


                <Text
                  style={{
                    marginTop: 3,

                    fontSize: 11,

                    color:
                      "#94A3B8",
                  }}
                >

                  Stock:{" "}

                  {
                    Number(
                      product.stockquantity ||
                      0
                    )
                  }

                </Text>

              </View>

            </View>

          </TouchableOpacity>

        )
      )}

    </ScrollView>

  </View>

)}
      {/* ========================= */}
      {/* QTY + RATE */}
      {/* ========================= */}

      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
        }}>

        <TextInput
          label="Qty"

          mode="outlined"

          value={String(item.qty)}

          keyboardType="numeric"

          onChangeText={(value) =>
            updateItem(
              index,
              "qty",
              parseInt(value) || 0
            )
          }

          style={{
            flex: 1,
            marginRight: 8,
            backgroundColor: "#fff",
          }}

          outlineStyle={{
            borderRadius: 18,
          }}
        />

        <TextInput
          label="Rate"

          mode="outlined"

          value={String(item.rate)}

          keyboardType="numeric"

          onChangeText={(value) =>
            updateItem(
              index,
              "rate",
              parseFloat(value) || 0
            )
          }

          style={{
            flex: 1,
            marginLeft: 8,
            backgroundColor: "#fff",
          }}

          outlineStyle={{
            borderRadius: 18,
          }}
        />

      </View>

      {/* ========================= */}
      {/* AMOUNT */}
      {/* ========================= */}

      <LinearGradient
        colors={[
          "#EEF2FF",
          "#F8FAFF",
        ]}
        style={{
          marginTop: 16,

          borderRadius: 18,

          padding: 16,

          flexDirection: "row",

          justifyContent:
            "space-between",

          alignItems: "center",
        }}>

        <View>

          <Text
            style={{
              fontSize: 12,

              color: "#6366F1",

              fontWeight: "700",

              letterSpacing: 1,
            }}>

            TOTAL AMOUNT

          </Text>

          <Text
            style={{
              marginTop: 4,

              fontSize: 24,

              fontWeight: "800",

              color: "#111827",
            }}>

            ₹{amount}

          </Text>

        </View>

        <View
          style={{
            width: 54,
            height: 54,

            borderRadius: 18,

            backgroundColor:
              "#6366F1",

            justifyContent:
              "center",

            alignItems:
              "center",
          }}>

          <MaterialCommunityIcons
            name="cash-multiple"
            size={28}
            color="#fff"
          />

        </View>

      </LinearGradient>

      {/* ========================= */}
      {/* MORE DETAILS */}
      {/* ========================= */}

      <TouchableOpacity
        activeOpacity={0.9}

        onPress={() =>
          setExpandedId(

            isOpen
              ? null
              : item.id

          )
        }

        style={{
          marginTop: 14,

          alignSelf: "flex-start",

          backgroundColor:
            "#F8FAFC",

          paddingVertical: 10,
          paddingHorizontal: 16,

          borderRadius: 16,
        }}>

        <Text
          style={{
            color: "#2563EB",

            fontWeight: "700",
          }}>

          {isOpen
            ? "Hide Details ▲"
            : "More Details ▼"}

        </Text>

      </TouchableOpacity>

      {/* ========================= */}
      {/* EXTRA DETAILS */}
      {/* ========================= */}
{/* ========================= */}
{/* EXTRA DETAILS */}
{/* ========================= */}

{isOpen && (

  <View
    style={{
      marginTop: 16,

      backgroundColor:
        "#F8FAFC",

      borderRadius: 24,

      padding: 14,

      borderWidth: 1,
      borderColor: "#E2E8F0",
    }}>

    {/* HEADER */}

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",

        marginBottom: 16,
      }}>

      <LinearGradient
        colors={[
          "#6366F1",
          "#8B5CF6",
        ]}
        style={{
          width: 42,
          height: 42,

          borderRadius: 14,

          justifyContent:
            "center",

          alignItems:
            "center",

          marginRight: 12,
        }}>

        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={20}
          color="#fff"
        />

      </LinearGradient>

      <View>

        <Text
          style={{
            fontSize: 16,

            fontWeight: "800",

            color: "#111827",
          }}>

          Product Details

        </Text>

        <Text
          style={{
            marginTop: 2,

            fontSize: 12,

            color: "#64748B",
          }}>

          Additional product information

        </Text>

      </View>

    </View>

    {/* ========================= */}
    {/* ROW 1 */}
    {/* ========================= */}

    <View
      style={{
        flexDirection: "row",
        marginBottom: 12,
      }}>

      <TextInput
        label="Batch"

        mode="outlined"

        value={item.batch || ""}

        onChangeText={(value) =>

          updateItem(
            index,
            "batch",
            value
          )

        }

        style={{
          flex: 1,
          marginRight: 8,
          backgroundColor: "#fff",
        }}

        outlineStyle={{
          borderRadius: 18,
        }}

        left={
          <TextInput.Icon
            icon="layers-outline"
            color="#6366F1"
          />
        }
      />

      <TextInput
        label="Unit"

        mode="outlined"

        value={
          item?.unittype ?? ""
        }

        onChangeText={(value) =>
          updateItem(
            index,
            "unittype",
            value
          )
        }

        style={{
          flex: 1,
          marginLeft: 8,
          backgroundColor: "#fff",
        }}

        outlineStyle={{
          borderRadius: 18,
        }}

        left={
          <TextInput.Icon
            icon="scale-balance"
            color="#10B981"
          />
        }
      />

    </View>

    {/* ========================= */}
    {/* ROW 2 */}
    {/* ========================= */}

    <View
      style={{
        flexDirection: "row",
        marginBottom: 12,
      }}>

      <TextInput
        label="UOM"

        mode="outlined"

        value={item.uom || ""}

        onChangeText={(value) =>

          updateItem(
            index,
            "uom",
            value
          )

        }

        style={{
          flex: 1,
          marginRight: 8,
          backgroundColor: "#fff",
        }}

        outlineStyle={{
          borderRadius: 18,
        }}

        left={
          <TextInput.Icon
            icon="ruler-square"
            color="#F59E0B"
          />
        }
      />

      <TextInput
        label="Price Type"

        mode="outlined"

        value={item.pricetype || ""}

        onChangeText={(value) =>

          updateItem(
            index,
            "weight",
            value
          )

        }

        style={{
          flex: 1,
          marginLeft: 8,
          backgroundColor: "#fff",
        }}

        outlineStyle={{
          borderRadius: 18,
        }}

        left={
          <TextInput.Icon
            icon="weight-kilogram"
            color="#EF4444"
          />
        }
      />

    </View>

    {/* ========================= */}
    {/* ROW 3 */}
    {/* ========================= */}

    <View
      style={{
        flexDirection: "row",
        marginBottom: 12,
      }}>

      <TextInput
        label="Net Rate"

        mode="outlined"

        value={String(
          item.netRate || 0
        )}

        keyboardType="numeric"

        onChangeText={(value) =>

          updateItem(
            index,
            "netRate",

            parseFloat(
              value
            ) || 0
          )

        }

        style={{
          flex: 1,
          marginRight: 8,
          backgroundColor: "#fff",
        }}

        outlineStyle={{
          borderRadius: 18,
        }}

        left={
          <TextInput.Icon
            icon="currency-inr"
            color="#2563EB"
          />
        }
      />

      <TextInput
        label="Discount %"

        mode="outlined"

        value={String(
          item.discount || 0
        )}

        keyboardType="numeric"

        onChangeText={(value) =>

          updateItem(
            index,
            "discount",

            parseFloat(
              value
            ) || 0
          )

        }

        style={{
          flex: 1,
          marginLeft: 8,
          backgroundColor: "#fff",
        }}

        outlineStyle={{
          borderRadius: 18,
        }}

        left={
          <TextInput.Icon
            icon="sale-outline"
            color="#EC4899"
          />
        }
      />

    </View>

    {/* ========================= */}
    {/* ROW 4 */}
    {/* ========================= */}

    <View
      style={{
        flexDirection: "row",
      }}>

      <TextInput
        label="SGST %"

        mode="outlined"

        value={String(
          item.sgst || 0
        )}

        keyboardType="numeric"

        onChangeText={(value) =>

          updateItem(
            index,
            "sgst",

            parseFloat(
              value
            ) || 0
          )

        }

        style={{
          flex: 1,
          marginRight: 8,
          backgroundColor: "#fff",
        }}

        outlineStyle={{
          borderRadius: 18,
        }}

        left={
          <TextInput.Icon
            icon="percent-outline"
            color="#8B5CF6"
          />
        }
      />

      <TextInput
        label="CGST %"

        mode="outlined"

        value={String(
          item.cgst || 0
        )}

        keyboardType="numeric"

        onChangeText={(value) =>

          updateItem(
            index,
            "cgst",

            parseFloat(
              value
            ) || 0
          )

        }

        style={{
          flex: 1,
          marginLeft: 8,
          backgroundColor: "#fff",
        }}

        outlineStyle={{
          borderRadius: 18,
        }}

        left={
          <TextInput.Icon
            icon="percent-outline"
            color="#14B8A6"
          />
        }
      />

    </View>


<View
  style={{
    flexDirection: "row",
    marginTop: 20,
  }}
>
  <TextInput
    label="IGST %"
    mode="outlined"
    value={String(item.igst || 0)}
    keyboardType="numeric"
    onChangeText={(value) =>
      updateItem(
        index,
        "igst",
        parseFloat(value) || 0
      )
    }
    style={{
      width: "48%",
      backgroundColor: "#fff",
    }}
    outlineStyle={{
      borderRadius: 18,
    }}
    left={
      <TextInput.Icon
        icon="percent-outline"
        color="#14B8A6"
      />
    }
  />
</View>

  

  </View>

)}

<View
  style={{
    position: "absolute",
    bottom: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  }}
>
  {/* ADD BUTTON */}
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => addRow(item.id)}
    style={{
      width: 42,
      height: 42,
      borderRadius: 16,
      backgroundColor: "#ECFDF5",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#10B981",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: "#BBF7D0",
    }}
  >
    <MaterialCommunityIcons
      name="plus"
      size={24}
      color="#10B981"
    />
  </TouchableOpacity>

  {/* DELETE BUTTON */}
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => removeItem(item.id)}
    style={{
      width: 42,
      height: 42,
      borderRadius: 16,
      backgroundColor: "#FEF2F2",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#EF4444",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: "#FECACA",
    }}
  >
    <MaterialCommunityIcons
      name="trash-can-outline"
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
    backgroundColor: "#FFFFFF",

    borderRadius: 30,

    padding: 18,

    marginTop: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    elevation: 5,

    borderWidth: 1,
    borderColor: "#EEF2F7",
  }}>

  {/* ========================= */}
  {/* HEADER */}
  {/* ========================= */}

  <View
    style={{
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      marginBottom: 18,
    }}>

    <View>

      <Text
        style={{
          fontSize: 21,

          fontWeight: "800",

          color: "#111827",
        }}>

        Invoice Summary

      </Text>

      <Text
        style={{
          marginTop: 3,

          fontSize: 13,

          color: "#64748B",
        }}>

        Final billing overview

      </Text>

    </View>

    <LinearGradient
      colors={[
        "#2563EB",
        "#4F46E5",
      ]}
      style={{
        width: 52,
        height: 52,

        borderRadius: 18,

        justifyContent:
          "center",

        alignItems:
          "center",
      }}>

      <MaterialCommunityIcons
        name="file-document-outline"
        size={26}
        color="#fff"
      />

    </LinearGradient>

  </View>

  {/* ========================= */}
  {/* DISCOUNT + TAX */}
  {/* ========================= */}

  <View
    style={{
      flexDirection: "row",
      marginBottom: 18,
    }}>

    {/* DISCOUNT */}

    <TextInput
      label="Discount"

      value={discount}

      onChangeText={setDiscount}

      keyboardType="numeric"

      mode="outlined"

      style={{
        flex: 1,
        marginRight: 8,
        backgroundColor: "#fff",
      }}

      outlineStyle={{
        borderRadius: 20,
        borderWidth: 1.2,
        borderColor: "#E2E8F0",
      }}

      contentStyle={{
        fontWeight: "700",
      }}

      left={
        <TextInput.Icon
          icon="sale-outline"
          color="#EC4899"
        />
      }
    />

</View>


  {/* ========================= */}
  {/* SUMMARY BOXES */}
  {/* ========================= */}

  {/* SUB TOTAL */}

  <LinearGradient
    colors={[
      "#F8FAFF",
      "#EEF2FF",
    ]}
    style={{
      borderRadius: 22,

      padding: 16,

      marginBottom: 12,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",
    }}>

    <View>

      <Text
        style={{
          fontSize: 12,

          color: "#6366F1",

          fontWeight: "700",

          letterSpacing: 1,
        }}>

        SUB TOTAL

      </Text>

      <Text
        style={{
          marginTop: 4,

          fontSize: 24,

          fontWeight: "800",

          color: "#111827",
        }}>

        ₹
        {subtotal.toFixed(2)}

      </Text>

    </View>

    <View
      style={{
        width: 54,
        height: 54,

        borderRadius: 18,

        backgroundColor:
          "#6366F1",

        justifyContent:
          "center",

        alignItems:
          "center",
      }}>

      <MaterialCommunityIcons
        name="calculator-variant-outline"
        size={28}
        color="#fff"
      />

    </View>

  </LinearGradient>

  {/* DISCOUNT */}

  <LinearGradient
    colors={[
      "#FFF1F2",
      "#FFE4E6",
    ]}
    style={{
      borderRadius: 22,

      padding: 16,

      marginBottom: 12,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",
    }}>

    <View>

      <Text
        style={{
          fontSize: 12,

          color: "#E11D48",

          fontWeight: "700",

          letterSpacing: 1,
        }}>

        DISCOUNT

      </Text>

      <Text
        style={{
          marginTop: 4,

          fontSize: 22,

          fontWeight: "800",

          color: "#111827",
        }}>

        ₹
        {discountAmount.toFixed(
          2
        )}

      </Text>

    </View>

    <View
      style={{
        width: 54,
        height: 54,

        borderRadius: 18,

        backgroundColor:
          "#E11D48",

        justifyContent:
          "center",

        alignItems:
          "center",
      }}>

      <MaterialCommunityIcons
        name="sale"
        size={26}
        color="#fff"
      />

    </View>

  </LinearGradient>

  {/* TAX */}

  <LinearGradient
    colors={[
      "#ECFDF5",
      "#F0FDF4",
    ]}
    style={{
      borderRadius: 22,

      padding: 16,

      marginBottom: 12,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",
    }}>

    <View>

      <Text
        style={{
          fontSize: 12,

          color: "#10B981",

          fontWeight: "700",

          letterSpacing: 1,
        }}>

        TAX AMOUNT

      </Text>

      <Text
        style={{
          marginTop: 4,

          fontSize: 22,

          fontWeight: "800",

          color: "#111827",
        }}>

        ₹
        {taxAmount.toFixed(2)}

      </Text>

      <Text
        style={{
          marginTop: 4,

          fontSize: 12,

          color: "#64748B",
        }}>

        { taxpercent || 0}%
        Applied

      </Text>

    </View>

    <View
      style={{
        width: 54,
        height: 54,

        borderRadius: 18,

        backgroundColor:
          "#10B981",

        justifyContent:
          "center",

        alignItems:
          "center",
      }}>

      <MaterialCommunityIcons
        name="cash-plus"
        size={26}
        color="#fff"
      />

    </View>

  </LinearGradient>

  {/* ========================= */}
  {/* GRAND TOTAL */}
  {/* ========================= */}

  <LinearGradient
    colors={[
      "#111827",
      "#1F2937",
    ]}
    style={{
      marginTop: 6,

      borderRadius: 26,

      paddingVertical: 22,
      paddingHorizontal: 18,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",
    }}>

    <View>

      <Text
        style={{
          fontSize: 13,

          color:
            "rgba(255,255,255,0.7)",

          fontWeight: "700",

          letterSpacing: 1,
        }}>

        GRAND TOTAL

      </Text>

      <Text
        style={{
          marginTop: 5,

          fontSize: 30,

          fontWeight: "900",

          color: "#fff",
        }}>

        ₹
        {(
          subtotal -
          discountAmount +
          taxAmount
        ).toFixed(2)}

      </Text>

    </View>

    <LinearGradient
      colors={[
        "#F59E0B",
        "#F97316",
      ]}
      style={{
        width: 68,
        height: 68,

        borderRadius: 24,

        justifyContent:
          "center",

        alignItems:
          "center",
      }}>

      <MaterialCommunityIcons
        name="wallet-outline"
        size={34}
        color="#fff"
      />

    </LinearGradient>

  </LinearGradient>

</Card>

        {/* BUTTONS */}

     <View
  style={{
    marginTop: 24,
  }}>

  {/* ========================= */}
  {/* ACTION BUTTONS */}
  {/* ========================= */}

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    }}>

    {/* VIEW BILL */}

    <TouchableOpacity
      activeOpacity={0.9}

      onPress={() =>
        router.push(
          "/src/screens/ViewInvoiceScreen"
        )
      }

      style={{
        flex: 1,

        marginRight: 6,
      }}>

      <LinearGradient
        colors={[
          "#2563EB",
          "#3B82F6",
        ]}
        style={{
          height: 58,

          borderRadius: 20,

          flexDirection: "row",

          alignItems: "center",

          justifyContent:
            "center",

          shadowColor: "#2563EB",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.22,
          shadowRadius: 8,

          elevation: 5,
        }}>

        <MaterialCommunityIcons
          name="file-document-outline"
          size={22}
          color="#fff"
        />

        <Text
          style={{
            marginLeft: 8,

            color: "#fff",

            fontWeight: "800",

            fontSize: 15,
          }}>

          View Bill

        </Text>

      </LinearGradient>

    </TouchableOpacity>

    {/* SAVE */}

    <TouchableOpacity
      activeOpacity={0.9}

      onPress={handleSave}

      style={{
        flex: 1,

        marginHorizontal: 6,
      }}>

      <LinearGradient
        colors={[
          "#10B981",
          "#34D399",
        ]}
        style={{
          height: 58,

          borderRadius: 20,

          flexDirection: "row",

          alignItems: "center",

          justifyContent:
            "center",

          shadowColor: "#10B981",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.22,
          shadowRadius: 8,

          elevation: 5,
        }}>

        <MaterialCommunityIcons
          name="content-save-outline"
          size={22}
          color="#fff"
        />

        <Text
          style={{
            marginLeft: 8,

            color: "#fff",

            fontWeight: "800",

            fontSize: 15,
          }}>

          Save

        </Text>

      </LinearGradient>

    </TouchableOpacity>

    {/* RESET */}

    <TouchableOpacity
      activeOpacity={0.9}

      onPress={() => {

        setCustomer("");

        setMobileno("");

        setDiscount("0");

        setTax("0");

        setItems([
          {
            id:
              Date.now().toString(),

            product: "",

            qty: 1,

            rate: 0,

            batch: "",

            unittype: "",

            uom: "",

            weight: "",

            sgst: "",

            cgst: "",

            igst: "",

            taxAmount: 0,

            netRate: 0,
          },
        ]);

      }}

      style={{
        flex: 1,

        marginLeft: 6,
      }}>

      <LinearGradient
        colors={[
          "#EF4444",
          "#F87171",
        ]}
        style={{
          height: 58,

          borderRadius: 20,

          flexDirection: "row",

          alignItems: "center",

          justifyContent:
            "center",

          shadowColor: "#EF4444",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.22,
          shadowRadius: 8,

          elevation: 5,
        }}>

        <MaterialCommunityIcons
          name="refresh"
          size={22}
          color="#fff"
        />

        <Text
          style={{
            marginLeft: 8,

            color: "#fff",

            fontWeight: "800",

            fontSize: 15,
          }}>

          Reset

        </Text>

      </LinearGradient>

    </TouchableOpacity>

  </View>

</View>

      </ScrollView>

    </View>
  );
}