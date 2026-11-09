import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#eef2f7",
  },

  scrollContent: {
    paddingBottom: 120,
  },

  // LOADER

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef2f7",
  },

  // HEADER



  header: {
  height: 220,
  paddingTop: 60,

  paddingHorizontal: 20,

  backgroundColor: "#4F46E5",

  borderBottomLeftRadius: 40,
  borderBottomRightRadius: 40,

  shadowColor: "#4F46E5",
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 12,
},

backButton: {
  width: 46,
  height: 46,

  borderRadius: 14,

  backgroundColor:
    "rgba(255,255,255,0.15)",

  justifyContent: "center",
  alignItems: "center",

  marginRight: 14,
},

headerTitle: {
  color: "#fff",
  fontSize: 26,
  fontWeight: "900",
  letterSpacing: 0.5,
},

headerSubtitle: {
  color: "rgba(255,255,255,0.85)",
  marginTop: 4,
  fontSize: 13,
  fontWeight: "500",
},

profileContainer: {
  marginTop: -75,
  alignItems: "center",
  zIndex: 10,
},

image: {
  width: 170,
  height: 170,

  borderRadius: 32,

  borderWidth: 6,
  borderColor: "#fff",

  backgroundColor: "#fff",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.18,
  shadowRadius: 12,
  elevation: 15,
},

placeholder: {
  width: 170,
  height: 170,

  borderRadius: 32,

  backgroundColor: "#fff",

  justifyContent: "center",
  alignItems: "center",

  borderWidth: 6,
  borderColor: "#fff",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.18,
  shadowRadius: 12,
  elevation: 15,
},


modernCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 24,
  padding: 18,
  marginBottom: 18,
  elevation: 4,
},

iconContainer: {
  width: 44,
  height: 44,
  borderRadius: 14,
  backgroundColor: "#F8FAFC",
  justifyContent: "center",
  alignItems: "center",
},

sectionTitle: {
  fontSize: 18,
  fontWeight: "800",
  color: "#0F172A",
},

sectionSubTitle: {
  fontSize: 12,
  color: "#64748B",
  marginTop: 2,
},

modernInput: {
  backgroundColor: "#FFF",
  marginBottom: 14,
},

row: {
  flexDirection: "row",
  gap: 10,
},

halfInput: {
  flex: 1,
  backgroundColor: "#FFF",
},

card: {
  backgroundColor: "#FFFFFF",

  marginHorizontal: 18,
  marginTop: 24,

  borderRadius: 26,

  padding: 20,

  borderWidth: 1,
  borderColor: "#EEF2F7",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 5,
},

iconBox: {
  width: 56,
  height: 56,

  borderRadius: 18,

  backgroundColor: "#EEF2FF",

  justifyContent: "center",
  alignItems: "center",

  marginRight: 15,
},

detailTitle: {
  fontSize: 11,
  color: "#64748B",
  marginBottom: 4,
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: 0.8,
},

detailValue: {
  fontSize: 16,
  color: "#0F172A",
  fontWeight: "800",
},

button: {
  marginHorizontal: 18,
  marginTop: 28,
  marginBottom: 20,

  backgroundColor: "#4F46E5",

  borderRadius: 22,

  paddingVertical: 18,

  flexDirection: "row",

  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#4F46E5",
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.3,
  shadowRadius: 12,
  elevation: 10,
},

buttonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "900",
  marginLeft: 10,
  letterSpacing: 0.5,
},

 

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",

    width: "100%",
  },

  // BACK BUTTON


  // TITLE + SUBTITLE CONTAINER

  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },




  detailItem: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 15,

    borderBottomWidth: 1,

    borderBottomColor: "#f1f5f9",
  },

  



});

export default styles;