import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import ListProduct from "../Components/ListProduct";

SplashScreen.preventAutoHideAsync();

export default function ListScreen({route, useRefresh}) {
  const listIndex = route.params.index;
  const [productList, setProductList] = useState([{productIndex: 1, quantity: 2, taken: false}]);
  const [addList, setAddList] = useState(false);
  const [entry, setEntry] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [refresh, setRefresh] = useRefresh;

  useEffect(() => {
    const loadShoppingLists = async () => {
      try {
        const [lists, productsList] = await AsyncStorage.multiGet(['shoppingLists', 'allProducts']);

        const parsedLists = JSON.parse(lists[1]);
        setShoppingLists(parsedLists);
        const {products} = parsedLists[listIndex];
        setProductList(products);

        const parsedProducts = JSON.parse(productsList[1]);
        setAllProducts(parsedProducts);
      } catch(error) {
        console.log(error);
      }
    };

    loadShoppingLists();
  }, [refresh]);

  const submit = async (id) => {
    const newProductList = [...productList];
    newProductList.push({productIndex: id, quantity: 0, taken: false});

    const newShoppingLists = [...shoppingLists];
    newShoppingLists[listIndex].products = newProductList;

    try {
      await AsyncStorage.setItem('shoppingLists', JSON.stringify(newShoppingLists));
      setRefresh(!refresh);
      setProductList(newProductList);
      setAddList(false);
      setAllItems([]);
      setEntry('');
    } catch (error) {
      console.log(error);
    }
  };

  const RenderItem = ({name, id}) => {
    return (
      <Text onPress={() => submit(id)} style={styles.item}>{name}</Text>
    );
  };

  const filter = (text) => {
    setEntry(text);

    if (text.length === 0) {
      setAllItems([]);
      return;
    };

    const formattedTypedText = text.toLowerCase();
    const formattedAllItems = [];

    allProducts.forEach((name, id) => {
      const formattedName = name.toLowerCase().slice(0, text.length);

      const isIncluded = productList.some(item => {
        return item === null ? false : (id === item.productIndex);
      });

      if (formattedTypedText === formattedName && isIncluded === false) {
        formattedAllItems.push({name, id});
      };
    });

    setAllItems(formattedAllItems);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor='#ca45ff'/>

      <View style={styles.shoppingListsHeader}>
        <Text style={styles.shoppingListsHeaderText}>Add product</Text>
        <TouchableOpacity onPress={() => setAddList(!addList)}>
          {addList ? (
            <AntDesign name="minuscircleo" size={40} color="black"/>
          ) : (
            <AntDesign name="pluscircleo" size={40} color="black"/>
          )}          
        </TouchableOpacity>
      </View>

      {addList ? (
        <View style={styles.filter}>
          <TextInput
            style={styles.input}
            placeholder="List name"
            value={entry}
            onChangeText={filter}
            onSubmitEditing={submit}
            autoFocus={true}
            maxLength={16}
          />
          <SafeAreaView style={styles.filteredNamesView}>
            <FlatList
              data={allItems}
              renderItem={({item}) => <RenderItem name={item.name} id={item.id}/>}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
        </View>
      ) : (
        <></>
      )}

      {productList.map((_value, index, array) => {
        const currentArrayIndex = array.length - index - 1;

        const product = array[currentArrayIndex];

        if (product === null) return;

        const {productIndex, quantity, taken} = product;

        const productName = allProducts[productIndex];

        if (productName === null) return;

        return (
          <ListProduct
            name={productName}
            quantity={quantity}
            taken={taken}
            arrayIndex={currentArrayIndex}
            listIndex={listIndex}
            productList={productList}
            setProductList={setProductList}
            key={currentArrayIndex}
            useRefresh={useRefresh}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: 'flex-start',
    backgroundColor: '#91cdf2',
  },
  shoppingListsHeader: {
    marginBottom: 20,
    width: '100%',
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shoppingListsHeaderText: {
    fontSize: 32,
    fontFamily: 'TypoGraphica_demo'
  },
  filter: {
    marginBottom: 12,
    width: '100%'
  },
  input: {
    zIndex: 1,
    width: '100%',
    height: 42,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 24,
    backgroundColor: '#cfbbfc'
  },
  filteredNamesView: {
    marginTop: -12,
    paddingTop: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#bda1ff'
  },
  item: {
    borderTopWidth: 1,
    width: '100%',
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 20
  }
});