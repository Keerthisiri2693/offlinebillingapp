import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
  TextInput,
} from "react-native";

import * as SQLite
from "expo-sqlite";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  useRouter,
} from "expo-router";

const db =
  SQLite.openDatabaseSync(
    "app1.db"
  );

export default function StockScreen() {

  const router =
    useRouter();

  const [products,
    setProducts] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  // CREATE TABLE

const createProductTable = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY NOT NULL,

        productcode TEXT,
        productenglishname TEXT,
        producttamilName TEXT,

        producttype TEXT,
        subtype TEXT,
        brandname TEXT,

        unittype TEXT,
        uom TEXT,

        purchase REAL DEFAULT 0,
        profit REAL DEFAULT 0,
        loss REAL DEFAULT 0,

        wholesale REAL DEFAULT 0,
        retail REAL DEFAULT 0,
        mrp REAL DEFAULT 0,

        discount REAL DEFAULT 0,
        finalprice REAL DEFAULT 0,

        stockquantity REAL DEFAULT 0,
        stockvalue REAL DEFAULT 0,
        maxqty REAL DEFAULT 0,

        barcode TEXT,
        sellingcode TEXT,

        competitor1 TEXT,
        competitor2 TEXT,

        mfd TEXT,
        exp TEXT,
        bestbefore TEXT,

        pricetype TEXT,

        sgst REAL DEFAULT 0,
        cgst REAL DEFAULT 0,
        igst REAL DEFAULT 0,

        hsn TEXT,
        hsncode TEXT,

        createdAt TEXT
      );
    `);

    console.log("✅ PRODUCTS TABLE READY");
  } catch (error) {
    console.log("❌ TABLE ERROR:", error);
  }
};
  // LOAD PRODUCTS
const loadProducts = async () => {
  try {
    const result = await db.getAllAsync(`
      SELECT *
      FROM products
      ORDER BY createdAt DESC
    `);

    console.log("📦 Products:", result);

    if (Array.isArray(result)) {
      console.log("📦 First Product:", result[0]);
      setProducts(result);
    } else {
      setProducts([]);
    }
  } catch (error) {
    console.log("❌ PRODUCT LOAD ERROR:", error);
    setProducts([]);
  }
};

  // INITIAL LOAD

  useEffect(() => {

    const init =
      async () => {

      await createProductTable();

      await loadProducts();

    };

    init();

  }, []);

  // SAFE SEARCH FILTER

  const filteredProducts =
    Array.isArray(products)

      ? products.filter(item => {

          const name =
            String(
              item?.productenglishname ||
              ""
            );

          return name
            .toLowerCase()
            .startsWith(
              String(
                search || ""
              ).toLowerCase()
            );

        })

      : [];

  // DELETE PRODUCT

  const deleteProduct =
    (id) => {

    Alert.alert(

      "Delete",

      "Delete this product?",

      [

        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",

          style:
            "destructive",

          onPress:
            async () => {

            try {

              await db.runAsync(

                `
                DELETE FROM products
                WHERE id = ?
                `,

                [id]
              );

              console.log(
                "✅ PRODUCT DELETED"
              );

              await loadProducts();

            } catch (error) {

              console.log(
                "❌ DELETE ERROR:",
                error
              );

            }
          },
        },
      ]
    );
  };

  // RENDER ITEM

  const renderItem =
    ({ item }) => (

    <View style={styles.card}>

      {/* TOP */}

      <View style={styles.topRow}>

        <View style={{ flex: 1 }}>

          <Text
            style={
              styles.productName
            }
          >
            {
              item?.productenglishname ||
              "-"
            }
          </Text>

          <Text
            style={
              styles.productCode
            }
          >
            Code :
            {" "}
            {
              item?.productcode ||
              "-"
            }
          </Text>

        </View>

        

        <TouchableOpacity
          onPress={() =>
            deleteProduct(
              item.id
            )
          }
        >

          <MaterialCommunityIcons
            name="delete"
            size={24}
            color="#ef4444"
          />

        </TouchableOpacity>



      </View>

      {/* DETAILS */}

      <View style={styles.row}>

        <View
          style={
            styles.infoBox
          }
        >

          <Text
            style={
              styles.label
            }
          >
            Purchase
          </Text>

          <Text
            style={
              styles.value
            }
          >
            ₹
            {item?.purchase || 0}
          </Text>

        </View>

        <View
          style={
            styles.infoBox
          }
        >

          <Text
            style={
              styles.label
            }
          >
            Retail
          </Text>

          <Text
            style={
              styles.value
            }
          >
            ₹
            {item?.retail || 0}
          </Text>

        </View>

        <View
          style={
            styles.infoBox
          }
        >

          <Text
            style={
              styles.label
            }
          >
            Stock
          </Text>

          <Text
            style={
              styles.stockValue
            }
          >
            {
              item?.stockquantity ||
              0
            }
          </Text>

        </View>

      </View>

      {/* BOTTOM */}

      <View
        style={
          styles.bottomRow
        }
      >

        <Text
          style={
            styles.productType
          }
        >
          {
            item?.producttype ||
            "-"
          }
        </Text>

       <Text style={styles.date}>
  {item?.createdAt
    ? `${new Date(item.createdAt).toLocaleDateString("en-GB")} ${new Date(item.createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "-"}
</Text>

      </View>

    </View>
  );

  return (

    <View style={styles.container}>

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
  onPress={() => router.back()}
  style={{
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.15)",
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
              View Stock
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
     
        
     
       </SafeAreaView>
     
     </LinearGradient>

      {/* SEARCH */}

      <View
        style={
          styles.searchBox
        }
      >

        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color="#64748b"
        />

        <TextInput
          placeholder="Search Product..."
          value={search || ""}
          onChangeText={(
            text
          ) =>
            setSearch(
              text || ""
            )
          }
          style={
            styles.searchInput
          }
          placeholderTextColor="#94a3b8"
        />

      </View>

      {/* PRODUCT LIST */}

      <FlatList
        data={
          filteredProducts ||
          []
        }
        keyExtractor={(
          item,
          index
        ) =>
          item?.id
            ? item.id.toString()
            : index.toString()
        }
        renderItem={
          renderItem
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          padding: 14,
          paddingBottom: 120,
        }}
        ListEmptyComponent={

          <View
            style={
              styles.emptyBox
            }
          >

            <MaterialCommunityIcons
              name="package-variant"
              size={80}
              color="#cbd5e1"
            />

            <Text
              style={
                styles.emptyText
              }
            >
              No Products Found
            </Text>

          </View>

        }
      />

      {/* FLOAT BUTTON */}

      <TouchableOpacity
        style={
          styles.floatingBtn
        }
        activeOpacity={0.9}
        onPress={() =>
          router.push(
            "/src/screens/CreateStockScreen"
          )
        }
      >

        <MaterialCommunityIcons
          name="plus"
          size={32}
          color="#fff"
        />

      </TouchableOpacity>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        "#f1f5f9",
    },

    header: {
      paddingTop: 20,
      paddingBottom: 25,
      paddingHorizontal: 18,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },

    headerTitle: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "bold",
    },

    headerSub: {
      color: "#dbeafe",
      marginTop: 4,
      fontSize: 14,
    },

    searchBox: {

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        "#fff",

      marginHorizontal: 15,

      marginTop: -15,

      marginBottom: 10,

      borderRadius: 14,

      paddingHorizontal: 14,

      elevation: 4,

      height: 55,
    },

    searchInput: {

      flex: 1,

      marginLeft: 10,

      color: "#0f172a",

      fontSize: 16,
    },

    card: {
      backgroundColor:
        "#fff",
      borderRadius: 20,
      padding: 16,
      marginBottom: 14,
      elevation: 4,
    },

    topRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },

    productName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#0f172a",
    },

    productCode: {
      color: "#64748b",
      marginTop: 4,
    },

    row: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginBottom: 15,
    },

    infoBox: {
      flex: 1,
      alignItems: "center",
    },

    label: {
      color: "#64748b",
      fontSize: 13,
      marginBottom: 4,
    },

    value: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#0f172a",
    },

    stockValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#16a34a",
    },

    bottomRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor:
        "#e2e8f0",
      paddingTop: 12,
    },

    productType: {
      color: "#2563eb",
      fontWeight: "bold",
    },

    date: {
      color: "#64748b",
      fontSize: 12,
    },

    emptyBox: {
      marginTop: 100,
      justifyContent:
        "center",
      alignItems: "center",
    },

    emptyText: {
      marginTop: 10,
      fontSize: 16,
      color: "#94a3b8",
      fontWeight: "600",
    },

    floatingBtn: {

      position:
        "absolute",

      bottom: 60,

      right: 20,

      width: 65,

      height: 65,

      borderRadius: 35,

      backgroundColor:
        "#2563eb",

      justifyContent:
        "center",

      alignItems: "center",

      elevation: 8,
    },
  });