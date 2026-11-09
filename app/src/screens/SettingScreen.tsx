import React, {
  useState,
  useCallback,useEffect
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";
import * as Linking from "expo-linking";
import * as DocumentPicker from "expo-document-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";


import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  getFirestore,
  doc,
  getDoc
} from "firebase/firestore";

import {
  app,
} from "../database/firebase";


import { getDB } from "../database/sqlite";

import {
getLoggedInUser,
  logoutUser,
  getProfileLocal,
  getProducts,
  getNewInvoices,
  getSalesReturns,
  getPurchaseReturns,
  getPurchases,
  getStock,
  saveStock,
  saveProfileLocal,
  saveProduct,
  getFullReport,
  insertNewInvoice,
  savePurchase,
  saveSalesReturn,
  savePurchaseReturn,
  saveLedger,
  clearProfile,
  getLedgers,
} from "../database/sqlite";

import {
  router,
} from "expo-router";

import styles from "../style/SettingScreenStyle";





const db = getFirestore(app);



export default function SettingsScreen() {

  const [notifications,
    setNotifications] =
    useState(true);

  const [darkMode,
    setDarkMode] =
    useState(false);

  const [user,
    setUser] =
    useState(null);

  const [shop,
    setShop] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  const normalizeImage = (value: any): string => {
  if (!value) return "";

  const image = String(value).trim();

  if (image.startsWith("data:image/")) {
    return image;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // OLD EXPO LOCAL PATH — DO NOT USE
  if (image.startsWith("file://")) {
    console.log("⚠️ OLD file:// IMAGE FOUND - IGNORING");
    return "";
  }

  return "";
};

    const COLORS = darkMode
  ? {
      background: "#121212",
      card: "#1E1E1E",
      text: "#FFFFFF",
      subText: "#A1A1AA",
      border: "#2E2E2E",
      primary: "#9333EA",
      white: "#FFFFFF",
    }
  : {
      background: "#F5F7FB",
      card: "#FFFFFF",
      text: "#111827",
      subText: "#6B7280",
      border: "#E5E7EB",
      primary: "#9333EA",
      white: "#FFFFFF",
    };


    const clearAllDatabaseData = async () => {
  try {
    const database = await getDB();

    if (!database) {
      Alert.alert(
        "Error",
        "Database not initialized"
      );
      return;
    }

    await database.execAsync(`
      DELETE FROM newinvoice_items;
      DELETE FROM newinvoice;

      DELETE FROM purchase_items;
      DELETE FROM purchases;

      DELETE FROM sales_return_items;
      DELETE FROM sales_returns;

      DELETE FROM purchase_return_items;
      DELETE FROM purchase_returns;

      DELETE FROM stock;

      DELETE FROM products;

      DELETE FROM ledger;

      DELETE FROM profile;
    `);

    Alert.alert(
      "Success",
      "All local data cleared successfully"
    );

  } catch (error) {

    console.log(
      "CLEAR DATA ERROR:",
      error
    );

    Alert.alert(
      "Error",
      error?.message ||
      "Failed to clear data"
    );
  }
};

  // =========================
  // LOAD SCREEN
  // =========================

  useFocusEffect(

    useCallback(() => {

      const init =
        async () => {

        await loadUser();

      };

      init();

    }, [])

  );


  useEffect(() => {
  loadTheme();
}, []);

const loadTheme = async () => {
  try {
    const value = await AsyncStorage.getItem("darkMode");
    if (value !== null) {
      setDarkMode(JSON.parse(value));
    }
  } catch (error) {
    console.log("Theme Load Error:", error);
  }
};


const toggleDarkMode = async (value: boolean) => {
  try {
    setDarkMode(value);
    await AsyncStorage.setItem(
      "darkMode",
      JSON.stringify(value)
    );

    console.log("Dark Mode:", value);
  } catch (error) {
    console.log("Theme Save Error:", error);
  }
};

  // =========================
  // LOAD USER
  // =========================

  const loadUser =
    async () => {

    try {

      setLoading(true);

      const res =
        await getLoggedInUser();

      console.log(
        "USER =",
        res
      );

      setUser(res);

      if (res) {

        await loadShopProfile(
          res
        );

      }

    } catch (error) {

      console.log(
        "User error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  

  // =========================
  // LOAD SHOP PROFILE
  // =========================

const loadShopProfile = async (userData: any) => {
  try {
    console.log("================================");
    console.log("🏪 LOAD SHOP PROFILE");
    console.log("USER DATA =", userData);
    console.log("================================");

    // =========================
    // GET EMAIL
    // =========================

    const emailId = String(
      userData?.email ||
      userData?.emailId ||
      ""
    )
      .trim()
      .toLowerCase();

    console.log("📧 FIRESTORE EMAIL =", emailId);

    if (!emailId) {
      console.log("❌ USER EMAIL NOT FOUND");
      setShop(null);
      return;
    }

    // =========================
    // FIRESTORE DOCUMENT
    // =========================

    const docRef = doc(
      db,
      "shopProfiles",
      emailId
    );

    console.log(
      "📄 FIRESTORE PATH =",
      `shopProfiles/${emailId}`
    );

    const docSnap = await getDoc(docRef);

    console.log(
      "📦 DOCUMENT EXISTS =",
      docSnap.exists()
    );

    if (!docSnap.exists()) {
      console.log(
        "❌ SHOP PROFILE NOT FOUND:",
        emailId
      );

      setShop(null);
      return;
    }

    // =========================
    // FIRESTORE DATA
    // =========================

    const shopData = docSnap.data();

    console.log(
      "✅ SHOP PROFILE DATA =",
      shopData
    );

    // =========================
    // NORMALIZE IMAGE
    // =========================

    const fixedImage = normalizeImage(
      shopData?.image
    );

    // =========================
    // IMAGE DEBUG
    // =========================

    if (!shopData?.image) {
      console.log(
        "ℹ️ NO SHOP IMAGE FOUND"
      );
    } else if (
      String(shopData.image).startsWith("file://")
    ) {
      console.log(
        "⚠️ OLD file:// IMAGE FOUND IN FIRESTORE"
      );

      console.log(
        "⚠️ OLD IMAGE =",
        shopData.image
      );

      console.log(
        "⚠️ OLD IMAGE WILL NOT BE USED"
      );
    } else if (
      fixedImage.startsWith("data:image/")
    ) {
      console.log(
        "✅ BASE64 IMAGE FOUND"
      );

      console.log(
        "📦 BASE64 LENGTH =",
        fixedImage.length
      );

      console.log(
        "🔤 BASE64 START =",
        fixedImage.substring(0, 40)
      );
    } else if (
      fixedImage.startsWith("http://") ||
      fixedImage.startsWith("https://")
    ) {
      console.log(
        "🌐 REMOTE IMAGE URL FOUND"
      );
    } else {
      console.log(
        "⚠️ INVALID IMAGE VALUE"
      );
    }

    // =========================
    // SET SHOP
    // =========================

    setShop({
      ...shopData,
      image: fixedImage,
    });

    console.log(
      "✅ SHOP PROFILE SET"
    );

  } catch (error: any) {
    console.log(
      "❌ FIRESTORE SHOP PROFILE ERROR =",
      error
    );

    console.log(
      "❌ ERROR MESSAGE =",
      error?.message
    );

    setShop(null);

    Alert.alert(
      "Error",
      error?.message ||
      "Failed to load shop profile"
    );
  }
};

//delete data


const clearAllLocalData = async () => {

  try {

    const database = await getDB();

    if (!database) {

      Alert.alert(
        "Error",
        "Database not initialized"
      );

      return;

    }

    await database.execAsync(`

      DELETE FROM newinvoice_items;
      DELETE FROM newinvoices;

      DELETE FROM purchase_items;
      DELETE FROM purchases;

      DELETE FROM sales_return_items;
      DELETE FROM sales_returns;

      DELETE FROM purchase_return_items;
      DELETE FROM purchase_returns;

      DELETE FROM stock;

      DELETE FROM products;

      DELETE FROM ledger;

      DELETE FROM profile;

    `);

    Alert.alert(
      "Success",
      "All local data cleared"
    );

  } catch (error) {

    console.log(
      "CLEAR DATA ERROR:",
      error
    );

    Alert.alert(
      "Error",
      error?.message ||
      "Failed to clear data"
    );

  }

};
  // =========================
  // LOGOUT
  // =========================


const handleLogout =
  () => {

  Alert.alert(

    "Logout",

    "Are you sure you want to logout?",

    [

      {
        text: "Cancel",

        style: "cancel",
      },

      {

        text: "Logout",

        style: "destructive",

        onPress:
          async () => {

          try {

            console.log(
              "🚪 Logging out..."
            );

            // =========================
            // LOGOUT USER
            // =========================

            const success =

              await logoutUser();

            if (!success) {

              Alert.alert(
                "Error",
                "Logout failed"
              );

              return;
            }

            // =========================
            // CLEAR LOCAL PROFILE
            // =========================

            await clearProfile();

            console.log(
              "✅ Logout Success"
            );

            // =========================
            // CLEAR NAVIGATION
            // =========================

            router.dismissAll();

            // =========================
            // REDIRECT LOGIN
            // =========================

            setTimeout(() => {

              router.replace(
                "/src/screens/LoginScreen"
              );

            }, 200);

          } catch (error) {

            console.log(
              "❌ Logout error:",
              error
            );

            Alert.alert(
              "Error",
              "Something went wrong"
            );

          }

        },

      },

    ]

  );

};


  // =========================
  // EXPORT
  // =========================

const exportAllData = async () => {
  try {

    const profile = await getProfileLocal();

if (profile) {
  const fixedProfile = {
    ...profile,
    image: normalizeImage(profile.image),
  };

  console.log(
    "✅ SHOP PROFILE DATA =",
    fixedProfile
  );

  setShop(fixedProfile);
}


    const products = await getProducts();
    const sales = await getNewInvoices();
    const purchases = await getPurchases();
    const salesReturns = await getSalesReturns();
    const purchaseReturns = await getPurchaseReturns();
    const ledgers = await getLedgers(); // 👈 Add this
    const stock = await getStock ();
    console.log(ledgers);

    const backupData = {

      exportedAt: new Date().toISOString(),

      profile: profile
        ? (
            Array.isArray(profile)
              ? profile
              : [profile]
          )
        : [],

      products: products || [],

      ledgers: ledgers || [], // 👈 Add this

      sales: sales || [],

      purchases: purchases || [],

      salesReturns: salesReturns || [],

      purchaseReturns: purchaseReturns || [],

      stock : stock || [],

    };

    const jsonString = JSON.stringify(
      backupData,
      null,
      2
    );

    const fileUri =
      `${FileSystem.documentDirectory}BusinessBackup.json`;

    await FileSystem.writeAsStringAsync(
      fileUri,
      jsonString,
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );

    if (await Sharing.isAvailableAsync()) {

      await Sharing.shareAsync(
        fileUri,
        {
          mimeType: "application/json",
          dialogTitle: "Share Business Backup",
        }
      );

      Alert.alert(
        "Success",
        "JSON backup exported successfully"
      );

    } else {

      Alert.alert(
        "Error",
        "Sharing unavailable"
      );

    }

  } catch (e) {

    console.log(
      "EXPORT ERROR =",
      e
    );

    Alert.alert(
      "Export Failed",
      e?.message ||
      "Something went wrong"
    );

  }
};

  // =========================
  // IMPORT
  // =========================

  const handleImport =
    async () => {

    try {

      Alert.alert(
        "Import Warning",
        "Existing data may duplicate"
      );

      const result =

        await DocumentPicker.getDocumentAsync({

          type: "*/*",

          copyToCacheDirectory: false,

          multiple: false,

        });

      if (
        result.canceled ||
        !result.assets?.length
      ) return;

      const file =
        result.assets[0];

      if (

        file.uri.includes(
          "com.google.android.apps.docs.storage"
        )

      ) {

        Alert.alert(

          "Download Required",

          "Download file from Google Drive first",

          [

            {
              text: "Cancel",
              style: "cancel",
            },

            {

              text: "Open Drive",

              onPress:
                async () => {

                await Linking.openURL(
                  "https://drive.google.com"
                );

              },

            },

          ]

        );

        return;

      }

      await importBackupData(
        file
      );

    } catch (e) {

      console.log(
        "IMPORT ERROR =",
        e
      );

      Alert.alert(
        "Import Error",
        e?.message ||
        "Import failed"
      );

    }

  };

  // =========================
  // IMPORT DATA
  // =========================

const importBackupData = async (file) => {

  try {

    const response =
      await fetch(file.uri);

    const jsonString =
      await response.text();

    const backupData =
      JSON.parse(jsonString);

    console.log(
      "BACKUP KEYS:",
      Object.keys(backupData)
    );

    await clearAllLocalData();

    // PROFILE

    if (backupData.profile) {

      const profiles =
        Array.isArray(
          backupData.profile
        )
          ? backupData.profile
          : [backupData.profile];

      for (const item of profiles) {

        await saveProfileLocal(
          item
        );

      }

    }

    // PRODUCTS

    for (const item of (backupData.products || [])) {

      await saveProduct(item);

    }

    // LEDGERS

    const ledgerData =

      backupData.ledgers ||

      backupData.ledger ||

      [];

    console.log(
      "LEDGER COUNT:",
      ledgerData.length
    );

    for (const item of ledgerData) {

      try {

        console.log(
          "IMPORTING LEDGER:",
          item
        );

        await saveLedger(
          item
        );

      } catch (error) {

        console.log(
          "LEDGER IMPORT ERROR:",
          error
        );

      }

    }

    const invoiceData =
  backupData.invoices ||
  backupData.sales ||
  [];

console.log(
  "INVOICE COUNT:",
  invoiceData.length
);
    // SALES

   for (const item of invoiceData) {

  console.log(
    "IMPORTING INVOICE:",
    item.invoiceNo
  );

  await saveInvoice(
    item,
    item.items || []
  );

}

    // PURCHASES

    for (const item of (backupData.purchases || [])) {

      await savePurchase(
        item,
        item.items || []
      );
    }



const salesReturnData =
  backupData.salesReturns ||
  backupData.SalesReturn ||
  [];

console.log(
  "📦 SALES RETURN COUNT:",
  salesReturnData.length
);

for (const item of salesReturnData) {
  await saveSalesReturn(
    item,
    item.items || []
  );
}


const purchaseReturnData =
  backupData.purchaseReturns ||
  backupData.PurchaseReturn ||
  [];

console.log(
  "📦 PURCHASE RETURN COUNT:",
  purchaseReturnData.length
);

for (const item of purchaseReturnData) {
  await savePurchaseReturn(
    item,
    item.items || []
  );
}


//stock

const stockData =
  backupData.stock ||
  backupData.Stock ||
  [];

console.log(
  "📦 STOCK COUNT:",
  stockData.length
);

for (const item of stockData) {

  console.log(
    "📦 IMPORTING STOCK:",
    item.productName
  );

  await saveStock(item);

}

const importedStock =
  await getStock();

console.log(
  "📦 STOCK AFTER IMPORT:",
  importedStock.length
);

    // VERIFY IMPORT

    const importedLedgers =
      await getLedgers();

    console.log(
      "LEDGERS AFTER IMPORT:",
      importedLedgers
    );

    Alert.alert(
      "Success",
      `Backup imported successfully\nLedgers: ${importedLedgers.length}`
    );

  } catch (e) {

    console.log(
      "IMPORT ERROR =",
      e
    );

    Alert.alert(
      "Import Failed",
      e?.message ||
      "Import failed"
    );

  }

};


  // =========================
  // NAVIGATION
  // =========================

  const goToBusiness =
    () => {

    router.push(
      "/src/screens/BusinessDetailsScreen"
    );

  };

  const goToAbout =
    () => {

    router.push(
      "/src/screens/AboutScreen"
    );

  };

  // =========================
  // UI
  // =========================

return (

<View
  style={[
    styles.container,
    {
      backgroundColor: COLORS.background,
    },
  ]}>

  {/* MODERN HEADER */}

  <LinearGradient
    colors={[
      "#4F46E5",
      "#7C3AED",
      "#9333EA",
    ]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.header}>

    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}>

      <View>

        <Text style={styles.headerTitle}>
          Settings
        </Text>

        <Text style={styles.headerSubtitle}>
          Manage your business account
        </Text>

      </View>

      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 18,

          backgroundColor:
            "rgba(255,255,255,0.15)",

          justifyContent: "center",
          alignItems: "center",
        }}>

        <MaterialCommunityIcons
          name="cog-outline"
          size={28}
          color="#fff"
        />

      </View>

    </View>

  </LinearGradient>

  <ScrollView
    contentContainerStyle={styles.body}
    showsVerticalScrollIndicator={false}>

    {/* LOADING */}

    {loading && (

      <View
        style={{
          marginTop: 60,
          alignItems: "center",
        }}>

        <View
          style={{
            backgroundColor: "#fff",
            padding: 24,
            borderRadius: 24,

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.08,
            shadowRadius: 8,

            elevation: 5,
          }}>

          <ActivityIndicator
            size="large"
            color="#6D28D9"
          />

        </View>

        <Text
          style={{
            marginTop: 16,
            color: "#64748B",
            fontSize: 15,
            fontWeight: "600",
          }}>

          Loading business profile...

        </Text>

      </View>

    )}

    {/* SHOP CARD */}

{!loading && (
  <LinearGradient
    colors={["#ffffff", "#f8fafc"]}
    style={styles.shopCard}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* =========================
          SHOP IMAGE
          ========================= */}

      {shop?.image &&
      (
        shop.image.startsWith("data:image/") ||
        shop.image.startsWith("http://") ||
        shop.image.startsWith("https://")
      ) ? (
        <Image
          source={{
            uri: shop.image,
          }}
          style={styles.shopImage}
          resizeMode="cover"
          onError={(error) => {
            console.log(
              "❌ SHOP IMAGE LOAD ERROR:",
              error.nativeEvent
            );
          }}
        />
      ) : (
        <View style={styles.shopPlaceholder}>
          <LinearGradient
            colors={["#6366F1", "#8B5CF6"]}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="storefront-outline"
              size={36}
              color="#fff"
            />
          </LinearGradient>
        </View>
      )}

      {/* =========================
          SHOP DETAILS
          ========================= */}

      <View
        style={{
          flex: 1,
          minWidth: 0,
          marginLeft: 14,
          justifyContent: "center",
        }}
      >
        {/* SHOP NAME */}

        <Text
          style={styles.shopName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {shop?.shopName || "My Business"}
        </Text>

        {/* EMAIL */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 4,
            minWidth: 0,
          }}
        >
          <MaterialCommunityIcons
            name="email-outline"
            size={14}
            color="#64748B"
          />

          <Text
            style={[
              styles.shopInfo,
              {
                marginLeft: 6,
                flex: 1,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {shop?.email || "No Email"}
          </Text>
        </View>

        {/* MOBILE */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 4,
            minWidth: 0,
          }}
        >
          <MaterialCommunityIcons
            name="phone-outline"
            size={14}
            color="#64748B"
          />

          <Text
            style={[
              styles.shopInfo,
              {
                marginLeft: 6,
                flex: 1,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {shop?.mobile || "No Mobile"}
          </Text>
        </View>

        {/* CATEGORY */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 4,
            minWidth: 0,
          }}
        >
          <MaterialCommunityIcons
            name="shape-outline"
            size={14}
            color="#64748B"
          />

          <Text
            style={[
              styles.shopInfo,
              {
                marginLeft: 6,
                flex: 1,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {shop?.categories || "No Categories"}
          </Text>
        </View>
      </View>

      {/* =========================
          EDIT BUTTON
          ========================= */}

      <TouchableOpacity
        onPress={goToBusiness}
        activeOpacity={0.85}
        style={{
          width: 46,
          height: 46,
          borderRadius: 16,
          overflow: "hidden",
          flexShrink: 0,
          marginLeft: 10,
        }}
      >
        <LinearGradient
          colors={["#4F46E5", "#7C3AED"]}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={20}
            color="#fff"
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </LinearGradient>
)}

    {/* SETTINGS SECTION */}

    <Text
      style={{
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 14,
        marginTop: 10,
        marginLeft: 4,
      }}>

      Preferences

    </Text>

    <View style={styles.settingsCard}>

      {/* NOTIFICATION */}

      <View style={styles.settingItem}>

        <View style={styles.leftSection}>

          <View
            style={[
              styles.iconBox,
              styles.iconBlue,
            ]}>

            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={22}
              color="#2563EB"
            />

          </View>

          <View>

            <Text style={styles.settingText}>
              Notifications
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginTop: 2,
              }}>

              Enable app alerts

            </Text>

          </View>

        </View>

        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{
            false: "#D1D5DB",
            true: "#6366F1",
          }}
          thumbColor="#fff"
        />

      </View>

      <View style={styles.divider} />

      {/* DARK MODE */}

      <View style={styles.settingItem}>

        <View style={styles.leftSection}>

          <View
            style={[
              styles.iconBox,
              styles.iconPurple,
            ]}>

            <MaterialCommunityIcons
              name="moon-stars"
              size={22}
              color="#9333EA"
            />

          </View>

          <View>

            <Text style={styles.settingText}>
              Dark Mode
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginTop: 2,
              }}>

              Reduce eye strain

            </Text>

          </View>

        </View>

        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          trackColor={{
            false: "#D1D5DB",
            true: "#9333EA",
          }}
          thumbColor="#fff"
        />

      </View>

    </View>

    {/* DATA SECTION */}

    <Text
      style={{
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 14,
        marginTop: 26,
        marginLeft: 4,
      }}>

      Backup & Data

    </Text>

    <View style={styles.settingsCard}>

      {/* EXPORT */}

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.settingItem}
        onPress={exportAllData}>

        <View style={styles.leftSection}>

          <View
            style={[
              styles.iconBox,
              styles.iconGreen,
            ]}>

            <MaterialCommunityIcons
              name="database-export-outline"
              size={22}
              color="#16A34A"
            />

          </View>

          <View>

            <Text style={styles.settingText}>
              Export Backup
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginTop: 2,
              }}>

              Save your business data

            </Text>

          </View>

        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#9CA3AF"
        />

      </TouchableOpacity>

      <View style={styles.divider} />

      {/* IMPORT */}

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.settingItem}
        onPress={handleImport}>

        <View style={styles.leftSection}>

          <View
            style={[
              styles.iconBox,
              styles.iconRed,
            ]}>

            <MaterialCommunityIcons
              name="database-import-outline"
              size={22}
              color="#E11D48"
            />

          </View>

          <View>

            <Text style={styles.settingText}>
              Import Backup
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginTop: 2,
              }}>

              Restore saved data

            </Text>

          </View>

        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#9CA3AF"
        />

      </TouchableOpacity>

      <View style={styles.divider} />



      {/* delete */}


        <View style={styles.divider} />

      {/* IMPORT */}

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.settingItem}
        onPress={clearAllDatabaseData}>

        <View style={styles.leftSection}>

          <View
            style={[
              styles.iconBox,
              styles.iconRed,
            ]}>

            <MaterialCommunityIcons
              name="database-import-outline"
              size={22}
              color="#E11D48"
            />

          </View>

          <View>

            <Text style={styles.settingText}>
              Delete Data
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginTop: 2,
              }}>

              Delete saved data

            </Text>

          </View>

        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#9CA3AF"
        />

      </TouchableOpacity>

      <View style={styles.divider} />

      {/* ABOUT */}

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.settingItem}
        onPress={goToAbout}>

        <View style={styles.leftSection}>

          <View
            style={[
              styles.iconBox,
              styles.iconOrange,
            ]}>

            <MaterialCommunityIcons
              name="information-outline"
              size={22}
              color="#D97706"
            />

          </View>

          <View>

            <Text style={styles.settingText}>
              About Application
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginTop: 2,
              }}>

              App version and details

            </Text>

          </View>

        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#9CA3AF"
        />

      </TouchableOpacity>

    </View>

    {/* LOGOUT */}

    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.logout}
      onPress={handleLogout}>

      <LinearGradient
        colors={[
          "#EF4444",
          "#DC2626",
        ]}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          paddingVertical: 17,
          borderRadius: 22,
        }}>

        <MaterialCommunityIcons
          name="logout"
          size={22}
          color="#fff"
        />

        <Text style={styles.logoutText}>
          Logout
        </Text>

      </LinearGradient>

    </TouchableOpacity>

  </ScrollView>

</View>

);

}