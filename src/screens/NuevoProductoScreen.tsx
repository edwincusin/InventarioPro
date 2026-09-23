import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useProducto } from '../context/ProductoContext';
import { useState } from 'react';
import *as ImagePicker from 'expo-image-picker'
import { CameraView, useCameraPermissions } from 'expo-camera';


export default function NuevoProductoScreen({ navigation }: any) {

  const { addProducto } = useProducto();
  const [nombre, setnombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  //para escanear codigo de barras 
  const [codigoBarras, setCodigoBarras] = useState<string | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const limpiarCampos = () => {
    setnombre('');
    setPrecio('');
    setCategoria('');
    setFotoBase64(null);
    setCodigoBarras(null);
  }
  const limpiarYVolver = () => {
    limpiarCampos();
    navigation.navigate("ListaProductos")
  }
  const validarCamposObligatorios = () => {
    if (!nombre || !precio || !categoria || !fotoBase64) {
      Alert.alert("Campos Obligatorios", "Llena todos los campos")
      return false;
    }

    const precioFloat = parseFloat(precio);
    if (isNaN(precioFloat)) {
      Alert.alert("Campo precio", "formato debe ser un numero")
      return false;
    }
    return true;
  }

  const tomarFoto = async () => {
    try {
      const permiso = await ImagePicker.requestCameraPermissionsAsync();

      if (permiso.status !== "granted") return Alert.alert("Denegado", "Permiso de camara denegado")

      const resultado = await ImagePicker.launchCameraAsync({
        base64: true,
        quality: 0.5,
        aspect: [1, 1]
      })

      if (resultado.canceled) {
        Alert.alert("Cancelado", "Accion cancelada")
        return
      }

      setFotoBase64(resultado.assets[0].base64 ?? null);

    } catch (error) {
      Alert.alert("Error", "Error al tomar la foto")
    }
  }

  const manejarGuardar = async () => {
    if (!validarCamposObligatorios()) return;

    const exito = await addProducto({ nombre, categoria, fotoBase64, precio: parseFloat(precio), codigoBarras });

    if (exito) {
      Alert.alert("Éxito", "Producto guardado correctamente");
      limpiarYVolver();
    } else {
      Alert.alert("Error", "No se pudo guardar el producto");
    }

  }

  const abrirScanner = async () => {
    if (!permission?.granted) {
      const resultado = await requestPermission();
      if (!resultado.granted) {
        Alert.alert("Permiso denegado", "Necesitas dar acceso a la cámara para escanear");
        return;
      }
    }
    setScannerVisible(true);
  }
  const manejarCodigoEscaneado = ({ data }: { data: string }) => {
    setCodigoBarras(data);
    setScannerVisible(false);
  }

  return (
    <SafeAreaView style={styles.safe}>

      <Modal visible={scannerVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: BG }}>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={manejarCodigoEscaneado}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "code128", "code39"],
            }}
          />
          <TouchableOpacity
            style={styles.cerrarScannerBtn}
            onPress={() => setScannerVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color={ACCENT_2} />
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.titulo}>Nuevo Producto</Text>
            <Text style={styles.subtitulo}>Completa los datos del producto</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setnombre}
              placeholder='ejm: Mouse'
              placeholderTextColor="#4d4d5e"
              keyboardType='default'
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Precio</Text>
            <TextInput
              style={styles.input}
              value={precio}
              onChangeText={setPrecio}
              placeholder='ejm: 15.02'
              placeholderTextColor="#4d4d5e"
              keyboardType='number-pad'
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
                style={styles.picker}
                dropdownIconColor={ACCENT}
              >
                <Picker.Item label='Selecciona una opcion' value="" color="#000000" />
                <Picker.Item label='Electronica' value="Electronica" color="#000000" />
                <Picker.Item label='Accesorios informatica' value="Accesorios Informatica" color="#000000" />
                <Picker.Item label='Deporte' value="Deporte" color="#000000" />
                <Picker.Item label='Ropa' value="Ropa" color="#000000" />
                <Picker.Item label='Herramientas' value="Herramientas" color="#000000" />
                <Picker.Item label='Snacks' value="Snacks" color="#000000" />
                <Picker.Item label='Otro...' value="Otro..." color="#000000" />
              </Picker>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Codigo Barra</Text>
              <TextInput
                style={styles.input}
                value={codigoBarras ?? ''}
                onChangeText={setCodigoBarras}
                placeholder='Utiliza el boton escanear para llenar'
                placeholderTextColor="#4d4d5e"
                editable={false} 
                
              />
            </View>
          </View>

          <View style={styles.imageContainer}>
            {fotoBase64 ? (
              <Image
                style={styles.image}
                source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }}
              />
            ) : (
              <View style={styles.sinImagen}>
                <Ionicons name="image-outline" size={24} color="#4d4d5e" />
                <Text style={styles.sinImagenTexto}>Sin imagen</Text>
              </View>
            )}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={tomarFoto}>
              <Ionicons name='camera' size={22} color={ACCENT} />
              <Text style={styles.actionText}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={abrirScanner}>
              <Ionicons name='scan' size={22} color={ACCENT} />
              <Text style={styles.actionText}>Scanear barras</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={[styles.bottomButton, styles.cancelButton]} onPress={limpiarYVolver}>
            <Ionicons name='close' size={22} color={ACCENT_2} />
            <Text style={[styles.bottomButtonText, { color: ACCENT_2 }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bottomButton, styles.saveButton]} onPress={manejarGuardar}>
            <Ionicons name='save' size={22} color={BG} />
            <Text style={[styles.bottomButtonText, { color: BG }]}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
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
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: ACCENT,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#1c1c28',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#ffffff',
  },
  pickerWrapper: {
    backgroundColor: '#1c1c28',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    color: '#ffffff',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  sinImagen: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#1c1c28',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    gap: 4,
  },
  sinImagenTexto: {
    fontSize: 10,
    color: '#4d4d5e',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 14,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 11,
    color: '#9d9dae',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  bottomButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  bottomButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#1c1c28',
    borderWidth: 1,
    borderColor: ACCENT_2,
  },
  saveButton: {
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  cerrarScannerBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});