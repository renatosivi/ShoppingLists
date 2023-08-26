import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function List({name, index, shoppingLists, setShoppingLists, useRefresh}) {
  const [visible, setVisible] = useState(false);
  const [editable, setEditable] = useState(false);
  const [newEntry, setNewEntry] = useState(name);
  const {navigate} = useNavigation();
  const [refresh, setRefresh] = useRefresh;

  const edit = async () => {
    if (newEntry === name || newEntry === '') {
      setEditable(false);
      setNewEntry(name);
      return;
    }

    const containList = shoppingLists.some(shoppingList => {
      if (shoppingList === null) return false;

      return (shoppingList.name === newEntry);
    });

    if (containList) {
      Alert.alert(
        '',
        'A list with that name already exists.',
        [{text: 'Ok'}], 
        {cancelable: true}
      );
      
      return;
    }

    setEditable(false);

    const newShoppingLists = [...shoppingLists];
    newShoppingLists[index].name = newEntry;

    try {
      await AsyncStorage.setItem('shoppingLists', JSON.stringify(newShoppingLists));

      setShoppingLists(newShoppingLists);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteList = async () => {
    const newShoppingLists = [...shoppingLists];
    newShoppingLists[index] = null;

    try {
      await AsyncStorage.setItem('shoppingLists', JSON.stringify(newShoppingLists));

      setShoppingLists(newShoppingLists);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  const requireDelete = async () => {
    Alert.alert(
      '',
      'Confirm to delete the list.',
      [{text: 'Delete', onPress: deleteList}, {text: 'Cancel'}],
      {cancelable: true}
    );
  };

  return (
    <>
      {editable ? (
        <TextInput
          style={styles.input}
          onSubmitEditing={edit}
          autoFocus={true}
          value={newEntry}
          onChangeText={setNewEntry}
        />
      ) : (
        <View style={styles.listNameView}>
          <Text
            style={styles.listName}
            onPress={() => navigate('ListScreen', {name, index})}
          >
            {newEntry}
          </Text>
          <View style={styles.listButtons}>
            <View
              style={{
                height: 33,
                borderWidth: 1,
                borderColor: '#3b3b3b',
                borderRadius: 8,
                paddingHorizontal: 6,
                display: visible ? 'flex' : 'none',
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 8,
                backgroundColor: '#c67aff'
              }}
            >
              <Pressable onPress={() => {setEditable(true); setVisible(false);}}>
                <Feather name="edit-3" size={24} color="#000000"/>
              </Pressable>
              <Pressable onPress={requireDelete}>
                <MaterialIcons name="delete-outline" size={24} color="#000000"/>
              </Pressable>
            </View>
            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <SimpleLineIcons name="options-vertical" size={24} color="black"/>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 6,
    width: '100%',
    height: 42,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 24
  },
  listNameView: {
    marginBottom: 6,
    width: '100%',
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7824ff',
    shadowColor: '#000000',
  },
  listName: {
    width: 220,
    borderRightWidth: 1,
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 24
  },
  listButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10
  }
});