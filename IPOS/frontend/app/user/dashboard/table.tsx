import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrder } from '../../../context/OrderContext';

export default function TablePage() {
  const router = useRouter();
  const { setOrderType, setTableNumber } = useOrder();
  
  // Mock Data Meja
  const tables = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    isFull: (i + 1) % 2 === 0 // Meja genap pura-puranya penuh
  }));

  const handleSelectTable = (table: any) => {
    if (table.isFull) {
        Alert.alert(
            "Meja Penuh",
            "Maaf meja ini penuh. Kami sarankan Take-Away.",
            [
                { text: "Batal", style: 'cancel' },
                { text: "Take Away", onPress: () => processOrder('take-away', null) }
            ]
        );
    } else {
        processOrder('dine-in', table.id.toString());
    }
  };

  const processOrder = (type: 'dine-in' | 'take-away', tableNum: string | null) => {
    setOrderType(type);
    if (tableNum) setTableNumber(tableNum);
    
    // Arahkan ke notifikasi
    router.replace('/user/dashboard/notification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pilih Meja</Text>
      <View style={styles.grid}>
        {tables.map((t) => (
            <TouchableOpacity 
                key={t.id} 
                style={[styles.table, t.isFull ? styles.full : styles.empty]}
                onPress={() => handleSelectTable(t)}
            >
                <Text style={[styles.tableText, t.isFull ? styles.textFull : styles.textEmpty]}>
                    No. {t.id}
                </Text>
                <Text style={{fontSize:10, color: t.isFull ? '#fff':'#000'}}>
                    {t.isFull ? 'Full' : 'Empty'}
                </Text>
            </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.btnTakeAway} onPress={() => processOrder('take-away', null)}>
        <Text style={styles.btnText}>Langsung Take-Away</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  table: { width: 80, height: 80, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth:1 },
  empty: { backgroundColor: '#fff', borderColor: '#1F8A45' },
  full: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  tableText: { fontSize: 18, fontWeight: 'bold' },
  textEmpty: { color: '#1F8A45' },
  textFull: { color: '#fff' },
  btnTakeAway: { marginTop: 40, backgroundColor: '#F59E0B', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});