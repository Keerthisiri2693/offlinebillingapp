import React, {
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';

import {
  TextInput,
} from 'react-native-paper';

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  useNavigation,
} from '@react-navigation/native';

import {
  router,
} from 'expo-router';

import {
  getLedgers,
  deleteLedger,
} from '../database/sqlite';

const CreateLedger = () => {

  const navigation: any =
    useNavigation();

  const [search,
    setSearch] =
    useState('');

  const [data,
    setData] =
    useState<any[]>([]);

  // =========================
  // LOAD LEDGERS
  // =========================

  useEffect(() => {

    loadLedgers();

  }, []);

  const loadLedgers =
    async () => {

    try {

      const result =
        await getLedgers();

      setData(
        Array.isArray(result)
          ? result
          : []
      );

      console.log(
        '📦 LEDGERS:',
        result
      );

    } catch (e) {

      console.log(
        '❌ loadLedgers:',
        e
      );

    }

  };

  // =========================
  // SEARCH FILTER
  // =========================

 const filteredData =

  data.filter(item =>

    (item?.nameEnglish || '')
      .toLowerCase()
      .startsWith(
        search.toLowerCase()
      )
  );


  const groupedData =

  filteredData.reduce(
    (acc, item) => {

      const firstLetter =

        (item?.nameEnglish?.charAt(0) || '#')
          .toUpperCase();

      if (!acc[firstLetter]) {

        acc[firstLetter] = [];
      }

      acc[firstLetter].push(item);

      return acc;

    },
    {}
  );


  // =========================
  // CARD UI
  // =========================

  const renderItem = ({
    item,
  }: any) => (

    <TouchableOpacity

      activeOpacity={0.92}

      style={{

        backgroundColor:
          '#fff',

        borderRadius: 22,

        padding: 18,

        marginBottom: 16,

        elevation: 4,

        shadowColor: '#000',

        shadowOffset: {
          width: 0,
          height: 2,
        },

        shadowOpacity: 0.08,

        shadowRadius: 6,
      }}
    >

      {/* TOP */}

      <View
        style={{

          flexDirection: 'row',

          justifyContent:
            'space-between',

          alignItems: 'center',
        }}
      >

        <View
          style={{
            flex: 1,
          }}
        >

          <Text
            style={{

              fontSize: 18,

              fontWeight: '700',

              color: '#111',
            }}
          >

            {
              item?.nameEnglish
            }

          </Text>

          <Text
            style={{

              marginTop: 4,

              color: '#666',

              fontSize: 13,
            }}
          >

            Member ID :
            {' '}
            {
              item?.memberId
            }

          </Text>

        </View>

        {/* ACCOUNT TYPE */}

        <View
          style={{

            backgroundColor:

              item?.accountType ===
              'CREDIT'

                ? '#FFECEC'

                : '#EAF7EE',

            paddingHorizontal: 12,

            paddingVertical: 6,

            borderRadius: 30,
          }}
        >

          <Text
            style={{

              color:

                item?.accountType ===
                'CREDIT'

                  ? '#D92D20'

                  : '#067647',

              fontWeight: '700',

              fontSize: 12,
            }}
          >

            {
              item?.accountType ||
              'DEBIT'
            }

          </Text>

        </View>

      </View>

      {/* GROUP */}

      <View
        style={{

          marginTop: 14,

          flexDirection: 'row',

          alignItems: 'center',
        }}
      >

        <MaterialCommunityIcons
          name="folder-outline"
          size={18}
          color="#666"
        />

        <Text
          style={{

            marginLeft: 8,

            color: '#444',

            fontSize: 14,
          }}
        >

          {
            item?.accountGroup ||
            'No Group'
          }

        </Text>

      </View>

      {/* CITY */}

      <View
        style={{

          marginTop: 10,

          flexDirection: 'row',

          alignItems: 'center',
        }}
      >

        <MaterialCommunityIcons
          name="map-marker-outline"
          size={18}
          color="#666"
        />

        <Text
          style={{

            marginLeft: 8,

            color: '#444',

            fontSize: 14,
          }}
        >

          {
            item?.city ||
            'No City'
          }

        </Text>

      </View>


  <View
        style={{

          marginTop: 10,

          flexDirection: 'row',

          alignItems: 'center',
        }}
      >

        <MaterialCommunityIcons
  name="star-circle-outline"
  size={18}
  color="#666"
/>

        <Text
          style={{

            marginLeft: 8,

            color: '#444',

            fontSize: 14,
          }}
        >

          {
            item?.creditPoints ||
            'No City'
          }

        </Text>

      </View>

      {/* AMOUNT + MOBILE */}

      <View
        style={{

          marginTop: 18,

          flexDirection: 'row',

          justifyContent:
            'space-between',
        }}
      >

        <View>

          <Text
            style={{

              color: '#888',

              fontSize: 12,
            }}
          >

            Amount

          </Text>

          <Text
            style={{

              marginTop: 4,

              fontSize: 18,

              fontWeight: '700',

              color: '#111',
            }}
          >

            ₹
            {
              Number(
                item?.amount || 0
              ).toFixed(2)
            }

          </Text>

        </View>

        <View>

          <Text
            style={{

              color: '#888',

              fontSize: 12,
            }}
          >

            Mobile

          </Text>

          <Text
            style={{

              marginTop: 4,

              fontSize: 15,

              fontWeight: '600',

              color: '#111',
            }}
          >

            {
              item?.mobile ||
              '-'
            }

          </Text>

        </View>

      </View>

      {/* ACTIONS */}

      <View
        style={{

          marginTop: 20,

          flexDirection: 'row',

          justifyContent:
            'flex-end',
        }}
      >

        {/* EDIT */}

        <TouchableOpacity

          style={{

            width: 42,

            height: 42,

            borderRadius: 21,

            backgroundColor:
              '#EEF4FF',

            justifyContent:
              'center',

            alignItems: 'center',

            marginRight: 12,
          }}

          onPress={() =>

            router.push({

              pathname:
                "/src/screens/LedgerMaster",

              params: {

                item:
                  JSON.stringify(
                    item
                  ),
              },
            })
          }
        >

          <MaterialCommunityIcons
            name="pencil-outline"
            size={20}
            color="#0A84FF"
          />

        </TouchableOpacity>

        {/* DELETE */}

   

<TouchableOpacity

  style={{

    width: 42,

    height: 42,

    borderRadius: 21,

    backgroundColor: '#FFECEC',

    justifyContent: 'center',

    alignItems: 'center',
  }}

  onPress={() => {

    Alert.alert(

      "Delete Ledger",

      "Are you sure you want to delete this ledger?",

      [

        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",

          style: "destructive",

          onPress: async () => {

            try {

              console.log(
                "DELETE ID:",
                item?.id
              );

              const deleted =
                await deleteLedger(
                  item?.id
                );

              if (deleted) {

                console.log(
                  "✅ Deleted"
                );

                Alert.alert(
                  "Success",
                  "Ledger deleted successfully"
                );

                await loadLedgers();

              } else {

                console.log(
                  "❌ Delete Failed"
                );

                Alert.alert(
                  "Failed",
                  "Unable to delete ledger"
                );

              }

            } catch (e) {

              console.log(
                "❌ DELETE ERROR:",
                e
              );

              Alert.alert(
                "Error",
                "Something went wrong"
              );

            }

          },

        },

      ]

    );

  }}

>

  <MaterialCommunityIcons
    name="trash-can-outline"
    size={20}
    color="#FF3B30"
  />

</TouchableOpacity>

      </View>

    </TouchableOpacity>
  );

  return (

    <View
      style={{
        flex: 1,
        backgroundColor:
          '#F5F7FA',
      }}
    >

      <StatusBar
        backgroundColor="#203a43"
        barStyle="light-content"
      />

      {/* HEADER */}

      <LinearGradient
 colors={[
    "#4C1D95",
    "#6D28D9",
    "#8B5CF6",
  ]}

        style={{

          paddingTop: 50,

          paddingBottom: 70,

          paddingHorizontal: 20,

          borderBottomLeftRadius: 30,

          borderBottomRightRadius: 30,
        }}
      >

        <View
          style={{

            flexDirection: 'row',

            justifyContent:
              'space-between',

            alignItems: 'center',
          }}
        >

          {/* BACK */}

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >

            <MaterialCommunityIcons
              name="arrow-left"
              size={26}
              color="#fff"
            />

          </TouchableOpacity>

          {/* TITLE */}

          <Text
            style={{

              color: '#fff',

              fontSize: 22,

              fontWeight: '700',
            }}
          >

            Ledger Master

          </Text>

          <View
            style={{
              width: 26,
            }}
          />

        </View>

      </LinearGradient>

      {/* SEARCH */}

      <View
     style={{

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor:
      '#fff',

    marginHorizontal: 16,

    marginTop: -25,
    marginBottom:10,

    borderRadius: 18,

    paddingHorizontal: 14,

    height: 58,

    elevation: 5,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 6,
  }}
>

  {/* SEARCH ICON */}

  <MaterialCommunityIcons
    name="magnify"
    size={24}
    color="#666"
  />

  {/* INPUT */}

  <TextInput

    placeholder="Search Ledger..."

    placeholderTextColor="#999"

    value={search}

    onChangeText={
      setSearch
    }

    mode="flat"

    underlineColor="transparent"

    activeUnderlineColor="transparent"

    style={{

      flex: 1,

      backgroundColor:
        'transparent',

      fontSize: 15,

      marginLeft: 8,
    }}

  />

  {/* CLEAR BUTTON */}

  {
    search?.length > 0 && (

      <TouchableOpacity
        onPress={() =>
          setSearch('')
        }
      >

        <MaterialCommunityIcons
          name="close-circle"
          size={22}
          color="#999"
        />

      </TouchableOpacity>

    )
  }

</View>

      {/* LIST */}

      <FlatList

        data={filteredData}

        keyExtractor={(item) =>
          item?.id?.toString()
        }

        renderItem={renderItem}

        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}

      />

      {/* FAB */}

      <TouchableOpacity

        style={{

          position: 'absolute',

          bottom: 50,

          right: 24,

          width: 62,

          height: 62,

          borderRadius: 31,

          backgroundColor:
            '#6D28D9',

          justifyContent:
            'center',

          alignItems: 'center',

          elevation: 8,
        }}

        onPress={() =>
          router.push(
            "/src/screens/LedgerMaster"
          )
        }
      >

        <MaterialCommunityIcons
          name="plus"
          size={28}
          color="#fff"
        />

      </TouchableOpacity>

    </View>
  );
};

export default CreateLedger;