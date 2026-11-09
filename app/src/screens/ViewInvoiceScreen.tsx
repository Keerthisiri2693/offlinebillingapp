import React, {
  useState,
  useCallback,
  useMemo,
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  RefreshControl,
  TextInput,
  StyleSheet,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  getInvoices,
  deleteInvoice,
} from "../database/sqlite";




// =====================================================
// COLORS
// =====================================================

const COLORS = {
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  purple: "#7C3AED",

  background: "#F5F7FB",
  card: "#FFFFFF",

  text: "#0F172A",
  secondary: "#64748B",
  muted: "#94A3B8",

  border: "#E2E8F0",

  success: "#16A34A",
  successLight: "#DCFCE7",

  danger: "#EF4444",
  dangerLight: "#FEF2F2",

  blue: "#2563EB",
  blueLight: "#EFF6FF",

  orange: "#F97316",
  orangeLight: "#FFF7ED",
};


// =====================================================
// TYPES
// =====================================================

type Invoice = {
  id: string | number;
  invoiceNo?: number | string;

  customer?: string;
  mobileno?: string;

  date?: string;
  invoiceDate?: string;
  createdAt?: string;

  paidType?: string;
  salesType?: string;
  billType?: string;

  subtotal?: number;
  discount?: number;
  tax?: number;

  sgst?: number;
  cgst?: number;
  igst?: number;

  total?: number;

  creditPoints?: number;
  isSynced?: number;
};


// =====================================================
// SCREEN
// =====================================================

export default function InvoiceListScreen() {

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  // ===================================================
  // LOAD WHEN SCREEN FOCUSED
  // ===================================================

  useFocusEffect(
    useCallback(() => {

      loadInvoices();

    }, [])
  );


  // ===================================================
  // LOAD INVOICES
  // ===================================================

  const loadInvoices = async () => {

    try {

      const data = await getInvoices();

      console.log(
        "📦 ALL INVOICES:",
        data
      );

      const safeData: Invoice[] =
        Array.isArray(data)
          ? data
          : [];

      setInvoices(safeData);

      // Re-apply current search
      if (search.trim()) {

        filterInvoices(
          search,
          safeData
        );

      } else {

        setFiltered(safeData);

      }

    } catch (error) {

      console.log(
        "❌ loadInvoices:",
        error
      );

      setInvoices([]);
      setFiltered([]);

    }
  };


  // ===================================================
  // SEARCH
  // ===================================================

  const filterInvoices = (
    text: string,
    source: Invoice[] = invoices
  ) => {

    const keyword =
      text.trim().toLowerCase();

    if (!keyword) {

      setFiltered(source);

      return;

    }

    const result =
      source.filter((item) => {

        const customer =
          String(
            item.customer || ""
          ).toLowerCase();

        const invoiceNo =
          String(
            item.invoiceNo || ""
          ).toLowerCase();

        const id =
          String(
            item.id || ""
          ).toLowerCase();

        const mobile =
          String(
            item.mobileno || ""
          ).toLowerCase();

        const date =
          String(
            item.date || ""
          ).toLowerCase();

        return (
          customer.includes(keyword) ||
          invoiceNo.includes(keyword) ||
          id.includes(keyword) ||
          mobile.includes(keyword) ||
          date.includes(keyword)
        );

      });

    setFiltered(result);
  };


  const handleSearch = (
    text: string
  ) => {

    setSearch(text);

    filterInvoices(
      text
    );

  };


  // ===================================================
  // CLEAR SEARCH
  // ===================================================

  const clearSearch = () => {

    setSearch("");

    setFiltered(
      invoices
    );

  };


  // ===================================================
  // REFRESH
  // ===================================================

  const onRefresh = async () => {

    try {

      setRefreshing(true);

      await loadInvoices();

    } catch (error) {

      console.log(
        "❌ refresh:",
        error
      );

    } finally {

      setRefreshing(false);

    }

  };


  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = (
    id: string | number
  ) => {

    Alert.alert(
      "Delete Invoice",
      "Are you sure you want to delete this invoice?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {

            try {

              await deleteInvoice(
                id
              );

              await loadInvoices();

            } catch (error) {

              console.log(
                "❌ DELETE INVOICE:",
                error
              );

              Alert.alert(
                "Error",
                "Unable to delete invoice"
              );

            }

          },
        },
      ]
    );

  };


  // ===================================================
  // FORMAT MONEY
  // ===================================================

  const formatAmount = (
    value: any
  ) => {

    const amount =
      Number(value || 0);

    return `₹${amount.toFixed(2)}`;

  };


  // ===================================================
  // SUMMARY
  // ===================================================

  const summary = useMemo(() => {

    const totalInvoices =
      invoices.length;

    const totalSales =
      invoices.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.total || 0
          ),
        0
      );

    const paidInvoices =
      invoices.filter(
        item =>
          String(
            item.paidType || ""
          ).toUpperCase() ===
          "CASH"
      ).length;

    return {
      totalInvoices,
      totalSales,
      paidInvoices,
    };

  }, [invoices]);


  // ===================================================
  // PDF REPORT
  // ===================================================

  const generatePDF = async () => {

    try {

      const totalInvoices =
        invoices.length;

      const totalAmount =
        invoices.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.total || 0
            ),
          0
        );


      const rows =
        invoices
          .map(
            (
              item,
              index
            ) => `

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
                  ${item.paidType || ""}
                </td>

                <td>
                  ₹${Number(
                    item.total || 0
                  ).toFixed(2)}
                </td>

              </tr>
            `
          )
          .join("");


      const html = `

        <html>

        <head>

          <meta
            name="viewport"
            content="width=device-width,
            initial-scale=1"
          />

          <style>

            body {
              font-family: Arial;
              padding: 24px;
              color: #0f172a;
            }

            .header {
              text-align: center;
              margin-bottom: 25px;
            }

            h1 {
              color: #4f46e5;
              margin-bottom: 5px;
            }

            .sub {
              color: #64748b;
              font-size: 13px;
            }

            .summary {
              background: #f1f5f9;
              padding: 16px;
              border-radius: 10px;
              margin-bottom: 20px;
            }

            .summary p {
              margin: 7px 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th {
              background: #4f46e5;
              color: white;
              padding: 10px;
              border: 1px solid #ddd;
            }

            td {
              padding: 9px;
              border: 1px solid #ddd;
              text-align: center;
            }

            tr:nth-child(even) {
              background: #f8fafc;
            }

            .grand {
              font-weight: bold;
              background: #e0e7ff;
            }

            .footer {
              margin-top: 25px;
              text-align: center;
              color: #64748b;
              font-size: 11px;
            }

          </style>

        </head>

        <body>

          <div class="header">

            <h1>
              Invoice Report
            </h1>

            <div class="sub">
              Generated on
              ${new Date().toLocaleString()}
            </div>

          </div>


          <div class="summary">

            <p>
              <b>Total Invoices:</b>
              ${totalInvoices}
            </p>

            <p>
              <b>Total Sales:</b>
              ₹${totalAmount.toFixed(2)}
            </p>

          </div>


          <table>

            <tr>

              <th>
                S.No
              </th>

              <th>
                Invoice No
              </th>

              <th>
                Customer
              </th>

              <th>
                Date
              </th>

              <th>
                Payment
              </th>

              <th>
                Total
              </th>

            </tr>

            ${rows}


            <tr class="grand">

              <td colspan="5">
                Grand Total
              </td>

              <td>
                ₹${totalAmount.toFixed(2)}
              </td>

            </tr>

          </table>


          <div class="footer">
            Generated by  Offline Billing
          </div>

        </body>

        </html>
      `;


      const {
        uri,
      } =
        await Print.printToFileAsync({
          html,
        });


      await Sharing.shareAsync(
        uri
      );

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
  // INVOICE CARD
  // ===================================================

  const renderItem = ({
    item,
  }: {
    item: Invoice;
  }) => {

    const invoiceNumber =
      item.invoiceNo ||
      item.id;

    const total =
      Number(
        item.total || 0
      );

    const customer =
      item.customer ||
      "Customer";


    return (

      <TouchableOpacity

        activeOpacity={0.94}

        style={
          styles.invoiceCard
        }

        onPress={() => {

          console.log(
            "📦 CLICK INVOICE:",
            item
          );

          router.push({
            pathname:
              "/src/screens/ViewInvoiceDetailsScreen",

            params: {
              invoiceId:
                String(
                  item.id
                ),
            },
          });

        }}

      >

        {/* =========================================
            TOP ROW
        ========================================= */}

        <View
          style={
            styles.topRow
          }
        >

          <View
            style={
              styles.invoiceInfo
            }
          >

            <View
              style={
                styles.invoiceIcon
              }
            >

              <MaterialCommunityIcons
                name="receipt-text-outline"
                size={23}
                color="#4F46E5"
              />

            </View>


            <View
              style={
                styles.invoiceTitleArea
              }
            >

              <Text
                style={
                  styles.invoiceLabel
                }
              >
                INVOICE
              </Text>

              <Text
                style={
                  styles.invoiceNumber
                }
              >
                #{invoiceNumber}
              </Text>

            </View>

          </View>


          {/* AMOUNT */}

          <LinearGradient

            colors={[
              "#4F46E5",
              "#7C3AED",
            ]}

            start={{
              x: 0,
              y: 0,
            }}

            end={{
              x: 1,
              y: 1,
            }}

            style={
              styles.amountBadge
            }

          >

            <Text
              style={
                styles.amountText
              }
            >
              {formatAmount(total)}
            </Text>

          </LinearGradient>

        </View>


        {/* =========================================
            DIVIDER
        ========================================= */}

        <View
          style={
            styles.divider
          }
        />


        {/* =========================================
            CUSTOMER
        ========================================= */}

        <View
          style={
            styles.customerRow
          }
        >

          <LinearGradient

            colors={[
              "#EEF2FF",
              "#E0E7FF",
            ]}

            style={
              styles.avatar
            }

          >

            <Text
              style={
                styles.avatarText
              }
            >
              {customer
                .charAt(0)
                .toUpperCase()}
            </Text>

          </LinearGradient>


          <View
            style={
              styles.customerInfo
            }
          >

            <Text
              numberOfLines={1}
              style={
                styles.customerName
              }
            >
              {customer}
            </Text>


            <View
              style={
                styles.customerMeta
              }
            >

              <MaterialCommunityIcons
                name="calendar-outline"
                size={14}
                color="#94A3B8"
              />

              <Text
                style={
                  styles.metaText
                }
              >
                {item.date ||
                  item.invoiceDate ||
                  "-"}
              </Text>

              <View
                style={
                  styles.dot
                }
              />

              <MaterialCommunityIcons
                name="cash"
                size={14}
                color="#94A3B8"
              />

              <Text
                style={
                  styles.metaText
                }
              >
                {item.paidType ||
                  "CASH"}
              </Text>

            </View>

          </View>


          {/* PAID */}

          <View
            style={
              styles.paidBadge
            }
          >

            <MaterialCommunityIcons
              name="check-circle"
              size={14}
              color="#16A34A"
            />

            <Text
              style={
                styles.paidText
              }
            >
              PAID
            </Text>

          </View>

        </View>


        {/* =========================================
            DETAILS ROW
        ========================================= */}

        <View
          style={
            styles.detailsRow
          }
        >

          <View
            style={
              styles.detailItem
            }
          >

            <Text
              style={
                styles.detailLabel
              }
            >
              SALES TYPE
            </Text>

            <Text
              style={
                styles.detailValue
              }
            >
              {item.salesType ||
                "RETAIL"}
            </Text>

          </View>


          <View
            style={
              styles.detailItem
            }
          >

            <Text
              style={
                styles.detailLabel
              }
            >
              TAX
            </Text>

            <Text
              style={
                styles.detailValue
              }
            >
              {formatAmount(
                item.tax
              )}
            </Text>

          </View>


          <View
            style={
              styles.detailItem
            }
          >

            <Text
              style={
                styles.detailLabel
              }
            >
              POINTS
            </Text>

            <Text
              style={
                styles.pointsValue
              }
            >
              {Number(
                item.creditPoints || 0
              )}
            </Text>

          </View>

        </View>


        {/* =========================================
            ACTIONS
        ========================================= */}

        <View
          style={
            styles.actionRow
          }
        >

          {/* EDIT */}

          <TouchableOpacity

            activeOpacity={0.8}

            style={[
              styles.actionButton,
              styles.editButton,
            ]}

            onPress={(event) => {

              event.stopPropagation();

              router.push({

                pathname:
                  "/src/screens/BillingScreen",

                params: {

                  isEdit:
                    "true",

                  invoiceId:
                    String(
                      item.id
                    ),

                },

              });

            }}

          >

            <MaterialCommunityIcons
              name="pencil-outline"
              size={19}
              color="#2563EB"
            />

            <Text
              style={
                styles.editText
              }
            >
              Edit
            </Text>

          </TouchableOpacity>


          {/* DELETE */}

          <TouchableOpacity

            activeOpacity={0.8}

            style={[
              styles.actionButton,
              styles.deleteButton,
            ]}

            onPress={(event) => {

              event.stopPropagation();

              handleDelete(
                item.id
              );

            }}

          >

            <MaterialCommunityIcons
              name="delete-outline"
              size={19}
              color="#EF4444"
            />

            <Text
              style={
                styles.deleteText
              }
            >
              Delete
            </Text>

          </TouchableOpacity>

        </View>

      </TouchableOpacity>

    );

  };


  // ===================================================
  // EMPTY
  // ===================================================

  const renderEmpty = () => (

    <View
      style={
        styles.emptyContainer
      }
    >

      <View
        style={
          styles.emptyIcon
        }
      >

        <MaterialCommunityIcons
          name="receipt-text-remove-outline"
          size={42}
          color="#94A3B8"
        />

      </View>


      <Text
        style={
          styles.emptyTitle
        }
      >
        No invoices found
      </Text>


      <Text
        style={
          styles.emptySubtitle
        }
      >
        {search
          ? "Try another customer or invoice number"
          : "Create your first invoice to see it here"}
      </Text>


      {search ? (

        <TouchableOpacity
          style={
            styles.clearSearchButton
          }
          onPress={
            clearSearch
          }
        >

          <Text
            style={
              styles.clearSearchText
            }
          >
            Clear Search
          </Text>

        </TouchableOpacity>

      ) : null}

    </View>

  );


  // ===================================================
  // UI
  // ===================================================

  return (

    <View
      style={
        styles.screen
      }
    >

      <StatusBar
        backgroundColor="#4F46E5"
        barStyle="light-content"
      />


      {/* =============================================
          HEADER
      ============================================= */}

      <LinearGradient

        colors={[
          "#4F46E5",
          "#6D28D9",
          "#7C3AED",
        ]}

        start={{
          x: 0,
          y: 0,
        }}

        end={{
          x: 1,
          y: 1,
        }}

        style={
          styles.header
        }

      >

        {/* HEADER TOP */}

        <View
          style={
            styles.headerTop
          }
        >

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.back()
            }
            style={
              styles.headerIcon
            }
          >

            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color="#fff"
            />

          </TouchableOpacity>


          <View
            style={
              styles.headerTitleArea
            }
          >

            <Text
              style={
                styles.headerTitle
              }
            >
              Invoices
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              All billing records
            </Text>

          </View>


          <TouchableOpacity

            activeOpacity={0.8}

            onPress={
              generatePDF
            }

            style={
              styles.pdfButton
            }

          >

            <MaterialCommunityIcons
              name="file-pdf-box"
              size={25}
              color="#fff"
            />

          </TouchableOpacity>

        </View>


        {/* =========================================
            SUMMARY
        ========================================= */}

        <View
          style={
            styles.summaryRow
          }
        >

          {/* INVOICES */}

          <View
            style={
              styles.summaryCard
            }
          >

            <View
              style={
                styles.summaryIcon
              }
            >

              <MaterialCommunityIcons
                name="receipt"
                size={18}
                color="#fff"
              />

            </View>

            <View>

              <Text
                style={
                  styles.summaryLabel
                }
              >
                Invoices
              </Text>

              <Text
                style={
                  styles.summaryValue
                }
              >
                {summary.totalInvoices}
              </Text>

            </View>

          </View>


          {/* SALES */}

          <View
            style={
              styles.summaryCard
            }
          >

            <View
              style={[
                styles.summaryIcon,
                {
                  backgroundColor:
                    "rgba(34,197,94,0.22)",
                },
              ]}
            >

              <MaterialCommunityIcons
                name="cash-multiple"
                size={18}
                color="#fff"
              />

            </View>

            <View>

              <Text
                style={
                  styles.summaryLabel
                }
              >
                Total Sales
              </Text>

              <Text
                style={
                  styles.summaryValue
                }
              >
                {formatAmount(
                  summary.totalSales
                )}
              </Text>

            </View>

          </View>

        </View>


        {/* =========================================
            SEARCH
        ========================================= */}

        <View
          style={
            styles.searchBox
          }
        >

          <View
            style={
              styles.searchIcon
            }
          >

            <MaterialCommunityIcons
              name="magnify"
              size={22}
              color="#fff"
            />

          </View>


          <TextInput

            placeholder="Search customer, invoice..."

            placeholderTextColor=
              "rgba(255,255,255,0.55)"

            value={
              search
            }

            onChangeText={
              handleSearch
            }

            style={
              styles.searchInput
            }

            autoCorrect={false}

            returnKeyType="search"

          />


          {search.length > 0 ? (

            <TouchableOpacity
              onPress={
                clearSearch
              }
              style={
                styles.searchClear
              }
            >

              <MaterialCommunityIcons
                name="close"
                size={19}
                color="#fff"
              />

            </TouchableOpacity>

          ) : (

            <View
              style={
                styles.searchCount
              }
            >

              <Text
                style={
                  styles.searchCountText
                }
              >
                {filtered.length}
              </Text>

            </View>

          )}

        </View>

      </LinearGradient>


      {/* =============================================
          LIST
      ============================================= */}

      <FlatList

        data={
          filtered
        }

        keyExtractor={(
          item
        ) =>
          String(
            item.id
          )
        }

        renderItem={
          renderItem
        }

        ListEmptyComponent={
          renderEmpty
        }

        contentContainerStyle={
          styles.listContainer
        }

        showsVerticalScrollIndicator={
          false
        }

        refreshControl={

          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              onRefresh
            }
            tintColor="#4F46E5"
            colors={[
              "#4F46E5",
            ]}
          />

        }

        keyboardShouldPersistTaps="handled"

      />


      {/* =============================================
          FLOATING ADD BUTTON
      ============================================= */}

      <TouchableOpacity

        activeOpacity={0.9}

        onPress={() =>
          router.push(
            "/src/screens/BillingScreen"
          )
        }

        style={
          styles.fab
        }

      >

        <LinearGradient

          colors={[
            "#2563EB",
            "#4F46E5",
            "#7C3AED",
          ]}

          start={{
            x: 0,
            y: 0,
          }}

          end={{
            x: 1,
            y: 1,
          }}

          style={
            styles.fabGradient
          }

        >

          <MaterialCommunityIcons
            name="plus"
            size={30}
            color="#fff"
          />

        </LinearGradient>

      </TouchableOpacity>

    </View>

  );

}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  // ===================================================
  // SCREEN
  // ===================================================

  screen: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },


  // ===================================================
  // HEADER
  // ===================================================

  header: {
    paddingTop: 30,
    paddingHorizontal: 18,
    paddingBottom: 20,

    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.18,
    shadowRadius: 10,

    elevation: 9,
  },


  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },


  headerIcon: {
    width: 44,
    height: 44,

    borderRadius: 15,

    backgroundColor:
      "rgba(255,255,255,0.13)",

    justifyContent: "center",
    alignItems: "center",
  },


  headerTitleArea: {
    flex: 1,
    marginLeft: 13,
  },


  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.3,
  },


  headerSubtitle: {
    marginTop: 2,
    color:
      "rgba(255,255,255,0.68)",
    fontSize: 12,
    fontWeight: "600",
  },


  pdfButton: {
    width: 44,
    height: 44,

    borderRadius: 15,

    backgroundColor:
      "rgba(255,255,255,0.14)",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.12)",
  },


  // ===================================================
  // SUMMARY
  // ===================================================

  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },


  summaryCard: {
    flex: 1,

    minHeight: 65,

    borderRadius: 18,

    backgroundColor:
      "rgba(255,255,255,0.12)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.10)",

    paddingHorizontal: 12,

    flexDirection: "row",

    alignItems: "center",
  },


  summaryIcon: {
    width: 38,
    height: 38,

    borderRadius: 13,

    backgroundColor:
      "rgba(255,255,255,0.17)",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 9,
  },


  summaryLabel: {
    color:
      "rgba(255,255,255,0.65)",

    fontSize: 10,

    fontWeight: "700",

    textTransform: "uppercase",
  },


  summaryValue: {
    color: "#fff",

    fontSize: 16,

    fontWeight: "800",

    marginTop: 2,
  },


  // ===================================================
  // SEARCH
  // ===================================================

  searchBox: {
    height: 54,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.13)",

    borderRadius: 19,

    paddingHorizontal: 10,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.10)",
  },


  searchIcon: {
    width: 38,
    height: 38,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.10)",
  },


  searchInput: {
    flex: 1,

    height: 54,

    marginLeft: 9,

    color: "#fff",

    fontSize: 14,

    fontWeight: "600",
  },


  searchClear: {
    width: 35,
    height: 35,

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.12)",
  },


  searchCount: {
    minWidth: 32,
    height: 30,

    paddingHorizontal: 8,

    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.14)",
  },


  searchCountText: {
    color: "#fff",

    fontSize: 12,

    fontWeight: "800",
  },


  // ===================================================
  // LIST
  // ===================================================

  listContainer: {
    paddingHorizontal: 15,

    paddingTop: 16,

    paddingBottom: 110,

    flexGrow: 1,
  },


  // ===================================================
  // INVOICE CARD
  // ===================================================

  invoiceCard: {
    backgroundColor:
      COLORS.card,

    borderRadius: 24,

    padding: 16,

    marginBottom: 14,

    borderWidth: 1,

    borderColor:
      "#EEF2F7",

    shadowColor: "#0F172A",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.06,

    shadowRadius: 10,

    elevation: 3,
  },


  topRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },


  invoiceInfo: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },


  invoiceIcon: {
    width: 48,
    height: 48,

    borderRadius: 16,

    backgroundColor:
      "#EEF2FF",

    justifyContent: "center",
    alignItems: "center",
  },


  invoiceTitleArea: {
    marginLeft: 11,
  },


  invoiceLabel: {
    color: COLORS.muted,

    fontSize: 10,

    fontWeight: "800",

    letterSpacing: 1,
  },


  invoiceNumber: {
    color: COLORS.text,

    fontSize: 18,

    fontWeight: "800",

    marginTop: 2,
  },


  amountBadge: {
    minWidth: 100,

    paddingHorizontal: 13,

    paddingVertical: 10,

    borderRadius: 16,

    alignItems: "center",

    justifyContent: "center",
  },


  amountText: {
    color: "#fff",

    fontSize: 15,

    fontWeight: "800",
  },


  divider: {
    height: 1,

    backgroundColor:
      "#F1F5F9",

    marginVertical: 15,
  },


  // ===================================================
  // CUSTOMER
  // ===================================================

  customerRow: {
    flexDirection: "row",

    alignItems: "center",
  },


  avatar: {
    width: 48,
    height: 48,

    borderRadius: 17,

    justifyContent: "center",
    alignItems: "center",
  },


  avatarText: {
    color: "#4F46E5",

    fontSize: 19,

    fontWeight: "800",
  },


  customerInfo: {
    flex: 1,

    marginLeft: 11,

    minWidth: 0,
  },


  customerName: {
    color: COLORS.text,

    fontSize: 15,

    fontWeight: "750",
  },


  customerMeta: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 5,
  },


  metaText: {
    color: COLORS.secondary,

    fontSize: 11,

    marginLeft: 4,
  },


  dot: {
    width: 3,
    height: 3,

    borderRadius: 2,

    backgroundColor:
      "#CBD5E1",

    marginHorizontal: 7,
  },


  paidBadge: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 9,

    paddingVertical: 6,

    borderRadius: 12,

    backgroundColor:
      COLORS.successLight,
  },


  paidText: {
    color:
      COLORS.success,

    fontSize: 10,

    fontWeight: "800",

    marginLeft: 4,
  },


  // ===================================================
  // DETAILS
  // ===================================================

  detailsRow: {
    flexDirection: "row",

    backgroundColor:
      "#F8FAFC",

    borderRadius: 15,

    marginTop: 15,

    paddingVertical: 11,

    paddingHorizontal: 8,
  },


  detailItem: {
    flex: 1,

    alignItems: "center",

    borderRightWidth: 1,

    borderRightColor:
      "#E2E8F0",
  },


  detailLabel: {
    color: COLORS.muted,

    fontSize: 8,

    fontWeight: "800",

    letterSpacing: 0.6,
  },


  detailValue: {
    color: COLORS.text,

    fontSize: 11,

    fontWeight: "800",

    marginTop: 4,
  },


  pointsValue: {
    color:
      COLORS.success,

    fontSize: 11,

    fontWeight: "800",

    marginTop: 4,
  },


  // ===================================================
  // ACTIONS
  // ===================================================

  actionRow: {
    flexDirection: "row",

    justifyContent: "flex-end",

    marginTop: 13,

    gap: 8,
  },


  actionButton: {
    height: 38,

    paddingHorizontal: 12,

    borderRadius: 12,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",
  },


  editButton: {
    backgroundColor:
      COLORS.blueLight,
  },


  deleteButton: {
    backgroundColor:
      COLORS.dangerLight,
  },


  editText: {
    color: COLORS.blue,

    fontSize: 12,

    fontWeight: "800",

    marginLeft: 5,
  },


  deleteText: {
    color: COLORS.danger,

    fontSize: 12,

    fontWeight: "800",

    marginLeft: 5,
  },


  // ===================================================
  // EMPTY
  // ===================================================

  emptyContainer: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 30,

    paddingTop: 70,
  },


  emptyIcon: {
    width: 82,
    height: 82,

    borderRadius: 28,

    backgroundColor:
      "#EEF2F7",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 15,
  },


  emptyTitle: {
    color: COLORS.text,

    fontSize: 18,

    fontWeight: "800",
  },


  emptySubtitle: {
    color: COLORS.secondary,

    fontSize: 13,

    textAlign: "center",

    marginTop: 7,

    lineHeight: 20,
  },


  clearSearchButton: {
    marginTop: 18,

    backgroundColor:
      COLORS.primary,

    paddingHorizontal: 18,

    paddingVertical: 10,

    borderRadius: 12,
  },


  clearSearchText: {
    color: "#fff",

    fontSize: 12,

    fontWeight: "800",
  },


  // ===================================================
  // FAB
  // ===================================================

  fab: {
    position: "absolute",

    right: 22,

    bottom: 28,

    width: 60,
    height: 60,

    borderRadius: 22,

    overflow: "hidden",

    shadowColor:
      COLORS.primary,

    shadowOffset: {
      width: 0,
      height: 7,
    },

    shadowOpacity: 0.28,

    shadowRadius: 10,

    elevation: 10,
  },


  fabGradient: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",
  },

});

