import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ProductoProvider } from './src/context/ProductoContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NuevoProductoScreen from './src/screens/NuevoProductoScreen';
import ProductosScreen from './src/screens/ProductosScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// DICCIONARIO
export type RootTabParamList = {
  ListaProductos: undefined;
  AddProductos: undefined;
}

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <ProductoProvider>
      <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator initialRouteName='ListaProductos'>
          <Tab.Screen
            name='ListaProductos'
            component={ProductosScreen}
            options={{ title: 'Lista Productos' }}
          />

          <Tab.Screen
            name='AddProductos'
            component={NuevoProductoScreen}
            options={{ title: 'Nuevo Producto' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>
    </ProductoProvider>
  );
}

