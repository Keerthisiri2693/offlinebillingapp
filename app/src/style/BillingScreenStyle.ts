import { StyleSheet } from "react-native";

export default StyleSheet.create({

  /* ========================= */
  /* HEADER */
  /* ========================= */

  header: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 14,

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,

    elevation: 8,
  },

  headerRow: {
    height: 60,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  title: {
    color: "#fff",

    fontSize: 22,

    fontWeight: "800",

    letterSpacing: 0.5,
  },

  /* ========================= */
  /* CONTAINER */
  /* ========================= */

  container: {
    padding: 14,
    paddingBottom: 120,
  },

  /* ========================= */
  /* CARD */
  /* ========================= */

  card: {
    backgroundColor: "#fff",

    borderRadius: 22,

    padding: 16,

    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    elevation: 4,
  },

  sectionTitle: {
    fontSize: 17,

    fontWeight: "800",

    color: "#111827",

    marginBottom: 14,
  },

  subTitle: {
    marginTop: 14,
    marginBottom: 8,

    fontSize: 13,

    fontWeight: "700",

    color: "#64748B",

    letterSpacing: 0.3,
  },

  /* ========================= */
  /* ROW */
  /* ========================= */

  row: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
  },

  /* ========================= */
  /* INPUT */
  /* ========================= */

  input: {
    flex: 1,

    backgroundColor: "#fff",

    borderRadius: 18,
  },

  halfInput: {
    flex: 1,

    backgroundColor: "#fff",

    borderRadius: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gridInput: {
    width: "48%",
    backgroundColor: "#fff",
    marginBottom: 12,
  },

  /* ========================= */
  /* TABLE */
  /* ========================= */

  tableHeader: {
    flexDirection: "row",

    backgroundColor: "#2563EB",

    paddingVertical: 12,
    paddingHorizontal: 10,

    borderRadius: 14,

    marginBottom: 8,
  },

  th: {
    flex: 1,

    color: "#fff",

    fontWeight: "800",

    fontSize: 12,

    textAlign: "center",
  },

  tableRow: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#fff",

    borderRadius: 14,

    padding: 10,

    marginBottom: 8,

    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  cell: {
    flex: 1,
    marginHorizontal: 4,
  },

  /* ========================= */
  /* PRODUCT CARD */
  /* ========================= */

  productCard: {
    backgroundColor: "#fff",

    padding: 14,

    borderRadius: 20,

    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 3,

    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  /* ========================= */
  /* AMOUNT */
  /* ========================= */

  amountRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: 12,

    backgroundColor: "#F8FAFC",

    paddingVertical: 10,
    paddingHorizontal: 14,

    borderRadius: 14,
  },

  amountLabel: {
    fontSize: 14,

    color: "#64748B",

    fontWeight: "600",
  },

  amountValue: {
    fontSize: 20,

    fontWeight: "800",

    color: "#2563EB",
  },

  /* ========================= */
  /* EXPAND */
  /* ========================= */

  expandBtn: {
    marginTop: 12,

    alignSelf: "flex-start",

    backgroundColor: "#EFF6FF",

    paddingVertical: 8,
    paddingHorizontal: 14,

    borderRadius: 14,
  },

  extraSection: {
    marginTop: 14,

    padding: 12,

    backgroundColor: "#F8FAFC",

    borderRadius: 16,

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  /* ========================= */
  /* TOTAL BOX */
  /* ========================= */

  totalBox: {
    marginTop: 12,

    paddingVertical: 14,
    paddingHorizontal: 16,

    backgroundColor: "#F8FAFC",

    borderRadius: 18,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  totalText: {
    fontWeight: "700",

    fontSize: 15,

    color: "#334155",
  },

  totalAmount: {
    fontWeight: "800",

    fontSize: 18,

    color: "#111827",
  },

  /* ========================= */
  /* BUTTONS */
  /* ========================= */

  btnRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 18,
  },

  saveBtn: {
    flex: 1,

    borderRadius: 16,

    backgroundColor: "#2563EB",
  },

  addBtn: {
    alignItems: "center",

    justifyContent: "center",

    marginTop: 14,
  },

  /* ========================= */
  /* ICON BUTTON */
  /* ========================= */

  iconBtn: {
    width: 44,
    height: 44,

    borderRadius: 16,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#EFF6FF",
  },

  /* ========================= */
  /* CHIP */
  /* ========================= */

  chip: {
    backgroundColor: "#EEF2FF",

    paddingVertical: 6,
    paddingHorizontal: 12,

    borderRadius: 30,

    alignSelf: "flex-start",
  },

  chipText: {
    color: "#4F46E5",

    fontWeight: "700",

    fontSize: 12,
  },

});