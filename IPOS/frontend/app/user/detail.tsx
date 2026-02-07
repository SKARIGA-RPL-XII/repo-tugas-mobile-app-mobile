import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrder } from '../components/orderContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/customAlert'; 

export default function DetailMenu() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const { addToCart } = useOrder(); 
  
  const [quantity, setQuantity] = useState(1);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "success" | "warning" | "error";
    title: string;
  }>({
    visible: false,
    type: "success",
    title: "",
  });

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const showAlert = (type: "success" | "warning" | "error", title: string) => {
    setAlertConfig({ visible: true, type, title });
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, visible: false });
    if (alertConfig.type === "success") {
      router.back();
    }
  };

  const item = {
    id: params.id as string,
    name: params.name as string,
    price: params.price as string,
    desc: params.desc as string,
    imageUri: params.imageUri as string,
  };

  const handleAddToCart = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (!userData || !token) {
        showAlert("warning", "Silakan login terlebih dahulu");
        return;
      }

      const user = JSON.parse(userData);

      const response = await fetch("http://10.0.2.2:3000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          menu_id: item.id,
          quantity: quantity // 2. Gunakan state quantity di sini
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Kirim quantity juga ke context agar UI keranjang lokal sinkron
        addToCart({ ...item, quantity: quantity }); 
        showAlert("success", `Berhasil menambah ${quantity} item ke keranjang!`);
      } else {
        showAlert("error", result.message || "Gagal menambah ke keranjang");
      }
    } catch (error) {
      console.error("Error Add to Cart:", error);
      showAlert("error", "Terjadi kesalahan koneksi ke server");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.price}>Rp {item.price}</Text>
          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
        
        <CustomAlert
          visible={alertConfig.visible}
          type={alertConfig.type}
          title={alertConfig.title}
          onClose={closeAlert}
          onConfirm={alertConfig.type === "warning" ? () => router.push("/login") : closeAlert}
        />
      </ScrollView>

      {/* 3. Tambahkan UI Quantity Selector di Footer */}
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <Text style={styles.totalLabel}>Total Quantity</Text>
          <View style={styles.counter}>
            <TouchableOpacity onPress={decrement} style={styles.counterBtn}>
              <Ionicons name="remove" size={20} color="#1F8A45" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={increment} style={styles.counterBtn}>
              <Ionicons name="add" size={20} color="#1F8A45" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.btnCart} onPress={handleAddToCart}>
          <Text style={styles.btnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  backBtn: { position: 'absolute', top: 20, left: 20, zIndex: 10, backgroundColor: '#fff', padding: 8, borderRadius: 20 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0C513F' },
  price: { fontSize: 20, color: '#1F8A45', fontWeight: 'bold', marginTop: 8 },
  descTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  desc: { color: '#666', lineHeight: 22 },
  
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  quantityContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  counter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 8, padding: 4 },
  counterBtn: { padding: 8 },
  quantityText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15, minWidth: 20, textAlign: 'center' },
  
  btnCart: { backgroundColor: '#1F8A45', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});