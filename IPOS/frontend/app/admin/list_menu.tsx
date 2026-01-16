import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AdminFooter from "../components/adminFooter";

const MENU_DATA = [
  {
    id: '1',
    name: 'Burger',
    category: 'Makanan',
    price: '17.000',
    desc: 'Makanan dengan isian roti dan daging',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Es Teh',
    category: 'Minuman',
    price: '2.500',
    desc: 'Minuman segar teh dan es batu',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Roti Spesial',
    category: 'Dessert',
    price: '20.000',
    desc: 'Dessert kue spesial dengan isian saos tomat dan selai strawberry',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function ListMenuAdmin() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof MENU_DATA[0] }) => (
    <View style={styles.card}>
      <Text style={styles.idBadge}>{item.id}</Text>
      <Image source={{ uri: item.image }} style={styles.menuImage} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.menuName}>{item.name}</Text>
        <View style={styles.categoryRow}>
          <Ionicons name="radio-button-on" size={12} color="black" />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.priceText}>Rp {item.price}</Text>
        <Text style={styles.descText} numberOfLines={2}>{item.desc}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.btnEdit}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnHapus}>
          <Text style={styles.btnText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List Menu</Text>
      </View>

      {/* BUTTON TAMBAH */}
      <TouchableOpacity style={styles.btnAdd}>
        <Text style={styles.btnAddText}>Tambah Menu</Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={MENU_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
      <AdminFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 15 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  btnAdd: {
    backgroundColor: '#72E163',
    paddingVertical: 12,
    marginHorizontal: 80,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  btnAddText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  listContent: { paddingHorizontal: 10 },
  row: { justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: '#E6F9E6',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 15,
    position: 'relative',
  },
  idBadge: { position: 'absolute', top: 5, left: 10, fontWeight: 'bold' },
  menuImage: { width: 80, height: 80, borderRadius: 15, alignSelf: 'center', marginTop: 10 },
  infoContainer: { alignItems: 'center', marginTop: 8 },
  menuName: { fontSize: 16, fontWeight: 'bold' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 2 },
  categoryText: { fontSize: 11, fontWeight: '600' },
  priceText: { fontSize: 12, fontWeight: 'bold' },
  descText: { fontSize: 9, textAlign: 'center', color: '#333', marginTop: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, width: '100%' },
  btnEdit: { backgroundColor: '#78A0F6', paddingVertical: 4, paddingHorizontal: 15, borderRadius: 8 },
  btnHapus: { backgroundColor: '#FF6B6B', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});