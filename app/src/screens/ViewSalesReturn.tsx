import React, {
  useEffect,
  useState,
} from "react";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  RefreshControl,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  router,
} from 'expo-router';

import {getDB,
  getSalesReturns,
  deleteSalesReturn,
} from '../database/sqlite';

export default function SalesReturnList() {

  const [data,
    setData] =
    useState([]);

const [salesReturns, setSalesReturns] =
  useState([]);
  const [filteredData,
    setFilteredData] =
    useState([]);

  const [search,
    setSearch] =
    useState('');

  const [refreshing,
    setRefreshing] =
    useState(false);

const [filteredSalesReturns, setFilteredSalesReturns] = useState([]);
const [salesReturnList, setSalesReturnList] = useState([]);

const handleSearch = text => {

  setSearch(text);

  if (!text.trim()) {

    setFilteredSalesReturns(
      salesReturnList
    );

    return;
  }

  const keyword =
    text.toLowerCase();

  const filtered =
    salesReturnList.filter(
      item =>

        String(
          item.invoiceNo || ""
        )
          .toLowerCase()
          .includes(keyword)

        ||

        item.customer
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.mobileno
          ?.toLowerCase()
          .includes(keyword)
    );

  setFilteredSalesReturns(
    filtered
  );
};

  // ================= LOAD =================

  useEffect(() => {

    loadData();

  }, []);


  useEffect(() => {
  loadSalesReturns();
}, []);



const generateSalesReturnPdf =
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
                color:#1976d2;
              "
            >
              Sales Return Report
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
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>

              ${salesReturns
                .map(
                  (item, index) => `
                    <tr>

                      <td>
                        ${index + 1}
                      </td>

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
              ₹ ${salesReturns.reduce(
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
        "❌ generateSalesReturnPdf:",
        error
      );

    }
  };

const loadSalesReturns = async () => {
  try {
    const db = await getDB();

    const result = await db.getAllAsync(`
      SELECT
        sr.*,
        (
          SELECT COUNT(*)
          FROM sales_return_items sri
          WHERE sri.salesReturnId = sr.id
        ) AS itemCount
      FROM sales_returns sr
      ORDER BY sr.createdAt DESC
    `);

    console.log("📦 Sales Returns:", result);

    setSalesReturns(result);

  } catch (error) {
    console.log("❌ loadSalesReturns:", error);
  }
};

const loadData = async () => {

  try {

    const data =
      await getSalesReturns();

    console.log(
      "📦 Sales Returns:",
      data
    );

    setSalesReturnList(data);

    // IMPORTANT
    setFilteredSalesReturns(
      data
    );

  } catch (e) {

    console.log(
      "❌ Load Error:",
      e
    );

  }

};


  // ================= DELETE =================

  const handleDelete =
    async id => {

    try {

      await deleteSalesReturn(id);

      loadData();

    } catch (e) {

      console.log(
        '❌ delete error:',
        e
      );

    }

  };

  // ================= CARD =================
const renderItem = ({ item, index }) => {

  const itemCount =
  Number(item.itemCount) ||
  Number(item.totalItems) ||
  Number(item.itemsCount) ||
  0;

  return (

    <TouchableOpacity
      activeOpacity={0.95}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 22,
        padding: 16,
        marginBottom: 14,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
          width: 0,
          height: 3,
        },
      }}
      onPress={() =>
        router.push({
          pathname:
            "/src/screens/ViewSalesReturn",
          params: {
            id: item.id,
          },
        })
      }
    >

      {/* HEADER */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
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
                fontWeight: "800",
                fontSize: 12,
              }}
            >
              INV #{item.invoiceNo || "-"}
            </Text>
          </View>

          <Text
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "#6B7280",
            }}
          >
            {item.date ||
              (
                item.createdAt
                  ? new Date(
                      item.createdAt
                    ).toLocaleDateString(
                      "en-GB"
                    )
                  : "-"
              )}
          </Text>

        </View>

        <LinearGradient
          colors={[
            "#4F46E5",
            "#6366F1",
          ]}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 14,
          }}
        >
          <Text
            style={{
              color: "#FFF",
              fontWeight: "800",
            }}
          >
            ₹
            {Number(
              item.total || 0
            ).toFixed(2)}
          </Text>
        </LinearGradient>

      </View>

      {/* CUSTOMER */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 14,
          backgroundColor: "#F8FAFC",
          padding: 12,
          borderRadius: 14,
        }}
      >

        <MaterialCommunityIcons
          name="account-circle"
          size={26}
          color="#4F46E5"
        />

        <View
          style={{
            marginLeft: 10,
            flex: 1,
          }}
        >

          <Text
            style={{
              fontSize: 15,
              fontWeight: "800",
              color: "#111827",
            }}
          >
            {item.customer ||
              "COMMON CASH"}
          </Text>

          <Text
            style={{
              fontSize: 11,
              color: "#6B7280",
              marginTop: 2,
            }}
          >
            {item.ledger || "-"}
          </Text>

        </View>

      </View>

      {/* STATS */}

      <View
        style={{
          flexDirection: "row",
          justifyContent:
            "space-between",
          marginTop: 14,
        }}
      >

    

        <View
          style={{
            flex: 1,
            backgroundColor:
              "#FEF3C7",
            borderRadius: 12,
            padding: 10,
            marginHorizontal: 4,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: "#D97706",
            }}
          >
            TYPE
          </Text>

          <Text
            style={{
              fontWeight: "800",
              fontSize: 13,
            }}
          >
            {item.salesType ||
              "-"}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor:
              "#DCFCE7",
            borderRadius: 12,
            padding: 10,
            marginLeft: 4,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: "#16A34A",
            }}
          >
            STATUS
          </Text>

          <Text
            style={{
              fontWeight: "800",
              fontSize: 13,
            }}
          >
            ACTIVE
          </Text>
        </View>

      </View>

      {/* SUMMARY */}

      <View
        style={{
          marginTop: 14,
          backgroundColor:
            "#F9FAFB",
          borderRadius: 14,
          padding: 12,
        }}
      >

        <View
          style={{
            flexDirection: "row",
            justifyContent:
              "space-between",
          }}
        >
          <Text
            style={{
              color: "#6B7280",
            }}
          >
            Gross Amount
          </Text>

          <Text
            style={{
              fontWeight: "700",
            }}
          >
            ₹
            {Number(
              item.grossAmount || 0
            ).toFixed(2)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent:
              "space-between",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              color: "#6B7280",
            }}
          >
            Discount
          </Text>

          <Text
            style={{
              fontWeight: "700",
              color: "#DC2626",
            }}
          >
            ₹
            {Number(
              item.cashDiscount || 0
            ).toFixed(2)}
          </Text>
        </View>

      </View>

      {/* ACTIONS */}

      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
        }}
      >

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor:
              "#EEF2FF",
            paddingVertical: 10,
            borderRadius: 12,
            alignItems: "center",
            marginRight: 6,
          }}
          onPress={() =>
            router.push({
              pathname:
                "/src/screens/ViewSalesReturnDetailsScreen",
              params: {
                id: item.id,
              },
            })
          }
        >
          <MaterialCommunityIcons
            name="eye-outline"
            size={22}
            color="#4F46E5"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor:
              "#FEE2E2",
            paddingVertical: 10,
            borderRadius: 12,
            alignItems: "center",
          }}
          onPress={() =>
            handleDelete(
              item.id
            )
          }
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={22}
            color="#DC2626"
          />
        </TouchableOpacity>

      </View>

    </TouchableOpacity>

  );
};
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
          paddingTop: 50,
          paddingBottom: 16,
          paddingHorizontal: 16,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >

        <View
          style={{
            flexDirection: 'row',

            justifyContent:
              'space-between',

            alignItems:
              'center',
          }}>

          <TouchableOpacity
            onPress={() =>
              router.back()
            }>

            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#fff"
            />

          </TouchableOpacity>

          <Text
            style={{
              color: '#fff',

              fontSize: 20,

              fontWeight:
                '800',
            }}>

            Sales Returns

          </Text>

          <TouchableOpacity>

            <MaterialCommunityIcons
              name="file-document-outline"
              size={24}
              color="#fff"
              onPress={generateSalesReturnPdf}
            />

          </TouchableOpacity>

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
  onChangeText={handleSearch}
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
  {filteredSalesReturns.length === 0 ? (

    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: "#F3F4F6",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="file-document-remove-outline"
          size={60}
          color="#9CA3AF"
        />
      </View>

      <Text
        style={{
          marginTop: 16,
          fontSize: 18,
          fontWeight: "700",
          color: "#374151",
        }}
      >
        No Sales Returns
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 13,
          color: "#9CA3AF",
          textAlign: "center",
        }}
      >
        Search results not found
      </Text>
    </View>

  ) : (

    <FlatList
      data={filteredSalesReturns}
      keyExtractor={(item, index) =>
        item?.id?.toString() ||
        index.toString()
      }
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={loadData}
          tintColor="#4F46E5"
        />
      }
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 10,
          }}
        />
      )}
    />

  )}
</View>

    </View>

  );

}