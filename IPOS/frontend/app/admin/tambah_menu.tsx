import React, { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, SafeAreaView, ActivityIndicator,} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import CustomAlert from "../components/customAlert";

export default function TambahMenu() {
  const router = useRouter();
  
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [kategori, setKategori] = useState("makanan");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'success' as 'success' | 'warning' | 'error',
    title: '',
    onConfirm: undefined as (() => void) | undefined
  });

  const showAlert = (type: 'success' | 'warning' | 'error', title: string, onConfirm?: () => void) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      onConfirm
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleTambah = async () => {
    // Validasi input menggunakan CustomAlert
    if (!nama.trim() || !harga.trim() || !foto || !deskripsi.trim()) {
      showAlert('error', 'Semua kolom dan foto wajib diisi!');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("harga", harga.replace(/\./g, "")); // Bersihkan titik harga
    formData.append("kategori", kategori);
    formData.append("deskripsi", deskripsi);

    const filename = foto.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("foto", {
      uri: foto,
      name: filename,
      type,
    } as any);

    try {
      const response = await fetch("http://10.0.2.2:3000/api/menus/create", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();

      if (response.ok) {
        // Notifikasi Sukses: Hanya tombol OK yang muncul dan kembali ke dashboard
        showAlert('success', 'Menu Berhasil Ditambahkan!', () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          router.back();
        });
      } else {
        showAlert('error', result.message || "Gagal menambahkan menu");
      }
    } catch (error) {
      console.error(error);
      showAlert('error', "Terjadi kesalahan koneksi ke server");
    } finally {
      setLoading(false);
    }
  };

  const formatHarga = (val: string) => {
    if (!val) return "";
    const cleanNumber = val.replace(/\D/g, "");
    return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* INTEGRASI CUSTOM ALERT */}
      <CustomAlert 
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        onConfirm={alertConfig.onConfirm}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tambah Menu</Text>
        </View>

        {/* FORM */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama</Text>
          <TextInput
            style={styles.input}
            value={nama}
            onChangeText={setNama}
            placeholder="Ayam Goyeng"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kategori</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={kategori}
              onValueChange={(itemValue) => setKategori(itemValue)}
            >
              <Picker.Item label="Makanan" value="makanan" />
              <Picker.Item label="Minuman" value="minuman" />
              <Picker.Item label="Dessert" value="dessert" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Harga</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <TextInput
              style={[styles.input, { paddingLeft: 40 }]}
              value={harga}
              keyboardType="numeric"
              onChangeText={(text) => setHarga(formatHarga(text))}
              placeholder="15.000"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={deskripsi}
            onChangeText={setDeskripsi}
            multiline
            numberOfLines={4}
            placeholder="Masukkan deskripsi singkat menu..."
          />
        </View>

        {/* FOTO UPLOAD */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Foto</Text>
          <TouchableOpacity style={styles.filePicker} onPress={pickImage}>
            <Text style={styles.filePickerText}>
              <Text style={{ fontWeight: "bold" }}>Choose File</Text> :{" "}
              {foto ? "Foto Terpilih" : "Belum ada file"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.previewLabel}>Preview :</Text>
          <View style={styles.imagePreviewContainer}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderPreview}>
                <Ionicons name="image-outline" size={32} color="#ccc" />
              </View>
            )}
          </View>
        </View>

        {/* TOMBOL TAMBAH */}
        <TouchableOpacity 
          style={[styles.buttonTambah, loading && { backgroundColor: '#ccc' }]} 
          onPress={handleTambah}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Tambah</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 25 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 15,
  },
  headerTitle: { fontSize: 26, fontWeight: "bold" },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    overflow: "hidden",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  filePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  filePickerText: { fontSize: 14, color: "#333" },
  previewLabel: { marginTop: 10, fontSize: 14, color: "#666" },
  imagePreviewContainer: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  placeholderPreview: {
    alignItems: 'center',
  },
  buttonTambah: {
    backgroundColor: "#1D8F49",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  currencyPrefix: {
    position: 'absolute',
    left: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    zIndex: 1,
  },
});