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
  TextInput,
  StatusBar,
  RefreshControl,
  Image,
  Dimensions,
} from "react-native";

import {
  useFocusEffect,
  useRouter,
} from "expo-router";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { getProducts } from "../database/sqlite";


// =====================================================
// TYPES
// =====================================================

type Product = {
  id: string;
  productcode: string;
  productenglishname: string;
  producttamilName?: string;

  category?: string;
  subcategory?: string;

  productimage?: string;

  stockquantity?: number;
  stockvalue?: number;

  purchase?: number;
  retail?: number;
  mrp?: number;
};

type Category = {
  name: string;
  count: number;
  stock: number;
  value: number;
  image?: string;
};


// =====================================================
// CONSTANTS
// =====================================================

const { width } = Dimensions.get("window");

const CARD_WIDTH =
  (width - 16 * 2 - 12) / 2;


// =====================================================
// SCREEN
// =====================================================

export default function ProductDashboardScreen() {

  const router = useRouter();

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
        "📦 PRODUCTS:",
        result
      );

      setProducts(
        Array.isArray(result)
          ? result
          : []
      );

    } catch (error) {

      console.log(
        "❌ PRODUCT LOAD ERROR:",
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
  // REFRESH
  // =====================================================

  const onRefresh = async () => {

    setRefreshing(true);

    await loadProducts();

    setRefreshing(false);

  };


  // =====================================================
  // BUILD CATEGORIES
  //
  // Category image = first available product image
  // =====================================================

  const categories =
    useMemo<Category[]>(() => {

      const map =
        new Map<string, Product[]>();

      products.forEach(product => {

        const name =
          product.category?.trim() ||
          "Others";

        if (!map.has(name)) {
          map.set(name, []);
        }

        map.get(name)!.push(product);

      });


      return Array.from(
        map.entries()
      ).map(
        ([name, items]) => {

          const imageProduct =
            items.find(
              item =>
                !!item.productimage
            );

          return {

            name,

            count:
              items.length,

            stock:
              items.reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.stockquantity || 0
                  ),
                0
              ),

            value:
              items.reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.stockvalue || 0
                  ),
                0
              ),

            image:
              imageProduct?.productimage,

          };

        }
      );

    }, [products]);


  // =====================================================
  // FILTER CATEGORY
  // =====================================================

  const filteredCategories =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return categories;
      }

      return categories.filter(
        item =>
          item.name
            .toLowerCase()
            .includes(keyword)
      );

    }, [
      categories,
      search,
    ]);


  // =====================================================
  // SUMMARY
  // =====================================================

  const totalCategories =
    categories.length;

  const totalProducts =
    products.length;

  const totalStockValue =
    products.reduce(
      (sum, item) =>
        sum +
        Number(
          item.stockvalue || 0
        ),
      0
    );


  // =====================================================
  // CATEGORY ICON
  // =====================================================

  const getCategoryIcon =
    (category: string) => {

      const value =
        category.toLowerCase();

      if (
        value.includes("grocery") ||
        value.includes("food")
      ) {
        return "cart-variant";
      }

      if (
        value.includes("tea")
      ) {
        return "tea";
      }

      if (
        value.includes("cosmetic") ||
        value.includes("beauty")
      ) {
        return "lipstick";
      }

      if (
        value.includes("house") ||
        value.includes("home")
      ) {
        return "home-variant";
      }

      if (
        value.includes("electronic")
      ) {
        return "laptop";
      }

      if (
        value.includes("stationery")
      ) {
        return "pencil-ruler";
      }

      if (
        value.includes("medicine")
      ) {
        return "medical-bag";
      }

      return "package-variant";
    };


  // =====================================================
  // CATEGORY CARD
  // =====================================================

  const renderCategory = ({
    item,
  }: {
    item: Category;
  }) => {

    return (

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.categoryCard}
        onPress={() =>
          router.push({
            pathname:
              "/src/screens/ProductSubcategoryScreen",
            params: {
              category: item.name,
            },
          })
        }
      >

        {/* CATEGORY IMAGE */}

        <View
          style={
            styles.categoryImageContainer
          }
        >

          {item.image ? (

            <Image
              source={{
                uri: item.image,
              }}
              style={
                styles.categoryImage
              }
              resizeMode="cover"
            />

          ) : (

            <View
              style={
                styles.categoryImagePlaceholder
              }
            >

              <MaterialCommunityIcons
                name={
                  getCategoryIcon(
                    item.name
                  )
                }
                size={38}
                color="#4F46E5"
              />

            </View>

          )}


          {/* PRODUCT COUNT */}

          <View
            style={
              styles.countBadge
            }
          >

            <Text
              style={
                styles.countBadgeText
              }
            >
              {item.count}
            </Text>

          </View>

        </View>


        {/* CATEGORY INFO */}

        <View
          style={
            styles.categoryInfo
          }
        >

          <Text
            style={
              styles.categoryName
            }
            numberOfLines={1}
          >
            {item.name}
          </Text>


          <Text
            style={
              styles.productCountText
            }
          >
            {item.count}{" "}
            {item.count === 1
              ? "Product"
              : "Products"}
          </Text>


          <View
            style={
              styles.categoryBottomRow
            }
          >

            <View
              style={
                styles.stockRow
              }
            >

              <MaterialCommunityIcons
                name="warehouse"
                size={14}
                color="#64748B"
              />

              <Text
                style={
                  styles.stockText
                }
              >
                {item.stock}
              </Text>

            </View>


            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#94A3B8"
            />

          </View>

        </View>

      </TouchableOpacity>

    );

  };


  // =====================================================
  // HEADER
  // =====================================================

  const Header = () => (

    <>

      {/* HERO HEADER */}

      <View
        style={
          styles.header
        }
      >

        <View
          style={
            styles.headerText
          }
        >

          <Text
            style={
              styles.headerSmall
            }
          >
            INVENTORY
          </Text>

          <Text
            style={
              styles.headerTitle
            }
          >
            Product Dashboard
          </Text>

          <Text
            style={
              styles.headerDescription
            }
          >
            Select a category to view products
          </Text>

        </View>


        <TouchableOpacity
          activeOpacity={0.85}
          style={
            styles.addButton
          }
          onPress={() =>
            router.push(
              "/src/screens/ViewNewBilling"
            )
          }
        >

          <MaterialCommunityIcons
            name="plus"
            size={25}
            color="#FFFFFF"
          />

        </TouchableOpacity>

      </View>


      {/* SUMMARY CARDS */}

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

          <View
            style={
              styles.summaryIcon
            }
          >

            <MaterialCommunityIcons
              name="shape-outline"
              size={19}
              color="#4F46E5"
            />

          </View>

          <Text
            style={
              styles.summaryLabel
            }
          >
            Categories
          </Text>

          <Text
            style={
              styles.summaryValue
            }
          >
            {totalCategories}
          </Text>

        </View>


        <View
          style={
            styles.summaryCard
          }
        >

          <View
            style={
              styles.summaryIcon
            }
          >

            <MaterialCommunityIcons
              name="package-variant"
              size={19}
              color="#4F46E5"
            />

          </View>

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
            {totalProducts}
          </Text>

        </View>


        <View
          style={
            styles.summaryCard
          }
        >

          <View
            style={
              styles.summaryIcon
            }
          >

            <MaterialCommunityIcons
              name="currency-inr"
              size={19}
              color="#4F46E5"
            />

          </View>

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
            ₹{totalStockValue.toFixed(0)}
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
          placeholder="Search category..."
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


      {/* SECTION TITLE */}

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
            Categories
          </Text>

          <Text
            style={
              styles.sectionSubtitle
            }
          >
            Choose a category
          </Text>

        </View>


        <View
          style={
            styles.categoryCountBadge
          }
        >

          <Text
            style={
              styles.categoryCountText
            }
          >
            {filteredCategories.length}
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
          filteredCategories
        }
        keyExtractor={
          item => item.name
        }
        renderItem={
          renderCategory
        }
        numColumns={2}
        columnWrapperStyle={
          styles.columnWrapper
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
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={

          <View
            style={
              styles.emptyContainer
            }
          >

            <View
              style={
                styles.emptyIcon
              }
            >

              <MaterialCommunityIcons
                name="shape-outline"
                size={50}
                color="#4F46E5"
              />

            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              No Categories Found
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Add a product with a category
              to display it here.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={
                styles.emptyButton
              }
              onPress={() =>
                router.push(
                  "/src/screens/ProductScreen"
                )
              }
            >

              <MaterialCommunityIcons
                name="plus"
                size={19}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.emptyButtonText
                }
              >
                Add Product
              </Text>

            </TouchableOpacity>

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

      paddingTop: 55,
      paddingHorizontal: 18,
      paddingBottom: 30,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },

    headerText: {
      flex: 1,
      paddingRight: 10,
    },

    headerSmall: {
      color: "#C7D2FE",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.3,
    },

    headerTitle: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "900",
      marginTop: 4,
    },

    headerDescription: {
      color: "#E0E7FF",
      fontSize: 12,
      marginTop: 5,
    },

    addButton: {
      width: 48,
      height: 48,

      borderRadius: 15,

      backgroundColor:
        "rgba(255,255,255,0.18)",

      justifyContent: "center",
      alignItems: "center",

      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.25)",
    },


    // =================================================
    // SUMMARY
    // =================================================

    summaryContainer: {
      flexDirection: "row",

      paddingHorizontal: 12,

      marginTop: -14,
    },

    summaryCard: {
      flex: 1,

      backgroundColor: "#FFFFFF",

      marginHorizontal: 4,

      borderRadius: 16,

      padding: 11,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      elevation: 2,
    },

    summaryIcon: {
      width: 30,
      height: 30,

      borderRadius: 9,

      backgroundColor: "#EEF2FF",

      justifyContent: "center",
      alignItems: "center",

      marginBottom: 5,
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
      marginTop: 2,
    },


    // =================================================
    // SEARCH
    // =================================================

    searchContainer: {
      height: 50,

      backgroundColor: "#FFFFFF",

      marginHorizontal: 16,
      marginTop: 18,

      borderRadius: 15,

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
      justifyContent: "space-between",
      alignItems: "center",

      paddingHorizontal: 18,

      marginTop: 22,
      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 19,
      fontWeight: "900",
      color: "#0F172A",
    },

    sectionSubtitle: {
      fontSize: 11,
      color: "#94A3B8",
      marginTop: 3,
    },

    categoryCountBadge: {
      minWidth: 32,
      height: 30,

      paddingHorizontal: 8,

      borderRadius: 10,

      backgroundColor: "#EEF2FF",

      justifyContent: "center",
      alignItems: "center",
    },

    categoryCountText: {
      color: "#4F46E5",
      fontSize: 12,
      fontWeight: "900",
    },


    // =================================================
    // CATEGORY GRID
    // =================================================

    columnWrapper: {
      paddingHorizontal: 16,
      justifyContent: "space-between",
    },

    categoryCard: {
      width: CARD_WIDTH,

      backgroundColor: "#FFFFFF",

      borderRadius: 18,

      marginBottom: 14,

      overflow: "hidden",

      borderWidth: 1,
      borderColor: "#E2E8F0",

      elevation: 2,
    },

    categoryImageContainer: {
      width: "100%",
      height: 135,

      backgroundColor: "#EEF2FF",

      position: "relative",
    },

    categoryImage: {
      width: "100%",
      height: "100%",
    },

    categoryImagePlaceholder: {
      flex: 1,

      justifyContent: "center",
      alignItems: "center",

      backgroundColor: "#EEF2FF",
    },

    countBadge: {
      position: "absolute",

      right: 9,
      top: 9,

      minWidth: 30,
      height: 30,

      paddingHorizontal: 7,

      borderRadius: 10,

      backgroundColor: "#FFFFFF",

      justifyContent: "center",
      alignItems: "center",

      elevation: 2,
    },

    countBadgeText: {
      color: "#4F46E5",
      fontSize: 11,
      fontWeight: "900",
    },

    categoryInfo: {
      padding: 12,
    },

    categoryName: {
      color: "#0F172A",
      fontSize: 16,
      fontWeight: "900",
    },

    productCountText: {
      color: "#64748B",
      fontSize: 11,
      fontWeight: "700",
      marginTop: 3,
    },

    categoryBottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",

      marginTop: 10,

      paddingTop: 9,

      borderTopWidth: 1,
      borderTopColor: "#F1F5F9",
    },

    stockRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    stockText: {
      color: "#64748B",
      fontSize: 10,
      fontWeight: "800",
      marginLeft: 4,
    },


    // =================================================
    // EMPTY
    // =================================================

    emptyContainer: {
      alignItems: "center",

      paddingHorizontal: 30,
      paddingTop: 55,
    },

    emptyIcon: {
      width: 82,
      height: 82,

      borderRadius: 25,

      backgroundColor: "#EEF2FF",

      justifyContent: "center",
      alignItems: "center",
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: "900",

      color: "#334155",

      marginTop: 15,
    },

    emptyText: {
      fontSize: 13,

      color: "#94A3B8",

      textAlign: "center",

      marginTop: 6,

      lineHeight: 20,
    },

    emptyButton: {
      flexDirection: "row",
      alignItems: "center",

      backgroundColor: "#4F46E5",

      paddingHorizontal: 18,
      paddingVertical: 11,

      borderRadius: 13,

      marginTop: 18,
    },

    emptyButtonText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "900",
      marginLeft: 6,
    },

  });
