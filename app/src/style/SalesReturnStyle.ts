import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({

  // HEADER
  header: {
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerRow: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    width: '70%',
    textAlign: 'center',
  },

  // MAIN CONTAINER
  container: {
    padding: 12,
    paddingBottom: 140, // extra for bottom buttons
  },

  // CARD
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,

    // ✅ FIX SHADOW CROSS PLATFORM
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },

  subTitle: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },

  // ROW
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 5,
  },

  // 👉 spacing fix (instead of gap)
  rowItem: {
    flex: 1,
    marginRight: 10,
  },

  // INPUTS
  input: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 8,
  },

  halfInput: {
    flex: 1,
    backgroundColor: '#fff',
    marginRight: 10,
  },

  // GRID
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gridInput: {
    width: '48%',
    backgroundColor: '#fff',
    marginBottom: 10,
  },

  // PRODUCT CARD
  productCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },

  // AMOUNT ROW
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  amountLabel: {
    fontSize: 14,
    color: '#555',
  },

  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5364',
  },

  // EXPAND BUTTON
  expandBtn: {
    marginTop: 8,
    alignItems: 'flex-end',
  },

  // EXTRA SECTION
  extraSection: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },

  // TOTAL BOX
  totalBox: {
    marginTop: 15,
    padding: 14,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  totalAmount: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#1e88e5',
  },

  // BUTTON ROW
  btnRow: {
    flexDirection: 'row',
    marginTop: 15,
  },

  btnItem: {
    flex: 1,
    marginRight: 10,
  },

  saveBtn: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },

});