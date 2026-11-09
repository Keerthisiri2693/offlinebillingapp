import {
  StyleSheet,
} from "react-native";

export const COLORS = {
  primary: "#4C1D95",
  primaryLight: "#6D28D9",
  purple: "#8B5CF6",

  background: "#F4F6F8",
  white: "#FFFFFF",

  textPrimary: "#111827",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  border: "#E5E7EB",

  green: "#16A34A",
  blue: "#2563EB",
  orange: "#EA580C",
  red: "#DC2626",

  lightPurple: "#F3E8FF",
  lightBlue: "#EEF2FF",
  lightGreen: "#DCFCE7",
  lightOrange: "#FFEDD5",
  lightRed: "#FEE2E2",
};

export default StyleSheet.create({

  // =====================================================
  // MAIN CONTAINER
  // =====================================================

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },


  // =====================================================
  // HEADER
  // =====================================================

  header: {
    paddingTop: 58,
    paddingBottom: 22,
    paddingHorizontal: 20,

    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    elevation: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  headerRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  headerLeft: {
    flex: 1,
  },

  headerTitle: {
    color: COLORS.white,

    fontSize: 28,

    fontWeight: "800",

    letterSpacing: 0.3,
  },

  headerSubtitle: {
    color: "#E9D5FF",

    marginTop: 4,

    fontSize: 13,

    fontWeight: "500",
  },


  // =====================================================
  // GRAPH BUTTON
  // =====================================================

  graphButton: {
    width: 52,

    height: 52,

    borderRadius: 17,

    backgroundColor:
      "rgba(255,255,255,0.16)",

    justifyContent: "center",

    alignItems: "center",

    marginLeft: 12,
  },


  // =====================================================
  // FILTER
  // =====================================================

  filterScroll: {
    marginTop: 22,
  },

  filterRow: {
    flexDirection: "row",
  },

  filterBtn: {
    paddingVertical: 10,

    paddingHorizontal: 18,

    borderRadius: 20,

    marginRight: 9,

    backgroundColor:
      "rgba(255,255,255,0.15)",
  },

  activeFilter: {
    backgroundColor:
      COLORS.white,
  },

  filterText: {
    color: COLORS.white,

    fontSize: 13,

    fontWeight: "700",
  },

  activeFilterText: {
    color: COLORS.primary,
  },


  // =====================================================
  // BODY
  // =====================================================

  body: {
    padding: 16,

    paddingBottom: 120,
  },


  // =====================================================
  // SUMMARY CARD
  // =====================================================

  summaryCard: {
    backgroundColor:
      COLORS.white,

    borderRadius: 22,

    padding: 18,

    marginBottom: 16,

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.06,

    shadowRadius: 8,
  },

  summaryLabel: {
    fontSize: 13,

    color:
      COLORS.textSecondary,

    fontWeight: "600",
  },

  summaryAmount: {
    marginTop: 5,

    fontSize: 28,

    fontWeight: "900",

    color:
      COLORS.textPrimary,
  },

  summarySubtext: {
    marginTop: 2,

    fontSize: 12,

    color:
      COLORS.textMuted,
  },


  // =====================================================
  // CARD GRID
  // =====================================================

  cardRow: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent:
      "space-between",
  },

  reportCard: {
    width: "48%",

    backgroundColor:
      COLORS.white,

    borderRadius: 20,

    padding: 17,

    marginBottom: 14,

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.06,

    shadowRadius: 8,
  },


  // =====================================================
  // CARD ICON
  // =====================================================

  iconCircle: {
    width: 44,

    height: 44,

    borderRadius: 14,

    justifyContent:
      "center",

    alignItems:
      "center",
  },

  salesIcon: {
    backgroundColor:
      "#DCFCE7",
  },

  purchaseIcon: {
    backgroundColor:
      "#DBEAFE",
  },

  salesReturnIcon: {
    backgroundColor:
      "#FFEDD5",
  },

  purchaseReturnIcon: {
    backgroundColor:
      "#FEE2E2",
  },


  // =====================================================
  // CARD TEXT
  // =====================================================

  cardTitle: {
    marginTop: 12,

    color:
      COLORS.textSecondary,

    fontSize: 13,

    fontWeight: "600",
  },

  cardValue: {
    marginTop: 4,

    color:
      COLORS.textPrimary,

    fontSize: 19,

    fontWeight: "900",
  },


  // =====================================================
  // PROFIT CARD
  // =====================================================

  profitCard: {
    borderRadius: 22,

    padding: 20,

    marginTop: 2,

    marginBottom: 16,

    elevation: 5,
  },

  profitCardProfit: {
    backgroundColor:
      "#166534",
  },

  profitCardLoss: {
    backgroundColor:
      "#991B1B",
  },

  profitRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  profitIcon: {
    width: 48,

    height: 48,

    borderRadius: 16,

    backgroundColor:
      "rgba(255,255,255,0.15)",

    justifyContent:
      "center",

    alignItems:
      "center",
  },

  profitContent: {
    flex: 1,

    marginLeft: 13,
  },

  profitLabel: {
    color: "#DCFCE7",

    fontSize: 12,

    fontWeight: "700",
  },

  lossLabel: {
    color: "#FECACA",
  },

  profitValue: {
    color:
      COLORS.white,

    fontSize: 26,

    fontWeight: "900",

    marginTop: 2,
  },


  // =====================================================
  // CHART CARD
  // =====================================================

  chartCard: {
    backgroundColor:
      COLORS.white,

    borderRadius: 22,

    padding: 16,

    marginBottom: 16,

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.06,

    shadowRadius: 8,
  },

  chartHeader: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems:
      "center",
  },

  chartHeaderLeft: {
    flex: 1,
  },

  chartTitle: {
    fontSize: 17,

    fontWeight: "800",

    color:
      COLORS.textPrimary,
  },

  chartSubtitle: {
    marginTop: 3,

    color:
      COLORS.textMuted,

    fontSize: 11,
  },

  chartButton: {
    width: 42,

    height: 42,

    borderRadius: 13,

    backgroundColor:
      COLORS.lightPurple,

    justifyContent:
      "center",

    alignItems:
      "center",
  },

  chart: {
    marginTop: 15,

    borderRadius: 18,
  },


  // =====================================================
  // EMPTY CHART
  // =====================================================

  emptyChart: {
    height: 230,

    justifyContent:
      "center",

    alignItems:
      "center",
  },

  emptyChartText: {
    marginTop: 10,

    color:
      COLORS.textSecondary,

    fontSize: 13,
  },


  // =====================================================
  // BUSINESS ACTIVITY
  // =====================================================

  activityCard: {
    marginTop: 0,

    backgroundColor:
      COLORS.lightBlue,

    borderRadius: 20,

    padding: 18,

    marginBottom: 18,
  },

  activityLabel: {
    color: "#475569",

    fontSize: 12,

    fontWeight: "700",

    letterSpacing: 0.4,
  },

  activityValue: {
    color: "#312E81",

    fontSize: 24,

    fontWeight: "900",

    marginTop: 4,
  },


  // =====================================================
  // CUSTOM DATE
  // =====================================================

  customDateRow: {
    flexDirection: "row",

    padding: 16,

    gap: 10,
  },

  dateBox: {
    flex: 1,

    backgroundColor:
      COLORS.white,

    padding: 14,

    borderRadius: 16,

    elevation: 2,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,

    shadowRadius: 5,
  },

  dateLabel: {
    color:
      COLORS.textSecondary,

    fontSize: 12,

    fontWeight: "600",
  },

  dateValue: {
    marginTop: 5,

    fontWeight: "800",

    color:
      COLORS.textPrimary,

    fontSize: 14,
  },


  // =====================================================
  // PDF BUTTON
  // =====================================================

  pdfButton: {
    marginTop: 2,

    backgroundColor:
      COLORS.primary,

    paddingVertical: 17,

    borderRadius: 18,

    flexDirection: "row",

    justifyContent:
      "center",

    alignItems:
      "center",

    elevation: 4,

    shadowColor:
      COLORS.primary,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.25,

    shadowRadius: 8,
  },

  pdfButtonText: {
    marginLeft: 9,

    color:
      COLORS.white,

    fontWeight: "800",

    fontSize: 16,
  },


  // =====================================================
  // LOADING
  // =====================================================

  loadingContainer: {
    flex: 1,

    justifyContent:
      "center",

    alignItems:
      "center",
  },

  loadingText: {
    marginTop: 12,

    color:
      COLORS.textSecondary,

    fontSize: 13,
  },


  // =====================================================
  // EMPTY
  // =====================================================

  emptyText: {
    textAlign: "center",

    marginTop: 30,

    color:
      COLORS.textMuted,

    fontSize: 14,
  },


  // =====================================================
  // FAB
  // =====================================================

  fab: {
    position: "absolute",

    bottom: 24,

    right: 20,

    width: 58,

    height: 58,

    borderRadius: 29,

    justifyContent:
      "center",

    alignItems:
      "center",

    backgroundColor:
      COLORS.primary,

    elevation: 8,

    shadowColor:
      COLORS.primary,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.3,

    shadowRadius: 8,
  },

});