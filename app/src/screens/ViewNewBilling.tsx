import React, {

  useCallback,

  useState,

} from "react";



import {

  ActivityIndicator,

  Alert,

  ScrollView,

  Share,

  StyleSheet,

  Text,

  TouchableOpacity,

  View,Linking

} from "react-native";



import {

  useFocusEffect,

  useLocalSearchParams,

  useRouter,

} from "expo-router";



import {

  MaterialCommunityIcons,

} from "@expo/vector-icons";



import * as Print from "expo-print";



import {

  getDB,getNewInvoices,getNewInvoiceWithItems

} from "../database/sqlite";










// =====================================================

// TYPES

// =====================================================



type Invoice = {

  id: string;



  invoiceNo?: string;

  serialNo?: number;

  invoiceDate?: string;



  customerId?: string;

  customerName?: string;

  customerMobile?: string;



  gstNo?: string;



  paymentMode?: string;

  taxType?: string;

  billType?: string;



  subtotal?: number;

  discount?: number;

  taxableAmount?: number;



  sgst?: number;

  cgst?: number;

  igst?: number;

  tax?: number;



  totalAmount?: number;



  paidAmount?: number;

  balanceAmount?: number;



  status?: string;



  notes?: string;



  createdAt?: string;

};





type InvoiceItem = {

  id: string;



  invoiceId: string;



  productId?: string;

  productcode?: string;

  productName?: string;



  productTamilName?: string;

  productimage?: string;



  category?: string;

  subcategory?: string;



  quantity?: number;



  rate?: number;



  amount?: number;



  unit?: string;

  uom?: string;



  discount?: number;



  taxableAmount?: number;



  sgst?: number;

  cgst?: number;

  igst?: number;



  taxAmount?: number;



  totalAmount?: number;

};





// =====================================================

// HELPERS

// =====================================================



const money = (

  value: number | undefined

) => {



  return `₹${Number(

    value || 0

  ).toFixed(2)}`;



};





// =====================================================

// SCREEN

// =====================================================



export default function ViewBillingScreen() {



  const router = useRouter();





  const params =

    useLocalSearchParams<{

      invoiceId?: string;

    }>();





  const invoiceId =

    String(

      params.invoiceId || ""

    );





console.log(

  "🧾 ViewNewBilling invoiceId:",

  invoiceId

);



  const [invoice, setInvoice] =

    useState<Invoice | null>(null);





  const [items, setItems] =

    useState<InvoiceItem[]>([]);





  const [loading, setLoading] =

    useState(true);





  // ===================================================

  // LOAD INVOICE

  // ===================================================



  const loadInvoice = async () => {

  try {

    setLoading(true);



    // ===============================================

    // CHECK INVOICE ID

    // ===============================================



    if (!invoiceId) {

      console.log(

        "❌ ViewBilling: invoiceId missing"

      );



      setInvoice(null);

      setItems([]);



      return;

    }



    // ===============================================

    // GET DATABASE

    // ===============================================



    const db = await getDB();



    if (!db) {

      throw new Error(

        "Database unavailable"

      );

    }



    console.log(

      "🗄️ VIEW BILLING DATABASE READY"

    );



    console.log(

      "🧾 LOADING INVOICE ID:",

      invoiceId

    );



    // ===============================================

    // GET NEW INVOICE

    // ===============================================



    const invoiceResult =

      await db.getFirstAsync<Invoice>(

        `

        SELECT

          rowid AS serialNo,

          id,

          invoiceNo,

          invoiceDate,

          customerId,

          customerName,

          customerMobile,

          gstNo,

          paymentMode,

          taxType,

          billType,

          subtotal,

          discount,

          taxableAmount,

          sgst,

          cgst,

          igst,

          tax,

          totalAmount,

          paidAmount,

          balanceAmount,

          status,

          notes,

          createdAt

        FROM newinvoice

        WHERE id = ?

        LIMIT 1

        `,

        [String(invoiceId)]

      );



    console.log(

      "🧾 VIEW NEW INVOICE:",

      invoiceResult

    );



    // ===============================================

    // INVOICE NOT FOUND

    // ===============================================



    if (!invoiceResult) {

      console.log(

        "❌ NEW INVOICE NOT FOUND:",

        invoiceId

      );



      setInvoice(null);

      setItems([]);



      Alert.alert(

        "Invoice Not Found",

        `Invoice #${invoiceId} could not be found.`

      );



      return;

    }



    // ===============================================

    // SET INVOICE

    // ===============================================



    setInvoice(invoiceResult);



    // ===============================================

    // GET NEW INVOICE ITEMS

    // ===============================================



    const itemResult =

      await db.getAllAsync<InvoiceItem>(

        `

        SELECT

          ni.id,

          ni.invoiceId,

          ni.productId,

          ni.productcode,

          ni.productName,

          COALESCE(NULLIF(TRIM(p.producttamilName), ''), ni.productName) AS productTamilName,

          ni.productimage,

          ni.category,

          ni.subcategory,

          ni.quantity,

          ni.rate,

          ni.amount,

          ni.unit,

          ni.uom,

          ni.discount,

          ni.taxableAmount,

          ni.sgst,

          ni.cgst,

          ni.igst,

          ni.taxAmount,

          ni.totalAmount

        FROM newinvoice_items ni

        LEFT JOIN products p

          ON CAST(p.id AS TEXT) = CAST(ni.productId AS TEXT)

        WHERE ni.invoiceId = ?

        ORDER BY ni.rowid ASC

        `,

        [String(invoiceId)]

      );



    console.log(

      "📦 VIEW NEW INVOICE ITEMS:",

      itemResult

    );



    // ===============================================

    // SET ITEMS

    // ===============================================



    setItems(

      Array.isArray(itemResult)

        ? itemResult

        : []

    );



    console.log(

      "✅ VIEW BILLING LOADED"

    );



    console.log(

      "🧾 INVOICE:",

      invoiceResult

    );



    console.log(

      "📦 ITEMS COUNT:",

      itemResult?.length || 0

    );



  } catch (error: any) {



    console.log(

      "❌ VIEW BILLING ERROR:",

      error

    );



    setInvoice(null);

    setItems([]);



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





  useFocusEffect(

    useCallback(() => {



      loadInvoice();



    }, [

      invoiceId,

    ])

  );





  // ===================================================

  // PRINT BILL

  // ===================================================



  const printBill = async () => {
    if (!invoice) {
      Alert.alert("Print Error", "Invoice details are not available.");
      return;
    }

    if (!items.length) {
      Alert.alert("Print Error", "No invoice items are available to print.");
      return;
    }

    try {
      // Replace these two values with the actual shop details.
      const SHOP_NAME = "YOUR SHOP NAME";
      const SHOP_ADDRESS = "YOUR SHOP ADDRESS";

      const escapeHtml = (value: unknown): string =>
        String(value ?? "-")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");

      const formatAmount = (value: unknown): string =>
        Number(value ?? 0).toFixed(2);

      const formatQuantity = (value: unknown): string =>
        Number(value ?? 0).toFixed(1);

      const createdAt = invoice.createdAt
        ? new Date(invoice.createdAt)
        : null;

      const validCreatedAt =
        createdAt && !Number.isNaN(createdAt.getTime())
          ? createdAt
          : null;

      const receiptDate = validCreatedAt
        ? validCreatedAt.toLocaleDateString("en-GB")
        : invoice.invoiceDate || "-";

      const receiptTime = validCreatedAt
        ? validCreatedAt.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        : "-";

      const totalQuantity = items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      // Product name appears on its own line, matching the sample receipt.
      const productRows = items
        .map((item) => {
          const productName =
            item.productTamilName ||
            item.productName ||
            "-";

          return `
            <tr class="product-name-row">
              <td colspan="4">${escapeHtml(productName)}</td>
            </tr>
            <tr class="product-value-row">
              <td class="spacer"></td>
              <td class="qty">${formatQuantity(item.quantity)}</td>
              <td class="rate">${formatAmount(item.rate)}</td>
              <td class="total">${formatAmount(item.totalAmount ?? item.amount)}</td>
            </tr>
          `;
        })
        .join("");

      const html = `
        <!DOCTYPE html>
        <html lang="ta">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            @page {
              size: 58mm auto;
              margin: 2mm;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              width: 54mm;
              margin: 0;
              padding: 0;
              color: #000;
              background: #fff;
              font-family: "Noto Sans Tamil", "Noto Sans", Arial, sans-serif;
              font-size: 10px;
              font-weight: 500;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .receipt {
              width: 54mm;
              padding: 0;
            }

            .shop-header {
              text-align: center;
              padding-bottom: 5px;
            }

            .shop-name {
              font-size: 17px;
              line-height: 1.25;
              font-weight: 900;
              text-transform: uppercase;
            }

            .shop-address {
              margin-top: 2px;
              font-size: 10px;
              line-height: 1.3;
              font-weight: 700;
            }

            .dashed {
              border-top: 1px dashed #000;
              height: 0;
              margin: 5px 0;
            }

            .meta {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              font-weight: 700;
            }

            .meta td {
              width: 50%;
              padding: 1px 0;
              vertical-align: top;
            }

            .meta .right {
              text-align: right;
              white-space: nowrap;
            }

            .column-head {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              font-size: 10px;
              font-weight: 900;
            }

            .column-head td {
              padding: 5px 1px;
              text-align: center;
              white-space: nowrap;
            }

            .column-head .item-heading {
              width: 48%;
              text-align: left;
            }

            .column-head .qty-heading {
              width: 14%;
            }

            .column-head .rate-heading {
              width: 18%;
            }

            .column-head .total-heading {
              width: 20%;
              text-align: right;
            }

            .items {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              font-size: 11px;
            }

            .product-name-row td {
              padding: 5px 1px 0;
              text-align: left;
              font-size: 11px;
              line-height: 1.4;
              font-weight: 700;
              overflow-wrap: anywhere;
              word-break: break-word;
            }

            .product-value-row td {
              padding: 1px 1px 5px;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
            }

            .product-value-row .spacer {
              width: 48%;
            }

            .product-value-row .qty {
              width: 14%;
              text-align: center;
            }

            .product-value-row .rate {
              width: 18%;
              text-align: right;
            }

            .product-value-row .total {
              width: 20%;
              text-align: right;
            }

            .totals {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              font-weight: 700;
            }

            .totals td {
              padding: 5px 1px;
              white-space: nowrap;
            }

            .totals .items-count {
              text-align: left;
              width: 23%;
            }

            .totals .qty-count {
              text-align: center;
              width: 25%;
            }

            .totals .subtotal-label {
              text-align: right;
              width: 30%;
            }

            .totals .subtotal-value {
              text-align: right;
              width: 22%;
            }

            .net-total {
              width: 100%;
              border-collapse: collapse;
              margin-top: 2px;
            }

            .net-total td {
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
              padding: 8px 1px;
              font-size: 20px;
              font-weight: 900;
              white-space: nowrap;
            }

            .net-total .amount {
              text-align: right;
            }

            .footer {
              text-align: center;
              margin-top: 7px;
              padding-bottom: 5px;
              font-size: 11px;
              font-weight: 900;
            }
          </style>
        </head>

        <body>
          <div class="receipt">
            <div class="shop-header">
              <div class="shop-name">${escapeHtml(SHOP_NAME)}</div>
              <div class="shop-address">${escapeHtml(SHOP_ADDRESS)}</div>
            </div>

            <div class="dashed"></div>

            <table class="meta">
              <tr>
                <td>SERIAL NO ${escapeHtml(invoice.serialNo ?? "-")}</td>
                <td class="right">${escapeHtml(receiptDate)}</td>
              </tr>
              <tr>
                <td>BILL NO ${escapeHtml(invoice.invoiceNo || "-")}</td>
                <td class="right">${escapeHtml(receiptTime)}</td>
              </tr>
            </table>

            <div class="dashed"></div>

            <table class="column-head">
              <tr>
                <td class="item-heading">ITEM_NAME</td>
                <td class="qty-heading">QTY</td>
                <td class="rate-heading">RATE</td>
                <td class="total-heading">TOTAL</td>
              </tr>
            </table>

            <div class="dashed"></div>

            <table class="items">
              <tbody>
                ${productRows}
              </tbody>
            </table>

            <div class="dashed"></div>

            <table class="totals">
              <tr>
                <td class="items-count">Items: ${items.length}</td>
                <td class="qty-count">Qty: ${formatQuantity(totalQuantity)}</td>
                <td class="subtotal-label">SUB TOTAL</td>
                <td class="subtotal-value">${formatAmount(invoice.subtotal)}</td>
              </tr>
            </table>

            <table class="net-total">
              <tr>
                <td>NET TOTAL</td>
                <td class="amount">${formatAmount(invoice.totalAmount)}</td>
              </tr>
            </table>

            <div class="footer">THANK YOU ! VISIT AGAIN</div>
             <div class="footer">Developed and maintained by 
                             Annaa Silicon Technology Pvt Ltd</div>
          </div>
        </body>
        </html>
      `;

      // 58 mm paper is approximately 164 printer points.
      await Print.printAsync({
        html,
        width: 164,
      });
    } catch (error) {
      console.log("❌ PRINT ERROR:", error);

      Alert.alert(
        "Print Error",
        "Unable to print this bill. Check the printer service and try again."
      );
    }
  };



    // ===================================================

  // SHARE BILL

  // ===================================================



  const shareBill = async () => {



    if (!invoice) {

      return;

    }





    try {



      const message = `INVOICE #${

        invoice.invoiceNo || "-"

      }



Customer:

${

  invoice.customerName || "-"

}



Phone:

${

  invoice.customerMobile || "-"

}



Subtotal:

${money(invoice.subtotal)}



Discount:

${money(invoice.discount)}



CGST:

${money(invoice.cgst)}



SGST:

${money(invoice.sgst)}



TOTAL:

${money(invoice.totalAmount)}



Payment:

${

  invoice.paymentMode || "-"

}`;



      await Share.share({

        message,

      });



    } catch (error) {



      console.log(

        "❌ SHARE ERROR:",

        error

      );



    }



  };





  //whatsapp

   const shareToWhatsApp = async () => {
  if (!invoice) {
    Alert.alert("Error", "Invoice data is not available.");
    return;
  }

  try {
    const message = `INVOICE #${invoice.invoiceNo || "-"}

Customer: ${invoice.customerName || "Walk-in Customer"}
Phone: ${invoice.customerMobile || "-"}
Date: ${invoice.invoiceDate || "-"}

Subtotal: ${money(invoice.subtotal)}
Discount: ${money(invoice.discount)}
CGST: ${money(invoice.cgst)}
SGST: ${money(invoice.sgst)}${Number(invoice.igst || 0) > 0 ? `
IGST: ${money(invoice.igst)}` : ""}

TOTAL: ${money(invoice.totalAmount)}
Payment: ${invoice.paymentMode || "-"}

Thank you for your business!`;

    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert(
        "WhatsApp Not Installed",
        "Please install WhatsApp to share this bill."
      );
      return;
    }

    await Linking.openURL(url);
  } catch (error) {
    console.log("❌ WHATSAPP SHARE ERROR:", error);

    Alert.alert(
      "WhatsApp Error",
      "Unable to open WhatsApp."
    );
  }
};

// SMS&#x20;




const shareToSMS = async () => {
  if (!invoice) {
    Alert.alert(
      "Invoice Unavailable",
      "Invoice information is not available."
    );
    return;
  }

  try {
    const invoiceNumber = invoice.invoiceNo || "-";
    const customerName =
      invoice.customerName || "Walk-in Customer";
    const totalAmount = money(invoice.totalAmount);
    const paymentMode = invoice.paymentMode || "-";

    const message = `INVOICE #${invoiceNumber}

Dear ${customerName},

Thank you for your purchase.

Total Amount: ${totalAmount}
Payment Mode: ${paymentMode}

Thank you for your business!`;

    const phoneNumber = String(
      invoice.customerMobile || ""
    ).replace(/[^0-9+]/g, "");

    const smsUrl = phoneNumber
      ? `sms:${phoneNumber}?body=${encodeURIComponent(message)}`
      : `sms:?body=${encodeURIComponent(message)}`;

    await Linking.openURL(smsUrl);
  } catch (error) {
    console.error("SMS Share Error:", error);

    Alert.alert(
      "SMS Error",
      "Unable to open the SMS application. Please try again."
    );
  }
};



  // ===================================================

  // LOADING

  // ===================================================



  if (loading) {



    return (



      <View

        style={

          styles.loadingContainer

        }

      >



        <ActivityIndicator

          size="large"

          color="#4F46E5"

        />



        <Text

          style={

            styles.loadingText

          }

        >

          Loading invoice...

        </Text>



      </View>



    );



  }





  // ===================================================

  // NOT FOUND

  // ===================================================



  if (!invoice) {



    return (



      <View

        style={

          styles.emptyContainer

        }

      >



        <MaterialCommunityIcons

          name="receipt-text-remove-outline"

          size={65}

          color="#CBD5E1"

        />



        <Text

          style={

            styles.emptyTitle

          }

        >

          Invoice Not Found

        </Text>



        <TouchableOpacity

          style={

            styles.backButton

          }

          onPress={() =>

            router.back()

          }

        >



          <Text

            style={

              styles.backButtonText

            }

          >

            Go Back

          </Text>



        </TouchableOpacity>



      </View>



    );



  }





  // ===================================================

  // SCREEN

  // ===================================================



  return (



    <View

      style={

        styles.container

      }

    >



      {/* HEADER */}



      <View

        style={

          styles.header

        }

      >



        <TouchableOpacity

          style={

            styles.headerBack

          }

          onPress={() =>

            router.back()

          }

        >



          <MaterialCommunityIcons

            name="arrow-left"

            size={24}

            color="#FFFFFF"

          />



        </TouchableOpacity>





        <View

          style={

            styles.headerText

          }

        >



          <Text

            style={

              styles.headerSmall

            }

          >

            BILL PREVIEW

          </Text>



          <Text

            style={

              styles.headerTitle

            }

          >

            Invoice #{invoice.invoiceNo}

          </Text>



        </View>





        <View

          style={

            styles.paidBadge

          }

        >



          <Text

            style={

              styles.paidText

            }

          >

            {invoice.status || "PAID"}

          </Text>



        </View>



      </View>





      <ScrollView

        showsVerticalScrollIndicator={

          false

        }

        contentContainerStyle={

          styles.content

        }

      >



        {/* =========================================

            INVOICE CARD

        ========================================= */}



        <View

          style={

            styles.invoiceCard

          }

        >



          <View

            style={

              styles.invoiceTop

            }

          >



            <View>



              <Text

                style={

                  styles.invoiceHeading

                }

              >

                INVOICE

              </Text>



              <Text

                style={

                  styles.invoiceNumber

                }

              >

                #{invoice.invoiceNo}

              </Text>



            </View>





            <View

              style={

                styles.dateBox

              }

            >



              <MaterialCommunityIcons

                name="calendar-outline"

                size={17}

                color="#4F46E5"

              />



              <View>



                <Text

                  style={

                    styles.dateLabel

                  }

                >

                  DATE

                </Text>



                <Text

                  style={

                    styles.dateValue

                  }

                >

                  {invoice.invoiceDate ||

                    "-"}

                </Text>



              </View>



            </View>



          </View>





          <View

            style={

              styles.divider

            }

          />





          {/* CUSTOMER */}



          <View

            style={

              styles.customerSection

            }

          >



            <View

              style={

                styles.customerIcon

              }

            >



              <MaterialCommunityIcons

                name="account"

                size={21}

                color="#4F46E5"

              />



            </View>





            <View

              style={

                styles.customerDetails

              }

            >



              <Text

                style={

                  styles.customerLabel

                }

              >

                BILL TO

              </Text>



              <Text

                style={

                  styles.customerName

                }

              >

                {invoice.customerName ||

                  "Walk-in Customer"}

              </Text>



              {!!invoice.customerMobile && (



                <Text

                  style={

                    styles.customerPhone

                  }

                >

                  {invoice.customerMobile}

                </Text>



              )}



              {!!invoice.gstNo && (



                <Text

                  style={

                    styles.customerGST

                  }

                >

                  GSTIN: {invoice.gstNo}

                </Text>



              )}



            </View>



          </View>





          {/* PAYMENT */}



          <View

            style={

              styles.paymentRow

            }

          >



            <View>



              <Text

                style={

                  styles.infoLabel

                }

              >

                PAYMENT

              </Text>



              <Text

                style={

                  styles.infoValue

                }

              >

                {invoice.paymentMode ||

                  "-"}

              </Text>



            </View>





            <View

              style={

                styles.retailBox

              }

            >



              <Text

                style={

                  styles.retailText

                }

              >

                {invoice.billType ||

                  "Retail"}

              </Text>



            </View>



          </View>



        </View>





        {/* =========================================

            PRODUCTS

        ========================================= */}



        <View

          style={

            styles.productsCard

          }

        >



          <View

            style={

              styles.sectionHeader

            }

          >



            <MaterialCommunityIcons

              name="package-variant"

              size={21}

              color="#4F46E5"

            />



            <Text

              style={

                styles.sectionTitle

              }

            >

              Products

            </Text>



            <View

              style={

                styles.itemCount

              }

            >



              <Text

                style={

                  styles.itemCountText

                }

              >

                {items.length}

              </Text>



            </View>



          </View>





          {/* TABLE HEADER */}



          <View

            style={

              styles.tableHeader

            }

          >



            <Text

              style={[

                styles.tableHeaderText,

                styles.productColumn,

              ]}

            >

              PRODUCT

            </Text>



            <Text

              style={

                styles.qtyColumn

              }

            >

              QTY

            </Text>



            <Text

              style={

                styles.rateColumn

              }

            >

              RATE

            </Text>



            <Text

              style={

                styles.amountColumn

              }

            >

              AMOUNT

            </Text>



          </View>





          {items.map(

            (item, index) => (



              <View

                key={

                  item.id ||

                  String(index)

                }

                style={

                  styles.productRow

                }

              >



                <View

                  style={

                    styles.productColumn

                  }

                >



                  <Text

                    style={

                      styles.productName

                    }

                    numberOfLines={2}

                  >

                    {item.productName ||

                      "-"}

                  </Text>



                  <Text

                    style={

                      styles.productCode

                    }

                  >

                    #{item.productcode ||

                      "-"}

                  </Text>



                  <Text

                    style={

                      styles.productUnit

                    }

                  >

                    {item.uom ||

                      item.unit ||

                      "Unit"}

                  </Text>



                </View>





                <Text

                  style={

                    styles.qtyColumn

                  }

                >

                  {item.quantity || 0}

                </Text>





                <Text

                  style={

                    styles.rateColumn

                  }

                >

                  {money(

                    item.rate

                  )}

                </Text>





                <Text

                  style={

                    styles.amountColumn

                  }

                >

                  {money(

                    item.totalAmount ??

                    item.amount

                  )}

                </Text>



              </View>



            )

          )}





          {items.length === 0 && (



            <View

              style={

                styles.noItems

              }

            >



              <Text

                style={

                  styles.noItemsText

                }

              >

                No invoice items found.

              </Text>



            </View>



          )}



        </View>





        {/* =========================================

            TAX DETAILS

        ========================================= */}



        <View

          style={

            styles.taxCard

          }

        >



          <Text

            style={

              styles.taxTitle

            }

          >

            Tax Details

          </Text>





          <View

            style={

              styles.taxGrid

            }

          >



            <View

              style={

                styles.taxBox

              }

            >



              <Text

                style={

                  styles.taxLabel

                }

              >

                CGST

              </Text>



              <Text

                style={

                  styles.taxValue

                }

              >

                {money(

                  invoice.cgst

                )}

              </Text>



            </View>





            <View

              style={

                styles.taxBox

              }

            >



              <Text

                style={

                  styles.taxLabel

                }

              >

                SGST

              </Text>



              <Text

                style={

                  styles.taxValue

                }

              >

                {money(

                  invoice.sgst

                )}

              </Text>



            </View>





            {Number(

              invoice.igst || 0

            ) > 0 && (



              <View

                style={

                  styles.taxBox

                }

              >



                <Text

                  style={

                    styles.taxLabel

                  }

                >

                  IGST

                </Text>



                <Text

                  style={

                    styles.taxValue

                  }

                >

                  {money(

                    invoice.igst

                  )}

                </Text>



              </View>



            )}



          </View>



        </View>





        {/* =========================================

            SUMMARY

        ========================================= */}



        <View

          style={

            styles.summaryCard

          }

        >



          <Text

            style={

              styles.summaryTitle

            }

          >

            Invoice Summary

          </Text>





          <SummaryRow

            label="Subtotal"

            value={

              money(

                invoice.subtotal

              )

            }

          />





          <SummaryRow

            label="Discount"

            value={

              money(

                invoice.discount

              )

            }

          />





          <SummaryRow

            label="Taxable Amount"

            value={

              money(

                invoice.taxableAmount

              )

            }

          />





          <SummaryRow

            label="CGST"

            value={

              money(

                invoice.cgst

              )

            }

          />





          <SummaryRow

            label="SGST"

            value={

              money(

                invoice.sgst

              )

            }

          />





          {Number(

            invoice.igst || 0

          ) > 0 && (



            <SummaryRow

              label="IGST"

              value={

                money(

                  invoice.igst

                )

              }

            />



          )}





          <View

            style={

              styles.summaryDivider

            }

          />





          <View

            style={

              styles.totalRow

            }

          >



            <Text

              style={

                styles.totalLabel

              }

            >

              GRAND TOTAL

            </Text>



            <Text

              style={

                styles.totalValue

              }

            >

              {money(

                invoice.totalAmount

              )}

            </Text>



          </View>



        </View>





        {/* =========================================

            ACTIONS

        ========================================= */}



  <View style={styles.actionRow}>



  {/* PRINT */}

  <TouchableOpacity

    activeOpacity={0.85}

    style={[styles.actionButton, styles.printButton]}

    onPress={printBill}

  >

    <MaterialCommunityIcons

      name="printer-outline"

      size={20}

      color="#FFFFFF"

    />



    <Text style={styles.printButtonText}>

      PRINT

    </Text>

  </TouchableOpacity>





  {/* SHARE */}

  <TouchableOpacity

    activeOpacity={0.85}

    style={[styles.actionButton, styles.shareButton]}

    onPress={shareBill}

  >

    <MaterialCommunityIcons

      name="share-variant-outline"

      size={20}

      color="#4F46E5"

    />



    <Text style={styles.shareButtonText}>

      SHARE

    </Text>

  </TouchableOpacity>





  {/* WHATSAPP */}

  <TouchableOpacity

    activeOpacity={0.85}

    style={[styles.actionButton, styles.whatsappButton]}

    onPress={shareToWhatsApp}

  >

    <MaterialCommunityIcons

      name="whatsapp"

      size={20}

      color="#FFFFFF"

    />



    <Text style={styles.whatsappButtonText}>

      WHATSAPP

    </Text>

  </TouchableOpacity>





  {/* SMS */}

  <TouchableOpacity

    activeOpacity={0.85}

    style={[styles.actionButton, styles.smsButton]}

    onPress={shareToSMS}

  >

    <MaterialCommunityIcons

      name="message-text-outline"

      size={20}

      color="#FFFFFF"

    />



    <Text style={styles.smsButtonText}>

      SMS

    </Text>

  </TouchableOpacity>



</View>





        <View

          style={

            styles.bottomSpace

          }

        />



      </ScrollView>



    </View>



  );



}





// =====================================================

// SUMMARY ROW

// =====================================================



function SummaryRow({

  label,

  value,

}: {

  label: string;

  value: string;

}) {



  return (



    <View

      style={

        styles.summaryRow

      }

    >



      <Text

        style={

          styles.summaryLabel

        }

      >

        {label}

      </Text>



      <Text

        style={

          styles.summaryValue

        }

      >

        {value}

      </Text>



    </View>



  );



}





// =====================================================

// STYLES

// =====================================================



const styles =

  StyleSheet.create({



    container: {

      flex: 1,

      backgroundColor: "#F8FAFC",

    },



    content: {

      paddingBottom: 25,

    },





    // ===============================================

    // LOADING

    // ===============================================



    loadingContainer: {

      flex: 1,

      backgroundColor: "#F8FAFC",

      justifyContent: "center",

      alignItems: "center",

    },



    loadingText: {

      color: "#64748B",

      fontSize: 13,

      fontWeight: "700",

      marginTop: 10,

    },





    // ===============================================

    // EMPTY

    // ===============================================



    emptyContainer: {

      flex: 1,

      backgroundColor: "#F8FAFC",

      justifyContent: "center",

      alignItems: "center",

      paddingHorizontal: 30,

    },



    emptyTitle: {

      color: "#334155",

      fontSize: 19,

      fontWeight: "900",

      marginTop: 12,

    },



    backButton: {

      marginTop: 18,



      backgroundColor: "#4F46E5",



      paddingHorizontal: 22,

      paddingVertical: 11,



      borderRadius: 13,

    },



    backButtonText: {

      color: "#FFFFFF",

      fontSize: 12,

      fontWeight: "900",

    },





    // ===============================================

    // HEADER

    // ===============================================



    header: {

      backgroundColor: "#4F46E5",



      paddingTop: 50,

      paddingHorizontal: 16,

      paddingBottom: 22,



      flexDirection: "row",

      alignItems: "center",



      borderBottomLeftRadius: 28,

      borderBottomRightRadius: 28,

    },



    headerBack: {

      width: 43,

      height: 43,



      borderRadius: 13,



      backgroundColor:

        "rgba(255,255,255,0.16)",



      justifyContent: "center",

      alignItems: "center",



      marginRight: 11,

    },



    headerText: {

      flex: 1,

    },



    headerSmall: {

      color: "#C7D2FE",

      fontSize: 9,

      fontWeight: "900",

      letterSpacing: 1.2,

    },



    headerTitle: {

      color: "#FFFFFF",

      fontSize: 21,

      fontWeight: "900",

      marginTop: 2,

    },



    paidBadge: {

      backgroundColor: "#DCFCE7",



      paddingHorizontal: 9,

      paddingVertical: 6,



      borderRadius: 8,

    },



    paidText: {

      color: "#15803D",

      fontSize: 8,

      fontWeight: "900",

    },





    // ===============================================

    // INVOICE CARD

    // ===============================================



    invoiceCard: {

      backgroundColor: "#FFFFFF",



      marginHorizontal: 14,

      marginTop: 14,



      borderRadius: 20,



      padding: 16,



      borderWidth: 1,

      borderColor: "#E2E8F0",



      elevation: 2,

    },



    invoiceTop: {

      flexDirection: "row",

      justifyContent: "space-between",

      alignItems: "flex-start",

    },



    invoiceHeading: {

      color: "#64748B",

      fontSize: 10,

      fontWeight: "900",

      letterSpacing: 1.2,

    },



    invoiceNumber: {

      color: "#4F46E5",

      fontSize: 22,

      fontWeight: "900",

      marginTop: 2,

    },



    dateBox: {

      flexDirection: "row",

      alignItems: "center",



      backgroundColor: "#EEF2FF",



      paddingHorizontal: 9,

      paddingVertical: 7,



      borderRadius: 10,

    },



    dateLabel: {

      color: "#818CF8",

      fontSize: 7,

      fontWeight: "900",

      marginLeft: 6,

    },



    dateValue: {

      color: "#334155",

      fontSize: 10,

      fontWeight: "800",

      marginLeft: 6,

      marginTop: 1,

    },



    divider: {

      height: 1,

      backgroundColor: "#E2E8F0",

      marginVertical: 14,

    },





    // ===============================================

    // CUSTOMER

    // ===============================================



    customerSection: {

      flexDirection: "row",

      alignItems: "center",

    },



    customerIcon: {

      width: 43,

      height: 43,



      borderRadius: 13,



      backgroundColor: "#EEF2FF",



      justifyContent: "center",

      alignItems: "center",

    },



    customerDetails: {

      marginLeft: 10,

      flex: 1,

    },



    customerLabel: {

      color: "#94A3B8",

      fontSize: 8,

      fontWeight: "900",

      letterSpacing: 0.8,

    },



    customerName: {

      color: "#0F172A",

      fontSize: 14,

      fontWeight: "900",

      marginTop: 2,

    },



    customerPhone: {

      color: "#64748B",

      fontSize: 10,

      marginTop: 2,

    },



    customerGST: {

      color: "#4F46E5",

      fontSize: 9,

      fontWeight: "800",

      marginTop: 2,

    },



    paymentRow: {

      flexDirection: "row",

      justifyContent: "space-between",

      alignItems: "center",



      marginTop: 15,



      paddingTop: 12,



      borderTopWidth: 1,

      borderTopColor: "#F1F5F9",

    },



    infoLabel: {

      color: "#94A3B8",

      fontSize: 8,

      fontWeight: "900",

    },



    infoValue: {

      color: "#334155",

      fontSize: 12,

      fontWeight: "900",

      marginTop: 2,

    },



    retailBox: {

      backgroundColor: "#EEF2FF",

      paddingHorizontal: 10,

      paddingVertical: 6,

      borderRadius: 8,

    },



    retailText: {

      color: "#4F46E5",

      fontSize: 9,

      fontWeight: "900",

    },





    // ===============================================

    // PRODUCTS

    // ===============================================



    productsCard: {

      backgroundColor: "#FFFFFF",



      marginHorizontal: 14,

      marginTop: 14,



      borderRadius: 20,



      padding: 15,



      borderWidth: 1,

      borderColor: "#E2E8F0",



      elevation: 2,

    },



    sectionHeader: {

      flexDirection: "row",

      alignItems: "center",



      marginBottom: 13,

    },



    sectionTitle: {

      color: "#0F172A",

      fontSize: 16,

      fontWeight: "900",

      marginLeft: 8,

      flex: 1,

    },



    itemCount: {

      minWidth: 28,

      height: 28,



      borderRadius: 9,



      backgroundColor: "#EEF2FF",



      justifyContent: "center",

      alignItems: "center",

    },



    itemCountText: {

      color: "#4F46E5",

      fontSize: 10,

      fontWeight: "900",

    },



    tableHeader: {

      backgroundColor: "#F8FAFC",



      borderRadius: 9,



      paddingHorizontal: 9,

      paddingVertical: 8,



      flexDirection: "row",

      alignItems: "center",

    },



    tableHeaderText: {

      color: "#94A3B8",

      fontSize: 8,

      fontWeight: "900",

    },



    productColumn: {

      flex: 1,

      minWidth: 0,

    },



    qtyColumn: {

      width: 40,

      textAlign: "center",



      color: "#475569",

      fontSize: 9,

      fontWeight: "800",

    },



    rateColumn: {

      width: 62,

      textAlign: "right",



      color: "#475569",

      fontSize: 9,

      fontWeight: "800",

    },



    amountColumn: {

      width: 72,

      textAlign: "right",



      color: "#0F172A",

      fontSize: 9,

      fontWeight: "900",

    },



    productRow: {

      flexDirection: "row",

      alignItems: "center",



      paddingVertical: 11,



      borderBottomWidth: 1,

      borderBottomColor: "#F1F5F9",

    },



    productName: {

      color: "#0F172A",

      fontSize: 11,

      fontWeight: "900",

    },



    productCode: {

      color: "#4F46E5",

      fontSize: 8,

      marginTop: 2,

    },



    productUnit: {

      color: "#94A3B8",

      fontSize: 8,

      marginTop: 2,

    },



    noItems: {

      paddingVertical: 25,

      alignItems: "center",

    },



    noItemsText: {

      color: "#94A3B8",

      fontSize: 11,

    },





    // ===============================================

    // TAX

    // ===============================================



    taxCard: {

      backgroundColor: "#FFFFFF",



      marginHorizontal: 14,

      marginTop: 14,



      borderRadius: 18,



      padding: 15,



      borderWidth: 1,

      borderColor: "#E2E8F0",

    },



    taxTitle: {

      color: "#334155",

      fontSize: 13,

      fontWeight: "900",

      marginBottom: 10,

    },



    taxGrid: {

      flexDirection: "row",

      gap: 8,

    },



    taxBox: {

      flex: 1,



      backgroundColor: "#EEF2FF",



      borderRadius: 11,



      padding: 10,

    },



    taxLabel: {

      color: "#64748B",

      fontSize: 9,

      fontWeight: "800",

    },



    taxValue: {

      color: "#4F46E5",

      fontSize: 13,

      fontWeight: "900",

      marginTop: 3,

    },





    // ===============================================

    // SUMMARY

    // ===============================================



    summaryCard: {

      backgroundColor: "#FFFFFF",



      marginHorizontal: 14,

      marginTop: 14,



      borderRadius: 20,



      padding: 16,



      borderWidth: 1,

      borderColor: "#E2E8F0",



      elevation: 2,

    },



    summaryTitle: {

      color: "#0F172A",

      fontSize: 16,

      fontWeight: "900",



      marginBottom: 9,

    },



    summaryRow: {

      flexDirection: "row",

      justifyContent: "space-between",



      paddingVertical: 6,

    },



    summaryLabel: {

      color: "#64748B",

      fontSize: 11,

      fontWeight: "700",

    },



    summaryValue: {

      color: "#334155",

      fontSize: 11,

      fontWeight: "800",

    },



    summaryDivider: {

      height: 1,

      backgroundColor: "#CBD5E1",

      marginVertical: 9,

    },



    totalRow: {

      flexDirection: "row",

      alignItems: "center",

      justifyContent: "space-between",

    },



    totalLabel: {

      color: "#0F172A",

      fontSize: 14,

      fontWeight: "900",

    },



    totalValue: {

      color: "#4F46E5",

      fontSize: 22,

      fontWeight: "900",

    },





    // ===============================================

    // ACTIONS

    // ===============================================





    actionRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  paddingHorizontal: 14,
  marginTop: 15,
  rowGap: 10,
},

actionButton: {
  width: "48%",
  minHeight: 50,
  borderRadius: 10,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 6,
},



/* PRINT */

printButton: {

  backgroundColor: "#4F46E5",

},



printButtonText: {

  color: "#FFFFFF",

  fontSize: 13,

  fontWeight: "700",

  marginLeft: 7,

},



/* SHARE */

shareButton: {

  backgroundColor: "#EEF2FF",

  borderWidth: 1,

  borderColor: "#C7D2FE",

},



shareButtonText: {

  color: "#4F46E5",

  fontSize: 13,

  fontWeight: "700",

  marginLeft: 7,

},



/* WHATSAPP */

whatsappButton: {

  backgroundColor: "#25D366",

},



whatsappButtonText: {

  color: "#FFFFFF",

  fontSize: 13,

  fontWeight: "700",

  marginLeft: 7,

},



/* SMS */

smsButton: {

  backgroundColor: "#2563EB",

},



smsButtonText: {

  color: "#FFFFFF",

  fontSize: 13,

  fontWeight: "700",

  marginLeft: 7,

},















    doneButton: {

      marginHorizontal: 14,

      marginTop: 10,



      minHeight: 49,



      borderRadius: 15,



      backgroundColor: "#0F172A",



      flexDirection: "row",

      alignItems: "center",

      justifyContent: "center",

    },



    doneButtonText: {

      color: "#FFFFFF",

      fontSize: 12,

      fontWeight: "900",

      marginLeft: 7,

    },



    bottomSpace: {

      height: 25,

    },







  });