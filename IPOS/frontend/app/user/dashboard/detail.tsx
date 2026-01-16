import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrder } from '../../../context/OrderContext';

export default function DetailMenu() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Terima data dari dashboard
  const { addToCart } = useOrder();
  
  // Karena params string, kita anggap data aman.
  const item = {
    name: params.name as string,
    price: params.price as string,
    desc: params.desc as string,
    imageUri: params.imageUri as string,
  };

  const handleAddToCart = () => {
    addToCart(item);
    router.back(); // Atau bisa munculin toast "Berhasil masuk keranjang"
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
      </ScrollView>

      <View style={styles.footer}>
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
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#eee' },
  btnCart: { backgroundColor: '#1F8A45', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});