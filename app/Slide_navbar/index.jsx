import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Importar AsyncStorage
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const SlideNavbar = ({onClose }) => {
  const router = useRouter();

  const menuItems = [
    { id: 1, title: "Productos", subtitle: null },
    { id: 2, title: "Productos desactivados", subtitle: null },
    { id: 5, title: "Log-out", subtitle: null },
  ];

  const GestorDeEventos = async (item) => {
    if (onClose) onClose();
    
    if (item.title === 'Productos') {
      router.push('/Slide_products');
    } else if (item.title === 'Log-out') {
      // --- BORRAR TOKEN Y REDIRIGIR ---
      try {
        await AsyncStorage.removeItem('userToken'); // Borrar token
        router.replace('/Slide_login'); // Redirigir a login
      } catch (err) {
        console.error('Error al cerrar sesión:', err);
      }
    } else if (item.title === 'Productos desactivados'){
      router.push('/Slide_productos_desactivados');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Botón de cerrar */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.flechaIcono}>←</Text>
        </TouchableOpacity>

        {/* Línea superior */}
        <View style={styles.divider} />

        {/* Menú Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => GestorDeEventos(item)}
              >
                <Text style={styles.menuTxt}>{item.title}</Text>
              </TouchableOpacity>

              {/* Analizando los Subtítulos (subsecciones)*/}
              {item.subtitle && (
                <View style={styles.submenuContainer}>
                  {item.subtitle.map((sub, subIndex) => (
                    <TouchableOpacity 
                      key={subIndex} 
                      style={styles.submenuItem}
                      onPress={() => console.log('Submenu:', sub)}
                    >
                      <Text style={styles.submenuTxt}>{sub}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Líneas divisoras */}
              {index < menuItems.length - 1 && (
                <View style={styles.menuDivider} />
              )}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    width: 172,
    height: "100%",
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 18,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  flechaIcono: {
    fontSize: 24,
    color: "#006FFD",
    fontWeight: "600",
  },
  divider: {
    width: 136,
    height: 2,
    backgroundColor: "#000000",
    marginLeft: 18,
    marginTop: 45,
    marginBottom: 6,
  },
  menuContainer: {
    paddingHorizontal: 18,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuTxt: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    letterSpacing: 0.5,
  },
  submenuContainer: {
    paddingLeft: 10,
    paddingTop: 2,
  },
  submenuItem: {
    paddingVertical: 6,
  },
  submenuTxt: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000000",
    letterSpacing: 0.25,
  },
  menuDivider: {
    width: 136,
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 4,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", 
  },
});

export default SlideNavbar;
