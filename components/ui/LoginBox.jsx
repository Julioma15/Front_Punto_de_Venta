import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
// 1. Importamos los iconos
import { Ionicons } from '@expo/vector-icons';

export default function LoginBox({ onSubmit, isLoading, errorMessage }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  
  // 2. Nuevo estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginPress = () => {
    if (!user.trim() || !pass.trim()) {
      Alert.alert("Campos incompletos", "Por favor ingresa usuario y contraseña.");
      return;
    }
    onSubmit(user, pass);
  };

  // Función para alternar el estado del ojito
  const toggleShowPassword = () => {
      setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>INICIO DE SESIÓN</Text>
        </View>

        <View style={styles.inputsWrapper}>
          {/* Input de Usuario (sigue igual) */}
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="grey"
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />

          {/* 3. Input de Contraseña MODIFICADO */}
          {/* Creamos un contenedor para el input y el icono */}
          <View style={styles.passwordContainer}>
              <TextInput
                  style={styles.passwordInputInternal} // Nuevo estilo interno
                  placeholder="Contraseña"
                  placeholderTextColor="grey"
                  // Si showPassword es false, secureTextEntry es true (oculto)
                  secureTextEntry={!showPassword} 
                  value={pass}
                  onChangeText={setPass}
              />
              {/* El botón del ojito */}
              <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
                  <Ionicons 
                      // Cambia el icono dinámicamente entre ojo abierto y cerrado
                      name={showPassword ? "eye" : "eye-off"} 
                      size={24} 
                      color="grey" 
                  />
              </TouchableOpacity>
          </View>

        </View>

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
          disabled={!user || !pass || isLoading}
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
    elevation: 5,
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

  // Estilo para el input normal de usuario
  input: {
    width: 260,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 260,
      height: 50,
      backgroundColor: "#FFF",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#DDD",
      paddingHorizontal: 14,
  },
  
  passwordInputInternal: {
      flex: 1,
      height: '100%',
  },
  
  eyeIcon: {
      padding: 5,
  },


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
    height: 50,
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