

import React, {
  useCallback,
  useEffect,
  useState,useMemo
} from "react";


import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import {
  Menu,
  Divider,
} from "react-native-paper";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import DateTimePicker
  from "@react-native-community/datetimepicker";

import {
  LineChart,
  BarChart,
  PieChart,
} from "react-native-chart-kit";

import * as Print
  from "expo-print";

import * as Sharing
  from "expo-sharing";

import {
  getFullReport,
} from "../database/sqlite";

import {
  useRouter,
} from "expo-router";


// =====================================================
// CONSTANTS
// =====================================================

const screenWidth =
  Dimensions.get("window").width;

const CARD_WIDTH =
  (screenWidth - 48) / 2;


// =====================================================
// TYPES
// =====================================================

type FilterType =
  | "Today"
  | "Week"
  | "Month"
  | "Custom";

type GraphType =
  | "line"
  | "bar"
  | "pie";


// =====================================================
// SCREEN
// =====================================================

export default function ReportsScreen() {

  const router =
    useRouter();


  // ===================================================
  // FILTER
  // ===================================================

  const [
    filter,
    setFilter,
  ] =
    useState<FilterType>("Today");




  const [
    fromDate,
    setFromDate,
  ] =
    useState<Date | null>(null);



  const [
    toDate,
    setToDate,
  ] =
    useState<Date | null>(null);


  const [
    showFrom,
    setShowFrom,
  ] =
    useState(false);


  const [
    showTo,
    setShowTo,
  ] =
    useState(false);


 


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);


  // ===================================================
  // REPORT MENU
  // ===================================================

  const [
    reportName,
    setReportName,
  ] =
    useState("Sales Report");


  const [
    menuVisible,
    setMenuVisible,
  ] =
    useState(false);


  const [report, setReport] = useState({
  invoices: [],
  purchases: [],
  salesReturns: [],
  purchaseReturns: [],

  salesTotal: 0,
  purchaseTotal: 0,
  salesReturnTotal: 0,
  purchaseReturnTotal: 0,
  profit: 0,
});


const [reportData, setReportData] = useState(null);

const [salesTotal, setSalesTotal] = useState(0);
const [purchaseTotal, setPurchaseTotal] = useState(0);
const [salesReturnTotal, setSalesReturnTotal] = useState(0);
const [purchaseReturnTotal, setPurchaseReturnTotal] = useState(0);
const [Profit, setProfit] = useState(0);


  // ===================================================
  // GRAPH
  // ===================================================

  const [
    graphType,
    setGraphType,
  ] =
    useState<GraphType>("line");


  // ===================================================
  // DATE RANGE
  // ===================================================

const getDateRange = useCallback(() => {
  const now = new Date();

  // ===================================================
  // TODAY
  // ===================================================

  if (filter === "Today") {
    const from = new Date(now);
    const to = new Date(now);

    from.setHours(
      0,
      0,
      0,
      0
    );

    to.setHours(
      23,
      59,
      59,
      999
    );

    return {
      from,
      to,
    };
  }

  // ===================================================
  // WEEK
  // ===================================================

  if (filter === "Week") {
    const from = new Date(now);
    const to = new Date(now);

    from.setDate(
      from.getDate() - 7
    );

    from.setHours(
      0,
      0,
      0,
      0
    );

    to.setHours(
      23,
      59,
      59,
      999
    );

    return {
      from,
      to,
    };
  }

  // ===================================================
  // MONTH
  // ===================================================

  if (filter === "Month") {
    const from = new Date(now);
    const to = new Date(now);

    from.setMonth(
      from.getMonth() - 1
    );

    from.setHours(
      0,
      0,
      0,
      0
    );

    to.setHours(
      23,
      59,
      59,
      999
    );

    return {
      from,
      to,
    };
  }

  // ===================================================
  // CUSTOM
  // ===================================================

  if (
    filter === "Custom"
  ) {
    if (
      !fromDate ||
      !toDate
    ) {
      return {
        from: null,
        to: null,
      };
    }

    const from =
      new Date(fromDate);

    const to =
      new Date(toDate);

    from.setHours(
      0,
      0,
      0,
      0
    );

    to.setHours(
      23,
      59,
      59,
      999
    );

    return {
      from,
      to,
    };
  }

  return {
    from: null,
    to: null,
  };
}, [
  filter,
  fromDate,
  toDate,
]);

  // ===================================================
  // LOAD REPORT
  // ===================================================

  const loadReport = useCallback(
  async (isRefresh = false) => {
    try {
      console.log(
        "===================================="
      );

      console.log(
        "📊 LOADING REPORT"
      );

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // ===================================================
      // GET CORRECT DATE RANGE
      // ===================================================

      const {
        from,
        to,
      } = getDateRange();

      console.log(
        "📅 REPORT RANGE:",
        {
          from,
          to,
        }
      );

      // ===================================================
      // CUSTOM DATE NOT SELECTED
      // ===================================================

      if (!from || !to) {
        console.log(
          "⚠️ CUSTOM DATE NOT SELECTED"
        );

        setReport({
          invoices: [],
          purchases: [],
          salesReturns: [],
          purchaseReturns: [],

          salesTotal: 0,
          purchaseTotal: 0,
          salesReturnTotal: 0,
          purchaseReturnTotal: 0,
          profit: 0,
        });

        return;
      }

      // ===================================================
      // CALL SQLITE
      // ===================================================

      const result =
        await getFullReport(
          from,
          to
        );

      console.log(
        "📦 FULL REPORT:",
        result
      );

      // ===================================================
      // SAVE COMPLETE REPORT
      // ===================================================

      setReport({
        invoices:
          Array.isArray(
            result?.invoices
          )
            ? result.invoices
            : [],

        purchases:
          Array.isArray(
            result?.purchases
          )
            ? result.purchases
            : [],

        salesReturns:
          Array.isArray(
            result?.salesReturns
          )
            ? result.salesReturns
            : [],

        purchaseReturns:
          Array.isArray(
            result?.purchaseReturns
          )
            ? result.purchaseReturns
            : [],

        salesTotal:
          Number(
            result?.salesTotal || 0
          ),

        purchaseTotal:
          Number(
            result?.purchaseTotal || 0
          ),

        salesReturnTotal:
          Number(
            result?.salesReturnTotal || 0
          ),

        purchaseReturnTotal:
          Number(
            result?.purchaseReturnTotal || 0
          ),

        profit:
          Number(
            result?.profit || 0
          ),
      });

      // ===================================================
      // DEBUG
      // ===================================================

      console.log(
        "------------------------------------"
      );

      console.log(
        "💰 SALES:",
        Number(
          result?.salesTotal || 0
        )
      );

      console.log(
        "🛒 PURCHASE:",
        Number(
          result?.purchaseTotal || 0
        )
      );

      console.log(
        "↩️ SALES RETURN:",
        Number(
          result?.salesReturnTotal || 0
        )
      );

      console.log(
        "↩️ PURCHASE RETURN:",
        Number(
          result?.purchaseReturnTotal || 0
        )
      );

      console.log(
        "📈 PROFIT:",
        Number(
          result?.profit || 0
        )
      );

      console.log(
        "===================================="
      );

    } catch (error) {
      console.log(
        "❌ LOAD REPORT ERROR:",
        error
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  },
  [
    getDateRange,
  ]
);

useEffect(() => {
  loadReport();
}, [loadReport]);

  // ===================================================
  // FORMAT
  // ===================================================

  const money =
    useCallback(
      (value: any) => {

        return Number(
          value || 0
        ).toLocaleString(
          "en-IN",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        );

      },
      []
    );


  // ===================================================
  // REPORT VALUES
  // ===================================================

  const sales =
    Number(
      report?.salesTotal || 0
    );


  const purchase =
    Number(
      report?.purchaseTotal || 0
    );


  const salesReturn =
    Number(
      report?.salesReturnTotal || 0
    );


  const purchaseReturn =
    Number(
      report?.purchaseReturnTotal || 0
    );


  const profit =
    Number(
      report?.profit || 0
    );


  // ===================================================
  // TOTAL BUSINESS VALUE
  // ===================================================

  const totalBusiness =
    sales +
    purchase +
    salesReturn +
    purchaseReturn;


  // ===================================================
  // PROFIT STATUS
  // ===================================================

  const profitPositive =
    profit >= 0;


  // ===================================================
  // PIE DATA
  // ===================================================

  const pieData = useMemo(() => {
  const data: any[] = [];

  if (sales > 0) {
    data.push({
      name: "Sales",
      population: Number(sales),
      color: "#22C55E",
      legendFontColor: "#334155",
      legendFontSize: 12,
    });
  }

  if (purchase > 0) {
    data.push({
      name: "Purchase",
      population: Number(purchase),
      color: "#3B82F6",
      legendFontColor: "#334155",
      legendFontSize: 12,
    });
  }

  if (salesReturn > 0) {
    data.push({
      name: "Sales Return",
      population: Number(salesReturn),
      color: "#F97316",
      legendFontColor: "#334155",
      legendFontSize: 12,
    });
  }

  if (purchaseReturn > 0) {
    data.push({
      name: "Purchase Return",
      population: Number(purchaseReturn),
      color: "#EF4444",
      legendFontColor: "#334155",
      legendFontSize: 12,
    });
  }

  return data;
}, [
  sales,
  purchase,
  salesReturn,
  purchaseReturn,
]);
  // ===================================================
  // GRAPH ICON
  // ===================================================

  const graphIcon =
    graphType === "line"
      ? "chart-line"
      : graphType === "bar"
      ? "chart-bar"
      : "chart-pie";


  // ===================================================
  // CHANGE GRAPH
  // ===================================================

  const changeGraph = () => {

  if (graphType === "line") {

    setGraphType("bar");

  } else if (graphType === "bar") {

    setGraphType("pie");

  } else {

    setGraphType("line");

  }

};


  // ===================================================
  // FILTER
  // ===================================================

  const changeFilter =
    (
      value: FilterType
    ) => {

      setFilter(value);

      if (
        value !== "Custom"
      ) {

        setFromDate(null);

        setToDate(null);

      }

    };


  // ===================================================
  // PDF
  // ===================================================

  const generatePDF =
    async () => {

      try {

        const {
          from,
          to,
        } =
          getDateRange();


        const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

body {
  font-family: Arial;
  padding: 25px;
  color: #111827;
}

h1 {
  color: #4C1D95;
  margin-bottom: 5px;
}

.subtitle {
  color: #64748B;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #4C1D95;
  color: white;
  padding: 12px;
  text-align: left;
}

td {
  padding: 12px;
  border-bottom: 1px solid #E5E7EB;
}

.total {
  font-weight: bold;
}

.profit {
  color: ${
    profitPositive
      ? "#16A34A"
      : "#DC2626"
  };
  font-weight: bold;
}

</style>

</head>

<body>

<h1>Business Report</h1>

<div class="subtitle">
${filter} Report
</div>

<p>
<strong>From:</strong>
${from.toDateString()}
</p>

<p>
<strong>To:</strong>
${to.toDateString()}
</p>

<table>

<tr>
<th>Report</th>
<th>Amount</th>
</tr>

<tr>
<td>Sales</td>
<td>₹${money(sales)}</td>
</tr>

<tr>
<td>Purchase</td>
<td>₹${money(purchase)}</td>
</tr>

<tr>
<td>Sales Return</td>
<td>₹${money(salesReturn)}</td>
</tr>

<tr>
<td>Purchase Return</td>
<td>₹${money(purchaseReturn)}</td>
</tr>

<tr class="total">
<td>Profit / Loss</td>
<td class="profit">
₹${money(profit)}
</td>
</tr>

</table>

</body>

</html>
`;


        const {
          uri,
        } =
          await Print.printToFileAsync({
            html,
          });


        if (
          await Sharing.isAvailableAsync()
        ) {

          await Sharing.shareAsync(
            uri
          );

        } else {

          Alert.alert(
            "PDF Created",
            "PDF sharing is not available on this device."
          );

        }

      } catch (error) {

        console.log(
          "❌ PDF ERROR:",
          error
        );

        Alert.alert(
          "Error",
          "PDF generation failed"
        );

      }

    };


  // ===================================================
  // REPORT CARD DATA
  // ===================================================

  const cards = [

    {
      title: "Sales",
      value: sales,
      icon: "cash-multiple",
      color: "#16A34A",

      onPress: () =>
        router.push({
          pathname:
            "/src/screens/ViewInvoiceScreen",

          params: {
            filter,
          },
        }),
    },


    {
      title: "Purchase",
      value: purchase,
      icon: "cart-outline",
      color: "#2563EB",

      onPress: () =>
        router.push({
          pathname:
            "/src/screens/ViewPurchaseScreen",

          params: {
            filter,
          },
        }),
    },


    {
      title: "Sales Return",
      value: salesReturn,
      icon: "cash-refund",
      color: "#EA580C",

      onPress: () =>
        router.push({
          pathname:
            "/src/screens/ViewSalesReturn",

          params: {
            filter,
          },
        }),
    },


    {
      title: "Purchase Return",
      value: purchaseReturn,
      icon: "backup-restore",
      color: "#DC2626",

      onPress: () =>
        router.push({
          pathname:
            "/src/screens/ViewPurchaseReturn",

          params: {
            filter,
          },
        }),
    },

  ];


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <View
      style={{
        flex: 1,
        backgroundColor:
          "#F4F6F8",
      }}
    >

      <StatusBar
        backgroundColor="#4C1D95"
        barStyle="light-content"
      />


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <LinearGradient
        colors={[
          "#4C1D95",
          "#6D28D9",
          "#8B5CF6",
        ]}
        style={{
          paddingTop: 58,
          paddingBottom: 22,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >

        <View
          style={{
            flexDirection: "row",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >

          <View>

            <Text
              style={{
                color: "#fff",
                fontSize: 28,
                fontWeight: "800",
              }}
            >
              Reports
            </Text>

            <Text
              style={{
                color: "#E9D5FF",
                marginTop: 4,
                fontSize: 13,
              }}
            >
              Business Analytics
            </Text>

          </View>


          <TouchableOpacity
            onPress={changeGraph}
            activeOpacity={0.8}
            style={{
              width: 52,
              height: 52,
              borderRadius: 17,
              backgroundColor:
                "rgba(255,255,255,0.16)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >

            <MaterialCommunityIcons
              name={graphIcon}
              size={28}
              color="#fff"
            />

          </TouchableOpacity>

        </View>


        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          style={{
            marginTop: 22,
          }}
        >

          {[
            "Today",
            "Week",
            "Month",
            "Custom",
          ].map(
            (
              item: FilterType
            ) => (

              <TouchableOpacity
                key={item}
                onPress={() =>
                  changeFilter(
                    item
                  )
                }
                activeOpacity={0.8}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 20,
                  marginRight: 9,
                  backgroundColor:
                    filter === item
                      ? "#fff"
                      : "rgba(255,255,255,0.15)",
                }}
              >

                <Text
                  style={{
                    color:
                      filter === item
                        ? "#4C1D95"
                        : "#fff",

                    fontWeight:
                      "700",
                  }}
                >
                  {item}
                </Text>

              </TouchableOpacity>

            )
          )}

        </ScrollView>

      </LinearGradient>


      {/* ================================================= */}
      {/* CUSTOM DATE */}
      {/* ================================================= */}

      {filter === "Custom" && (

        <View
          style={{
            flexDirection: "row",
            padding: 16,
            gap: 10,
          }}
        >

          <TouchableOpacity
            onPress={() =>
              setShowFrom(true)
            }
            style={{
              flex: 1,
              backgroundColor:
                "#fff",
              padding: 14,
              borderRadius: 16,
              elevation: 2,
            }}
          >

            <Text
              style={{
                color: "#64748B",
                fontSize: 12,
              }}
            >
              From Date
            </Text>

            <Text
              style={{
                marginTop: 5,
                fontWeight: "800",
                color: "#111827",
              }}
            >
              {fromDate
                ? fromDate.toLocaleDateString()
                : "Select Date"}
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            onPress={() =>
              setShowTo(true)
            }
            style={{
              flex: 1,
              backgroundColor:
                "#fff",
              padding: 14,
              borderRadius: 16,
              elevation: 2,
            }}
          >

            <Text
              style={{
                color: "#64748B",
                fontSize: 12,
              }}
            >
              To Date
            </Text>

            <Text
              style={{
                marginTop: 5,
                fontWeight: "800",
                color: "#111827",
              }}
            >
              {toDate
                ? toDate.toLocaleDateString()
                : "Select Date"}
            </Text>

          </TouchableOpacity>

        </View>

      )}


      {/* ================================================= */}
      {/* DATE PICKER */}
      {/* ================================================= */}

      {showFrom && (

        <DateTimePicker
          value={
            fromDate ||
            new Date()
          }
          mode="date"
          onChange={(
            event,
            date
          ) => {

            setShowFrom(false);

            if (date) {

              setFromDate(date);

            }

          }}
        />

      )}


      {showTo && (

        <DateTimePicker
          value={
            toDate ||
            new Date()
          }
          mode="date"
          onChange={(
            event,
            date
          ) => {

            setShowTo(false);

            if (date) {

              setToDate(date);

            }

          }}
        />

      )}


      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading ? (

        <View
          style={{
            flex: 1,
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >

          <ActivityIndicator
            size="large"
            color="#6D28D9"
          />

          <Text
            style={{
              marginTop: 12,
              color: "#64748B",
            }}
          >
            Loading report...
          </Text>

        </View>

      ) : (

        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 120,
          }}
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={() =>
                loadReport(true)
              }
            />
          }
        >


          {/* ================================================= */}
          {/* SUMMARY HEADER */}
          {/* ================================================= */}

          <View
            style={{
              backgroundColor:
                "#fff",
              borderRadius: 22,
              padding: 18,
              marginBottom: 16,
              elevation: 3,
            }}
          >

            <Text
              style={{
                fontSize: 14,
                color: "#64748B",
                fontWeight: "600",
              }}
            >
              {filter} Business Summary
            </Text>

            <Text
              style={{
                marginTop: 5,
                fontSize: 28,
                fontWeight: "900",
                color: "#111827",
              }}
            >
              ₹{money(sales)}
            </Text>

            <Text
              style={{
                marginTop: 2,
                fontSize: 12,
                color: "#94A3B8",
              }}
            >
              Total Sales
            </Text>

          </View>


          {/* ================================================= */}
          {/* CARDS */}
          {/* ================================================= */}

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent:
                "space-between",
            }}
          >

            {cards.map(
              (
                item,
                index
              ) => (

                <TouchableOpacity
                  key={index}
                  onPress={
                    item.onPress
                  }
                  activeOpacity={0.85}
                  style={{
                    width:
                      CARD_WIDTH,
                    backgroundColor:
                      "#fff",
                    borderRadius:
                      20,
                    padding: 17,
                    marginBottom:
                      14,
                    elevation: 3,
                  }}
                >

                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      backgroundColor:
                        `${item.color}15`,
                      justifyContent:
                        "center",
                      alignItems:
                        "center",
                    }}
                  >

                    <MaterialCommunityIcons
                      name={
                        item.icon as any
                      }
                      size={25}
                      color={
                        item.color
                      }
                    />

                  </View>


                  <Text
                    style={{
                      marginTop: 12,
                      color:
                        "#64748B",
                      fontSize: 13,
                      fontWeight:
                        "600",
                    }}
                  >
                    {item.title}
                  </Text>


                  <Text
                    style={{
                      marginTop: 4,
                      color:
                        "#111827",
                      fontSize: 19,
                      fontWeight:
                        "900",
                    }}
                  >
                    ₹{money(
                      item.value
                    )}
                  </Text>

                </TouchableOpacity>

              )
            )}

          </View>


          {/* ================================================= */}
          {/* PROFIT CARD */}
          {/* ================================================= */}

          <View
            style={{
              backgroundColor:
                profitPositive
                  ? "#166534"
                  : "#991B1B",
              borderRadius: 22,
              padding: 20,
              marginTop: 2,
              marginBottom: 16,
            }}
          >

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >

              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor:
                    "rgba(255,255,255,0.15)",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                }}
              >

                <MaterialCommunityIcons
                  name={
                    profitPositive
                      ? "trending-up"
                      : "trending-down"
                  }
                  size={28}
                  color="#fff"
                />

              </View>


              <View
                style={{
                  marginLeft: 13,
                  flex: 1,
                }}
              >

                <Text
                  style={{
                    color:
                      "#DCFCE7",
                    fontSize: 12,
                    fontWeight:
                      "700",
                  }}
                >
                  {profitPositive
                    ? "NET PROFIT"
                    : "NET LOSS"}
                </Text>

                <Text
                  style={{
                    color: "#fff",
                    fontSize: 26,
                    fontWeight:
                      "900",
                    marginTop: 2,
                  }}
                >
                  ₹{money(
                    Math.abs(
                      profit
                    )
                  )}
                </Text>

              </View>

            </View>

          </View>


          {/* ================================================= */}
          {/* GRAPH HEADER */}
          {/* ================================================= */}

          <View
            style={{
              backgroundColor:
                "#fff",
              borderRadius: 22,
              padding: 16,
              elevation: 3,
            }}
          >

            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >

              <View>

                <Text
                  style={{
                    fontSize: 17,
                    fontWeight:
                      "800",
                    color:
                      "#111827",
                  }}
                >
                  Business Analytics
                </Text>

                <Text
                  style={{
                    marginTop: 3,
                    color:
                      "#94A3B8",
                    fontSize: 11,
                  }}
                >
                  Sales vs Purchase vs Profit
                </Text>

              </View>


              <TouchableOpacity
                onPress={
                  changeGraph
                }
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 13,
                  backgroundColor:
                    "#F3E8FF",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                }}
              >

                <MaterialCommunityIcons
                  name={
                    graphIcon
                  }
                  size={22}
                  color="#6D28D9"
                />

              </TouchableOpacity>

            </View>


            {/* ================================================= */}
            {/* LINE CHART */}
            {/* ================================================= */}

            {graphType ===
              "line" && (

              <LineChart
                data={{
                  labels: [
                    "Sales",
                    "Purchase",
                    "Profit",
                  ],
                  datasets: [
                    {
                      data: [
                        sales,
                        purchase,
                        profit,
                      ],
                    },
                  ],
                }}
                width={
                  screenWidth -
                  64
                }
                height={230}
                bezier
                fromZero
                chartConfig={{
                  backgroundGradientFrom:
                    "#fff",
                  backgroundGradientTo:
                    "#fff",
                  decimalPlaces: 0,
                  color:
                    () =>
                      "#6D28D9",
                  labelColor:
                    () =>
                      "#475569",
                  propsForDots: {
                    r: "5",
                  },
                }}
                style={{
                  marginTop: 15,
                  borderRadius: 18,
                }}
              />

            )}


            {/* ================================================= */}
            {/* BAR CHART */}
            {/* ================================================= */}

            {graphType ===
              "bar" && (

              <BarChart
                data={{
                  labels: [
                    "Sales",
                    "Purchase",
                    "Profit",
                  ],
                  datasets: [
                    {
                      data: [
                        Math.max(
                          0,
                          sales
                        ),
                        Math.max(
                          0,
                          purchase
                        ),
                        Math.max(
                          0,
                          profit
                        ),
                      ],
                    },
                  ],
                }}
                width={
                  screenWidth -
                  64
                }
                height={230}
                fromZero
                showValuesOnTopOfBars
                chartConfig={{
                  backgroundGradientFrom:
                    "#fff",
                  backgroundGradientTo:
                    "#fff",
                  decimalPlaces: 0,
                  color:
                    () =>
                      "#10B981",
                  labelColor:
                    () =>
                      "#475569",
                }}
                style={{
                  marginTop: 15,
                  borderRadius: 18,
                }}
              />

            )}


            {/* ================================================= */}
            {/* PIE CHART */}
            {/* ================================================= */}

         {graphType === "pie" && (

  <View
    style={{
      marginTop: 10,
      alignItems: "center",
      height: 210,
      overflow: "hidden",
    }}
  >

    {pieData.length > 0 ? (

      <PieChart
        data={pieData}

        // 👇 smaller chart area
        width={screenWidth - 50}

        // 👇 reduce height
        height={190}

        accessor="population"

        backgroundColor="transparent"

        // 👇 move pie slightly
        paddingLeft="5"


        center={[0, 0]}

        absolute

        hasLegend={true}

        chartConfig={{
          color: () =>
            "#111827",

          labelColor: () =>
            "#475569",

          backgroundGradientFrom:
            "#FFFFFF",

          backgroundGradientTo:
            "#FFFFFF",

          decimalPlaces: 0,
        }}

        style={{
          borderRadius: 18,
        }}
      />

    ) : (

      <View
        style={{
          height: 190,
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <MaterialCommunityIcons
          name="chart-pie"
          size={48}
          color="#CBD5E1"
        />

        <Text
          style={{
            marginTop: 10,
            color: "#64748B",
            fontSize: 13,
            fontWeight: "600",
          }}
        >
          No report data available
        </Text>

      </View>

    )}

  </View>

)}

          </View>


          {/* ================================================= */}
          {/* BUSINESS TOTAL */}
          {/* ================================================= */}

          <View
            style={{
              marginTop: 16,
              backgroundColor:
                "#EEF2FF",
              borderRadius: 20,
              padding: 18,
            }}
          >

            <Text
              style={{
                color:
                  "#475569",
                fontSize: 12,
                fontWeight:
                  "700",
              }}
            >
              BUSINESS ACTIVITY
            </Text>


            <Text
              style={{
                color:
                  "#312E81",
                fontSize: 24,
                fontWeight:
                  "900",
                marginTop: 4,
              }}
            >
              ₹{money(
                totalBusiness
              )}
            </Text>

          </View>


          {/* ================================================= */}
          {/* PDF BUTTON */}
          {/* ================================================= */}

          <TouchableOpacity
            onPress={
              generatePDF
            }
            activeOpacity={0.85}
            style={{
              marginTop: 18,
              backgroundColor:
                "#4C1D95",
              paddingVertical: 17,
              borderRadius: 18,
              flexDirection:
                "row",
              justifyContent:
                "center",
              alignItems:
                "center",
            }}
          >

            <MaterialCommunityIcons
              name="file-pdf-box"
              size={24}
              color="#fff"
            />

            <Text
              style={{
                marginLeft: 9,
                color: "#fff",
                fontWeight:
                  "800",
                fontSize: 16,
              }}
            >
              Generate PDF Report
            </Text>

          </TouchableOpacity>


        </ScrollView>

      )}

    </View>
  );
}