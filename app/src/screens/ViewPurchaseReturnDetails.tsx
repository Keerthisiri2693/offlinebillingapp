import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import styles from '../style/ViewPurchaseReturnDetailsStyle';

import {getDB,
  getPurchaseReturnById,
  deletePurchaseReturn,
} from '../database/sqlite';

export default function ViewPurchaseReturn() {

  const router = useRouter();

  // ✅ FIXED: single object
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

useEffect(() => {

  if (id) {

    loadData();

  }

}, [id]);

// 🔥 LOAD SINGLE DATA


const [items, setItems] = useState([]);

const loadData = async () => {

  try {

    setLoading(true);

    const res =
      await getPurchaseReturnById(id);

    setData(res || null);

    const db = await getDB();

    const productItems =
      await db.getAllAsync(
        `
        SELECT *
        FROM purchase_return_items
        WHERE purchaseReturnId = ?
        `,
        [id]
      );

    setItems(productItems || []);

  } catch (e) {

    console.log(e);

  } finally {

    setLoading(false);

  }

};



  // 🔄 REFRESH
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(res => setTimeout(res, 400));
      loadData();
    } catch (e) {
      console.log(e);
    }
    setRefreshing(false);
  }, [id]);

  // 🗑 DELETE
  const handleDelete = () => {
    Alert.alert(
      "Delete",
      "Are you sure?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: () => {
            deletePurchaseReturn(id);
            router.back();
          }
        }
      ]
    );
  };

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
    paddingBottom: 24,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  }}
>

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >

    {/* BACK */}

    <TouchableOpacity
      onPress={() =>
        router.back()
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
        Purchase Return
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
        Return Invoice Details
      </Text>
    </View>

    {/* DELETE */}

    

  </View>

  

</LinearGradient>

      {/* BODY */}
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* LOADING */}
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#2c5364" />
            <Text style={styles.emptyText}>
              Loading purchase return...
            </Text>
          </View>
        ) : !data ? (

          /* EMPTY */
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No data found
            </Text>
          </View>

        ) : (

          /* ✅ DATA UI */
         <View
  style={{
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    elevation: 4,
  }}
>

  {/* INVOICE HEADER */}

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >

    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "900",
          color: "#111827",
        }}
      >
        Invoice #{data.invoiceNo}
      </Text>

      <Text
        style={{
          marginTop: 4,
          color: "#6B7280",
        }}
      >
        {data.createdAt
          ? new Date(
              data.createdAt
            ).toLocaleDateString(
              "en-GB"
            )
          : "-"}
      </Text>
    </View>

    <LinearGradient
      colors={[
        "#4F46E5",
        "#6366F1",
      ]}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
      }}
    >
      <Text
        style={{
          color: "#FFF",
          fontWeight: "900",
          fontSize: 16,
        }}
      >
        ₹
        {Number(
          data.total || 0
        ).toFixed(2)}
      </Text>
    </LinearGradient>

  </View>

  {/* CUSTOMER */}

  <View
    style={{
      marginTop: 20,
      backgroundColor: "#F8FAFC",
      borderRadius: 18,
      padding: 14,
    }}
  >

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="account-circle"
        size={22}
        color="#4F46E5"
      />

      <Text
        style={{
          marginLeft: 8,
          fontSize: 16,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {data.customer ||
          "COMMON CASH"}
      </Text>
    </View>

  </View>

  {/* INFO GRID */}

  <View
    style={{
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
      marginTop: 16,
    }}
  >

    {[
      {
        title: "LEDGER",
        value: data.ledger,
        icon:
          "account-cash",
        bg: "#EEF2FF",
        color: "#4F46E5",
      },
      {
        title: "PAID TYPE",
        value:
          data.paidType,
        icon:
          "cash-multiple",
        bg: "#DCFCE7",
        color: "#16A34A",
      },
      {
        title: "STATE",
        value: data.state,
        icon:
          "map-marker",
        bg: "#FEF3C7",
        color: "#D97706",
      },
      {
        title: "CITY",
        value: data.city,
        icon: "city",
        bg: "#FEE2E2",
        color: "#DC2626",
      },
    ].map(
      (
        card,
        index
      ) => (

      <View
        key={index}
        style={{
          width: "48%",
          backgroundColor:
            card.bg,
          borderRadius: 16,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <MaterialCommunityIcons
          name={card.icon}
          size={18}
          color={card.color}
        />

        <Text
          style={{
            marginTop: 4,
            fontSize: 10,
            fontWeight: "700",
            color:
              card.color,
          }}
        >
          {card.title}
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 15,
            fontWeight: "800",
            color:
              "#111827",
          }}
        >
          {card.value || "-"}
        </Text>

      </View>

    ))}

  </View>


<View
  style={{
    marginTop: 18,
  }}
>
  <Text
    style={{
      fontSize: 18,
      fontWeight: "900",
      color: "#111827",
      marginBottom: 12,
    }}
  >
    Product Details
  </Text>

  {items?.map((item, index) => (

    <View
      key={index}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        elevation: 2,
      }}
    >

      {/* PRODUCT */}

      <Text
        style={{
          fontSize: 16,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {item.product || "-"}
      </Text>

      <Text
        style={{
          color: "#6B7280",
          marginTop: 3,
        }}
      >
        Code: {item.productcode || "-"}
      </Text>

      {/* DETAILS */}

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent:
            "space-between",
          marginTop: 12,
        }}
      >

        <View
          style={{
            width: "48%",
            backgroundColor: "#EEF2FF",
            borderRadius: 12,
            padding: 10,
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: "#4F46E5",
            }}
          >
            QTY
          </Text>

          <Text
            style={{
              fontWeight: "800",
            }}
          >
            {item.qty || 0}
          </Text>
        </View>

        <View
          style={{
            width: "48%",
            backgroundColor: "#DCFCE7",
            borderRadius: 12,
            padding: 10,
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: "#16A34A",
            }}
          >
            RATE
          </Text>

          <Text
            style={{
              fontWeight: "800",
            }}
          >
            ₹{item.rate || 0}
          </Text>
        </View>

        <View
          style={{
            width: "48%",
            backgroundColor: "#FEF3C7",
            borderRadius: 12,
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: "#D97706",
            }}
          >
            UOM
          </Text>

          <Text
            style={{
              fontWeight: "800",
            }}
          >
            {item.uom || "-"}
          </Text>
        </View>

        <View
          style={{
            width: "48%",
            backgroundColor: "#FEE2E2",
            borderRadius: 12,
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: "#DC2626",
            }}
          >
            AMOUNT
          </Text>

          <Text
            style={{
              fontWeight: "800",
            }}
          >
            ₹
            {(
              Number(item.qty || 0) *
              Number(item.rate || 0)
            ).toFixed(2)}
          </Text>
        </View>

      </View>

    </View>

  ))}

</View>



  {/* TOTAL SECTION */}

  <LinearGradient
    colors={[
      "#10B981",
      "#059669",
    ]}
    style={{
      marginTop: 10,
      borderRadius: 20,
      padding: 18,
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color:
          "rgba(255,255,255,0.8)",
        fontSize: 11,
        fontWeight: "700",
      }}
    >
      GRAND TOTAL
    </Text>

    <Text
      style={{
        marginTop: 4,
        color: "#FFF",
        fontSize: 30,
        fontWeight: "900",
      }}
    >
      ₹
      {Number(
        data.total || 0
      ).toFixed(2)}
    </Text>
  </LinearGradient>
</View>

        )}

      </ScrollView>
    </View>
  );
}