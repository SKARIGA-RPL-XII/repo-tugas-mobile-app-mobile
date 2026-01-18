import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminFooter from "../components/adminFooter";
import CustomAlert from "../components/customAlert";

type User = {
  id: number;
  nama: string;
  email: string;
  no_telepon: string;
  foto: string;
  roles: "user" | "admin";
  password_plain?: string;
};

export default function ListUserAdmin() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "success" as "success" | "error" | "warning",
    title: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch("http://10.0.2.2:3000/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, []),
  );

  // 1. Munculkan Konfirmasi
  const handleDeleteRequest = (id: number) => {
    setSelectedUserId(id);
    setAlertConfig({
      visible: true,
      type: "warning",
      title: "Apakah anda yakin ingin menghapus user ini?",
    });
  };

  // 2. Eksekusi Hapus (Dipanggil saat klik 'Oke' pada modal warning)
  const executeDelete = async () => {
    if (!selectedUserId) return;

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(
        `http://10.0.2.2:3000/api/admin/users/${selectedUserId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();

      if (res.ok) {
        setAlertConfig({
          visible: true,
          type: "success",
          title: "User berhasil dihapus",
        });
        fetchUsers(); // Refresh data
      } else {
        setAlertConfig({
          visible: true,
          type: "error",
          title: data.message || "Gagal menghapus user",
        });
      }
    } catch (error) {
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Kesalahan koneksi server",
      });
    } finally {
      setSelectedUserId(null); // Reset ID
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.tableRow}>
      <View style={[styles.cell, { flex: 0.5 }]}>
        <Text style={styles.cellText}>{item.id}</Text>
      </View>

      <View style={[styles.cell, { flex: 1 }]}>
        <Image
          source={
            item.foto
              ? { uri: `http://10.0.2.2:3000/public/avatars/${item.foto}` }
              : require("../assets/default-avatar.png")
          }
          style={styles.avatarImg}
        />
      </View>

      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={[styles.cellText, styles.nameText]} numberOfLines={1}>
          {item.nama}
        </Text>
      </View>

      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={styles.cellText}>{item.no_telepon}</Text>
      </View>

      {/* TOMBOL DELETE */}
      <View style={[styles.cell, { flex: 1 }]}>
        <TouchableOpacity onPress={() => handleDeleteRequest(item.id)}>
          <Ionicons name="trash" size={20} color="#FF4D4D" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        onConfirm={alertConfig.type === "warning" ? executeDelete : undefined}
      />
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>List User</Text>
      </View>

      {/* TABLE HEADER */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, { flex: 0.5 }]}>ID</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>Foto</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>Nama</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>Tlp</Text>
        <Text style={[styles.headerText, { flex: 1, borderRightWidth: 0 }]}>
          Aksi
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1D8F49"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada data user.</Text>
          }
        />
      )}
      <AdminFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 15,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#C1F2B0", // Warna hijau muda sesuai gambar
    marginHorizontal: 15,
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#000",
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 8,
    paddingVertical: 10,
    alignItems: "center",
    // Shadow untuk efek elevation
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  cellText: {
    fontSize: 13,
    textAlign: "center",
  },
  nameText: {
    fontWeight: "bold",
    color: "#333",
  },
  passwordText: {
    fontSize: 11,
    color: "#666",
  },
  avatarImg: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
  },
});