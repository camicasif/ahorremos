import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import VincularScreen from './VincularScreen';
import PeluqueriaScreen from './old-implementation/PeluqueriaScreen';

const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Vincular"
        component={VincularScreen}
        options={{ headerShown: false, title: 'Vincular Cuenta' }}
      />
      <HomeStack.Screen
        name="Peluqueria"
        component={PeluqueriaScreen}
        options={{ headerShown: false, title: 'Vincular Cuenta' }}
      />
    </HomeStack.Navigator>
  );
}
