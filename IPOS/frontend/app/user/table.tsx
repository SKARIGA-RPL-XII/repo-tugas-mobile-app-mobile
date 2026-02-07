import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrder } from '../components/orderContext';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../components/customAlert';

type TableStatus = "kosong" | "ditempati" | "dibersihkan" | "dipesan";
type Table = { id: number; no_meja: number; status: TableStatus };

export default function TablePage() {
  const router = useRouter();
  const { setOrderType, setTableNumber } = useOrder();
  
  // Ambil URL API yang sama dengan Admin
  const API_URL = "http://10.0.2.2:3000/api/meja";

  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState<{
  visible: boolean;
  type: "success" | "warning" | "error";
  title: string;
  onConfirm?: () => void; // Tambahkan tanda tanya (?) di sini
}>({
  visible: false,
  type: "success",
  title: "",
  onConfirm: undefined,
});

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
  try {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    const sortedData = data.sort((a: Table, b: Table) => a.no_meja - b.no_meja);
    setTables(sortedData);
  } catch (error) {
    setAlertConfig(prev => ({
      ...prev,
      visible: true,
      type: "error",
      title: "Gagal memuat data meja",
    }));
  } finally {
    setLoading(false);
  }
};

  const handleSelectTable = (table: Table) => {
    const status = table.status.toLowerCase();

    if (status !== "kosong") {
      setAlertConfig({
        visible: true,
        type: "warning",
        title: `Meja No. ${table.no_meja} sedang ${status}. Pilih meja lain atau Take Away?`,
        onConfirm: () => processOrder('take-away', null)
      });
    } else {
      processOrder('dine-in', table.no_meja.toString());
    }
  };

  const processOrder = (type: 'dine-in' | 'take-away', tableNum: string | null) => {
    setOrderType(type);
    if (tableNum) setTableNumber(tableNum);
    setAlertConfig({ ...alertConfig, visible: false });
    router.replace('/user/notification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Pilih Meja</Text>
        <TouchableOpacity onPress={fetchTables}>
          <Ionicons name="refresh" size={24} color="#1F8A45" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#1F8A45" />
          <Text style={{ marginTop: 10, color: '#666' }}>Mengecek ketersediaan meja...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {tables.map((t) => {
            const isAvailable = t.status.toLowerCase() === "kosong";
            return (
              <TouchableOpacity 
                key={t.id} 
                style={[
                  styles.table, 
                  isAvailable ? styles.empty : styles.full
                ]}
                onPress={() => handleSelectTable(t)}
              >
                <Text style={[styles.tableText, isAvailable ? styles.textEmpty : styles.textFull]}>
                  No. {t.no_meja}
                </Text>
                <Text style={[styles.statusMini, { color: isAvailable ? '#1F8A45' : '#fff' }]}>
                  {t.status.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnTakeAway} onPress={() => processOrder('take-away', null)}>
          <Text style={styles.btnText}>Langsung Take-Away</Text>
        </TouchableOpacity>
      </View>

      <CustomAlert 
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        onConfirm={alertConfig.onConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  backBtn: { padding: 5 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0C513F' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    padding: 15,
    justifyContent: 'space-between' 
  },
  table: { 
    width: '46%', 
    aspectRatio: 1.2,
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 2,
    marginBottom: 15
  },
  empty: { backgroundColor: '#fff', borderColor: '#1F8A45' },
  full: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  tableText: { fontSize: 20, fontWeight: 'bold' },
  statusMini: { fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  textEmpty: { color: '#1F8A45' },
  textFull: { color: '#fff' },
  footer: { padding: 20 },
  btnTakeAway: { 
    backgroundColor: '#F59E0B', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center',
    elevation: 3
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});