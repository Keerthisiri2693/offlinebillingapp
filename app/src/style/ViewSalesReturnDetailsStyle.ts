import { StyleSheet } from "react-native";


const styles = {

  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },

  header: {
    paddingTop: 55,
    paddingBottom: 22,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  content: {
    padding: 15,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    elevation: 3,
    marginBottom: 16,
  },

  billTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  invoiceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1c313a',
  },

  dateText: {
    marginTop: 4,
    color: '#777',
  },

  totalBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },

  totalBadgeText: {
    color: '#fff',
    fontWeight: '700',
  },

  sectionLabel: {
    color: '#999',
    fontSize: 12,
  },

  sectionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 3,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  smallLabel: {
    color: '#999',
    fontSize: 11,
  },

  smallValue: {
    fontWeight: '700',
    marginTop: 3,
  },

  productTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    color: '#1c313a',
  },

  productCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  productTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2c5364',
  },

  productCode: {
    marginTop: 4,
    color: '#777',
  },

  amountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2e7d32',
  },

  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },

  gridBox: {
    width: '48%',
    backgroundColor: '#f7f9fb',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    marginRight: '2%',
  },

  gridLabel: {
    color: '#999',
    fontSize: 11,
  },

  gridValue: {
    fontWeight: '700',
    marginTop: 4,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  summaryLabel: {
    color: '#666',
  },

  summaryValue: {
    fontWeight: '700',
  },

  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 14,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
  },

  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2e7d32',
  },

};

export default styles;