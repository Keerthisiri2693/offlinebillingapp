import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  db,
  doc,
  setDoc,
  getDoc,
} from "../database/firebase";

import {
  getDB,
  saveProfileLocal,
  getProfileLocal,
  getLoggedInUser,
} from "../database/sqlite";

import styles from "../style/ShopProfileStyle";


export default function ShopProfileScreen() {

  // =========================
  // STATE
  // =========================

  const [shopName, setShopName] =
    useState("");

  const [ownerName, setOwnerName] =
    useState("");

  const [mobile, setMobile] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [categories, setCategories] =
    useState("");

  const [openTime, setOpenTime] =
    useState("");

  const [closeTime, setCloseTime] =
    useState("");

  const [image, setImage] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [isEdit, setIsEdit] =
    useState(false);


  // =========================
  // INITIALIZE
  // =========================

  useEffect(() => {

    initialize();

  }, []);


  const initialize = async () => {

    try {

      console.log(
        "🚀 SHOP PROFILE INITIALIZING..."
      );

      // IMPORTANT:
      // Use getDB() only.
      // Do not call initDB() directly.
      await getDB();

      console.log(
        "✅ SQLITE READY"
      );

      // Load logged-in user first
      const loggedUser =
        await getLoggedInUser();

      console.log(
        "👤 LOGGED USER =",
        loggedUser
      );

      // Load local profile
      const localData =
        await getProfileLocal();

      console.log(
        "💾 LOCAL PROFILE =",
        localData
      );

      const data =
        Array.isArray(localData)
          ? localData[0]
          : localData;


      // =========================
      // GET EMAIL
      // =========================

      const userEmail =
        String(
          loggedUser?.email ||
          data?.email ||
          ""
        )
          .trim()
          .toLowerCase();


      console.log(
        "📧 PROFILE EMAIL =",
        userEmail
      );


      // =========================
      // LOAD LOCAL PROFILE
      // =========================

      if (data) {

        setIsEdit(true);

        setShopName(
          data.shopName || ""
        );

        setOwnerName(
          data.ownerName || ""
        );

        setMobile(
          data.mobile || ""
        );

        setEmail(
          userEmail ||
          data.email ||
          ""
        );

        setAddress(
          data.address || ""
        );

        setCategories(
          data.categories || ""
        );

        setOpenTime(
          data.openTime || ""
        );

        setCloseTime(
          data.closeTime || ""
        );

        setImage(
          data.image || null
        );

      } else if (userEmail) {

        // User exists but no local profile
        setEmail(userEmail);

      }


      // =========================
      // LOAD FIREBASE PROFILE
      // =========================

      if (userEmail) {

        await loadFirebaseData(
          userEmail
        );

      } else {

        console.log(
          "⚠️ EMAIL NOT AVAILABLE"
        );

      }

    } catch (e) {

      console.log(
        "❌ INIT ERROR =",
        e
      );

    }

  };


  // =========================
  // LOAD FIREBASE PROFILE
  // =========================

  const loadFirebaseData = async (
    emailId: string
  ) => {

    try {

      const normalizedEmail =
        String(emailId)
          .trim()
          .toLowerCase();


      console.log(
        "================================"
      );

      console.log(
        "🔥 LOADING FIREBASE PROFILE"
      );

      console.log(
        "📧 EMAIL =",
        normalizedEmail
      );

      console.log(
        "📄 PATH =",
        `shopProfiles/${normalizedEmail}`
      );

      console.log(
        "================================"
      );


      const docRef =
        doc(
          db,
          "shopProfiles",
          normalizedEmail
        );


      const snapshot =
        await getDoc(docRef);


      console.log(
        "📦 EXISTS =",
        snapshot.exists()
      );


      if (!snapshot.exists()) {

        console.log(
          "ℹ️ FIREBASE PROFILE DOES NOT EXIST"
        );

        return;

      }


      const data =
        snapshot.data();


      console.log(
        "✅ FIREBASE PROFILE =",
        data
      );


      // =========================
      // UPDATE UI
      // =========================

      setIsEdit(true);

      setShopName(
        data.shopName || ""
      );

      setOwnerName(
        data.ownerName || ""
      );

      setMobile(
        data.mobile || ""
      );

      setEmail(
        data.email ||
        normalizedEmail
      );

      setAddress(
        data.address || ""
      );

      setCategories(
        data.categories || ""
      );

      setOpenTime(
        data.openTime || ""
      );

      setCloseTime(
        data.closeTime || ""
      );

      setImage(
        data.image || null
      );


      // =========================
      // SAVE FIREBASE DATA
      // TO SQLITE
      // =========================

      const localProfile = {

        ...data,

        email:
          data.email ||
          normalizedEmail,

      };


      await saveProfileLocal(
        localProfile
      );


      console.log(
        "✅ FIREBASE PROFILE SAVED TO SQLITE"
      );

    } catch (e) {

      console.log(
        "❌ FIREBASE LOAD ERROR =",
        e
      );

    }

  };


  // =========================
  // PICK IMAGE
  // =========================

  const pickImage = async () => {

    try {

      const permission =
        await ImagePicker
          .requestMediaLibraryPermissionsAsync();


      if (!permission.granted) {

        Alert.alert(
          "Permission Required",
          "Gallery permission needed"
        );

        return;

      }


      const result =
        await ImagePicker
          .launchImageLibraryAsync({

            mediaTypes:
              ImagePicker
                .MediaTypeOptions
                .Images,

            allowsEditing: true,

            aspect: [1, 1],

            quality: 1,

          });


      if (!result.canceled) {

        const selectedImage =
          result.assets[0].uri;


        console.log(
          "🖼️ SELECTED IMAGE =",
          selectedImage
        );


        setImage(
          selectedImage
        );

      }

    } catch (e) {

      console.log(
        "❌ IMAGE ERROR =",
        e
      );

    }

  };


  // =========================
  // SAVE PROFILE
  // SQLITE + FIRESTORE
  // =========================

  const saveProfile = async () => {

    try {

      // =========================
      // VALIDATION
      // =========================

      if (!shopName.trim()) {

        Alert.alert(
          "Error",
          "Shop name is required"
        );

        return;

      }


      if (!mobile.trim()) {

        Alert.alert(
          "Error",
          "Mobile number is required"
        );

        return;

      }


      if (!email.trim()) {

        Alert.alert(
          "Error",
          "Email is required"
        );

        return;

      }


      setLoading(true);


      // =========================
      // NORMALIZE EMAIL
      // =========================

      const normalizedEmail =
        email
          .trim()
          .toLowerCase();


      // =========================
      // PROFILE OBJECT
      // =========================

      const profile = {

        shopName:
          shopName.trim(),

        ownerName:
          ownerName.trim(),

        mobile:
          mobile.trim(),

        email:
          normalizedEmail,

        address:
          address.trim(),

        categories:
          categories.trim(),

        openTime:
          openTime.trim(),

        closeTime:
          closeTime.trim(),

        image:
          image || "",

        updatedAt:
          new Date().toISOString(),

      };


      console.log(
        "================================"
      );

      console.log(
        "💾 SAVING SHOP PROFILE"
      );

      console.log(
        "PROFILE =",
        profile
      );

      console.log(
        "================================"
      );


      // =========================
      // 1️⃣ SQLITE
      // =========================

      console.log(
        "💾 STEP 1: SAVING SQLITE..."
      );


      // Make sure database is initialized
      await getDB();


      await saveProfileLocal(
        profile
      );


      console.log(
        "✅ SQLITE PROFILE SAVED"
      );


      // =========================
      // 2️⃣ FIRESTORE
      // =========================

      console.log(
        "☁️ STEP 2: SAVING FIRESTORE..."
      );


      /*
        IMPORTANT:

        Document ID = email

        shopProfiles/
          test1@gmail.com
      */

      const profileRef =
        doc(
          db,
          "shopProfiles",
          normalizedEmail
        );


      await setDoc(
        profileRef,
        profile,
        {
          merge: true,
        }
      );


      console.log(
        "✅ FIRESTORE PROFILE SAVED"
      );


      // =========================
      // VERIFY FIRESTORE
      // =========================

      const verifySnapshot =
        await getDoc(
          profileRef
        );


      console.log(
        "🔎 FIRESTORE VERIFY =",
        verifySnapshot.exists()
      );


      if (verifySnapshot.exists()) {

        console.log(
          "☁️ FIREBASE DATA =",
          verifySnapshot.data()
        );

      }


      // =========================
      // UPDATE STATE
      // =========================

      setEmail(
        normalizedEmail
      );

      setIsEdit(true);


      // =========================
      // SUCCESS
      // =========================

      Alert.alert(
        "Success",
        isEdit
          ? "Shop profile updated successfully"
          : "Shop profile created successfully"
      );


    } catch (e: any) {

      console.log(
        "================================"
      );

      console.log(
        "❌ SAVE PROFILE ERROR"
      );

      console.log(
        e
      );

      console.log(
        "❌ ERROR MESSAGE =",
        e?.message
      );

      console.log(
        "================================"
      );


      Alert.alert(
        "Error",
        e?.message ||
        "Failed to save shop profile"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // UI
  // =========================

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.scrollContent
      }
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View
        style={styles.header}
      >

        <Text
          style={styles.headerTitle}
        >
          Shop Profile
        </Text>

        <Text
          style={styles.headerSubtitle}
        >
          Manage your business details
        </Text>

      </View>


      {/* PROFILE IMAGE */}

      <View
        style={styles.profileContainer}
      >

        <TouchableOpacity
          style={styles.imageBox}
          onPress={pickImage}
          activeOpacity={0.85}
        >

          {image ? (

            <Image
              source={{
                uri: image,
              }}
              style={styles.image}
            />

          ) : (

            <View
              style={
                styles.imagePlaceholder
              }
            >

              <MaterialCommunityIcons
                name="camera-plus"
                size={40}
                color="#6b7280"
              />

              <Text
                style={styles.imageText}
              >
                Upload Image
              </Text>

            </View>

          )}

        </TouchableOpacity>

      </View>


      {/* FORM */}

      <View
        style={styles.formContainer}
      >

        <View
          style={styles.card}
        >

          <Text
            style={styles.sectionTitle}
          >
            Shop Information
          </Text>


          {/* SHOP NAME */}

          <TextInput
            placeholder="Shop Name"
            value={shopName}
            onChangeText={setShopName}
            style={styles.input}
          />


          {/* OWNER */}

          <TextInput
            placeholder="Owner Name"
            value={ownerName}
            onChangeText={setOwnerName}
            style={styles.input}
          />


          {/* MOBILE */}

          <TextInput
            placeholder="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            style={styles.input}
          />


          {/* EMAIL */}

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />


          {/* ADDRESS */}

          <TextInput
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
            style={[
              styles.input,
              styles.multilineInput,
            ]}
          />


          {/* CATEGORY */}

          <TextInput
            placeholder="Categories"
            value={categories}
            onChangeText={setCategories}
            style={styles.input}
          />


          {/* OPEN TIME */}

          <TextInput
            placeholder="Open Time"
            value={openTime}
            onChangeText={setOpenTime}
            style={styles.input}
          />


          {/* CLOSE TIME */}

          <TextInput
            placeholder="Close Time"
            value={closeTime}
            onChangeText={setCloseTime}
            style={styles.input}
          />


          {/* SAVE */}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveProfile}
            disabled={loading}
            activeOpacity={0.85}
          >

            {loading ? (

              <ActivityIndicator
                color="#fff"
              />

            ) : (

              <Text
                style={
                  styles.saveButtonText
                }
              >
                {isEdit
                  ? "Update Profile"
                  : "Create Profile"}
              </Text>

            )}

          </TouchableOpacity>

        </View>

      </View>

    </ScrollView>

  );

}