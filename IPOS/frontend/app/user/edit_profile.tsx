import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../components/customAlert";

const BASE_URL = "http://10.0.2.2:3000";

export default function EditProfile() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [password, setPassword] = useState("");
  const [foto, setFoto] = useState<any>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "success" as "success" | "error",
    title: "",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (userData && token) {
        const user = JSON.parse(userData);

        setNama(user.nama || "");
        setEmail(user.email || "");
        setNoTelepon(user.no_telepon || "");

        if (user.foto) {
          setPreviewUri(`${BASE_URL}/public/avatars/${user.foto}`);
        }

        if (user.id) {
          await fetchServerData(user.id, token);
        } else {
          console.warn("ID tidak ditemukan di storage, silakan login ulang.");
        }
      }
    } catch (error) {
      console.error("Gagal memuat data lokal:", error);
    }
  };

  const fetchServerData = async (id: number, token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/user/profile/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setNama(data.nama || "");
        setEmail(data.email || "");
        setNoTelepon(data.no_telepon || "");
        if (data.foto) {
          setPreviewUri(`${BASE_URL}/public/avatars/${data.foto}`);
        }
        await AsyncStorage.setItem("user", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Gagal ambil data dari server:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0]);
      setPreviewUri(result.assets[0].uri);
    }
  };

  const handleAlertAction = async () => {
    const isSuccess = alertConfig.type === "success";
    setAlertConfig({ ...alertConfig, visible: false });

    if (isSuccess) {
      if (password) {
        await AsyncStorage.clear();
        router.replace("/login");
      } else {
        router.replace("/user/profile");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      if (!userData || !token) return;

      const user = JSON.parse(userData);
      if (!user.id) {
        setAlertConfig({
          visible: true,
          type: "error",
          title: "ID User tidak valid",
        });
        return;
      }
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("email", email);
      formData.append("no_telepon", noTelepon);

      if (password) formData.append("password", password);

      if (foto) {
        const filename = foto.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename!);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append("foto", {
          uri: foto.uri,
          name: filename,
          type,
        } as any);
      }

      const res = await fetch(`${BASE_URL}/api/user/update/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        if (!password) {
          await AsyncStorage.setItem("user", JSON.stringify(data.user));
        }

        setAlertConfig({
          visible: true,
          type: "success",
          title: password
            ? "Password diubah. Silakan login kembali."
            : "Profile Berhasil Diperbarui",
        });
      } else {
        setAlertConfig({
          visible: true,
          type: "error",
          title: data.message || "Gagal memperbarui profil",
        });
      }
    } catch (error) {
      console.error(error);
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Terjadi kesalahan koneksi server",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={handleAlertAction}
        onConfirm={handleAlertAction}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Image
            source={
              previewUri
                ? { uri: previewUri }
                : require("../assets/default-avatar.png")
            }
            style={styles.avatar}
          />
          <View style={styles.topInputs}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={nama}
                onChangeText={setNama}
                placeholder="Username"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
              />
            </View>
          </View>
        </View>

        <View style={styles.fullInput}>
          <Text style={styles.label}>No Telepon</Text>
          <TextInput
            style={[styles.input, { marginBottom: 15 }]}
            value={noTelepon}
            onChangeText={setNoTelepon}
            placeholder="Masukkan nomor telepon"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Password Baru</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Kosongkan jika tidak diubah"
          />
        </View>

        <View style={styles.fileSection}>
          <Text style={styles.labelBold}>Foto</Text>
          <TouchableOpacity style={styles.filePicker} onPress={pickImage}>
            <View style={styles.fileBtn}>
              <Text style={styles.fileBtnText}>Choose File</Text>
            </View>
            <Text style={styles.fileName} numberOfLines={1}>
              : {foto ? foto.fileName || "Gambar Terpilih" : "No File Chosen"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnSubmit} onPress={handleUpdate}>
          <Text style={styles.btnSubmitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", padding: 20, gap: 15 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
  },
  topInputs: { flex: 1, gap: 10 },
  inputGroup: { width: "100%" },
  fullInput: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  labelBold: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    height: 45,
    fontSize: 14,
  },
  fileSection: { marginBottom: 20 },
  filePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
  },
  fileBtn: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  fileBtnText: { fontWeight: "bold" },
  fileName: { paddingHorizontal: 12, color: "#666", flex: 1 },
  btnSubmit: {
    backgroundColor: "#32D74B",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  btnSubmitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
