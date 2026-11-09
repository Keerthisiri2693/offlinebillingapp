import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f7f8fa',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    color: '#64748b',
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 15,
  },

  btn: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  linkText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },

  secondaryText: {
    textAlign: 'center',
    marginTop: 12,
    color: '#6b7280',
    fontSize: 13,
  },

  note: {
    textAlign: 'center',
    marginTop: 20,
    color: '#9ca3af',
    fontSize: 12,
  },
});

export default styles;