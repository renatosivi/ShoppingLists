import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ListScreen from './src/Screens/ListScreen';
import TabNavigatior from './src/Navigations/Tabs';
import { useFonts } from 'expo-font';
import { useCallback, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function App() {
  const useRefresh = useState(false);

  const [fontsLoaded] = useFonts({
    'TypoGraphica_demo': require('./assets/fonts/TypoGraphica_demo.otf'),
    'OpenDyslexic-Regular': require('./assets/fonts/OpenDyslexic-Regular.otf')
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Tabs'>
        <Stack.Screen name='Tabs' options={{headerShown: false}}>
          {props => <TabNavigatior {...props} onLayoutRootView={onLayoutRootView} useRefresh={useRefresh}/>}
        </Stack.Screen>
        <Stack.Screen
          name='ListScreen'
          options={({route}) => ({
            title: route.params.name,
            headerTransparent: true,
            headerTitleStyle: {fontFamily: 'OpenDyslexic-Regular'}
          })}
        >
          {props => <ListScreen {...props} useRefresh={useRefresh}/>}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}