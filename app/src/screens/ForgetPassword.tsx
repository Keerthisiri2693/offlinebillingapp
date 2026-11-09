import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../style/CreateAccountStyle';

type Props = {
  navigation: any;
};

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // 📧 Email validation
  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleReset = async () => {
    if (!email || !newPin || !confirmPin) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Enter valid email');
      return;
    }

    if (newPin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      Alert.alert('Error', 'PIN does not match');
      return;
    }

    const savedEmail = await AsyncStorage.getItem('user_email');

    if (email === savedEmail) {
      await AsyncStorage.setItem('user_pin', newPin);

      Alert.alert('Success', 'PIN reset successfully');
      navigation.replace('Login');
    } else {
      Alert.alert('Error', 'Email not found');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset PIN</Text>
      <Text style={styles.subtitle}>Enter your registered email</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Email ID"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="New PIN"
          secureTextEntry
          keyboardType="number-pad"
          maxLength={4}
          value={newPin}
          onChangeText={setNewPin}
          style={styles.input}
        />

        <TextInput
          placeholder="Confirm PIN"
          secureTextEntry
          keyboardType="number-pad"
          maxLength={4}
          value={confirmPin}
          onChangeText={setConfirmPin}
          style={styles.input}
        />

        <TouchableOpacity style={styles.btn} onPress={handleReset}>
          <Text style={styles.btnText}>Reset PIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}