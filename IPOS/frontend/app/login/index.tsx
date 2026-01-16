import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://192.168.1.14:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message);
        return;
      }

      const userRole = data.user.role;
      if (userRole === "admin") {
        router.replace("/admin/dashboard");
      } else if (userRole === "user") {
        router.replace("/user/dashboard" as any);
      } else {
        Alert.alert("Error", "Role tidak dikenali");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Server tidak dapat dihubungi");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
          }}
          style={styles.image}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.imageOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>IPOS</Text>
            <Text style={styles.heroSubtitle}>Login untuk melanjutkan</Text>
          </View>
        </ImageBackground>

        <View style={styles.card}>
          <Text style={styles.title}>Masuk</Text>
          <Text style={styles.subtitle}>
            Gunakan email dan password untuk masuk ke akun Anda.
          </Text>

          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#888" />
            <TextInput
              placeholder="Masukkan email Anda"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputField}
              placeholderTextColor="#aaa"
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" />
            <TextInput
              placeholder="Masukkan password Anda"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.inputField}
              placeholderTextColor="#aaa"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#888"
              />
            </Pressable>
          </View>

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Lupa password?</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Masuk</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Belum punya akun?</Text>
            <Link href="/register" style={styles.signupLink}>
              Daftar Sekarang
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  image: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.35,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "400",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginTop: -28,
    marginHorizontal: 20,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "#f8f8f8",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#e8e8e8",
  },
  inputField: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 12,
    fontSize: 15,
    color: "#1a1a1a",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginLeft: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    color: "#999",
    fontSize: 13,
    marginHorizontal: 16,
    fontWeight: "500",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "#666",
    fontSize: 14,
    marginRight: 6,
  },
  signupLink: {
    color: "#1a1a1a",
    fontSize: 14,
    fontWeight: "700",
  },
});
