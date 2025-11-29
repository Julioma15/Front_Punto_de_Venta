import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios'; // Importamos axios
import LoginBox from "../../components/ui/LoginBox";

export default function LoginScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(25)).current;

  // Estados para manejar la carga y los errores
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async (username, password) => {
    setIsLoading(true);     // 1. Activar estado de carga
    setErrorMessage("");    // 2. Limpiar errores previos

    try {
      // 3. Petición al Backend con los datos exactos que me diste
      const response = await axios.post('https://punto-de-venta-dqx2.onrender.com/users/logIn', {
        username: username,
        password: password
      });

      // 4. Si el status es 200, el login fue exitoso
      if (response.status === 200) {
        // Aquí recibes el { accessToken: "..." }
        // Podrías guardarlo si lo necesitas luego: console.log(response.data.accessToken);
        
        router.replace("/Slide_products"); // Navegación permitida
      }

    } catch (error) {
      console.log(error);
      // 5. Manejo de errores basado en tu Postman
      if (error.response) {
        // El servidor respondió algo diferente a 2xx
        if (error.response.status === 401) {
          setErrorMessage("Credenciales incorrectas. Verifique usuario y contraseña.");
        } else {
          setErrorMessage("Ocurrió un error en el servidor. Intente más tarde.");
        }
      } else if (error.request) {
        // No hubo respuesta (problema de red)
        setErrorMessage("Error de conexión. Verifique su internet.");
      } else {
        setErrorMessage("Error inesperado al intentar ingresar.");
      }
    } finally {
      setIsLoading(false); // 6. Desactivar carga termine bien o mal
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.ellipse} />

        <Animated.View
          style={{
            transform: [{ translateY: translateAnim }],
            opacity: fadeAnim,
            alignItems: "center",
          }}
        >
          <Image source={require("../assets/images/logo-globo.png")} style={styles.logo} />
          
          {/* Pasamos los nuevos props al componente visual */}
          <LoginBox 
            onSubmit={handleLogin} 
            isLoading={isLoading} 
            errorMessage={errorMessage} 
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  ellipse: {
    position: "absolute",
    width: 450,
    height: 450,
    backgroundColor: "#80deea66",
    borderRadius: 250,
    top: "25%",
    // filter: "blur(30px)", // Nota: filter no siempre funciona en Native puro, cuidado aquí
  },
  logoBottom: {
    width: 200,
    height: 260,
    resizeMode: "contain",
    position: "absolute",
    bottom: -40,
  },
  logo: {
    marginBlock: 20,
  }, 
  safeArea: {
    flex: 1,
    backgroundColor: "#006FFD",
  },
});