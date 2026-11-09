
import { Slot } from "expo-router";
import { useEffect, useState } from "react";

import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";

import { Provider as PaperProvider } from "react-native-paper";

import { initDB } from "../app/src/database/sqlite";

export default function Layout() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeDatabase = async () => {
      try {
        console.log("🚀 BACKGROUND SQLITE INITIALIZATION STARTED");

        const result = await initDB();

        if (!mounted) {
          return;
        }

        if (result === true) {
          console.log("✅ SQLITE READY");

          setDbReady(true);
        } else {
          console.log("❌ SQLITE INITIALIZATION FAILED");

          setDbError(
            "Database initialization failed."
          );
        }
      } catch (error: any) {
        console.log(
          "❌ SQLITE INITIALIZATION ERROR:",
          error
        );

        if (mounted) {
          setDbError(
            error?.message ||
              String(error) ||
              "Unknown SQLite error"
          );
        }
      }
    };

    // IMPORTANT:
    // Database initialization happens in the background.
    // It does NOT block <Slot />.
    initializeDatabase();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PaperProvider>

      {/* =========================================
          APP LOADS IMMEDIATELY
         ========================================= */}

      <Slot />

      {/* =========================================
          DATABASE STATUS
         ========================================= */}

      {!dbReady && !dbError && (
        <View style={styles.databaseLoading}>
          <ActivityIndicator size="small" />

          <Text style={styles.databaseLoadingText}>
            Preparing local database...
          </Text>
        </View>
      )}

      {/* =========================================
          DATABASE ERROR
         ========================================= */}

      {dbError && (
        <View style={styles.databaseError}>
          <Text style={styles.databaseErrorTitle}>
            Database Error
          </Text>

          <Text style={styles.databaseErrorText}>
            {dbError}
          </Text>
        </View>
      )}

    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  databaseLoading: {
    position: "absolute",

    left: 20,
    right: 20,
    bottom: 25,

    minHeight: 48,

    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 12,

    backgroundColor: "#FFFFFF",

    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  databaseLoadingText: {
    marginLeft: 10,

    fontSize: 13,

    color: "#64748B",
  },

  databaseError: {
    position: "absolute",

    left: 15,
    right: 15,
    bottom: 20,

    padding: 15,

    borderRadius: 12,

    backgroundColor: "#FEF2F2",

    borderWidth: 1,
    borderColor: "#FECACA",

    elevation: 5,
  },

  databaseErrorTitle: {
    fontSize: 15,

    fontWeight: "700",

    color: "#DC2626",

    marginBottom: 5,
  },

  databaseErrorText: {
    fontSize: 13,

    color: "#991B1B",

    lineHeight: 19,
  },
});
