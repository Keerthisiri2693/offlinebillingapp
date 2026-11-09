import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  primaryDeep: "#312E81",

  background: "#F6F8FC",
  card: "#FFFFFF",

  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  border: "#E2E8F0",

  success: "#16A34A",
  successLight: "#DCFCE7",

  whatsapp: "#25D366",
  sms: "#0284C7",
  pdf: "#DC2626",
  image: "#7C3AED",
  print: "#0F766E",

  blueLight: "#EFF6FF",
  purpleLight: "#F5F3FF",
  greenLight: "#F0FDF4",
  orangeLight: "#FFF7ED",
};


const SHADOW = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.07,
  shadowRadius: 8,
  elevation: 4,
};


export default StyleSheet.create({

  // =====================================================
  // MAIN
  // =====================================================

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },


  scrollContent: {
    paddingBottom: 40,
  },


  // =====================================================
  // HEADER
  // =====================================================

  header: {
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 22,

    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    overflow: "hidden",

    ...SHADOW,
  },


  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },


  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },


  backButton: {
    width: 44,
    height: 44,

    borderRadius: 15,

    backgroundColor:
      "rgba(255,255,255,0.16)",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.15)",
  },


  headerTitleContainer: {
    marginLeft: 13,
    flex: 1,
  },


  headerSmallTitle: {
    color:
      "rgba(255,255,255,0.72)",

    fontSize: 11,

    fontWeight: "800",

    letterSpacing: 1.2,
  },


  title: {
    color: "#FFFFFF",

    fontSize: 21,

    fontWeight: "900",

    letterSpacing: 0.2,

    marginTop: 3,
  },


  headerAction: {
    width: 44,
    height: 44,

    borderRadius: 15,

    backgroundColor:
      "rgba(255,255,255,0.16)",

    justifyContent: "center",
    alignItems: "center",
  },


  // =====================================================
  // CONTAINER
  // =====================================================

  containerContent: {
    padding: 16,

    backgroundColor:
      COLORS.background,

    paddingBottom: 120,
  },


  // =====================================================
  // COMMON CARD
  // =====================================================

  card: {
    backgroundColor:
      COLORS.card,

    padding: 18,

    borderRadius: 22,

    marginBottom: 16,

    ...SHADOW,
  },


  sectionTitle: {
    fontSize: 17,

    fontWeight: "900",

    color:
      COLORS.textPrimary,

    marginBottom: 14,
  },


  sectionSubtitle: {
    fontSize: 12,

    color:
      COLORS.textMuted,

    marginTop: -8,

    marginBottom: 14,
  },


  // =====================================================
  // CUSTOMER
  // =====================================================

  customerCard: {
    backgroundColor:
      COLORS.card,

    borderRadius: 22,

    padding: 18,

    marginBottom: 16,

    flexDirection: "row",

    alignItems: "center",

    ...SHADOW,
  },


  customerAvatar: {
    width: 56,
    height: 56,

    borderRadius: 19,

    backgroundColor:
      COLORS.primaryLight,

    justifyContent: "center",
    alignItems: "center",
  },


  customerDetails: {
    flex: 1,

    marginLeft: 13,
  },


  customerLabel: {
    fontSize: 10,

    fontWeight: "800",

    color:
      COLORS.textMuted,

    letterSpacing: 1,
  },


  customerName: {
    fontSize: 17,

    fontWeight: "800",

    color:
      COLORS.textPrimary,

    marginTop: 3,
  },


  customerPhone: {
    fontSize: 12,

    color:
      COLORS.textSecondary,

    marginTop: 4,
  },


  customerInfoRow: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 10,
  },


  customerInfoText: {
    marginLeft: 10,

    color:
      COLORS.textPrimary,

    fontSize: 14,

    fontWeight: "600",
  },


  // =====================================================
  // INVOICE INFO
  // =====================================================

  invoiceInfoCard: {
    backgroundColor:
      "#0F172A",

    borderRadius: 26,

    padding: 22,

    marginBottom: 18,

    ...SHADOW,
  },


  invoiceNumberLabel: {
    color:
      "rgba(255,255,255,0.62)",

    fontSize: 11,

    fontWeight: "800",

    letterSpacing: 1,
  },


  invoiceNumber: {
    color: "#FFFFFF",

    fontSize: 28,

    fontWeight: "900",

    marginTop: 5,
  },


  infoGrid: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    marginTop: 24,
  },


  infoGridItem: {
    flex: 1,
  },


  infoGridLabel: {
    color:
      "rgba(255,255,255,0.55)",

    fontSize: 10,

    fontWeight: "700",

    letterSpacing: 0.6,
  },


  infoGridValue: {
    color: "#FFFFFF",

    fontSize: 13,

    fontWeight: "700",

    marginTop: 5,
  },


  paidBadge: {
    backgroundColor:
      COLORS.successLight,

    paddingHorizontal: 10,

    paddingVertical: 5,

    borderRadius: 20,

    alignSelf: "flex-start",
  },


  paidText: {
    color:
      COLORS.success,

    fontSize: 10,

    fontWeight: "900",
  },


  // =====================================================
  // PRODUCT SECTION
  // =====================================================

  productSection: {
    marginBottom: 8,
  },


  // =====================================================
  // PRODUCT CARD
  // =====================================================

  modernItemCard: {
    backgroundColor:
      COLORS.card,

    borderRadius: 22,

    padding: 16,

    marginBottom: 13,

    borderWidth: 1,

    borderColor:
      "#EEF2F7",

    ...SHADOW,
  },


  modernItemTop: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    marginBottom: 12,
  },


  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  productImageContainer: {
    width: 68,

    height: 68,

    borderRadius: 18,

    backgroundColor:
      "#F1F5F9",

    justifyContent: "center",

    alignItems: "center",

    overflow: "hidden",

    marginRight: 12,

    borderWidth: 1,

    borderColor:
      "#E2E8F0",
  },


  productImage: {
    width: "100%",

    height: "100%",
  },


  productImagePlaceholder: {
    width: 68,

    height: 68,

    borderRadius: 18,

    backgroundColor:
      "#F1F5F9",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 12,
  },


  productDetails: {
    flex: 1,
  },


  modernItemName: {
    fontSize: 16,

    lineHeight: 21,

    fontWeight: "900",

    color:
      COLORS.textPrimary,
  },


  productCode: {
    fontSize: 10,

    color:
      COLORS.textMuted,

    fontWeight: "700",

    marginTop: 3,
  },


  modernItemMeta: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 7,

    flexWrap: "wrap",
  },


  modernMetaText: {
    color:
      COLORS.textSecondary,

    fontSize: 12,

    fontWeight: "600",
  },


  metaDot: {
    marginHorizontal: 6,

    color:
      COLORS.textMuted,

    fontSize: 12,
  },


  modernPriceBadge: {
    backgroundColor:
      COLORS.blueLight,

    paddingHorizontal: 12,

    paddingVertical: 7,

    borderRadius: 20,
  },


  modernPriceText: {
    color:
      COLORS.sms,

    fontWeight: "900",

    fontSize: 13,
  },


  // =====================================================
  // PRODUCT PRICE / TAX
  // =====================================================

  itemBottomRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginTop: 15,

    paddingTop: 13,

    borderTopWidth: 1,

    borderTopColor:
      "#F1F5F9",
  },


  itemStat: {
    flex: 1,
  },


  itemStatLabel: {
    color:
      COLORS.textMuted,

    fontSize: 9,

    fontWeight: "800",

    letterSpacing: 0.7,

    marginBottom: 4,
  },


  itemStatValue: {
    color:
      COLORS.textPrimary,

    fontSize: 13,

    fontWeight: "800",
  },


  itemTotal: {
    color:
      COLORS.success,

    fontSize: 16,

    fontWeight: "900",
  },


  // =====================================================
  // TABLE
  // =====================================================

  tableHeader: {
    flexDirection: "row",

    paddingVertical: 9,

    borderBottomWidth: 1,

    borderBottomColor:
      COLORS.border,

    marginBottom: 5,
  },


  th: {
    fontSize: 11,

    fontWeight: "800",

    color:
      COLORS.textSecondary,

    letterSpacing: 0.4,
  },


  itemRow: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 11,

    borderBottomWidth: 1,

    borderBottomColor:
      "#F1F5F9",
  },


  // =====================================================
  // BILL
  // =====================================================

  billRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 9,
  },


  billLabel: {
    color:
      COLORS.textSecondary,

    fontSize: 13,

    fontWeight: "600",
  },


  billValue: {
    color:
      COLORS.textPrimary,

    fontSize: 14,

    fontWeight: "700",
  },


  // =====================================================
  // TOTAL
  // =====================================================

  totalCard: {
    backgroundColor:
      COLORS.card,

    padding: 18,

    borderRadius: 22,

    marginTop: 4,

    ...SHADOW,
  },


  totalBox: {
    marginTop: 10,

    padding: 15,

    backgroundColor:
      "#EEF2FF",

    borderRadius: 15,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },


  totalText: {
    fontWeight: "800",

    fontSize: 16,

    color:
      COLORS.textPrimary,
  },


  totalAmount: {
    fontWeight: "900",

    fontSize: 21,

    color:
      COLORS.primary,
  },


  // =====================================================
  // PREMIUM TOTAL
  // =====================================================

  premiumTotalCard: {
    borderRadius: 28,

    padding: 26,

    marginTop: 10,

    marginBottom: 25,

    ...SHADOW,
  },


  premiumTotalLabel: {
    color:
      "rgba(255,255,255,0.72)",

    fontSize: 12,

    fontWeight: "800",

    letterSpacing: 1.1,
  },


  premiumTotalAmount: {
    color: "#FFFFFF",

    fontSize: 36,

    fontWeight: "900",

    marginTop: 9,
  },


  paidRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 17,
  },


  paidRowText: {
    color: "#DFFFE4",

    marginLeft: 8,

    fontSize: 13,

    fontWeight: "700",
  },


  totalGradient: {
    padding: 18,

    borderRadius: 20,

    marginTop: 4,
  },


  grandTotalLabel: {
    color:
      "rgba(255,255,255,0.72)",

    fontSize: 11,

    marginBottom: 5,

    fontWeight: "800",

    letterSpacing: 0.8,
  },


  grandTotalAmount: {
    color: "#FFFFFF",

    fontSize: 28,

    fontWeight: "900",
  },


  // =====================================================
  // SHARE SECTION
  // =====================================================

  shareSection: {
    marginTop: 5,

    marginBottom: 10,
  },


  shareTitleRow: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 17,
  },


  shareTitleIcon: {
    width: 42,

    height: 42,

    borderRadius: 14,

    backgroundColor:
      COLORS.purpleLight,

    justifyContent: "center",

    alignItems: "center",
  },


  shareTitle: {
    fontSize: 20,

    fontWeight: "900",

    color:
      COLORS.textPrimary,

    marginLeft: 10,
  },


  shareGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent:
      "space-between",
  },


  shareCard: {
    width: "48%",

    borderRadius: 24,

    paddingVertical: 25,

    alignItems: "center",

    marginBottom: 14,

    ...SHADOW,
  },


  shareIconCircle: {
    width: 66,

    height: 66,

    borderRadius: 33,

    backgroundColor:
      "rgba(255,255,255,0.16)",

    justifyContent: "center",

    alignItems: "center",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.12)",
  },


  shareCardTitle: {
    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "900",

    marginTop: 12,
  },


  shareCardSubtitle: {
    color:
      "rgba(255,255,255,0.78)",

    fontSize: 11,

    marginTop: 4,
  },


  // =====================================================
  // ACTION BUTTONS
  // =====================================================

  actionBtn: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    paddingVertical: 14,

    paddingHorizontal: 14,

    borderRadius: 16,

    backgroundColor:
      COLORS.primary,

    width: "48%",

    marginBottom: 12,

    ...SHADOW,
  },


  actionText: {
    color: "#FFFFFF",

    marginLeft: 8,

    fontWeight: "800",

    fontSize: 14,
  },


  whatsappBtn: {
    backgroundColor:
      COLORS.whatsapp,
  },


  smsBtn: {
    backgroundColor:
      COLORS.sms,
  },


  pdfBtn: {
    backgroundColor:
      COLORS.pdf,
  },


  imageBtn: {
    backgroundColor:
      COLORS.image,
  },


  printBtn: {
    backgroundColor:
      COLORS.print,
  },


  button: {
    flexDirection: "row",

    backgroundColor:
      COLORS.primary,

    paddingVertical: 11,

    paddingHorizontal: 16,

    borderRadius: 13,

    justifyContent: "center",

    alignItems: "center",

    ...SHADOW,
  },


  buttonText: {
    color: "#FFFFFF",

    marginLeft: 7,

    fontWeight: "700",

    fontSize: 13,
  },


  // =====================================================
  // BADGES
  // =====================================================

  paidBadge: {
    backgroundColor:
      COLORS.successLight,

    paddingHorizontal: 9,

    paddingVertical: 4,

    borderRadius: 16,
  },


  paidText: {
    color:
      COLORS.success,

    fontSize: 10,

    fontWeight: "800",
  },


  statusBadge: {
    paddingHorizontal: 10,

    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor:
      COLORS.successLight,

    alignSelf: "flex-start",
  },


  statusText: {
    color:
      COLORS.success,

    fontSize: 10,

    fontWeight: "900",
  },


  // =====================================================
  // ICON ROW
  // =====================================================

  iconRow: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 8,
  },


  // =====================================================
  // LOADER
  // =====================================================

  loaderContainer: {
    marginTop: 16,

    alignItems: "center",

    justifyContent: "center",
  },


  loaderCircle: {
    width: 82,

    height: 82,

    borderRadius: 41,

    backgroundColor:
      COLORS.purpleLight,

    justifyContent: "center",

    alignItems: "center",
  },


  processingText: {
    marginTop: 12,

    color:
      COLORS.primary,

    fontSize: 15,

    fontWeight: "800",
  },


  // =====================================================
  // EMPTY
  // =====================================================

  emptyContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 30,
  },


  emptyIcon: {
    width: 100,

    height: 100,

    borderRadius: 50,

    backgroundColor:
      "#F1F5F9",

    justifyContent: "center",

    alignItems: "center",
  },


  emptyTitle: {
    marginTop: 18,

    color:
      COLORS.textPrimary,

    fontSize: 20,

    fontWeight: "900",
  },


  emptyText: {
    textAlign: "center",

    color:
      COLORS.textSecondary,

    marginTop: 8,

    fontSize: 12,

    lineHeight: 19,
  },

});

