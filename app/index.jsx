import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import SlideNavbar from './Slide_navbar/index';

const API_BASE_URL = 'https://punto-de-venta-dqx2.onrender.com';

const SlideProductos = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoActivo, setProductoActivo] = useState(true);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const params = useLocalSearchParams();

  // ----------- CARGAR PRODUCTOS (CON TOKEN) -----------
  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setError("No estás autenticado");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/productos/mostrar`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Productos cargados:", response.data);

      if (!response.data.products || !Array.isArray(response.data.products)) {
        setProductos([]);
        setError("No hay productos disponibles");
        return;
      }

      const productosFormateados = response.data.products.map(p => ({
        id: p[0],
        product_name: p[1],
        barcode: p[2],
        price: p[3],
        stock: p[4],
        createdAt: p[5],
        status: p[6],
        imagen_url: p[7] ? `${API_BASE_URL}${p[7]}` : null,
      }));

      setProductos(productosFormateados);

    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  // ----------- OBTENER PRODUCTO POR ID -----------
  const obtenerProductoPorId = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await axios.get(`${API_BASE_URL}/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data;

    } catch (err) {
      console.error("Error al obtener producto:", err);
      return null;
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarProductos();
    setRefreshing(false);
  };

  const goAgregar = () => {
    router.push('/Slide_agregar');
  };

  const abrirOpciones = (producto) => {
    setProductoSeleccionado(producto);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setProductoSeleccionado(null);
  };

  useEffect(() => {
    if (params?.newProduct) {
      try {
        JSON.parse(params.newProduct);
        cargarProductos();
      } catch {}
    }
  }, [params?.newProduct]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>

        {/* NAVBAR */}
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

        {/* ---- CONTENIDO ---- */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#006FFD" />
            <Text style={styles.loadingText}>Cargando productos...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>😕 {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={cargarProductos}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : productos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📦 No hay productos disponibles</Text>
            <Text style={styles.emptySubtext}>Agrega tu primer producto</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.productosContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#006FFD"]} tintColor="#006FFD" />
            }
          >
            {productos.map((producto) => (
              <TouchableOpacity
                key={producto.id}
                style={styles.productoCard}
                onPress={() => router.push(`/Detalles_producto?id=${producto.id}`)}
              >

                {/* ----------- IMAGEN ----------- */}
                {producto.imagen_url ? (
                  <Image
                    source={{ uri: producto.imagen_url }}
                    style={styles.productoImagen}
                  />
                ) : (
                  <View style={styles.placeholderImagen}>
                    <Text style={styles.placeholderText}>📦</Text>
                  </View>
                )}

                {/* ----------- INFO ----------- */}
                <View style={styles.productoInfo}>
                  <Text style={styles.productoNombre} numberOfLines={1}>
                    {producto.product_name}
                  </Text>
                  <Text style={styles.productoStock}>
                    Stock: {producto.stock}
                  </Text>
                </View>

                {/* ----------- PRECIO ----------- */}
                <Text style={styles.productoPrecio}>
                  ${producto.price}
                </Text>

                {/* ----------- FLECHA ----------- */}
                <TouchableOpacity onPress={() => abrirOpciones(producto)}>
                  <Text style={styles.flechaIcono}>›</Text>
                </TouchableOpacity>

              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* BOTÓN AGREGAR */}
        <TouchableOpacity onPress={goAgregar} style={styles.btnAgregar}>
          <Text style={styles.agregarIcono}>+</Text>
        </TouchableOpacity>

        <View style={styles.bgDecoration} />

        {/* MODAL DE OPCIONES */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={cerrarModal}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={cerrarModal}>
            <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
              <View style={styles.opcionRow}>
                <TouchableOpacity
                  style={[styles.toggle, productoActivo && styles.toggleActive]}
                  onPress={() => setProductoActivo(!productoActivo)}
                >
                  <View style={[styles.toggleCircle, productoActivo && styles.toggleCircleActive]} />
                </TouchableOpacity>
                <Text style={styles.opcionTxt}>Desactivar producto</Text>
              </View>

              <TouchableOpacity
                style={styles.opcionRow}
                onPress={() => {
                  cerrarModal();
                  router.push(`/Detalles_producto?id=${productoSeleccionado?.id}`);
                }}
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

              <TouchableOpacity style={styles.btnCancelar} onPress={cerrarModal}>
                <Text style={styles.btnCancelarTxt}>Cancelar</Text>
              </TouchableOpacity>

            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* MENÚ LATERAL */}
        <Modal animationType="slide" transparent={true} visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
          <View style={styles.menuModalContainer}>
            <SlideNavbar onClose={() => setMenuVisible(false)} />
            <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)} />
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
  },
  productoImagen: {
    width: 75,
    height: 75,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    resizeMode: 'cover',
  },
  productoInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  productoNombre: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  productoStock: {
    fontSize: 12,
    color: "#666666",
  },
  productoPrecio: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginRight: 8,
  },
  flechaIcono: {
    fontSize: 20,
    color: "#CCCCCC",
    marginRight: 12,
  },
  btnAgregar: {
    position: "absolute",
    bottom: 40,
    right: 40,
    width: 64,
    height: 64,
    backgroundColor: "#006FFD",
    borderRadius: 32,
    shadowColor: "#006FFD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  agregarIcono: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "300",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo negro semi-transparente
    justifyContent: "flex-end", // Modal en la parte inferior
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20, // Bordes redondeados arriba
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
    backgroundColor: "#B0BEC5", // Gris cuando está OFF
    padding: 2,
    justifyContent: "center",
    marginRight: 16,
  },
  toggleActive: {
    backgroundColor: "#1976D2", // Azul cuando está ON
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
    elevation: 3, // Sombra en Android
  },
  toggleCircleActive: {
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
    backgroundColor: "#1976D2", // Azul
    borderRadius: 1,
  },
  opcionTxt: {
    fontSize: 16,
    fontWeight: "400",
    color: "#1976D2", // Azul
  },
  btnCancelar: {
    backgroundColor: "#BBDEFB", // Azul claro
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  btnCancelarTxt: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1976D2", // Azul oscuro
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
    backgroundColor: "#006FFD", //Color del navbar
  },
});

export default SlideProductos;
