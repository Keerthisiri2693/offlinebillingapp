import React, {



  useEffect,



  useState,



} from "react";







import {



  View,



  Text,



  ScrollView,



  Image,



  TouchableOpacity,StatusBar,



  ActivityIndicator,



  Alert,



} from "react-native";







import * as FileSystem



from 'expo-file-system/legacy';







import {



  LinearGradient,



} from "expo-linear-gradient";











import DateTimePicker from "@react-native-community/datetimepicker";







import {



  MaterialCommunityIcons,



} from "@expo/vector-icons";







import {



  router,



  useLocalSearchParams,



} from "expo-router";







import {



  db,



  doc,



  getDoc,setDoc,



} from "../database/firebase";































import * as ImagePicker



from 'expo-image-picker';







import {



  TextInput,



} from 'react-native-paper';







import {







  getProfileLocal,



  clearProfile,



  saveProfileLocal,



  updateProfileLocal,



  getLoggedInUser,







} from "../database/sqlite";







import styles from "../style/BusinessDetailsStyle";









const normalizeImageValue = (value) => {

  if (!value) return "";



  const image = String(value).trim();



  if (image.startsWith("data:image/")) {

    return image;

  }



  if (

    image.startsWith("http://") ||

    image.startsWith("https://")

  ) {

    return image;

  }



  // Old Expo/local paths must never be saved to Firestore.

  if (image.startsWith("file://")) {

    return "";

  }



  return "";

};



export default function GetBusinessDetailsScreen() {







  // ROUTE PARAMS







  const params =



    useLocalSearchParams();







  // MOBILE PARAM







  const mobile =



    typeof params?.mobile ===



    "string"



      ? params.mobile



      : "";







  // STATES







  const [shop, setShop] =



    useState(null);







  const [loading, setLoading] =



    useState(true);











    const [



  openTimePicker,



  setOpenTimePicker



] = useState(false);







const [



  closeTimePicker,



  setCloseTimePicker



] = useState(false);







  // LOAD SCREEN







  useEffect(() => {







    initialize();







  }, []);







  // INITIALIZE







 const initialize =



  async () => {







  try {







    setLoading(true);







    // =========================



    // ROUTE MOBILE



    // =========================







    if (mobile) {







      await loadBusinessDetails(



        mobile



      );







      return;







    }







    // =========================



    // LOCAL SQLITE PROFILE



    // =========================







    const localProfile =







      await getProfileLocal();







    console.log(



      "📦 LOCAL PROFILE =",



      localProfile



    );







    const profile =



        localProfile || null;







    // =========================



    // LOCAL PROFILE EXISTS



    // =========================







    if (profile?.mobile) {







  console.log(



    "✅ LOCAL PROFILE"



  );







  console.log(



    "🖼 SQLITE IMAGE =",



    profile?.image



  );







  // =========================



  // USE SQLITE DATA



  // =========================

  const localImage = normalizeImageValue(profile?.image);



  setShop({

    ...profile,

    image: localImage,

  });



  setLoading(false);



  return;







}







    // =========================



    // ONLINE FALLBACK



    // =========================







    console.log(



      "🌐 ONLINE PROFILE"



    );







    // GET SQLITE USER







    const user =







      await getLoggedInUser();







    console.log(



      "👤 SQLITE USER =",



      user



    );







    if (!user?.email) {







      Alert.alert(



        "Error",



        "No logged in user"



      );







      return;







    }







    // =========================



    // FIND BUSINESS PROFILE



    // =========================







    // YOUR FIRESTORE



    // USES MOBILE AS DOC ID















if (!user?.email) {



  Alert.alert(



    "Error",



    "No logged in user"



  );



  return;



}







const emailId =



  user.email



    .trim()



    .toLowerCase();







const businessRef =



  doc(



    db,



    "shopProfiles",



    emailId



  );







    const businessSnap =







      await getDoc(



        businessRef



      );







    if (!businessSnap.exists()) {







      Alert.alert(



        "Error",



        "Online profile not found"



      );







      return;







    }







    const businessData =



      businessSnap.data();







    console.log(



      "🌐 BUSINESS DATA =",



      businessData



    );







    // =========================



    // SAVE SQLITE



    // =========================







const savedImage = normalizeImageValue(

  businessData?.image

);



if (savedImage.startsWith("data:image/")) {

  console.log("✅ BASE64 IMAGE LOADED FROM FIRESTORE");

  console.log("📦 BASE64 LENGTH =", savedImage.length);

} else if (

  savedImage.startsWith("http://") ||

  savedImage.startsWith("https://")

) {

  console.log("🌐 REMOTE IMAGE URL LOADED");

} else if (businessData?.image) {

  console.log("⚠️ OLD/INVALID IMAGE VALUE IGNORED");

}



// SAVE SQLITE



// =========================



await clearProfile();











await saveProfileLocal({







  id: Date.now().toString(),







  email:



    businessData?.email || "",







  shopName:



    businessData?.shopName || "",







  ownerName:



    businessData?.ownerName || "",







  mobile:



    businessData?.mobile || "",







  image:



    savedImage,







  categories:



    businessData?.categories || "",







  address:



    businessData?.address || "",







  openTime:



    businessData?.openTime || "",







  closeTime:



    businessData?.closeTime || "",







  updatedAt:



    new Date().toISOString(),



});







// =========================



// SET SHOP



// =========================







setShop({

  ...businessData,

  image: savedImage || "",

});







  } catch (e) {







    console.log(



      "❌ INIT ERROR =",



      e



    );







    Alert.alert(



      "Error",



      "Failed to load business profile"



    );







  } finally {







    setLoading(false);







  }







};











const pickImage = async () => {

  try {

    const permission =

      await ImagePicker.requestMediaLibraryPermissionsAsync();



    if (!permission.granted) {

      Alert.alert(

        "Permission denied",

        "Please allow gallery permission to select an image."

      );

      return;

    }



    const result = await ImagePicker.launchImageLibraryAsync({

      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsEditing: true,

      aspect: [1, 1],

      quality: 0.5,

      base64: true,

    });



    if (result.canceled || !result.assets?.length) {

      return;

    }



    const asset = result.assets[0];



    let base64Image = "";



    if (asset.base64) {

      const mimeType = asset.mimeType || "image/jpeg";

      base64Image = `data:${mimeType};base64,${asset.base64}`;

    } else {

      const base64 = await FileSystem.readAsStringAsync(asset.uri, {

        encoding: FileSystem.EncodingType.Base64,

      });



      base64Image = `data:image/jpeg;base64,${base64}`;

    }



    if (!base64Image) {

      Alert.alert("Error", "Unable to convert image to Base64.");

      return;

    }



    console.log("✅ BASE64 IMAGE CREATED");

    console.log("📦 BASE64 LENGTH =", base64Image.length);



    setShop((prev) => ({

      ...(prev || {}),

      image: base64Image,

    }));

  } catch (error) {

    console.log("❌ PICK IMAGE ERROR =", error);



    Alert.alert(

      "Error",

      "Unable to select and process the image."

    );

  }

};



// LOAD BUSINESS DETAILS



const loadBusinessDetails =



  async (mobileNumber) => {







  try {







    // =========================



    // LOADING START



    // =========================







    setLoading(true);







    console.log(



      "📱 FETCH MOBILE =",



      mobileNumber



    );







    // =========================



    // VALIDATE MOBILE



    // =========================







    if (!mobileNumber) {







      Alert.alert(



        "Error",



        "Invalid mobile number"



      );







      return;



    }







    // =========================



    // FIRESTORE REF



    // =========================







    // =========================

    // FIRESTORE DOCUMENT

    // =========================

    // New profiles use email as the document ID.

    // Mobile-number lookup remains as a fallback.



    const loggedInUser = await getLoggedInUser();



    const emailId = loggedInUser?.email

      ?.trim()

      ?.toLowerCase();



    let snapshot = null;



    if (emailId) {

      const emailRef = doc(

        db,

        "shopProfiles",

        emailId

      );



      snapshot = await getDoc(emailRef);



      if (snapshot.exists()) {

        console.log(

          "✅ PROFILE FOUND BY EMAIL:",

          emailId

        );

      }

    }



    if (!snapshot || !snapshot.exists()) {

      const mobileRef = doc(

        db,

        "shopProfiles",

        mobileNumber

      );



      snapshot = await getDoc(mobileRef);



      if (snapshot.exists()) {

        console.log(

          "✅ PROFILE FOUND BY MOBILE:",

          mobileNumber

        );

      }

    }



    // =========================

    // DOCUMENT EXISTS

    // =========================



    if (snapshot && snapshot.exists()) {

      const data = snapshot.data();



      console.log(

        "🌐 BUSINESS DATA =",

        data

      );



      const fixedImage = normalizeImageValue(

        data?.image

      );



      if (fixedImage.startsWith("data:image/")) {

        console.log("✅ MOBILE LOAD: BASE64 IMAGE");

        console.log(

          "📦 BASE64 LENGTH =",

          fixedImage.length

        );

      } else if (

        fixedImage.startsWith("http://") ||

        fixedImage.startsWith("https://")

      ) {

        console.log("🌐 MOBILE LOAD: REMOTE IMAGE");

      } else if (data?.image) {

        console.log(

          "⚠️ MOBILE LOAD: INVALID/OLD IMAGE PATH"

        );

      }



      setShop({

        ...data,

        image: fixedImage,

      });

    } else {

      Alert.alert(

        "No Data",

        "Business profile not found"

      );

    }









  } catch (e) {







    console.log(



      "❌ BUSINESS ERROR =",



      e



    );







    Alert.alert(







      "Error",







      "Failed to load business profile"



    );







  } finally {







    // =========================



    // LOADING END



    // =========================







    setLoading(false);



  }



};







  // LOADING







  if (loading) {







    return (







      <View



        style={



          styles.loaderContainer



        }



      >







        <ActivityIndicator



          size="large"



          color="#0f172a"



        />







      </View>



    );



  }







  return (











  <View



    style={{



      flex: 1,



      backgroundColor:



        '#f8fafc',



    }}



  >











      <StatusBar



        translucent



        backgroundColor="transparent"



        barStyle="light-content"



      />







      {/* HEADER */}















<LinearGradient



  colors={[



    "#4F46E5",



    "#6366F1",



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







  <View



    style={styles.headerTopRow}



  >







    {/* BACK BUTTON */}







    <TouchableOpacity



      onPress={() =>



        router.back()



      }



      activeOpacity={0.8}



      style={{



        width: 44,



        height: 44,



        borderRadius: 14,



        backgroundColor:



          "rgba(255,255,255,0.15)",



        justifyContent:



          "center",



        alignItems:



          "center",



      }}



    >



      <MaterialCommunityIcons



        name="arrow-left"



        size={24}



        color="#FFF"



      />



    </TouchableOpacity>







    {/* TITLE */}







    <View



      style={{



        flex: 1,



        marginLeft: 14,



      }}



    >



      <Text



        style={{



          fontSize: 24,



          fontWeight: "800",



          color: "#FFF",



        }}



      >



        Business Details



      </Text>







      <Text



        style={{



          fontSize: 13,



          color:



            "rgba(255,255,255,0.85)",



          marginTop: 2,



        }}



      >



        Manage Shop Profile



      </Text>



    </View>







    {/* STORE ICON */}







    <View



      style={{



        width: 46,



        height: 46,



        borderRadius: 14,



        backgroundColor:



          "rgba(255,255,255,0.15)",



        justifyContent:



          "center",



        alignItems:



          "center",



      }}



    >



      <MaterialCommunityIcons



        name="store"



        size={24}



        color="#FFF"



      />



    </View>







  </View>







</LinearGradient>







      {/* PROFILE IMAGE */}







<TouchableOpacity







  style={



    styles.profileContainer



  }







  activeOpacity={0.9}







  onPress={pickImage}



>







  {



    shop?.image ? (







      <Image







        source={{



          uri:



            shop.image,



        }}







        style={



          styles.image



        }







        resizeMode="cover"







      />







    ) : (







      <Image







        source={



          require(



            '../../../assets/images/store.png'



          )



        }







        style={



          styles.image



        }







        resizeMode="cover"







      />







    )



  }







  {/* CAMERA ICON */}







  <View



    style={{







      position: 'absolute',







      bottom: 6,







      right: 86,







      width: 38,







      height: 38,







      borderRadius: 19,







      backgroundColor:



        '#0f172a',







      justifyContent:



        'center',







      alignItems:



        'center',



    }}



  >







    <MaterialCommunityIcons



      name="camera"



      size={20}



      color="#fff"



    />







  </View>







</TouchableOpacity>







    <ScrollView







      style={{



        flex: 1,



      }}







      contentContainerStyle={{







        padding: 16,







        paddingBottom: 140,







        flexGrow: 1,



      }}







      showsVerticalScrollIndicator={



        false



      }







      keyboardShouldPersistTaps="handled"







    >











      {/* DETAILS */}











      <View style={styles.modernCard}>







  <View



    style={{



      flexDirection: "row",



      alignItems: "center",



      marginBottom: 18,



    }}



  >



    <View



      style={styles.iconContainer}



    >



      <MaterialCommunityIcons



        name="store"



        size={22}



        color="#4F46E5"



      />



    </View>







    <View



      style={{



        marginLeft: 12,



      }}



    >



      <Text



        style={styles.sectionTitle}



      >



        Business Information



      </Text>







      <Text



        style={styles.sectionSubTitle}



      >



        Shop & Owner Details



      </Text>



    </View>



  </View>







  <TextInput



    label="Shop Name"



    mode="outlined"



    value={shop?.shopName || ""}



    onChangeText={(t) =>



      setShop({



        ...shop,



        shopName: t,



      })



    }



    style={styles.modernInput}



    left={



      <TextInput.Icon



        icon="storefront"



        color="#4F46E5"



      />



    }



  />







  <TextInput



    label="Owner Name"



    mode="outlined"



    value={shop?.ownerName || ""}



    onChangeText={(t) =>



      setShop({



        ...shop,



        ownerName: t,



      })



    }



    style={styles.modernInput}



    left={



      <TextInput.Icon



        icon="account-circle"



        color="#10B981"



      />



    }



  />







  <View style={styles.row}>







    <TextInput



      label="Mobile"



      mode="outlined"



      keyboardType="phone-pad"



      value={shop?.mobile || ""}



      onChangeText={(t) =>



        setShop({



          ...shop,



          mobile: t,



        })



      }



      style={styles.halfInput}



      left={



        <TextInput.Icon



          icon="phone"



          color="#2563EB"



        />



      }



    />















  </View>



 <TextInput



      label="Email"



      mode="outlined"



      keyboardType="email-address"



      value={shop?.email || ""}



      onChangeText={(t) =>



        setShop({



          ...shop,



          email: t,



        })



      }



      style={styles.halfInput}



      left={



        <TextInput.Icon



          icon="email"



          color="#F97316"



        />



      }



    />



</View>











<View style={styles.modernCard}>







  <View



    style={{



      flexDirection: "row",



      alignItems: "center",



      marginBottom: 18,



    }}



  >



    <View



      style={styles.iconContainer}



    >



      <MaterialCommunityIcons



        name="map-marker"



        size={22}



        color="#EF4444"



      />



    </View>







    <Text



      style={[



        styles.sectionTitle,



        {



          marginLeft: 12,



        },



      ]}



    >



      Address Details



    </Text>



  </View>







  <TextInput



    label="Address"



    mode="outlined"



    multiline



    numberOfLines={4}



    value={shop?.address || ""}



    onChangeText={(t) =>



      setShop({



        ...shop,



        address: t,



      })



    }



    style={styles.modernInput}



    left={



      <TextInput.Icon



        icon="map-marker-outline"



      />



    }



  />







  <TextInput



    label="Categories"



    mode="outlined"



    value={shop?.categories || ""}



    onChangeText={(t) =>



      setShop({



        ...shop,



        categories: t,



      })



    }



    style={styles.modernInput}



    left={



      <TextInput.Icon



        icon="shape-outline"



      />



    }



  />







</View>











<View style={styles.modernCard}>







  <View



    style={{



      flexDirection: "row",



      alignItems: "center",



      marginBottom: 18,



    }}



  >



    <View



      style={styles.iconContainer}



    >



      <MaterialCommunityIcons



        name="clock-outline"



        size={22}



        color="#10B981"



      />



    </View>







    <Text



      style={[



        styles.sectionTitle,



        {



          marginLeft: 12,



        },



      ]}



    >



      Shop Timings



    </Text>



  </View>















 <TouchableOpacity



  activeOpacity={0.9}



  onPress={() =>



    setOpenTimePicker(true)



  }



>



  <View pointerEvents="none">







    <TextInput



      label="Open Time"



      value={



        shop?.openTime || ""



      }



      mode="outlined"



      editable={false}







      left={



        <TextInput.Icon



          icon="clock-start"



          color="#10B981"



        />



      }







      right={



        <TextInput.Icon



          icon="chevron-down"



          color="#64748B"



        />



      }







      style={{



        backgroundColor: "#FFF",



        marginBottom: 14,



      }}







      outlineColor="#E2E8F0"



      activeOutlineColor="#10B981"







      contentStyle={{



        fontSize: 15,



        fontWeight: "600",



      }}



    />







  </View>



</TouchableOpacity>











{



  openTimePicker && (







    <DateTimePicker



      value={new Date()}



      mode="time"



      is24Hour={false}



      display="default"



      onChange={(



        event,



        selectedDate



      ) => {







        setOpenTimePicker(



          false



        );







        if (



          selectedDate



        ) {







          const time =



            selectedDate.toLocaleTimeString(



              [],



              {



                hour: "2-digit",



                minute:



                  "2-digit",



              }



            );







          setShop({



            ...shop,



            openTime:



              time,



          });







        }







      }}



    />







  )



}







 <TouchableOpacity



  activeOpacity={0.9}



  onPress={() =>



    setCloseTimePicker(true)



  }



>



  <View pointerEvents="none">







    <TextInput



      label="Close Time"



      mode="outlined"



      value={



        shop?.closeTime || ""



      }



      editable={false}







      left={



        <TextInput.Icon



          icon="clock-end"



          color="#EF4444"



        />



      }







      right={



        <TextInput.Icon



          icon="chevron-down"



          color="#64748B"



        />



      }







      style={{



        backgroundColor: "#FFF",



      }}







      outlineColor="#E2E8F0"



      activeOutlineColor="#EF4444"



    />







  </View>



</TouchableOpacity>











{



  closeTimePicker && (







    <DateTimePicker



      value={new Date()}



      mode="time"



      is24Hour={false}



      display="default"



      onChange={(



        event,



        selectedDate



      ) => {







        setCloseTimePicker(



          false



        );







        if (



          selectedDate



        ) {







          const time =



            selectedDate.toLocaleTimeString(



              [],



              {



                hour: "2-digit",



                minute:



                  "2-digit",



              }



            );







          setShop({



            ...shop,



            closeTime:



              time,



          });







        }







      }}



    />







  )



}















</View>



































      {/* VERIFIED */}







    <TouchableOpacity







  style={styles.button}







  activeOpacity={0.9}







  onPress={async () => {







    try {







      // =========================



      // VALIDATION



      // =========================







      if (



        !shop?.shopName



      ) {







        Alert.alert(



          'Error',



          'Enter shop name'



        );







        return;



      }







      if (



        !shop?.mobile



      ) {







        Alert.alert(



          'Error',



          'Enter mobile number'



        );







        return;



      }







      // =========================



      // PROFILE DATA



      // =========================







      const profileData = {

        ...shop,



        // Always save Base64 data URI (never an Expo file:// path).

        image: normalizeImageValue(shop?.image),



        id:



          shop?.id ||







          Date.now()



            .toString(),







        updatedAt:



          new Date()



            .toISOString(),



      };







      // =========================



      // SAVE ONLINE



      // =========================















const loggedInUser = await getLoggedInUser();

      const accountEmail = String(
        loggedInUser?.email || profileData?.email || ""
      )
        .trim()
        .toLowerCase();

      if (!accountEmail) {
        Alert.alert(
          "Error",
          "Logged-in account email was not found."
        );
        return;
      }

      if (shop?.image?.startsWith("file://")) {
        Alert.alert(
          "Image Error",
          "Please select the shop image again. The old local image cannot be saved."
        );
        return;
      }

      if (profileData.image &&
          !profileData.image.startsWith("data:image/") &&
          !profileData.image.startsWith("http://") &&
          !profileData.image.startsWith("https://")) {
        Alert.alert(
          "Image Error",
          "Invalid image format. Please select the image again."
        );
        return;
      }

      const firestoreData = {
        ...profileData,
        email: accountEmail,
        image: profileData.image || "",
      };

      console.log("👤 LOGGED-IN ACCOUNT EMAIL =", accountEmail);
      console.log(
        "🖼 IMAGE BEFORE FIRESTORE SAVE =",
        firestoreData.image?.startsWith("data:image/")
          ? `BASE64 (${firestoreData.image.length} chars)`
          : firestoreData.image || "EMPTY"
      );
      console.log(
        "🔥 FIRESTORE PATH = shopProfiles/" + accountEmail
      );
      console.log("🔥 STARTING FIRESTORE SAVE...");

      await setDoc(
        doc(db, "shopProfiles", accountEmail),
        firestoreData,
        { merge: true }
      );

      console.log("✅ FIRESTORE setDoc COMPLETED");

      const verifyRef = doc(
        db,
        "shopProfiles",
        accountEmail
      );

      const verifySnap = await getDoc(verifyRef);

      if (!verifySnap.exists()) {
        throw new Error(
          `Firestore document was not created: shopProfiles/${accountEmail}`
        );
      }

      const savedFirestoreData = verifySnap.data();

      console.log("✅ FIRESTORE PROFILE VERIFIED");
      console.log("📄 SAVED EMAIL =", savedFirestoreData?.email);
      console.log(
        "🖼 SAVED IMAGE =",
        savedFirestoreData?.image?.startsWith("data:image/")
          ? `BASE64 (${savedFirestoreData.image.length} chars)`
          : savedFirestoreData?.image || "EMPTY"
      );

      // UPDATE LOCAL



      // =========================







      let localSaved =



        false;







      if (shop?.id) {







        console.log(



          '✏️ UPDATE PROFILE'



        );







        localSaved =







          await updateProfileLocal(



            profileData



          );







      } else {







        console.log(



          '💾 SAVE PROFILE'



        );







        await clearProfile();







        localSaved =







          await saveProfileLocal(



            profileData



          );



      }







      // =========================



      // RESULT



      // =========================







      if (localSaved) {







        setShop(



          profileData



        );







        Alert.alert(



          'Success',



          shop?.id







            ? 'Profile Updated Successfully'







            : 'Profile Saved Successfully'



        );







      } else {







        Alert.alert(



          'Error',



          'Local save failed'



        );



      }







    } catch (error) {







      console.log(



        '❌ BUTTON ERROR:',



        error



      );







      Alert.alert(



        'Error',



        'Something went wrong'



      );







    }







  }











  }



>







  {/* ICON */}







  <MaterialCommunityIcons







    name={



      shop?.id







        ? "content-save-edit"







        : "content-save"



    }







    size={22}







    color="#fff"







  />







  {/* TEXT */}







  <Text



    style={



      styles.buttonText



    }



  >







    {



      shop?.id







        ? "Update Profile"







        : "Save Profile"



    }







  </Text>







</TouchableOpacity>



    </ScrollView>



    </View>



  );



}







// DETAIL ITEM







function DetailItem({



  icon,



  title,



  value,



}) {







  return (







    <View style={styles.detailItem}>







      {/* ICON */}







      <View style={styles.iconBox}>







        <MaterialCommunityIcons



          name={icon}



          size={22}



          color="#0f172a"



        />







      </View>







      {/* CONTENT */}







      <View style={{ flex: 1 }}>







        <Text



          style={



            styles.detailTitle



          }



        >



          {title}



        </Text>







        <Text



          style={



            styles.detailValue



          }



        >



          {value || "N/A"}



        </Text>







      </View>







    </View>



  );



}