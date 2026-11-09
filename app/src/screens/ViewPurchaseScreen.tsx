import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import * as Print
from 'expo-print';

import * as Sharing
from 'expo-sharing';

import { useRouter } from 'expo-router';

import { getPurchases, deletePurchase,getLedgers } from '../database/sqlite';


import styles from "../style/ViewPurchaseScreenStyle";

export default function ViewPurchase() {

  const router = useRouter();

  const [purchases, setPurchases] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // =====================
  // 🔥 LOAD DATA
  // =====================
const loadData =
  async () => {

  try {

    const data =
      await getPurchases();

    console.log(
      "📦 purchase data:",
      data
    );

    setPurchases(

      Array.isArray(data)
        ? data
        : []

    );

  } catch (error) {

    console.log(
      '❌ loadData error:',
      error
    );
  }
};

  useEffect(() => {
    loadData();
  }, []);

  // =====================
  // 🔄 REFRESH
  // =====================
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      loadData();
      setRefreshing(false);
    }, 400);
  }, []);

  // =====================
  // 🔗 NAVIGATION
  // =====================
  const openPurchase = (id) => {
    if (!id) return;

    router.push({
      pathname: "/src/screens/ViewPurchaseScreenDetails",
      params: { id: String(id) },
    });
  };

  // =====================
  // 🗑 DELETE FUNCTION
  // =====================
const handleDelete = (id) => {

  if (!id) return;

  Alert.alert(
    "Delete Purchase",
    "Are you sure you want to delete this purchase?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {

          try {

            const success =
              await deletePurchase(id);

            if (success) {

              await loadData();

            }

          } catch (e) {

            console.log(
              "❌ delete error:",
              e
            );

          }

        }
      }
    ]
  );

};
  // =====================
  // 📦 ITEM RENDER
  // =====================


const renderItem = ({ item }) => (

  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => openPurchase(item?.id)}
    style={{
      backgroundColor: '#FFF',
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#EEF2FF',
      elevation: 3,
    }}
  >

    {/* TOP */}

    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >

      <View>

        <Text
          style={{
            fontSize: 17,
            fontWeight: '800',
            color: '#111827',
          }}
        >
          #{item?.id}
        </Text>

        <Text
          style={{
            color: '#6B7280',
            marginTop: 2,
            fontSize: 12,
          }}
        >
          {item?.createdAt
            ? new Date(item.createdAt).toLocaleDateString('en-GB')
            : '-'}
        </Text>

      </View>

      <View
        style={{
          backgroundColor: '#DCFCE7',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
        }}
      >
        <Text
          style={{
            color: '#15803D',
            fontWeight: '700',
          }}
        >
          ₹ {Number(item?.total || 0).toFixed(2)}
        </Text>
      </View>

    </View>

    {/* SUPPLIER */}

    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
      }}
    >

      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: '#EEF2FF',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MaterialCommunityIcons
          name="truck-delivery"
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
            fontSize: 15,
            fontWeight: '700',
            color: '#111827',
          }}
        >
          {item?.supplier || 'Unknown Supplier'}
        </Text>


        <Text
          style={{
            color: '#6B7280',
            marginTop: 2,
          }}
        >
          {item?.purchaseMobileNo || 'No Contact'}
        </Text>

        

      </View>

    </View>

    {/* FOOTER */}

    <View
      style={{
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >

      <View
        style={{
          backgroundColor: '#EEF2FF',
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius: 15,
        }}
      >
        <Text
          style={{
            color: '#4F46E5',
            fontSize: 12,
            fontWeight: '700',
          }}
        >
          {item?.paidType || 'CASH'}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname:
                '/src/screens/ViewPurchaseScreenDetails',
              params: {
                id: String(item?.id),
              },
            })
          }
          style={{
            marginRight: 16,
          }}
        >
          <MaterialCommunityIcons
            name="eye-outline"
            size={22}
            color="#2563EB"
          />
        </TouchableOpacity>

        <TouchableOpacity
  onPress={() =>
    router.push({
      pathname: "/src/screens/Purchase",
      params: {
        id: String(item?.id),
        mode: "edit",
      },
    })
  }
  style={{
    marginRight: 16,
  }}
>
  <MaterialCommunityIcons
    name="pencil-outline"
    size={22}
    color="#2563EB"
  />
</TouchableOpacity>


        <TouchableOpacity
          onPress={() =>
            handleDelete(item?.id)
          }
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={22}
            color="#EF4444"
          />
        </TouchableOpacity>

      </View>

    </View>

  </TouchableOpacity>
);
  // =====================
  // EMPTY
  // =====================
  const renderEmpty = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <MaterialCommunityIcons
        name="file-document-outline"
        size={60}
        color="#ccc"
      />
      <Text style={{ marginTop: 10, color: '#999' }}>
        No purchases found
      </Text>
    </View>
  );

  const generatePurchaseReport =
  async () => {

  try {

    // =========================
    // TOTAL PURCHASES
    // =========================

    const totalPurchases =

      Array.isArray(
        purchases
      )

        ? purchases.length

        : 0;

    // =========================
    // TOTAL AMOUNT
    // =========================

    const totalAmount =

      Array.isArray(
        purchases
      )

        ? purchases.reduce(

            (
              total,
              item
            ) =>

              total +

              Number(
                item.total || 0
              ),

            0
          )

        : 0;

    // =========================
    // HTML
    // =========================

    const html = `

<html>

<head>

<style>

body {

  font-family: Arial;

  padding: 20px;

  color: #222;

}

.header {

  text-align: center;

  margin-bottom: 20px;

}

h1 {

  color: #203a43;

}

.summary {

  margin-top: 20px;

  margin-bottom: 20px;

  padding: 14px;

  background: #f1f5f9;

  border-radius: 8px;

}

table {

  width: 100%;

  border-collapse: collapse;

}

th {

  background: #203a43;

  color: white;

  padding: 12px;

  border: 1px solid #ddd;

}

td {

  padding: 10px;

  border: 1px solid #ddd;

  text-align: center;

}

tr:nth-child(even) {

  background: #f8fafc;

}

.total {

  font-weight: bold;

  background: #dbeafe;

}

</style>

</head>

<body>

<div class="header">

<h1>
Purchase Report
</h1>

<p>
Generated:
${new Date().toLocaleString()}
</p>

</div>

<div class="summary">

<p>

<b>Total Purchases:</b>

${totalPurchases}

</p>

<p>

<b>Total Amount:</b>

₹${Number(
  totalAmount || 0
).toFixed(2)}

</p>

</div>

<table>

<tr>

<th>
S.No
</th>

<th>
Purchase No
</th>

<th>
Supplier
</th>

<th>
Date
</th>

<th>
Paid Type
</th>

<th>
Total
</th>

</tr>

${

  Array.isArray(
    purchases
  )

    ? purchases.map(

        (
          item,
          index
        ) => `

<tr>

<td>
${index + 1}
</td>

<td>
${item.id || ''}
</td>

<td>
${item.supplier || ''}
</td>

<td>
${item.date || ''}
</td>

<td>
${item.paidType || ''}
</td>

<td>

₹${Number(
  item.total || 0
).toFixed(2)}

</td>

</tr>

`
      ).join('')

    : ''

}

<tr class="total">

<td colspan="5">

Grand Total

</td>

<td>

₹${Number(
  totalAmount || 0
).toFixed(2)}

</td>

</tr>

</table>

</body>

</html>

`;

    // =========================
    // CREATE PDF
    // =========================

    const {
      uri
    } =

      await Print.printToFileAsync({

        html,

      });

    // =========================
    // SHARE PDF
    // =========================

    await Sharing.shareAsync(
      uri
    );

  } catch (e) {

    console.log(
      '❌ generatePDF:',
      e
    );

    Alert.alert(

      'Error',

      'PDF generation failed'

    );

  }

};

  return (
  <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>

    <StatusBar
      backgroundColor="#4F46E5"
      barStyle="light-content"
    />

    {/* HEADER */}
    
<LinearGradient
  colors={["#4F46E5", "#6366F1"]}
  style={{
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  }}
>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    {/* Back Button */}
    <TouchableOpacity
      onPress={() => router.back()}
      style={{
        width: 40,
        alignItems: "flex-start",
      }}
    >
      <MaterialCommunityIcons
        name="arrow-left"
        size={22}
        color="#FFF"
      />
    </TouchableOpacity>
    <View>
 {/* Title */}
    <Text
      style={{
        color: "#FFF",
        fontSize: 20,
        fontWeight: "800",
      }}
    >
      Purchases
    </Text>
    </View>

   

    {/* PDF Button */}
    <TouchableOpacity
      onPress={generatePurchaseReport}
      style={{
        width: 40,
        alignItems: "flex-end",
      }}
    >
      <MaterialCommunityIcons
        name="file-pdf-box"
        size={22}
        color="#FFF"
      />
    </TouchableOpacity>
  </View>

  {/* Purchase Count Badge */}
  <View
    style={{
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginTop: 12,
    }}
  >
    <MaterialCommunityIcons
      name="cart-outline"
      size={14}
      color="#FFF"
    />

   <View>


     <Text
      style={{
        color: "#FFF",
        fontSize: 12,
        fontWeight: "700",
        marginLeft: 5,
      }}
    >
      {purchases.length} Purchases
    </Text>
   </View>
  </View>
</LinearGradient>

    {/* LIST */}
    <FlatList
      contentContainerStyle={{
        padding: 15,
        paddingBottom: 30,
      }}
      data={purchases}
      keyExtractor={(item, index) =>
        item?.id
          ? String(item.id)
          : String(index)
      }
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />

  </View>
);
}