import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  Alert
} from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
  try {
    const res = await fetch('http://10.0.2.2:3000/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert('Error', data.message);
      return;
    }

    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    const userRole = data.user.role;
    if (userRole === 'admin') {
        router.replace("/admin/dashboard");
      } else if (userRole === 'user') {
        router.replace("/user/dashboard");
      } else {
        Alert.alert('Error', 'Role tidak dikenali');
      }

  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Server tidak dapat dihubungi');
  }
};
  

  return (
    <View style={styles.container}>
      {/* IMAGE */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        }}
        style={styles.image}
      />

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Log In</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#999"
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#666"
            />
          </Pressable>
        </View>

        <Link href="/register" style={styles.signup}>
          Sign Up
        </Link>

        <Pressable
          style={styles.button}
          onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "45%",
  },
  card: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "60%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#eee",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  passwordWrapper: {
    backgroundColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  signup: {
    color: "#000",
    marginBottom: 16,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
