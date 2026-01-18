import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrder } from '../components/orderContext';

export default function NotificationPage() {
  const router = useRouter();
  const { cart, orderType, tableNumber, orderStatus, setOrderStatus } = useOrder();
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckIn = () => {
    setOrderStatus('checked-in');
    Alert.alert("Sukses", "Anda sudah check-in di meja. Selamat menikmati!");
  };

  const handleCheckOut = () => {
    setOrderStatus('completed');
    Alert.alert("Terima Kasih", "Anda sudah selesai makan.", [
        { text: "OK", onPress: () => router.replace('/user/dashboard') } // Kembali ke dashboard
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        <Text style={styles.shopName}>Cozy Plate Restaurant</Text>
        <Text style={styles.address}>Jl. Merdeka No 17, Surabaya</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
            <Text>Type:</Text>
            <Text style={{fontWeight:'bold'}}>{orderType === 'dine-in' ? 'Makan di Tempat' : 'Take Away'}</Text>
        </View>
        {orderType === 'dine-in' && (
            <View style={styles.tableBadge}>
                <Text style={styles.tableText}>Meja No. {tableNumber}</Text>
            </View>
        )}

        <View style={styles.divider} />
        
        {/* List Menu */}
        <View style={{ width: '100%' }}>
            {cart.map((item) => (
                <View key={item.name} style={styles.itemRow}>
                    <Text>{item.name} x{item.qty}</Text>
                    <Text>Rp {(item.price * item.qty).toLocaleString('id-ID')}</Text>
                </View>
            ))}
        </View>

        <View style={[styles.divider, { marginVertical: 10 }]} />
        <View style={[styles.row, { width: '100%' }]}>
            <Text style={{fontWeight:'bold'}}>TOTAL</Text>
            <Text style={{fontWeight:'bold', fontSize: 18}}>Rp {total.toLocaleString('id-ID')}</Text>
        </View>

      </ScrollView>

      {/* Logic Tombol Check-in/Checkout */}
      <View style={styles.footer}>
        {orderType === 'take-away' ? (
            <TouchableOpacity style={styles.btnDone} onPress={() => router.replace('/user/dashboard')}>
                <Text style={styles.btnText}>Kembali ke Menu</Text>
            </TouchableOpacity>
        ) : (
            // Logic Dine-in
            <>
                {orderStatus === 'paid' && (
                    <TouchableOpacity style={styles.btnCheckIn} onPress={handleCheckIn}>
                        <Text style={styles.btnText}>Check-In (Makanan Diterima)</Text>
                    </TouchableOpacity>
                )}
                
                {orderStatus === 'checked-in' && (
                    <TouchableOpacity style={styles.btnCheckOut} onPress={handleCheckOut}>
                        <Text style={styles.btnText}>Check-Out (Selesai Makan)</Text>
                    </TouchableOpacity>
                )}
            </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  shopName: { fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  address: { color: '#666', marginBottom: 20, textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#ddd', width: '100%', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginBottom: 8 },
  tableBadge: { fontSize: 40, marginVertical: 20, alignItems: 'center' },
  tableText: { fontSize: 32, fontWeight: 'bold' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  footer: { padding: 20, gap: 10 },
  btnCheckIn: { backgroundColor: '#1F8A45', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnCheckOut: { backgroundColor: '#EF4444', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnDone: { backgroundColor: '#666', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});