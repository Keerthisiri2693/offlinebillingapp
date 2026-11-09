import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // HEADER
  header: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
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
  },

  // MAIN CONTAINER
  container: {
    padding: 12,
    paddingBottom: 100,
  },

  // CARD
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },

  section: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },

  // TABLE HEADER
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
    marginBottom: 5,
  },

  th: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },

  // ITEM ROW
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },

  itemText: {
    fontSize: 13,
    color: '#333',
  },

  // BILL ROW
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  // TOTAL BOX
  totalBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  totalAmount: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2c5364',
  },

});