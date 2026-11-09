import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  RefreshControl,
} from "react-native";

import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { getProducts } from "../database/sqlite";


type Product = {
  id: string;
  productcode: string;
  productenglishname: string;
  producttamilName?: string;

  category?: string;
  subcategory?: string;

  productimage?: string;

  purchase?: number;
  wholesale?: number;
  retail?: number;
  mrp?: number;

  stockquantity?: number;
  stockvalue?: number;

  uom?: string;
  unittype?: string;

  barcode?: string;
};


export default function CategoryProductsScreen() {

  const router = useRouter();

  const params =
    useLocalSearchParams<{
      category?: string;
    }>();

  const category =
    String(
      params.category || "Others"
    );


  const [products, setProducts] =
    useState<Product[]>([]);

  const [search, setSearch] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);


  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadProducts = async () => {

    try {

      const result =
        await getProducts();

      console.log(
        "📦 CATEGORY PRODUCTS:",
        category,
        result
      );

      setProducts(
        Array.isArray(result)
          ? result
          : []
      );

    } catch (error) {

      console.log(
        "❌ CATEGORY PRODUCTS ERROR:",
        error
      );

      setProducts([]);

    }
  };


  useFocusEffect(
    useCallback(() => {

      loadProducts();

    }, [])
  );


  // =====================================================
  // FILTER SELECTED CATEGORY
  // =====================================================

  const categoryProducts =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        product => {

          const matchesCategory =
            (
              product.category?.trim() ||
              "Others"
            ) === category;

          const matchesSearch =
            !keyword ||
            product.productenglishname
              ?.toLowerCase()
              .includes(keyword) ||
            product.producttamilName
              ?.toLowerCase()
              .includes(keyword) ||
            product.productcode
              ?.toLowerCase()
              .includes(keyword) ||
            product.barcode
              ?.toLowerCase()
              .includes(keyword);

          return (
            matchesCategory &&
            matchesSearch
          );

        }
      );

    }, [
      products,
      category,
      search,
    ]);


  // =====================================================
  // CATEGORY TOTALS
  // =====================================================

  const totalStock =
    categoryProducts.reduce(
      (sum, item) =>
        sum +
        Number(
          item.stockquantity || 0
        ),
      0
    );

  const totalValue =
    categoryProducts.reduce(
      (sum, item) =>
        sum +
        Number(
          item.stockvalue || 0
        ),
      0
    );


  // =====================================================
  // PRODUCT CARD
  // =====================================================

  const renderProduct = ({
    item,
  }: {
    item: Product;
  }) => {

    const stock =
      Number(
        item.stockquantity || 0
      );

    const retail =
      Number(
        item.retail || 0
      );

    const purchase =
      Number(
        item.purchase || 0
      );

    const profit =
      retail - purchase;


    return (

      <TouchableOpacity
        activeOpacity={0.9}
        style={
          styles.productCard
        }
        onPress={() => {

          // Optional: open your inventory/details
          // screen here after the user selects
          // a product.
          router.push({
            pathname:
              "/src/screens/NewBillingScreen",
            params: {
              id: item.id,
            },
          });

        }}
      >

        {/* IMAGE */}

        <View
          style={
            styles.imageContainer
          }
        >

          {item.productimage ? (

            <Image
              source={{
                uri:
                  item.productimage,
              }}
              style={
                styles.productImage
              }
              resizeMode="cover"
            />

          ) : (

            <View
              style={
                styles.imagePlaceholder
              }
            >

              <MaterialCommunityIcons
                name="package-variant"
                size={32}
                color="#4F46E5"
              />

            </View>

          )}

        </View>


        {/* CONTENT */}

        <View
          style={
            styles.productContent
          }
        >

          <View
            style={
              styles.titleRow
            }
          >

            <View
              style={
                styles.nameContainer
              }
            >

              <Text
                style={
                  styles.productName
                }
                numberOfLines={1}
              >
                {item.productenglishname ||
                  "Unnamed Product"}
              </Text>

              {!!item.producttamilName && (

                <Text
                  style={
                    styles.tamilName
                  }
                  numberOfLines={1}
                >
                  {item.producttamilName}
                </Text>

              )}

            </View>


            <View
              style={
                styles.codeBadge
              }
            >

              <Text
                style={
                  styles.codeText
                }
              >
                #{item.productcode}
              </Text>

            </View>

          </View>


          {/* PRICE + STOCK */}

          <View
            style={
              styles.infoRow
            }
          >

            <View>

              <Text
                style={
                  styles.label
                }
              >
                Selling Price
              </Text>

              <Text
                style={
                  styles.price
                }
              >
                ₹{retail.toFixed(2)}
              </Text>

            </View>


            <View>

              <Text
                style={
                  styles.label
                }
              >
                Purchase
              </Text>

              <Text
                style={
                  styles.purchase
                }
              >
                ₹{purchase.toFixed(2)}
              </Text>

            </View>


            <View>

              <Text
                style={
                  styles.label
                }
              >
                Margin
              </Text>

              <Text
                style={
                  styles.profit
                }
              >
                ₹{profit.toFixed(2)}
              </Text>

            </View>

          </View>


          {/* STOCK */}

          <View
            style={
              styles.stockRow
            }
          >

            <View
              style={
                styles.stockLeft
              }
            >

              <MaterialCommunityIcons
                name="warehouse"
                size={16}
                color="#64748B"
              />

              <Text
                style={
                  styles.stockText
                }
              >
                Stock: {stock}{" "}
                {item.uom ||
                  item.unittype ||
                  "Unit"}
              </Text>

            </View>


            <View
              style={[
                styles.stockBadge,
                stock <= 0
                  ? styles.outOfStock
                  : stock <= 5
                  ? styles.lowStock
                  : styles.inStock,
              ]}
            >

              <Text
                style={[
                  styles.stockBadgeText,
                  stock <= 0
                    ? styles.outOfStockText
                    : stock <= 5
                    ? styles.lowStockText
                    : styles.inStockText,
                ]}
              >
                {stock <= 0
                  ? "Out of Stock"
                  : stock <= 5
                  ? "Low Stock"
                  : "In Stock"}
              </Text>

            </View>

          </View>

        </View>


        <MaterialCommunityIcons
          name="chevron-right"
          size={25}
          color="#94A3B8"
        />

      </TouchableOpacity>

    );

  };


  // =====================================================
  // HEADER
  // =====================================================

  const Header = () => (

    <>

      <View
        style={
          styles.header
        }
      >

        <TouchableOpacity
          activeOpacity={0.8}
          style={
            styles.backButton
          }
          onPress={() =>
            router.back()
          }
        >

          <MaterialCommunityIcons
            name="arrow-left"
            size={23}
            color="#FFFFFF"
          />

        </TouchableOpacity>


        <View
          style={
            styles.headerContent
          }
        >

          <Text
            style={
              styles.headerSmall
            }
          >
            CATEGORY
          </Text>

          <Text
            style={
              styles.headerTitle
            }
            numberOfLines={1}
          >
            {category}
          </Text>

          <Text
            style={
              styles.headerDescription
            }
          >
            Products in this category
          </Text>

        </View>

      </View>


      {/* SUMMARY */}

      <View
        style={
          styles.summaryContainer
        }
      >

        <View
          style={
            styles.summaryCard
          }
        >

          <Text
            style={
              styles.summaryLabel
            }
          >
            Products
          </Text>

          <Text
            style={
              styles.summaryValue
            }
          >
            {categoryProducts.length}
          </Text>

        </View>


        <View
          style={
            styles.summaryCard
          }
        >

          <Text
            style={
              styles.summaryLabel
            }
          >
            Total Stock
          </Text>

          <Text
            style={
              styles.summaryValue
            }
          >
            {totalStock}
          </Text>

        </View>


        <View
          style={
            styles.summaryCard
          }
        >

          <Text
            style={
              styles.summaryLabel
            }
          >
            Stock Value
          </Text>

          <Text
            style={
              styles.summaryValue
            }
          >
            ₹{totalValue.toFixed(0)}
          </Text>

        </View>

      </View>


      {/* SEARCH */}

      <View
        style={
          styles.searchContainer
        }
      >

        <MaterialCommunityIcons
          name="magnify"
          size={22}
          color="#94A3B8"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={`Search ${category} products...`}
          placeholderTextColor="#94A3B8"
          style={
            styles.searchInput
          }
        />

        {search.length > 0 && (

          <TouchableOpacity
            onPress={() =>
              setSearch("")
            }
          >

            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color="#94A3B8"
            />

          </TouchableOpacity>

        )}

      </View>


      <View
        style={
          styles.sectionHeader
        }
      >

        <View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            {category} Products
          </Text>

          <Text
            style={
              styles.sectionSubtitle
            }
          >
            Select a product to view inventory
          </Text>

        </View>

        <View
          style={
            styles.countBadge
          }
        >

          <Text
            style={
              styles.countText
            }
          >
            {categoryProducts.length}
          </Text>

        </View>

      </View>

    </>

  );


  // =====================================================
  // SCREEN
  // =====================================================

  return (

    <View
      style={
        styles.container
      }
    >

      <StatusBar
        backgroundColor="#4F46E5"
        barStyle="light-content"
      />


      <FlatList
        data={
          categoryProducts
        }
        keyExtractor={
          item =>
            String(item.id)
        }
        renderItem={
          renderProduct
        }
        ListHeaderComponent={
          Header
        }
        contentContainerStyle={
          styles.listContent
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {

              setRefreshing(true);

              await loadProducts();

              setRefreshing(false);

            }}
          />
        }
        ListEmptyComponent={

          <View
            style={
              styles.emptyContainer
            }
          >

            <MaterialCommunityIcons
              name="package-variant-closed"
              size={55}
              color="#CBD5E1"
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              No Products Found
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              There are no products in
              this category.
            </Text>

          </View>

        }
      />

    </View>

  );

}


// =====================================================
// STYLES
// =====================================================

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#F8FAFC",
    },

    listContent: {
      paddingBottom: 30,
    },


    // =================================================
    // HEADER
    // =================================================

    header: {
      backgroundColor: "#4F46E5",

      paddingTop: 52,
      paddingHorizontal: 16,
      paddingBottom: 25,

      flexDirection: "row",
      alignItems: "center",

      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },

    backButton: {
      width: 43,
      height: 43,

      borderRadius: 13,

      backgroundColor:
        "rgba(255,255,255,0.16)",

      justifyContent: "center",
      alignItems: "center",

      marginRight: 12,
    },

    headerContent: {
      flex: 1,
    },

    headerSmall: {
      color: "#C7D2FE",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    headerTitle: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "900",
      marginTop: 2,
    },

    headerDescription: {
      color: "#E0E7FF",
      fontSize: 12,
      marginTop: 3,
    },


    // =================================================
    // SUMMARY
    // =================================================

    summaryContainer: {
      flexDirection: "row",

      paddingHorizontal: 12,

      marginTop: -13,
    },

    summaryCard: {
      flex: 1,

      backgroundColor: "#FFFFFF",

      marginHorizontal: 4,

      borderRadius: 15,

      padding: 11,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      elevation: 2,
    },

    summaryLabel: {
      fontSize: 9,
      color: "#64748B",
      fontWeight: "700",
    },

    summaryValue: {
      fontSize: 17,
      color: "#0F172A",
      fontWeight: "900",
      marginTop: 3,
    },


    // =================================================
    // SEARCH
    // =================================================

    searchContainer: {
      height: 50,

      backgroundColor: "#FFFFFF",

      marginHorizontal: 16,
      marginTop: 18,

      borderRadius: 14,

      paddingHorizontal: 14,

      flexDirection: "row",
      alignItems: "center",

      borderWidth: 1,
      borderColor: "#E2E8F0",
    },

    searchInput: {
      flex: 1,

      marginLeft: 9,

      color: "#0F172A",
      fontSize: 14,
    },


    // =================================================
    // SECTION
    // =================================================

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      paddingHorizontal: 18,

      marginTop: 22,
      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 19,
      color: "#0F172A",
      fontWeight: "900",
    },

    sectionSubtitle: {
      fontSize: 11,
      color: "#94A3B8",
      marginTop: 3,
    },

    countBadge: {
      minWidth: 32,
      height: 30,

      paddingHorizontal: 8,

      borderRadius: 10,

      backgroundColor: "#EEF2FF",

      justifyContent: "center",
      alignItems: "center",
    },

    countText: {
      color: "#4F46E5",
      fontSize: 12,
      fontWeight: "900",
    },


    // =================================================
    // PRODUCT CARD
    // =================================================

    productCard: {
      backgroundColor: "#FFFFFF",

      marginHorizontal: 16,
      marginBottom: 12,

      borderRadius: 18,

      padding: 12,

      flexDirection: "row",
      alignItems: "center",

      borderWidth: 1,
      borderColor: "#E2E8F0",

      elevation: 2,
    },

    imageContainer: {
      width: 82,
      height: 82,

      borderRadius: 14,

      overflow: "hidden",

      backgroundColor: "#EEF2FF",

      marginRight: 12,
    },

    productImage: {
      width: "100%",
      height: "100%",
    },

    imagePlaceholder: {
      flex: 1,

      justifyContent: "center",
      alignItems: "center",
    },

    productContent: {
      flex: 1,
      minWidth: 0,
    },

    titleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },

    nameContainer: {
      flex: 1,
      minWidth: 0,
    },

    productName: {
      color: "#0F172A",
      fontSize: 16,
      fontWeight: "900",
    },

    tamilName: {
      color: "#64748B",
      fontSize: 11,
      marginTop: 2,
    },

    codeBadge: {
      backgroundColor: "#EEF2FF",

      paddingHorizontal: 7,
      paddingVertical: 4,

      borderRadius: 7,

      marginLeft: 6,
    },

    codeText: {
      color: "#4F46E5",
      fontSize: 9,
      fontWeight: "900",
    },

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",

      marginTop: 10,

      paddingTop: 8,

      borderTopWidth: 1,
      borderTopColor: "#F1F5F9",
    },

    label: {
      color: "#94A3B8",
      fontSize: 8,
      fontWeight: "700",
    },

    price: {
      color: "#4F46E5",
      fontSize: 13,
      fontWeight: "900",
      marginTop: 2,
    },

    purchase: {
      color: "#475569",
      fontSize: 12,
      fontWeight: "800",
      marginTop: 2,
    },

    profit: {
      color: "#16A34A",
      fontSize: 12,
      fontWeight: "900",
      marginTop: 2,
    },

    stockRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      marginTop: 8,
    },

    stockLeft: {
      flexDirection: "row",
      alignItems: "center",
    },

    stockText: {
      color: "#475569",
      fontSize: 10,
      fontWeight: "800",
      marginLeft: 5,
    },

    stockBadge: {
      paddingHorizontal: 7,
      paddingVertical: 4,

      borderRadius: 7,
    },

    stockBadgeText: {
      fontSize: 8,
      fontWeight: "900",
    },

    inStock: {
      backgroundColor: "#DCFCE7",
    },

    inStockText: {
      color: "#15803D",
    },

    lowStock: {
      backgroundColor: "#FEF3C7",
    },

    lowStockText: {
      color: "#B45309",
    },

    outOfStock: {
      backgroundColor: "#FEE2E2",
    },

    outOfStockText: {
      color: "#DC2626",
    },


    // =================================================
    // EMPTY
    // =================================================

    emptyContainer: {
      alignItems: "center",

      paddingTop: 55,
      paddingHorizontal: 30,
    },

    emptyTitle: {
      fontSize: 18,
      color: "#334155",
      fontWeight: "900",
      marginTop: 13,
    },

    emptyText: {
      fontSize: 13,
      color: "#94A3B8",
      textAlign: "center",
      marginTop: 5,
      lineHeight: 20,
    },

  });
