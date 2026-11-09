import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  scrollContent: {
    paddingBottom: 120,
  },

  // HEADER

  header: {
    height: 150,
    backgroundColor: "#0f172a",

    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,

    justifyContent: "center",
    alignItems: "center",

    paddingTop: 45,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.15,

    shadowRadius: 12,

    elevation: 12,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  headerSubtitle: {
    color: "#cbd5e1",
    marginTop: 8,
    fontSize: 15,
    fontWeight: "500",
    marginBottom:30,
  },

  // PROFILE

  profileContainer: {
    marginTop: -45,
    alignItems: "center",
    marginBottom: 22,
    
  },

  imageBox: {
    width: 160,
    height: 160,

    borderRadius: 35,

    backgroundColor: "#fff",

    justifyContent: "center",
    alignItems: "center",
    marginTop:20,

    overflow: "hidden",

    borderWidth: 5,
    borderColor: "#fff",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.16,

    shadowRadius: 14,

    elevation: 10,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imageText: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "700",
  },

  // FORM

  formContainer: {
    paddingHorizontal: 18,
    marginTop: 5,
  },

  card: {
    backgroundColor: "#ffffff",

    borderRadius: 28,

    padding: 20,

    marginBottom: 20,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,

    shadowRadius: 10,

    elevation: 5,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 22,
  },

  // INPUTS

  inputWrapper: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "700",
    marginLeft: 2,
  },

  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
    marginBottom:20,
  },

  multilineInput: {
    height: 110,
    textAlignVertical: "top",
  },

  // ROW

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  halfInput: {
    width: "48%",
  },

  // BUTTON

  saveButton: {
    backgroundColor: "#0f172a",

    paddingVertical: 18,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 12,

    shadowColor: "#0f172a",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.28,

    shadowRadius: 10,

    elevation: 8,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

});

export default styles;