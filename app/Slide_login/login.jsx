import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage"; 
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
        const token = response.data.accessToken;
        
        // Guardamos el token
        await AsyncStorage.setItem('userToken', token);
        //console.log("Token guardado correctamente:");
        
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              
              <LoginBox 
                onSubmit={handleLogin} 
                isLoading={isLoading} 
                errorMessage={errorMessage} 
              />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },
  logo: {
    marginBlock: 20,
  }, 
  safeArea: {
    flex: 1,
    backgroundColor: "#006FFD",
  },
});