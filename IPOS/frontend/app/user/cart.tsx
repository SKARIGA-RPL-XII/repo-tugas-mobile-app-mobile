import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrder } from '../components/orderContext';
import UserFooter from "../components/userFooter";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/customAlert'; // Pastikan path ini benar

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQty } = useOrder();

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "success" | "warning" | "error";
    title: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    type: "success",
    title: "",
  });

  const total = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
  const formattedTotal = total.toLocaleString('id-ID');

  const handleUpdateQty = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      const token = await AsyncStorage.getItem("token");
      updateCartQty(id, newQty);
      await fetch(`http://10.0.2.2:3000/api/cart/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQty })
      });
    } catch (error) {
      console.error("Gagal update qty:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://10.0.2.2:3000/api/cart/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        removeFromCart(id);
        setAlertConfig({
          visible: true,
          type: "success",
          title: "Item berhasil dihapus",
        });
      }
    } catch (error) {
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Gagal menghapus item",
      });
    }
  };

  const confirmDelete = (id: string) => {
    setAlertConfig({
      visible: true,
      type: "warning",
      title: "Yakin ingin menghapus menu ini?",
      onConfirm: () => {
        handleDeleteItem(id);
        setAlertConfig(prev => ({ ...prev, visible: false }));
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart ({cart.length})</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={() => router.push('/user/dashboard')}>
            <Text style={{ color: '#1F8A45', fontWeight: 'bold' }}>+ Tambah Menu</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 150 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Keranjangmu masih kosong</Text>
            <TouchableOpacity 
              style={styles.btnExplore} 
              onPress={() => router.push('/user/dashboard')}
            >
              <Text style={styles.btnExploreText}>Cari Makanan</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.imageUri }} style={styles.thumb} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemPrice}>Rp {Number(item.price).toLocaleString('id-ID')}</Text>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color="#FF4444" />
              </TouchableOpacity>
              <View style={styles.counterGroup}>
                <TouchableOpacity 
                  onPress={() => handleUpdateQty(item.id, item.qty - 1)}
                  style={[styles.countBtn, item.qty <= 1 && { opacity: 0.3 }]}
                  disabled={item.qty <= 1}
                >
                  <Ionicons name="remove" size={18} color="#0C513F" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity 
                  onPress={() => handleUpdateQty(item.id, item.qty + 1)}
                  style={styles.countBtn}
                >
                  <Ionicons name="add" size={18} color="#0C513F" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.checkoutBar}>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total Pembayaran</Text>
          <Text style={styles.totalValue}>Rp {formattedTotal}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.btnPay, cart.length === 0 && { backgroundColor: '#ccc' }]} 
          onPress={() => router.push('/user/table')}
          disabled={cart.length === 0}
        >
          <Text style={styles.btnText}>Pilih Metode Makan</Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        onConfirm={alertConfig.onConfirm}
      />

      <UserFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0C513F' },
  cartItem: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 16, 
    marginBottom: 12, 
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumb: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#eee' },
  itemName: { fontWeight: 'bold', fontSize: 15, color: '#333' },
  itemPrice: { color: '#1F8A45', fontWeight: 'bold', marginTop: 4 },
  actionContainer: { alignItems: 'flex-end', gap: 10 },
  deleteBtn: { padding: 4 },
  counterGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F2EB', borderRadius: 10, padding: 2 },
  countBtn: { padding: 6, paddingHorizontal: 10 },
  qtyText: { fontWeight: 'bold', color: '#0C513F', fontSize: 16, minWidth: 20, textAlign: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100, padding: 20 },
  emptyText: { marginTop: 10, color: '#999', fontSize: 16, marginBottom: 20 },
  btnExplore: { backgroundColor: '#1F8A45', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
  btnExploreText: { color: '#fff', fontWeight: 'bold' },
  checkoutBar: { 
    position: 'absolute',
    bottom: 80, 
    left: 0,
    right: 0,
    padding: 20, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 14, color: '#666' },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: '#1F8A45' },
  btnPay: { backgroundColor: '#1F8A45', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});