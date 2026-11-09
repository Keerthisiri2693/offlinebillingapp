import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import {
  db as firebaseDB,
} from "../database/firebase";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import {
  insertUser,
  setLoggedInUser,
  getLoggedInUser,
  getAllUsers,
  getProfileLocal,
  saveShopProfileLocal,
} from "../database/sqlite";


import * as Application
  from "expo-application";

import {
  router,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import styles
  from "../style/LoginScreenStyle";



// =====================================================
// COMPONENT
// =====================================================

export default function LoginScreen() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [checkingLogin, setCheckingLogin] =
    useState(true);

  const [showPassword, setShowPassword] =
    useState(false);

  // =====================================================
  // DEVICE ID
  // =====================================================

  const getDeviceId = () => {

    try {

      return (
        Application.getAndroidId() ||
        "unknown-device"
      );

    } catch (error) {

      console.log(
        "❌ DEVICE ID ERROR:",
        error
      );

      return "unknown-device";
    }
  };

  // =====================================================
  // AUTO LOGIN
  // =====================================================

  useEffect(() => {

    let mounted = true;

    const checkLogin = async () => {

      try {

        console.log(
          "🔍 CHECKING AUTO LOGIN..."
        );

        const deviceId =
          getDeviceId();

        console.log(
          "📱 DEVICE ID:",
          deviceId
        );

        const user =
          await getLoggedInUser();

        console.log(
          "👤 SQLITE USER:",
          user
        );

        if (!mounted) {
          return;
        }

        // =================================================
        // VALID USER
        // =================================================

        if (

          user &&

          Number(
            user.isLoggedIn || 0
          ) === 1 &&

          String(
            user.deviceId || ""
          ) === deviceId

        ) {

          console.log(
            "✅ AUTO LOGIN"
          );

          router.replace(
            "/src/screens/DashboardScreen"
          );

          return;
        }

        console.log(
          "ℹ️ NO AUTO LOGIN"
        );

      } catch (error) {

        console.log(
          "❌ AUTO LOGIN ERROR:",
          error
        );

      } finally {

        if (mounted) {

          setCheckingLogin(
            false
          );

        }
      }
    };

    checkLogin();

    return () => {

      mounted = false;

    };

  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

 const handleLogin = async () => {

  // =====================================================
  // PREVENT DOUBLE CLICK
  // =====================================================

  if (loading) {
    return;
  }

  // =====================================================
  // CLEAN INPUT
  // =====================================================

  const emailTrim =
    String(email || "")
      .trim()
      .toLowerCase();

  const passwordTrim =
    String(password || "")
      .trim();

  // =====================================================
  // VALIDATION
  // =====================================================

  if (!emailTrim) {

    Alert.alert(
      "Login",
      "Please enter your email"
    );

    return;
  }

  if (!passwordTrim) {

    Alert.alert(
      "Login",
      "Please enter your password"
    );

    return;
  }

  setLoading(true);

  const deviceId =
    getDeviceId();

  console.log(
    "📱 LOGIN DEVICE:",
    deviceId
  );

  // =====================================================
  // ONLINE LOGIN
  // =====================================================

  try {

    console.log(
      "🌐 TRYING FIREBASE LOGIN..."
    );

    // ===================================================
    // FIND USER
    // ===================================================

    const q =
      query(
        collection(
          firebaseDB,
          "users"
        ),
        where(
          "email",
          "==",
          emailTrim
        )
      );

    const snapshot =
      await getDocs(q);

    console.log(
      "👥 FIREBASE USERS FOUND:",
      snapshot.size
    );

    // ===================================================
    // USER NOT FOUND
    // ===================================================

    if (snapshot.empty) {

      Alert.alert(
        "Login Failed",
        "User not found"
      );

      return;
    }

    // ===================================================
    // USER DATA
    // ===================================================

    const userDoc =
      snapshot.docs[0];

    const userData =
      userDoc.data();

    console.log(
      "🔥 FIREBASE USER:",
      userData
    );

    // ===================================================
    // ACTIVE CHECK
    // ===================================================

    if (
      userData.isActive === false
    ) {

      Alert.alert(
        "Account Blocked",
        "Your account has been disabled."
      );

      return;
    }

    // ===================================================
    // PASSWORD CHECK
    // ===================================================

    if (
      String(
        userData.password || ""
      ) !== passwordTrim
    ) {

      Alert.alert(
        "Login Failed",
        "Incorrect password"
      );

      return;
    }

    // ===================================================
    // DEVICE CHECK
    // =====================================================

    const firebaseDeviceId =
      String(
        userData.deviceId || ""
      );

    // =====================================================
    // FIRST DEVICE LOGIN
    // =====================================================

    if (!firebaseDeviceId) {

      console.log(
        "📱 FIRST DEVICE LOGIN"
      );

      await updateDoc(
        doc(
          firebaseDB,
          "users",
          userDoc.id
        ),
        {
          deviceId:
            deviceId,

          isLoggedIn:
            1,
        }
      );

    }

    // =====================================================
    // SAME DEVICE
    // =====================================================

    else if (
      firebaseDeviceId === deviceId
    ) {

      console.log(
        "📱 SAME DEVICE LOGIN"
      );

      await updateDoc(
        doc(
          firebaseDB,
          "users",
          userDoc.id
        ),
        {
          isLoggedIn:
            1,
        }
      );

    }

    // =====================================================
    // DIFFERENT DEVICE
    // =====================================================

    else {

      console.log(
        "❌ DIFFERENT DEVICE"
      );

      Alert.alert(
        "Login Blocked",
        "This account is already being used on another device."
      );

      return;
    }

    // =====================================================
    // SAVE USER TO SQLITE
    // =====================================================

    console.log(
      "💾 SAVING USER TO SQLITE..."
    );

    const inserted =
      await insertUser(
        userDoc.id,
        emailTrim,
        passwordTrim,
        deviceId
      );

    if (!inserted) {

      console.log(
        "❌ SQLITE INSERT FAILED"
      );

      Alert.alert(
        "Login Error",
        "Unable to save login session locally."
      );

      return;
    }

    console.log(
      "✅ USER SAVED TO SQLITE"
    );

    // =====================================================
    // SET LOGIN SESSION
    // =====================================================

    const sessionSaved =
      await setLoggedInUser(
        emailTrim
      );

    if (!sessionSaved) {

      console.log(
        "❌ SESSION SAVE FAILED"
      );

      Alert.alert(
        "Login Error",
        "Unable to create local login session."
      );

      return;
    }

    console.log(
      "✅ LOGIN SESSION SAVED"
    );

    // =====================================================
    // GET SHOP PROFILE FROM FIREBASE
    // =====================================================

    console.log(
      "🏪 CHECKING SHOP PROFILE..."
    );

    try {

      /*
       * Your Firestore structure:
       *
       * shopProfiles
       *    └── ast@gmail.com
       */

      const profileRef =
        doc(
          firebaseDB,
          "shopProfiles",
          emailTrim
        );

      const profileSnapshot =
        await getDocs(
          query(
            collection(
              firebaseDB,
              "shopProfiles"
            ),
            where(
              "email",
              "==",
              emailTrim
            )
          )
        );

      console.log(
        "🏪 SHOP PROFILE COUNT:",
        profileSnapshot.size
      );

      // ===================================================
      // PROFILE FOUND
      // ===================================================

      if (
        !profileSnapshot.empty
      ) {

        const profileDoc =
          profileSnapshot.docs[0];

        const firebaseProfile =
          profileDoc.data();

        console.log(
          "🏪 FIREBASE SHOP PROFILE:",
          firebaseProfile
        );

        // =================================================
        // COMPLETE PROFILE
        // =================================================

        const shopProfile = {

          id:
            String(
              firebaseProfile.id ||
              profileDoc.id ||
              ""
            ),

          shopName:
            String(
              firebaseProfile.shopName ||
              ""
            ),

          ownerName:
            String(
              firebaseProfile.ownerName ||
              ""
            ),

          mobile:
            String(
              firebaseProfile.mobile ||
              ""
            ),

          email:
            String(
              firebaseProfile.email ||
              emailTrim
            ),

          address:
            String(
              firebaseProfile.address ||
              ""
            ),

          categories:
            String(
              firebaseProfile.categories ||
              ""
            ),

          openTime:
            String(
              firebaseProfile.openTime ||
              ""
            ),

          closeTime:
            String(
              firebaseProfile.closeTime ||
              ""
            ),

          image:
            String(
              firebaseProfile.image ||
              ""
            ),

          updatedAt:
            String(
              firebaseProfile.updatedAt ||
              new Date().toISOString()
            ),

        };

        console.log(
          "🏪 COMPLETE SHOP PROFILE:",
          shopProfile
        );

        // =================================================
        // SAVE PROFILE TO SQLITE
        // =================================================

        const profileSaved =
          await saveShopProfileLocal(
            shopProfile
          );

        if (
          profileSaved
        ) {

          console.log(
            "✅ SHOP PROFILE SAVED TO SQLITE"
          );

        } else {

          console.log(
            "❌ SHOP PROFILE SQLITE SAVE FAILED"
          );
        }

      }

      // ===================================================
      // PROFILE NOT FOUND
      // ===================================================

      else {

        console.log(
          "⚠️ SHOP PROFILE NOT FOUND:",
          emailTrim
        );

      }

    } catch (profileError) {

      console.log(
        "❌ SHOP PROFILE ERROR:",
        profileError
      );

      /*
       * Do NOT fail login if shop profile
       * cannot be loaded.
       *
       * User can still enter Dashboard.
       */
    }

    // =====================================================
    // DEBUG USERS
    // =====================================================

    try {

      const allUsers =
        await getAllUsers();

      console.log(
        "📦 SQLITE USERS:",
        allUsers
      );

    } catch (error) {

      console.log(
        "⚠️ GET USERS DEBUG ERROR:",
        error
      );

    }

    // =====================================================
    // CURRENT USER
    // =====================================================

    const currentUser =
      await getLoggedInUser();

    console.log(
      "👤 CURRENT SQLITE USER:",
      currentUser
    );

    // =====================================================
    // LOCAL SHOP PROFILE
    // =====================================================

    const localProfile =
      await getProfileLocal();

    console.log(
      "🏪 LOCAL SHOP PROFILE:",
      localProfile
    );

    // =====================================================
    // LOGIN SUCCESS
    // =====================================================

    console.log(
      "🎉 LOGIN SUCCESS"
    );

    Alert.alert(
      "Success",
      "Login successful",
      [
        {
          text: "OK",

          onPress: () => {

            router.replace(
              "/src/screens/DashboardScreen"
            );

          },
        },
      ]
    );

  } catch (onlineError) {

    // =====================================================
    // ONLINE LOGIN FAILED
    // =====================================================

    console.log(
      "🌐 ONLINE LOGIN FAILED:",
      onlineError
    );

    console.log(
      "📴 TRYING OFFLINE LOGIN..."
    );

    // =====================================================
    // OFFLINE LOGIN
    // =====================================================

    try {

      const user =
        await getLoggedInUser();

      console.log(
        "👤 OFFLINE USER:",
        user
      );

      if (!user) {

        Alert.alert(
          "Offline Login",
          "No saved login account found."
        );

        return;
      }

      const localEmail =
        String(
          user.email || ""
        )
          .trim()
          .toLowerCase();

      const localPassword =
        String(
          user.password || ""
        );

      const localDeviceId =
        String(
          user.deviceId || ""
        );

      const isLoggedIn =
        Number(
          user.isLoggedIn || 0
        ) === 1;

      // ===================================================
      // OFFLINE VALIDATION
      // ===================================================

      const validOfflineUser =

        localEmail ===
          emailTrim &&

        localPassword ===
          passwordTrim &&

        localDeviceId ===
          deviceId;

      // ===================================================
      // OFFLINE LOGIN
      // ===================================================

      if (
        validOfflineUser
      ) {

        console.log(
          "✅ OFFLINE LOGIN SUCCESS"
        );

        // Restore local session

        await setLoggedInUser(
          emailTrim
        );

        // Get saved shop profile

        const localProfile =
          await getProfileLocal();

        console.log(
          "🏪 OFFLINE SHOP PROFILE:",
          localProfile
        );

        Alert.alert(
          "Offline Login",
          "Welcome back!",
          [
            {
              text: "OK",

              onPress: () => {

                router.replace(
                  "/src/screens/DashboardScreen"
                );

              },
            },
          ]
        );

      } else {

        console.log(
          "❌ OFFLINE LOGIN INVALID"
        );

        console.log(
          "Email match:",
          localEmail === emailTrim
        );

        console.log(
          "Password match:",
          localPassword === passwordTrim
        );

        console.log(
          "Device match:",
          localDeviceId === deviceId
        );

        console.log(
          "Logged in:",
          isLoggedIn
        );

        Alert.alert(
          "Login Failed",
          "Unable to login online or offline."
        );
      }

    } catch (offlineError) {

      console.log(
        "❌ OFFLINE LOGIN ERROR:",
        offlineError
      );

      Alert.alert(
        "Login Error",
        "Offline login failed."
      );
    }

  } finally {

    setLoading(false);

  }
};

  // =====================================================
  // LOADING / AUTO LOGIN SCREEN
  // =====================================================

  if (checkingLogin) {

    return (

      <View
        style={[
          styles.container,
          {
            justifyContent:
              "center",
            alignItems:
              "center",
          },
        ]}
      >

        <ActivityIndicator
          size="large"
          color="#2c5364"
        />

        <Text
          style={{
            marginTop: 12,
            color: "#64748B",
            fontSize: 14,
          }}
        >
          Checking login...
        </Text>

      </View>
    );
  }

  // =====================================================
  // LOGIN UI
  // =====================================================

  return (

    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent:
            "center",
        }}
        keyboardShouldPersistTaps="handled"
      >

        <View
          style={styles.container}
        >

          {/* ========================================= */}
          {/* TITLE */}
          {/* ========================================= */}

          <Text
            style={styles.title}
          >
            Billing Login
          </Text>

          {/* ========================================= */}
          {/* EMAIL */}
          {/* ========================================= */}

          <TextInput

            placeholder="Email"

            placeholderTextColor="#94A3B8"

            value={email}

            onChangeText={
              setEmail
            }

            style={styles.input}

            autoCapitalize="none"

            autoCorrect={false}

            keyboardType="email-address"

            editable={!loading}

            returnKeyType="next"

          />

          {/* ========================================= */}
          {/* PASSWORD */}
          {/* ========================================= */}

          <View
            style={
              styles.passwordContainer
            }
          >

            <TextInput

              placeholder="Password"

              placeholderTextColor="#94A3B8"

              secureTextEntry={
                !showPassword
              }

              value={password}

              onChangeText={
                setPassword
              }

              style={
                styles.passwordInput
              }

              autoCapitalize="none"

              autoCorrect={false}

              editable={!loading}

              returnKeyType="done"

              onSubmitEditing={
                handleLogin
              }

            />

            <TouchableOpacity

              onPress={() =>
                setShowPassword(
                  previous =>
                    !previous
                )
              }

              disabled={loading}

              activeOpacity={0.7}

            >

              <Ionicons

                name={
                  showPassword
                    ? "eye-off"
                    : "eye"
                }

                size={22}

                color="#64748B"

              />

            </TouchableOpacity>

          </View>

          {/* ========================================= */}
          {/* LOGIN BUTTON */}
          {/* ========================================= */}

          <TouchableOpacity

            style={[
              styles.btn,

              loading && {
                opacity: 0.6,
              },
            ]}

            onPress={
              handleLogin
            }

            disabled={
              loading
            }

            activeOpacity={0.85}

          >

            {loading ? (

              <View
                style={{
                  flexDirection:
                    "row",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                }}
              >

                <ActivityIndicator
                  color="#fff"
                  size="small"
                />

                <Text
                  style={[
                    styles.btnText,
                    {
                      marginLeft: 8,
                    },
                  ]}
                >
                  Logging in...
                </Text>

              </View>

            ) : (

              <Text
                style={
                  styles.btnText
                }
              >
                Login
              </Text>

            )}

          </TouchableOpacity>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}