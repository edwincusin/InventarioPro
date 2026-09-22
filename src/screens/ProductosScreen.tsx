import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducto } from '../context/ProductoContext';
import { Ionicons } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';


export default function ProductosScreen({ navigation }: any) {
  const { productos, deleteProducto, fetchProductos, cargar } = useProducto();

  
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Inventario</Text>
          <Text style={styles.subtitulo}>{productos.length} productos</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProductos')}
        >
          <Ionicons name="add" size={28} color="#0a0a0f" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={cargar}
            onRefresh={fetchProductos}
            tintColor="#00f5d4"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.fotoBase64 ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${item.fotoBase64}` }}
                style={styles.imagen}
              />
            ) : (
              <View style={styles.sinImagen}>
                <Ionicons name="image-outline" size={22} color="#3d3d4e" />
                <Text style={styles.sinImagenTexto}>Sin foto</Text>
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.nombre} numberOfLines={1}>{item.nombre}</Text>
              <Text style={styles.categoria}>{item.categoria}</Text>
              <Text style={styles.precio}>${item.precio.toFixed(2)}</Text>
            </View>

            <View style={styles.acciones}>
              <TouchableOpacity
                style={[styles.iconBtn, styles.editBtn]}
                onPress={() => navigation.navigate('AddProductos')}
              >
                <Ionicons name="pencil" size={16} color="#0a0a0f" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconBtn, styles.deleteBtn]}
                onPress={() => deleteProducto(item.id)}
              >
                <Ionicons name="trash" size={16} color="#0a0a0f" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};



const ACCENT = '#00f5d4';   // cian eléctrico
const ACCENT_2 = '#ff2e88'; // magenta vivo
const BG = '#0a0a0f';       // casi negro azulado
const CARD_BG = '#15151f';  // gris azulado oscuro
const BORDER = '#22222e';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  subtitulo: {
    fontSize: 13,
    color: '#6b6b7d',
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ACCENT,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 12,
  },
  imagen: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  sinImagen: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#1c1c28',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    gap: 2,
  },
  sinImagenTexto: {
    fontSize: 9,
    color: '#4d4d5e',
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  categoria: {
    fontSize: 11,
    color: ACCENT,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  precio: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 4,
  },
  acciones: {
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#ffb800',
  },
  deleteBtn: {
    backgroundColor: ACCENT_2,
  },
});