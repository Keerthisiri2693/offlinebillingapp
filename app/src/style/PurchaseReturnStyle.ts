import {
  StyleSheet,
  Platform,
} from "react-native";

export default StyleSheet.create({

  // ================= HEADER =================

  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "900",
    flex: 1,
    marginLeft: 12,
  },

  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 54,
  },

  // ================= SCREEN =================

  container: {
    padding: 14,
    paddingBottom: 140,
    backgroundColor: "#F5F7FB",
  },

  // ================= CARD =================

  card: {
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity:
      Platform.OS === "ios"
        ? 0.08
        : 0,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  // ================= SECTION =================

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 14,
  },

  subTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },

  // ================= ROW =================

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 12,
  },

  // ================= INPUT =================

  input: {
    flex: 1,
    backgroundColor: "#FFF",
    marginRight: 10,
  },

  halfInput: {
    flex: 1,
    backgroundColor: "#FFF",
    marginRight: 10,
  },

  // ================= MODERN INFO CARD =================

  infoCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  infoLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "700",
    marginTop: 4,
  },

  cardInput: {
    backgroundColor: "transparent",
    height: 34,
    marginTop: 2,
  },

  // ================= VALUE CARD =================

  valueCard: {
    width: "48%",
    backgroundColor: "#EEF2FF",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },

  valueTitle: {
    fontSize: 10,
    color: "#4F46E5",
    fontWeight: "700",
  },

  valueText: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },

  // ================= GRID =================

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
  },

  gridInput: {
    width: "48%",
    marginBottom: 10,
  },

  // ================= PRODUCT CARD =================

  productCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity:
      Platform.OS === "ios"
        ? 0.06
        : 0,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  productHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  productTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },

  productSubTitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },

  // ================= AMOUNT =================

  amountRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  amountLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },

  amountValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#10B981",
  },

  // ================= EXPAND =================

  expandBtn: {
    marginTop: 10,
    alignItems: "center",
  },

  extraSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
  },

  // ================= TOTAL BOX =================

  totalBox: {
    marginTop: 16,
    padding: 18,
    backgroundColor: "#EEF2FF",
    borderRadius: 18,

    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  totalText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },

  totalAmount: {
    fontSize: 24,
    fontWeight: "900",
    color: "#4F46E5",
  },

  // ================= BUTTONS =================

  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 40,
  },

  btnItem: {
    flex: 1,
    marginHorizontal: 4,
  },

  saveBtn: {
    borderRadius: 16,
    backgroundColor: "#4F46E5",
  },

  resetBtn: {
    borderRadius: 16,
    borderColor: "#DC2626",
  },

  // ================= ICON BUTTON =================

  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteBtn: {
    backgroundColor: "#FEE2E2",
  },

  addBtn: {
    backgroundColor: "#DCFCE7",
  },

  // ================= BADGE =================

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

});