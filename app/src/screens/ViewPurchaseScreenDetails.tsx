import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import {
  Card,
} from 'react-native-paper';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  getPurchaseById,
  getPurchaseItems,
} from '../database/sqlite';

import styles from '../style/ViewPurchaseScreenStyle';

export default function ViewPurchaseScreen() {

  const router =
    useRouter();

  const { id } =
    useLocalSearchParams();

  const [purchase,
    setPurchase] =
    useState(null);

  const [items,
    setItems] =
    useState([]);

  // ======================
  // LOAD DATA
  // ======================

useEffect(() => {

  const loadData = async () => {

    try {

      console.log(
        "📦 VIEW PURCHASE ID:",
        id
      );

      const p =
        await getPurchaseById(id);

      console.log(
        "📦 PURCHASE:",
        p
      );

      let itemData = [];

      if (p) {

        console.log(
          "📦 PURCHASE NO:",
          p.purchaseNo
        );

        itemData =
          await getPurchaseItems(
            p.purchaseNo
          );

      }

      console.log(
        "📦 PURCHASE ITEMS:",
        JSON.stringify(
          itemData,
          null,
          2
        )
      );

      setPurchase(
        p || null
      );

      setItems(
        Array.isArray(itemData)
          ? itemData
          : []
      );

    } catch (e) {

      console.log(
        "❌ view purchase error:",
        e
      );

    }

  };

  if (id) {

    loadData();

  }

}, [id]);

  // ======================
  // TOTAL
  // ======================

  const total =
    items.reduce(
      (sum, item) => {

        return (
          sum +
          (
            Number(item.qty) || 0
          ) *
          (
            Number(item.rate) || 0
          )
        );

      },

      0
    );

return (
  <View
    style={{
      flex: 1,
      backgroundColor: '#F8FAFC',
    }}
  >
    <StatusBar
      backgroundColor="#4F46E5"
      barStyle="light-content"
    />

    {/* HEADER */}

    <LinearGradient
      colors={['#4F46E5', '#6366F1']}
      style={{
        paddingTop: 55,
        paddingBottom: 25,
        paddingHorizontal: 18,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text
          style={{
            color: '#FFF',
            fontSize: 22,
            fontWeight: '800',
          }}
        >
          Purchase Details
        </Text>

        <MaterialCommunityIcons
          name="receipt-text-outline"
          size={24}
          color="#FFF"
        />
      </View>

      <Text
        style={{
          color: 'rgba(255,255,255,0.8)',
          marginTop: 8,
        }}
      >
        Purchase #{purchase?.id || '-'}
      </Text>
    </LinearGradient>

    <ScrollView
      contentContainerStyle={{
        padding: 15,
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    >

      {/* SUPPLIER CARD */}

      <Card
        style={{
          borderRadius: 20,
          padding: 18,
          marginTop: -20,
          backgroundColor: '#FFF',
          elevation: 4,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#EEF2FF',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="truck-delivery"
              size={28}
              color="#4F46E5"
            />
          </View>

          <View
            style={{
              marginLeft: 14,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
              }}
            >
              {purchase?.supplier || '-'}
            </Text>

            <Text
              style={{
                color: '#6B7280',
                marginTop: 4,
              }}
            >
              {purchase?.purchaseMobileNo || '-'}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 15,
          }}
        >
          <Text>
            GST : {purchase?.gstNo || '-'}
          </Text>

          <Text
            style={{
              marginTop: 5,
            }}
          >
            Payment : {purchase?.paidType || '-'}
          </Text>

          <Text
            style={{
              marginTop: 5,
            }}
          >
            Date :
            {' '}
            {purchase?.createdAt
              ? new Date(
                  purchase.createdAt
                ).toLocaleDateString(
                  'en-GB'
                )
              : '-'}
          </Text>
        </View>
      </Card>

      {/* PRODUCTS */}

      <View
        style={{
          marginTop: 15,
        }}
      >
        {items.map(
          (item, index) => {

            const amount =
              (Number(item.qty) || 0) *
              (Number(item.rate) || 0);

            return (
              <Card
                key={
                  item.id ||
                  index
                }
                style={{
                  borderRadius: 18,
                  padding: 14,
                  marginBottom: 12,
                  backgroundColor: '#FFF',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection:
                        'row',
                      alignItems:
                        'center',
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor:
                          '#EEF2FF',
                        justifyContent:
                          'center',
                        alignItems:
                          'center',
                      }}
                    >
                      <MaterialCommunityIcons
                        name="package-variant"
                        size={22}
                        color="#4F46E5"
                      />
                    </View>

                    <View
                      style={{
                        marginLeft: 12,
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '700',
                        }}
                      >
                        {item.product}
                      </Text>

                      <Text
                        style={{
                          color: '#6B7280',
                          marginTop: 2,
                        }}
                      >
                        Qty {item.qty} × ₹{item.rate}
                      </Text>

                      <Text
                        style={{
                          color: '#9CA3AF',
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        Batch: {item.batch || '-'}
                      </Text>

                       <Text
                        style={{
                          color: '#9CA3AF',
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        Stock: {item.stockquantity || '-'}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      color: '#16A34A',
                      fontWeight: '800',
                      fontSize: 18,
                    }}
                  >
                    ₹{amount}
                  </Text>
                </View>
              </Card>
            );
          }
        )}
      </View>

      {/* GRAND TOTAL */}

      <LinearGradient
        colors={[
          '#16A34A',
          '#22C55E',
        ]}
        style={{
          borderRadius: 20,
          padding: 20,
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: '#DCFCE7',
            fontSize: 12,
            fontWeight: '700',
          }}
        >
          GRAND TOTAL
        </Text>

        <Text
          style={{
            color: '#FFF',
            fontSize: 32,
            fontWeight: '900',
            marginTop: 4,
          }}
        >
          ₹{total}
        </Text>
      </LinearGradient>

    </ScrollView>
  </View>
);
}