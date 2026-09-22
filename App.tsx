import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ProductoProvider } from './src/context/ProductoContext';
import NuevoProductoScreen from './src/screens/NuevoProductoScreen';
import ProductosScreen from './src/screens/ProductosScreen';

// DICCIONARIO
export type RootTabParamList = {
  ListaProductos: undefined;
  AddProductos: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <ProductoProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator initialRouteName="ListaProductos">
            <Tab.Screen
              name="ListaProductos"
              component={ProductosScreen}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="cube" size={size} color={color} />
                ),
              }}
            />

            <Tab.Screen
              name="AddProductos"
              component={NuevoProductoScreen}
              options={{
                title: 'Nuevo Producto',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="add-circle" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ProductoProvider>
    </SafeAreaProvider>
  );
}