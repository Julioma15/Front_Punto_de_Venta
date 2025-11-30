import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export const SlideDetalles = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '0001',
    producto: 'Sabritas Original',
    descripcion: 'Sabritas Original 18gr',
    stock: '32',
    precio: '22.00',
    barcode: '784222156864',
    imagen: null
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, imagen: result.assets[0].uri });
    }
  };

  const handleAgregar = () => {
    console.log('Producto agregado:', formData);
    // Aquí agregarías la lógica para guardar el producto
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#006FFD" }} edges={['top']}>
      <View style={styles.container}>
        {/* Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>
          
          <Text style={styles.logo}>TUUDU</Text>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ID</Text>
            <TextInput
              style={styles.input}
              value={formData.id}
              onChangeText={(text) => handleChange('id', text)}
              placeholder="0001"
            />
          </View>

          {/* Producto */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Producto</Text>
            <TextInput
              style={styles.input}
              value={formData.producto}
              onChangeText={(text) => handleChange('producto', text)}
              placeholder="Nombre del producto"
            />
          </View>

          {/* Descripción */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              value={formData.descripcion}
              onChangeText={(text) => handleChange('descripcion', text)}
              placeholder="Descripción del producto"
            />
          </View>

          {/* Imagen y Stock (lado a lado) */}
          <View style={styles.rowContainer}>
            {/* Imagen */}
            <View style={styles.imagenContainer}>
              <Text style={styles.label}>Imagen</Text>
              <TouchableOpacity 
                style={styles.imagenSelector}
                onPress={seleccionarImagen}
              >
                {formData.imagen ? (
                  <Image source={{ uri: formData.imagen }} style={styles.imagenPreview} />
                ) : (
                  <>
                    <Text style={styles.imagenTexto}>Seleccionar imagen</Text>
                    <Text style={styles.uploadIcon}>↑</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Stock y Precio */}
            <View style={styles.rightColumn}>
              {/* Stock */}
              <View style={styles.inputGroupSmall}>
                <Text style={styles.label}>Stock</Text>
                <TextInput
                  style={styles.inputSmall}
                  value={formData.stock}
                  onChangeText={(text) => handleChange('stock', text)}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              {/* Precio */}
              <View style={styles.inputGroupSmall}>
                <Text style={styles.label}>Precio</Text>
                <View style={styles.precioContainer}>
                  <Text style={styles.precioSymbol}>$</Text>
                  <TextInput
                    style={styles.precioInput}
                    value={formData.precio}
                    onChangeText={(text) => handleChange('precio', text)}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* BarCode */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>BarCode</Text>
            <TextInput
              style={styles.input}
              value={formData.barcode}
              onChangeText={(text) => handleChange('barcode', text)}
              placeholder="784222156864"
              keyboardType="numeric"
            />
          </View>

          {/* Botón Agregar */}
          <TouchableOpacity style={styles.btnAgregar} onPress={handleAgregar}>
            <Text style={styles.btnAgregarTexto}>Agregar</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Imagen de fondo decorativa */}
        <View style={styles.bgDecoration} />
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupSmall: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#000000",
  },
  inputSmall: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#000000",
  },
  rowContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  imagenContainer: {
    flex: 1,
  },
  imagenSelector: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imagenTexto: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 8,
  },
  uploadIcon: {
    fontSize: 24,
    color: "#666666",
  },
  imagenPreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  rightColumn: {
    flex: 1,
  },
  precioContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  precioSymbol: {
    fontSize: 14,
    color: "#999999",
    fontWeight: "500",
  },
  precioInput: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
    padding: 0,
  },
  btnAgregar: {
    backgroundColor: "#006FFD",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    marginHorizontal: 60,
    shadowColor: "#006FFD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnAgregarTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
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
});

export default SlideDetalles;