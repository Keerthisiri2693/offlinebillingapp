 import { StyleSheet } from "react-native";

 
export default StyleSheet.create({
  
    header: {
      paddingHorizontal: 15,
      paddingBottom: 10,
      paddingTop: 5,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },

    headerRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      paddingTop: 30,
    },

    title: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },

    container: {
      padding: 15,
      backgroundColor:
        '#f4f6f8',
      paddingBottom: 80,
    },

    input: {
      marginBottom: 14,
      backgroundColor:
        '#fff',
    },

    section: {
      fontSize: 15,
      fontWeight: '600',
      marginTop: 15,
      marginBottom: 8,
      color: '#333',
    },

    card: {
      borderRadius: 16,
      backgroundColor:
        '#fff',
      elevation: 4,
      paddingVertical: 10,
      marginBottom: 20,
    },

    btnRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      marginBottom: 30,
    },

    saveBtn: {
      flex: 1,
      marginRight: 10,
      backgroundColor:
        '#2c5364',
    },

    cancelBtn: {
      flex: 1,
    },
  });