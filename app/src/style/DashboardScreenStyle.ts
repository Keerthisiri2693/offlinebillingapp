import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#6366F1",
  primaryDark: "#4C1D95",

  background: "#F8FAFC",

  white: "#FFFFFF",

  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  border: "#E2E8F0",

  success: "#16A34A",
  successLight: "#DCFCE7",

  warning: "#F59E0B",
  warningLight: "#FEF3C7",

  danger: "#EF4444",
  dangerLight: "#FEE2E2",

  info: "#2563EB",
  infoLight: "#DBEAFE",

  cyan: "#0891B2",
  green: "#059669",

  card: "#FFFFFF",
};

// ======================================================
// RADIUS
// ======================================================

const RADIUS = {
  xl: 30,
  lg: 24,
  md: 18,
  sm: 14,
  xs: 10,
};

// ======================================================
// SHADOW
// ======================================================

const SHADOW = {
  shadowColor: "#000",

  shadowOffset: {
    width: 0,
    height: 4,
  },

  shadowOpacity: 0.06,

  shadowRadius: 8,

  elevation: 3,
};

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  // ====================================================
  // MAIN CONTAINER
  // ====================================================

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ====================================================
  // HEADER
  // ====================================================

  header: {
    paddingHorizontal: 16,

    paddingBottom: 18,

    borderBottomLeftRadius: 30,

    borderBottomRightRadius: 30,

    overflow: "hidden",
  },

  headerRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: 8,
  },

  headerLeft: {
    flex: 1,

    paddingRight: 12,
  },

  headerRight: {
    alignItems: "center",

    justifyContent: "center",
  },

  // ====================================================
  // HEADER TEXT
  // ====================================================

  welcome: {
    fontSize: 13,

    color: "#E0E7FF",

    fontWeight: "600",

    marginBottom: 3,
  },

  username: {
    fontSize: 23,

    fontWeight: "900",

    color: COLORS.white,

    marginTop: 2,

    maxWidth: "90%",
  },

  syncStatus: {
    fontSize: 12,

    color: "#E2E8F0",

    marginLeft: 7,

    fontWeight: "600",
  },

  // ====================================================
  // SYNC BADGE
  // ====================================================

  syncBadge: {
    flexDirection: "row",

    alignItems: "center",

    alignSelf: "flex-start",

    marginTop: 9,

    paddingHorizontal: 10,

    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: "rgba(255,255,255,0.12)",
  },

  syncDot: {
    width: 8,

    height: 8,

    borderRadius: 4,
  },

  // ====================================================
  // AVATAR
  // ====================================================

  avatar: {
    backgroundColor: "rgba(255,255,255,0.18)",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.25)",
  },

  // ====================================================
  // SYNC CARD
  // ====================================================

  syncCard: {
    marginTop: 18,

    backgroundColor: "rgba(255,255,255,0.12)",

    borderRadius: 20,

    paddingHorizontal: 14,

    paddingVertical: 13,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.12)",
  },

  syncCardLeft: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },

  syncIcon: {
    width: 42,

    height: 42,

    borderRadius: 14,

    backgroundColor: "rgba(255,255,255,0.15)",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 12,
  },

  syncTitle: {
    color: COLORS.white,

    fontSize: 14,

    fontWeight: "800",
  },

  syncDescription: {
    color: "rgba(255,255,255,0.68)",

    fontSize: 11,

    marginTop: 3,
  },

  // ====================================================
  // DASHBOARD GRID CONTAINER
  // ====================================================

  gridContainer: {
    paddingHorizontal: 16,

    paddingTop: 18,

    paddingBottom: 100,
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  // ====================================================
  // SECTION HEADER
  // ====================================================

  sectionHeader: {
    marginBottom: 14,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  quickHeader: {
    marginTop: 24,

    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,

    fontWeight: "900",

    color: COLORS.textPrimary,
  },

  sectionSubtitle: {
    fontSize: 12,

    color: COLORS.textSecondary,

    marginTop: 4,

    fontWeight: "500",
  },

  // ====================================================
  // TODAY SALES CARD
  // ====================================================

  salesCard: {
    borderRadius: RADIUS.xl,

    padding: 22,

    minHeight: 145,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 14,

    ...SHADOW,

    shadowOpacity: 0.15,

    elevation: 6,
  },

  salesLabel: {
    color: "rgba(255,255,255,0.72)",

    fontSize: 12,

    fontWeight: "800",

    letterSpacing: 1,
  },

  salesAmount: {
    color: COLORS.white,

    fontSize: 32,

    fontWeight: "900",

    marginTop: 8,
  },

  salesHint: {
    color: "rgba(255,255,255,0.72)",

    fontSize: 11,

    marginTop: 5,
  },

  salesIcon: {
    width: 64,

    height: 64,

    borderRadius: 22,

    backgroundColor: "rgba(255,255,255,0.16)",

    justifyContent: "center",

    alignItems: "center",
  },

  // ====================================================
  // STATISTICS ROW
  // ====================================================

  statsRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginBottom: 8,
  },

  statCard: {
    width: "31.5%",

    backgroundColor: COLORS.card,

    borderRadius: RADIUS.lg,

    paddingVertical: 16,

    paddingHorizontal: 10,

    alignItems: "center",

    borderWidth: 1,

    borderColor: "#EEF2F7",

    ...SHADOW,
  },

  statIcon: {
    width: 42,

    height: 42,

    borderRadius: 14,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 9,
  },

  statValue: {
    fontSize: 18,

    fontWeight: "900",

    color: COLORS.textPrimary,
  },

  statLabel: {
    fontSize: 11,

    color: COLORS.textSecondary,

    marginTop: 3,

    fontWeight: "600",
  },

  // ====================================================
  // FEATURE CARD
  // ====================================================

  featureCard: {
    width: "48.2%",

    backgroundColor: COLORS.card,

    borderRadius: RADIUS.lg,

    padding: 16,

    marginBottom: 14,

    minHeight: 150,

    borderWidth: 1,

    borderColor: "#EEF2F7",

    position: "relative",

    ...SHADOW,
  },

  // ====================================================
  // FEATURE ICON
  // ====================================================

  featureIconBox: {
    width: 52,

    height: 52,

    borderRadius: 17,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 13,
  },

  featureIcon: {
    fontSize: 25,
  },

  // ====================================================
  // FEATURE TEXT
  // ====================================================

  featureTitle: {
    fontSize: 15,

    fontWeight: "900",

    color: COLORS.textPrimary,

    paddingRight: 25,
  },

  featureSubtitle: {
    fontSize: 11,

    color: COLORS.textSecondary,

    marginTop: 4,

    paddingRight: 15,
  },

  // ====================================================
  // FEATURE ARROW
  // ====================================================

  featureArrow: {
    position: "absolute",

    right: 13,

    bottom: 13,

    width: 28,

    height: 28,

    borderRadius: 10,

    justifyContent: "center",

    alignItems: "center",
  },

  featureArrowText: {
    color: COLORS.white,

    fontSize: 16,

    fontWeight: "900",

    marginTop: -1,
  },

  // ====================================================
  // FOOTER
  // ====================================================

  footer: {
    alignItems: "center",

    paddingTop: 10,

    paddingBottom: 25,
  },

  footerText: {
    color: COLORS.textSecondary,

    fontSize: 12,

    fontWeight: "800",
  },

  footerSubtext: {
    color: COLORS.textMuted,

    fontSize: 10,

    marginTop: 4,

    textAlign: "center",
  },

  // ====================================================
  // LOADING OVERLAY
  // ====================================================

  loadingOverlay: {
    position: "absolute",

    top: 0,

    left: 0,

    right: 0,

    bottom: 0,

    backgroundColor: "rgba(15,23,42,0.45)",

    justifyContent: "center",

    alignItems: "center",

    zIndex: 100,
  },

  // ====================================================
  // LOADING CARD
  // ====================================================

  loadingCard: {
    width: 180,

    backgroundColor: COLORS.white,

    borderRadius: 24,

    paddingVertical: 24,

    paddingHorizontal: 20,

    alignItems: "center",

    ...SHADOW,

    elevation: 10,
  },

  loadingTitle: {
    marginTop: 14,

    fontSize: 15,

    fontWeight: "900",

    color: COLORS.textPrimary,
  },

  loadingText: {
    marginTop: 4,

    fontSize: 12,

    color: COLORS.textSecondary,
  },

  // ====================================================
  // LEGACY GRID CARD
  // Keep these so old Dashboard code doesn't break
  // ====================================================

  gridCard: {
    width: "48%",

    backgroundColor: COLORS.primary,

    paddingVertical: 22,

    borderRadius: RADIUS.lg,

    marginBottom: 14,

    alignItems: "center",

    ...SHADOW,
  },

  gridIcon: {
    fontSize: 26,

    marginBottom: 8,
  },

  gridText: {
    color: COLORS.white,

    fontSize: 14,

    fontWeight: "600",

    textAlign: "center",
  },

  // ====================================================
  // LOGOUT BUTTON
  // ====================================================

  logoutBtn: {
    position: "absolute",

    bottom: 20,

    left: 16,

    right: 16,

    backgroundColor: COLORS.danger,

    paddingVertical: 14,

    borderRadius: RADIUS.md,

    alignItems: "center",

    shadowColor: COLORS.danger,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,

    shadowRadius: 6,

    elevation: 4,
  },

  logoutText: {
    color: COLORS.white,

    fontSize: 16,

    fontWeight: "700",
  },
});

export default styles;
