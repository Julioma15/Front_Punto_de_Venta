import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import SlideNavbar from '../Slide_navbar/index';

const API_BASE_URL = 'https://punto-de-venta-dqx2.onrender.com';

const SlideProductosDesactivados = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [reactivando, setReactivando] = useState(false);

  const router = useRouter();

  // Función para obtener el token JWT
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token;
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  };

  // Función para cargar productos desactivados (product_state: "Disable")
  const cargarProductosDesactivados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const response = await axios.get(`${API_BASE_URL}/productos/mostrar`, config);
      
      console.log('Productos cargados:', response.data);
      
      // Tu API devuelve: { products: [[id, nombre, barcode, precio, stock, fecha, estado, imagen], ...] }
      const productosArray = response.data.products || [];
      
      // Convertir arrays a objetos
      const productosFormateados = productosArray.map(producto => ({
        id_product: producto[0],
        product_name: producto[1],
        barcode: producto[2],
        price: producto[3],
        quantity: producto[4],
        created_at: producto[5],
        product_state: producto[6],
        image_url: producto[7] ? `${API_BASE_URL}${producto[7]}` : null
      }));
      
      // Filtrar solo productos con product_state: "Disable"
      const productosDesactivados = productosFormateados.filter(
        producto => producto.product_state === "Disable"
      );
      
      console.log('Productos desactivados:', productosDesactivados);
      setProductos(productosDesactivados);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudieron cargar los productos desactivados');
    } finally {
      setLoading(false);
    }
  };

  // Función para reactivar producto (cambiar product_state a "Enable")
  const reactivarProducto = async () => {
    if (!productoSeleccionado) return;

    try {
      setReactivando(true);
      const token = await getToken();
      
      if (!token) {
        Alert.alert('Error', 'No estás autenticado. Por favor inicia sesión.');
        return;
      }

      const productId = productoSeleccionado.id_product || productoSeleccionado.id;
      
      const response = await axios.patch(
        `${API_BASE_URL}/productos/${productId}/product_state`,
        { product_state: "Enable" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Producto reactivado:', response.data);
      
      Alert.alert('Éxito', 'Producto reactivado correctamente');
      
      cerrarModal();
      // Recargar lista de productos desactivados
      await cargarProductosDesactivados();
      
    } catch (err) {
      console.error('Error al reactivar producto:', err);
      Alert.alert('Error', 'No se pudo reactivar el producto. Verifica tu conexión.');
    } finally {
      setReactivando(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductosDesactivados();
  }, []);

  // Recargar productos cada vez que la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      console.log('Pantalla enfocada - Recargando productos desactivados');
      cargarProductosDesactivados();
      
      // Cleanup opcional
      return () => {
        console.log('Pantalla desenfocada');
      };
    }, [])
  );

  // Función para refrescar (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await cargarProductosDesactivados();
    setRefreshing(false);
  };

  const abrirOpciones = (producto) => {
    setProductoSeleccionado(producto);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setProductoSeleccionado(null);
  };

  const irADetalles = () => {
    if (productoSeleccionado) {
      cerrarModal();
      const productId = productoSeleccionado.id_product || productoSeleccionado.id || productoSeleccionado._id;
      router.push(`/Detalles_producto?id=${productId}`);
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
          
          <View style={styles.profile}>
            <View style={styles.profileCircle} />
          </View>
        </View>

        {/* Contenido principal */}
        {loading ? (
          // Pantalla de carga
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#006FFD" />
            <Text style={styles.loadingText}>Cargando productos desactivados...</Text>
          </View>
        ) : error ? (
          // Pantalla de error
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>😕 {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={cargarProductosDesactivados}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : productos.length === 0 ? (
          // Sin productos desactivados
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>✅ No hay productos desactivados</Text>
            <Text style={styles.emptySubtext}>Todos tus productos están activos</Text>
          </View>
        ) : (
          // Lista de productos desactivados
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.productosContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#006FFD"]}
                tintColor="#006FFD"
              />
            }
          >
            {productos.map((producto) => (
              <TouchableOpacity 
                key={producto.id_product || producto.id || producto._id} 
                style={styles.productoCard}
              >
                {/* Imagen del producto */}
                {producto.image_url ? (
                  <Image 
                    source={{ uri: producto.image_url }}
                    style={styles.productoImagen}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderImagen}>
                    <Text style={styles.placeholderText}>📦</Text>
                  </View>
                )}
                
                {/* Badge de desactivado */}
                <View style={styles.badgeDesactivado}>
                  <Text style={styles.badgeText}>Desactivado</Text>
                </View>
                
                {/* Info del producto */}
                <View style={styles.productoInfo}>
                  <Text style={styles.productoNombre} numberOfLines={1}>
                    {producto.product_name || 'Sin nombre'}
                  </Text>
                  <Text style={styles.productoStock}>
                    Stock: {producto.quantity || 0}
                  </Text>
                </View>
                
                {/* Precio */}
                <Text style={styles.productoPrecio}>
                  ${producto.price || '0.00'}
                </Text>
                
                {/* Flecha de opciones */}
                <TouchableOpacity onPress={() => abrirOpciones(producto)}>
                  <Text style={styles.flechaIcono}>›</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* NO hay botón "+" en esta pantalla */}

        {/* Imagen de fondo decorativa */}
        <View style={styles.bgDecoration} />

        {/* Modal de Opciones */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cerrarModal}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1}
            onPress={cerrarModal}
          >
            <TouchableOpacity 
              style={styles.modalContent}
              activeOpacity={1}
            >
              {/* Toggle: Reactivar producto */}
              <TouchableOpacity 
                style={styles.opcionRow}
                onPress={reactivarProducto}
                disabled={reactivando}
              >
                <View style={[styles.toggle, styles.toggleInactive]}>
                  <View style={[styles.toggleCircle, styles.toggleCircleInactive]} />
                </View>
                <Text style={styles.opcionTxt}>
                  {reactivando ? 'Reactivando...' : 'Reactivar producto'}
                </Text>
              </TouchableOpacity>

              {/* Detalles del producto */}
              <TouchableOpacity 
                style={styles.opcionRow} 
                onPress={irADetalles}
              >
                <View style={styles.iconContainer}>
                  <View style={styles.iconoGrid}>
                    <View style={styles.iconoLinea} />
                    <View style={styles.iconoLinea} />
                    <View style={styles.iconoLinea} />
                  </View>
                </View>
                <Text style={styles.opcionTxt}>Detalles del producto</Text>
              </TouchableOpacity>

              {/* Botón Cancelar */}
              <TouchableOpacity style={styles.btnCancelar} onPress={cerrarModal}>
                <Text style={styles.btnCancelarTxt}>Cancelar</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Modal del Menú Lateral (SlideNavbar) */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <View style={styles.menuModalContainer}>
            <SlideNavbar 
              onClose={() => setMenuVisible(false)}
            />
            <TouchableOpacity 
              style={styles.menuOverlay}
              activeOpacity={1}
              onPress={() => setMenuVisible(false)}
            />
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EDF2FB",
    flex: 1,
    width: "100%",
  },
  navbar: {
    backgroundColor: "#006FFD",
    height: 80,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  menuIcon: {
    gap: 6,
  },
  menuLine: {
    width: 30,
    height: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    position: "absolute",
    left: "50%",
    marginLeft: -54,
  },
  profile: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCircle: {
    width: 24,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  productosContainer: {
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 100,
    gap: 20,
  },
  productoCard: {
    width: "100%",
    height: 75,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.8,
  },
  productoImagen: {
    width: 75,
    height: 75,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    opacity: 0.6,
  },
  placeholderImagen: {
    width: 75,
    height: 75,
    backgroundColor: "#E5E7EB",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 32,
    opacity: 0.5,
  },
  badgeDesactivado: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  productoInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  productoNombre: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  productoStock: {
    fontSize: 12,
    color: "#999999",
  },
  productoPrecio: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666666",
    marginRight: 8,
  },
  flechaIcono: {
    fontSize: 20,
    color: "#CCCCCC",
    marginRight: 12,
  },
  bgDecoration: {
    position: "absolute",
    bottom: 120,
    left: "50%",
    marginLeft: -125,
    width: 250,
    height: 400,
    backgroundColor: "rgba(173, 198, 255, 0.2)",
    transform: [{ skewY: "-10deg" }],
    zIndex: -1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    textAlign: "center",
    fontWeight: "600",
  },
  retryButton: {
    backgroundColor: "#006FFD",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 24,
    color: "#10B981",
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#999999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  opcionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#B0BEC5",
    padding: 2,
    justifyContent: "center",
    marginRight: 16,
  },
  toggleInactive: {
    backgroundColor: "#1976D2",
  },
  toggleCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleCircleInactive: {
    alignSelf: "flex-end",
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconoGrid: {
    width: 18,
    height: 18,
    gap: 2,
  },
  iconoLinea: {
    width: 18,
    height: 2,
    backgroundColor: "#1976D2",
    borderRadius: 1,
  },
  opcionTxt: {
    fontSize: 16,
    fontWeight: "400",
    color: "#1976D2",
  },
  btnCancelar: {
    backgroundColor: "#BBDEFB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  btnCancelarTxt: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1976D2",
  },
  menuModalContainer: {
    flex: 1,
    flexDirection: "row",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#006FFD",
  },
});

export default SlideProductosDesactivados;