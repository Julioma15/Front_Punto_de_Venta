import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductDetails from '../../components/ProductDetails';
import SlideNavbar from '../Slide_navbar/index';
import { getToken } from '../utils/auth';

export default function DetallesProductoPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idParam = params.id || params.id_producto || params.id_product;

  const [menuVisible, setMenuVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // estado del producto (INICIALIZAR VACÍO) - quitada descripción
  const [product, setProduct] = useState({
    id: null,
    name: '',
    stock: 0,
    price: '$ 0.00',
    barcode: '',
    image: require('../assets/images/sabritas_original.png'),
  });

  // campos para editar (se rellenan al entrar en modo edición)
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');

  const API_BASE_URL = 'https://punto-de-venta-dqx2.onrender.com';
  const API_MEDIA_URL = API_BASE_URL;

  const mapFetchedData = (data) => {
    const fetched = data.product;
    if (!Array.isArray(fetched)) return null;

    const id = fetched[0];
    const name = fetched[1];
    const barcode = fetched[2];
    const price = fetched[3];
    const stock = fetched[4];
    const imageUrl = fetched[7];

    return {
      id: String(id),
      name: name || '',
      stock: Number(stock ?? 0),
      price: `$ ${Number(price ?? 0).toFixed(2)}`,
      barcode: barcode || '',
      image: imageUrl ? { uri: API_MEDIA_URL + imageUrl } : require('../assets/images/sabritas_original.png'),
    };
  };

  const fetchProductDetails = async () => {
    if (!idParam) {
      Alert.alert('Error de Navegación', 'ID de producto no especificado.');
      setIsLoading(false);
      router.back();
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) {
        Alert.alert('Error de autenticación', 'No se encontró el token. Inicia sesión de nuevo.');
        router.replace('/Slide_login');
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/productos/${idParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.product) {
        const mapped = mapFetchedData(res.data);
        if (mapped) setProduct(mapped);
        else Alert.alert('Error', 'Respuesta del servidor inválida.');
      } else {
        Alert.alert('Error', 'Producto no encontrado o respuesta vacía.');
      }
    } catch (err) {
      console.error('Error al cargar producto:', err.response?.data || err.message);
      Alert.alert('Error', 'No se pudo cargar la información del producto.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [idParam]);

  const openEdit = () => {
    setName(product.name || '');
    const numericPrice = String(product.price || '').replace(/[^0-9.,]/g, '').replace(',', '.');
    setPrice(numericPrice);
    setStock(String(product.stock ?? '0'));
    setBarcode(product.barcode || '');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = async () => {
    if (!name.trim()) {
      Alert.alert('Faltan datos', 'El nombre del producto es obligatorio.');
      return;
    }
    const validatedPrice = Number(price);
    const validatedStock = Number(stock);

    if (isNaN(validatedPrice) || validatedPrice < 0) {
      Alert.alert('Error', 'El precio debe ser un número válido.');
      return;
    }
    if (isNaN(validatedStock) || validatedStock < 0 || !Number.isInteger(validatedStock)) {
      Alert.alert('Error', 'El stock debe ser un número entero válido.');
      return;
    }
    if (!barcode.trim()) {
      Alert.alert('Faltan datos', 'El código de barras es obligatorio.');
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error de autenticación', 'No se encontró el token. Inicia sesión de nuevo.');
        router.replace('/Slide_login');
        return;
      }

      const payload = {
        product_name: name.trim(),
        price: Number(validatedPrice).toFixed(2),
        stock: validatedStock,
        barcode: barcode.trim(),
      };

      const res = await axios.patch(`${API_BASE_URL}/productos/${idParam}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200 || res.status === 204) {
        setProduct(prev => ({
          ...prev,
          name: payload.product_name,
          stock: payload.stock,
          price: `$ ${Number(payload.price).toFixed(2)}`,
          barcode: payload.barcode,
        }));
        Alert.alert('Éxito', 'Producto actualizado correctamente.');
        setIsEditing(false);
      } else {
        Alert.alert('Error', 'Respuesta inesperada del servidor al actualizar.');
      }
    } catch (err) {
      console.error('Error actualizar producto:', err.response?.data || err.message);
      let msg = 'Error al actualizar el producto.';
      if (err.response) {
        if (err.response.status === 401) {
          msg = 'Token inválido o expirado.';
          router.replace('/Slide_login');
        } else if (err.response.data?.error) {
          msg = err.response.data.error;
        }
      } else if (err.request) {
        msg = 'Error de conexión. Verifica tu red.';
      }
      Alert.alert('Error', msg);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.menuIcon} onPress={() => setMenuVisible(true)}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>

          <Text style={styles.logo}>TUUDU</Text>

          <TouchableOpacity style={styles.editButton} onPress={openEdit}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 18 }}>Cargando detalles...</Text>
          ) : product.id === null ? (
            <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 18 }}>Producto no encontrado.</Text>
          ) : !isEditing ? (
            <ProductDetails product={product} onBack={() => router.back()} />
          ) : (
            <ScrollView contentContainerStyle={styles.editForm}>
              <Text style={styles.label}>Producto</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre" />

              <Text style={styles.label}>Stock</Text>
              <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" />

              <Text style={styles.label}>Precio</Text>
              <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="decimal-pad" />

              <Text style={styles.label}>BarCode</Text>
              <TextInput style={styles.input} value={barcode} onChangeText={setBarcode} />

              <View style={styles.editActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                  <Text style={styles.saveText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>

        {/* SlideNavbar modal */}
        <Modal
          animationType="slide"
          transparent
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <View style={styles.menuModalContainer}>
            <SlideNavbar onClose={() => setMenuVisible(false)} />
            <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)} />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#006FFD',
  },
  container: {
    flex: 1,
    backgroundColor: '#EDF2FB',
    width: '100%',
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
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },

  editForm: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  label: { fontSize: 13, color: '#333', marginBottom: 6, marginTop: 6 },
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

  editActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  cancelBtn: { backgroundColor: '#BBB', padding: 12, borderRadius: 10, flex: 1, marginRight: 8, alignItems: 'center' },
  cancelText: { color: '#fff', fontWeight: '600' },
  saveBtn: { backgroundColor: '#0A6CFF', padding: 12, borderRadius: 10, flex: 1, marginLeft: 8, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },

  /* Modal / overlay */
  menuModalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});