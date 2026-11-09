import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
  },

  version: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  description: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
  },

  item: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 10,
    lineHeight: 22,
  },

  link: {
    fontSize: 15,
    color: "#2563EB",
    marginBottom: 14,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 25,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 15,
  },
});