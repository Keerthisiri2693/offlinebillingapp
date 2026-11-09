import React, {
  useState,
  useEffect,
} from "react";

import {
  BackHandler,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  LayoutAnimation,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";

import {
  TextInput,
  Button,
  Card,
  Menu,
} from "react-native-paper";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  useFocusEffect,
  useRouter,
  useLocalSearchParams,
} from "expo-router";

import DateTimePicker from
  "@react-native-community/datetimepicker";

import {
  saveProduct,
  getProductById,
  getDB,
} from "../database/sqlite";

import axios from "axios";

import {
  useNavigation,
} from "@react-navigation/native";

import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";

import * as ImagePicker from "expo-image-picker";

import styles from "../style/ProductScreenStyle";

// =====================================================
// CATEGORY DATA
// =====================================================

const CATEGORY_DATA: Record<string, string[]> = {

  Grocery: [
    "Rice",
    "Dal",
    "Oil",
    "Spices",
    "Flour",
    "Snacks",
    "Beverages",
  ],

  Vegetables: [
    "Leafy Vegetables",
    "Root Vegetables",
    "Fresh Vegetables",
  ],

  Fruits: [
    "Fresh Fruits",
    "Dry Fruits",
    "Imported Fruits",
  ],

  Dairy: [
    "Milk",
    "Curd",
    "Butter",
    "Cheese",
  ],

  Bakery: [
    "Bread",
    "Cakes",
    "Biscuits",
    "Buns",
  ],

  PersonalCare: [
    "Soap",
    "Shampoo",
    "Hair Care",
    "Skin Care",
  ],

  Household: [
    "Cleaning",
    "Detergents",
    "Kitchen",
  ],

  Others: [
    "Others",
  ],
};




export default function AddEditProduct() {

 
  useEffect(() => {

  if (
    saved &&
    from === "invoice"
  ) {

    router.back();

  }

}, [saved]);


useFocusEffect(
  React.useCallback(() => {

    const onBackPress = () => {

      router.replace("/src/screens/DashboardScreen"); // Home page route

      return true; // Prevent default back behavior
    };

    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

    return () =>
      subscription.remove();

  }, [])
);


const pickProductImage = async () => {

  try {

    const permission =
      await ImagePicker
        .requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {

      Alert.alert(
        "Permission Required",
        "Please allow photo library access to select a product image."
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes:
          ["images"],

        allowsEditing: true,

        aspect: [1, 1],

        quality: 0.8,

      });

    if (
      !result.canceled &&
      result.assets?.length
    ) {

      const imageUri =
        result.assets[0].uri;

      updateField(
        "productimage",
        imageUri
      );

      console.log(
        "🖼️ PRODUCT IMAGE:",
        imageUri
      );
    }

  } catch (error) {

    console.log(
      "❌ IMAGE PICKER ERROR:",
      error
    );

    Alert.alert(
      "Error",
      "Unable to select product image."
    );

  }
};


const takeProductPhoto = async () => {

  try {

    const permission =
      await ImagePicker
        .requestCameraPermissionsAsync();

    if (!permission.granted) {

      Alert.alert(
        "Camera Permission",
        "Please allow camera access."
      );

      return;
    }

    const result =
      await ImagePicker.launchCameraAsync({

        mediaTypes:
          ["images"],

        allowsEditing: true,

        aspect: [1, 1],

        quality: 0.8,

      });

    if (
      !result.canceled &&
      result.assets?.length
    ) {

      updateField(
        "productimage",
        result.assets[0].uri
      );

    }

  } catch (error) {

    console.log(
      "❌ CAMERA ERROR:",
      error
    );

  }

};

const [scannerVisible, setScannerVisible] =
  useState(false);

const [permission, requestPermission] =
  useCameraPermissions();

const [scanned, setScanned] =
  useState(false);


const [priceTypeMenuVisible, setPriceTypeMenuVisible] =
  useState(false);


  const [showMfdPicker, setShowMfdPicker] =
  useState(false);
  
  const [showBestBeforePicker,
  setShowBestBeforePicker] =
  useState(false);

  const [categoryMenuVisible, setCategoryMenuVisible] =
  useState(false);

const [subcategoryMenuVisible, setSubcategoryMenuVisible] =
  useState(false);



  const onMfdChange = (
  event,
  selectedDate
) => {

  setShowMfdPicker(false);

  if (selectedDate) {

    const day =
      String(
        selectedDate.getDate()
      ).padStart(2, "0");

    const month =
      String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0");

    const year =
      selectedDate.getFullYear();

    updateField(
      "mfd",
      `${day}-${month}-${year}`
    );
  }
};



const onBestBeforeChange = (
  event,
  selectedDate
) => {

  setShowBestBeforePicker(
    false
  );

  if (selectedDate) {

    const day = String(
      selectedDate.getDate()
    ).padStart(2, "0");

    const month = String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0");

    const year =
      selectedDate.getFullYear();

    updateField(
      "bestbefore",
      `${day}-${month}-${year}`
    );
  }
};

const openScanner = async () => {

  if (!permission?.granted) {

    const result =
      await requestPermission();

    if (!result.granted) {

      Alert.alert(
        "Camera Permission",
        "Please allow camera access"
      );

      return;
    }
  }

  setScanned(false);

  setScannerVisible(true);
};

const handleBarcodeScanned = ({
  data,
}: any) => {

  if (scanned) return;

  setScanned(true);

  updateField(
    "barcode",
    data
  );

  setScannerVisible(false);

  Alert.alert(
    "Scanned",
    data
  );
};

// ======================
// AUTO PRODUCT CODE
// ======================

useEffect(() => {

  if (!isEdit) {

    generateProductCode();

  }

}, []);

const params = useLocalSearchParams();

const isEdit =
  !!params?.id;

// ======================
// GENERATE PRODUCT CODE
// ======================

const generateProductCode = async () => {
  try {
    const db = await getDB();

    if (!db) {
      console.log("❌ Database not available");
      return;
    }

    // Check whether products table exists
    const table = await db.getFirstAsync<{
      name: string;
    }>(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      AND name = 'products'
    `);

    console.log("📦 PRODUCTS TABLE:", table);

    if (!table) {
      console.log("❌ products table does not exist");

      updateField("productcode", "1");

      return;
    }

    // Check columns
    const columns = await db.getAllAsync(
      "PRAGMA table_info(products)"
    );

    console.log("PRODUCT COLUMNS:", columns);

    // Get last product code
    const lastProduct = await db.getFirstAsync<{
      productcode: string | null;
    }>(`
      SELECT productcode
      FROM products
      WHERE productcode IS NOT NULL
        AND productcode != ''
      ORDER BY CAST(productcode AS INTEGER) DESC
      LIMIT 1
    `);

    console.log("📦 LAST PRODUCT:", lastProduct);

    const nextCode =
      lastProduct?.productcode
        ? Number(lastProduct.productcode) + 1
        : 1;

    updateField(
      "productcode",
      String(nextCode)
    );

    console.log(
      "✅ NEXT PRODUCT CODE:",
      nextCode
    );

  } catch (e) {
    console.log(
      "❌ generateProductCode:",
      e
    );
  }
};


const [saved,
  setSaved] =
  useState(false);

  const navigation =
    useNavigation();

  const router =
    useRouter();



  const { from } =
  useLocalSearchParams();
   

const [unitMenuVisible,
  setUnitMenuVisible] =
  useState(false);

  

const unitOptions = [

  {
    label: 'Piece',
    value: 'Piece',
  },

  {
    label: 'Kg',
    value: 'Kg',
  },

  {
    label: 'Gram',
    value: 'Gram',
  },

  {
    label: 'Litre',
    value: 'Litre',
  },

  {
    label: 'ML',
    value: 'ML',
  },

  {
    label: 'Box',
    value: 'Box',
  },

  {
    label: 'Packet',
    value: 'Packet',
  },

  {
    label: 'Dozen',
    value: 'Dozen',
  },

];



/* ================= TAMIL TRANSLITERATION ================= */

/* ================= ENGLISH TO TAMIL ================= */





const convertToTamil = async (
  text
) => {

  if (!text?.trim()) {

    updateField(
      'producttamilName',
      ''
    );

    return;

  }

  try {

    const url =

      `https://inputtools.google.com/request?text=${text}&itc=ta-t-i0-und&num=1`;

    const response =
      await axios.get(url);

    if (
      response.data[0] ===
      'SUCCESS'
    ) {

      const tamilText =

        response.data[1][0][1][0];

      updateField(
        'producttamilName',
        tamilText
      );

    }

  } catch (e) {

    console.log(
      'Tamil transliteration error',
      e
    );

  }

};
  // ================= EXTRA =================

  const [showExtra,
    setShowExtra] =
    useState(false);

  // ================= FORM =================
const [form, setForm] = useState({

  productcode: "",

  productenglishname: "",

  producttamilName: "",

  // CATEGORY
  category: "",

  subcategory: "",

  // EXISTING
  producttype: "",

  subtype: "",

  unittype: "",

  uom: "Piece",

  purchase: "",

  profit: "",

  loss: "",

  wholesale: "",

  retail: "",

  mrp: "",

  stockquantity: "",

  stockvalue: "",

  barcode: "",

  mfd: "",

  bestbefore: "",

  discount: "",

  // Keep the database field name consistent.
  pricetype: "Exclusive",

  cgst: "",

  sgst: "",

  igst: "",

  brandname: "",

  hsncode: "",

  maxqty: "",

  sellingcode: "",

  competitor1: "",

  competitor2: "",

  finalprice: "",

  // IMAGE
  productimage: "",

});


const updateField = (
  field,
  value
) => {

  setForm(prev => ({

    ...prev,

    [field]: value,

  }));

};


/* ================= CALCULATIONS ================= */

const purchasePrice = Number(form.purchase) || 0;
const retailPrice = Number(form.retail) || 0;
const stockQty = Number(form.stockquantity) || 0;

/* STOCK VALUE */
const stockValue = stockQty * purchasePrice;

/* DISCOUNT */
const discountPercent = Math.min(
  100,
  Math.max(0, Number(form.discount) || 0)
);
const discountAmount = retailPrice * (discountPercent / 100);
const discountedPrice = Math.max(0, retailPrice - discountAmount);

/* GST RATES */
const cgstPercent = Number(form.cgst) || 0;
const sgstPercent = Number(form.sgst) || 0;
const igstPercent = Number(form.igst) || 0;
const totalGstPercent =
  cgstPercent + sgstPercent + igstPercent;

/*
 * Exclusive:
 *   Retail price is before GST. Apply discount, then add GST.
 *
 * Inclusive:
 *   Retail price already includes GST. Apply discount and
 *   extract the GST portion from the discounted price.
 */
const priceType = String(form.pricetype || "Exclusive").toLowerCase();
const isInclusivePrice = priceType === "inclusive";

const taxablePrice = isInclusivePrice
  ? totalGstPercent > 0
    ? discountedPrice * (100 / (100 + totalGstPercent))
    : discountedPrice
  : discountedPrice;

const cgstAmount = taxablePrice * (cgstPercent / 100);
const sgstAmount = taxablePrice * (sgstPercent / 100);
const igstAmount = taxablePrice * (igstPercent / 100);

const totalGST = cgstAmount + sgstAmount + igstAmount;

/* FINAL PRICE */
const finalPrice = isInclusivePrice
  ? discountedPrice
  : discountedPrice + totalGST;

/* PROFIT: GST is excluded from selling value */
const profitAmount = taxablePrice - purchasePrice;
const profitPercent =
  purchasePrice > 0
    ? (profitAmount / purchasePrice) * 100
    : 0;

  // ================= LOAD EDIT =================




  useEffect(() => {

  const loadProduct = async () => {

    try {

      if (params?.id) {

        const product =

          await getProductById(
            params.id
          );

        console.log(
          '📦 EDIT PRODUCT:',
          product
        );

       if (product) {

  setForm(prev => ({

    ...prev,

    ...product,

    // CONVERT NUMBERS TO STRING

    purchase:
      String(
        product.purchase || ''
      ),

    wholesale:
      String(
        product.wholesale || ''
      ),

    retail:
      String(
        product.retail ?? ''
      ),

    discount:
      String(
        product.discount ?? ''
      ),

    pricetype:
      String(
        product.pricetype || product.priceType || 'Exclusive'
      ),

    mrp:
      String(
        product.mrp || ''
      ),

    stockquantity:
      String(
        product.stockquantity || ''
      ),

    stockvalue:
      String(
        product.stockvalue || ''
      ),

    sgst:
      String(
        product.sgst || ''
      ),

    cgst:
      String(
        product.cgst || ''
      ),

    igst:
      String(
        product.igst || ''
      ),

    profit:
      String(
        product.profit || ''
      ),

    loss:
      String(
        product.loss || ''
      ),

  }));

}
      }

    } catch (e) {

      console.log(
        '❌ loadProduct:',
        e
      );

    }

  };

  loadProduct();

}, [params?.id]);

 


  // ================= SAVE =================
const handleSave = async () => {
  // VALIDATION
  if (
    !form.productenglishname?.trim() ||
    !form.retail
  ) {
    Alert.alert(
      "Error",
      "Product Name & Retail Price are required."
    );
    return;
  }

  const enteredDiscount = Number(form.discount || 0);
  if (
    !Number.isFinite(enteredDiscount) ||
    enteredDiscount < 0 ||
    enteredDiscount > 100
  ) {
    Alert.alert(
      "Invalid Discount",
      "Discount must be between 0 and 100 percent."
    );
    return;
  }

  // PAYLOAD
  const payload = {
    id: isEdit
      ? params.id
      : Date.now().toString(),

    ...form,

    // Explicit product-detail mapping prevents these fields from
    // being lost if the form object is later refactored.
    productenglishname: String(form.productenglishname || "").trim(),
    producttamilName: String(form.producttamilName || "").trim(),
    category: String(form.category || "").trim(),
    subcategory: String(form.subcategory || "").trim(),
    producttype: String(form.producttype || "").trim(),
    subtype: String(form.subtype || "").trim(),
    brandname: String(form.brandname || "").trim(),
    unittype: String(form.unittype || "").trim(),
    uom: String(form.uom || "Piece").trim(),

    purchase: Number(form.purchase || 0),
    profit: Number(form.profit || 0),
    loss: Number(form.loss || 0),
    wholesale: Number(form.wholesale || 0),
    retail: Number(form.retail || 0),
    mrp: Number(form.mrp || 0),

    discount: discountPercent,
    pricetype: form.pricetype || "Exclusive",
    finalprice: Number(finalPrice.toFixed(2)),

    stockquantity: Number(form.stockquantity || 0),
    stockvalue: Number(form.stockvalue || 0),

    sgst: Number(form.sgst || 0),
    cgst: Number(form.cgst || 0),
    igst: Number(form.igst || 0),

    createdAt: isEdit
      ? form.createdAt
      : new Date().toISOString(),
  };

  try {
    console.log("📦 PRODUCT:", payload);

    const success = await saveProduct(payload);

    if (success) {
      Alert.alert(
        "Success",
        isEdit
          ? "Product Updated Successfully ✅"
          : "Product Created Successfully ✅",
        [
          {
            text: "OK",
            onPress: () => {
              if (from === "invoice") {
                router.back();
              } else {
                router.replace(
                  "/src/screens/ProductListScreen"
                );
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Error",
        "Unable to save product."
      );
    }
  } catch (e: any) {
    console.log("❌ Save Product Error:", e);

    Alert.alert(
      "SQLite Error",
      e?.message || JSON.stringify(e)
    );
  }
};



  // ================= TOGGLE =================

  const toggleExtra =
    () => {

    LayoutAnimation.configureNext(

      LayoutAnimation.Presets
        .easeInEaseOut

    );

    setShowExtra(
      !showExtra
    );

  };


  const categories = Object.keys(
  CATEGORY_DATA || {}
);

const subcategories =
  form.category &&
  CATEGORY_DATA?.[form.category]
    ? CATEGORY_DATA[form.category]
    : [];
 






  // ================= AUTO UPDATE =================
  useEffect(() => {
    const stock = stockValue.toFixed(2);
    const finalVal = finalPrice.toFixed(2);

    if (form.stockvalue !== stock) {
      updateField("stockvalue", stock);
    }

    if (form.finalprice !== finalVal) {
      updateField("finalprice", finalVal);
    }
  }, [
    form.purchase,
    form.stockquantity,
    form.retail,
    form.discount,
    form.cgst,
    form.sgst,
    form.igst,
    form.pricetype,
  ]);

  return (
    <View style={{ flex: 1 }}>
    <StatusBar
  backgroundColor="#4F46E5"
  barStyle="light-content"
/>

<LinearGradient
  colors={[
    "#4F46E5",
    "#6366F1",
  ]}
  style={{
    paddingTop: 55,
    paddingBottom: 22,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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

      {/* BACK */}

      <TouchableOpacity
        onPress={() =>
          navigation.goBack()
        }
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
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

      {/* TITLE */}

      <View
        style={{
          flex: 1,
          marginHorizontal: 12,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 22,
            fontWeight: "900",
            textAlign: "center",
          }}
        >
          {isEdit
            ? "Edit Product"
            : "Create Product"}
        </Text>

        <Text
          style={{
            color:
              "rgba(255,255,255,0.8)",
            fontSize: 11,
            textAlign: "center",
            marginTop: 2,
          }}
        >
          Product Master Management
        </Text>
      </View>

      {/* LIST */}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push(
            "/src/screens/ProductListScreen"
          )
        }
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor:
            "rgba(255,255,255,0.15)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="view-list"
          size={22}
          color="#FFF"
        />
      </TouchableOpacity>

    </View>

    {/* QUICK INFO */}

    <View
      style={{
        marginTop: 18,
        backgroundColor:
          "rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: 12,
      }}
    >
      <Text
        style={{
          color: "#E0E7FF",
          fontSize: 11,
          fontWeight: "700",
        }}
      >
        PRODUCT MASTER
      </Text>

      <Text
        style={{
          color: "#FFF",
          fontSize: 15,
          fontWeight: "800",
          marginTop: 4,
        }}
      >
        {isEdit
          ? "Update existing product details"
          : "Create a new product with pricing and stock information"}
      </Text>
    </View>

  </SafeAreaView>

</LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={
          styles.container
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }>
        <Card style={styles.card}>
          <Card.Content>
            {/* BASIC */}
           <View
  style={{
   
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  }}
>
  <Text
    style={{
      fontSize: 18,
      fontWeight: "900",
      color: "#4F46E5",
      marginBottom: 14,
    }}
  >
    📦 Product Information
  </Text>


{/* ================= PRODUCT IMAGE ================= */}

<View
  style={{
    marginBottom: 20,
  }}
>

  <Text
    style={{
      fontSize: 14,
      fontWeight: "800",
      color: "#374151",
      marginBottom: 10,
    }}
  >
    Product Image
  </Text>


  <TouchableOpacity
    activeOpacity={0.85}
    onPress={pickProductImage}
    style={{
      height: 180,
      borderRadius: 22,
      backgroundColor: "#F8FAFC",
      borderWidth: 1.5,
      borderColor: "#DDD6FE",
      borderStyle:
        form.productimage
          ? "solid"
          : "dashed",

      justifyContent: "center",
      alignItems: "center",

      overflow: "hidden",
    }}
  >

    {form.productimage ? (

      <Image
        source={{
          uri: form.productimage,
        }}

        style={{
          width: "100%",
          height: "100%",
        }}

        resizeMode="cover"
      />

    ) : (

      <View
        style={{
          alignItems: "center",
        }}
      >

        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 20,
            backgroundColor:
              "#EDE9FE",

            justifyContent:
              "center",

            alignItems:
              "center",

            marginBottom: 10,
          }}
        >

          <MaterialCommunityIcons
            name="camera-plus"
            size={30}
            color="#7C3AED"
          />

        </View>


        <Text
          style={{
            fontSize: 14,
            fontWeight: "800",
            color: "#4F46E5",
          }}
        >
          Add Product Image
        </Text>


        <Text
          style={{
            fontSize: 11,
            color: "#64748B",
            marginTop: 4,
          }}
        >
          Tap to select from gallery
        </Text>

      </View>

    )}

  </TouchableOpacity>


  {/* IMAGE ACTIONS */}

  <View
    style={{
      flexDirection: "row",
      marginTop: 10,
      gap: 10,
    }}
  >

    <TouchableOpacity
      onPress={pickProductImage}
      style={{
        flex: 1,
        height: 44,
        borderRadius: 13,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >

      <MaterialCommunityIcons
        name="image-outline"
        size={19}
        color="#4F46E5"
      />

      <Text
        style={{
          marginLeft: 7,
          color: "#4F46E5",
          fontWeight: "800",
        }}
      >
        Gallery
      </Text>

    </TouchableOpacity>


    <TouchableOpacity
      onPress={takeProductPhoto}
      style={{
        flex: 1,
        height: 44,
        borderRadius: 13,
        backgroundColor: "#F0FDF4",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >

      <MaterialCommunityIcons
        name="camera-outline"
        size={19}
        color="#16A34A"
      />

      <Text
        style={{
          marginLeft: 7,
          color: "#16A34A",
          fontWeight: "800",
        }}
      >
        Camera
      </Text>

    </TouchableOpacity>

  </View>

</View>

<TextInput
  label="Product Code"
  value={String(form.productcode || "")}
  editable={false}
  mode="outlined"
  left={
    <TextInput.Icon
      icon="barcode"
      color="#4F46E5"
    />
  }
  outlineColor="#E5E7EB"
  activeOutlineColor="#4F46E5"
  style={{
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  }}
  contentStyle={{
    fontSize: 15,
    fontWeight: "700",
    color: "#4F46E5",
  }}
/>

<TextInput
  label="Product Name English *"
  value={form.productenglishname}
  onChangeText={v => {

    updateField(
      "productenglishname",
      v
    );

    convertToTamil(v);

  }}
  mode="outlined"
  left={
    <TextInput.Icon
      icon="cube-outline"
      color="#16A34A"
    />
  }
  outlineColor="#E5E7EB"
  activeOutlineColor="#16A34A"
  style={{
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  }}
  contentStyle={{
    fontSize: 16,
    fontWeight: "600",
  }}
/>



<TextInput
  label="Product Name Tamil"
  value={form.producttamilName}
  onChangeText={v =>
    updateField(
      "producttamilName",
      v
    )
  }
  mode="outlined"
  left={
    <TextInput.Icon
      icon="translate"
      color="#D97706"
    />
  }
  outlineColor="#E5E7EB"
  activeOutlineColor="#D97706"
  style={{
    marginBottom: 12,
   backgroundColor: "#FFFFFF",
    borderRadius: 14,
  }}
  contentStyle={{
    fontSize: 15,
    fontWeight: "600",
  }}
/>


{/* ================= CATEGORY ================= */}

<Menu
  visible={categoryMenuVisible}
  onDismiss={() =>
    setCategoryMenuVisible(false)
  }
  anchor={
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        setCategoryMenuVisible(true)
      }
    >
      <View pointerEvents="none">

        <TextInput
          label="Category *"
          value={form.category}
          editable={false}
          mode="outlined"

          left={
            <TextInput.Icon
              icon="shape-outline"
              color="#7C3AED"
            />
          }

          right={
            <TextInput.Icon
              icon="chevron-down"
              color="#7C3AED"
            />
          }

          outlineColor="#E5E7EB"
          activeOutlineColor="#7C3AED"

          style={{
            marginBottom: 12,
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
          }}

          contentStyle={{
            fontSize: 15,
            fontWeight: "600",
          }}
        />

      </View>
    </TouchableOpacity>
  }
>

  {categories.map((category) => (

    <Menu.Item
      key={category}
      title={category}
      onPress={() => {

        updateField(
          "category",
          category
        );

        // Reset subcategory
        updateField(
          "subcategory",
          ""
        );

        setCategoryMenuVisible(
          false
        );

      }}
    />

  ))}

</Menu>


{/* ================= SUBCATEGORY ================= */}

<Menu
  visible={subcategoryMenuVisible}
  onDismiss={() =>
    setSubcategoryMenuVisible(false)
  }

  anchor={
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={!form.category}
      onPress={() =>
        setSubcategoryMenuVisible(true)
      }
    >

      <View pointerEvents="none">

        <TextInput
          label={
            form.category
              ? "Subcategory *"
              : "Select Category First"
          }

          value={form.subcategory}

          editable={false}

          mode="outlined"

          left={
            <TextInput.Icon
              icon="view-grid-outline"
              color={
                form.category
                  ? "#2563EB"
                  : "#94A3B8"
              }
            />
          }

          right={
            <TextInput.Icon
              icon="chevron-down"
              color="#2563EB"
            />
          }

          outlineColor="#E5E7EB"

          activeOutlineColor="#2563EB"

          style={{
            marginBottom: 12,
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
          }}

          contentStyle={{
            fontSize: 15,
            fontWeight: "600",
          }}
        />

      </View>

    </TouchableOpacity>
  }
>

  {subcategories.map(
    (subcategory) => (

      <Menu.Item
        key={subcategory}
        title={subcategory}

        onPress={() => {

          updateField(
            "subcategory",
            subcategory
          );

          setSubcategoryMenuVisible(
            false
          );

        }}
      />

    )
  )}

</Menu>

<TextInput
  label="Product Type"
  value={form.producttype}
  onChangeText={v =>
    updateField(
      "producttype",
      v
    )
  }
  mode="outlined"
  left={
    <TextInput.Icon
      icon="shape-outline"
      color="#16A34A"
    />
  }
  outlineColor="#E5E7EB"
  activeOutlineColor="#16A34A"
  style={{
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  }}
  contentStyle={{
    fontSize: 15,
    fontWeight: "600",
  }}
/>

<TextInput
  label="Sub Type"
  value={form.subtype}
  onChangeText={v => updateField("subtype", v)}
  mode="outlined"
  left={
    <TextInput.Icon
      icon="shape-plus"
      color="#16A34A"
    />
  }
  outlineColor="#E5E7EB"
  activeOutlineColor="#16A34A"
  style={{
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  }}
  contentStyle={{
    fontSize: 15,
    fontWeight: "600",
  }}
/>

<Menu
  visible={unitMenuVisible}
  onDismiss={() =>
    setUnitMenuVisible(false)
  }
  anchor={
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        setUnitMenuVisible(true)
      }
    >
      <View pointerEvents="none">

        <TextInput
          label="Unit Type"
          value={form.unittype}
          editable={false}
          mode="outlined"
          left={
            <TextInput.Icon
              icon="scale"
              color="#4F46E5"
            />
          }
          right={
            <TextInput.Icon
              icon="menu-down"
              color="#E5E7EB"
            />
          }
          outlineColor="#E5E7EB"
          activeOutlineColor="#4F46E5"
          style={{
            marginBottom: 12,
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
          }}
          contentStyle={{
            fontSize: 15,
            fontWeight: "600",
            color: "#111827",
          }}
        />

      </View>
    </TouchableOpacity>
  }
>

  {unitOptions.map(item => (

    <Menu.Item
      key={item.value}
      title={item.label}
      onPress={() => {

        setForm(prev => ({
          ...prev,
          unittype:
            item.value,
        }));

        setUnitMenuVisible(false);

      }}
    />

  ))}

</Menu>
           <TextInput
  label="UOM"
  value={form.uom}
  onChangeText={v =>
    updateField(
      "uom",
      v
    )
  }
  mode="outlined"
  left={
    <TextInput.Icon
      icon="ruler-square"
      color="#0891B2"
    />
  }
  outlineColor="#E5E7EB"
  activeOutlineColor="#0891B2"
  style={{
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  }}
  contentStyle={{
    fontSize: 15,
    fontWeight: "600",
  }}
/>

{/* PRICING HEADER */}

<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
  }}
>
  <View
    style={{
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#DCFCE7",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <MaterialCommunityIcons
      name="cash-multiple"
      size={20}
      color="#16A34A"
    />
  </View>

  <View
    style={{
      marginLeft: 10,
    }}
  >
    <Text
      style={{
        fontSize: 18,
        fontWeight: "900",
        color: "#111827",
      }}
    >
      Pricing
    </Text>

    <Text
      style={{
        fontSize: 12,
        color: "#6B7280",
      }}
    >
      Purchase & selling price details
    </Text>
  </View>
</View>

{/* ================= MRP ================= */}



  {/* MRP */}

  <TextInput
    label="MRP"
    value={form.mrp}
    onChangeText={v =>
      updateField(
        "mrp",
        v
      )
    }
    mode="outlined"
    keyboardType="numeric"
    left={
      <TextInput.Icon
        icon="currency-inr"
        color="#2563EB"
      />
    }
    outlineColor="#E5E7EB"
    activeOutlineColor="#2563EB"
    style={{
      width: "100%",
      backgroundColor: "#FFFFFFF",
      borderRadius: 14,
      marginBottom:10,
    }}
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
    }}
  />


  
  {/* WHOLESALE PRICE */}

  <TextInput
    label="Wholesale Price"
    value={form.wholesale}
    onChangeText={v =>
      updateField(
        "wholesale",
        v
      )
    }
    mode="outlined"
    keyboardType="numeric"
    left={
      <TextInput.Icon
        icon="currency-inr"
        color="#2563EB"
      />
    }
    outlineColor="#E5E7EB"
    activeOutlineColor="#2563EB"
    style={{
      width: "100%",
      backgroundColor: "#FFFFFFF",
      borderRadius: 14,
      marginBottom:10,
    }}
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
    }}
  />

  {/* PURCHASE */}

  <TextInput
    label="Purchase Price"
    value={form.purchase}
    onChangeText={v =>
      updateField(
        "purchase",
        v
      )
    }
    mode="outlined"
    keyboardType="numeric"
    left={
      <TextInput.Icon
        icon="cart-outline"
        color="#2563EB"
      />
    }
    outlineColor="#E5E7EB"
    activeOutlineColor="#2563EB"
    style={{
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      marginBottom:10,
    }}
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
    }}
  />




{/* ================= RETAIL ================= */}


  <TextInput
    label="Retail Price"
    value={form.retail}
    onChangeText={v =>
      updateField("retail", v)
    }
    mode="outlined"
    keyboardType="numeric"
    left={
      <TextInput.Icon
        icon="currency-inr"
        color="#2563EB"
      />
    }
    outlineColor="#E5E7EB"
    activeOutlineColor="#2563EB"
    style={{
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      marginBottom:10,
    }}
  />


  {/* ================= PROFIT ================= */}

  <TextInput
    label="Profit %"
    value={String(
      profitPercent.toFixed(2)
    )}
    editable={false}
    mode="outlined"
    left={
      <TextInput.Icon
        icon="percent"
        color="#2563EB"
      />
    }
    outlineColor="#E5E7EB"
    activeOutlineColor="#2563EB"
    style={{
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      marginBottom:10,
    }}
  />

<TextInput
  label="Profit Amount"
  value={profitAmount.toFixed(2)}
  editable={false}
  mode="outlined"
  left={
    <TextInput.Icon
      icon="cash-plus"
      color="#16A34A"
    />
  }
  outlineColor="#E5E7EB"
  activeOutlineColor="#16A34A"
  style={{
    backgroundColor: "#FFF",
    marginBottom: 10,
  }}
/>



{/* STOCK QUANTITY */}
<TextInput
  label="Stock Quantity *"
  value={form.stockquantity}
  onChangeText={(v) =>
    updateField(
      "stockquantity",
      v
    )
  }
  mode="outlined"
  keyboardType="numeric"
  left={
    <TextInput.Icon
      icon="counter"
      color="#EA580C"
    />
  }
  outlineColor="#E5E7EB"
  activeOutlineColor="#EA580C"
  style={{
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 10,
  }}
/>



{/* BAR CODE */}

<TextInput
  label="Bar Code"
  value={form.barcode}
  onChangeText={(v) =>
    updateField(
      "barcode",
      v
    )
  }
  mode="outlined"
  left={
    <TextInput.Icon
      icon="barcode"
      color="#EA580C"
    />
  }
  right={
    <TextInput.Icon
      icon="barcode-scan"
      color="#EA580C"
      onPress={openScanner}
    />
  }
/>

{/* MFD DATE */}

<TouchableOpacity
  activeOpacity={0.9}
  onPress={() =>
    setShowMfdPicker(true)
  }
>
  <View pointerEvents="none">
    <TextInput
      label="MFD"
      value={form.mfd}
      editable={false}
      mode="outlined"
      left={
        <TextInput.Icon
          icon="calendar"
          color="#EA580C"
        />
      }
      right={
        <TextInput.Icon
          icon="calendar-month"
          color="#EA580C"
        />
      }
      outlineColor="#E5E7EB"
      activeOutlineColor="#EA580C"
      style={{
        width: "100%",
        backgroundColor:
          "#FFFFFF",
        borderRadius: 14,
        marginBottom: 10,
      }}
      contentStyle={{
        fontSize: 15,
        fontWeight: "600",
      }}
    />
  </View>
</TouchableOpacity>


{showMfdPicker && (
  <DateTimePicker
    value={new Date()}
    mode="date"
    display="default"
    onChange={onMfdChange}
  />
)}

{/* BEST BEFORE */}
<TouchableOpacity
  activeOpacity={0.9}
  onPress={() =>
    setShowBestBeforePicker(
      true
    )
  }
>
  <View pointerEvents="none">

    <TextInput
      label="Best Before"
      value={form.bestbefore}
      editable={false}
      mode="outlined"
      left={
        <TextInput.Icon
          icon="calendar-clock"
          color="#EA580C"
        />
      }
      right={
        <TextInput.Icon
          icon="calendar-month"
          color="#EA580C"
        />
      }
      outlineColor="#E5E7EB"
      activeOutlineColor="#EA580C"
      style={{
        width: "100%",
        backgroundColor:
          "#FFFFFF",
        borderRadius: 14,
        marginBottom: 10,
      }}
      contentStyle={{
        fontSize: 15,
        fontWeight: "600",
      }}
    />

  </View>
</TouchableOpacity>


{showBestBeforePicker && (
  <DateTimePicker
    value={new Date()}
    mode="date"
    display="default"
    onChange={
      onBestBeforeChange
    }
  />
)}

{/* DISCOUNT % */}
<TextInput
  label="Discount % *"
  value={form.discount}
  onChangeText={v =>
    updateField(
      "discount",
      v
    )
  }
  mode="outlined"
  keyboardType="numeric"
  left={
    <TextInput.Icon
      icon="percent"
      color="#EA580C"
    />
  }
  outlineColor="#E5E7EB"
  activeOutlineColor="#EA580C"
  style={{
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 10,
  }}
  contentStyle={{
    fontSize: 15,
    fontWeight: "600",
  }}
/>

{/* PRICE TYPE */}
<Menu
  visible={priceTypeMenuVisible}
  onDismiss={() =>
    setPriceTypeMenuVisible(false)
  }
  anchor={
    <TouchableOpacity
      onPress={() =>
        setPriceTypeMenuVisible(true)
      }
    >
      <TextInput
        label="Price Type *"
        value={form.pricetype}
        editable={false}
        mode="outlined"
        left={
          <TextInput.Icon
            icon="tag"
            color="#EA580C"
          />
        }
        right={
          <TextInput.Icon
            icon="chevron-down"
            color="#EA580C"
          />
        }
        outlineColor="#E5E7EB"
        activeOutlineColor="#EA580C"
        style={{
          backgroundColor: "#FFF",
          marginBottom: 10,
        }}
      />
    </TouchableOpacity>
  }
>
  
<Menu.Item
    title="Inclusive"
    onPress={() => {
      updateField(
        "pricetype",
        "Inclusive"
      );
      setPriceTypeMenuVisible(
        false
      );
    }}
  />

  <Menu.Item
    title="Exclusive"
    onPress={() => {
      updateField(
        "pricetype",
        "Exclusive"
      );
      setPriceTypeMenuVisible(
        false
      );
    }}
  />
</Menu>
{/* ================= SGST ================= */}



  <TextInput
    label="SGST %"
    value={form.sgst}
    onChangeText={v =>
      updateField(
        "sgst",
        v
      )
    }
    mode="outlined"
    keyboardType="numeric"
    left={
      <TextInput.Icon
        icon="percent"
        color="#EA580C"
      />
    }
    outlineColor="#E5E7EB"
    activeOutlineColor="#E5E7EB"
    style={{
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      marginBottom:10,
    }}
    contentStyle={{
      fontSize: 15,
      fontWeight: "600",
    }}
  />

  <TextInput
    label="SGST Amount"
    value={String(
      sgstAmount.toFixed(2)
    )}
    editable={false}
    mode="outlined"
    left={
      <TextInput.Icon
        icon="cash"
        color="#EA580C"
      />
    }
    outlineColor="#E5E7EB"
    activeOutlineColor="#EA580C"
    style={{
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      marginBottom:10,
    }}
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
      color: "#EA580C",
    }}
  />



  <TextInput
    label="CGST %"
    value={form.cgst}
    onChangeText={v =>
      updateField(
        "cgst",
        v
      )
    }
    mode="outlined"
    keyboardType="numeric"
    left={
      <TextInput.Icon
        icon="percent"
        color="#EA580C"
      />
    }
    outlineColor="#E5E7EB"
    activeOutlineColor="#EA580C"
    style={{
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      marginBottom:10,
    }}
    contentStyle={{
      fontSize: 15,
      fontWeight: "600",
    }}
  />

  <TextInput
    label="CGST Amount"
    value={String(
      cgstAmount.toFixed(2)
    )}
    editable={false}
    mode="outlined"
    left={
      <TextInput.Icon
        icon="cash"
        color="#EA580C"
      />
    }
    outlineColor="#E5E7EB"
    activeOutlineColor="#EA580C"
    style={{
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      marginBottom:10,
    }}
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
      color: "#EA580C",
    }}
  />

  
  <TextInput
    label="IGST %"
    value={form.igst}
    onChangeText={v =>
      updateField(
        "igst",
        v
      )
    }
    mode="outlined"
    keyboardType="numeric"
    left={
      <TextInput.Icon
        icon="percent"
        color="#EA580C"
      />
    }
    outlineColor="#E5E7EB"
    activeOutlineColor="#EA580C"
    style={{
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      marginBottom:10,
    }}
    contentStyle={{
      fontSize: 15,
      fontWeight: "600",
    }}
  />

  <TextInput
    label="IGST Amount"
    value={String(
      igstAmount.toFixed(2)
    )}
    editable={false}
    mode="outlined"
    left={
      <TextInput.Icon
        icon="cash"
        color="#EA580C"
      />
    }
    outlineColor="#E5E7EB"
    activeOutlineColor="#EA580C"
    style={{
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      marginBottom:10,
    }}
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
      color: "#EA580C",
    }}
  />

<View
  style={{
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  }}
>

  {/* Header */}
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    }}
  >
    <MaterialCommunityIcons
      name="file-percent"
      size={20}
      color="#7C3AED"
    />

    <Text
      style={{
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "800",
        color: "#111827",
      }}
    >
      GST Summary
    </Text>
  </View>

  {/* Discount */}
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    }}
  >
    <Text style={{ color: "#6B7280" }}>
      Discount ({discountPercent.toFixed(2)}%)
    </Text>
    <Text style={{ fontWeight: "700", color: "#DC2626" }}>
      - ₹ {discountAmount.toFixed(2)}
    </Text>
  </View>

  {/* Price after discount, before GST */}
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    }}
  >
    <Text style={{ color: "#6B7280" }}>
      Price after discount
    </Text>
    <Text style={{ fontWeight: "700" }}>
      ₹ {discountedPrice.toFixed(2)}
    </Text>
  </View>

  {/* SGST */}
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    }}
  >
    <Text
      style={{
        color: "#6B7280",
      }}
    >
      SGST ({form.sgst || 0}%)
    </Text>

    <Text
      style={{
        fontWeight: "700",
      }}
    >
      ₹ {sgstAmount.toFixed(2)}
    </Text>
  </View>

  {/* CGST */}
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    }}
  >
    <Text
      style={{
        color: "#6B7280",
      }}
    >
      CGST ({form.cgst || 0}%)
    </Text>

    <Text
      style={{
        fontWeight: "700",
      }}
    >
      ₹ {cgstAmount.toFixed(2)}
    </Text>
  </View>

  {/* IGST */}
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    }}
  >
    <Text
      style={{
        color: "#6B7280",
      }}
    >
      IGST ({form.igst || 0}%)
    </Text>

    <Text
      style={{
        fontWeight: "700",
      }}
    >
      ₹ {igstAmount.toFixed(2)}
    </Text>
  </View>

  {/* Total GST */}
  <View
    style={{
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      paddingTop: 12,
      marginTop: 4,
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  >
    <Text
      style={{
        fontWeight: "800",
        fontSize: 15,
      }}
    >
      Total GST
    </Text>

    <Text
      style={{
        fontWeight: "800",
        fontSize: 16,
        color: "#7C3AED",
      }}
    >
      ₹ {totalGST.toFixed(2)}
    </Text>
  </View>

  {/* Final Price */}
  <View
    style={{
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      paddingTop: 12,
      marginTop: 12,
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  >
    <Text
      style={{
        fontWeight: "900",
        fontSize: 16,
      }}
    >
      Final Price
    </Text>

    <Text
      style={{
        fontWeight: "900",
        fontSize: 20,
        color: "#16A34A",
      }}
    >
      ₹ {finalPrice.toFixed(2)}
    </Text>
  </View>

</View>

{/* ================= FINAL PRICE ================= */}

<LinearGradient
  colors={[
    "#10B981",
    "#059669",
  ]}
  style={{
    borderRadius: 22,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
    elevation: 4,
  }}
>

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <MaterialCommunityIcons
      name="cash-check"
      size={22}
      color="#D1FAE5"
    />

    <Text
      style={{
        marginLeft: 6,
        color: "#D1FAE5",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
      }}
    >
      FINAL SELLING PRICE
    </Text>
  </View>

  <Text
    style={{
      color: "#FFF",
      fontSize: 34,
      fontWeight: "900",
      marginTop: 8,
    }}
  >
    ₹ {finalPrice.toFixed(2)}
  </Text>

  <Text
    style={{
      marginTop: 4,
      color: "rgba(255,255,255,0.8)",
      fontSize: 12,
    }}
  >
    Including GST & Margin
  </Text>

</LinearGradient>
<TouchableOpacity
  activeOpacity={0.8}
  onPress={() =>
    setShowExtra(!showExtra)
  }
  style={{
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <MaterialCommunityIcons
      name="information-outline"
      size={22}
      color="#4F46E5"
    />

    <Text
      style={{
        marginLeft: 8,
        fontSize: 15,
        fontWeight: "800",
        color: "#4F46E5",
      }}
    >
      Additional Details
    </Text>
  </View>

  <MaterialCommunityIcons
    name={
      showExtra
        ? "chevron-up"
        : "chevron-down"
    }
    size={24}
    color="#4F46E5"
  />

</TouchableOpacity>
            {/* EXTRA */}
        {showExtra && (

  <View
    style={{
      backgroundColor: "#F8FAFC",
      borderRadius: 20,
      padding: 16,
      marginTop: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    }}
  >

    {/* HEADER */}

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#EEF2FF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="information-outline"
          size={20}
          color="#4F46E5"
        />
      </View>

      <View
        style={{
          marginLeft: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "900",
            color: "#111827",
          }}
        >
          Additional Details
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: "#6B7280",
          }}
        >
          Product extra information
        </Text>
      </View>
    </View>

    {/* BRAND + HSN */}

   

      <TextInput
        label="Brand Name"
        value={form.brandname}
        onChangeText={v =>
          updateField(
            "brandname",
            v
          )
        }
        mode="outlined"
        left={
          <TextInput.Icon
            icon="tag-outline"
            color="#2563EB"
          />
        }
        style={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: 14,
        }}
      />

      <TextInput
        label="HSN Code"
        value={form.hsncode}
        onChangeText={v =>
          updateField(
            "hsncode",
            v
          )
        }
        mode="outlined"
        left={
          <TextInput.Icon
            icon="barcode"
            color="#D97706"
          />
        }
        style={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: 14,
        }}
      />

    

    {/* MAX QTY */}

    <TextInput
      label="Maximum Quantity"
      value={form.maxqty}
      onChangeText={v =>
        updateField(
          "maxqty",
          v
        )
      }
      mode="outlined"
      keyboardType="numeric"
      left={
        <TextInput.Icon
          icon="package-variant"
          color="#16A34A"
        />
      }
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
      }}
    />

  </View>

)}
            </View>
          </Card.Content>
        </Card>

        {/* BUTTONS */}
       <View
  style={{
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 30,
  }}
>

  {/* SAVE / UPDATE */}

  <Button
    mode="contained"
    onPress={handleSave}
    icon={
      isEdit
        ? "content-save-edit"
        : "plus-circle"
    }
    style={{
      flex: 1,
      height: 52,
      justifyContent: "center",
      borderRadius: 14,
      marginRight: 10,
      backgroundColor: "#4F46E5",
    }}
    labelStyle={{
      fontSize: 15,
      fontWeight: "800",
      color: "#FFF",
    }}
  >
    {isEdit
      ? "Update Product"
      : "Create Product"}
  </Button>

  {/* CANCEL */}

  <Button
    mode="outlined"
    onPress={() =>
      navigation.goBack()
    }
    icon="close-circle-outline"
    style={{
      flex: 1,
      height: 52,
      justifyContent: "center",
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: "#EF4444",
    }}
    labelStyle={{
      fontSize: 15,
      fontWeight: "800",
      color: "#EF4444",
    }}
  >
    Cancel
  </Button>



</View>



      </ScrollView>

<Modal
  visible={scannerVisible}
  animationType="slide"
>
  <View
    style={{
      flex: 1,
    }}
  >
    <CameraView
      style={{
        flex: 1,
      }}
      facing="back"
      barcodeScannerSettings={{
        barcodeTypes: [
          "ean13",
          "ean8",
          "code128",
          "code39",
          "qr",
          "upc_a",
          "upc_e",
        ],
      }}
      onBarcodeScanned={
        handleBarcodeScanned
      }
    />

    <TouchableOpacity
      onPress={() =>
        setScannerVisible(false)
      }
      style={{
        position: "absolute",
        bottom: 50,
        alignSelf: "center",
        backgroundColor:
          "#EA580C",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontWeight: "700",
        }}
      >
        Close Scanner
      </Text>
    </TouchableOpacity>
  </View>
</Modal>
    </View>
  );
}
