import { View, Text, TextInput, StyleSheet, Image, Pressable,} from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../components/customAlert";


export default function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'error' as 'success' | 'error' | 'warning',
    title: '',
    onConfirm: undefined as (() => void) | undefined
  });

  const showAlert = (type: 'success' | 'error' | 'warning', title: string, onConfirm?: () => void) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      onConfirm
    });
  };

  const handleRegister = async () => {
    if (!nama || !noTelepon || !email || !password || !confirmPassword) {
      showAlert("error", "Semua field wajib diisi");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("error", "Password tidak sama");
      return;
    }

    try {
      const res = await fetch("http://10.0.2.2:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          no_telepon: noTelepon,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert("error", data.message || "Register gagal");
        return;
      }

      // Berhasil Register
      showAlert("success", "Akun berhasil dibuat", () => {
        router.replace("/login");
      });

    } catch (err) {
      console.error(err);
      showAlert("error", "Server tidak dapat dihubungi");
    }
  };

  return (
    <View style={styles.container}>
      {/* Komponen CustomAlert */}
      <CustomAlert 
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        onConfirm={() => {
          if (alertConfig.onConfirm) {
            alertConfig.onConfirm();
          }
          setAlertConfig({ ...alertConfig, visible: false });
        }}
      />

      <Image
        source={{ uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" }}
        style={styles.image}
      />

      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          placeholder="Nama Lengkap"
          value={nama}
          onChangeText={setNama}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TextInput
          placeholder="No Telepon"
          value={noTelepon}
          onChangeText={setNoTelepon}
          keyboardType="phone-pad"
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
            placeholderTextColor="#999"
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#666"
            />
          </Pressable>
        </View>

        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            placeholderTextColor="#999"
          />
        </View>

        <Link href="/login" style={styles.signup}>
          Already have an account? Log In
        </Link>

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
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
    marginBottom: 12,
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
    cursor: "pointer",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
