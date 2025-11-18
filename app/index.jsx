import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";


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
      // cambia a login
      router.replace("/auth/login");
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.ellipse} />

      <Animated.View style={[styles.group, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image source={require("../app/assets/images/kiosco-logo.png")} style={styles.logo} />

        <View style={styles.textGroup}>
          
          <Text style={styles.title}>TUUDU</Text>
        </View>
      </Animated.View>

      <Text style={styles.loading}>. . .</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  ellipse: {
    width: 340,
    height: 340,
    backgroundColor: "#eaf2ff",
    borderRadius: 200,
    filter: "blur(30px)",
    position: "absolute",
  },
  loading: {
    fontSize: 50,
    fontWeight: "900",
    position: "absolute",
    bottom: 120,
  },
  group: {
    position: "absolute",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 180,
    resizeMode: "contain",
  },
  textGroup: {
    alignItems: "center",
    marginTop: -50,
  },
  union: {
    width: 200,
    height: 120,
    resizeMode: "contain",
    position: "absolute",
    top: -25,
  },
  title: {
    fontSize: 50,
    fontWeight: "900",
    textShadowColor: "#00000040",
    textShadowRadius: 4,
  },
});
