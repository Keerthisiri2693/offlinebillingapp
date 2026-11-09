import { StyleSheet } from "react-native";

// =====================================================
// COLORS
// =====================================================

export const COLORS = {
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  primaryLight: "#EEF2FF",

  success: "#16A34A",
  successLight: "#DCFCE7",

  blue: "#2563EB",
  blueLight: "#EFF6FF",

  orange: "#F97316",
  orangeLight: "#FFF7ED",

  danger: "#DC2626",
  dangerLight: "#FEF2F2",

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
// STYLES
// =====================================================

const styles = StyleSheet.create({

  // ===================================================
  // MAIN CARD
  // ===================================================

  card: {
    backgroundColor: COLORS.card,

    borderRadius: 22,

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
  // SECTION TITLE
  // ===================================================

  sectionTitle: {
    fontSize: 17,

    fontWeight: "800",

    color: COLORS.textPrimary,

    marginBottom: 12,

    letterSpacing: 0.2,
  },


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


  sectionTitleText: {
    fontSize: 14,

    fontWeight: "800",

    color: "#312E81",
  },


  // ===================================================
  // ROW
  // ===================================================

  row: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 9,
  },


  rowBorder: {
    paddingVertical: 11,

    borderBottomWidth: 1,

    borderBottomColor:
      COLORS.divider,
  },


  // ===================================================
  // PRODUCT CARD
  // ===================================================

  productCard: {
    marginTop: 12,

    borderWidth: 1,

    borderColor: "#E8ECF3",

    borderRadius: 20,

    padding: 15,

    backgroundColor:
      COLORS.card,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,

      height: 3,
    },

    shadowOpacity: 0.045,

    shadowRadius: 7,

    elevation: 2,
  },


  productHeader: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 13,
  },


  // ===================================================
  // PRODUCT IMAGE
  // ===================================================

  productImageContainer: {
    width: 58,

    height: 58,

    borderRadius: 17,

    backgroundColor:
      COLORS.primaryLight,

    justifyContent: "center",

    alignItems: "center",

    overflow: "hidden",

    borderWidth: 1,

    borderColor: "#E0E7FF",
  },


  productImage: {
    width: "100%",

    height: "100%",
  },


  productIcon: {
    color: COLORS.primary,

    fontSize: 26,
  },


  // ===================================================
  // PRODUCT INFO
  // ===================================================

  productInfo: {
    flex: 1,

    marginLeft: 12,
  },


  productName: {
    fontSize: 16,

    fontWeight: "800",

    color: COLORS.textPrimary,
  },


  productCode: {
    fontSize: 11,

    color: COLORS.textMuted,

    marginTop: 4,

    fontWeight: "600",
  },


  productCategory: {
    marginTop: 5,

    fontSize: 11,

    color: COLORS.primary,

    fontWeight: "700",
  },


  // ===================================================
  // PRODUCT PRICE BADGE
  // ===================================================

  priceBadge: {
    backgroundColor:
      COLORS.successLight,

    paddingHorizontal: 11,

    paddingVertical: 7,

    borderRadius: 12,

    alignItems: "center",
  },


  priceBadgeText: {
    color: COLORS.success,

    fontSize: 13,

    fontWeight: "800",
  },


  // ===================================================
  // PRODUCT DETAILS
  // ===================================================

  productDetails: {
    flexDirection: "row",

    backgroundColor:
      "#F8FAFC",

    borderRadius: 15,

    paddingVertical: 11,

    paddingHorizontal: 5,
  },


  productDetailBox: {
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

    letterSpacing: 0.4,
  },


  productDetailValue: {
    fontSize: 13,

    color: COLORS.textPrimary,

    fontWeight: "800",

    marginTop: 4,
  },


  // ===================================================
  // LABEL
  // ===================================================

  label: {
    color: COLORS.textSecondary,

    fontSize: 12,

    fontWeight: "600",
  },


  // ===================================================
  // VALUE
  // ===================================================

  value: {
    color: COLORS.textPrimary,

    fontSize: 14,

    fontWeight: "700",
  },


  // ===================================================
  // HIGHLIGHT VALUE
  // ===================================================

  highlightValue: {
    color: COLORS.primary,

    fontSize: 15,

    fontWeight: "800",
  },


  // ===================================================
  // TOTAL CARD
  // ===================================================

  totalCard: {
    marginTop: 15,

    backgroundColor:
      COLORS.card,

    borderRadius: 22,

    padding: 18,

    borderWidth: 1,

    borderColor: "#EEF2F7",

    shadowColor: "#0F172A",

    shadowOffset: {
      width: 0,

      height: 5,
    },

    shadowOpacity: 0.06,

    shadowRadius: 9,

    elevation: 4,
  },


  // ===================================================
  // TOTAL HEADER
  // ===================================================

  totalHeader: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 12,
  },


  totalIcon: {
    width: 40,

    height: 40,

    borderRadius: 13,

    backgroundColor:
      COLORS.successLight,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 10,
  },


  totalHeaderText: {
    fontSize: 15,

    fontWeight: "800",

    color: COLORS.textPrimary,
  },


  // ===================================================
  // TOTAL ROW
  // ===================================================

  totalRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingVertical: 9,
  },


  totalDivider: {
    height: 1,

    backgroundColor:
      COLORS.divider,

    marginVertical: 5,
  },


  totalText: {
    fontSize: 22,

    fontWeight: "900",

    color: COLORS.success,
  },


  totalAmount: {
    fontSize: 24,

    fontWeight: "900",

    color: COLORS.success,
  },


  // ===================================================
  // GRAND TOTAL
  // ===================================================

  grandTotalBox: {
    marginTop: 10,

    padding: 16,

    borderRadius: 18,

    backgroundColor:
      COLORS.primary,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    shadowColor:
      COLORS.primary,

    shadowOffset: {
      width: 0,

      height: 5,
    },

    shadowOpacity: 0.22,

    shadowRadius: 8,

    elevation: 5,
  },


  grandTotalLabel: {
    color:
      "rgba(255,255,255,0.72)",

    fontSize: 11,

    fontWeight: "700",

    textTransform: "uppercase",

    letterSpacing: 0.5,
  },


  grandTotalValue: {
    color: COLORS.white,

    fontSize: 27,

    fontWeight: "900",

    marginTop: 3,
  },


  // ===================================================
  // INFO TEXT
  // ===================================================

  infoText: {
    fontSize: 14,

    color: COLORS.textPrimary,

    marginBottom: 10,

    fontWeight: "600",

    lineHeight: 20,
  },


  mutedInfoText: {
    fontSize: 12,

    color: COLORS.textSecondary,

    marginBottom: 8,
  },


  // ===================================================
  // CUSTOMER INFO
  // ===================================================

  customerRow: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 10,

    borderBottomWidth: 1,

    borderBottomColor:
      COLORS.divider,
  },


  customerIcon: {
    width: 36,

    height: 36,

    borderRadius: 12,

    backgroundColor:
      COLORS.primaryLight,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 10,
  },


  customerInfo: {
    flex: 1,
  },


  customerName: {
    fontSize: 14,

    fontWeight: "800",

    color: COLORS.textPrimary,
  },


  customerMobile: {
    fontSize: 11,

    color: COLORS.textSecondary,

    marginTop: 3,
  },


  // ===================================================
  // STATUS BADGE
  // ===================================================

  statusBadge: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 10,

    paddingVertical: 6,

    borderRadius: 10,

    backgroundColor:
      COLORS.successLight,
  },


  statusText: {
    color: COLORS.success,

    fontSize: 10,

    fontWeight: "800",

    marginLeft: 4,
  },


  // ===================================================
  // TAX BADGE
  // ===================================================

  taxBadge: {
    backgroundColor:
      COLORS.blueLight,

    paddingHorizontal: 9,

    paddingVertical: 5,

    borderRadius: 9,
  },


  taxBadgeText: {
    color: COLORS.blue,

    fontSize: 10,

    fontWeight: "800",
  },


  // ===================================================
  // SMALL GAP
  // ===================================================

  gapSmall: {
    marginTop: 8,
  },


  // ===================================================
  // MEDIUM GAP
  // ===================================================

  gapMedium: {
    marginTop: 15,
  },


  // ===================================================
  // LARGE GAP
  // ===================================================

  gapLarge: {
    marginTop: 22,
  },


  // ===================================================
  // AMOUNT
  // ===================================================

  amountText: {
    fontSize: 18,

    fontWeight: "800",

    color: COLORS.primary,
  },


  // ===================================================
  // SUCCESS AMOUNT
  // ===================================================

  successAmount: {
    fontSize: 18,

    fontWeight: "800",

    color: COLORS.success,
  },


  // ===================================================
  // DISCOUNT
  // ===================================================

  discountBadge: {
    backgroundColor:
      COLORS.orangeLight,

    paddingHorizontal: 9,

    paddingVertical: 5,

    borderRadius: 9,
  },


  discountText: {
    color: COLORS.orange,

    fontSize: 10,

    fontWeight: "800",
  },


  // ===================================================
  // EMPTY
  // ===================================================

  emptyText: {
    textAlign: "center",

    color: COLORS.textMuted,

    marginTop: 25,

    fontSize: 13,

    fontWeight: "600",
  },


  emptyContainer: {
    alignItems: "center",

    justifyContent: "center",

    paddingVertical: 60,
  },


  emptyIcon: {
    width: 72,

    height: 72,

    borderRadius: 24,

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


  emptySubtitle: {
    fontSize: 12,

    color: COLORS.textSecondary,

    textAlign: "center",

    marginTop: 6,

    lineHeight: 19,
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
  // ACTION ROW
  // ===================================================

  actionRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginTop: 15,

    gap: 10,
  },


  // ===================================================
  // ACTION BUTTON
  // ===================================================

  actionButton: {
    flex: 1,

    minHeight: 46,

    borderRadius: 14,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    backgroundColor:
      COLORS.primaryLight,

    borderWidth: 1,

    borderColor: "#C7D2FE",
  },


  actionButtonText: {
    color: COLORS.primary,

    fontSize: 12,

    fontWeight: "800",

    marginLeft: 6,
  },


  // ===================================================
  // DELETE
  // ===================================================

  deleteButton: {
    width: 44,

    height: 44,

    borderRadius: 13,

    backgroundColor:
      COLORS.dangerLight,

    justifyContent: "center",

    alignItems: "center",
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

});

export default styles;