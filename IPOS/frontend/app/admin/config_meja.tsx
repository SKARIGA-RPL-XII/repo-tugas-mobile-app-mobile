import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../components/customAlert"; 

type TableStatus = "kosong" | "ditempati" | "dibersihkan" | "dipesan";
type Table = { id: number; no_meja: number; status: TableStatus };

export default function ConfigTable() {
  const router = useRouter();
  const API_URL = "http://10.0.2.2:3000/api/meja";

  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const [formNoMeja, setFormNoMeja] = useState("");
  const [formStatus, setFormStatus] = useState<TableStatus>("kosong");

  // State untuk Custom Alert
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "success" as "warning" | "success" | "error",
    title: "",
    onConfirm: undefined as (() => void) | undefined,
  });

  const showAlert = (title: string, type: "warning" | "success" | "error", onConfirm?: () => void) => {
    setAlertConfig({ visible: true, title, type, onConfirm });
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setTables(data);
    } catch (error) {
      showAlert("Gagal mengambil data meja", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "kosong": return "#1D8F49";
      case "ditempati": return "#E74C3C";
      case "dibersihkan": return "#3498DB";
      case "dipesan": return "#F39C12";
      default: return "#ccc";
    }
  };

  const handleSave = async () => {
    if (!formNoMeja) return showAlert("Nomor meja harus diisi", "warning");

    const tableNumber = parseInt(formNoMeja);

    // LOGIKA PENGECEKAN DUPLIKAT
    const isDuplicate = tables.some((t) => {
      if (isEdit) {
        // Jika sedang edit, jangan cek nomor meja milik diri sendiri (ID yang sama)
        return t.no_meja === tableNumber && t.id !== selectedTable?.id;
      }
      // Jika tambah baru, cek apakah nomor sudah ada di list
      return t.no_meja === tableNumber;
    });

    if (isDuplicate) {
      return showAlert(`Nomor meja ${tableNumber} sudah dipakai!`, "warning");
    }

    const payload = {
      no_meja: tableNumber,
      status: formStatus.toLowerCase(),
    };

    try {
      const url = isEdit ? `${API_URL}/${selectedTable?.id}` : API_URL;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalVisible(false);
        fetchTables();
        showAlert(isEdit ? "Meja berhasil diperbarui" : "Meja berhasil ditambah", "success");
      } else {
        const result = await res.json();
        showAlert(result.message || "Terjadi kesalahan pada server", "error");
      }
    } catch (error) {
      showAlert("Gagal menghubungi server", "error");
    }
  };

  const deleteTable = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTables();
        showAlert("Meja berhasil dihapus", "success");
      }
    } catch (error) {
      showAlert("Gagal menghapus meja", "error");
    }
  };

  const confirmDelete = (id: number) => {
    showAlert("Apakah Anda yakin ingin menghapus meja ini?", "warning", () => deleteTable(id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pilih Meja</Text>
        <TouchableOpacity onPress={() => { setIsEdit(false); setFormNoMeja(""); setFormStatus("kosong"); setModalVisible(true); }}>
          <Ionicons name="add-circle" size={35} color="#1D8F49" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1D8F49" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.gridContainer}>
          {tables.map((item) => {
            const color = getStatusColor(item.status);
            const isWhiteText = item.status.toLowerCase() !== "kosong";

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.tableBox, { borderColor: color, backgroundColor: isWhiteText ? color : "#fff" }]}
                onLongPress={() => confirmDelete(item.id)} // Tekan lama untuk hapus
                onPress={() => {
                  setSelectedTable(item);
                  setIsEdit(true);
                  setFormNoMeja(item.no_meja.toString());
                  setFormStatus(item.status);
                  setModalVisible(true);
                }}
              >
                <Text style={[styles.noText, { color: isWhiteText ? "#fff" : color }]}>No. {item.no_meja}</Text>
                <Text style={[styles.statusText, { color: isWhiteText ? "#fff" : color }]}>{item.status.toUpperCase()}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* MODAL INPUT */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEdit ? "Edit Meja" : "Tambah Meja"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nomor Meja"
              keyboardType="numeric"
              value={formNoMeja}
              onChangeText={setFormNoMeja}
            />
            <Text style={styles.label}>Pilih Status:</Text>
            <View style={styles.statusGrid}>
              {(["kosong", "ditempati", "dibersihkan", "dipesan"] as TableStatus[]).map((s) => (
                <TouchableOpacity 
                  key={s}
                  style={[styles.statusOption, formStatus === s && { backgroundColor: getStatusColor(s), borderColor: getStatusColor(s) }]}
                  onPress={() => setFormStatus(s)}
                >
                  <Text style={[styles.statusOptionText, formStatus === s && { color: "#fff" }]}>{s.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnTextBlack}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                <Text style={styles.btnTextWhite}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* COMPONENT CUSTOM ALERT */}
      <CustomAlert 
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={() => setAlertConfig({...alertConfig, visible: false})}
        onConfirm={alertConfig.onConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: "2%", paddingBottom: 30 },
  tableBox: { width: "44%", aspectRatio: 1.1, margin: "3%", borderWidth: 2, borderRadius: 20, justifyContent: "center", alignItems: "center", elevation: 2 },
  noText: { fontSize: 22, fontWeight: "bold" },
  statusText: { fontSize: 11, marginTop: 4, fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", backgroundColor: "#fff", borderRadius: 25, padding: 25 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 10, color: "#555" },
  input: { width: "100%", borderWidth: 1.5, borderColor: "#eee", borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 20, backgroundColor: "#f9f9f9" },
  statusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 30, justifyContent: "space-between" },
  statusOption: { width: "48%", paddingVertical: 10, borderWidth: 1.5, borderColor: "#eee", borderRadius: 10, alignItems: "center" },
  statusOptionText: { fontSize: 13, fontWeight: "600", color: "#555" },
  modalButtons: { flexDirection: "row", gap: 12 },
  btnCancel: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: "#f0f0f0", alignItems: "center" },
  btnSave: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: "#1D8F49", alignItems: "center" },
  btnTextBlack: { fontWeight: "bold", color: "#333" },
  btnTextWhite: { color: "#fff", fontWeight: "bold" },
});