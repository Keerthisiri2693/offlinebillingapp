import React,
{
  useState,useEffect
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import DateTimePicker
from '@react-native-community/datetimepicker';
import {
  TextInput,
  Button,
  Card,Menu,
} from 'react-native-paper';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import styles
from '../style/PurchaseReturnStyle';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {
  useRouter,
} from 'expo-router';

import {getDB,
  savePurchaseReturn,getParty,searchProductsByFirstLetter
} from '../database/sqlite';

export default function FullBillingScreen() {

useEffect(() => {

  loadLedgers();

}, []);

const loadLedgers =
  async () => {

  try {

    const data =
      await getParty();

    setLedgerList(

      Array.isArray(data)
        ? data
        : []

    );

  } catch (e) {

    console.log(
      '❌ loadLedgers:',
      e
    );

  }

};


useEffect(() => {
  loadProducts();
}, []);

const loadProducts = async () => {
  try {

    const db = await getDB();

    const result =
      await db.getAllAsync(
        `SELECT * FROM products`
      );

    setProducts(result || []);

    console.log(
      "Products Loaded:",
      result?.length
    );

  } catch (e) {

    console.log(
      "Load Products Error:",
      e
    );

  }
};


const [products, setProducts] =
  useState([]);
const [mobileNo, setMobileNo] =
  useState("");


  const searchProductsByFirstLetter =
  text => {

    if (!products?.length)
      return [];

    if (!text?.trim())
      return products;

    return products.filter(
      item =>
        item?.productenglishname
          ?.toLowerCase()
          .includes(
            text.toLowerCase()
          )
    );
};

  const [activeIndex,
    setActiveIndex] =
    useState(null);
  
  const [suggestions,
    setSuggestions] =
    useState([]);
  
    const [
  paidTypeMenuVisible,
  setPaidTypeMenuVisible
] = useState(false);
  
  const [ledgerMenuVisible,
    setLedgerMenuVisible] =
    useState(false);
  
  const [selectedLedger,
    setSelectedLedger] =
    useState('COMMON CASH');
  
  const [ledgerList,
    setLedgerList] =
    useState([]);



  const navigation =
    useNavigation();

  const route =
    useRoute();

  const router =
    useRouter();

  const params =
    route.params || {};

  const isEdit =
    !!params?.id;

  // ================= HEADER =================

  const [date,
  setDate] =
  useState(
    new Date()
  );

const [showDatePicker,
  setShowDatePicker] =
  useState(false);

  const [invoiceNo,
    setInvoiceNo] =
    useState("");

  const [ledger,
    setLedger] =
    useState(
      "COMMON CASH"
    );

  const [customer,
    setCustomer] =
    useState('');


  const [paidType,
    setPaidType] =
    useState("CASH");

  const [stateVal,
    setStateVal] =
    useState(
      ""
    );

  const [city,
    setCity] =
    useState('');

  // ================= SUMMARY =================

  const [vehicleNo,
    setVehicleNo] =
    useState(
      ""
    );

  const [customerName,
    setCustomerName] =
    useState('');

  const [discountPercent,
    setDiscountPercent] =
    useState(0);

  // ================= EXPAND =================

  const [expandedId,
    setExpandedId] =
    useState(null);

  // ================= ITEMS =================

 const [items,
  setItems] =
  useState([
    {
      id:
        Date.now()
          .toString(),

      productcode: '',

      producttype: '',

      product: '',

      qty: 1,

      rate: 0,

      stock: '',

      sc: '',

      unittype: '',

      uom: '',

      sgst: '',

      cgst: '',

      igst: '',

      weight: '',

      netRate: '',

      mc: '',

      mcTotal: '',

      totalWeight: '',

      stockTotal: '',
    },
  ]);

  // ================= SAFE ITEMS =================

  const safeItems =
    Array.isArray(items)
      ? items
      : [];

  // ================= AUTO CALCULATION =================

  // SUBTOTAL

  const subtotal =

    safeItems.reduce(

      (sum, item) => {

        const qty =
          Number(
            item.qty
          ) || 0;

        const rate =
          Number(
            item.rate
          ) || 0;

        return (
          sum +
          (qty * rate)
        );

      },

      0
    );

  // DISCOUNT AMOUNT

  const discountAmount =

    subtotal *

    (
      Number(
        discountPercent
      ) || 0
    ) / 100;

  // FINAL TOTAL

  const total =

    Math.max(

      subtotal -
      discountAmount,

      0
    );

  // ================= SAVE =================

  const handleSaveAndView =
  async () => {

  try {

    // =========================
    // SAFE ITEMS
    // =========================

    const safeItems =

      Array.isArray(items)
        ? items
        : [];

    // =========================
    // VALID ITEMS
    // =========================

    const validItems =

      safeItems.filter(

        i =>

          i?.product?.trim()

      );

    // =========================
    // EMPTY VALIDATION
    // =========================

    if (
      !validItems.length
    ) {

      alert(
        "Add at least one product"
      );

      return;

    }

    // =========================
    // INVALID QTY
    // =========================

    const hasInvalidQty =

      validItems.some(

        i =>

          Number(
            i.qty || 0
          ) <= 0

      );

    if (hasInvalidQty) {

      alert(
        'Enter valid quantity'
      );

      return;

    }

    // =========================
    // CREATE ID
    // =========================

    const id =

      Date.now()
        .toString();

    // =========================
    // HEADER DATA
    // =========================

    const data = {

      id,

      date:

        date.toLocaleDateString(
          'en-GB'
        ),

      invoiceNo:

        Number(
          invoiceNo || 0
        ),

      ledger:
        ledger || '',

      customer:
        customer || '',

      paidType:
        paidType || '',

      state:
        stateVal || '',

      city:
        city || '',

      vehicleNo:
        vehicleNo || '',

      customerName:
        customerName || '',

      discountPercent:

        Number(
          discountPercent || 0
        ),

      discountAmount:

        Number(
          discountAmount || 0
        ),

      subtotal:

        Number(
          subtotal || 0
        ),

      total:

        Number(
          total || 0
        ),

      createdAt:
        new Date()
          .toISOString(),

    };

    // =========================
    // CLEAN ITEMS
    // =========================

    const cleanItems =

      validItems.map(
        item => ({

          id:

            Date.now()
              .toString() +

            Math.random(),

          purchaseReturnId:
            id,

          product:
            item.product || '',

          qty:

            Number(
              item.qty || 0
            ),

          rate:

            Number(
              item.rate || 0
            ),

          amount:

            Number(
              item.amount ||

              (
                Number(
                  item.qty || 0
                ) *

                Number(
                  item.rate || 0
                )

              )

            ),

          batch:
            item.batch || '',

          unit:
            item.unit || '',

          uom:
            item.uom || '',

          weight:
            item.weight || '',

          netRate:

            Number(
              item.netRate || 0
            ),

          sgst:

            Number(
              item.sgst || 0
            ),

          cgst:

            Number(
              item.cgst || 0
            ),

          igst:

            Number(
              item.igst || 0
            ),

        })
      );

    console.log(
      '📦 PURCHASE RETURN:',
      data
    );

    console.log(
      '📦 ITEMS:',
      cleanItems
    );

    // =========================
    // SAVE
    // =========================

    const res =

      await savePurchaseReturn(
        data,
        cleanItems
      );

    // =========================
    // FAILED
    // =========================

    if (!res) {

      alert(
        "Save failed"
      );

      return;

    }

    // =========================
    // SUCCESS
    // =========================

    alert(
      'Purchase Return Saved'
    );

    router.push({

      pathname:
        "/src/screens/ViewPurchaseReturn",

      params: {
        id
      }

    });

  } catch (e) {

    console.log(
      '❌ handleSaveAndView:',
      e
    );

    alert(
      'Failed to save'
    );

  }

};

  // ================= ADD ROW =================

const addRow = () => {

  setItems([
    ...safeItems,

    {
      id:
        Date.now()
          .toString(),

      productcode: '',

      producttype: '',

      product: '',

      qty: 1,

      rate: 0,

      stock: '',

      sc: '',

      unittype: '',

      uom: '',

      sgst: '',

      cgst: '',

      igst: '',

      weight: '',

      netRate: '',

      mc: '',

      mcTotal: '',

      totalWeight: '',

      stockTotal: '',
    },
  ]);

};

  // ================= UPDATE ITEM =================

const updateItem = (
  index,
  key,
  value,
) => {

  const newItems =
    [...safeItems];

  newItems[index] = {

    ...newItems[index],

    [key]: value,
  };

  setItems(newItems);

};

  // ================= REMOVE =================

  const removeItem =
    id => {

    if (
      safeItems.length === 1
    ) return;

    setItems(

      safeItems.filter(
        item =>
          item.id !== id
      )

    );

  };

  // ================= RESET =================


  const handleReset =
  () => {

  setDate(
    new Date()
  );

  setInvoiceNo(

    Date.now()
      .toString()
      .slice(-6)

  );

  setLedger(
    "COMMON CASH"
  );

  setCustomer('');

  setPaidType(
    "CASH"
  );

  setStateVal('');

  setCity('');

  setVehicleNo(
    "TN01AB1234"
  );

  setCustomerName('');

  setDiscountPercent(0);

  setExpandedId(null);

  setItems([
    {
      id:
        Date.now()
          .toString(),

      productcode: '',

      producttype: '',

      product: '',

      qty: 1,

      rate: 0,

      stock: '',

      sc: '',

      unittype: '',

      uom: '',

      sgst: '',

      cgst: '',

      igst: '',

      weight: '',

      netRate: '',

      mc: '',

      mcTotal: '',

      totalWeight: '',

      stockTotal: '',
    },
  ]);

};



  return (
    <View style={{flex: 1}}>
      <StatusBar
        backgroundColor="#203a43"
        barStyle="light-content"
      />

      {/* HEADER */}

 <LinearGradient
  colors={["#4F46E5", "#6366F1"]}
  style={{
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  }}
>
  <SafeAreaView>

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >

      {/* LEFT SIDE */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor:
              "rgba(255,255,255,0.15)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text
          style={{
            color: "#FFF",
            fontSize: 22,
            fontWeight: "900",
            marginLeft: 12,
          }}
        >
          Purchase Return
        </Text>
      </View>

     

    </View>

    <Text
      style={{
        color: "rgba(255,255,255,0.8)",
        marginTop: 8,
        marginLeft: 54,
        fontSize: 13,
      }}
    >
      Create and manage purchase returns
    </Text>

  </SafeAreaView>
</LinearGradient>

      {/* BODY */}
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            paddingBottom: 120,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled">

          {/* DETAILS */}
       <Card
  style={{
    margin: 12,
    borderRadius: 24,
    padding: 16,
    backgroundColor: "#FFF",
    elevation: 4,
  }}
>
  {/* HEADER */}

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    }}
  >
    <MaterialCommunityIcons
      name="cart-outline"
      size={24}
      color="#4F46E5"
    />

    <Text
      style={{
        marginLeft: 8,
        fontSize: 18,
        fontWeight: "900",
        color: "#111827",
      }}
    >
      Purchase Details
    </Text>
  </View>

  {/* DATE + INVOICE */}

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    }}
  >
    <TouchableOpacity
      style={{ width: "48%" }}
      onPress={() =>
        setShowDatePicker(true)
      }
    >
      <View
        style={{
          backgroundColor: "#EEF2FF",
          borderRadius: 16,
          padding: 12,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            color: "#4F46E5",
            fontWeight: "700",
          }}
        >
          DATE
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 15,
            fontWeight: "800",
          }}
        >
          {date.toLocaleDateString(
            "en-GB"
          )}
        </Text>
      </View>
    </TouchableOpacity>

    <View
      style={{
        width: "48%",
        backgroundColor: "#DCFCE7",
        borderRadius: 16,
        padding: 12,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          color: "#16A34A",
          fontWeight: "700",
        }}
      >
        INVOICE NO
      </Text>
<TextInput
  mode="flat"
  value={invoiceNo}
  placeholder="Search Purchase No"
  keyboardType="numeric"
  underlineColor="transparent"
  activeUnderlineColor="transparent"
  onChangeText={async value => {

    setInvoiceNo(value);

    if (!value.trim()) {

      setItems([]);

      return;

    }

try {

  const db = await getDB();

  // =========================
  // GET PURCHASE
  // =========================

  const purchase =
    await db.getFirstAsync(
      `
      SELECT *
      FROM purchases
      WHERE purchaseNo = ?
      `,
      [
        String(value)
      ]
    );

  console.log(
    "📦 PURCHASE:",
    purchase
  );

  if (!purchase) {

    setCustomer("");
    setMobileNo("");
    setLedger("COMMON CASH");
    setItems([]);

    return;

  }

  // =========================
  // GET PURCHASE ITEMS
  // =========================

  const purchaseItems =
    await db.getAllAsync(
      `
      SELECT *
      FROM purchase_items
      WHERE purchaseNo = ?
      ORDER BY createdAt DESC
      `,
      [
        String(
          purchase.purchaseNo
        )
      ]
    );

  console.log(
    "📦 PURCHASE ID:",
    purchase.id
  );

  console.log(
    "📦 PURCHASE NO:",
    purchase.purchaseNo
  );

  console.log(
    "📦 PURCHASE ITEMS:",
    JSON.stringify(
      purchaseItems,
      null,
      2
    )
  );

  // =========================
  // HEADER DETAILS
  // =========================

  setCustomer(
    purchase.supplier || ""
  );

  setMobileNo(
    purchase.purchaseMobileNo || ""
  );

  setLedger(
    purchase.ledger ||
    "COMMON CASH"
  );

  // =========================
  // FORMAT ITEMS
  // =========================

  const formattedItems =
    purchaseItems.map(item => ({

      id:
        item.id ||
        Date.now().toString(),

      product:
        item.product || "",

      productcode:
        item.productcode || "",

      qty:
        Number(
          item.qty || 0
        ),

      rate:
        Number(
          item.rate || 0
        ),

      amount:
        Number(
          item.amount || 0
        ),

      uom:
        item.uom || "",

      weight:
        item.weight || "",

      batch:
        item.batch || "",

      sgst:
        Number(
          item.sgst || 0
        ),

      cgst:
        Number(
          item.cgst || 0
        ),

      igst:
        Number(
          item.igst || 0
        ),

      isSelected:
        false,

    }));

  console.log(
    "✅ FORMATTED ITEMS:",
    formattedItems
  );

  setItems(
    formattedItems
  );

} catch (e) {

  console.log(
    "❌ LOAD PURCHASE:",
    e
  );

}

  }}
  style={{
    backgroundColor:
      "transparent",
    height: 30,
  }}
/>
    </View>
  </View>

  {/* LEDGER */}
<Menu
  visible={ledgerMenuVisible}
  onDismiss={() =>
    setLedgerMenuVisible(false)
  }
  anchor={
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        setLedgerMenuVisible(true)
      }
    >
      <View
        style={{
          backgroundColor: "#FEF3C7",
          borderRadius: 16,
          padding: 14,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#FCD34D",
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
          >
            <MaterialCommunityIcons
              name="account-cash"
              size={18}
              color="#D97706"
            />

            <View
              style={{
                marginLeft: 8,
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: "#D97706",
                  fontWeight: "700",
                }}
              >
                LEDGER
              </Text>

              <Text
                style={{
                  marginTop: 2,
                  fontSize: 15,
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                {ledger ||
                  "Select Ledger"}
              </Text>
            </View>
          </View>

          <MaterialCommunityIcons
            name="chevron-down"
            size={22}
            color="#D97706"
          />
        </View>
      </View>
    </TouchableOpacity>
  }
>
  {ledgerList.map(item => (
    <Menu.Item
      key={item.id}
      title={item.nameEnglish}
      onPress={() => {
        setLedger(
          item.nameEnglish
        );
        setLedgerMenuVisible(
          false
        );
      }}
    />
  ))}

  <Menu.Item
    title="+ Add Ledger"
    onPress={() => {
      setLedgerMenuVisible(
        false
      );

      router.push(
        "/src/screens/LedgerMaster"
      );
    }}
  />
</Menu>


 <Menu
  visible={paidTypeMenuVisible}
  onDismiss={() =>
    setPaidTypeMenuVisible(false)
  }
  anchor={
    <TouchableOpacity
      activeOpacity={0.9}
      style={{ width: "100%" }}
      onPress={() =>
        setPaidTypeMenuVisible(true)
      }
    >
      <View
        style={{
          backgroundColor: "#FEE2E2",
          borderRadius: 16,
          padding: 12,
          borderWidth: 1,
          marginBottom:20,
          borderColor: "#FECACA",
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
          >
            <MaterialCommunityIcons
              name="cash-multiple"
              size={16}
              color="#DC2626"
            />

            <View
              style={{
                marginLeft: 8,
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: "#DC2626",
                  fontWeight: "700",
                }}
              >
                PAID TYPE
              </Text>

              <Text
                style={{
                  marginTop: 2,
                  fontSize: 15,
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                {paidType || "Select Type"}
              </Text>
            </View>
          </View>

          <MaterialCommunityIcons
            name="chevron-down"
            size={22}
            color="#DC2626"
          />
        </View>
      </View>
    </TouchableOpacity>
  }
>
  <Menu.Item
    title="💵 CASH"
    onPress={() => {
      setPaidType("CASH");
      setPaidTypeMenuVisible(false);
    }}
  />

  <Menu.Item
    title="📱 UPI"
    onPress={() => {
      setPaidType("UPI");
      setPaidTypeMenuVisible(false);
    }}
  />

  <Menu.Item
    title="💳 CARD"
    onPress={() => {
      setPaidType("CARD");
      setPaidTypeMenuVisible(false);
    }}
  />

  <Menu.Item
    title="📒 CREDIT"
    onPress={() => {
      setPaidType("CREDIT");
      setPaidTypeMenuVisible(false);
    }}
  />
</Menu>

  {/* NAME + STATE */}

<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  }}
>

  {/* CUSTOMER */}

  <View
    style={{
      width: "48%",
      backgroundColor: "#DBEAFE",
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: "#BFDBFE",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="account"
        size={16}
        color="#2563EB"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          color: "#2563EB",
          fontWeight: "700",
        }}
      >
        CUSTOMER
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={customer}
      onChangeText={setCustomer}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 34,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 15,
        fontWeight: "700",
      }}
    />
  </View>

  {/* STATE */}

  <View
    style={{
      width: "48%",
      backgroundColor: "#DCFCE7",
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: "#BBF7D0",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="map-marker"
        size={16}
        color="#16A34A"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          color: "#16A34A",
          fontWeight: "700",
        }}
      >
        STATE
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={stateVal}
      onChangeText={setStateVal}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 34,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 15,
        fontWeight: "700",
      }}
    />
  </View>

</View>

  {/* CITY + PAID TYPE */}
<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
  }}
>

  {/* CITY */}

  <View
    style={{
      width: "48%",
      backgroundColor: "#F3E8FF",
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: "#DDD6FE",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="city"
        size={16}
        color="#7C3AED"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          color: "#7C3AED",
          fontWeight: "700",
        }}
      >
        CITY
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={city}
      onChangeText={setCity}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 34,
      }}
      contentStyle={{
        padding: 0,
        fontSize: 15,
        fontWeight: "700",
      }}
    />
  </View>

  {/* PAID TYPE */}
  
  </View>
</Card>


          {/* PRODUCTS */}
          {items.map(
            (item, index) => {
              const amount =
                item.qty *
                item.rate;

              const isOpen =
                expandedId ===
                item.id;

              return (
                <Card
                  key={item.id}
                  style={
                    styles.productCard
                  }>
                  <View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  }}
>
<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  }}
>
  <TouchableOpacity
    onPress={() => {

      const updatedItems = [...items];

      updatedItems[index] = {
        ...updatedItems[index],
        isSelected:
          !updatedItems[index]
            ?.isSelected,
      };

      setItems(updatedItems);

    }}
    style={{
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: "#10B981",
      backgroundColor:
        item?.isSelected
          ? "#10B981"
          : "#FFF",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    }}
  >
    {item?.isSelected && (
      <MaterialCommunityIcons
        name="check"
        size={16}
        color="#FFF"
      />
    )}
  </TouchableOpacity>

 
</View>
  {/* PRODUCT TYPE */}

  <View
    style={{
      width: "40%",
      backgroundColor: "#EEF2FF",
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: "#C7D2FE",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="shape-outline"
        size={16}
        color="#4F46E5"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          color: "#4F46E5",
          fontWeight: "700",
        }}
      >
        PRODUCT TYPE
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={item.producttype || ""}
      onChangeText={v =>
        updateItem(
          index,
          "producttype",
          v
        )
      }
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 36,
      }}
      contentStyle={{
        fontSize: 15,
        fontWeight: "700",
      }}
    />
  </View>

  {/* PRODUCT CODE */}

  <View
    style={{
      width: "48%",
      backgroundColor: "#FEF3C7",
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: "#FCD34D",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="barcode"
        size={16}
        color="#D97706"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          color: "#D97706",
          fontWeight: "700",
        }}
      >
        PRODUCT CODE
      </Text>
    </View>

    <TextInput
      mode="flat"
      value={item.productcode || ""}
      onChangeText={v =>
        updateItem(
          index,
          "productcode",
          v
        )
      }
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 36,
      }}
      contentStyle={{
        fontSize: 15,
        fontWeight: "700",
      }}
    />
  </View>

</View>

<View
  style={{
    position: "relative",
    zIndex:
      activeIndex === index
        ? 9999
        : 1,
    marginBottom: 12,
  }}
>

  {/* SEARCH CARD */}

  <View
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      borderWidth: 1,
      borderColor:
        activeIndex === index
          ? "#6366F1"
          : "#E5E7EB",
      overflow: "hidden",
    }}
  >

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingTop: 10,
      }}
    >
      <MaterialCommunityIcons
        name="package-variant-closed"
        size={18}
        color="#6366F1"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          color: "#6366F1",
          fontWeight: "700",
        }}
      >
        PRODUCT SEARCH
      </Text>
    </View>

    <TextInput
      mode="flat"
      placeholder="Search product..."
      value={item?.product || ""}
      onFocus={() => {
        setActiveIndex(index);

        const result =
          searchProductsByFirstLetter(
            item?.product || ""
          );

        setSuggestions(
          Array.isArray(result)
            ? result
            : []
        );
      }}
      onChangeText={value => {

        updateItem(
          index,
          "product",
          value
        );

        const result =
          searchProductsByFirstLetter(
            value
          );

        setSuggestions(
          Array.isArray(result)
            ? result
            : []
        );

      }}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 42,
      }}
      contentStyle={{
        fontSize: 16,
        fontWeight: "700",
      }}
      right={
        <TextInput.Icon
          icon="magnify"
          color="#6366F1"
        />
      }
    />
  </View>

  {/* PRODUCT DROPDOWN */}

  {activeIndex === index &&
    suggestions?.length > 0 && (

    <View
      style={{
        position: "absolute",
        top: 78,
        left: 0,
        right: 0,
        backgroundColor: "#FFF",
        borderRadius: 22,
        elevation: 15,
        zIndex: 99999,
        maxHeight: 320,
      }}
    >

      {/* HEADER */}

      <View
        style={{
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
          flexDirection: "row",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontWeight: "800",
            color: "#111827",
          }}
        >
          Products
        </Text>

        <View
          style={{
            backgroundColor:
              "#EEF2FF",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: "#4F46E5",
              fontWeight: "700",
            }}
          >
            {suggestions.length}
          </Text>
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
      >

        {suggestions.map(product => (

          <TouchableOpacity
            key={product?.id}
            activeOpacity={0.85}
            style={{
              padding: 14,
              borderBottomWidth: 1,
              borderBottomColor:
                "#F3F4F6",
            }}
          onPress={() => {

  const updated = [...safeItems];

  updated[index] = {

    ...updated[index],

    product:
      product?.productenglishname || "",

    producttype:
      product?.producttype || "",

    productcode:
      product?.productcode || "",

    barcode:
      product?.barcode || "",

    purchase:
      Number(
        product?.purchase || 0
      ),

    pRate:
      Number(
        product?.purchase || 0
      ),

    wholesale:
      Number(
        product?.wholesale || 0
      ),

    retail:
      Number(
        product?.retail || 0
      ),

    stockquantity:
      Number(
        product?.stockquantity || 0
      ),

    stock:
      Number(
        product?.stockquantity || 0
      ),

    qty:
      Number(
        updated[index]?.qty || 1
      ),

    rate:
      Number(
        product?.retail || 0
      ),

    netRate:
      Number(
        product?.retail || 0
      ),

    sgst:
      Number(
        product?.sgst || 0
      ),

    cgst:
      Number(
        product?.cgst || 0
      ),

    igst:
      Number(
        product?.igst || 0
      ),

    sc:
      product?.sc || "",

    uom:
      product?.uom || "",

    hsn:
      product?.hsn || "",

    batch:
      product?.batch || "",

    amount:
      Number(
        updated[index]?.qty || 1
      ) *
      Number(
        product?.retail || 0
      ),

  };

  console.log(
    "✅ Selected Product:",
    JSON.stringify(
      updated[index],
      null,
      2
    )
  );

  setItems(updated);

  setSuggestions([]);

  setActiveIndex(null);

}}
          >

            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "space-between",
              }}
            >

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    color: "#111827",
                  }}
                >
                  {
                    product?.productenglishname
                  }
                </Text>

                <Text
                  style={{
                    marginTop: 4,
                    color: "#6B7280",
                    fontSize: 12,
                  }}
                >
                  Code:
                  {" "}
                  {
                    product?.productcode
                  }
                </Text>
              </View>

              <View
                style={{
                  backgroundColor:
                    "#DCFCE7",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    color: "#16A34A",
                    fontWeight: "900",
                  }}
                >
                  ₹{
                    Number(
                      product?.retail || 0
                    ).toFixed(2)
                  }
                </Text>
              </View>

            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 8,
              }}
            >

              <View
                style={{
                  backgroundColor:
                    "#EEF2FF",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 10,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    color: "#4F46E5",
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                >
                  Stock:
                  {" "}
                  {
                    product?.stockquantity || 0
                  }
                </Text>
              </View>

              <View
                style={{
                  backgroundColor:
                    "#FEF3C7",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: "#D97706",
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                >
                  {
                    product?.uom || "-"
                  }
                </Text>
              </View>

            </View>

          </TouchableOpacity>

        ))}

      </ScrollView>

    </View>

  )}

</View>

               {/* QTY + RATE */}

<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  }}
>

  {/* QTY */}

  <View
    style={{
      width: "48%",
      backgroundColor: "#EEF2FF",
      borderRadius: 18,
      padding: 12,
      borderWidth: 1,
      borderColor: "#C7D2FE",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="counter"
        size={18}
        color="#4F46E5"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          fontWeight: "700",
          color: "#4F46E5",
        }}
      >
        QUANTITY
      </Text>
    </View>

    <TextInput
      mode="flat"
      keyboardType="numeric"
      value={String(item.qty)}
      onChangeText={v =>
        updateItem(
          index,
          "qty",
          parseInt(v) || 0
        )
      }
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 36,
      }}
      contentStyle={{
        fontSize: 18,
        fontWeight: "800",
      }}
    />
  </View>

  {/* RATE */}

  <View
    style={{
      width: "48%",
      backgroundColor: "#DCFCE7",
      borderRadius: 18,
      padding: 12,
      borderWidth: 1,
      borderColor: "#BBF7D0",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="currency-inr"
        size={18}
        color="#16A34A"
      />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 10,
          fontWeight: "700",
          color: "#16A34A",
        }}
      >
        RATE
      </Text>
    </View>

    <TextInput
      mode="flat"
      keyboardType="numeric"
      value={String(item.rate)}
      onChangeText={v =>
        updateItem(
          index,
          "rate",
          parseFloat(v) || 0
        )
      }
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 36,
      }}
      contentStyle={{
        fontSize: 18,
        fontWeight: "800",
      }}
    />
  </View>

</View>

{/* AMOUNT CARD */}

<LinearGradient
  colors={["#4F46E5", "#6366F1"]}
  style={{
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
  }}
>
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <View>
      <Text
        style={{
          color: "#C7D2FE",
          fontSize: 11,
          fontWeight: "700",
        }}
      >
        TOTAL AMOUNT
      </Text>

      <Text
        style={{
          color: "#FFF",
          fontSize: 26,
          fontWeight: "900",
          marginTop: 2,
        }}
      >
        ₹{Number(amount || 0).toFixed(2)}
      </Text>
    </View>

    <View
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor:
          "rgba(255,255,255,0.15)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="cash-multiple"
        size={26}
        color="#FFF"
      />
    </View>
  </View>
</LinearGradient>

                 <TouchableOpacity
  style={{
    alignSelf: "flex-end",
    marginTop: 10,
    backgroundColor: isOpen
      ? "#FEE2E2"
      : "#EEF2FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  }}
  onPress={() =>
    setExpandedId(
      isOpen
        ? null
        : item.id
    )
  }
>
  <MaterialCommunityIcons
    name={
      isOpen
        ? "chevron-up"
        : "chevron-down"
    }
    size={18}
    color={
      isOpen
        ? "#DC2626"
        : "#4F46E5"
    }
  />

  <Text
    style={{
      marginLeft: 6,
      color:
        isOpen
          ? "#DC2626"
          : "#4F46E5",
      fontWeight: "800",
      fontSize: 13,
    }}
  >
    {isOpen
      ? "Hide Details"
      : "More Details"}
  </Text>
</TouchableOpacity>
{isOpen && (

<View
  style={{
    marginTop: 14,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
  }}
>

  {/* SECTION HEADER */}

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    }}
  >
    <MaterialCommunityIcons
      name="information-outline"
      size={20}
      color="#4F46E5"
    />

    <Text
      style={{
        marginLeft: 8,
        fontSize: 15,
        fontWeight: "800",
        color: "#111827",
      }}
    >
      Product Details
    </Text>
  </View>

  <View
    style={{
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    }}
  >

    {/* STOCK */}

    <View
      style={{
        width: "48%",
        backgroundColor: "#EEF2FF",
        borderRadius: 18,
        padding: 12,
        marginBottom: 10,
      }}
    >
      <MaterialCommunityIcons
        name="package-variant"
        size={18}
        color="#4F46E5"
      />

      <Text
        style={{
          fontSize: 10,
          color: "#4F46E5",
          fontWeight: "700",
          marginTop: 4,
        }}
      >
        STOCK
      </Text>

      <TextInput
        mode="flat"
        value={item.stock || ""}
        onChangeText={v =>
          updateItem(index, "stock", v)
        }
        keyboardType="numeric"
        underlineColor="transparent"
        style={{
          backgroundColor: "transparent",
          height: 36,
        }}
      />
    </View>

    {/* S.C */}

    <View
      style={{
        width: "48%",
        backgroundColor: "#FEF3C7",
        borderRadius: 18,
        padding: 12,
        marginBottom: 10,
      }}
    >
      <MaterialCommunityIcons
        name="barcode"
        size={18}
        color="#D97706"
      />

      <Text
        style={{
          fontSize: 10,
          color: "#D97706",
          fontWeight: "700",
          marginTop: 4,
        }}
      >
        S.C
      </Text>

      <TextInput
        mode="flat"
        value={item.sc || ""}
        onChangeText={v =>
          updateItem(index, "sc", v)
        }
        underlineColor="transparent"
        style={{
          backgroundColor: "transparent",
          height: 36,
        }}
      />
    </View>

    {/* UOM */}

    <View
      style={{
        width: "48%",
        backgroundColor: "#DCFCE7",
        borderRadius: 18,
        padding: 12,
        marginBottom: 10,
      }}
    >
      <MaterialCommunityIcons
        name="scale-balance"
        size={18}
        color="#16A34A"
      />

      <Text
        style={{
          fontSize: 10,
          color: "#16A34A",
          fontWeight: "700",
          marginTop: 4,
        }}
      >
        UOM
      </Text>

      <TextInput
        mode="flat"
        value={item.uom || ""}
        onChangeText={v =>
          updateItem(index, "uom", v)
        }
        underlineColor="transparent"
        style={{
          backgroundColor: "transparent",
          height: 36,
        }}
      />
    </View>

    {/* WEIGHT */}

    <View
      style={{
        width: "48%",
        backgroundColor: "#DBEAFE",
        borderRadius: 18,
        padding: 12,
        marginBottom: 10,
      }}
    >
      <MaterialCommunityIcons
        name="weight"
        size={18}
        color="#2563EB"
      />

      <Text
        style={{
          fontSize: 10,
          color: "#2563EB",
          fontWeight: "700",
          marginTop: 4,
        }}
      >
        WEIGHT
      </Text>

      <TextInput
        mode="flat"
        value={item.weight || ""}
        onChangeText={v =>
          updateItem(index, "weight", v)
        }
        keyboardType="numeric"
        underlineColor="transparent"
        style={{
          backgroundColor: "transparent",
          height: 36,
        }}
      />
    </View>

    {/* CALCULATED VALUES */}

    {[
      {
        title: "NET RATE",
        value: item.netRate,
        icon: "currency-inr",
        color: "#4F46E5",
        bg: "#EEF2FF",
      },
      {
        title: "MC TOTAL",
        value: item.mcTotal,
        icon: "calculator",
        color: "#0891B2",
        bg: "#E0F2FE",
      },
      {
        title: "TOTAL WT",
        value: item.totalWeight,
        icon: "weight-kilogram",
        color: "#65A30D",
        bg: "#ECFCCB",
      },
      {
        title: "STOCK TOTAL",
        value: item.stockTotal,
        icon: "warehouse",
        color: "#E11D48",
        bg: "#FFE4E6",
      },
    ].map((card, i) => (

      <View
        key={i}
        style={{
          width: "48%",
          backgroundColor: card.bg,
          borderRadius: 18,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <MaterialCommunityIcons
          name={card.icon}
          size={18}
          color={card.color}
        />

        <Text
          style={{
            marginTop: 4,
            fontSize: 10,
            color: card.color,
            fontWeight: "700",
          }}
        >
          {card.title}
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 18,
            fontWeight: "900",
            color: "#111827",
          }}
        >
          {card.title.includes("RATE") ||
          card.title.includes("TOTAL")
            ? `₹${Number(card.value || 0).toFixed(2)}`
            : card.value || 0}
        </Text>
      </View>

    ))}

    {/* MC % */}

    <View
      style={{
        width: "100%",
        backgroundColor: "#FEE2E2",
        borderRadius: 18,
        padding: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="percent"
          size={18}
          color="#DC2626"
        />

        <Text
          style={{
            marginLeft: 6,
            fontSize: 11,
            color: "#DC2626",
            fontWeight: "700",
          }}
        >
          MAKING CHARGE %
        </Text>
      </View>

      <TextInput
        mode="flat"
        value={item.mc || ""}
        onChangeText={v =>
          updateItem(index, "mc", v)
        }
        keyboardType="numeric"
        underlineColor="transparent"
        style={{
          backgroundColor: "transparent",
          height: 36,
        }}
      />
    </View>

  </View>

</View>

)}

                  <View
  style={{
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
  }}
>

  {/* ADD ROW */}

  <TouchableOpacity
    onPress={addRow}
    style={{
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "#DCFCE7",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    }}
  >
    <MaterialCommunityIcons
      name="plus"
      size={22}
      color="#16A34A"
    />
  </TouchableOpacity>

  {/* DELETE ROW */}

  <TouchableOpacity
    onPress={() =>
      removeItem(item.id)
    }
    style={{
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "#FEE2E2",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <MaterialCommunityIcons
      name="delete-outline"
      size={22}
      color="#DC2626"
    />
  </TouchableOpacity>

</View>
                </Card>
              );
            },
          )}

          {/* SUMMARY */}
       
<Card
  style={{
    margin: 12,
    borderRadius: 24,
    padding: 16,
    backgroundColor: "#FFF",
    elevation: 4,
  }}
>

  {/* HEADER */}

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    }}
  >
    <MaterialCommunityIcons
      name="calculator-variant"
      size={22}
      color="#4F46E5"
    />

    <Text
      style={{
        marginLeft: 8,
        fontSize: 18,
        fontWeight: "900",
        color: "#111827",
      }}
    >
      Summary
    </Text>
  </View>

  {/* VEHICLE + CUSTOMER */}

  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    }}
  >

    <View
      style={{
        width: "48%",
        backgroundColor: "#DBEAFE",
        borderRadius: 16,
        padding: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="truck-outline"
          size={16}
          color="#2563EB"
        />

        <Text
          style={{
            marginLeft: 6,
            fontSize: 10,
            color: "#2563EB",
            fontWeight: "700",
          }}
        >
          VEHICLE NO
        </Text>
      </View>

      <TextInput
        mode="flat"
        value={vehicleNo}
        onChangeText={setVehicleNo}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        style={{
          backgroundColor: "transparent",
          height: 34,
        }}
      />
    </View>

    <View
      style={{
        width: "48%",
        backgroundColor: "#DCFCE7",
        borderRadius: 16,
        padding: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="account"
          size={16}
          color="#16A34A"
        />

        <Text
          style={{
            marginLeft: 6,
            fontSize: 10,
            color: "#16A34A",
            fontWeight: "700",
          }}
        >
          CUSTOMER
        </Text>
      </View>

      <TextInput
        mode="flat"
        value={customerName}
        onChangeText={setCustomerName}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        style={{
          backgroundColor: "transparent",
          height: 34,
        }}
      />
    </View>

  </View>

  {/* AMOUNT CARDS */}

  <View
    style={{
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    }}
  >
    {[
      {
        title: "Actual",
        value: subtotal,
        bg: "#EEF2FF",
        color: "#4F46E5",
      },
      {
        title: "Disc %",
        value: discountPercent,
        bg: "#FEF3C7",
        color: "#D97706",
      },
      {
        title: "Disc Amt",
        value: discountAmount,
        bg: "#FEE2E2",
        color: "#DC2626",
      },
      {
        title: "Grand",
        value: total,
        bg: "#DCFCE7",
        color: "#16A34A",
      },
    ].map((item, index) => (

      <View
        key={index}
        style={{
          width: "48%",
          backgroundColor: item.bg,
          borderRadius: 16,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontWeight: "700",
            color: item.color,
          }}
        >
          {item.title}
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 18,
            fontWeight: "900",
            color: "#111827",
          }}
        >
          ₹{Number(item.value || 0).toFixed(2)}
        </Text>
      </View>

    ))}
  </View>

  {/* DISCOUNT INPUT */}

  <View
    style={{
      backgroundColor: "#FFF7ED",
      borderRadius: 16,
      padding: 12,
      marginTop: 8,
    }}
  >
    <Text
      style={{
        fontSize: 10,
        color: "#EA580C",
        fontWeight: "700",
      }}
    >
      DISCOUNT %
    </Text>

    <TextInput
      mode="flat"
      keyboardType="numeric"
      value={String(discountPercent)}
      onChangeText={v =>
        setDiscountPercent(
          Number(v) || 0
        )
      }
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        backgroundColor: "transparent",
        height: 34,
      }}
    />
  </View>

  {/* GRAND TOTAL */}

  <LinearGradient
    colors={["#4F46E5", "#6366F1"]}
    style={{
      marginTop: 16,
      borderRadius: 20,
      padding: 18,
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color: "#C7D2FE",
        fontSize: 11,
        fontWeight: "700",
      }}
    >
      GRAND TOTAL
    </Text>

    <Text
      style={{
        marginTop: 4,
        color: "#FFF",
        fontSize: 30,
        fontWeight: "900",
      }}
    >
      ₹{total.toFixed(2)}
    </Text>
  </LinearGradient>

</Card>
        </ScrollView>

        {/* FIXED BUTTONS */}
    <View
  style={{
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 60,
    marginRight:10,
    marginLeft:10,
  }}
>

  {/* VIEW BILL */}

  <TouchableOpacity
    onPress={() =>
      router.push(
        "/src/screens/ViewPurchaseReturn"
      )
    }
    style={{
      flex: 1,
      backgroundColor: "#DBEAFE",
      marginRight: 6,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    }}
  >
    <MaterialCommunityIcons
      name="file-document-outline"
      size={18}
      color="#2563EB"
    />

    <Text
      style={{
        marginLeft: 6,
        color: "#2563EB",
        fontWeight: "800",
      }}
    >
      View
    </Text>
  </TouchableOpacity>

  {/* SAVE */}

  <TouchableOpacity
    onPress={handleSaveAndView}
    style={{
      flex: 1,
      marginHorizontal: 3,
      borderRadius: 16,
      overflow: "hidden",
    }}
  >
    <LinearGradient
      colors={[
        "#4F46E5",
        "#6366F1",
      ]}
      style={{
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <MaterialCommunityIcons
        name="content-save"
        size={18}
        color="#FFF"
      />

      <Text
        style={{
          marginLeft: 6,
          color: "#FFF",
          fontWeight: "900",
        }}
      >
        Save
      </Text>
    </LinearGradient>
  </TouchableOpacity>

  {/* RESET */}

  <TouchableOpacity
    onPress={handleReset}
    style={{
      flex: 1,
      backgroundColor: "#FEE2E2",
      marginLeft: 6,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    }}
  >
    <MaterialCommunityIcons
      name="refresh"
      size={18}
      color="#DC2626"
    />

    <Text
      style={{
        marginLeft: 6,
        color: "#DC2626",
        fontWeight: "800",
      }}
    >
      Reset
    </Text>
  </TouchableOpacity>

</View>

      </KeyboardAvoidingView>
    </View>
  );
}