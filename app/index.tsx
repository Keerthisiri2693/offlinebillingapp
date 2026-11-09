import {
  View,
  ActivityIndicator,
} from 'react-native';

import {
  useEffect,
  useState,
} from 'react';

import {
  router,
} from 'expo-router';

import * as Application
from 'expo-application';

import {
  getLoggedInUser,
} from '../app/src/database/sqlite';

export default function Index() {

  const [ready,
    setReady] =
    useState(false);

  // =========================
  // WAIT ROUTER MOUNT
  // =========================

  useEffect(() => {

    const timer =
      setTimeout(() => {

      setReady(true);

    }, 500);

    return () =>
      clearTimeout(timer);

  }, []);

  // =========================
  // CHECK LOGIN
  // =========================

  useEffect(() => {

    if (!ready) return;

    checkLogin();

  }, [ready]);

  // =========================
  // LOGIN CHECK
  // =========================

  const checkLogin =
  async () => {

  try {

    // DEVICE ID

    const deviceId =

      Application.getAndroidId()

      || 'unknown-device';

    // GET SQLITE USER

    const user =

      await getLoggedInUser();

    console.log(
      '👤 SQLITE USER:',
      user
    );

    // =========================
    // VALID LOGIN
    // =========================

    if (

      user?.isLoggedIn === 1 &&

      user?.deviceId === deviceId

    ) {

      console.log(
        '✅ AUTO LOGIN'
      );

      router.replace(
        '/src/screens/DashboardScreen'
      );

    } else {

      console.log(
        '🚪 GO LOGIN'
      );

      router.replace(
        '/src/screens/LoginScreen'
      );

    }

  } catch (error) {

    console.log(
      '❌ Splash error:',
      error
    );

    router.replace(
      '/src/screens/LoginScreen'
    );

  }

  };


  

  // =========================
  // UI
  // =========================

  return (

    <View
      style={{
        flex: 1,

        justifyContent:
          'center',

        alignItems:
          'center',

        backgroundColor:
          '#fff',
      }}>

      <ActivityIndicator
        size="large"
        color="#2c5364"
      />

    </View>

  );

}