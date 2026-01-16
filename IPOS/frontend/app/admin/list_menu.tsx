import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AdminFooter from "../components/adminFooter";
import CustomAlert from "../components/customAlert";

type Menu = {
  id: number;
  nama: string;
  deskripsi: string;
  foto: string;
  harga: number;
  kategori: "makanan" | "minuman" | "dessert";
};

export default function ListMenuAdmin() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'warning' as 'warning' | 'success' | 'error',
    title: '',
    onConfirm: undefined as (() => void) | undefined
  });

  const fetchMenus = async () => {
    try {
      const res = await fetch("http://10.0.2.2:3000/api/menus/getAll");
      const data = await res.json();
      setMenus(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMenus();
    }, [])
  );

  const showAlert = (type: 'warning' | 'success' | 'error', title: string, onConfirm?: () => void) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      onConfirm
    });
  };

  const handleDelete = (id: string) => {
    showAlert('warning', 'Apakah Anda yakin ingin menghapus menu ini?', () => {
      confirmDelete(id);
    });
  };

  const confirmDelete = async (id: string) => {
    setAlertConfig(prev => ({ ...prev, visible: false }));

    try {
      const response = await fetch(`http://10.0.2.2:3000/api/menus/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // 2. Tampilkan sukses
        setTimeout(() => {
          showAlert('success', 'Menu Berhasil Dihapus', () => {
            setAlertConfig(prev => ({ ...prev, visible: false }));
            fetchMenus(); // Refresh list
          });
        }, 500);
      } else {
        showAlert('error', 'Gagal menghapus menu');
      }
    } catch (error) {
      console.error(error);
      showAlert('error', 'Terjadi kesalahan koneksi');
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const renderItem = ({ item }: { item: Menu }) => (
    <View style={styles.card}>
      <Text style={styles.idBadge}>{item.id}</Text>
      <Image
        source={{ uri: `http://10.0.2.2:3000/public/menus/${item.foto}` }}
        style={styles.menuImage}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.menuName}>{item.nama}</Text>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryText}>{item.kategori}</Text>
        </View>
        <Text style={styles.priceText}>{formatRupiah(item.harga)}</Text>
        <Text style={styles.descText} numberOfLines={2}>
          {item.deskripsi}
        </Text>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.btnEdit}
          onPress={() =>
            router.push({
              pathname: "/admin/edit_menu",
              params: { id: String(item.id) },
            })
          }
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnHapus}
          onPress={() => handleDelete(String(item.id))}
        >
          <Text style={styles.btnText}>Hapus</Text>
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
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        onConfirm={alertConfig.onConfirm}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>List Menu</Text>
      </View>

      <TouchableOpacity
        style={styles.btnAdd}
        onPress={() => router.push("/admin/tambah_menu")}
      >
        <Text style={styles.btnAddText}>Tambah Menu</Text>
      </TouchableOpacity>

      <FlatList
        data={menus}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />

      <AdminFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", padding: 16, gap: 15 },
  headerTitle: { fontSize: 28, fontWeight: "bold" },
  btnAdd: {
    backgroundColor: "#72E163",
    paddingVertical: 12,
    marginHorizontal: 80,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
  },
  btnAddText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  listContent: { paddingHorizontal: 10 },
  row: { justifyContent: "space-between" },
  card: {
    width: "48%",
    backgroundColor: "#E6F9E6",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginBottom: 15,
    position: "relative",
  },
  idBadge: { position: "absolute", top: 5, left: 10, fontWeight: "bold" },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    alignSelf: "center",
    marginTop: 10,
  },
  infoContainer: { alignItems: "center", marginTop: 8 },
  menuName: { textAlign: "center", fontSize: 16, fontWeight: "bold" },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginVertical: 2,
  },
  categoryText: { fontSize: 11, fontWeight: "600" },
  priceText: { fontSize: 12, fontWeight: "bold" },
  descText: { fontSize: 9, textAlign: "center", color: "#333", marginTop: 4 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  btnEdit: {
    backgroundColor: "#78A0F6",
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  btnHapus: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
});