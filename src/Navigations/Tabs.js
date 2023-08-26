import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/HomeScreen";
import ProductsScreen from "../Screens/ProductsScreen";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const Tabs = createBottomTabNavigator();

export default function TabNavigatior({onLayoutRootView, useRefresh}) {
  return (
    <Tabs.Navigator screenOptions={{headerShown: false}}>
      <Tabs.Screen name='Lists' options={{
          tabBarIcon: () => {
            return (<FontAwesome name="th-list" size={24} color="black" />);
          }
        }}
      >
        {props => <HomeScreen {...props} onLayoutRootView={onLayoutRootView} useRefresh={useRefresh}/>}
      </Tabs.Screen>
      <Tabs.Screen name='All products' options={{
        tabBarIcon: () => {
          return (<MaterialIcons name="local-mall" size={24} color="black" />);
        }
      }}>
        {props => <ProductsScreen {...props} useRefresh={useRefresh}/>}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}