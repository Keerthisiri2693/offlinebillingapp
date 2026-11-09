import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Button, Card, Menu, TextInput } from "react-native-paper";

import { router, useLocalSearchParams } from "expo-router";

import { MaterialCommunityIcons } from "@expo/vector-icons";


import { LinearGradient } from "expo-linear-gradient";

import { useNavigation } from "@react-navigation/native";

import { saveLedger, updateLedger } from "../database/sqlite";

import styles from "../style/LedgerMasterStyle";

const LedgerMaster = () => {
  const navigation: any = useNavigation();

  const { item } = useLocalSearchParams();

  const editItem = item ? JSON.parse(item as string) : null;

  const [categoryMenu, setCategoryMenu] = useState(false);

  const [categoryType, setCategoryType] = useState("Customer");

  const [showMore, setShowMore] = useState(false);

  const [groupMenuVisible, setGroupMenuVisible] = useState(false);

  const [showDobPicker, setShowDobPicker] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState("PARTY-SUNDRY CREDITOR");

  const taxTypes = ["SINGLE TAX", "DOUBLE TAX"];

  const accountGroups = [
    "CASH ON HAND",

    "CASH AT BANK",

    "PARTY-SUNDRY CREDITOR",

    "CUSTOMER-SUNDRY DEBITOR",

    "DIRECT EXPENSES",

    "INDIRECT EXPENSES",

    "DIRECT INCOME",

    "INDIRECT INCOME",

    "DEPOSIT",
  ];

  const [nextMemberId, setNextMemberId] = useState(1);

  const [accountTypeMenuVisible, setAccountTypeMenuVisible] = useState(false);

  const accountTypes = ["DEBIT", "CREDIT"];

  useEffect(() => {
    const generateMemberId = () => {
      const random = Math.floor(1000 + Math.random() * 9000);

      const id = `MEM-${random}`;

      setForm((prev) => ({
        ...prev,

        memberId: id,
      }));
    };

    // GENERATE ONLY IF EMPTY

    if (!form.memberId) {
      generateMemberId();
    }
  }, []);

  // ✅ FORM STATE
  const [form, setForm] = useState({
    memberId: "",

    accountGroup: "CUSTOMER-SUNDRY DEBITOR",

    nameEnglish: "",

    nameTamil: "",

    creditPoints: "0",

    category: "NONE",

    accountType: "DEBIT",

    amount: "0",

    gst: "",

    Address: "",

    City: "",

    mobile: "",

    state: "",

    pincode: "",

    altMobile1: "",

    altMobile2: "",

    creditLimit: "0.0",

    creditDays: "10",

    officialEmail: "",

    personalEmail: "",

    pan: "",

    aadhar: "",

    taxType: "",

    businesssinceyear: "",

    dob: "",

    bloodGroup: "",
  });

  // ✅ AUTO FILL EDIT DATA
  useEffect(() => {
    if (editItem) {
      setCategoryType(editItem?.ledgerType || "Customer");

      setSelectedGroup(editItem?.accountGroup || "PARTY-SUNDRY CREDITOR");

      setForm({
        // ================= MEMBER =================

        memberId: editItem?.memberId ?? "",

        // ================= ACCOUNT =================

        accountGroup: editItem?.accountGroup ?? "",

        accountType: editItem?.accountType ?? "DEBIT",

        // ================= NAME =================

        nameEnglish: editItem?.nameEnglish ?? "",

        nameTamil: editItem?.nameTamil ?? "",

        // ================= CREDIT =================

        creditPoints: editItem?.creditPoints ?? "0",

        category: editItem?.category ?? "",

        amount: String(editItem?.amount ?? "0"),

        // ================= GST =================

        gst: editItem?.gst ?? "",

        taxType: editItem?.taxType ?? "",

        // ================= ADDRESS =================

        Address: editItem?.address ?? "",

        City: editItem?.city ?? "",

        state: editItem?.state ?? "",

        pincode: editItem?.pincode ?? "",

        // ================= CONTACT =================

        mobile: editItem?.mobile ?? "",

        altMobile1: editItem?.altMobile1 ?? "",

        altMobile2: editItem?.altMobile2 ?? "",

        officialEmail: editItem?.officialEmail ?? "",

        personalEmail: editItem?.personalEmail ?? "",

        // ================= BUSINESS =================

        businesssinceyear: editItem?.businesssinceyear ?? "",

        // ================= DOCUMENTS =================

        pan: editItem?.pan ?? "",

        aadhar: editItem?.aadhar ?? "",

        // ================= CREDIT DETAILS =================

        creditLimit: editItem?.creditLimit ?? "",

        creditDays: editItem?.creditDays ?? "",

        // ================= PERSONAL =================

        dob: editItem?.dob ?? "",

        bloodGroup: editItem?.bloodGroup ?? "",

        // ================= BALANCE =================

        openingBalance: String(editItem?.openingBalance ?? 0),

        balanceType: editItem?.balanceType ?? "",
      });
    }
  }, []);

  // ✅ HANDLE CHANGE
  const handleChange = (key: any, value: any) => {
    setForm({
      ...form,

      [key]: value,
    });
  };

  //translate

  const transliterateToTamil = async (text) => {
    try {
      const response = await fetch(
        `https://inputtools.google.com/request?text=${encodeURIComponent(
          text,
        )}&itc=ta-t-i0-und&num=1`,
      );

      const result = await response.json();

      if (result[0] === "SUCCESS") {
        return result[1][0][1][0];
      }

      return "";
    } catch (e) {
      console.log("Tamil Translation Error:", e);

      return "";
    }
  };

  // ✅ SAVE / UPDATE
  const handleSave = async () => {
    try {
      // =========================
      // VALIDATION
      // =========================

      if (!form.nameEnglish?.trim()) {
        alert("Ledger name is required");

        return;
      }

      if (!form.mobile?.trim()) {
        alert("Mobile number is required");

        return;
      }

      // =========================
      // AUTO MEMBER ID
      // =========================

      let memberId = "";

      if (editItem?.memberId) {
        memberId = editItem.memberId;
      } else {
        memberId = `MEM-${Date.now()}`;
      }

      // =========================
      // LEDGER DATA
      // =========================

      const ledgerData = {
        // ================= ID =================

        id: editItem?.id || form.memberId,

        // ================= MEMBER =================

        memberId: form.memberId,

        // ================= MEMBER =================

        // ================= TYPE =================

        ledgerType: categoryType || "",

        accountGroup: selectedGroup || "",

        accountType: form.accountType || "",

        // ================= NAME =================

        nameEnglish: form.nameEnglish || "",

        nameTamil: form.nameTamil || "",

        // ================= CREDIT =================

        creditPoints: form.creditPoints || "0",

        category: form.category || "",

        amount: Number(form.amount ?? 0),

        // ================= GST =================

        gst: form.gst || "",

        taxType: form.taxType || "",

        // ================= ADDRESS =================

        address: form.Address || "",

        city: form.City || "",

        state: form.state || "",

        pincode: form.pincode || "",

        // ================= CONTACT =================

        mobile: form.mobile || "",

        altMobile1: form.altMobile1 || "",

        altMobile2: form.altMobile2 || "",

        officialEmail: form.officialEmail || "",

        personalEmail: form.personalEmail || "",

        // ================= BUSINESS =================

        businesssinceyear: form.businesssinceyear || "",

        // ================= DOCUMENTS =================

        pan: form.pan || "",

        aadhar: form.aadhar || "",

        // ================= CREDIT DETAILS =================

        creditLimit: form.creditLimit || "",

        creditDays: form.creditDays || "",

        // ================= PERSONAL =================

        dob: form.dob || "",

        bloodGroup: form.bloodGroup || "",

        // ================= BALANCE =================

        openingBalance: Number(form.openingBalance ?? 0),

        balanceType: form.balanceType || "",

        // ================= DATE =================

        createdAt: editItem?.createdAt || new Date().toISOString(),
      };

      console.log("📦 LEDGER DATA:", ledgerData);

      // =========================
      // UPDATE
      // =========================

      if (editItem?.id) {
        const updated = await updateLedger(
          editItem.id,

          ledgerData,
        );

        if (!updated) {
          alert("Failed to update ledger");

          return;
        }

        alert("Ledger Updated Successfully");
      }

      // =========================
      // SAVE
      // =========================
      else {
        const saved = await saveLedger(ledgerData);

        if (!saved) {
          alert("Failed to save ledger");

          return;
        }

        alert("Ledger Saved Successfully");
      }

      // =========================
      // RESET FORM
      // =========================

      setForm({
        memberId: `MEM-${Date.now()}`,

        nameEnglish: "",

        nameTamil: "",

        mobile: "",

        email: "",

        gstin: "",

        state: "",

        city: "",

        address: "",

        openingBalance: "",

        balanceType: "",
      });

      // =========================
      // GO BACK
      // =========================

      navigation.goBack();
    } catch (error) {
      console.log("❌ handleSave error:", error);

      alert("Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#203a43" barStyle="light-content" />

      {/* HEADER */}

      <LinearGradient
        colors={["#7C3AED", "#6D28D9", "#8B5CF6"]}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 1,
          y: 1,
        }}
        style={{
          paddingTop: 52,
          paddingBottom: 22,
          paddingHorizontal: 18,

          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.18,
          shadowRadius: 10,

          elevation: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",

            justifyContent: "space-between",
          }}
        >
          {/* BACK BUTTON */}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
            style={{
              width: 46,
              height: 46,

              borderRadius: 16,

              backgroundColor: "rgba(255,255,255,0.12)",

              justifyContent: "center",

              alignItems: "center",

              borderWidth: 1,

              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          {/* TITLE */}

          <View
            style={{
              flex: 1,
              marginLeft: 16,
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.65)",

                fontSize: 12,

                fontWeight: "700",

                letterSpacing: 1,
              }}
            >
              BUSINESS ACCOUNT
            </Text>

            <Text
              style={{
                color: "#fff",

                fontSize: 24,

                fontWeight: "900",

                marginTop: 4,
              }}
            >
              Create Ledger
            </Text>
          </View>

          {/* view list BUTTON */}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/src/screens/CreateLedger")}
            style={{
              width: 46,
              height: 46,

              borderRadius: 16,

              backgroundColor: "rgba(255,255,255,0.14)",

              justifyContent: "center",

              alignItems: "center",

              borderWidth: 1,

              borderColor: "rgba(255,255,255,0.10)",

              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.18,
              shadowRadius: 8,

              elevation: 5,
            }}
          >
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* LEDGER TYPE */}

        <Menu
          visible={categoryMenu}
          onDismiss={() => setCategoryMenu(false)}
          anchor={
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setCategoryMenu(true)}
            >
              <View pointerEvents="none">
                <TextInput
                  label="Ledger Type"
                  mode="outlined"
                  value={categoryType}
                  editable={false}
                  style={{
                    backgroundColor: "#fff",

                    borderRadius: 22,
                  }}
                  contentStyle={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#111827",
                  }}
                  outlineStyle={{
                    borderRadius: 22,

                    borderWidth: 1.2,

                    borderColor: "#E2E8F0",
                  }}
                  left={<TextInput.Icon icon="shape-outline" color="#7C3AED" />}
                  right={<TextInput.Icon icon="chevron-down" color="#64748B" />}
                />
              </View>
            </TouchableOpacity>
          }
        >
          {/* CUSTOMER */}

          <Menu.Item
            title="Customer"
            leadingIcon="account-group-outline"
            titleStyle={{
              fontWeight: "700",
              color: "#111827",
            }}
            onPress={() => {
              setCategoryType("Customer");

              setCategoryMenu(false);
            }}
          />

          {/* PARTY */}

          <Menu.Item
            title="Party"
            leadingIcon="handshake-outline"
            titleStyle={{
              fontWeight: "700",
              color: "#111827",
            }}
            onPress={() => {
              setCategoryType("Party");

              setCategoryMenu(false);
            }}
          />

          {/* EXPENSE */}

          <Menu.Item
            title="Other Expense"
            leadingIcon="cash-minus"
            titleStyle={{
              fontWeight: "700",
              color: "#111827",
            }}
            onPress={() => {
              setCategoryType("Other Expense");

              setCategoryMenu(false);
            }}
          />
        </Menu>

        {/* BASIC DETAILS */}

        <Card style={styles.card}>
          <Card.Title title="Basic Details" />

          <Card.Content>
            {/* MEMBER ID INPUT */}

            <TextInput
              label="Member Id"
              mode="outlined"
              value={form.memberId}
              editable={false}
              style={{
                backgroundColor: "#FAFBFF",

                borderRadius: 4,

                marginBottom: 16,
              }}
              outlineStyle={{
                borderRadius: 4,

                borderWidth: 1.4,

                borderColor: "#E2E8F0",
              }}
              contentStyle={{
                fontSize: 15,

                fontWeight: "700",

                paddingVertical: 10,

                color: "#111827",
              }}
              theme={{
                colors: {
                  primary: "#7C3AED",

                  outline: "#E2E8F0",

                  placeholder: "#94A3B8",

                  text: "#111827",
                },
              }}
              left={
                <TextInput.Icon icon="account-badge-outline" color="#7C3AED" />
              }
              right={
                <TextInput.Icon icon="shield-check-outline" color="#10B981" />
              }
            />

            <Menu
              visible={groupMenuVisible}
              onDismiss={() => setGroupMenuVisible(false)}
              contentStyle={{
                width: 320,

                borderRadius: 24,

                backgroundColor: "#FFFFFF",

                paddingVertical: 6,

                shadowColor: "#000",

                shadowOffset: {
                  width: 0,
                  height: 6,
                },

                shadowOpacity: 0.08,

                shadowRadius: 10,

                elevation: 8,
              }}
              anchor={
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => setGroupMenuVisible(true)}
                >
                  <View pointerEvents="none">
                    <TextInput
                      label="Account Group"
                      value={selectedGroup}
                      editable={false}
                      mode="outlined"
                      style={{
                        backgroundColor: "#FAFBFF",

                        borderRadius: 24,

                        marginBottom: 16,
                      }}
                      outlineStyle={{
                        borderRadius: 24,

                        borderWidth: 1.4,

                        borderColor: "#E2E8F0",
                      }}
                      contentStyle={{
                        fontSize: 12,

                        fontWeight: "700",

                        paddingVertical: 10,

                        color: "#111827",
                      }}
                      theme={{
                        colors: {
                          primary: "#7C3AED",

                          outline: "#E2E8F0",

                          placeholder: "#94A3B8",
                        },
                      }}
                      left={
                        <TextInput.Icon icon="folder-outline" color="#7C3AED" />
                      }
                      right={
                        <TextInput.Icon icon="chevron-down" color="#64748B" />
                      }
                    />
                  </View>
                </TouchableOpacity>
              }
            >
              {accountGroups.map((item) => (
                <Menu.Item
                  key={item}
                  title={item}
                  leadingIcon="folder-outline"
                  titleStyle={{
                    fontSize: 15,

                    fontWeight: "700",

                    color: "#111827",
                  }}
                  style={{
                    borderRadius: 16,

                    marginHorizontal: 8,

                    marginVertical: 2,
                  }}
                  onPress={() => {
                    setSelectedGroup(item);

                    setGroupMenuVisible(false);
                  }}
                />
              ))}
            </Menu>

            {/* NAME IN ENGLISH */}
            <TextInput
              label="Name In English"
              mode="outlined"
              value={form.nameEnglish}
              onChangeText={(t) => {
                handleChange("nameEnglish", t);
              }}
              style={{
                backgroundColor: "#FAFBFF",

                borderRadius: 24,

                marginBottom: 16,
              }}
              outlineStyle={{
                borderRadius: 24,

                borderWidth: 1.4,

                borderColor: "#E2E8F0",
              }}
              contentStyle={{
                fontSize: 15,

                fontWeight: "700",

                paddingVertical: 10,

                color: "#111827",
              }}
              theme={{
                colors: {
                  primary: "#10B981",

                  outline: "#E2E8F0",

                  placeholder: "#94A3B8",
                },
              }}
            />

            {/* NAME IN TAMIL */}

            <TextInput
              label="Name In Tamil"
              mode="outlined"
              value={form.nameTamil}
              onChangeText={(t) => handleChange("nameTamil", t)}
              style={{
                backgroundColor: "#FAFBFF",

                borderRadius: 24,

                marginBottom: 16,
              }}
              outlineStyle={{
                borderRadius: 24,

                borderWidth: 1.4,

                borderColor: "#E2E8F0",
              }}
              contentStyle={{
                fontSize: 15,

                fontWeight: "700",

                paddingVertical: 10,

                color: "#111827",
              }}
              theme={{
                colors: {
                  primary: "#10B981",

                  outline: "#E2E8F0",

                  placeholder: "#94A3B8",
                },
              }}
              left={<TextInput.Icon icon="translate" color="#10B981" />}
            />

            {/* CREDIT + CATEGORY */}

            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",
              }}
            >
              {/* CREDIT POINTS */}

              <TextInput
                label="Credit Points"
                mode="outlined"
                value={form.creditPoints}
                keyboardType="numeric"
                style={{
                  flex: 1,

                  backgroundColor: "#FAFBFF",

                  borderRadius: 24,

                  marginRight: 8,

                  marginBottom: 16,
                }}
                outlineStyle={{
                  borderRadius: 24,

                  borderWidth: 1.4,

                  borderColor: "#E2E8F0",
                }}
                contentStyle={{
                  fontSize: 15,

                  fontWeight: "700",

                  paddingVertical: 10,

                  color: "#111827",
                }}
                theme={{
                  colors: {
                    primary: "#F59E0B",

                    outline: "#E2E8F0",

                    placeholder: "#94A3B8",
                  },
                }}
                left={<TextInput.Icon icon="star-outline" color="#F59E0B" />}
              />

              {/* CATEGORY */}

              <TextInput
                label="Category"
                mode="outlined"
                value={form.category}
                style={{
                  flex: 1,

                  backgroundColor: "#FAFBFF",

                  borderRadius: 24,

                  marginLeft: 8,

                  marginBottom: 16,
                }}
                outlineStyle={{
                  borderRadius: 24,

                  borderWidth: 1.4,

                  borderColor: "#E2E8F0",
                }}
                contentStyle={{
                  fontSize: 15,

                  fontWeight: "700",

                  paddingVertical: 10,

                  color: "#111827",
                }}
                theme={{
                  colors: {
                    primary: "#EC4899",

                    outline: "#E2E8F0",

                    placeholder: "#94A3B8",
                  },
                }}
                left={<TextInput.Icon icon="shape-outline" color="#EC4899" />}
              />
            </View>

            <Menu
              visible={accountTypeMenuVisible}
              onDismiss={() => setAccountTypeMenuVisible(false)}
              contentStyle={{
                width: 260,

                borderRadius: 24,

                backgroundColor: "#FFFFFF",

                paddingVertical: 6,

                shadowColor: "#000",

                shadowOffset: {
                  width: 0,
                  height: 6,
                },

                shadowOpacity: 0.08,

                shadowRadius: 10,

                elevation: 8,
              }}
              anchor={
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => setAccountTypeMenuVisible(true)}
                >
                  <View pointerEvents="none">
                    <TextInput
                      label="Account Type"
                      value={form.accountType}
                      editable={false}
                      mode="outlined"
                      style={{
                        backgroundColor: "#FAFBFF",

                        borderRadius: 24,

                        marginBottom: 16,
                      }}
                      outlineStyle={{
                        borderRadius: 24,

                        borderWidth: 1.4,

                        borderColor: "#E2E8F0",
                      }}
                      contentStyle={{
                        fontSize: 15,

                        fontWeight: "700",

                        paddingVertical: 10,

                        color: "#111827",
                      }}
                      theme={{
                        colors: {
                          primary: "#0EA5E9",

                          outline: "#E2E8F0",

                          placeholder: "#94A3B8",
                        },
                      }}
                      left={
                        <TextInput.Icon icon="wallet-outline" color="#0EA5E9" />
                      }
                      right={
                        <TextInput.Icon icon="chevron-down" color="#64748B" />
                      }
                    />
                  </View>
                </TouchableOpacity>
              }
            >
              {accountTypes.map((item) => (
                <Menu.Item
                  key={item}
                  title={item}
                  leadingIcon={
                    item === "Credit"
                      ? "credit-card-outline"
                      : item === "Debit"
                        ? "cash-minus"
                        : "wallet-outline"
                  }
                  titleStyle={{
                    fontSize: 15,

                    fontWeight: "700",

                    color: "#111827",
                  }}
                  style={{
                    borderRadius: 16,

                    marginHorizontal: 8,

                    marginVertical: 2,
                  }}
                  onPress={() => {
                    setForm({
                      ...form,

                      accountType: item,
                    });

                    setAccountTypeMenuVisible(false);
                  }}
                />
              ))}
            </Menu>

            {/* AMOUNT */}

            <TextInput
              label="Amount"
              mode="outlined"
              value={form.amount}
              onChangeText={(t) => handleChange("amount", t)}
              keyboardType="numeric"
              style={{
                backgroundColor: "#FAFBFF",

                borderRadius: 24,

                marginBottom: 16,
              }}
              outlineStyle={{
                borderRadius: 24,

                borderWidth: 1.4,

                borderColor: "#E2E8F0",
              }}
              contentStyle={{
                fontSize: 15,

                fontWeight: "700",

                paddingVertical: 10,

                color: "#111827",
              }}
              theme={{
                colors: {
                  primary: "#16A34A",

                  outline: "#E2E8F0",

                  placeholder: "#94A3B8",
                },
              }}
              left={<TextInput.Icon icon="currency-inr" color="#16A34A" />}
            />

            {/* GST NUMBER */}

            <TextInput
              label="GST Number"
              mode="outlined"
              value={form.gst}
              onChangeText={(t) => handleChange("gst", t)}
              style={{
                backgroundColor: "#FAFBFF",

                borderRadius: 24,

                marginBottom: 16,
              }}
              outlineStyle={{
                borderRadius: 24,

                borderWidth: 1.4,

                borderColor: "#E2E8F0",
              }}
              contentStyle={{
                fontSize: 15,

                fontWeight: "700",

                paddingVertical: 10,

                color: "#111827",
              }}
              theme={{
                colors: {
                  primary: "#F97316",

                  outline: "#E2E8F0",

                  placeholder: "#94A3B8",
                },
              }}
              left={
                <TextInput.Icon
                  icon="file-certificate-outline"
                  color="#F97316"
                />
              }
            />

            {/* ADDRESS */}

            <TextInput
              label="Address"
              mode="outlined"
              multiline
              numberOfLines={4}
              value={form.Address}
              onChangeText={(t) => handleChange("Address", t)}
              style={{
                backgroundColor: "#FAFBFF",

                borderRadius: 24,

                marginBottom: 16,
              }}
              outlineStyle={{
                borderRadius: 24,

                borderWidth: 1.4,

                borderColor: "#E2E8F0",
              }}
              contentStyle={{
                fontSize: 15,

                fontWeight: "700",

                minHeight: 100,

                color: "#111827",

                paddingTop: 14,
              }}
              theme={{
                colors: {
                  primary: "#6366F1",

                  outline: "#E2E8F0",

                  placeholder: "#94A3B8",
                },
              }}
              left={
                <TextInput.Icon icon="map-marker-outline" color="#6366F1" />
              }
            />

            {/* CITY + STATE */}

            {/* CITY */}

            <TextInput
              label="City"
              mode="outlined"
              value={form.City}
              onChangeText={(t) => handleChange("City", t)}
              style={{
                flex: 1,

                backgroundColor: "#FAFBFF",

                borderRadius: 24,

                marginRight: 8,

                marginBottom: 16,
              }}
              outlineStyle={{
                borderRadius: 24,

                borderWidth: 1.4,

                borderColor: "#E2E8F0",
              }}
              contentStyle={{
                fontSize: 15,

                fontWeight: "700",

                paddingVertical: 10,

                color: "#111827",
              }}
              left={
                <TextInput.Icon icon="city-variant-outline" color="#0EA5E9" />
              }
            />

            {/* STATE */}

            <TextInput
              label="State"
              mode="outlined"
              value={form.state}
              onChangeText={(t) => handleChange("state", t)}
              style={{
                flex: 1,

                backgroundColor: "#FAFBFF",

                borderRadius: 24,

                marginLeft: 8,

                marginBottom: 16,
              }}
              outlineStyle={{
                borderRadius: 24,

                borderWidth: 1.4,

                borderColor: "#E2E8F0",
              }}
              contentStyle={{
                fontSize: 15,

                fontWeight: "700",

                paddingVertical: 10,

                color: "#111827",
              }}
              left={<TextInput.Icon icon="map-outline" color="#8B5CF6" />}
            />

            {/* MOBILE + PINCODE */}

            {/* MOBILE */}

            <TextInput
              label="Mobile Number"
              mode="outlined"
              keyboardType="phone-pad"
              value={form.mobile}
              onChangeText={(t) => handleChange("mobile", t)}
              style={{
                flex: 1,

                backgroundColor: "#FAFBFF",

                borderRadius: 24,

                marginRight: 8,

                marginBottom: 16,
              }}
              outlineStyle={{
                borderRadius: 24,

                borderWidth: 1.4,

                borderColor: "#E2E8F0",
              }}
              contentStyle={{
                fontSize: 15,

                fontWeight: "700",

                paddingVertical: 10,

                color: "#111827",
              }}
              left={<TextInput.Icon icon="phone-outline" color="#10B981" />}
            />

            {/* PINCODE */}

            <TextInput
              label="Pincode"
              mode="outlined"
              keyboardType="numeric"
              value={form.pincode}
              onChangeText={(t) => handleChange("pincode", t)}
              style={{
                flex: 1,

                backgroundColor: "#FAFBFF",

                borderRadius: 24,

                marginLeft: 8,

                marginBottom: 16,
              }}
              outlineStyle={{
                borderRadius: 24,

                borderWidth: 1.4,

                borderColor: "#E2E8F0",
              }}
              contentStyle={{
                fontSize: 15,

                fontWeight: "700",

                paddingVertical: 10,

                color: "#111827",
              }}
              left={
                <TextInput.Icon
                  icon="map-marker-radius-outline"
                  color="#EF4444"
                />
              }
            />

            {/* MORE BUTTON */}

            {/* SHOW / HIDE BUTTON */}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowMore(!showMore)}
              style={{
                marginTop: 12,

                marginBottom: 16,

                backgroundColor: showMore ? "#EEF2FF" : "#F8FAFC",

                borderRadius: 26,

                paddingVertical: 16,

                paddingHorizontal: 18,

                flexDirection: "row",

                alignItems: "center",

                justifyContent: "space-between",

                borderWidth: 1.2,

                borderColor: showMore ? "#C7D2FE" : "#E2E8F0",

                shadowColor: "#000",

                shadowOffset: {
                  width: 0,
                  height: 4,
                },

                shadowOpacity: 0.05,

                shadowRadius: 8,

                elevation: 3,
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
                    width: 42,
                    height: 42,

                    borderRadius: 15,

                    backgroundColor: showMore ? "#6366F1" : "#E2E8F0",

                    justifyContent: "center",

                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name={showMore ? "minus" : "plus"}
                    size={22}
                    color={showMore ? "#fff" : "#475569"}
                  />
                </View>

                <View
                  style={{
                    marginLeft: 14,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,

                      fontWeight: "800",

                      color: "#0F172A",
                    }}
                  >
                    {showMore ? "Hide Extra Details" : "Add More Details"}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,

                      color: "#64748B",

                      marginTop: 2,
                    }}
                  >
                    {showMore
                      ? "Collapse additional fields"
                      : "Expand more information"}
                  </Text>
                </View>
              </View>

              <MaterialCommunityIcons
                name={showMore ? "chevron-up" : "chevron-down"}
                size={24}
                color="#64748B"
              />
            </TouchableOpacity>

            {/* SHOW / HIDE CONTENT */}

            {showMore && (
              <View>
                {/* CREDIT */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",

                    marginTop: 20,
                  }}
                >
                  {/* CREDIT LIMIT */}

                  <TextInput
                    label="Credit Limit"
                    mode="outlined"
                    value={form.creditLimit}
                    onChangeText={(t) => handleChange("creditLimit", t)}
                    keyboardType="numeric"
                    style={{
                      flex: 1,

                      backgroundColor: "#FAFBFF",

                      borderRadius: 24,

                      marginRight: 8,

                      marginBottom: 16,
                    }}
                    outlineStyle={{
                      borderRadius: 24,

                      borderWidth: 1.4,

                      borderColor: "#E2E8F0",
                    }}
                    contentStyle={{
                      fontSize: 15,

                      fontWeight: "700",

                      paddingVertical: 10,

                      color: "#111827",
                    }}
                    theme={{
                      colors: {
                        primary: "#F59E0B",

                        outline: "#E2E8F0",

                        placeholder: "#94A3B8",
                      },
                    }}
                    left={
                      <TextInput.Icon icon="currency-inr" color="#F59E0B" />
                    }
                  />

                  {/* CREDIT DAYS */}

                  <TextInput
                    label="Credit Days"
                    mode="outlined"
                    value={form.creditDays}
                    onChangeText={(t) => handleChange("creditDays", t)}
                    keyboardType="numeric"
                    style={{
                      flex: 1,

                      backgroundColor: "#FAFBFF",

                      borderRadius: 24,

                      marginLeft: 8,

                      marginBottom: 16,
                    }}
                    outlineStyle={{
                      borderRadius: 24,

                      borderWidth: 1.4,

                      borderColor: "#E2E8F0",
                    }}
                    contentStyle={{
                      fontSize: 15,

                      fontWeight: "700",

                      paddingVertical: 10,

                      color: "#111827",
                    }}
                    theme={{
                      colors: {
                        primary: "#8B5CF6",

                        outline: "#E2E8F0",

                        placeholder: "#94A3B8",
                      },
                    }}
                    left={
                      <TextInput.Icon icon="calendar-clock" color="#8B5CF6" />
                    }
                  />
                </View>

                {/* ALT MOBILE */}

                {/* ALTERNATIVE MOBILES */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  {/* MOBILE 1 */}

                  <TextInput
                    label="Alternative Mobile 1"
                    mode="outlined"
                    value={form.altMobile1}
                    onChangeText={(t) => handleChange("altMobile1", t)}
                    keyboardType="phone-pad"
                    style={{
                      flex: 1,

                      backgroundColor: "#FAFBFF",

                      borderRadius: 24,

                      marginRight: 8,

                      marginBottom: 16,
                    }}
                    outlineStyle={{
                      borderRadius: 24,

                      borderWidth: 1.4,

                      borderColor: "#E2E8F0",
                    }}
                    contentStyle={{
                      fontSize: 15,

                      fontWeight: "700",

                      paddingVertical: 10,

                      color: "#111827",
                    }}
                    theme={{
                      colors: {
                        primary: "#0EA5E9",

                        outline: "#E2E8F0",

                        placeholder: "#94A3B8",
                      },
                    }}
                    left={
                      <TextInput.Icon
                        icon="phone-plus-outline"
                        color="#0EA5E9"
                      />
                    }
                  />

                  {/* MOBILE 2 */}
                </View>

                <TextInput
                  label="Alternative Mobile 2"
                  mode="outlined"
                  value={form.altMobile2}
                  onChangeText={(t) => handleChange("altMobile2", t)}
                  keyboardType="phone-pad"
                  style={{
                    flex: 1,

                    backgroundColor: "#FAFBFF",

                    borderRadius: 24,

                    marginLeft: 8,

                    marginBottom: 16,
                  }}
                  outlineStyle={{
                    borderRadius: 24,

                    borderWidth: 1.4,

                    borderColor: "#E2E8F0",
                  }}
                  contentStyle={{
                    fontSize: 15,

                    fontWeight: "700",

                    paddingVertical: 10,

                    color: "#111827",
                  }}
                  theme={{
                    colors: {
                      primary: "#10B981",

                      outline: "#E2E8F0",

                      placeholder: "#94A3B8",
                    },
                  }}
                  left={
                    <TextInput.Icon
                      icon="phone-check-outline"
                      color="#10B981"
                    />
                  }
                />

                {/* EMAIL */}

                {/* OFFICIAL EMAIL */}

                <TextInput
                  label="Official Email"
                  mode="outlined"
                  value={form.officialEmail}
                  onChangeText={(t) => handleChange("officialEmail", t)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    flex: 1,

                    backgroundColor: "#FAFBFF",

                    borderRadius: 24,

                    marginRight: 8,

                    marginBottom: 16,
                  }}
                  outlineStyle={{
                    borderRadius: 24,

                    borderWidth: 1.4,

                    borderColor: "#E2E8F0",
                  }}
                  contentStyle={{
                    fontSize: 15,

                    fontWeight: "700",

                    paddingVertical: 10,

                    color: "#111827",
                  }}
                  theme={{
                    colors: {
                      primary: "#2563EB",

                      outline: "#E2E8F0",

                      placeholder: "#94A3B8",
                    },
                  }}
                  left={<TextInput.Icon icon="email-outline" color="#2563EB" />}
                />

                {/* PERSONAL EMAIL */}

                <TextInput
                  label="Personal Email"
                  mode="outlined"
                  value={form.personalEmail}
                  onChangeText={(t) => handleChange("personalEmail", t)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    flex: 1,

                    backgroundColor: "#FAFBFF",

                    borderRadius: 24,

                    marginLeft: 8,

                    marginBottom: 16,
                  }}
                  outlineStyle={{
                    borderRadius: 24,

                    borderWidth: 1.4,

                    borderColor: "#E2E8F0",
                  }}
                  contentStyle={{
                    fontSize: 15,

                    fontWeight: "700",

                    paddingVertical: 10,

                    color: "#111827",
                  }}
                  theme={{
                    colors: {
                      primary: "#EC4899",

                      outline: "#E2E8F0",

                      placeholder: "#94A3B8",
                    },
                  }}
                  left={<TextInput.Icon icon="gmail" color="#EC4899" />}
                />

                {/* PAN */}

                <TextInput
                  label="PAN Number"
                  mode="outlined"
                  value={form.pan}
                  onChangeText={(t) => handleChange("pan", t)}
                  autoCapitalize="characters"
                  style={{
                    flex: 1,

                    backgroundColor: "#FAFBFF",

                    borderRadius: 24,

                    marginRight: 8,

                    marginBottom: 16,
                  }}
                  outlineStyle={{
                    borderRadius: 24,

                    borderWidth: 1.4,

                    borderColor: "#E2E8F0",
                  }}
                  contentStyle={{
                    fontSize: 15,

                    fontWeight: "700",

                    paddingVertical: 10,

                    color: "#111827",
                  }}
                  theme={{
                    colors: {
                      primary: "#F97316",

                      outline: "#E2E8F0",

                      placeholder: "#94A3B8",
                    },
                  }}
                  left={
                    <TextInput.Icon
                      icon="card-account-details-outline"
                      color="#F97316"
                    />
                  }
                />

                {/* AADHAR */}

                <TextInput
                  label="Aadhar Number"
                  mode="outlined"
                  value={form.aadhar}
                  onChangeText={(t) => handleChange("aadhar", t)}
                  keyboardType="numeric"
                  maxLength={12}
                  style={{
                    flex: 1,

                    backgroundColor: "#FAFBFF",

                    borderRadius: 24,

                    marginLeft: 8,

                    marginBottom: 16,
                  }}
                  outlineStyle={{
                    borderRadius: 24,

                    borderWidth: 1.4,

                    borderColor: "#E2E8F0",
                  }}
                  contentStyle={{
                    fontSize: 15,

                    fontWeight: "700",

                    paddingVertical: 10,

                    color: "#111827",
                  }}
                  theme={{
                    colors: {
                      primary: "#0EA5E9",

                      outline: "#E2E8F0",

                      placeholder: "#94A3B8",
                    },
                  }}
                  left={
                    <TextInput.Icon
                      icon="card-bulleted-outline"
                      color="#0EA5E9"
                    />
                  }
                />
              </View>
            )}
          </Card.Content>
        </Card>

        {/* SAVE */}

        <Button mode="contained" style={styles.button} onPress={handleSave}>
          {editItem?.id ? "Update Ledger" : "Save Ledger"}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LedgerMaster;

//correction

//memberid to be autoincrement
//accountgroup

//remove - ledger
