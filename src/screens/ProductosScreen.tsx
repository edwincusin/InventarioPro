import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducto } from '../context/ProductoContext';
import { Ionicons } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';


export default function ProductosScreen({ navigation }: any) {
  const { productos, deleteProducto, fetchProductos, cargar } = useProducto();

  return (
    <SafeAreaView>
      <View>
        <Text>Prodcuctos #{productos.length}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddProductos")}>
          <Ionicons name='add' size={40} color={'blue'} />
        </TouchableOpacity>

      </View>
      <View>
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={cargar} onRefresh={fetchProductos}/>}
          renderItem={({ item }) => {
            return (
              <View>
                {item.fotoBase64 ? (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${item.fotoBase64}` }}
                  />
                ) : (
                  <Text>Sin Imagen</Text>
                )}

                <Text>{item.nombre}</Text>
                <Text>{item.precio.toFixed(2)}$</Text>

                <TouchableOpacity onPress={() => navigation.navigate("AddProductos7")}>
                  <Ionicons name='pencil' size={25} color={'orange'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("AddProductos7")}>
                  <Ionicons name='eye' size={25} color={'black'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteProducto(item.id)}>
                  <Ionicons name='trash' size={25} color={'red'} />
                </TouchableOpacity>
              </View>

            )
          }}
        />
      </View>

    </SafeAreaView>
  )
};
