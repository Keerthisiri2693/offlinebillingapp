import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f1f5f9"
  },



  header: {
    paddingTop: 15,
    paddingBottom: 28,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },



  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },



  headerTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  },



  headerSubtitle: {
    color: "#dbeafe",
    marginTop: 5,
    fontSize: 14
  },



  addBtn: {
    width: 58,
    height: 58,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5
  },



  searchBox: {
    marginTop: 22,
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 55,
    elevation: 3
  },



  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#0f172a"
  },



  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 14,
    marginTop: -20
  },



  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
    elevation: 4
  },



  summaryTitle: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 13
  },



  summaryValue: {
    marginTop: 5,
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a"
  },



  stockCard: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 22,
    padding: 16,
    elevation: 3
  },



  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },



  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a"
  },



  dateText: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 13
  },



  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },



  infoBox: {
    flex: 1,
    alignItems: "center"
  },



  label: {
    color: "#94a3b8",
    fontSize: 12
  },



  value: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: "bold"
  },



  narrationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    marginTop: 20,
    padding: 12,
    borderRadius: 14
  },



  narrationText: {
    marginLeft: 8,
    flex: 1,
    color: "#334155",
    fontSize: 14
  },



  floatingBtn: {
    position: "absolute",
    right: 20,
    bottom: 25,
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8
  },



  emptyBox: {
    marginTop: 80,
    alignItems: "center"
  },



  emptyText: {
    marginTop: 10,
    color: "#94a3b8",
    fontSize: 16
  }

});