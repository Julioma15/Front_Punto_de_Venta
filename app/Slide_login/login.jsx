import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginBox from "../../components/ui/LoginBox";

export default function LoginScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(25)).current;

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

  const handleLogin = (user, pass) => {

    // 🔥 AQUÍ VA TU RUTA FINAL
    // router.replace("/dashboard"); // ← cuando tengas la pantalla lista

    router.replace("/Slide_products"); // o coméntala, depende de tu app
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
          <LoginBox onSubmit={handleLogin} />
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
    marginTop: -40,   // Ajusta según lo que quieras
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
    filter: "blur(30px)",
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
    backgroundColor: "#006FFD", //Color del navbar
  },
});
