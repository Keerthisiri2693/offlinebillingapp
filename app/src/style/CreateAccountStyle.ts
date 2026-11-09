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
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#64748b',
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
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
  },

  btn: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  linkText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '500',
  },

  note: {
    textAlign: 'center',
    marginTop: 20,
    color: '#9ca3af',
    fontSize: 13,
  },
});

export default styles;