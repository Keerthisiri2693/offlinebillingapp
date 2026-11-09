import React,
{
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import {
  useLocalSearchParams,
  router,
} from 'expo-router';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {getDB,
  getSalesReturns,
} from '../database/sqlite';

export default function ViewSalesReturnDetailsScreen() {

  const { id } =
    useLocalSearchParams();

  const [loading,
    setLoading] =
    useState(true);

  const [bill,
    setBill] =
    useState(null);

  // ================= LOAD =================

  
  useEffect(() => {

  loadData();

}, []);

const loadData = async () => {

  try {

    setLoading(true);

    const allBills =
      await getSalesReturns();

    const salesReturn =
      allBills.find(
        item =>
          String(item.id) ===
          String(id)
      );

    if (!salesReturn) {

      setLoading(false);

      return;
    }

    const db =
      await getDB();

    const invoice =
      await db.getFirstAsync(
        `
        SELECT *
        FROM newinvoice
        WHERE invoiceNo = ?
        `,
        [
          Number(
            salesReturn.invoiceNo
          )
        ]
      );

    let invoiceItems = [];

    if (invoice?.id) {

      invoiceItems =
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
    }

    console.log(
      "📦 SALES RETURN:",
      salesReturn
    );

    console.log(
      "📦 INVOICE:",
      invoice
    );

    console.log(
      "📦 ITEMS:",
      invoiceItems
    );

    setBill({
      ...salesReturn,
      items: invoiceItems,
    });

  } catch (e) {

    console.log(
      "❌ LOAD DATA:",
      e
    );

  } finally {

    setLoading(false);

  }

};

  // ================= LOADING =================

  if (loading) {

    return (

      <View
        style={{
          flex: 1,

          justifyContent:
            'center',

          alignItems:
            'center',
        }}>

        <ActivityIndicator
          size="large"
          color="#2c5364"
        />

      </View>

    );

  }

  // ================= EMPTY =================

  if (!bill) {

    return (

      <View
        style={{
          flex: 1,

          justifyContent:
            'center',

          alignItems:
            'center',
        }}>

        <Text>
          Sales Return Not Found
        </Text>

      </View>

    );

  }


  
  // ================= TOTAL ITEMS =================
const totalItems =
  Array.isArray(bill?.items)
    ? bill.items.length
    : 0;

  // ================= UI =================

  return (

    <View
      style={{
        flex: 1,

        backgroundColor:
          '#f4f6f8',
      }}>

      <StatusBar
        backgroundColor="#2c5364"
        barStyle="light-content"
      />

      {/* HEADER */}

<LinearGradient
  colors={["#4F46E5", "#6366F1"]}
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
    <TouchableOpacity onPress={() => router.back()}>
      <MaterialCommunityIcons
        name="arrow-left"
        size={24}
        color="#FFF"
      />
    </TouchableOpacity>

    <Text
      style={{
        color: "#FFF",
        fontSize: 22,
        fontWeight: "900",
      }}
    >
      Sales Return
    </Text>

    <TouchableOpacity>
      <MaterialCommunityIcons
        name="file-pdf-box"
        size={24}
        color="#FFF"
      />
    </TouchableOpacity>
  </View>

</LinearGradient>

      <ScrollView
        contentContainerStyle={{
          padding: 15,
          paddingBottom: 40,
        }}

        showsVerticalScrollIndicator={
          false
        }>

        {/* BILL CARD */}

       <View
  style={{
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  }}
>
  {/* HEADER */}

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <View>
      <View
        style={{
          backgroundColor: "#EEF2FF",
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius: 20,
          alignSelf: "flex-start",
        }}
      >
        <Text
          style={{
            color: "#4F46E5",
            fontSize: 12,
            fontWeight: "800",
          }}
        >
          INVOICE #{bill.invoiceNo}
        </Text>
      </View>

      <Text
        style={{
          marginTop: 8,
          color: "#6B7280",
          fontSize: 13,
        }}
      >
        {bill.date}
      </Text>
    </View>

    <LinearGradient
      colors={[
        "#10B981",
        "#059669",
      ]}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
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
          bill.total || 0
        ).toFixed(2)}
      </Text>
    </LinearGradient>
  </View>

  {/* CUSTOMER */}

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F8FAFC",
      borderRadius: 16,
      padding: 12,
      marginTop: 16,
    }}
  >
    <View
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="account"
        size={26}
        color="#4F46E5"
      />
    </View>

    <View
      style={{
        marginLeft: 12,
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {bill.customer ||
          "COMMON CASH"}
      </Text>

      <Text
        style={{
          marginTop: 2,
          color: "#6B7280",
          fontSize: 12,
        }}
      >
        Customer Account
      </Text>
    </View>
  </View>

  {/* DETAILS */}

     <View
      style={{
        flex: 1,
        backgroundColor: "#EEF2FF",
        borderRadius: 14,
        padding: 10,
        marginRight: 5,
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
          marginTop: 4,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {bill.ledger || "-"}
      </Text>
    </View>

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    }}
  >
 

    <View
      style={{
        flex: 1,
        backgroundColor: "#FEF3C7",
        borderRadius: 14,
        padding: 10,
        marginHorizontal: 5,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          color: "#D97706",
          fontWeight: "700",
        }}
      >
        SALES TYPE
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {bill.salesType || "-"}
      </Text>
    </View>

    <View
      style={{
        flex: 1,
        backgroundColor: "#DBEAFE",
        borderRadius: 14,
        padding: 10,
        marginLeft: 5,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          color: "#2563EB",
          fontWeight: "700",
        }}
      >
        PAID TYPE
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {bill.paidType || "-"}
      </Text>
    </View>
  </View>
</View>

        {/* PRODUCTS */}

        <Text
          style={{
            fontSize: 18,

            fontWeight:
              '800',

            marginBottom: 12,

            color:
              '#1c313a',
          }}>

          Products (
          {totalItems}
          )

        </Text>

      {Array.isArray(bill.items) &&
  bill.items.map((item, index) => {

    const amount =
      (Number(item.qty) || 0) *
      (Number(item.rate) || 0);

    return (

      <View
        key={index}
        style={{
          backgroundColor: "#FFF",
          borderRadius: 22,
          padding: 16,
          marginBottom: 14,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
        }}
      >

        {/* PRODUCT HEADER */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <View style={{ flex: 1 }}>

            <Text
              style={{
                fontSize: 17,
                fontWeight: "900",
                color: "#111827",
              }}
            >
              {item.product || "-"}
            </Text>

            <Text
              style={{
                marginTop: 3,
                color: "#6B7280",
                fontSize: 12,
              }}
            >
              Product Code: {item.productcode || "-"}
            </Text>

          </View>

          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 14,
            }}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: 15,
                fontWeight: "900",
              }}
            >
              ₹{amount.toFixed(2)}
            </Text>
          </LinearGradient>

        </View>

        {/* QUICK INFO */}

        <View
          style={{
            flexDirection: "row",
            marginTop: 14,
          }}
        >

          <View
            style={{
              flex: 1,
              backgroundColor: "#EEF2FF",
              borderRadius: 12,
              padding: 10,
              marginRight: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: "#4F46E5",
                fontWeight: "700",
              }}
            >
              QTY
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontWeight: "800",
                fontSize: 15,
              }}
            >
              {item.qty || 0}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#DCFCE7",
              borderRadius: 12,
              padding: 10,
              marginHorizontal: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: "#16A34A",
                fontWeight: "700",
              }}
            >
              RATE
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontWeight: "800",
                fontSize: 15,
              }}
            >
              ₹{item.rate || 0}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#FEF3C7",
              borderRadius: 12,
              padding: 10,
              marginLeft: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: "#D97706",
                fontWeight: "700",
              }}
            >
              STOCK
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontWeight: "800",
                fontSize: 15,
              }}
            >
              {item.stock || 0}
            </Text>
          </View>

        </View>

        {/* DETAILS GRID */}

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 14,
          }}
        >

          {[
            { label: "UOM", value: item.uom },
            { label: "Weight", value: item.weight },
            { label: "Net Rate", value: item.netRate },
            { label: "MC %", value: item.mc },
            { label: "MC Total", value: item.mcTotal },
            { label: "SGST", value: item.sgst },
            { label: "CGST", value: item.cgst },
            { label: "IGST", value: item.igst },
            { label: "Total Weight", value: item.totalWeight },
          ].map((field, idx) => (

            <View
              key={idx}
              style={{
                width: "48%",
                backgroundColor: "#F8FAFC",
                padding: 12,
                borderRadius: 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#E5E7EB",

                marginRight:
                  idx % 2 === 0
                    ? "4%"
                    : 0,
              }}
            >

              <Text
                style={{
                  fontSize: 10,
                  color: "#6B7280",
                  fontWeight: "700",
                }}
              >
                {field.label}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontWeight: "800",
                  fontSize: 15,
                  color: "#111827",
                }}
              >
                {field.value || 0}
              </Text>

            </View>

          ))}

        </View>

      </View>

    ); 

        })}




        {/* SUMMARY */}

    <View
  style={{
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    marginTop: 10,
    elevation: 4,
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
    <MaterialCommunityIcons
      name="calculator-variant"
      size={22}
      color="#4F46E5"
    />

    <Text
      style={{
        marginLeft: 8,
        fontSize: 18,
        fontWeight: "900",
        color: "#111827",
      }}
    >
      Summary
    </Text>
  </View>

  {/* SUMMARY CARDS */}

  <View
    style={{
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    }}
  >
    {[
      {
        label: "Actual",
        value: bill.actualAmount,
        bg: "#EEF2FF",
        color: "#4F46E5",
      },

      {
        label: "Discount",
        value: bill.cashDiscount,
        bg: "#FEE2E2",
        color: "#DC2626",
      },

      {
        label: "Disc %",
        value: bill.discountPercent,
        bg: "#FEF3C7",
        color: "#D97706",
      },

      {
        label: "Gross",
        value: bill.grossAmount,
        bg: "#DCFCE7",
        color: "#16A34A",
      },

      {
        label: "Net",
        value: bill.netAmount,
        bg: "#DBEAFE",
        color: "#2563EB",
      },

      {
        label: "Prev Bal",
        value: bill.previousBalance,
        bg: "#F3F4F6",
        color: "#6B7280",
      },
    ].map((item, index) => (

      <View
        key={index}
        style={{
          width: "48%",
          backgroundColor: item.bg,
          borderRadius: 14,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontWeight: "700",
            color: item.color,
          }}
        >
          {item.label}
        </Text>

        <Text
          style={{
            marginTop: 5,
            fontSize: 16,
            fontWeight: "900",
            color: "#111827",
          }}
        >
          ₹{Number(item.value || 0).toFixed(2)}
        </Text>
      </View>

    ))}
  </View>

  {/* GRAND TOTAL */}

  <LinearGradient
    colors={["#4F46E5", "#6366F1"]}
    style={{
      marginTop: 10,
      borderRadius: 18,
      padding: 18,
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
        marginTop: 4,
        color: "#FFF",
        fontSize: 30,
        fontWeight: "900",
      }}
    >
      ₹{Number(bill.total || 0).toFixed(2)}
    </Text>
  </LinearGradient>
</View>

      </ScrollView>

    </View>

  );

}