import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrder } from '../components/orderContext';

export default function CartPage() {
  const router = useRouter();
  const { cart, checkoutOrder } = useOrder();

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    checkoutOrder();
    router.push('/user/table');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{width: 24}} />
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
            <View style={styles.cartItem}>
                <Image source={{ uri: item.imageUri }} style={styles.thumb} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
                </View>
                <View style={styles.qtyBadge}><Text style={styles.qtyText}>x{item.qty}</Text></View>
            </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.row}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>Rp {total.toLocaleString('id-ID')}</Text>
        </View>
        <TouchableOpacity style={styles.btnPay} onPress={handleCheckout}>
            <Text style={styles.btnText}>Pay & Select Table</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F6' },
  header: { flexDirection: 'row', justifyContent:'space-between', padding: 20, alignItems:'center' },
  headerTitle: { fontSize: 18, fontWeight:'bold' },
  cartItem: { flexDirection:'row', backgroundColor:'#fff', padding:12, borderRadius:12, marginBottom:10, alignItems:'center' },
  thumb: { width: 60, height: 60, borderRadius: 8 },
  itemName: { fontWeight: 'bold', fontSize: 14 },
  itemPrice: { color: '#1F8A45', marginTop: 4 },
  qtyBadge: { backgroundColor: '#E8F2EB', paddingHorizontal:10, paddingVertical:4, borderRadius:8 },
  qtyText: { fontWeight:'bold', color: '#0C513F'},
  footer: { padding: 20, backgroundColor: '#fff' },
  row: { flexDirection:'row', justifyContent:'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight:'bold' },
  totalValue: { fontSize: 18, fontWeight:'bold', color: '#1F8A45' },
  btnPay: { backgroundColor: '#1F8A45', padding: 16, borderRadius: 12, alignItems:'center' },
  btnText: { color:'#fff', fontWeight:'bold', fontSize:16 },
});