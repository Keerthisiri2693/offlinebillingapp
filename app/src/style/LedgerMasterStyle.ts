import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({

  /* ================= CONTAINER ================= */

  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  scroll: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 170,
  },

  /* ================= HEADER ================= */

  header: {
    paddingTop: 18,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#0A84FF',
  },

  headerRow: {
    marginTop: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  headerSubTitle: {
    color: '#dbeafe',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },

  /* ================= CARD ================= */

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginTop: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },

  /* ================= INPUT ================= */

  inputWrapper: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    color: '#374151',
    marginLeft: 4,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    fontSize: 15,
  },

  outlinedInput: {
    backgroundColor: '#fff',
  },

  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  /* ================= SECTION ================= */

  section: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 14,
    color: '#111827',
    letterSpacing: 0.4,
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 20,
    backgroundColor: '#0A84FF',
    marginRight: 8,
  },

  /* ================= ROW ================= */

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfInput: {
    width: '48%',
  },

  thirdInput: {
    width: '31%',
  },

  /* ================= BUTTON ================= */

  button: {
    marginTop: 30,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 35,
    backgroundColor: '#0A84FF',

    shadowColor: '#0A84FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonContent: {
    height: 58,
  },

  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: '#fff',
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: '#0A84FF',
    backgroundColor: '#fff',
  },

  secondaryButtonLabel: {
    color: '#0A84FF',
  },

  /* ================= ADD MORE ================= */

  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#eef4ff',
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },

  addMoreText: {
    marginLeft: 8,
    color: '#0A84FF',
    fontWeight: '700',
    fontSize: 15,
  },

  /* ================= CHIPS ================= */

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },

  chip: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 30,
    backgroundColor: '#eff6ff',
    marginRight: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },

  activeChip: {
    backgroundColor: '#0A84FF',
    borderColor: '#0A84FF',
  },

  chipText: {
    color: '#0A84FF',
    fontWeight: '700',
    fontSize: 13,
  },

  activeChipText: {
    color: '#fff',
  },

  /* ================= IMAGE PICKER ================= */

  imagePicker: {
    width: width - 70,
    height: 190,
    borderRadius: 22,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 12,

    overflow: 'hidden',
  },

  imageText: {
    marginTop: 12,
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14,
  },

  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },

  uploadIconBox: {
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: '#eff6ff',

    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ================= DIVIDER ================= */

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 18,
  },

  /* ================= SMALL CARD ================= */

  smallCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 15,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  /* ================= INFO BOX ================= */

  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0A84FF',
  },

  infoText: {
    color: '#1e3a8a',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },

  /* ================= EMPTY ================= */

  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 20,
    fontWeight: '600',
  },

});