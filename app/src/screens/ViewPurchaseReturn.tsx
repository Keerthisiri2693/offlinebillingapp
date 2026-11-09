import React,
{
  useEffect,
  useState,
  useCallback,
} from 'react';



import * as Print from "expo-print";
import * as Sharing from "expo-sharing";


import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  useRouter,
} from 'expo-router';



import styles
from '../style/ViewPurchaseReturnStyle';

import {getDB,
  getPurchaseReturns,
  deletePurchaseReturn,
} from '../database/sqlite';

export default function ViewPurchaseReturn() {

  const router =
    useRouter();

  const [data,
    setData] =
    useState([]);

  const [filteredData,
    setFilteredData] =
    useState([]);

  const [refreshing,
    setRefreshing] =
    useState(false);

  const [search,
    setSearch] =
    useState('');

  const [purchaseReturns, setPurchaseReturns] = useState([]);

  // ================= LOAD =================

  useEffect(() => {

    loadData();

  }, []);

  useEffect(() => {
  loadPurchaseReturns();
}, []);

  const loadPurchaseReturns = async () => {
  try {

    const db = await getDB();

    const result =
      await db.getAllAsync(`
        SELECT * FROM purchase_returns
        ORDER BY id DESC
      `);

    setPurchaseReturns(result);

  } catch (error) {

    console.log(
      "❌ loadPurchaseReturns:",
      error
    );

  }
};

  const loadData =
    async () => {

    try {

      const res =
        await getPurchaseReturns();

      console.log(
        '📦 Purchase Return List:',
        res
      );

      const finalData =

        Array.isArray(res)
          ? res
          : [];

      setData(finalData);

      setFilteredData(
        finalData
      );

    } catch (e) {

      console.log(
        '❌ load error:',
        e
      );

    }

  };

  // ================= SEARCH =================

  const handleSearch =
    text => {

    setSearch(text);

    if (!text.trim()) {

      setFilteredData(data);

      return;

    }

    const filtered =

      data.filter(item =>

        item?.invoiceNo
          ?.toString()
          ?.toLowerCase()
          ?.includes(
            text.toLowerCase()
          )

        ||

        item?.customer
          ?.toLowerCase()
          ?.includes(
            text.toLowerCase()
          )

        ||

        item?.ledger
          ?.toLowerCase()
          ?.includes(
            text.toLowerCase()
          )

      );

    setFilteredData(filtered);

  };

  // ================= REFRESH =================

  const onRefresh =
    useCallback(async () => {

      try {

        setRefreshing(true);

        await loadData();

      } catch (e) {

        console.log(
          '❌ refresh error:',
          e
        );

      } finally {

        setRefreshing(false);

      }

    }, []);

  // ================= DELETE =================

const handleDelete = async () => {

  Alert.alert(
    "Delete",
    "Are you sure you want to delete this purchase return?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },

      {
        text: "Delete",
        style: "destructive",

        onPress: async () => {

          const deleted =
            await deletePurchaseReturn(
              id
            );

          if (deleted) {

            Alert.alert(
              "Success",
              "Purchase Return Deleted"
            );

            router.back();

          }

        },
      },
    ]
  );

};
  // ================= CARD =================

  const renderItem =
    ({ item }) => (

    <TouchableOpacity

      activeOpacity={0.9}

      style={{
        backgroundColor:
          '#fff',

        borderRadius: 22,

        padding: 16,

        marginBottom: 15,

        elevation: 3,

        shadowColor: '#000',

        shadowOpacity: 0.08,

        shadowRadius: 6,

        shadowOffset: {
          width: 0,
          height: 2,
        },
      }}

      onPress={() =>

        router.push({

          pathname:
            "/src/screens/ViewPurchaseReturnDetails",

          params: {
            id: item.id
          }

        })

      }>

      {/* TOP */}

      <View
        style={{
          flexDirection: 'row',

          justifyContent:
            'space-between',

          alignItems:
            'center',
        }}>

        <View>

          <Text
            style={{
              fontSize: 17,

              fontWeight:
                '800',

              color:
                '#1c313a',
            }}>

            Invoice #
            {
              item.invoiceNo ||
              '-'
            }

          </Text>

          <Text
            style={{
              marginTop: 4,

              color:
                '#888',

              fontSize: 12,
            }}>

            {
              item.date ||

              (
                item.createdAt
                  ? new Date(
                      item.createdAt
                    ).toLocaleDateString(
                      'en-GB'
                    )
                  : '-'
              )

            }

          </Text>

        </View>

        <LinearGradient

          colors={[
            '#43cea2',
            '#185a9d'
          ]}

          style={{
            paddingHorizontal: 14,

            paddingVertical: 8,

            borderRadius: 14,
          }}>

          <Text
            style={{
              color: '#fff',

              fontWeight:
                '700',
            }}>

            ₹
            {
              Number(
                item.total || 0
              ).toFixed(2)
            }

          </Text>

        </LinearGradient>

      </View>

      {/* CUSTOMER */}

      <View
        style={{
          flexDirection: 'row',

          alignItems: 'center',

          marginTop: 16,
        }}>

        <MaterialCommunityIcons
          name="account-circle"
          size={20}
          color="#2c5364"
        />

        <Text
          style={{
            marginLeft: 8,

            fontSize: 15,

            fontWeight:
              '700',

            color:
              '#333',
          }}>

          {
            item.customer ||
            'COMMON CASH'
          }

        </Text>

      </View>

      {/* DETAILS */}

      <View
        style={{
          flexDirection: 'row',

          justifyContent:
            'space-between',

          marginTop: 16,
        }}>

        <View>

          <Text
            style={{
              color:
                '#999',

              fontSize: 11,
            }}>

            Ledger

          </Text>

          <Text
            style={{
              fontWeight:
                '700',

              color:
                '#444',
            }}>

            {
              item.ledger || '-'
            }

          </Text>

        </View>

        <View>

          <Text
            style={{
              color:
                '#999',

              fontSize: 11,
            }}>

            Paid Type

          </Text>

          <Text
            style={{
              fontWeight:
                '700',

              color:
                '#ef6c00',
            }}>

            {
              item.paidType ||
              '-'
            }

          </Text>

        </View>

        <View>

          <Text
            style={{
              color:
                '#999',

              fontSize: 11,
            }}>

            City

          </Text>

          <Text
            style={{
              fontWeight:
                '700',
            }}>

            {
              item.city || '-'
            }

          </Text>

        </View>

      </View>

      {/* SUMMARY */}

      <View
        style={{
          marginTop: 18,

          backgroundColor:
            '#f7f9fb',

          borderRadius: 14,

          padding: 12,
        }}>

        <View
          style={{
            flexDirection: 'row',

            justifyContent:
              'space-between',
          }}>

          <Text>
            Subtotal
          </Text>

          <Text
            style={{
              fontWeight:
                '700',
            }}>

            ₹
            {
              Number(
                item.subtotal || 0
              ).toFixed(2)
            }

          </Text>

        </View>

        <View
          style={{
            flexDirection: 'row',

            justifyContent:
              'space-between',

            marginTop: 6,
          }}>

          <Text>
            Discount
          </Text>

          <Text
            style={{
              fontWeight:
                '700',

              color:
                'red',
            }}>

            ₹
            {
              Number(
                item.discountAmount || 0
              ).toFixed(2)
            }

          </Text>

        </View>

      </View>

      {/* ACTIONS */}

      <View
        style={{
          flexDirection: 'row',

          justifyContent:
            'flex-end',

          marginTop: 16,
        }}>

        <TouchableOpacity

          style={{
            marginRight: 20,
          }}

          onPress={() =>

            router.push({

              pathname:
                "/src/screens/ViewPurchaseReturnDetails",

              params: {
                id: item.id
              }

            })

          }>

          <MaterialCommunityIcons
            name="eye-outline"
            size={24}
            color="#2c5364"
          />

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            handleDelete(
              item.id
            )
          }>

          <MaterialCommunityIcons
            name="delete-outline"
            size={24}
            color="red"
          />

        </TouchableOpacity>

      </View>

    </TouchableOpacity>

  );

 const generatePurchaseReturnPdf =
  async () => {

    try {

      const html = `
        <html>

          <body
            style="
              padding:20px;
              font-family:Arial;
            "
          >

            <h1
              style="
                text-align:center;
                color:#e53935;
              "
            >
              Purchase Return Report
            </h1>

            <table
              border="1"
              cellspacing="0"
              cellpadding="8"
              width="100%"
              style="
                border-collapse:collapse;
                margin-top:20px;
              "
            >

              <tr
                style="
                  background:#f2f2f2;
                "
              >
                <th>S.No</th>
                <th>Invoice</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>

              ${purchaseReturns
                .map(
                  (item, index) => `
                    <tr>
                      <td>${index + 1}</td>

                      <td>
                        ${item.invoiceNo || ""}
                      </td>

                      <td>
                        ${item.customer || ""}
                      </td>

                      <td>
                        ${item.date || ""}
                      </td>

                      <td>
                        ₹ ${item.total || 0}
                      </td>
                    </tr>
                  `
                )
                .join("")}

            </table>

            <h2
              style="
                margin-top:20px;
                text-align:right;
              "
            >
              Total :
              ₹ ${purchaseReturns.reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.total || 0
                  ),
                0
              )}
            </h2>

          </body>

        </html>
      `;

      const { uri } =
        await Print.printToFileAsync({
          html,
        });

      await Sharing.shareAsync(uri);

      console.log(
        "✅ PDF Generated:",
        uri
      );

    } catch (error) {

      console.log(
        "❌ generatePurchaseReturnPdf:",
        error
      );

    }
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

  {/* TOP BAR */}

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
      Purchase Returns
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
      Manage purchase return invoices
    </Text>
  </View>

  {/* PDF */}

  <TouchableOpacity
    onPress={
      generatePurchaseReturnPdf
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
      name="file-pdf-box"
      size={22}
      color="#FFF"
    />
  </TouchableOpacity>

</View>
  {/* STATS */}

  <View
    style={{
      flexDirection: "row",
      marginTop: 18,
    }}
  >

    <View
      style={{
        flex: 1,
        backgroundColor:
          "rgba(255,255,255,0.15)",
        borderRadius: 16,
        padding: 12,
        marginRight: 8,
      }}
    >
      <Text
        style={{
          color: "#E0E7FF",
          fontSize: 11,
        }}
      >
        TOTAL RETURNS
      </Text>

      <Text
        style={{
          color: "#FFF",
          fontSize: 22,
          fontWeight: "900",
        }}
      >
        {filteredData.length}
      </Text>
    </View>

    <View
      style={{
        flex: 1,
        backgroundColor:
          "rgba(255,255,255,0.15)",
        borderRadius: 16,
        padding: 12,
      }}
    >
      <Text
        style={{
          color: "#E0E7FF",
          fontSize: 11,
        }}
      >
        TOTAL VALUE
      </Text>

      <Text
        style={{
          color: "#FFF",
          fontSize: 20,
          fontWeight: "900",
        }}
      >
        ₹
        {filteredData
          .reduce(
            (sum, item) =>
              sum +
              Number(
                item.total || 0
              ),
            0
          )
          .toFixed(0)}
      </Text>
    </View>

  </View>



        {/* SEARCH */}

        <View
          style={{
            marginTop: 18,

            backgroundColor:
              '#ffffff22',

            borderRadius: 16,

            flexDirection: 'row',

            alignItems: 'center',

            paddingHorizontal: 14,
          }}>

          <MaterialCommunityIcons
            name="magnify"
            size={22}
            color="#fff"
          />

          <TextInput
            placeholder="Search invoice, customer..."

            placeholderTextColor="#ddd"

            value={search}

            onChangeText={
              handleSearch
            }

            style={{
              flex: 1,

              color: '#fff',

              paddingVertical: 12,

              marginLeft: 10,
            }}
          />

        </View>


     
     </LinearGradient>

      {/* LIST */}

   <View
  style={{
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
  }}
>
  {filteredData.length === 0 ? (

    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <View
        style={{
          width: 130,
          height: 130,
          borderRadius: 65,
          backgroundColor: "#F3F4F6",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="clipboard-text-search-outline"
          size={65}
          color="#9CA3AF"
        />
      </View>

      <Text
        style={{
          marginTop: 18,
          fontSize: 20,
          fontWeight: "900",
          color: "#374151",
        }}
      >
        No Purchase Returns
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 13,
          color: "#9CA3AF",
          textAlign: "center",
          paddingHorizontal: 40,
        }}
      >
        Purchase return invoices will appear here
      </Text>

    </View>

  ) : (

    <FlatList
      data={filteredData}
      keyExtractor={(item, index) =>
        item?.id?.toString() ||
        index.toString()
      }
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#4F46E5"
          colors={["#4F46E5"]}
        />
      }
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 10,
          }}
        />
      )}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
    />

  )}
</View>

    </View>

  );

}