import { StyleSheet } from "react-native";

// =====================================================
// COLORS
// =====================================================

export const COLORS = {
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  primaryLight: "#EEF2FF",

  blue: "#2563EB",
  blueLight: "#EFF6FF",

  green: "#16A34A",
  greenLight: "#DCFCE7",

  orange: "#F97316",
  orangeLight: "#FFF7ED",

  red: "#DC2626",
  redLight: "#FEF2F2",

  purple: "#7C3AED",
  purpleLight: "#F5F3FF",

  background: "#F5F7FB",
  card: "#FFFFFF",

  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  border: "#E2E8F0",
  divider: "#F1F5F9",

  white: "#FFFFFF",
};

// =====================================================
// COMMON
// =====================================================

const RADIUS = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
};

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  // ===================================================
  // HEADER
  // ===================================================

  header: {
    paddingHorizontal: 18,

    paddingTop: 28,

    paddingBottom: 20,

    borderBottomLeftRadius: 30,

    borderBottomRightRadius: 30,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.15,

    shadowRadius: 10,

    elevation: 8,
  },


  headerRow: {
    minHeight: 58,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },


  title: {
    color: COLORS.white,

    fontSize: 22,

    fontWeight: "800",

    letterSpacing: 0.2,
  },


  subtitle: {
    color: "rgba(255,255,255,0.70)",

    fontSize: 12,

    fontWeight: "600",

    marginTop: 4,
  },


  headerButton: {
    width: 44,

    height: 44,

    borderRadius: 15,

    backgroundColor:
      "rgba(255,255,255,0.14)",

    justifyContent: "center",

    alignItems: "center",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.10)",
  },


  // ===================================================
  // CONTAINER
  // ===================================================

  container: {
    paddingHorizontal: 16,

    paddingTop: 16,

    paddingBottom: 130,

    backgroundColor:
      COLORS.background,
  },


  // ===================================================
  // MAIN CARD
  // ===================================================

  card: {
    backgroundColor: COLORS.card,

    borderRadius: RADIUS.xl,

    padding: 17,

    marginBottom: 15,

    borderWidth: 1,

    borderColor: "#EEF2F7",

    shadowColor: "#0F172A",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.055,

    shadowRadius: 10,

    elevation: 3,
  },


  // ===================================================
  // SECTION HEADER
  // ===================================================

  sectionHeader: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      COLORS.primaryLight,

    paddingVertical: 11,

    paddingHorizontal: 13,

    borderRadius: 15,

    marginBottom: 14,

    borderWidth: 1,

    borderColor: "#E0E7FF",
  },


  sectionIcon: {
    width: 34,

    height: 34,

    borderRadius: 11,

    backgroundColor:
      COLORS.primary,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 10,
  },


  sectionTitle: {
    fontSize: 15,

    fontWeight: "800",

    color: "#312E81",
  },


  sectionSubtitle: {
    fontSize: 10,

    color: "#6366F1",

    marginTop: 2,

    fontWeight: "600",
  },


  // ===================================================
  // ROW
  // ===================================================

  row: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 10,

    gap: 10,
  },


  halfInput: {
    width: "48%",

    height: 50,

    backgroundColor: "#FFFFFF",
  },


  fullInput: {
    width: "100%",

    height: 50,

    backgroundColor: "#FFFFFF",
  },


  // ===================================================
  // AMOUNT CARD
  // ===================================================

  amountCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 12,

    marginBottom: 10,

    borderWidth: 1,

    borderColor: "#EDEFF5",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,

      height: 2,
    },

    shadowOpacity: 0.035,

    shadowRadius: 5,

    elevation: 2,
  },


  inputContainer: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 8,
  },


  inputIcon: {
    marginRight: 8,
  },


  modernInput: {
    flex: 1,

    backgroundColor: "#FFFFFF",
  },


  // ===================================================
  // AMOUNT ROW
  // ===================================================

  amountRow: {
    flexDirection: "row",

    gap: 10,

    marginBottom: 10,
  },


  amountBox: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    borderRadius: 15,

    padding: 11,

    borderWidth: 1,

    borderColor: "#E8ECF3",

    minHeight: 82,
  },


  iconCircle: {
    width: 32,

    height: 32,

    borderRadius: 11,

    backgroundColor:
      COLORS.primaryLight,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 6,
  },


  boxLabel: {
    fontSize: 10,

    color: COLORS.textSecondary,

    fontWeight: "700",

    textTransform: "uppercase",

    letterSpacing: 0.4,
  },


  boxInput: {
    backgroundColor: "transparent",

    fontSize: 15,

    fontWeight: "800",

    height: 36,

    paddingHorizontal: 0,
  },


  amountValue: {
    fontSize: 17,

    fontWeight: "800",

    color: COLORS.textPrimary,

    marginTop: 5,
  },


  // ===================================================
  // TAX
  // ===================================================

  taxRow: {
    flexDirection: "row",

    gap: 10,

    marginBottom: 10,
  },


  taxCard: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    borderRadius: 15,

    padding: 12,

    borderWidth: 1,

    borderColor: "#E8ECF3",

    minHeight: 78,
  },


  taxIcon: {
    width: 28,

    height: 28,

    borderRadius: 10,

    backgroundColor:
      COLORS.blueLight,

    justifyContent: "center",

    alignItems: "center",
  },


  taxLabel: {
    fontSize: 10,

    color: COLORS.textSecondary,

    marginTop: 5,

    fontWeight: "700",
  },


  taxValue: {
    fontSize: 16,

    fontWeight: "800",

    color: COLORS.textPrimary,

    marginTop: 3,
  },


  // ===================================================
  // NET AMOUNT
  // ===================================================

  netAmountCard: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      COLORS.primary,

    borderRadius: 20,

    paddingVertical: 15,

    paddingHorizontal: 16,

    marginTop: 5,

    marginBottom: 12,

    shadowColor:
      COLORS.primary,

    shadowOffset: {
      width: 0,

      height: 5,
    },

    shadowOpacity: 0.22,

    shadowRadius: 9,

    elevation: 5,
  },


  netAmountLeft: {
    width: 46,

    height: 46,

    borderRadius: 16,

    backgroundColor:
      "rgba(255,255,255,0.16)",

    justifyContent: "center",

    alignItems: "center",
  },


  netAmountRight: {
    flex: 1,

    marginLeft: 12,
  },


  netAmountLabel: {
    color:
      "rgba(255,255,255,0.70)",

    fontSize: 11,

    fontWeight: "700",

    textTransform: "uppercase",

    letterSpacing: 0.6,
  },


  netAmountValue: {
    color: "#FFFFFF",

    fontSize: 26,

    fontWeight: "900",

    marginTop: 3,
  },


  // ===================================================
  // PRODUCT CARD
  // ===================================================

  productCard: {
    backgroundColor: COLORS.card,

    padding: 16,

    borderRadius: 20,

    marginBottom: 15,

    borderWidth: 1,

    borderColor: "#EEF2F7",

    shadowColor: "#0F172A",

    shadowOffset: {
      width: 0,

      height: 4,
    },

    shadowOpacity: 0.05,

    shadowRadius: 8,

    elevation: 3,
  },


  productHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 12,
  },


  productImage: {
    width: 54,

    height: 54,

    borderRadius: 16,

    backgroundColor:
      COLORS.primaryLight,

    justifyContent: "center",

    alignItems: "center",

    overflow: "hidden",
  },


  productInfo: {
    flex: 1,

    marginLeft: 11,
  },


  productName: {
    fontSize: 15,

    fontWeight: "800",

    color: COLORS.textPrimary,
  },


  productMeta: {
    fontSize: 11,

    color: COLORS.textSecondary,

    marginTop: 3,
  },


  productPriceBadge: {
    backgroundColor:
      COLORS.greenLight,

    paddingHorizontal: 11,

    paddingVertical: 7,

    borderRadius: 12,
  },


  productPrice: {
    color: COLORS.green,

    fontSize: 13,

    fontWeight: "800",
  },


  amountLabel: {
    fontSize: 13,

    color: COLORS.textSecondary,

    fontWeight: "600",
  },


  // ===================================================
  // PRODUCT DETAILS
  // ===================================================

  productDetailsRow: {
    flexDirection: "row",

    backgroundColor: "#F8FAFC",

    borderRadius: 14,

    padding: 10,

    marginTop: 10,
  },


  productDetail: {
    flex: 1,

    alignItems: "center",

    borderRightWidth: 1,

    borderRightColor:
      COLORS.border,
  },


  productDetailLast: {
    borderRightWidth: 0,
  },


  productDetailLabel: {
    fontSize: 9,

    color: COLORS.textMuted,

    fontWeight: "700",

    textTransform: "uppercase",
  },


  productDetailValue: {
    fontSize: 12,

    color: COLORS.textPrimary,

    fontWeight: "800",

    marginTop: 3,
  },


  // ===================================================
  // EXTRA
  // ===================================================

  expandBtn: {
    marginTop: 10,

    borderRadius: 13,

    overflow: "hidden",
  },


  extraSection: {
    marginTop: 12,

    padding: 14,

    backgroundColor:
      "#F8FAFC",

    borderRadius: 15,

    borderWidth: 1,

    borderColor:
      "#E2E8F0",
  },


  // ===================================================
  // TOTAL
  // ===================================================

  totalBox: {
    marginTop: 16,

    padding: 17,

    backgroundColor:
      COLORS.blueLight,

    borderRadius: 18,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    borderWidth: 1,

    borderColor: "#DBEAFE",
  },


  totalLeft: {
    flex: 1,
  },


  totalLabel: {
    fontSize: 11,

    color: COLORS.textSecondary,

    fontWeight: "700",

    textTransform: "uppercase",

    letterSpacing: 0.5,
  },


  totalText: {
    fontWeight: "800",

    fontSize: 17,

    color: COLORS.textPrimary,

    marginTop: 3,
  },


  totalAmount: {
    fontWeight: "900",

    fontSize: 23,

    color: COLORS.blue,
  },


  // ===================================================
  // BUTTON ROW
  // ===================================================

  btnRow: {
    flexDirection: "row",

    gap: 10,

    marginTop: 14,

    marginBottom: 10,
  },


  // ===================================================
  // SAVE BUTTON
  // ===================================================

  saveBtn: {
    flex: 1,

    backgroundColor:
      COLORS.primary,

    borderRadius: 15,

    minHeight: 50,

    justifyContent: "center",

    shadowColor:
      COLORS.primary,

    shadowOffset: {
      width: 0,

      height: 4,
    },

    shadowOpacity: 0.20,

    shadowRadius: 7,

    elevation: 4,
  },


  saveBtnContent: {
    height: 50,

    justifyContent: "center",

    alignItems: "center",

    flexDirection: "row",
  },


  saveBtnText: {
    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: "800",

    marginLeft: 7,
  },


  // ===================================================
  // OUTLINE BUTTON
  // ===================================================

  outlineBtn: {
    flex: 1,

    borderRadius: 15,

    minHeight: 50,

    borderWidth: 1.5,

    borderColor:
      COLORS.primary,

    backgroundColor:
      COLORS.white,

    justifyContent: "center",

    alignItems: "center",
  },


  outlineBtnText: {
    color: COLORS.primary,

    fontSize: 14,

    fontWeight: "800",
  },


  // ===================================================
  // SMALL ACTION BUTTON
  // ===================================================

  smallButton: {
    height: 40,

    paddingHorizontal: 13,

    borderRadius: 12,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    backgroundColor:
      COLORS.primaryLight,
  },


  smallButtonText: {
    color: COLORS.primary,

    fontSize: 12,

    fontWeight: "800",

    marginLeft: 5,
  },


  // ===================================================
  // DELETE BUTTON
  // ===================================================

  deleteButton: {
    width: 40,

    height: 40,

    borderRadius: 13,

    backgroundColor:
      COLORS.redLight,

    justifyContent: "center",

    alignItems: "center",
  },


  // ===================================================
  // ADD PRODUCT BUTTON
  // ===================================================

  addProductButton: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    backgroundColor:
      COLORS.primaryLight,

    borderRadius: 15,

    paddingVertical: 13,

    borderWidth: 1,

    borderColor: "#C7D2FE",

    borderStyle: "dashed",
  },


  addProductText: {
    color: COLORS.primary,

    fontSize: 13,

    fontWeight: "800",

    marginLeft: 7,
  },


  // ===================================================
  // DISCOUNT
  // ===================================================

  discountBadge: {
    backgroundColor:
      COLORS.orangeLight,

    paddingHorizontal: 10,

    paddingVertical: 6,

    borderRadius: 10,
  },


  discountText: {
    color: COLORS.orange,

    fontSize: 11,

    fontWeight: "800",
  },


  // ===================================================
  // SUCCESS
  // ===================================================

  successBadge: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      COLORS.greenLight,

    paddingHorizontal: 10,

    paddingVertical: 6,

    borderRadius: 10,
  },


  successText: {
    color: COLORS.green,

    fontSize: 11,

    fontWeight: "800",

    marginLeft: 4,
  },


  // ===================================================
  // DIVIDER
  // ===================================================

  divider: {
    height: 1,

    backgroundColor:
      COLORS.divider,

    marginVertical: 12,
  },


  // ===================================================
  // LOADING
  // ===================================================

  loaderContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      COLORS.background,
  },


  loaderText: {
    marginTop: 10,

    color: COLORS.textSecondary,

    fontSize: 13,

    fontWeight: "600",
  },


  // ===================================================
  // EMPTY
  // ===================================================

  emptyContainer: {
    alignItems: "center",

    justifyContent: "center",

    paddingVertical: 60,
  },


  emptyIcon: {
    width: 76,

    height: 76,

    borderRadius: 25,

    backgroundColor:
      COLORS.primaryLight,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 14,
  },


  emptyTitle: {
    fontSize: 17,

    fontWeight: "800",

    color: COLORS.textPrimary,
  },


  emptyText: {
    fontSize: 13,

    color: COLORS.textSecondary,

    textAlign: "center",

    marginTop: 6,

    lineHeight: 20,
  },

});

export default styles;