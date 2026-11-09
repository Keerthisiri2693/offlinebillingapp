import { StyleSheet } from "react-native";

// =====================================================
// COLORS
// =====================================================

export const COLORS = {
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  primaryLight: "#EEF2FF",

  secondary: "#7C3AED",

  background: "#F5F7FB",
  card: "#FFFFFF",

  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  border: "#E2E8F0",
  divider: "#F1F5F9",

  success: "#16A34A",
  successLight: "#DCFCE7",

  danger: "#EF4444",
  dangerLight: "#FEF2F2",

  blue: "#2563EB",
  blueLight: "#EFF6FF",

  orange: "#F97316",
  orangeLight: "#FFF7ED",

  white: "#FFFFFF",
};


// =====================================================
// SPACING
// =====================================================

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};


// =====================================================
// RADIUS
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
  // SCREEN
  // ===================================================

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },


  // ===================================================
  // HEADER
  // ===================================================

  header: {
    paddingHorizontal: SPACING.lg,

    paddingTop: 30,

    paddingBottom: 20,

    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,

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
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 18,
  },


  // ===================================================
  // HEADER BACK BUTTON
  // ===================================================

  backButton: {
    width: 44,

    height: 44,

    borderRadius: 15,

    backgroundColor:
      "rgba(255,255,255,0.13)",

    justifyContent: "center",

    alignItems: "center",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.08)",
  },


  // ===================================================
  // HEADER TITLE
  // ===================================================

  titleContainer: {
    flex: 1,

    marginLeft: 13,
  },


  title: {
    color: COLORS.white,

    fontSize: 24,

    fontWeight: "800",

    letterSpacing: 0.3,
  },


  subtitle: {
    color:
      "rgba(255,255,255,0.68)",

    fontSize: 12,

    fontWeight: "600",

    marginTop: 3,
  },


  // ===================================================
  // HEADER ACTION
  // ===================================================

  headerAction: {
    width: 44,

    height: 44,

    borderRadius: 15,

    backgroundColor:
      "rgba(255,255,255,0.13)",

    justifyContent: "center",

    alignItems: "center",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.08)",
  },


  // ===================================================
  // SEARCH BOX
  // ===================================================

  searchBox: {
    height: 56,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.13)",

    borderRadius: 20,

    paddingHorizontal: 10,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.10)",
  },


  searchIconContainer: {
    width: 39,

    height: 39,

    borderRadius: 13,

    backgroundColor:
      "rgba(255,255,255,0.10)",

    justifyContent: "center",

    alignItems: "center",
  },


  searchInput: {
    flex: 1,

    height: 54,

    marginLeft: 9,

    color: COLORS.white,

    fontSize: 14,

    fontWeight: "600",
  },


  searchClear: {
    width: 36,

    height: 36,

    borderRadius: 12,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.12)",
  },


  searchCount: {
    minWidth: 32,

    height: 30,

    paddingHorizontal: 8,

    borderRadius: 10,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.13)",
  },


  searchCountText: {
    color: COLORS.white,

    fontSize: 12,

    fontWeight: "800",
  },


  // ===================================================
  // LIST CONTAINER
  // ===================================================

  container: {
    paddingHorizontal: SPACING.lg,

    paddingTop: SPACING.lg,

    paddingBottom: 120,

    backgroundColor:
      COLORS.background,

    flexGrow: 1,
  },


  // ===================================================
  // INVOICE CARD
  // ===================================================

  card: {
    backgroundColor:
      COLORS.card,

    padding: SPACING.lg,

    borderRadius: 22,

    marginBottom: 14,

    borderWidth: 1,

    borderColor: "#EEF2F7",

    shadowColor: "#0F172A",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.06,

    shadowRadius: 10,

    elevation: 3,
  },


  // ===================================================
  // CARD TOP ROW
  // ===================================================

  cardTopRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },


  // ===================================================
  // LEFT SIDE
  // ===================================================

  left: {
    flex: 1,

    minWidth: 0,
  },


  invoiceIcon: {
    width: 48,

    height: 48,

    borderRadius: 16,

    backgroundColor:
      COLORS.primaryLight,

    justifyContent: "center",

    alignItems: "center",
  },


  invoiceHeaderRow: {
    flexDirection: "row",

    alignItems: "center",
  },


  invoiceTitleContainer: {
    marginLeft: 11,

    flex: 1,
  },


  invoiceLabel: {
    fontSize: 10,

    color: COLORS.textMuted,

    fontWeight: "800",

    letterSpacing: 1,
  },


  invoiceNo: {
    fontSize: 18,

    fontWeight: "800",

    color: COLORS.textPrimary,

    marginTop: 2,
  },


  customer: {
    marginTop: 3,

    fontSize: 14,

    fontWeight: "700",

    color: COLORS.textPrimary,
  },


  date: {
    marginTop: 4,

    fontSize: 11,

    color: COLORS.textMuted,
  },


  // ===================================================
  // RIGHT SIDE
  // ===================================================

  right: {
    alignItems: "flex-end",

    justifyContent: "center",
  },


  // ===================================================
  // AMOUNT
  // ===================================================

  amountBadge: {
    minWidth: 100,

    paddingHorizontal: 14,

    paddingVertical: 10,

    borderRadius: 16,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      COLORS.primary,
  },


  amount: {
    fontSize: 15,

    fontWeight: "800",

    color: COLORS.white,
  },


  // ===================================================
  // CUSTOMER ROW
  // ===================================================

  customerRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 16,

    paddingTop: 14,

    borderTopWidth: 1,

    borderTopColor:
      COLORS.divider,
  },


  avatar: {
    width: 46,

    height: 46,

    borderRadius: 16,

    backgroundColor:
      COLORS.primaryLight,

    justifyContent: "center",

    alignItems: "center",
  },


  avatarText: {
    color: COLORS.primary,

    fontSize: 18,

    fontWeight: "800",
  },


  customerInfo: {
    flex: 1,

    marginLeft: 11,
  },


  customerName: {
    fontSize: 15,

    fontWeight: "700",

    color: COLORS.textPrimary,
  },


  customerMeta: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 5,
  },


  metaText: {
    marginLeft: 4,

    fontSize: 11,

    color: COLORS.textSecondary,
  },


  metaDot: {
    width: 3,

    height: 3,

    borderRadius: 2,

    backgroundColor:
      "#CBD5E1",

    marginHorizontal: 7,
  },


  // ===================================================
  // PAID BADGE
  // ===================================================

  paidBadge: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 10,

    paddingVertical: 7,

    borderRadius: 12,

    backgroundColor:
      COLORS.successLight,
  },


  paidText: {
    color: COLORS.success,

    fontSize: 10,

    fontWeight: "800",

    marginLeft: 4,
  },


  // ===================================================
  // DETAILS
  // ===================================================

  detailsRow: {
    flexDirection: "row",

    marginTop: 14,

    paddingVertical: 11,

    paddingHorizontal: 8,

    borderRadius: 15,

    backgroundColor:
      "#F8FAFC",
  },


  detailItem: {
    flex: 1,

    alignItems: "center",

    borderRightWidth: 1,

    borderRightColor:
      COLORS.border,
  },


  detailItemLast: {
    borderRightWidth: 0,
  },


  detailLabel: {
    fontSize: 8,

    color: COLORS.textMuted,

    fontWeight: "800",

    letterSpacing: 0.6,
  },


  detailValue: {
    marginTop: 4,

    fontSize: 11,

    color: COLORS.textPrimary,

    fontWeight: "800",
  },


  // ===================================================
  // DELETE BUTTON
  // ===================================================

  deleteBtn: {
    width: 40,

    height: 40,

    borderRadius: 13,

    backgroundColor:
      COLORS.dangerLight,

    justifyContent: "center",

    alignItems: "center",
  },


  // ===================================================
  // ACTION BUTTON
  // ===================================================

  actionBtn: {
    width: 40,

    height: 40,

    borderRadius: 13,

    backgroundColor:
      "#F8FAFC",

    justifyContent: "center",

    alignItems: "center",

    marginTop: 10,

    borderWidth: 1,

    borderColor:
      COLORS.border,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,

    shadowRadius: 3,

    elevation: 2,
  },


  editBtn: {
    backgroundColor:
      COLORS.blueLight,

    borderColor:
      "#DBEAFE",
  },


  // ===================================================
  // ACTION ROW
  // ===================================================

  actionRow: {
    flexDirection: "row",

    justifyContent: "flex-end",

    alignItems: "center",

    gap: 8,

    marginTop: 14,
  },


  actionButton: {
    height: 38,

    paddingHorizontal: 12,

    borderRadius: 12,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",
  },


  actionButtonText: {
    marginLeft: 5,

    fontSize: 12,

    fontWeight: "800",
  },


  editAction: {
    backgroundColor:
      COLORS.blueLight,
  },


  editActionText: {
    color: COLORS.blue,
  },


  deleteAction: {
    backgroundColor:
      COLORS.dangerLight,
  },


  deleteActionText: {
    color: COLORS.danger,
  },


  // ===================================================
  // EMPTY
  // ===================================================

  empty: {
    textAlign: "center",

    marginTop: 70,

    fontSize: 14,

    color: COLORS.textSecondary,

    fontWeight: "600",
  },


  emptyContainer: {
    alignItems: "center",

    justifyContent: "center",

    paddingTop: 70,

    paddingHorizontal: 25,
  },


  emptyIcon: {
    width: 80,

    height: 80,

    borderRadius: 28,

    backgroundColor:
      "#E2E8F0",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 15,
  },


  emptyTitle: {
    fontSize: 18,

    fontWeight: "800",

    color: COLORS.textPrimary,
  },


  emptySubtitle: {
    marginTop: 7,

    fontSize: 13,

    color: COLORS.textSecondary,

    textAlign: "center",

    lineHeight: 20,
  },


  clearSearchButton: {
    marginTop: 18,

    paddingHorizontal: 18,

    paddingVertical: 10,

    borderRadius: 12,

    backgroundColor:
      COLORS.primary,
  },


  clearSearchText: {
    color: "#fff",

    fontSize: 12,

    fontWeight: "800",
  },


  // ===================================================
  // FLOATING BUTTON
  // ===================================================

  fab: {
    position: "absolute",

    bottom: 28,

    right: 20,

    width: 60,

    height: 60,

    borderRadius: 22,

    backgroundColor:
      COLORS.primary,

    justifyContent: "center",

    alignItems: "center",

    shadowColor:
      COLORS.primary,

    shadowOffset: {
      width: 0,
      height: 7,
    },

    shadowOpacity: 0.30,

    shadowRadius: 10,

    elevation: 8,
  },


  fabIcon: {
    color: "#fff",

    fontSize: 30,

    fontWeight: "300",
  },


  // ===================================================
  // LOADING
  // ===================================================

  loadingContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      COLORS.background,
  },


  loadingText: {
    marginTop: 10,

    color: COLORS.textSecondary,

    fontSize: 13,

    fontWeight: "600",
  },

});

export default styles;

