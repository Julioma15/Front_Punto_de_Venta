import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// Recibimos isLoading y errorMessage como props
export default function LoginBox({ onSubmit, isLoading, errorMessage }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLoginPress = () => {
    if (!user.trim() || !pass.trim()) {
      Alert.alert("Campos incompletos", "Por favor ingresa usuario y contraseña.");
      return;
    }
    onSubmit(user, pass); 
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
            autoCapitalize="none" // Importante para usuarios
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="grey"
            secureTextEntry
            value={pass}
            onChangeText={setPass}
          />
        </View>
        
        {/* SECCIÓN DE ERROR: Solo se muestra si hay un mensaje de error */}
        {errorMessage ? (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.button,
            (user && pass && !isLoading) ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
          onPress={handleLoginPress}
          disabled={!user || !pass || isLoading} // Deshabilitado si carga o faltan datos
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          )}
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