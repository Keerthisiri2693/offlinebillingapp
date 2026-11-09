import {
  StyleSheet,
} from "react-native";


const COLORS = {

  primary: "#4F46E5",

  primaryDark: "#3730A3",

  primaryLight: "#EEF2FF",

  background: "#F8FAFC",

  white: "#FFFFFF",

  text: "#111827",

  textSecondary: "#64748B",

  textMuted: "#94A3B8",

  border: "#E5E7EB",

  success: "#16A34A",

  warning: "#EA580C",

  danger: "#DC2626",

  category: "#6D28D9",

  categoryBg: "#F5F3FF",

  subcategory: "#2563EB",

  subcategoryBg: "#EFF6FF",

};


export { COLORS };


export default StyleSheet.create({

  // =====================================================
  // MAIN
  // =====================================================

  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },


  // =====================================================
  // HEADER
  // =====================================================

  header: {
    paddingTop: 55,
    paddingBottom: 22,
    paddingHorizontal: 18,

    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    elevation: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },


  headerRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },


  headerTitle: {
    color: COLORS.white,

    fontSize: 23,

    fontWeight: "800",

    letterSpacing: 0.2,
  },


  headerSubtitle: {
    color: "#E0E7FF",

    fontSize: 13,

    marginTop: 4,

    fontWeight: "500",
  },


  addButton: {
    width: 46,

    height: 46,

    borderRadius: 15,

    backgroundColor:
      "rgba(255,255,255,0.18)",

    justifyContent: "center",

    alignItems: "center",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.28)",
  },


  // =====================================================
  // SEARCH
  // =====================================================

  searchContainer: {
    marginHorizontal: 14,

    marginTop: 12,

    marginBottom: 4,

    height: 52,

    backgroundColor:
      COLORS.white,

    borderRadius: 16,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 14,

    borderWidth: 1,

    borderColor:
      COLORS.border,

    elevation: 2,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,

    shadowRadius: 4,
  },


  searchInput: {
    flex: 1,

    height: 50,

    paddingHorizontal: 10,

    fontSize: 15,

    color: COLORS.text,
  },


  // =====================================================
  // RESULT COUNT
  // =====================================================

  resultRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    paddingHorizontal: 18,

    paddingTop: 8,

    paddingBottom: 4,
  },


  resultText: {
    fontSize: 13,

    fontWeight: "700",

    color:
      COLORS.textSecondary,
  },


  searchResultText: {
    fontSize: 12,

    color:
      COLORS.primary,

    fontWeight: "600",
  },


  // =====================================================
  // BODY
  // =====================================================

  body: {
    flex: 1,

    paddingHorizontal: 14,

    paddingTop: 8,
  },


  // =====================================================
  // PRODUCT CARD
  // =====================================================

  card: {
    backgroundColor:
      COLORS.white,

    borderRadius: 20,

    padding: 14,

    marginBottom: 12,

    borderWidth: 1,

    borderColor:
      "#EEF0F4",

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.07,

    shadowRadius: 7,
  },


  // =====================================================
  // PRODUCT TOP
  // =====================================================

  productTop: {
    flexDirection: "row",

    alignItems: "flex-start",
  },


  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  productImage: {
    width: 82,

    height: 82,

    borderRadius: 16,

    backgroundColor:
      "#F1F5F9",
  },


  productImagePlaceholder: {
    width: 82,

    height: 82,

    borderRadius: 16,

    backgroundColor:
      "#F1F5F9",

    justifyContent: "center",

    alignItems: "center",

    borderWidth: 1,

    borderColor:
      "#E2E8F0",
  },


  // =====================================================
  // PRODUCT INFORMATION
  // =====================================================

  productInfo: {
    flex: 1,

    marginLeft: 12,

    minWidth: 0,
  },


  titleRow: {
    flexDirection: "row",

    alignItems: "flex-start",

    justifyContent:
      "space-between",
  },


  title: {
    flex: 1,

    fontSize: 16,

    lineHeight: 21,

    fontWeight: "800",

    color:
      COLORS.text,

    paddingRight: 5,
  },


  productCode: {
    marginTop: 5,

    fontSize: 12,

    color:
      COLORS.textMuted,

    fontWeight: "500",
  },


  // =====================================================
  // ACTION BUTTONS
  // =====================================================

  actionRow: {
    flexDirection: "row",

    alignItems: "center",

    marginLeft: 5,
  },


  actionButton: {
    width: 34,

    height: 34,

    borderRadius: 11,

    backgroundColor:
      "#F8FAFC",

    justifyContent: "center",

    alignItems: "center",

    marginLeft: 5,
  },


  // =====================================================
  // CATEGORY
  // =====================================================

  categoryRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 9,

    flexWrap: "wrap",

    gap: 6,
  },


  categoryBadge: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      COLORS.categoryBg,

    paddingHorizontal: 9,

    paddingVertical: 5,

    borderRadius: 9,

    maxWidth: "65%",
  },


  categoryText: {
    marginLeft: 4,

    fontSize: 11,

    color:
      COLORS.category,

    fontWeight: "700",
  },


  subcategoryBadge: {
    backgroundColor:
      COLORS.subcategoryBg,

    paddingHorizontal: 9,

    paddingVertical: 5,

    borderRadius: 9,

    maxWidth: "45%",
  },


  subcategoryText: {
    fontSize: 11,

    color:
      COLORS.subcategory,

    fontWeight: "700",
  },


  // =====================================================
  // DETAILS
  // =====================================================

  detailsRow: {
    flexDirection: "row",

    marginTop: 14,

    paddingTop: 12,

    borderTopWidth: 1,

    borderTopColor:
      "#F1F5F9",
  },


  detailItem: {
    flex: 1,

    paddingHorizontal: 5,
  },


  detailLabel: {
    fontSize: 9,

    color:
      COLORS.textMuted,

    fontWeight: "800",

    letterSpacing: 0.8,

    marginBottom: 4,
  },


  detailValue: {
    fontSize: 13,

    color:
      COLORS.text,

    fontWeight: "700",
  },


  // =====================================================
  // PRICE BOX
  // =====================================================

  priceBox: {
    marginTop: 13,

    paddingHorizontal: 13,

    paddingVertical: 11,

    borderRadius: 14,

    backgroundColor:
      COLORS.primaryLight,

    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",
  },


  priceLabel: {
    fontSize: 9,

    color:
      "#6366F1",

    fontWeight: "800",

    letterSpacing: 0.7,

    marginBottom: 2,
  },


  price: {
    fontSize: 18,

    fontWeight: "900",

    color:
      COLORS.primary,
  },


  // =====================================================
  // MRP
  // =====================================================

  mrpBox: {
    paddingHorizontal: 12,

    borderLeftWidth: 1,

    borderLeftColor:
      "#C7D2FE",

    flex: 1,

    marginLeft: 15,
  },


  mrpLabel: {
    fontSize: 9,

    color:
      COLORS.textMuted,

    fontWeight: "800",

    letterSpacing: 0.7,

    marginBottom: 2,
  },


  mrp: {
    fontSize: 14,

    color:
      COLORS.textSecondary,

    fontWeight: "700",
  },


  arrowButton: {
    width: 32,

    height: 32,

    borderRadius: 10,

    backgroundColor:
      COLORS.white,

    justifyContent: "center",

    alignItems: "center",

    marginLeft: 8,
  },


  // =====================================================
  // LIST
  // =====================================================

  listContent: {
    paddingTop: 4,

    paddingBottom: 110,
  },


  // =====================================================
  // CENTER
  // =====================================================

  center: {
    flex: 1,

    justifyContent:
      "center",

    alignItems:
      "center",
  },


  centerContainer: {
    flex: 1,

    justifyContent:
      "center",

    alignItems:
      "center",

    paddingHorizontal: 30,
  },


  // =====================================================
  // LOADING
  // =====================================================

  loadingCircle: {
    width: 105,

    height: 105,

    borderRadius: 53,

    backgroundColor:
      "#EEF2FF",

    justifyContent:
      "center",

    alignItems:
      "center",
  },


  loadingTitle: {
    marginTop: 18,

    fontSize: 18,

    fontWeight: "800",

    color:
      COLORS.text,
  },


  loadingSubtitle: {
    marginTop: 5,

    fontSize: 13,

    color:
      COLORS.textMuted,
  },


  // =====================================================
  // EMPTY STATE
  // =====================================================

  emptyIcon: {
    width: 125,

    height: 125,

    borderRadius: 63,

    backgroundColor:
      "#F1F5F9",

    justifyContent:
      "center",

    alignItems:
      "center",

    borderWidth: 1,

    borderColor:
      "#E2E8F0",
  },


  emptyTitle: {
    marginTop: 18,

    fontSize: 20,

    fontWeight: "900",

    color:
      "#374151",
  },


  emptySubtitle: {
    marginTop: 7,

    fontSize: 13,

    color:
      COLORS.textMuted,

    textAlign: "center",

    lineHeight: 20,

    paddingHorizontal: 20,
  },


  // =====================================================
  // EMPTY ADD BUTTON
  // =====================================================

  emptyButton: {
    marginTop: 20,

    height: 46,

    paddingHorizontal: 20,

    borderRadius: 14,

    backgroundColor:
      COLORS.primary,

    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "center",

    elevation: 3,
  },


  emptyButtonText: {
    marginLeft: 7,

    color:
      COLORS.white,

    fontSize: 14,

    fontWeight: "800",
  },


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  clearSearchButton: {
    marginTop: 20,

    paddingHorizontal: 20,

    paddingVertical: 11,

    borderRadius: 12,

    backgroundColor:
      COLORS.primaryLight,
  },


  clearSearchText: {
    color:
      COLORS.primary,

    fontSize: 14,

    fontWeight: "800",
  },


});
