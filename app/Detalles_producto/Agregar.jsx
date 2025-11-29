import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import SlideNavbar from '../Slide_navbar/index';

const AgregarProducto = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [menuVisible, setMenuVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [precio, setPrecio] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imagenUri, setImagenUri] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a las imágenes.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      setImagenUri(uri);
    }
  };

  const onAdd = () => {
    if (!nombre.trim()) {
      Alert.alert('Faltan datos', 'El nombre del producto es obligatorio.');
      return;
    }
    const producto = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      stock: Number(stock) || 0,
      precio: Number(precio) || 0,
      barcode: barcode.trim(),
      imagen: imagenUri || null,
    };

    router.replace({ pathname: '/Slide_products', params: { newProduct: JSON.stringify(producto) } });
  };

  const onBack = () => {
    router.replace('/Slide_products');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.menuIcon} onPress={() => setMenuVisible(true)}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>

        <Text style={styles.logo}>TUUDU</Text>

        <View style={styles.profile}>
          <View style={styles.profileCircle} />
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: 10, paddingBottom: insets.bottom + 20 }]}>
        
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.headerLeft}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Agregar producto</Text>
          </View>

          <View style={styles.headerRight} />
        </View>

        
        <View style={styles.card}>
          <Text style={styles.label}>Producto</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del producto"
            placeholderTextColor="#9aa4b2"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Descripción"
            placeholderTextColor="#9aa4b2"
            multiline
          />

          <Text style={styles.label}>Imagen</Text>
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {imagenUri ? (
              <Image source={{ uri: imagenUri }} style={styles.image} />
            ) : (
              <Text style={styles.imageText}>Seleccionar imagen ↑</Text>
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#9aa4b2"
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Precio</Text>
              <TextInput
                style={styles.input}
                value={precio}
                onChangeText={setPrecio}
                keyboardType="numeric"
                placeholder="$0.00"
                placeholderTextColor="#9aa4b2"
              />
            </View>
          </View>

          <Text style={styles.label}>BarCode</Text>
          <TextInput
            style={styles.input}
            value={barcode}
            onChangeText={setBarcode}
            placeholder=""
            placeholderTextColor="#9aa4b2"
          />

          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <Text style={styles.addBtnText}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal del Menú Lateral (SlideNavbar) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuModalContainer}>
          <SlideNavbar onClose={() => setMenuVisible(false)} />
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#006FFD', 
  },
  navbar: {
    backgroundColor: '#006FFD',
    height: 80,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  menuIcon: {
    gap: 6,
  },
  menuLine: {
    width: 30,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    position: 'absolute',
    left: '50%',
    marginLeft: -54,
  },
  profile: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCircle: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
  },

  scrollContent: {
    paddingHorizontal: 18,
  },

  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  headerLeft: { width: 40, alignItems: 'flex-start' },
  headerIcon: { color: '#ffffffff', fontSize: 22 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#ffffffff', fontSize: 18, fontWeight: '700' },
  headerRight: { width: 80, alignItems: 'flex-end' },

  card: {
    backgroundColor: '#eef3fb',
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },

  label: { fontSize: 13, color: '#333', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 0.6,
    borderColor: '#d6dbe6',
    color: '#111',
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  imageBox: {
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.6,
    borderColor: '#d6dbe6',
    marginBottom: 12,
  },
  imageText: { color: '#666' },
  image: { width: '100%', height: '100%', borderRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },

  addBtn: {
    backgroundColor: '#0A6CFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: { color: '#fff', fontWeight: '600' },

  
  menuModalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default AgregarProducto;