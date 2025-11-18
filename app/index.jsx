import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Dimensions } from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      router.replace("/Slide_login/login");
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      {/* FONDO DE CÍRCULOS */}
      <Image
        source={require("../app/assets/images/circulos-marco.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* CONTENIDO ANIMADO */}
      <Animated.View style={[styles.centerGroup, {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
      }]}>
        
        <Text style={styles.title}>TUUDU</Text>

        <Image
          source={require("../app/assets/images/kiosco-logo.png")}
          style={styles.kiosko}
        />

        {/* Punto indicador */}
        <Text style={styles.dots}>● ● ●</Text>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
    top: 0,
    left: 0,
  },

  centerGroup: {
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 42,
    fontWeight: "900",
    marginBottom: 20,
    textShadowColor: "#00000040",
    textShadowRadius: 4,
  },

  kiosko: {
    width: 180,
    height: 240,
    resizeMode: "contain",
    marginVertical: 15,
  },

  dots: {
    marginTop: 20,
    fontSize: 30,
    opacity: 0.7,
  },
});
