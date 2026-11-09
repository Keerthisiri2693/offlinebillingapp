import React, {
  useState,
  useCallback,
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  useRouter,
} from "expo-router";

import {
  getProducts,
  deleteProduct,
} from "../database/sqlite";

import styles from "../style/ProductListScreenStyle";


export default function ProductList() {

  const router = useRouter();


  // =====================================================
  // STATE
  // =====================================================

  const [
    data,
    setData,
  ] = useState<any[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  const [
    search,
    setSearch,
  ] = useState("");


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredData =
    data.filter((item) => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {
        return true;
      }


      return (

        String(
          item?.productenglishname ||
          ""
        )
          .toLowerCase()
          .includes(query)


        ||


        String(
          item?.productcode ||
          ""
        )
          .toLowerCase()
          .includes(query)


        ||


        String(
          item?.producttype ||
          ""
        )
          .toLowerCase()
          .includes(query)


        ||


        String(
          item?.category ||
          ""
        )
          .toLowerCase()
          .includes(query)


        ||


        String(
          item?.subcategory ||
          ""
        )
          .toLowerCase()
          .includes(query)


        ||


        String(
          item?.brandname ||
          ""
        )
          .toLowerCase()
          .includes(query)


        ||


        String(
          item?.barcode ||
          ""
        )
          .toLowerCase()
          .includes(query)

      );

    });


  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadData =
    async () => {

      try {

        setLoading(true);


        const res =
          await getProducts();


        console.log(
          "📦 PRODUCTS:",
          res
        );


        setData(
          Array.isArray(res)
            ? [...res]
            : []
        );


      } catch (e) {

        console.log(
          "❌ LOAD PRODUCTS ERROR:",
          e
        );


        setData([]);

      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useFocusEffect(

    useCallback(() => {

      loadData();

    }, [])

  );


  // =====================================================
  // PULL REFRESH
  // =====================================================

  const onRefresh =
    useCallback(async () => {

      try {

        setRefreshing(true);

        await loadData();

      } catch (e) {

        console.log(
          "❌ REFRESH ERROR:",
          e
        );

      } finally {

        setRefreshing(false);

      }

    }, []);


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete =
    (id: string) => {

      Alert.alert(

        "Delete Product",

        "Are you sure you want to delete this product?",

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

                await deleteProduct(id);

                await loadData();


              } catch (e) {

                console.log(
                  "❌ DELETE ERROR:",
                  e
                );

                Alert.alert(
                  "Error",
                  "Unable to delete product."
                );

              }

            },

          },

        ]

      );

    };


  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit =
    (id: string) => {

      router.push({

        pathname:
          "/src/screens/ProductScreen",

        params: {
          id: id.toString(),
        },

      });

    };


  // =====================================================
  // OPEN PRODUCT
  // =====================================================

  const handleOpenProduct =
    (id: string) => {

      router.push({

        pathname:
          "/src/screens/ProductScreen",

        params: {
          id: id.toString(),
        },

      });

    };


  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const renderProductImage =
    (item: any) => {

      if (
        item?.productimage &&
        String(item.productimage).trim()
      ) {

        return (

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

        );

      }


      return (

        <View
          style={
            styles.productImagePlaceholder
          }
        >

          <MaterialCommunityIcons
            name="package-variant"
            size={34}
            color="#94A3B8"
          />

        </View>

      );

    };


  // =====================================================
  // STOCK COLOR
  // =====================================================

  const getStockColor =
    (quantity: number) => {

      const qty =
        Number(quantity || 0);


      if (qty <= 0) {
        return "#DC2626";
      }


      if (qty <= 5) {
        return "#EA580C";
      }


      return "#16A34A";

    };


  // =====================================================
  // RENDER PRODUCT
  // =====================================================

  const renderItem =
    ({
      item,
    }: {
      item: any;
    }) => (

      <TouchableOpacity

        activeOpacity={0.92}

        style={
          styles.card
        }

        onPress={() =>
          handleOpenProduct(
            item.id
          )
        }
      >

        {/* ================================================= */}
        {/* TOP PRODUCT AREA */}
        {/* ================================================= */}

        <View
          style={
            styles.productTop
          }
        >

          {/* IMAGE */}

          {renderProductImage(item)}


          {/* PRODUCT INFO */}

          <View
            style={
              styles.productInfo
            }
          >

            <View
              style={
                styles.titleRow
              }
            >

              <Text
                style={
                  styles.title
                }

                numberOfLines={2}
              >
                {
                  item?.productenglishname ||
                  "No Name"
                }
              </Text>


              {/* ACTIONS */}

              <View
                style={
                  styles.actionRow
                }
              >

                {/* DELETE */}

                <TouchableOpacity

                  activeOpacity={0.75}

                  onPress={() =>
                    handleDelete(
                      item.id
                    )
                  }

                  style={
                    styles.actionButton
                  }
                >

                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={20}
                    color="#DC2626"
                  />

                </TouchableOpacity>

              </View>

            </View>


            {/* PRODUCT CODE */}

            <Text
              style={
                styles.productCode
              }
            >
              Code:{" "}
              {item?.productcode || "-"}
            </Text>


            {/* CATEGORY */}

            <View
              style={
                styles.categoryRow
              }
            >

              <View
                style={
                  styles.categoryBadge
                }
              >

                <MaterialCommunityIcons
                  name="shape-outline"
                  size={13}
                  color="#6D28D9"
                />

                <Text
                  style={
                    styles.categoryText
                  }
                  numberOfLines={1}
                >
                  {
                    item?.category ||
                    "Uncategorized"
                  }
                </Text>

              </View>


              {item?.subcategory ? (

                <View
                  style={
                    styles.subcategoryBadge
                  }
                >

                  <Text
                    style={
                      styles.subcategoryText
                    }
                    numberOfLines={1}
                  >
                    {item.subcategory}
                  </Text>

                </View>

              ) : null}

            </View>

          </View>

        </View>


        {/* ================================================= */}
        {/* DETAILS */}
        {/* ================================================= */}

        <View
          style={
            styles.detailsRow
          }
        >

          {/* TYPE */}

          <View
            style={
              styles.detailItem
            }
          >

            <Text
              style={
                styles.detailLabel
              }
            >
              TYPE
            </Text>

            <Text
              style={
                styles.detailValue
              }
              numberOfLines={1}
            >
              {
                item?.producttype ||
                "-"
              }
            </Text>

          </View>


          {/* BRAND */}

          <View
            style={
              styles.detailItem
            }
          >

            <Text
              style={
                styles.detailLabel
              }
            >
              BRAND
            </Text>

            <Text
              style={
                styles.detailValue
              }
              numberOfLines={1}
            >
              {
                item?.brandname ||
                "-"
              }
            </Text>

          </View>


          {/* STOCK */}

          <View
            style={
              styles.detailItem
            }
          >

            <Text
              style={
                styles.detailLabel
              }
            >
              STOCK
            </Text>

            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    getStockColor(
                      item?.stockquantity
                    ),
                },
              ]}
            >
              {
                Number(
                  item?.stockquantity ||
                  0
                )
              }
            </Text>

          </View>

        </View>


        {/* ================================================= */}
        {/* PRICE AREA */}
        {/* ================================================= */}

        <View
          style={
            styles.priceBox
          }
        >

          <View>

            <Text
              style={
                styles.priceLabel
              }
            >
              RETAIL PRICE
            </Text>

            <Text
              style={
                styles.price
              }
            >
              ₹{" "}
              {
                Number(
                  item?.retail ||
                  0
                ).toLocaleString(
                  "en-IN"
                )
              }
            </Text>

          </View>


          <View
            style={
              styles.mrpBox
            }
          >

            <Text
              style={
                styles.mrpLabel
              }
            >
              MRP
            </Text>

            <Text
              style={
                styles.mrp
              }
            >
              ₹{" "}
              {
                Number(
                  item?.mrp ||
                  0
                ).toLocaleString(
                  "en-IN"
                )
              }
            </Text>

          </View>


          <View
            style={
              styles.arrowButton
            }
          >

            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#4F46E5"
            />

          </View>

        </View>

      </TouchableOpacity>

    );


  // =====================================================
  // HEADER
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


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <LinearGradient

        colors={[
          "#4F46E5",
          "#6366F1",
        ]}

        start={{
          x: 0,
          y: 0,
        }}

        end={{
          x: 1,
          y: 1,
        }}

        style={
          styles.header
        }
      >

        <View
          style={
            styles.headerRow
          }
        >

          <View>

            <Text
              style={
                styles.headerTitle
              }
            >
              Products
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              {data.length}{" "}
              {data.length === 1
                ? "product"
                : "products"}{" "}
              in inventory
            </Text>

          </View>


          {/* ADD PRODUCT */}

          <TouchableOpacity

            activeOpacity={0.8}

            onPress={() =>
              router.push(
                "/src/screens/ProductScreen"
              )
            }

            style={
              styles.addButton
            }
          >

            <MaterialCommunityIcons
              name="plus"
              size={25}
              color="#FFFFFF"
            />

          </TouchableOpacity>

        </View>

      </LinearGradient>


      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <View
        style={
          styles.searchContainer
        }
      >

        <MaterialCommunityIcons
          name="magnify"
          size={22}
          color="#64748B"
        />


        <TextInput

          placeholder="Search products, category, barcode..."

          placeholderTextColor="#94A3B8"

          value={search}

          onChangeText={
            setSearch
          }

          style={
            styles.searchInput
          }

          autoCapitalize="none"

          autoCorrect={false}
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


      {/* ================================================= */}
      {/* RESULT COUNT */}
      {/* ================================================= */}

      {!loading &&
        data.length > 0 && (

          <View
            style={
              styles.resultRow
            }
          >

            <Text
              style={
                styles.resultText
              }
            >
              {search
                ? `${filteredData.length} result${
                    filteredData.length !== 1
                      ? "s"
                      : ""
                  }`
                : `${data.length} products`}
            </Text>


            {search.length > 0 && (

              <Text
                style={
                  styles.searchResultText
                }
              >
                Searching...
              </Text>

            )}

          </View>

        )}


      {/* ================================================= */}
      {/* BODY */}
      {/* ================================================= */}

      <View
        style={
          styles.body
        }
      >

        {/* LOADING */}

        {loading ? (

          <View
            style={
              styles.centerContainer
            }
          >

            <View
              style={
                styles.loadingCircle
              }
            >

              <ActivityIndicator
                size="large"
                color="#4F46E5"
              />

            </View>


            <Text
              style={
                styles.loadingTitle
              }
            >
              Loading Products
            </Text>


            <Text
              style={
                styles.loadingSubtitle
              }
            >
              Please wait...
            </Text>

          </View>

        ) : data.length === 0 ? (

          /* ================================================= */
          /* NO PRODUCTS */
          /* ================================================= */

          <View
            style={
              styles.centerContainer
            }
          >

            <View
              style={
                styles.emptyIcon
              }
            >

              <MaterialCommunityIcons
                name="package-variant-closed-remove"
                size={60}
                color="#94A3B8"
              />

            </View>


            <Text
              style={
                styles.emptyTitle
              }
            >
              No Products Found
            </Text>


            <Text
              style={
                styles.emptySubtitle
              }
            >
              Create your first product
              to get started
            </Text>


            <TouchableOpacity

              activeOpacity={0.85}

              onPress={() =>
                router.push(
                  "/src/screens/ProductScreen"
                )
              }

              style={
                styles.emptyButton
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

        ) : filteredData.length === 0 ? (

          /* ================================================= */
          /* NO SEARCH RESULTS */
          /* ================================================= */

          <View
            style={
              styles.centerContainer
            }
          >

            <View
              style={
                styles.emptyIcon
              }
            >

              <MaterialCommunityIcons
                name="magnify-close"
                size={58}
                color="#94A3B8"
              />

            </View>


            <Text
              style={
                styles.emptyTitle
              }
            >
              No Matching Products
            </Text>


            <Text
              style={
                styles.emptySubtitle
              }
            >
              Try searching by product name,
              category or barcode.
            </Text>


            <TouchableOpacity

              activeOpacity={0.8}

              onPress={() =>
                setSearch("")
              }

              style={
                styles.clearSearchButton
              }
            >

              <Text
                style={
                  styles.clearSearchText
                }
              >
                Clear Search
              </Text>

            </TouchableOpacity>

          </View>

        ) : (

          /* ================================================= */
          /* PRODUCT LIST */
          /* ================================================= */

          <FlatList

            data={
              filteredData
            }

            keyExtractor={(
              item,
              index
            ) =>

              item?.id
                ? item.id.toString()
                : index.toString()

            }

            renderItem={
              renderItem
            }

            showsVerticalScrollIndicator={
              false
            }

            refreshControl={

              <RefreshControl

                refreshing={
                  refreshing
                }

                onRefresh={
                  onRefresh
                }

                tintColor="#4F46E5"

                colors={[
                  "#4F46E5",
                ]}

              />

            }

            contentContainerStyle={
              styles.listContent
            }

          />

        )}

      </View>

    </View>

  );

}

