import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Switch,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "react-native-paper";

import * as FileSystem from "expo-file-system/legacy";

import * as MailComposer from "expo-mail-composer";

import * as Notifications from "expo-notifications";

import styles, {
  COLORS,
} from "../style/DashboardScreenStyle";

import {
  logoutUser,
  getNewInvoices,
  getProducts,
  getCustomers,getInvoiceCustomers,
  getPurchases,
  getLedgers,
  getProfileLocal,
  getSalesReturns,
  getPurchaseReturns,
  getStock,
} from "../database/sqlite";


export default function Dashboard() {

  // =========================
  // STATE
  // =========================

  const [profile, setProfile] =
    useState<any>(null);

  const [email, setEmail] =
    useState("");

  const [userName, setUserName] =
    useState("");

  const [isOnlineSync, setIsOnlineSync] =
    useState(false);

  const [backupLoading, setBackupLoading] =
    useState(false);

  const [stats, setStats] =
    useState({
      sales: 0,
      products: 0,
      customers: 0,
      purchases: 0,
    });


  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadProfile();
    loadDashboardStats();
    scheduleBackupReminder();
  }, []);


  // =========================
  // LOAD PROFILE
  // =========================

const loadProfile = async () => {
  try {
    const data = await getProfileLocal();

    console.log("👤 PROFILE:", data);

    // =========================
    // NO PROFILE
    // =========================

    if (!data) {
      setProfile(null);
      setEmail("");
      setUserName("My Shop");
      return;
    }

    // =========================
    // SAVE PROFILE
    // =========================

    setProfile(data);

    // =========================
    // EMAIL
    // =========================

    setEmail(
      String(data.email || "").trim()
    );

    // =========================
    // SHOP / USER NAME
    // =========================

    const shopName =
      String(
        data.shopName ||
        data.name ||
        ""
      ).trim();

    setUserName(
      shopName || "My Shop"
    );

    console.log(
      "🏪 SHOP NAME:",
      shopName || "My Shop"
    );

  } catch (error) {

    console.log(
      "❌ PROFILE ERROR:",
      error
    );

    setProfile(null);
    setEmail("");
    setUserName("My Shop");
  }
};


  // =========================
  // DASHBOARD STATS
  // =========================

const loadDashboardStats = async () => {
  try {
    console.log("📊 LOADING DASHBOARD...");

    const [
      invoices,
      products,
      customers,
      purchases,
    ] = await Promise.all([
      getNewInvoices(),
      getProducts(),
      getInvoiceCustomers(),
      getPurchases(),
    ]);

    console.log(
      "📊 DASHBOARD INVOICES:",
      invoices
    );

    console.log(
      "📦 DASHBOARD PRODUCTS:",
      products
    );

    console.log(
      "👥 DASHBOARD CUSTOMERS:",
      customers
    );

    console.log(
      "🛒 DASHBOARD PURCHASES:",
      purchases
    );

    // ------------------------------------------------
    // TODAY
    // ------------------------------------------------

    const today = new Date()
      .toISOString()
      .split("T")[0];

    console.log(
      "📅 TODAY:",
      today
    );

    // ------------------------------------------------
    // TODAY'S INVOICES
    // ------------------------------------------------

    const todayInvoices = (invoices || []).filter(
      (invoice) => {
        if (!invoice?.createdAt) {
          return false;
        }

        const invoiceDate = String(
          invoice.createdAt
        ).split("T")[0];

        return invoiceDate === today;
      }
    );

    console.log(
      "🧾 TODAY'S INVOICES:",
      todayInvoices
    );

    // ------------------------------------------------
    // TODAY SALES
    // ------------------------------------------------

    const todaySales = todayInvoices.reduce(
      (total, invoice) => {
        return (
          total +
          Number(invoice.totalAmount ?? 0)
        );
      },
      0
    );

    console.log(
      "💰 TODAY SALES:",
      todaySales
    );

    // ------------------------------------------------
    // UPDATE STATE
    // ------------------------------------------------

    setStats({
      sales: todaySales,

      products:
        Array.isArray(products)
          ? products.length
          : 0,

      customers:
        Array.isArray(customers)
          ? customers.length
          : 0,

      purchases:
        Array.isArray(purchases)
          ? purchases.length
          : 0,
    });

    console.log(
      "✅ DASHBOARD STATS:",
      {
        sales: todaySales,
        products: products?.length || 0,
        customers: customers?.length || 0,
        purchases: purchases?.length || 0,
      }
    );

  } catch (error) {
    console.error(
      "❌ DASHBOARD STATS ERROR:",
      error
    );
  }
};

  // =========================
  // BACKUP REMINDER
  // =========================

  const scheduleBackupReminder =
    async () => {

      try {

        await Notifications
          .requestPermissionsAsync();


        await Notifications
          .setNotificationChannelAsync(
            "backup-reminder",
            {
              name:
                "Backup Reminder",

              importance:
                Notifications
                  .AndroidImportance
                  .HIGH,
            }
          );


        await Notifications
          .scheduleNotificationAsync({

            content: {

              title:
                "📦 Backup Reminder",

              body:
                "Time to backup your billing data.",

              sound: true,

            },

            trigger: {

              type:
                Notifications
                  .SchedulableTriggerInputTypes
                  .DAILY,

              hour: 13,

              minute: 10,

            },

          });


        console.log(
          "✅ Backup reminder scheduled"
        );

      } catch (error) {

        console.log(
          "❌ Notification Error:",
          error
        );

      }

    };


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",

      [

        {
          text: "Cancel",
          style: "cancel",
        },

        {

          text: "Logout",

          style: "destructive",

          onPress: async () => {

            try {

              await logoutUser();

              router.replace(
                "/src/screens/LoginScreen"
              );

            } catch (error) {

              console.log(
                "❌ LOGOUT ERROR:",
                error
              );

            }

          },

        },

      ]
    );

  };


  // =========================
  // FEATURES
  // =========================

  const features = [

    {
      title: "New Sale",
      subtitle: "Create Invoice",
      icon: "📦",
      color: "#0891B2",
      screen:
        "/src/screens/NewBillingScreen",
    },
   

    {
      title: "Purchase",
      subtitle: "Add purchase",
      icon: "📦",
      color: "#0891B2",
      screen:
        "/src/screens/Purchase",
    },

    {
      title: "Sales Return",
      subtitle: "Return invoice",
      icon: "↩️",
      color: "#DC2626",
      screen:
        "/src/screens/SalesReturn",
    },

    {
      title: "Purchase Return",
      subtitle: "Return purchase",
      icon: "🔄",
      color: "#EA580C",
      screen:
        "/src/screens/PurchaseReturn",
    },

    {
      title: "Add Product",
      subtitle: "Create product",
      icon: "➕",
      color: "#16A34A",
      screen:
        "/src/screens/ProductScreen",
    },

    {
      title: "Products",
      subtitle: "View inventory",
      icon: "📋",
      color: "#7C3AED",
      screen:
        "/src/screens/ProductDashboard",
    },

    {
      title: "Create Ledger",
      subtitle: "New ledger",
      icon: "➕",
      color: "#CA8A04",
      screen:
        "/src/screens/LedgerMaster",
    },

    {
      title: "Ledger Master",
      subtitle: "Manage ledgers",
      icon: "📒",
      color: "#9333EA",
      screen:
        "/src/screens/CreateLedger",
    },

    {
      title: "Reports",
      subtitle: "Sales analytics",
      icon: "📊",
      color: "#2563EB",
      screen:
        "/src/screens/ReportsScreen",
    },

    {
      title: "Stocks",
      subtitle: "Stock management",
      icon: "📦",
      color: "#059669",
      screen:
        "/src/screens/StockScreen",
    },

    {
      title: "Settings",
      subtitle: "App settings",
      icon: "⚙️",
      color: "#475569",
      screen:
        "/src/screens/SettingScreen",
    },

  ];


  // =========================
  // SYNC / BACKUP
  // =========================

  const handleSyncToggle =
    async (value: boolean) => {

      setIsOnlineSync(value);


      if (!value) {

        console.log(
          "📴 Offline Mode"
        );

        return;
      }


      try {

        setBackupLoading(true);

        console.log(
          "☁️ Creating backup..."
        );


        // =========================
        // LOAD SQLITE DATA
        // =========================

        const [
          invoices,
          products,
          customers,
          purchases,
          ledgers,
          salesReturns,
          purchaseReturns,
          stock,
        ] = await Promise.all([

          getNewInvoices(),

          getProducts(),

          getCustomers(),

          getPurchases(),

          getLedgers(),

          getSalesReturns(),

          getPurchaseReturns(),

          getStock(),

        ]);


        // =========================
        // BACKUP OBJECT
        // =========================

        const backupData = {

          backupDate:
            new Date().toISOString(),

          invoices,

          products,

          customers,

          purchases,

          ledgers,

          salesReturns,

          purchaseReturns,

          stock,

        };


        // =========================
        // CREATE JSON
        // =========================

        const fileName =
          `backup_${Date.now()}.json`;


        const fileUri =
          FileSystem
            .documentDirectory +
          fileName;


        await FileSystem
          .writeAsStringAsync(
            fileUri,
            JSON.stringify(
              backupData,
              null,
              2
            )
          );


        // =========================
        // EMAIL BACKUP
        // =========================

        if (email) {

          await MailComposer
            .composeAsync({

              recipients: [
                email,
              ],

              subject:
                "Billing App Backup",

              body:
                "Attached is your SQLite billing data backup.",

              attachments: [
                fileUri,
              ],

            });

        } else {

          Alert.alert(
            "Backup Created",
            "Backup file created, but no email address is configured."
          );

        }


        console.log(
          "✅ BACKUP CREATED:",
          fileUri
        );


        if (email) {

          Alert.alert(
            "Backup Ready",
            "Your billing data backup has been prepared."
          );

        }

      } catch (error: any) {

        console.log(
          "❌ BACKUP ERROR:",
          error
        );

        Alert.alert(
          "Backup Error",
          error?.message ||
            "Backup failed."
        );

      } finally {

        setBackupLoading(false);

      }

    };


  // =========================
  // FEATURE CARD
  // =========================

  const renderFeature =
    ({ item }: any) => (

      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.featureCard}
        onPress={() =>
          router.push(item.screen)
        }
      >

        <View
          style={[
            styles.featureIconBox,
            {
              backgroundColor:
                `${item.color}15`,
            },
          ]}
        >

          <Text
            style={styles.featureIcon}
          >
            {item.icon}
          </Text>

        </View>


        <Text
          style={styles.featureTitle}
          numberOfLines={1}
        >
          {item.title}
        </Text>


        <Text
          style={styles.featureSubtitle}
          numberOfLines={1}
        >
          {item.subtitle}
        </Text>


        <View
          style={[
            styles.featureArrow,
            {
              backgroundColor:
                item.color,
            },
          ]}
        >

          <Text
            style={styles.featureArrowText}
          >
            →
          </Text>

        </View>

      </TouchableOpacity>

    );


  // =========================
  // HEADER
  // =========================

  const avatarLetter =
    (
      userName ||
      "S"
    )
      .charAt(0)
      .toUpperCase();


      const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning 👋";
  }

  if (hour >= 12 && hour < 17) {
    return "Good Afternoon 👋";
  }

  if (hour >= 17 && hour < 21) {
    return "Good Evening 👋";
  }

  return "Good Night 🌙";
};
  return (

    <View
      style={styles.container}
    >

      <StatusBar
        backgroundColor={
          COLORS.primaryDark
        }
        barStyle="light-content"
      />


      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <LinearGradient
        colors={[
          COLORS.primary,
          COLORS.primaryDark,
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

        <SafeAreaView
          edges={["top"]}
        >

          <View
            style={styles.headerRow}
          >

            {/* LEFT */}

            <View
              style={styles.headerLeft}
            >

             <Text style={styles.welcome}>
              {getGreeting()}
             </Text>


              <Text
                style={styles.username}
                numberOfLines={1}
              >
                {userName ||
                  "My Shop"}
              </Text>


              <View
                style={
                  styles.syncBadge
                }
              >

                <View
                  style={[
                    styles.syncDot,
                    {
                      backgroundColor:
                        isOnlineSync
                          ? "#4ADE80"
                          : "#FACC15",
                    },
                  ]}
                />


                <Text
                  style={
                    styles.syncStatus
                  }
                >
                  {isOnlineSync
                    ? "Online Sync"
                    : "Offline Mode"}
                </Text>

              </View>

            </View>


            {/* RIGHT */}

            <View
              style={
                styles.headerRight
              }
            >

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={
                  handleLogout
                }
              >

                <Avatar.Text
                  size={48}
                  label={
                    avatarLetter
                  }
                  style={
                    styles.avatar
                  }
                  labelStyle={{
                    fontSize: 19,
                    fontWeight: "800",
                  }}
                />

              </TouchableOpacity>

            </View>

          </View>


          {/* ========================= */}
          {/* SYNC CARD */}
          {/* ========================= */}

          <View
            style={
              styles.syncCard
            }
          >

            <View
              style={
                styles.syncCardLeft
              }
            >

              <View
                style={
                  styles.syncIcon
                }
              >

                <Text>
                  {isOnlineSync
                    ? "☁️"
                    : "📱"}
                </Text>

              </View>


              <View>

                <Text
                  style={
                    styles.syncTitle
                  }
                >
                  {isOnlineSync
                    ? "Backup & Sync"
                    : "Offline Billing"}
                </Text>


                <Text
                  style={
                    styles.syncDescription
                  }
                >
                  {isOnlineSync
                    ? "Create backup and sync data"
                    : "Your data is stored locally"}
                </Text>

              </View>

            </View>


            <Switch
              value={
                isOnlineSync
              }
              onValueChange={
                handleSyncToggle
              }
              trackColor={{
                false: "#CBD5E1",
                true: "#A7F3D0",
              }}
              thumbColor={
                isOnlineSync
                  ? "#16A34A"
                  : "#FFFFFF"
              }
            />

          </View>

        </SafeAreaView>

      </LinearGradient>


      {/* ========================= */}
      {/* DASHBOARD CONTENT */}
      {/* ========================= */}

      <FlatList
        data={features}
        numColumns={2}
        keyExtractor={
          (item, index) =>
            `${item.title}-${index}`
        }
        renderItem={
          renderFeature
        }
        columnWrapperStyle={
          styles.columnWrapper
        }
        contentContainerStyle={
          styles.gridContainer
        }
        showsVerticalScrollIndicator={
          false
        }

        ListHeaderComponent={

          <View>

            {/* ========================= */}
            {/* TODAY'S SUMMARY */}
            {/* ========================= */}

            <View
              style={
                styles.sectionHeader
              }
            >

              <View>

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Today's Overview
                </Text>

                <Text
                  style={
                    styles.sectionSubtitle
                  }
                >
                  Your business at a glance
                </Text>

              </View>

            </View>


            {/* SALES CARD */}

            <LinearGradient
  colors={["#4F46E5", "#6366F1"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.salesCard}
>
  <View>
    <Text style={styles.salesLabel}>
      TODAY'S SALES
    </Text>

    <Text style={styles.salesAmount}>
      ₹{Number(stats.sales || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </Text>

    <Text style={styles.salesHint}>
      Total invoice value today
    </Text>
  </View>

  <View style={styles.salesIcon}>
    <Text style={{ fontSize: 28 }}>
      💰
    </Text>
  </View>
</LinearGradient>


            {/* ========================= */}
            {/* STAT CARDS */}
            {/* ========================= */}

            <View
              style={
                styles.statsRow
              }
            >

              {/* PRODUCTS */}

              <View
                style={
                  styles.statCard
                }
              >

                <View
                  style={[
                    styles.statIcon,
                    {
                      backgroundColor:
                        "#DCFCE7",
                    },
                  ]}
                >
                  <Text>
                    📦
                  </Text>
                </View>

                <Text
                  style={
                    styles.statValue
                  }
                >
                  {stats.products}
                </Text>

                <Text
                  style={
                    styles.statLabel
                  }
                >
                  Products
                </Text>

              </View>


              {/* CUSTOMERS */}

              <View
                style={
                  styles.statCard
                }
              >

                <View
                  style={[
                    styles.statIcon,
                    {
                      backgroundColor:
                        "#DBEAFE",
                    },
                  ]}
                >
                  <Text>
                    👥
                  </Text>
                </View>

                <Text
                  style={
                    styles.statValue
                  }
                >
                  {stats.customers}
                </Text>

                <Text
                  style={
                    styles.statLabel
                  }
                >
                  Customers
                </Text>

              </View>


              {/* PURCHASES */}

              <View
                style={
                  styles.statCard
                }
              >

                <View
                  style={[
                    styles.statIcon,
                    {
                      backgroundColor:
                        "#FEF3C7",
                    },
                  ]}
                >
                  <Text>
                    🛒
                  </Text>
                </View>

                <Text
                  style={
                    styles.statValue
                  }
                >
                  {stats.purchases}
                </Text>

                <Text
                  style={
                    styles.statLabel
                  }
                >
                  Purchases
                </Text>

              </View>

            </View>


            {/* ========================= */}
            {/* QUICK ACTION TITLE */}
            {/* ========================= */}

            <View
              style={
                styles.quickHeader
              }
            >

              <View>

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Quick Actions
                </Text>

                <Text
                  style={
                    styles.sectionSubtitle
                  }
                >
                  Manage your business
                </Text>

              </View>

            </View>

          </View>
        }


        ListFooterComponent={

          <View
            style={
              styles.footer
            }
          >

            <Text
              style={
                styles.footerText
              }
            >
              Offline Billing
            </Text>

            <Text
              style={
                styles.footerSubtext
              }
            >
              Your data. Your business. Your control.
            </Text>

          </View>
        }

      />


      {/* ========================= */}
      {/* BACKUP LOADING */}
      {/* ========================= */}

      {backupLoading && (

        <View
          style={
            styles.loadingOverlay
          }
        >

          <View
            style={
              styles.loadingCard
            }
          >

            <ActivityIndicator
              size="large"
              color={
                COLORS.primary
              }
            />

            <Text
              style={
                styles.loadingTitle
              }
            >
              Creating Backup
            </Text>

            <Text
              style={
                styles.loadingText
              }
            >
              Please wait...
            </Text>

          </View>

        </View>

      )}

    </View>
  );
}


