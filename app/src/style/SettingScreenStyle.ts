import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FC",
  },

  // =========================
  // HEADER
  // =========================

  header: {
    paddingTop: 65,
    paddingBottom: 32,
    paddingHorizontal: 22,

    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,

    backgroundColor: "#4F46E5",

    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 10,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
    fontSize: 14,
  },

  // =========================
  // BODY
  // =========================

  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },

  // =========================
  // USER PROFILE CARD
  // =========================

  shopCard: {
  backgroundColor: "#fff",

  borderRadius: 26,

  paddingHorizontal: 16,
  paddingVertical: 16,

  marginBottom: 22,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.06,
  shadowRadius: 8,

  elevation: 4,
},

shopImage: {
  width: 82,
  height: 82,

  borderRadius: 20,

  flexShrink: 0,
},

shopPlaceholder: {
  width: 82,
  height: 82,

  borderRadius: 20,

  backgroundColor: "#EEF2FF",

  justifyContent: "center",
  alignItems: "center",

  flexShrink: 0,
},

shopDetails: {
  flex: 1,
  minWidth: 0,
  marginLeft: 14,

  justifyContent: "center",
},

shopName: {
  fontSize: 18,
  fontWeight: "800",
  color: "#111827",

  marginBottom: 4,

  flexShrink: 1,
},

shopInfo: {
  color: "#6B7280",

  fontSize: 13,
  lineHeight: 18,

  marginBottom: 0,

  flexShrink: 1,
},

  card: {
    backgroundColor: "#fff",
    borderRadius: 30,

    paddingVertical: 28,
    paddingHorizontal: 20,

    alignItems: "center",

    marginBottom: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 5,
  },

  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  profilePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,

    backgroundColor: "#EEF2FF",

    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 14,
    color: "#111827",
  },

  email: {
    color: "#6B7280",
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
  },

  

  // =========================
  // SETTINGS CARD
  // =========================

 settingsCard: {
  backgroundColor: "#FFFFFF",

  borderRadius: 24,

  paddingVertical: 6,
  paddingHorizontal: 0,

  marginTop: 4,

  borderWidth: 1,
  borderColor: "#EEF2F7",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.06,
  shadowRadius: 10,

  elevation: 4,
},

  // =========================
  // SETTINGS ITEM
  // =========================

  settingItem: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  leftSection: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,

    minWidth: 0,
  },

  iconBox: {
    width: 46,
    height: 46,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,

    flexShrink: 0,
  },

  settingText: {
    fontSize: 16,

    fontWeight: "700",

    color: "#1F2937",

    letterSpacing: 0.3,

    flexShrink: 1,
  },

  divider: {
    height: 1,

    backgroundColor: "rgba(0,0,0,0.05)",

    marginLeft: 78,
  },

  // =========================
  // ICON COLORS
  // =========================

  iconBlue: {
    backgroundColor: "#E8F0FE",
  },

  iconPurple: {
    backgroundColor: "#F3E8FF",
  },

  iconGreen: {
    backgroundColor: "#DCFCE7",
  },

  iconRed: {
    backgroundColor: "#FFE4E6",
  },

  iconOrange: {
    backgroundColor: "#FEF3C7",
  },

  // =========================
  // LOGOUT
  // =========================

  logout: {
    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    borderRadius: 22,

    marginTop: 30,

    overflow: "hidden",

    shadowColor: "#EF4444",

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.25,

    shadowRadius: 10,

    elevation: 8,
  },

  logoutText: {
    color: "#fff",

    marginLeft: 10,

    fontWeight: "800",

    fontSize: 16,

    letterSpacing: 0.4,
  },
});