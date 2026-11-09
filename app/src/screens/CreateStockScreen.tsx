import React, {
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";

import {
  TextInput,
  Menu,
} from "react-native-paper";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import * as SQLite
from "expo-sqlite";

import {
  getDB,
  saveStock,
} from "../database/sqlite";

import {
  router,
} from "expo-router";




import DateTimePicker
from
"@react-native-community/datetimepicker";

export default function AddStockScreen() {

  // STOCK TYPE



  const [stockType,
    setStockType] =
    useState(
      "OPENINGSTOCK"
    );

  const [stockTypeMenu,
    setStockTypeMenu] =
    useState(false);
const [
  showDatePicker,
  setShowDatePicker
] = useState(false);

const onDateChange = (
  event,
  selectedDate
) => {

  setShowDatePicker(false);

  if (selectedDate) {

    const formatted =
      `${String(
        selectedDate.getDate()
      ).padStart(2, "0")}/${
        String(
          selectedDate.getMonth() + 1
        ).padStart(2, "0")
      }/${
        selectedDate.getFullYear()
      }`;

    setDate(
      formatted
    );

  }

};

  // FROM STOCK

  const [fromStock,
    setFromStock] =
    useState(
      "MAIN STOCK"
    );

  const [fromStockMenu,
    setFromStockMenu] =
    useState(false);

  // PRODUCT

  const [productName,
    setProductName] =
    useState("");

  const [batchNo,
    setBatchNo] =
    useState("");

  const [batch,
    setBatch] =
    useState("");

  // PRICE

  const [purchaseRate,
    setPurchaseRate] =
    useState("");

  const [wholesaleProfit,
    setWholesaleProfit] =
    useState("");

  const [wholesalePrice,
    setWholesalePrice] =
    useState("");

  const [retailProfit,
    setRetailProfit] =
    useState("");

  const [retailPrice,
    setRetailPrice] =
    useState("");

  // STOCK

  const [currentStock,
    setCurrentStock] =
    useState("");

  const [stockQty,
    setStockQty] =
    useState("");

  // DATE

  const [date,
    setDate] =
    useState(
      new Date()
        .toLocaleDateString()
    );

  // ENTRY TYPE

  const [entryType,
    setEntryType] =
    useState("Increase");

  const [entryMenuVisible,
    setEntryMenuVisible] =
    useState(false);

  // EXTRA

  const [referenceNo,
    setReferenceNo] =
    useState("");

  const [transactionNo,
    setTransactionNo] =
    useState("");

  const [narration,
    setNarration] =
    useState("");

  // PRODUCT SEARCH

  const [suggestions,
    setSuggestions] =
    useState([]);

  // =========================
  // PRODUCT SEARCH
  // =========================

  const searchProducts =
    async (value) => {

    try {

      setProductName(
        value || ""
      );

      if (
        !value ||
        value.trim() === ""
      ) {

        setSuggestions([]);

        return;
      }

      const db =
        await getDB();

      if (!db) {

        return;
      }

      const columns = await db.getAllAsync(
  "PRAGMA table_info(products)"
);

console.log(columns);
      const result =
        await db.getAllAsync(

          `
          SELECT *

          FROM products

          WHERE productenglishname
          LIKE ?

          ORDER BY productenglishname ASC

          LIMIT 20
          `,

          [
            `${String(value)}%`,
          ]

        );

      console.log(
        "SEARCH RESULT:",
        result
      );

      setSuggestions(
        Array.isArray(result)
          ? result
          : []
      );

    } catch (error) {

      console.log(
        "❌ SEARCH ERROR:",
        error
      );

      setSuggestions([]);

    }
  };

  // =========================
  // LOAD PRODUCTS ON FOCUS
  // =========================

  const loadProducts =
    async () => {

    try {

      const db =
        await getDB();

      if (!db) {

        return;
      }

      const result =
        await db.getAllAsync(

          `
          SELECT *

          FROM products

          ORDER BY productenglishname ASC

          LIMIT 20
          `
        );

      console.log(
        "PRODUCTS:",
        result
      );

      setSuggestions(
        Array.isArray(result)
          ? result
          : []
      );

    } catch (error) {

      console.log(
        "❌ PRODUCT LOAD ERROR:",
        error
      );

      setSuggestions([]);

    }
  };

  // =========================
  // SAVE STOCK
  // =========================

 const handleSaveStock = async () => {
  try {
    const db = await getDB();

    if (!db) {
      Alert.alert("Error", "Database not ready");
      return;
    }

    // VALIDATION

    if (!productName) {
      Alert.alert("Error", "Select Product");
      return;
    }

    // GET PRODUCT

    const products = await db.getAllAsync(
      `
      SELECT *
      FROM products
      WHERE productenglishname = ?
      LIMIT 1
      `,
      [productName]
    );

    const existingProduct = products?.[0];

    if (!existingProduct) {
      Alert.alert("Error", "Product not found");
      return;
    }

    // CURRENT STOCK

    const oldStock =
      Number(existingProduct.stockquantity) || 0;

    const enteredQty =
      Number(stockQty) || 0;

    // UPDATED STOCK

    let updatedStock = oldStock;

    if (entryType === "Increase") {
      updatedStock += enteredQty;
    } else {
      updatedStock -= enteredQty;

      if (updatedStock < 0) {
        updatedStock = 0;
      }
    }

    const purchase = Number(purchaseRate) || 0;
    const retail = Number(retailPrice) || 0;
    const stockValue = updatedStock * purchase;

    // UPDATE PRODUCT TABLE

    await db.runAsync(
      `
      UPDATE products
      SET
        stockquantity = ?,
        stockvalue = ?,
        purchase = ?,
        retail = ?
      WHERE productenglishname = ?
      `,
      [
        updatedStock,
        stockValue,
        purchase,
        retail,
        productName,
      ]
    );

    console.log("✅ Product stock updated");

    Alert.alert(
      "Success",
      "Stock Updated Successfully"
    );

    router.push("/src/screens/StockScreen");

    // CLEAR FORM

    setProductName("");
    setBatchNo("");
    setBatch("");
    setPurchaseRate("");
    setWholesaleProfit("");
    setWholesalePrice("");
    setRetailProfit("");
    setRetailPrice("");
    setCurrentStock("");
    setStockQty("");
    setReferenceNo("");
    setTransactionNo("");
    setNarration("");
    setSuggestions([]);

  } catch (error) {
    console.log("❌ SAVE ERROR:", error);

    Alert.alert(
      "Error",
      "Something went wrong"
    );
  }
};
  return (

    <View style={styles.container}>

<StatusBar
  translucent
  backgroundColor="transparent"
  barStyle="light-content"
/>

<LinearGradient
  colors={[
    "#4F46E5",
    "#6366F1",
  ]}
  start={{
    x: 0,
    y: 0,
  }}
  end={{
    x: 1,
    y: 1,
  }}
  style={styles.header}
>

  <SafeAreaView>

    <View
      style={styles.headerRow}
    >

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() =>
          router.back()
        }
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={22}
          color="#fff"
        />
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          marginLeft: 12,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: "#fff",
          }}
        >
          Add Stock
        </Text>

        <Text
          style={{
            fontSize: 13,
            color:
              "rgba(255,255,255,0.85)",
            marginTop: 2,
          }}
        >
          Inventory Management
        </Text>
      </View>

      <MaterialCommunityIcons
        name="package-variant-closed"
        size={30}
        color="rgba(255,255,255,0.9)"
        onPress={()=> router.push("/src/screens/StockScreen")}
      />

    </View>

  </SafeAreaView>

</LinearGradient>

      <ScrollView
  style={{
    flex: 1,
  }}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingTop: 16,
    paddingBottom: 160,
    flexGrow: 1,
  }}
>

        {/* STOCK DETAILS */}
<View style={styles.modernCard}>

  {/* HEADER */}

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    }}
  >
    <View
      style={{
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="warehouse"
        size={24}
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
          fontSize: 18,
          fontWeight: "800",
          color: "#0F172A",
        }}
      >
        Stock Configuration
      </Text>

      <Text
        style={{
          fontSize: 12,
          color: "#64748B",
          marginTop: 2,
        }}
      >
        Inventory Source Settings
      </Text>
    </View>
  </View>

  {/* STOCK TYPE */}

  <Menu
    visible={stockTypeMenu}
    onDismiss={() =>
      setStockTypeMenu(false)
    }
    anchor={
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          setStockTypeMenu(true)
        }
      >
        <View style={styles.dropdownCard}>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: "#EEF2FF",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="package-variant"
                size={22}
                color="#4F46E5"
              />
            </View>

            <View
              style={{
                marginLeft: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#64748B",
                }}
              >
                Stock Type
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#0F172A",
                }}
              >
                {stockType ||
                  "Select Type"}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {stockType ? (
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color="#10B981"
              />
            ) : null}

            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#64748B"
              style={{
                marginLeft: 6,
              }}
            />
          </View>

        </View>
      </TouchableOpacity>
    }
  >
    <Menu.Item
      title="OPENING STOCK"
      onPress={() => {
        setStockType(
          "OPENING STOCK"
        );
        setStockTypeMenu(false);
      }}
    />

    <Menu.Item
      title="PURCHASE"
      onPress={() => {
        setStockType(
          "PURCHASE"
        );
        setStockTypeMenu(false);
      }}
    />
  </Menu>

  <View
    style={{
      height: 16,
    }}
  />

  {/* FROM STOCK */}

  <Menu
    visible={fromStockMenu}
    onDismiss={() =>
      setFromStockMenu(false)
    }
    anchor={
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          setFromStockMenu(true)
        }
      >
        <View style={styles.dropdownCard}>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: "#ECFDF5",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="warehouse"
                size={22}
                color="#10B981"
              />
            </View>

            <View
              style={{
                marginLeft: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#64748B",
                }}
              >
                From Stock
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#0F172A",
                }}
              >
                {fromStock ||
                  "Select Source"}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {fromStock ? (
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color="#10B981"
              />
            ) : null}

            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#64748B"
              style={{
                marginLeft: 6,
              }}
            />
          </View>

        </View>
      </TouchableOpacity>
    }
  >
    <Menu.Item
      title="MAIN STOCK"
      onPress={() => {
        setFromStock(
          "MAIN STOCK"
        );
        setFromStockMenu(false);
      }}
    />

    <Menu.Item
      title="SHOP STOCK"
      onPress={() => {
        setFromStock(
          "SHOP STOCK"
        );
        setFromStockMenu(false);
      }}
    />
  </Menu>

</View>

        {/* PRODUCT FORM */}

        <View style={styles.card}>

          <TouchableOpacity
  activeOpacity={0.9}
  onPress={() =>
    setShowDatePicker(true)
  }
>

  <View pointerEvents="none">

    <TextInput
      label="Stock Date"
      mode="outlined"
      value={date}
      editable={false}
      left={
        <TextInput.Icon
          icon="calendar-month"
          color="#4F46E5"
        />
      }
      right={
        <TextInput.Icon
          icon="chevron-down"
          color="#94A3B8"
        />
      }
      style={{
        backgroundColor: "#FFF",
        borderRadius: 18,
        marginBottom: 14,
      }}
      outlineColor="#E2E8F0"
      activeOutlineColor="#4F46E5"
      contentStyle={{
        fontSize: 15,
        fontWeight: "600",
      }}
    />

  </View>

</TouchableOpacity>


{
  showDatePicker && (

    <DateTimePicker
      value={new Date()}
      mode="date"
      display="default"
      onChange={onDateChange}
    />

  )
}

          {/* PRODUCT SEARCH */}

         <TextInput
  label="Search Product"
  value={productName}
  mode="outlined"
  onFocus={loadProducts}
  onChangeText={searchProducts}
  style={{
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 14,
  }}
  outlineColor="#E2E8F0"
  activeOutlineColor="#4F46E5"
  left={
    <TextInput.Icon
      icon="magnify"
      color="#4F46E5"
    />
  }
  right={
    <TextInput.Icon
      icon="package-variant-closed"
      color="#64748B"
    />
  }
  contentStyle={{
    fontSize: 15,
    fontWeight: "600",
  }}
/>

          {/* SUGGESTIONS */}

          {

            suggestions.length >
              0 && (

              <View
                style={
                  styles.suggestionBox
                }
              >

                {

                  suggestions.map(
                    (
                      product
                    ) => (

                      <TouchableOpacity

                        key={
                          product.id
                        }

                        style={
                          styles.suggestionItem
                        }

                        onPress={() => {

                          setProductName(

                            product.productenglishname ||
                            ""

                          );

                          setPurchaseRate(

                            String(
                              product.purchase ||
                              0
                            )

                          );

                          setRetailPrice(

                            String(
                              product.retail ||
                              0
                            )

                          );

                          setWholesalePrice(

                            String(
                              product.wholesale ||
                              0
                            )

                          );

                          setCurrentStock(

                            String(
                              product.stockquantity ||
                              0
                            )

                          );

                          setSuggestions(
                            []
                          );

                        }}
                      >

                        <Text
                          style={
                            styles.suggestionText
                          }
                        >

                          {

                            product.productenglishname

                          }

                        </Text>

                      </TouchableOpacity>

                    )
                  )

                }

              </View>

            )

          }

       

 <TextInput
    label="Batch No"
    mode="outlined"
    value={batchNo}
    onChangeText={setBatchNo}
    style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: "#FFF",
    }}
    outlineColor="#E2E8F0"
    activeOutlineColor="#4F46E5"
    left={
      <TextInput.Icon
        icon="barcode"
        color="#4F46E5"
      />
    }
    contentStyle={{
      fontSize: 15,
      fontWeight: "600",
    }}
  />

  <TextInput
    label="Batch Name"
    mode="outlined"
    value={batch}
    onChangeText={setBatch}
    style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: "#FFF",
    }}
    outlineColor="#E2E8F0"
    activeOutlineColor="#4F46E5"
    left={
      <TextInput.Icon
        icon="package-variant"
        color="#10B981"
      />
    }
    contentStyle={{
      fontSize: 15,
      fontWeight: "600",
    }}
  />

          <Text
            style={
              styles.section
            }
          >
            Purchase Details
          </Text>

          <View style={styles.row}>

  <TextInput
    label="Wholesale Price"
    mode="outlined"
    value={wholesalePrice}
    onChangeText={setWholesalePrice}
    keyboardType="numeric"
    style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: "#FFFFFF",
    }}
    outlineColor="#E2E8F0"
    activeOutlineColor="#10B981"
    left={
      <TextInput.Icon
        icon="currency-inr"
        color="#10B981"
      />
    }
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
    }}
  />

 

</View>

 <TextInput
    label="Wholesale Profit %"
    mode="outlined"
    value={wholesaleProfit}
    onChangeText={setWholesaleProfit}
    keyboardType="numeric"
    style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: "#FFFFFF",
    }}
    outlineColor="#E2E8F0"
    activeOutlineColor="#4F46E5"
    left={
      <TextInput.Icon
        icon="percent"
        color="#4F46E5"
      />
    }
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
    }}
  />

      <TextInput
    label="Purchase Price"
    mode="outlined"
    value={purchaseRate}
    onChangeText={setPurchaseRate}
    keyboardType="numeric"
    style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: "#FFFFFF",
    }}
    outlineColor="#E2E8F0"
    activeOutlineColor="#F97316"
    left={
      <TextInput.Icon
        icon="currency-inr"
        color="#F97316"
      />
    }
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
    }}
  />


  <TextInput
    label="Selling Price (SP)"
    mode="outlined"
    value={retailPrice}
    onChangeText={setRetailPrice}
    keyboardType="numeric"
    style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: "#FFFFFF",
    }}
    outlineColor="#E2E8F0"
    activeOutlineColor="#16A34A"
    left={
      <TextInput.Icon
        icon="cash"
        color="#16A34A"
      />
    }
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
    }}
  />

 <TextInput
    label="Retail Profit %"
    mode="outlined"
    value={retailProfit}
    onChangeText={setRetailProfit}
    keyboardType="numeric"
    style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: "#FFFFFF",
    }}
    outlineColor="#E2E8F0"
    activeOutlineColor="#10B981"
    left={
      <TextInput.Icon
        icon="percent"
        color="#10B981"
      />
    }
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
    }}
  />
         
       


  <TextInput
    label="Current Stock"
    mode="outlined"
    value={currentStock}
    onChangeText={setCurrentStock}
    keyboardType="numeric"
    style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: "#FFFFFF",
    }}
    outlineColor="#E2E8F0"
    activeOutlineColor="#2563EB"
    left={
      <TextInput.Icon
        icon="warehouse"
        color="#2563EB"
      />
    }
    contentStyle={{
      fontSize: 15,
      fontWeight: "700",
    }}
  />


          <Text
            style={
              styles.section
            }
          >
            Stock Entry
          </Text>

       <View
  style={{
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  }}
>

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    }}
  >
    <MaterialCommunityIcons
      name="swap-horizontal-bold"
      size={22}
      color="#4F46E5"
    />

    <Text
      style={{
        fontSize: 16,
        fontWeight: "800",
        color: "#0F172A",
        marginLeft: 8,
      }}
    >
      Stock Adjustment
    </Text>
  </View>


 {/* ENTRY TYPE */}

    <Menu
      visible={entryMenuVisible}
      onDismiss={() =>
        setEntryMenuVisible(false)
      }
      anchor={
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ flex: 1 }}
          onPress={() =>
            setEntryMenuVisible(true)
          }
        >
          <View
            style={{
              height: 58,
              backgroundColor: "#FFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              paddingHorizontal: 14,
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
                name={
                  entryType === "Increase"
                    ? "trending-up"
                    : "trending-down"
                }
                size={22}
                color={
                  entryType === "Increase"
                    ? "#16A34A"
                    : "#DC2626"
                }
              />

              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#0F172A",
                }}
              >
                {entryType ||
                  "Entry Type"}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-down"
              size={22}
              color="#64748B"
            />
          </View>
        </TouchableOpacity>
      }
    >
      <Menu.Item
        title="Increase"
        onPress={() => {
          setEntryType(
            "Increase"
          );
          setEntryMenuVisible(
            false
          );
        }}
      />

      <Menu.Item
        title="Decrease"
        onPress={() => {
          setEntryType(
            "Decrease"
          );
          setEntryMenuVisible(
            false
          );
        }}
      />
    </Menu>

  
  
  
    {/* STOCK QTY */}

    <TextInput
      label="Stock Qty"
      mode="outlined"
      value={stockQty}
      onChangeText={
        setStockQty
      }
      keyboardType="numeric"
      style={{
        flex: 1,
        backgroundColor:
          "#FFFFFF",
      }}
      outlineColor="#E2E8F0"
      activeOutlineColor="#4F46E5"
      left={
        <TextInput.Icon
          icon="counter"
          color="#4F46E5"
        />
      }
      contentStyle={{
        fontSize: 15,
        fontWeight: "700",
      }}
    />

</View>
         <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  }}
>
  <View
    style={{
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "#EEF2FF",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <MaterialCommunityIcons
      name="file-document-outline"
      size={22}
      color="#4F46E5"
    />
  </View>

  <View
    style={{
      marginLeft: 12,
    }}
  >
    <Text
      style={{
        fontSize: 18,
        fontWeight: "800",
        color: "#0F172A",
      }}
    >
      Additional Details
    </Text>

    <Text
      style={{
        fontSize: 12,
        color: "#64748B",
        marginTop: 2,
      }}
    >
      Reference & Transaction Information
    </Text>
  </View>
</View>

        

  <TextInput
    label="Reference No"
    mode="outlined"
    value={referenceNo}
    onChangeText={setReferenceNo}
    style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: "#FFFFFF",
    }}
    outlineColor="#E2E8F0"
    activeOutlineColor="#4F46E5"
    left={
      <TextInput.Icon
        icon="file-document-outline"
        color="#4F46E5"
      />
    }
    contentStyle={{
      fontSize: 15,
      fontWeight: "600",
    }}
  />

  




<TextInput
    label="Transaction No"
    mode="outlined"
    value={transactionNo}
    onChangeText={setTransactionNo}
    style={{
      flex: 1,
      marginRight: 8,
      backgroundColor: "#FFFFFF",
    }}
    outlineColor="#E2E8F0"
    activeOutlineColor="#10B981"
    left={
      <TextInput.Icon
        icon="receipt-text-outline"
        color="#10B981"
      />
    }
    contentStyle={{
      fontSize: 15,
      fontWeight: "600",
    }}
  />
          <TextInput
  label="Narration / Remarks"
  mode="outlined"
  value={narration}
  onChangeText={setNarration}
  multiline
  numberOfLines={4}
  style={{
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    minHeight: 120,
  }}
  outlineColor="#E2E8F0"
  activeOutlineColor="#4F46E5"
  left={
    <TextInput.Icon
      icon="note-text-outline"
      color="#4F46E5"
    />
  }
  contentStyle={{
    fontSize: 15,
    fontWeight: "500",
    paddingTop: 10,
  }}
  placeholder="Enter notes, stock remarks, supplier comments..."
/>
        </View>
  {/* SAVE BUTTON */}

     <View
  style={styles.bottomContainer}
>

  <TouchableOpacity
    activeOpacity={0.9}
    onPress={handleSaveStock}
    style={{
      height: 62,
      borderRadius: 20,
      backgroundColor: "#4F46E5",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      elevation: 8,
      shadowColor: "#4F46E5",
      shadowOpacity: 0.3,
      shadowRadius: 8,
      marginBottom:30,
    }}
  >

    <MaterialCommunityIcons
      name="content-save-check"
      size={26}
      color="#FFF"
    />

    <Text
      style={{
        color: "#FFF",
        fontSize: 17,
        fontWeight: "800",
        marginLeft: 10,
        letterSpacing: 0.5,
      }}
    >
      Save Stock
    </Text>

  </TouchableOpacity>

</View>
      </ScrollView>

    

    </View>
  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

 header: {
  paddingTop: 50, // Android status bar space
  paddingBottom: 20,
  paddingHorizontal: 20,
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
},

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 12,
    flex: 1,
  },

  modernCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 24,
  padding: 18,
  marginBottom: 16,
  elevation: 4,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
},

dropdownCard: {
  height: 70,
  backgroundColor: "#F8FAFC",
  borderWidth: 1,
  borderColor: "#E2E8F0",
  borderRadius: 18,
  paddingHorizontal: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    padding: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  section: {
    fontSize: 17,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 14,
    marginTop:20,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  halfInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },

  bottomContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
  },

  saveBtn: {
    height: 60,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#2563EB",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 10,
  },

  suggestionBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 6,
    elevation: 6,
    overflow: "hidden",
    maxHeight: 220,
  },

  suggestionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  suggestionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

});