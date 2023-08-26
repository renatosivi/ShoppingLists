import { useEffect, useState } from "react";
import { Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import Product from "../Components/Product";

SplashScreen.preventAutoHideAsync();

export default function ProductsScreen({useRefresh}) {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [addList, setAddList] = useState(false);
  const [entry, setEntry] = useState('');
  const [refresh, setRefresh] = useRefresh;

  useEffect(() => {
    const loadShoppingLists = async () => {
      try {
        const data = await AsyncStorage.getItem('allProducts');

        if (data === null) {
          await AsyncStorage.setItem('allProducts', JSON.stringify([]));
        } else {
          const parsedData = JSON.parse(data);
          setShoppingLists(parsedData);
        }
      } catch(error) {
        console.log(error);
      }
    };

    loadShoppingLists();
  }, [refresh]);

  const submit = async () => {
    if (entry === '') {
      setAddList(false);
      return;
    }

    const containList = shoppingLists.some(product => product === entry);

    if (containList) {
      Alert.alert(
        '',
        'A product with that name already exists.',
        [{text: 'Ok'}], 
        {cancelable: true}
      );

      return;
    }

    const newShoppingLists = [...shoppingLists, entry];

    try {
      await AsyncStorage.setItem('allProducts', JSON.stringify(newShoppingLists));

      setShoppingLists(newShoppingLists);
      setAddList(false);
      setEntry('');
      setRefresh(!refresh);
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor='#ca45ff'/>

      <View style={styles.shoppingListsHeader}>
        <Text style={styles.shoppingListsHeaderText}>All products</Text>
        <TouchableOpacity onPress={() => setAddList(!addList)}>
          {addList ? (
            <AntDesign name="minuscircleo" size={40} color="black"/>
          ) : (
            <AntDesign name="pluscircleo" size={40} color="black"/>
          )}          
        </TouchableOpacity>
      </View>

      {addList ? (
        <TextInput
          style={styles.input}
          placeholder="Product"
          value={entry}
          onChangeText={setEntry}
          onSubmitEditing={submit}
          autoFocus={true}
          maxLength={16}
        />
      ) : (
        <></>
      )}

      {shoppingLists.map((_value, index, array) => {
        const currentIndex = array.length - index - 1;
        const currentName = array[currentIndex];

        if (currentName === null) return;    

        return (
          <Product
            name={currentName}
            index={currentIndex}
            shoppingLists={shoppingLists}
            setShoppingLists={setShoppingLists}
            key={currentIndex}
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
    paddingTop: 50,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: 'flex-start',
    backgroundColor: '#eb6ee6',
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
  input: {
    marginBottom: 12,
    width: '100%',
    height: 42,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 24
  }
});