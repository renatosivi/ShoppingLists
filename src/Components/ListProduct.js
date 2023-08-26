import { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons, SimpleLineIcons, Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListProduct({name, quantity, taken, arrayIndex, listIndex, productList, setProductList, useRefresh}) {
  const [visible, setVisible] = useState(false);
  const [editable, setEditable] = useState(false);
  const [newQuantity, setNewQuantity] = useState(quantity);
  const [refresh, setRefresh] = useRefresh;

  const deleteList = async () => {
    const newShoppingLists = [...productList];

    newShoppingLists[arrayIndex] = null;

    try {
      const data = await AsyncStorage.getItem('shoppingLists');

      const parsedData = JSON.parse(data);

      parsedData[listIndex].products = newShoppingLists;

      await AsyncStorage.setItem('shoppingLists', JSON.stringify(parsedData));

      setProductList(newShoppingLists);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  const requireDelete = async () => {
    Alert.alert(
      '',
      'Confirm to delete the product.',
      [{text: 'Delete', onPress: deleteList}, {text: 'Cancel'}],
      {cancelable: true}
    );
  };
  
  const changeQuantity = (text) => {
    let formattedText = text;

    const regex = new RegExp('^[0-9]$');

    for (let i = 0; i < formattedText.length; i++) {
      const number = formattedText[i];

      if (regex.test(number) === false) {
        formattedText = formattedText.slice(0, i) + formattedText.slice(i + 1);
        i = 0;
      }
    }

    if (formattedText.length === 1 && regex.test(formattedText) === false) {
      formattedText = '';
    }

    setNewQuantity(formattedText);
  };

  const submitQuantity = async () => {
    if (newQuantity === '') {
      setNewQuantity(0);
      setEditable(false);
      return;
    }

    let formattedText = newQuantity;

    while (formattedText.length > 1 && formattedText[0] === '0') {
      formattedText = formattedText.slice(1);
    }

    const newShoppingLists = [...productList];

    newShoppingLists[arrayIndex].quantity = formattedText;

    try {
      const data = await AsyncStorage.getItem('shoppingLists');

      const parsedData = JSON.parse(data);

      parsedData[listIndex].products = newShoppingLists;

      await AsyncStorage.setItem('shoppingLists', JSON.stringify(parsedData));

      setNewQuantity(formattedText);
      setEditable(false);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };
  
  const take = async () => {
    const newShoppingLists = [...productList];

    newShoppingLists[arrayIndex].taken = !newShoppingLists[arrayIndex].taken;

    try {
      const data = await AsyncStorage.getItem('shoppingLists');

      const parsedData = JSON.parse(data);

      parsedData[listIndex].products = newShoppingLists;

      await AsyncStorage.setItem('shoppingLists', JSON.stringify(parsedData));

      setProductList(newShoppingLists);
      setVisible(false);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.row}>
      <View style={styles.listNameView}>
        <Text
          style={{
            width: 210,
            fontFamily: 'OpenDyslexic-Regular',
            fontSize: 24,
            textDecorationLine: taken ? 'line-through' : 'none'
          }}
        >
          {name}
        </Text>
        <View style={styles.listButtons}>
          <View
            style={{
              position: 'absolute',
              left: -75,
              zIndex: 1,
              height: 33,
              borderWidth: 1,
              borderColor: '#3b3b3b',
              borderRadius: 8,
              paddingHorizontal: 6,
              display: visible ? 'flex' : 'none',
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 8,
              backgroundColor: '#faa2da',
              opacity: 0.75
            }}
          >
            {taken ? (
              <Pressable onPress={take}>
                <MaterialCommunityIcons name="cart-remove" size={24} color="black"/>
              </Pressable>
            ) : (
              <Pressable onPress={take}>
                <MaterialCommunityIcons name="cart-check" size={24} color="black"/>
              </Pressable>
            )}
            <Pressable onPress={requireDelete}>
              <MaterialIcons name="delete-outline" size={24} color="#000000"/>
            </Pressable>
          </View>
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <SimpleLineIcons name="options-vertical" size={24} color="black"/>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.quantityView}>
        <TextInput
          style={styles.quantityInput}
          editable={editable}
          keyboardType="numeric"
          value={newQuantity.toString()}
          onChangeText={changeQuantity}
          onEndEditing={submitQuantity}
          selectTextOnFocus={true}
        />
        <View style={styles.editQuantity}>
          {editable ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
              onTouchStart={() => submitQuantity()}
            >
              <AntDesign name="checkcircleo" size={24} color="black"/>
            </View>
          ) : (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
              onTouchStart={() => setEditable(true)}
            >
              <Feather name="edit-3" size={24} color="#000000"/>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    marginBottom: 6,
    flexDirection: 'row',
    columnGap: 3
  },
  listNameView: {
    flex: 1,
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#39b0fa',
    shadowColor: '#b886a5',
  },
  listButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10
  },
  quantityView: {
    width: 88,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    flexDirection: 'row'
  },
  quantityInput: {
    width: 44,
    borderRightWidth: 1,
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 24,
    textAlign: "center"
  },
  editQuantity: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff7575'
  }
});