import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({

  // MAIN CONTAINER
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },

  // HEADER (used partly)
  header: {
    paddingTop: 55,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
  },

  // LIST CONTAINER
  listContainer: {
    flex: 1,
    padding: 14,
  },

  // CARD (fallback if you use styles.card anywhere)
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,

    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  // TOP ROW
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  invoiceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c5364',
  },

  deleteIcon: {
    padding: 4,
  },

  // CUSTOMER
  customerText: {
    marginTop: 6,
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },

  // DATE
  dateText: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },

  // BOTTOM ROW
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },

  // AMOUNT TEXT
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e88e5',
  },

  // EMPTY / LOADING
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
  },

});