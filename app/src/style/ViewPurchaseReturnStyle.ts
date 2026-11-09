import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({

  // MAIN
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },

  listContainer: {
    flex: 1,
    padding: 15,
  },

  // HEADER
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  // CARD ITEM
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0,
    shadowRadius: 5,
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
    color: '#333',
  },

  deleteIcon: {
    padding: 5,
  },

  // CUSTOMER
  customerText: {
    marginTop: 6,
    fontSize: 15,
    color: '#444',
  },

  // BOTTOM ROW
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  dateText: {
    fontSize: 13,
    color: '#777',
  },

  amountText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2e7d32',
  },

  // EMPTY STATE
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14,
  },

});