import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import LoginBox from "../../components/ui/LoginBox";

export default function LoginScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(25)).current;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    Animated.timing(translateAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post('https://punto-de-venta-dqx2.onrender.com/users/logIn', {
        username: username,
        password: password
      });

      if (response.status === 200) {
        // --- AQUÍ GUARDAMOS EL TOKEN ---
        const token = response.data.accessToken;
        
        // 'userToken' es la llave con la que lo guardamos. 
        await SecureStore.setItemAsync('userToken', token);
        
        console.log("Token guardado con éxito:", token); // Para verificar en consola

        router.replace("/Slide_products");
      }

    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Credenciales incorrectas. Verifique usuario y contraseña.");
        } else {
          setErrorMessage("Ocurrió un error en el servidor. Intente más tarde.");
        }
      } else if (error.request) {
        setErrorMessage("Error de conexión. Verifique su internet.");
      } else {
        setErrorMessage("Error inesperado al intentar ingresar.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.ellipse} />
        <Animated.View style={{ transform: [{ translateY: translateAnim }], opacity: fadeAnim, alignItems: "center" }}>
          <Image source={require("../assets/images/logo-globo.png")} style={styles.logo} />
          <LoginBox onSubmit={handleLogin} isLoading={isLoading} errorMessage={errorMessage} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 310,
    backgroundColor: "#F9F8F6",
    borderRadius: 25,
    alignItems: "center",
    paddingBottom: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Sombra para Android
  },

  header: {
    backgroundColor: "#ABC4FF",
    width: 310,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  headerText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 22,
  },

  inputsWrapper: {
    marginTop: 15,
    width: "100%",
    alignItems: "center",
    gap: 12,
  },

  input: {
    width: 260,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  // Estilos nuevos para el error
  errorContainer: {
    marginTop: 10,
    width: 260,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },

  button: {
    marginTop: 20,
    width: 160,
    height: 50, // Fijar altura para que no baile al cargar
    justifyContent: 'center',
    borderRadius: 16,
    alignItems: "center",
  },

  buttonEnabled: {
    backgroundColor: "#ABC4FF",
  },

  buttonDisabled: {
    backgroundColor: "#ABC4FF80",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 18,
  },

  safeArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});