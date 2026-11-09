import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import styles from "../style/AboutScreenStyle";

export default function AboutScreen() {
  const appVersion =
    Constants.expoConfig?.version || "1.0.0";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Logo */}

      <View style={styles.logoContainer}>
        <Ionicons
          name="cube"
          size={70}
          color="#2563EB"
        />

        <Text style={styles.appName}>
          Billing Software
        </Text>

        <Text style={styles.version}>
          Version {appVersion}
        </Text>
      </View>

      {/* Description */}

      <View style={styles.card}>
        <Text style={styles.heading}>
          About Application
        </Text>

        <Text style={styles.description}>
          Billing Software is a complete offline and
          online billing solution for retail shops,
          supermarkets, pharmacies, wholesale,
          restaurants and other businesses.

          {"\n\n"}

          The application helps manage products,
          sales, purchases, stock, ledgers,
          invoices, GST, reports and customer
          records with secure local storage and
          cloud synchronization.
        </Text>
      </View>

      {/* Features */}

      <View style={styles.card}>
        <Text style={styles.heading}>
          Features
        </Text>

        <Text style={styles.item}>
          • Sales Billing
        </Text>

        <Text style={styles.item}>
          • Purchase Management
        </Text>

        <Text style={styles.item}>
          • Stock Management
        </Text>

        <Text style={styles.item}>
          • Barcode Support
        </Text>

        <Text style={styles.item}>
          • GST Billing
        </Text>

        <Text style={styles.item}>
          • Customer Ledger
        </Text>

        <Text style={styles.item}>
          • Reports & Analytics
        </Text>

        <Text style={styles.item}>
          • Offline SQLite Database
        </Text>

        <Text style={styles.item}>
          • Firebase Cloud Sync
        </Text>
      </View>

      {/* Contact */}

      <View style={styles.card}>
        <Text style={styles.heading}>
          Contact
        </Text>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "mailto:support@yourcompany.com"
            )
          }
        >
          <Text style={styles.link}>
            support@yourcompany.com
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://yourcompany.com"
            )
          }
        >
          <Text style={styles.link}>
            www.yourcompany.com
          </Text>
        </TouchableOpacity>
      </View>

      {/* Policies */}

      <View style={styles.card}>
        <TouchableOpacity>
          <Text style={styles.link}>
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link}>
            Terms & Conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link}>
            Open Source Licenses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}

      <Text style={styles.footer}>
        © 2026 Billing Software
        {"\n"}
        All Rights Reserved
      </Text>
    </ScrollView>
  );
}