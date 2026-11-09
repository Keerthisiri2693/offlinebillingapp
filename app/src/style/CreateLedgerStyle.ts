import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  primarySoft: "#EEF2FF",

  background: "#F6F7FB",
  white: "#FFFFFF",

  text: "#111827",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  border: "#E5E7EB",

  green: "#16A34A",
  greenSoft: "#ECFDF3",

  red: "#DC2626",
  redSoft: "#FEF2F2",

  orange: "#EA580C",
  orangeSoft: "#FFF7ED",

  blue: "#0284C7",
  blueSoft: "#F0F9FF",

  purple: "#7C3AED",
  purpleSoft: "#F5F3FF",
};

export default StyleSheet.create({

  // =====================================================
  // SCREEN
  // =====================================================

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    paddingTop: 52,
    paddingHorizontal: 18,
    paddingBottom: 20,

    backgroundColor: COLORS.primary,

    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,

    elevation: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.14,
    shadowRadius: 10,
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

  headerIcon: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: "rgba(255,255,255,0.16)",

    justifyContent: "center",
    alignItems: "center",
  },

  headerText: {
    marginLeft: 12,
    flex: 1,
  },

  headerSmallTitle: {
    fontSize: 10,
    fontWeight: "700",

    color: "rgba(255,255,255,0.65)",

    textTransform: "uppercase",

    letterSpacing: 1,
  },

  headerTitle: {
    color: "#FFFFFF",

    fontSize: 22,

    fontWeight: "800",

    marginTop: 2,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.72)",

    fontSize: 11,

    marginTop: 3,
  },

  headerAction: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor: "rgba(255,255,255,0.15)",

    justifyContent: "center",
    alignItems: "center",
  },

  // =====================================================
  // SEARCH
  // =====================================================

  searchContainer: {
    height: 52,

    flexDirection: "row",

    alignItems: "center",

    marginHorizontal: 16,

    marginTop: 14,

    marginBottom: 8,

    paddingHorizontal: 14,

    backgroundColor: "#FFFFFF",

    borderRadius: 15,

    borderWidth: 1,

    borderColor: "#E5E7EB",

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,

    shadowRadius: 5,
  },

  searchIcon: {
    marginRight: 9,
  },

  searchInput: {
    flex: 1,

    height: 50,

    paddingVertical: 0,

    fontSize: 14,

    color: COLORS.text,
  },

  searchPlaceholder: {
    color: COLORS.textMuted,
  },

  clearSearch: {
    width: 28,
    height: 28,

    borderRadius: 9,

    backgroundColor: "#F1F5F9",

    justifyContent: "center",
    alignItems: "center",
  },

  // =====================================================
  // SUMMARY
  // =====================================================

  summaryRow: {
    flexDirection: "row",

    paddingHorizontal: 12,

    marginTop: 6,

    marginBottom: 10,
  },

  summaryCard: {
    flex: 1,

    minHeight: 86,

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    marginHorizontal: 4,

    padding: 12,

    borderWidth: 1,

    borderColor: "#E8EAF0",

    elevation: 2,
  },

  summaryTop: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  summaryIcon: {
    width: 30,
    height: 30,

    borderRadius: 9,

    justifyContent: "center",
    alignItems: "center",
  },

  summaryLabel: {
    fontSize: 9,

    color: COLORS.textMuted,

    fontWeight: "700",

    textTransform: "uppercase",

    marginTop: 8,

    letterSpacing: 0.4,
  },

  summaryValue: {
    fontSize: 16,

    color: COLORS.text,

    fontWeight: "800",

    marginTop: 2,
  },

  // =====================================================
  // LIST
  // =====================================================

  listContent: {
    paddingHorizontal: 16,

    paddingTop: 5,

    paddingBottom: 110,
  },

  sectionHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 10,

    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 16,

    fontWeight: "800",

    color: COLORS.text,
  },

  sectionCount: {
    minWidth: 30,

    height: 26,

    paddingHorizontal: 9,

    borderRadius: 9,

    backgroundColor: COLORS.primarySoft,

    justifyContent: "center",

    alignItems: "center",

    color: COLORS.primary,

    fontSize: 11,

    fontWeight: "800",
  },

  // =====================================================
  // LEDGER CARD
  // =====================================================

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 17,

    padding: 15,

    marginBottom: 11,

    borderWidth: 1,

    borderColor: "#E7EAF0",

    elevation: 2,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,

    shadowRadius: 6,
  },

  cardHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  cardHeaderLeft: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },

  ledgerIcon: {
    width: 45,
    height: 45,

    borderRadius: 14,

    backgroundColor: COLORS.primarySoft,

    justifyContent: "center",
    alignItems: "center",
  },

  ledgerInfo: {
    flex: 1,

    marginLeft: 11,
  },

  name: {
    fontSize: 15,

    fontWeight: "800",

    color: COLORS.text,
  },

  code: {
    fontSize: 10,

    fontWeight: "600",

    color: COLORS.textMuted,

    marginTop: 3,
  },

  // =====================================================
  // TYPE
  // =====================================================

  typeBadge: {
    paddingHorizontal: 9,

    paddingVertical: 5,

    borderRadius: 8,

    backgroundColor: COLORS.purpleSoft,
  },

  typeText: {
    fontSize: 9,

    fontWeight: "800",

    color: COLORS.purple,

    textTransform: "uppercase",
  },

  // =====================================================
  // INFORMATION
  // =====================================================

  infoRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 12,
  },

  infoIcon: {
    width: 25,
    height: 25,

    borderRadius: 8,

    backgroundColor: "#F8FAFC",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 8,
  },

  infoText: {
    flex: 1,

    fontSize: 12,

    color: COLORS.textSecondary,

    fontWeight: "500",
  },

  groupContainer: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 12,

    paddingTop: 11,

    borderTopWidth: 1,

    borderTopColor: "#F1F5F9",
  },

  groupIcon: {
    marginRight: 7,
  },

  group: {
    flex: 1,

    fontSize: 12,

    color: COLORS.textSecondary,

    fontWeight: "600",
  },

  placeContainer: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 8,
  },

  placeIcon: {
    marginRight: 7,
  },

  place: {
    flex: 1,

    fontSize: 12,

    color: COLORS.textSecondary,
  },

  mobileContainer: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 8,
  },

  mobileText: {
    marginLeft: 7,

    fontSize: 12,

    color: COLORS.textSecondary,

    fontWeight: "600",
  },

  // =====================================================
  // AMOUNT AREA
  // =====================================================

  amountRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 14,

    paddingTop: 13,

    borderTopWidth: 1,

    borderTopColor: "#F1F5F9",
  },

  amountItem: {
    flex: 1,
  },

  label: {
    fontSize: 9,

    color: COLORS.textMuted,

    fontWeight: "700",

    textTransform: "uppercase",

    letterSpacing: 0.4,
  },

  amountValue: {
    fontSize: 15,

    fontWeight: "800",

    color: COLORS.text,

    marginTop: 4,
  },

  debit: {
    color: COLORS.green,

    fontWeight: "800",
  },

  credit: {
    color: COLORS.red,

    fontWeight: "800",
  },

  // =====================================================
  // BALANCE
  // =====================================================

  balanceContainer: {
    alignItems: "flex-end",
  },

  balanceBadge: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 9,

    paddingVertical: 6,

    borderRadius: 9,

    backgroundColor: COLORS.greenSoft,
  },

  balanceBadgeCredit: {
    backgroundColor: COLORS.redSoft,
  },

  balanceText: {
    fontSize: 10,

    fontWeight: "800",

    color: COLORS.green,
  },

  balanceTextCredit: {
    color: COLORS.red,
  },

  // =====================================================
  // ACTIONS
  // =====================================================

  actions: {
    flexDirection: "row",

    justifyContent: "flex-end",

    alignItems: "center",

    marginTop: 13,

    paddingTop: 11,

    borderTopWidth: 1,

    borderTopColor: "#F1F5F9",
  },

  iconBtn: {
    width: 38,

    height: 38,

    borderRadius: 11,

    justifyContent: "center",

    alignItems: "center",

    marginLeft: 8,

    borderWidth: 1,
  },

  viewBtn: {
    backgroundColor: COLORS.blueSoft,

    borderColor: "#BAE6FD",
  },

  editBtn: {
    backgroundColor: COLORS.primarySoft,

    borderColor: "#C7D2FE",
  },

  deleteBtn: {
    backgroundColor: COLORS.redSoft,

    borderColor: "#FECACA",
  },

  // =====================================================
  // EMPTY STATE
  // =====================================================

  emptyContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 35,

    paddingTop: 70,
  },

  emptyIcon: {
    width: 76,

    height: 76,

    borderRadius: 24,

    backgroundColor: COLORS.primarySoft,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 17,

    fontWeight: "800",

    color: COLORS.text,

    textAlign: "center",
  },

  emptyText: {
    marginTop: 7,

    fontSize: 13,

    lineHeight: 19,

    color: COLORS.textMuted,

    textAlign: "center",
  },

  // =====================================================
  // FAB
  // =====================================================

  fab: {
    position: "absolute",

    right: 20,

    bottom: 22,

    width: 58,

    height: 58,

    borderRadius: 18,

    backgroundColor: COLORS.primary,

    justifyContent: "center",

    alignItems: "center",

    elevation: 9,

    shadowColor: COLORS.primary,

    shadowOffset: {
      width: 0,

      height: 5,
    },

    shadowOpacity: 0.3,

    shadowRadius: 9,
  },

  fabLabel: {
    position: "absolute",

    right: 68,

    backgroundColor: COLORS.text,

    paddingHorizontal: 11,

    paddingVertical: 7,

    borderRadius: 9,

    color: "#FFFFFF",

    fontSize: 11,

    fontWeight: "700",
  },

});