import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  router,
  useFocusEffect,
} from "expo-router";
import MaterialCommunityIcons from
  "@expo/vector-icons/MaterialCommunityIcons";

import { getDB } from "../database/sqlite";
import { getNewInvoices } from "../database/sqlite";

type Invoice = {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  customerName: string;
  customerMobile: string;
  paymentMode: string;
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: string;
  createdAt: string;
};

const ViewNewBilling = () => {

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  // =====================================================
  // LOAD INVOICES
  // =====================================================

  const loadInvoices = async () => {
    try {

      setLoading(true);

      const database =
        await getDB();

      if (!database) {
        throw new Error(
          "Database unavailable"
        );
      }

      console.log(
        "🗄️ VIEW BILLING DATABASE READY"
      );

      const result =
        await getNewInvoices(
          database
        );

      console.log(
        "📋 VIEW NEW BILLING:",
        result
      );

      setInvoices(
        Array.isArray(result)
          ? result
          : []
      );

    } catch (error: any) {

      console.log(
        "❌ LOAD INVOICES ERROR:",
        error
      );

      Alert.alert(
        "Database Error",
        String(
          error?.message ||
          error
        )
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // SCREEN FOCUS
  // =====================================================

  useFocusEffect(
    useCallback(() => {

      loadInvoices();

    }, [])
  );

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    try {

      setRefreshing(true);

      const database =
        await getDB();

      if (!database) {
        throw new Error(
          "Database unavailable"
        );
      }

      const result =
        await getNewInvoices(
          database
        );

      setInvoices(
        Array.isArray(result)
          ? result
          : []
      );

    } catch (error) {

      console.log(
        "❌ REFRESH ERROR:",
        error
      );

    } finally {

      setRefreshing(false);

    }
  };

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const money = (
    value: number
  ) => {

    return `₹${Number(
      value || 0
    ).toFixed(2)}`;

  };

  // =====================================================
  // OPEN INVOICE
  // =====================================================

  const openInvoice = (
    invoice: Invoice
  ) => {

    if (!invoice?.id) {

      Alert.alert(
        "Invoice Error",
        "Invoice ID is missing."
      );

      return;
    }

    console.log(
      "🧾 OPENING INVOICE:",
      invoice.id
    );

    router.push({
      pathname:
        "/src/screens/ViewNewBilling",
      params: {
        invoiceId:
          String(invoice.id),
      },
    });
  };

  // =====================================================
  // RENDER INVOICE
  // =====================================================

  const renderInvoice = ({
    item,
  }: {
    item: Invoice;
  }) => {

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.invoiceCard}
        onPress={() =>
          openInvoice(item)
        }
      >

        {/* HEADER */}
        <View
          style={styles.invoiceHeader}
        >

          <View
            style={styles.invoiceNumberRow}
          >

            <View
              style={styles.receiptIcon}
            >
              <MaterialCommunityIcons
                name="receipt-text-outline"
                size={21}
                color="#4F46E5"
              />
            </View>

            <View>

              <Text
                style={
                  styles.invoiceNumber
                }
              >
                Invoice #
                {item.invoiceNo}
              </Text>

              <Text
                style={styles.invoiceDate}
              >
                {item.invoiceDate ||
                  item.createdAt ||
                  ""}
              </Text>

            </View>

          </View>

          <View
            style={[
              styles.statusBadge,
              item.status === "PAID"
                ? styles.paidBadge
                : styles.unpaidBadge,
            ]}
          >

            <Text
              style={[
                styles.statusText,
                item.status === "PAID"
                  ? styles.paidText
                  : styles.unpaidText,
              ]}
            >
              {item.status ||
                "PAID"}
            </Text>

          </View>

        </View>

        {/* CUSTOMER */}
        <View
          style={styles.customerSection}
        >

          <View
            style={styles.customerIcon}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={19}
              color="#64748B"
            />
          </View>

          <View
            style={
              styles.customerDetails
            }
          >

            <Text
              style={
                styles.customerName
              }
              numberOfLines={1}
            >
              {item.customerName ||
                "Walk-in Customer"}
            </Text>

            {!!item.customerMobile && (
              <Text
                style={
                  styles.customerMobile
                }
              >
                {item.customerMobile}
              </Text>
            )}

          </View>

        </View>

        {/* DIVIDER */}
        <View
          style={styles.divider}
        />

        {/* BOTTOM DETAILS */}
        <View
          style={styles.invoiceBottom}
        >

          <View>

            <Text
              style={styles.paymentLabel}
            >
              Payment
            </Text>

            <Text
              style={styles.paymentValue}
            >
              {item.paymentMode ||
                "Cash"}
            </Text>

          </View>

          <View
            style={styles.totalContainer}
          >

            <Text
              style={styles.totalLabel}
            >
              Total
            </Text>

            <Text
              style={styles.totalAmount}
            >
              {money(
                item.totalAmount
              )}
            </Text>

          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={25}
            color="#94A3B8"
          />

        </View>

      </TouchableOpacity>
    );
  };

  // =====================================================
  // EMPTY
  // =====================================================

  const renderEmpty = () => {

    if (loading) {
      return null;
    }

    return (
      <View
        style={styles.emptyContainer}
      >

        <View
          style={styles.emptyIcon}
        >
          <MaterialCommunityIcons
            name="receipt-text-outline"
            size={45}
            color="#94A3B8"
          />
        </View>

        <Text
          style={styles.emptyTitle}
        >
          No Invoices Yet
        </Text>

        <Text
          style={styles.emptyText}
        >
          Your saved invoices will
          appear here.
        </Text>

      </View>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <SafeAreaView
        style={styles.container}
      >

        <View
          style={styles.loadingContainer}
        >

          <ActivityIndicator
            size="large"
            color="#4F46E5"
          />

          <Text
            style={styles.loadingText}
          >
            Loading invoices...
          </Text>

        </View>

      </SafeAreaView>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <SafeAreaView
      style={styles.container}
    >

      {/* HEADER */}
      <View
        style={styles.header}
      >

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >

          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#0F172A"
          />

        </TouchableOpacity>

        <View
          style={styles.headerText}
        >

          <Text
            style={styles.headerTitle}
          >
            View Billing
          </Text>

          <Text
            style={styles.headerSubtitle}
          >
            {invoices.length} invoice
            {invoices.length !== 1
              ? "s"
              : ""}
          </Text>

        </View>

      </View>

      {/* LIST */}
      <FlatList
        data={invoices}
        keyExtractor={item =>
          String(item.id)
        }
        renderItem={
          renderInvoice
        }
        ListEmptyComponent={
          renderEmpty
        }
        contentContainerStyle={
          invoices.length === 0
            ? styles.emptyList
            : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
            tintColor="#4F46E5"
          />
        }
        showsVerticalScrollIndicator={
          false
      }
      />

    </SafeAreaView>
  );
};

export default ViewNewBilling;

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },

  headerText: {
    marginLeft: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#64748B",
  },

  listContent: {
    padding: 14,
    paddingBottom: 30,
  },

  invoiceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  invoiceNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  receiptIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    marginRight: 11,
  },

  invoiceNumber: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },

  invoiceDate: {
    marginTop: 3,
    fontSize: 12,
    color: "#64748B",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  paidBadge: {
    backgroundColor: "#DCFCE7",
  },

  unpaidBadge: {
    backgroundColor: "#FEF3C7",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  paidText: {
    color: "#15803D",
  },

  unpaidText: {
    color: "#B45309",
  },

  customerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  customerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  customerDetails: {
    flex: 1,
    marginLeft: 10,
  },

  customerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },

  customerMobile: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 14,
  },

  invoiceBottom: {
    flexDirection: "row",
    alignItems: "center",
  },

  paymentLabel: {
    fontSize: 11,
    color: "#94A3B8",
  },

  paymentValue: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },

  totalContainer: {
    marginLeft: "auto",
    marginRight: 8,
    alignItems: "flex-end",
  },

  totalLabel: {
    fontSize: 11,
    color: "#94A3B8",
  },

  totalAmount: {
    marginTop: 2,
    fontSize: 17,
    fontWeight: "900",
    color: "#4F46E5",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
  },

  emptyText: {
    marginTop: 7,
    textAlign: "center",
    fontSize: 14,
    color: "#64748B",
  },

});