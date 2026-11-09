import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StatusBar,
  Alert,
  ActivityIndicator,
  Linking,
  Image,
} from "react-native";

import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

import { captureRef } from "react-native-view-shot";

import { LinearGradient } from "expo-linear-gradient";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import styles from "../style/ViewInvoiceDetailsStyle";

// SQLITE
import {
  getInvoiceById,
  getInvoiceItems,
} from "../database/sqlite";


export default function ViewInvoice() {
  // ================= PARAMS =================

  const params = useLocalSearchParams();

  const invoiceId = Array.isArray(params?.invoiceId)
    ? params.invoiceId[0]
    : params?.invoiceId;

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;


  // ================= REFS =================

  const invoiceRef = useRef<View | null>(null);


  // ================= STATE =================

  const [invoice, setInvoice] = useState<any>(null);

  const [items, setItems] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);


  // ================= LOAD INVOICE =================

  useEffect(() => {
    const selectedId = invoiceId || id;

    if (selectedId) {
      loadInvoice(String(selectedId));
    }
  }, [invoiceId, id]);


  const loadInvoice = async (selectedId: string) => {
    try {
      setLoading(true);

      console.log("=================================");
      console.log("🚀 LOAD INVOICE");
      console.log("📌 Invoice ID:", selectedId);
      console.log("=================================");

      const invoiceData = await getInvoiceById(
        String(selectedId)
      );

      const itemData = await getInvoiceItems(
        String(selectedId)
      );

      console.log("📦 INVOICE:", invoiceData);
      console.log("📦 ITEMS:", itemData);

      if (!invoiceData) {
        console.log("❌ Invoice not found");

        Alert.alert(
          "Invoice Not Found",
          "Unable to find this invoice."
        );

        setInvoice(null);
        setItems([]);

        return;
      }

      setInvoice(invoiceData);
      setItems(itemData || []);

    } catch (e) {
      console.log(
        "❌ loadInvoice ERROR:",
        e
      );

      Alert.alert(
        "Error",
        "Failed to load invoice."
      );

    } finally {
      setLoading(false);
    }
  };


  // ================= TOTAL =================

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  );


  // ================= PHONE =================

  const getFormattedPhone = () => {
    if (!invoice) {
      return null;
    }

    let rawPhone =
      invoice?.mobileno ||
      invoice?.customerPhone ||
      "";

    let phone = String(rawPhone)
      .replace(/\D/g, "");

    if (!phone) {
      return null;
    }

    // Remove leading zero
    if (phone.startsWith("0")) {
      phone = phone.substring(1);
    }

    // Add India country code
    if (phone.length === 10) {
      phone = `91${phone}`;
    }

    return phone;
  };


  // ================= PDF =================

  const sendInvoicePDF = async () => {
    try {
      if (!invoice) {
        return;
      }

      setLoading(true);

      const html = generateInvoiceHTML();

      const { uri } =
        await Print.printToFileAsync({
          html,
        });

      const available =
        await Sharing.isAvailableAsync();

      if (!available) {
        Alert.alert(
          "Error",
          "Sharing is not supported on this device."
        );

        return;
      }

      await Sharing.shareAsync(
        uri,
        {
          mimeType: "application/pdf",

          dialogTitle:
            "Share Invoice PDF",

          UTI: ".pdf",
        }
      );

    } catch (e) {
      console.log(
        "❌ PDF error:",
        e
      );

      Alert.alert(
        "Error",
        "Failed to create invoice PDF."
      );

    } finally {
      setLoading(false);
    }
  };


  // ================= PRODUCT IMAGE =================

  const getProductImage = (item: any) => {
    const image =
      item?.productimage ||
      item?.productImage ||
      item?.image ||
      item?.product_image ||
      item?.imageUri ||
      "";

    if (typeof image !== "string" || !image.trim()) {
      return null;
    }

    return image.trim();
  };

  // ================= HTML =================

  const generateInvoiceHTML = () => {
    const rows = items
      .map((item, index) => {
        const image = getProductImage(item);
        const imageHtml = image
          ? `<img src="${image}" style="width:45px;height:45px;object-fit:cover;border-radius:8px;margin-right:8px;vertical-align:middle;" />`
          : "";

        return `
          <tr>
            <td>${index + 1}</td>
            <td>${imageHtml}${item.product || ""}</td>
            <td>${item.qty || 0}</td>
            <td>₹${item.rate || 0}</td>
            <td>₹${item.amount || 0}</td>
          </tr>
        `;
      })
      .join("");

    return `
      <html>

      <head>
        <meta name="viewport"
              content="width=device-width, initial-scale=1.0" />
      </head>

      <body
        style="
          font-family: Arial;
          padding: 20px;
          color: #111827;
        "
      >

        <h2
          style="
            text-align: center;
            color: #4C1D95;
          "
        >
          🧾 YOUR SHOP NAME
        </h2>

        <p>
          <b>Invoice :</b>
          ${invoice?.invoiceNo || ""}
        </p>

        <p>
          <b>Customer :</b>
          ${invoice?.customer || ""}
        </p>

        <p>
          <b>Mobile :</b>
          ${
            invoice?.mobileno ||
            invoice?.customerPhone ||
            ""
          }
        </p>

        <table
          style="
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          "
          border="1"
          cellpadding="10"
        >

          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>

          ${rows}

        </table>

        <h2
          style="
            text-align: right;
            margin-top: 20px;
          "
        >
          Total :
          ₹${invoice?.total ?? subtotal}
        </h2>

      </body>

      </html>
    `;
  };


  // ================= TEXT =================

  const getInvoiceText = () => {
    const itemText = items
      .map(
        (item, index) =>
          `${index + 1}. ${item.product || ""}

Qty : ${item.qty || 0}
Rate : ₹${item.rate || 0}
Amount : ₹${item.amount || 0}`
      )
      .join("\n\n");

    return `🧾 *YOUR SHOP NAME*

━━━━━━━━━━━━━━━━

📄 *Invoice*
${invoice?.invoiceNo || ""}

👤 *Customer*
${invoice?.customer || ""}

📱 *Mobile*
${
  invoice?.mobileno ||
  invoice?.customerPhone ||
  ""
}

━━━━━━━━━━━━━━━━

📦 *ITEMS*

${itemText}

━━━━━━━━━━━━━━━━

💰 *Grand Total*
₹${invoice?.total ?? subtotal}

━━━━━━━━━━━━━━━━

🙏 Thank You
Visit Again
`;
  };


  // ================= WHATSAPP =================

  const sendToWhatsApp = async () => {
    try {
      const phone = getFormattedPhone();

      if (!phone) {
        Alert.alert(
          "Customer Number Missing",
          "Please add the customer's mobile number."
        );

        return;
      }

      const message =
        getInvoiceText();

      const url =
        `https://wa.me/${phone}?text=${encodeURIComponent(
          message
        )}`;

      const supported =
        await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert(
          "WhatsApp Error",
          "Unable to open WhatsApp."
        );

        return;
      }

      await Linking.openURL(url);

    } catch (e) {
      console.log(
        "❌ WhatsApp error:",
        e
      );

      Alert.alert(
        "Error",
        "Failed to open WhatsApp."
      );
    }
  };


  // ================= SMS =================

  const sendSMS = async () => {
    try {
      const phone =
        getFormattedPhone();

      if (!phone) {
        Alert.alert(
          "Customer Number Missing",
          "Please add the customer's mobile number."
        );

        return;
      }

      const message =
        getInvoiceText();

      const url =
        `sms:${phone}?body=${encodeURIComponent(
          message
        )}`;

      const supported =
        await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert(
          "SMS Error",
          "Unable to open SMS application."
        );

        return;
      }

      await Linking.openURL(url);

    } catch (e) {
      console.log(
        "❌ SMS error:",
        e
      );

      Alert.alert(
        "Error",
        "Failed to open SMS."
      );
    }
  };


  // ================= IMAGE SHARE =================

  const sendInvoiceImage = async () => {
    try {
      if (!invoiceRef.current) {
        return;
      }

      setLoading(true);

      const imageUri =
        await captureRef(
          invoiceRef,
          {
            format: "png",
            quality: 1,
          }
        );

      const available =
        await Sharing.isAvailableAsync();

      if (!available) {
        Alert.alert(
          "Error",
          "Image sharing is not supported."
        );

        return;
      }

      await Sharing.shareAsync(
        imageUri,
        {
          mimeType: "image/png",

          dialogTitle:
            "Share Invoice Image",
        }
      );

    } catch (e) {
      console.log(
        "❌ Image error:",
        e
      );

      Alert.alert(
        "Error",
        "Failed to share invoice image."
      );

    } finally {
      setLoading(false);
    }
  };


  // ================= LOADER =================

  if (loading && !invoice) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8FAFC",
        }}
      >

        <ActivityIndicator
          size="large"
          color="#6D28D9"
        />

        <Text
          style={{
            marginTop: 12,
            color: "#64748B",
            fontSize: 14,
          }}
        >
          Loading invoice...
        </Text>

      </View>
    );
  }


  if (!invoice) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8FAFC",
          padding: 24,
        }}
      >

        <MaterialCommunityIcons
          name="file-document-alert-outline"
          size={64}
          color="#94A3B8"
        />

        <Text
          style={{
            marginTop: 16,
            fontSize: 20,
            fontWeight: "800",
            color: "#0F172A",
          }}
        >
          Invoice Not Found
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.85}
          style={{
            marginTop: 20,
            backgroundColor: "#6D28D9",
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 16,
          }}
        >

          <Text
            style={{
              color: "#fff",
              fontWeight: "800",
            }}
          >
            Go Back
          </Text>

        </TouchableOpacity>

      </View>
    );
  }


  // ================= UI =================

  return (
    <View
      ref={invoiceRef}
      collapsable={false}
      style={{
        flex: 1,
        backgroundColor: "#F5F7FA",
      }}
    >

      <StatusBar
        backgroundColor="#6D28D9"
        barStyle="light-content"
      />


      {/* ================= HEADER ================= */}

      <LinearGradient
        colors={[
          "#4C1D95",
          "#6D28D9",
          "#8B5CF6",
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
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
          }}
        >

          {/* BACK BUTTON */}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              router.back()
            }
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              backgroundColor:
                "rgba(255,255,255,0.15)",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.12)",
            }}
          >

            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#fff"
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
              numberOfLines={1}
              style={{
                color:
                  "rgba(255,255,255,0.75)",
                fontSize: 12,
                fontWeight: "700",
                letterSpacing: 1,
              }}
            >
              INVOICE DETAILS
            </Text>

            <Text
              numberOfLines={1}
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: "900",
                marginTop: 4,
              }}
            >
              Invoice #
              {invoice?.invoiceNo || "0001"}
            </Text>

          </View>

        </View>

      </LinearGradient>


      {/* ================= CONTENT ================= */}

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#F8FAFC",
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >


        {/* ================= TOP SUMMARY ================= */}

        <LinearGradient
          colors={[
            "#0F172A",
            "#1E293B",
            "#334155",
          ]}
          style={{
            margin: 16,
            borderRadius: 30,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.18,
            shadowRadius: 12,
            elevation: 8,
          }}
        >

          {/* INVOICE NUMBER */}

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >

            <View>

              <Text
                style={{
                  color:
                    "rgba(255,255,255,0.7)",
                  fontSize: 13,
                  fontWeight: "700",
                }}
              >
                INVOICE NUMBER
              </Text>

              <Text
                style={{
                  color: "#fff",
                  fontSize: 26,
                  fontWeight: "900",
                  marginTop: 6,
                }}
              >
                #{invoice.invoiceNo}
              </Text>

            </View>


            <LinearGradient
              colors={[
                "#22C55E",
                "#4ADE80",
              ]}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 18,
              }}
            >

              <Text
                style={{
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: 13,
                }}
              >
                PAID
              </Text>

            </LinearGradient>

          </View>


          {/* CUSTOMER */}

          <View
            style={{
              marginTop: 28,
              flexDirection: "row",
              alignItems: "center",
            }}
          >

            <View
              style={{
                width: 58,
                height: 58,
                borderRadius: 20,
                backgroundColor:
                  "rgba(255,255,255,0.12)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >

              <MaterialCommunityIcons
                name="account-outline"
                size={28}
                color="#fff"
              />

            </View>


            <View
              style={{
                marginLeft: 16,
                flex: 1,
              }}
            >

              <Text
                style={{
                  color:
                    "rgba(255,255,255,0.7)",
                  fontSize: 13,
                }}
              >
                CUSTOMER
              </Text>

              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "800",
                  marginTop: 4,
                }}
              >
                {invoice.customer || "Walk-in Customer"}
              </Text>

              <Text
                style={{
                  color:
                    "rgba(255,255,255,0.7)",
                  marginTop: 4,
                }}
              >
                {
                  invoice.mobileno ||
                  invoice.customerPhone ||
                  "No mobile number"
                }
              </Text>

            </View>

          </View>


          {/* EXTRA DETAILS */}

          <View
            style={{
              marginTop: 24,
              flexDirection: "row",
              justifyContent:
                "space-between",
            }}
          >

            <View>

              <Text
                style={{
                  color:
                    "rgba(255,255,255,0.6)",
                  fontSize: 12,
                }}
              >
                PAYMENT
              </Text>

              <Text
                style={{
                  color: "#fff",
                  marginTop: 4,
                  fontWeight: "700",
                }}
              >
                {invoice.paidType || "CASH"}
              </Text>

            </View>


            <View>

              <Text
                style={{
                  color:
                    "rgba(255,255,255,0.6)",
                  fontSize: 12,
                }}
              >
                SALES TYPE
              </Text>

              <Text
                style={{
                  color: "#fff",
                  marginTop: 4,
                  fontWeight: "700",
                }}
              >
                {invoice.salesType || "RETAIL"}
              </Text>

            </View>


            <View>

              <Text
                style={{
                  color:
                    "rgba(255,255,255,0.6)",
                  fontSize: 12,
                }}
              >
                TAX TYPE
              </Text>

              <Text
                style={{
                  color: "#fff",
                  marginTop: 4,
                  fontWeight: "700",
                }}
              >
                {invoice.taxType || "GST"}
              </Text>

            </View>

          </View>

        </LinearGradient>


        {/* ================= ITEMS ================= */}

        <View
          style={{
            paddingHorizontal: 16,
          }}
        >

          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: "#0F172A",
              marginBottom: 18,
            }}
          >
            Invoice Items
          </Text>


          {items.map(
            (item, index) => (

              <View
                key={`${item.id || item.productcode || item.product || "item"}-${index}`}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 24,
                  padding: 18,
                  marginBottom: 14,
                  borderWidth: 1,
                  borderColor: "#EEF2F7",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >

                {/* PRODUCT */}

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
                      paddingRight: 10,
                    }}
                  >

                    {/* PRODUCT IMAGE */}
                    <View
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: 18,
                        backgroundColor: "#F1F5F9",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                        marginRight: 12,
                        borderWidth: 1,
                        borderColor: "#E2E8F0",
                      }}
                    >
                      {getProductImage(item) ? (
                        <Image
                          source={{
                            uri: getProductImage(item) as string,
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          resizeMode="cover"
                          onError={() => {
                            console.log(
                              "❌ PRODUCT IMAGE ERROR:",
                              getProductImage(item)
                            );
                          }}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="package-variant-closed"
                          size={30}
                          color="#6366F1"
                        />
                      )}
                    </View>

                    {/* PRODUCT DETAILS */}
                    <View
                      style={{
                        flex: 1,
                      }}
                    >

                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 17,
                          fontWeight: "800",
                          color: "#111827",
                        }}
                      >
                        {item.product || "Product"}
                      </Text>

                      {!!item.productcode && (
                        <Text
                          style={{
                            marginTop: 3,
                            color: "#94A3B8",
                            fontSize: 11,
                            fontWeight: "600",
                          }}
                        >
                          Code: {item.productcode}
                        </Text>
                      )}

                      <Text
                        style={{
                          marginTop: 6,
                          color: "#64748B",
                          fontSize: 13,
                        }}
                      >
                        Qty : {item.qty || 0}
                        {" • "}
                        Unit : {item.unit || "Piece"}
                      </Text>

                    </View>

                  </View>


                  <LinearGradient
                    colors={[
                      "#2563EB",
                      "#3B82F6",
                    ]}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 16,
                    }}
                  >

                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "800",
                      }}
                    >
                      ₹{item.amount || 0}
                    </Text>

                  </LinearGradient>

                </View>


                {/* RATE / TAX / TOTAL */}

                <View
                  style={{
                    marginTop: 18,
                    flexDirection: "row",
                    justifyContent:
                      "space-between",
                  }}
                >

                  <View>

                    <Text
                      style={{
                        color: "#94A3B8",
                        fontSize: 12,
                      }}
                    >
                      RATE
                    </Text>

                    <Text
                      style={{
                        marginTop: 4,
                        fontWeight: "700",
                        color: "#0F172A",
                      }}
                    >
                      ₹{item.rate || 0}
                    </Text>

                  </View>


                  <View>

                    <Text
                      style={{
                        color: "#94A3B8",
                        fontSize: 12,
                      }}
                    >
                      TAX
                    </Text>

                    <Text
                      style={{
                        marginTop: 4,
                        fontWeight: "700",
                        color: "#0F172A",
                      }}
                    >
                      {
                        Number(item.igst || 0) > 0
                          ? `${item.igst}%`
                          : `${
                              Number(item.sgst || 0) +
                              Number(item.cgst || 0)
                            }%`
                      }
                    </Text>

                  </View>


                  <View>

                    <Text
                      style={{
                        color: "#94A3B8",
                        fontSize: 12,
                      }}
                    >
                      TOTAL
                    </Text>

                    <Text
                      style={{
                        marginTop: 4,
                        fontWeight: "800",
                        color: "#16A34A",
                      }}
                    >
                      ₹{item.amount || 0}
                    </Text>

                  </View>

                </View>

              </View>

            )
          )}

        </View>


        {/* ================= SHARE ================= */}

        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 8,
          }}
        >

          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#0F172A",
              marginBottom: 14,
            }}
          >
            Share Invoice
          </Text>


          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              flexWrap: "wrap",
            }}
          >

            {/* WHATSAPP */}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={sendToWhatsApp}
              style={{
                width: "31%",
                marginBottom: 12,
              }}
            >

              <LinearGradient
                colors={[
                  "#16A34A",
                  "#22C55E",
                ]}
                style={{
                  borderRadius: 20,
                  paddingVertical: 16,
                  alignItems: "center",
                  shadowColor: "#16A34A",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.18,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >

                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 15,
                    backgroundColor:
                      "rgba(255,255,255,0.18)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >

                  <MaterialCommunityIcons
                    name="whatsapp"
                    size={24}
                    color="#fff"
                  />

                </View>

                <Text
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: "800",
                    marginTop: 10,
                  }}
                >
                  WhatsApp
                </Text>

              </LinearGradient>

            </TouchableOpacity>


            {/* SMS */}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={sendSMS}
              style={{
                width: "31%",
                marginBottom: 12,
              }}
            >

              <LinearGradient
                colors={[
                  "#2563EB",
                  "#3B82F6",
                ]}
                style={{
                  borderRadius: 20,
                  paddingVertical: 16,
                  alignItems: "center",
                  shadowColor: "#2563EB",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.18,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >

                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 15,
                    backgroundColor:
                      "rgba(255,255,255,0.18)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >

                  <MaterialCommunityIcons
                    name="message-processing"
                    size={22}
                    color="#fff"
                  />

                </View>

                <Text
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: "800",
                    marginTop: 10,
                  }}
                >
                  SMS
                </Text>

              </LinearGradient>

            </TouchableOpacity>


            {/* PRINT */}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={sendInvoicePDF}
              style={{
                width: "31%",
                marginBottom: 12,
              }}
            >

              <LinearGradient
                colors={[
                  "#F59E0B",
                  "#FBBF24",
                ]}
                style={{
                  borderRadius: 20,
                  paddingVertical: 16,
                  alignItems: "center",
                  shadowColor: "#F59E0B",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.18,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >

                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 15,
                    backgroundColor:
                      "rgba(255,255,255,0.18)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >

                  <MaterialCommunityIcons
                    name="printer"
                    size={22}
                    color="#fff"
                  />

                </View>

                <Text
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: "800",
                    marginTop: 10,
                  }}
                >
                  Print
                </Text>

              </LinearGradient>

            </TouchableOpacity>

          </View>

        </View>


        {/* ================= TOTAL ================= */}

        <LinearGradient
          colors={[
            "#111827",
            "#1F2937",
          ]}
          style={{
            margin: 16,
            borderRadius: 30,
            padding: 24,
          }}
        >

          <Text
            style={{
              color:
                "rgba(255,255,255,0.7)",
              fontSize: 13,
              fontWeight: "700",
            }}
          >
            GRAND TOTAL
          </Text>

          <Text
            style={{
              color: "#fff",
              fontSize: 34,
              fontWeight: "900",
              marginTop: 10,
            }}
          >
            ₹{invoice.total ?? subtotal}
          </Text>

        </LinearGradient>


      </ScrollView>


      {/* ================= LOADING OVERLAY ================= */}

      {loading && invoice && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              "rgba(15,23,42,0.35)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              paddingHorizontal: 24,
              paddingVertical: 20,
              alignItems: "center",
              elevation: 10,
            }}
          >

            <ActivityIndicator
              size="large"
              color="#6D28D9"
            />

            <Text
              style={{
                marginTop: 10,
                color: "#334155",
                fontWeight: "700",
              }}
            >
              Preparing...
            </Text>

          </View>

        </View>
      )}

    </View>
  );
}