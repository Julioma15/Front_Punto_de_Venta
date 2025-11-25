import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginBox({ onSubmit }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLoginPress = () => {
    if (!user.trim() || !pass.trim()) {
      Alert.alert("Campos incompletos", "Por favor ingresa usuario y contraseña.");
      return;
    }

    onSubmit(user, pass); // ← aquí regresa los datos al screen principal
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>INICIO DE SESIÓN</Text>
        </View>

        <View style={styles.inputsWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="grey"
            value={user}
            onChangeText={setUser}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="grey"
            secureTextEntry      // ← Esto hace que sea contraseña
            value={pass}
            onChangeText={setPass}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            user && pass ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
          onPress={handleLoginPress}
          disabled={!user || !pass}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
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

  button: {
    marginTop: 20,
    width: 160,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonEnabled: {
    backgroundColor: "#ABC4FF",
  },

  buttonDisabled: {
    backgroundColor: "#ABC4FF80", // tono clarito cuando está inactivo
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
