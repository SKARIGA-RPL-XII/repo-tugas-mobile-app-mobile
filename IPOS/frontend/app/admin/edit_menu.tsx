import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import CustomAlert from "../components/customAlert";

export default function EditMenu() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [kategori, setKategori] = useState("makanan");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [fotoLama, setFotoLama] = useState(""); 
  const [loading, setLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'success' as 'success' | 'warning' | 'error',
    title: '',
    onConfirm: undefined as (() => void) | undefined
  });

  // 1. Ambil data menu lama saat halaman dibuka
  useEffect(() => {
    const getMenuDetail = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:3000/api/menus/${id}`);
        const data = await response.json();
        if (response.ok) {
          setNama(data.nama);
          setHarga(formatHarga(data.harga.toString()));
          setKategori(data.kategori);
          setDeskripsi(data.deskripsi);
          setFotoLama(data.foto);
        }
      } catch (error) {
        showAlert('error', 'Gagal mengambil data menu');
      }
    };
    getMenuDetail();
  }, [id]);

  const showAlert = (type: 'success' | 'warning' | 'error', title: string, onConfirm?: () => void) => {
    setAlertConfig({ visible: true, type, title, onConfirm });
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

  const handleUpdate = async () => {
    if (!nama.trim() || !harga.trim() || !deskripsi.trim()) {
      showAlert('error', 'Nama, Harga, dan Deskripsi wajib diisi!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("harga", harga.replace(/\./g, ""));
    formData.append("kategori", kategori);
    formData.append("deskripsi", deskripsi);

    // Jika user memilih foto baru, tambahkan ke formData
    if (foto) {
      const filename = foto.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : `image`;
      formData.append("foto", {
        uri: foto,
        name: filename,
        type,
      } as any);
    }

    try {
      const response = await fetch(`http://10.0.2.2:3000/api/menus/update/${id}`, {
        method: "PUT", // Gunakan PUT untuk update
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.ok) {
        showAlert('success', 'Menu Berhasil Diperbarui!', () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          router.back();
        });
      } else {
        showAlert('error', 'Gagal memperbarui menu');
      }
    } catch (error) {
      showAlert('error', 'Terjadi kesalahan koneksi');
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
      <CustomAlert 
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        onConfirm={alertConfig.onConfirm}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Menu</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama</Text>
          <TextInput style={styles.input} value={nama} onChangeText={setNama} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kategori</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={kategori} onValueChange={(v) => setKategori(v)}>
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
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Foto</Text>
          <TouchableOpacity style={styles.filePicker} onPress={pickImage}>
            <Text style={styles.filePickerText}>
              <Text style={{ fontWeight: "bold" }}>Ganti File</Text> : {foto ? "Foto Baru" : "Gunakan Foto Lama"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.previewLabel}>Preview :</Text>
          <View style={styles.imagePreviewContainer}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.previewImage} />
            ) : (
              <Image 
                source={{ uri: `http://10.0.2.2:3000/public/menus/${fotoLama}` }} 
                style={styles.previewImage} 
              />
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.buttonUpdate, loading && { backgroundColor: '#ccc' }]} 
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Simpan Perubahan</Text>}
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
  buttonUpdate: {
    backgroundColor: "#2D5BD0",
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