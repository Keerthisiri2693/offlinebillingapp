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

export default function CreateAccountScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleRegister = async () => {
    if (!username || !pin || !confirmPin) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (pin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Error', 'PIN does not match');
      return;
    }

    // Save to local storage
    await AsyncStorage.setItem('user_name', username);
    await AsyncStorage.setItem('user_pin', pin);

    Alert.alert('Success', 'Account created successfully');

    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Register your shop</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Username / Shop Name"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          placeholder="Create PIN"
          secureTextEntry
          keyboardType="number-pad"
          maxLength={4}
          value={pin}
          onChangeText={setPin}
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

        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}