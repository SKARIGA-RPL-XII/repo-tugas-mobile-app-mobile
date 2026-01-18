import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useOrder } from "../components/orderContext";

type CategoryKey = "makanan" | "minuman" | "dessert";

type MenuItem = {
  name: string;
  desc: string;
  price: string;
  imageUri: string;
  hot?: boolean;
  tag?: string;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const categories: { key: CategoryKey; icon: any; label: string }[] = [
  { key: "makanan", icon: "hamburger", label: "Makanan" },
  { key: "minuman", icon: "cup", label: "Minuman" },
  { key: "dessert", icon: "cupcake", label: "Dessert" },
];

const MENU_DATA: Record<CategoryKey, MenuItem[]> = {
  makanan: [
    {
      name: "Ayam Bakar Madu",
      desc: "Ayam empuk dengan bumbu madu rahasia",
      price: "24.000",
      imageUri: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop",
      hot: true,
      tag: "Terlaris",
    },
    {
      name: "Nasi Ayam Geprek",
      desc: "Kriuk sambal pedas bawang",
      price: "18.000",
      imageUri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
      tag: "Pedas",
    },
  ],
  minuman: [
    {
      name: "Matcha Latte",
      desc: "Creamy, earthy, sedikit manis",
      price: "22.000",
      imageUri: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200&auto=format&fit=crop",
      hot: true,
    },
  ],
  dessert: [
    {
      name: "Tiramisu",
      desc: "Mascarpone lembut khas Italia",
      price: "27.000",
      imageUri: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=1200&auto=format&fit=crop",
    },
  ],
};

export default function UserDashboard() {
  const router = useRouter();
  const { cart = [] } = useOrder();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<CategoryKey>("makanan");
  const { width } = useWindowDimensions();

  const screenPadding = clamp(width * 0.045, 14, 22);
  const bannerHeight = clamp(width * 0.5, 170, 210);

  const filteredMenus = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const list = MENU_DATA[activeCat];
    if (!keyword) return list;
    return list.filter((item) =>
      item.name.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword)
    );
  }, [activeCat, search]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Top Bar */}
        <View style={[styles.topBar, { paddingHorizontal: screenPadding }]}>
          <View style={styles.userMeta}>
            <Text style={styles.greeting}>Hai, Foodie!</Text>
            <View style={styles.metaBadge}>
              <Ionicons name="time-outline" size={12} color="#0C513F" />
              <Text style={styles.metaBadgeText}>Order buka s/d 22.00</Text>
            </View>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>DK</Text></View>
        </View>

        {/* Search */}
        <View style={[styles.searchRow, { paddingHorizontal: screenPadding }]}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#9AA0A6" />
            <TextInput
              placeholder="Cari menu favoritmu..."
              placeholderTextColor="#9AA0A6"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Banner */}
        <View style={[styles.bannerWrap, { paddingHorizontal: screenPadding }]}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1400&auto=format&fit=crop" }}
            style={[styles.banner, { height: bannerHeight }]}
          />
        </View>

        {/* Category Chips */}
        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={[styles.chipsRow, { paddingHorizontal: screenPadding }]}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setActiveCat(cat.key)}
                style={[styles.chip, activeCat === cat.key && styles.chipActive]}
              >
                <MaterialCommunityIcons name={cat.icon} size={18} color={activeCat === cat.key ? "#fff" : "#0C513F"} />
                <Text style={[styles.chipText, activeCat === cat.key && styles.chipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section Header */}
        <View style={[styles.sectionHeader, { paddingHorizontal: screenPadding }]}>
          <Text style={styles.sectionTitle}>Rekomendasi {activeCat}</Text>
        </View>

        {/* HORIZONTAL MENU LIST */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: screenPadding, gap: 16, paddingBottom: 10 }}
        >
          {filteredMenus.map((item, index) => (
            <MenuCard
              key={index}
              {...item}
              onPress={() => router.push({
                pathname: "/user/detail",
                params: { 
                    name: item.name, 
                    price: item.price, 
                    desc: item.desc, 
                    imageUri: item.imageUri 
                }
              })}
            />
          ))}
          
          {filteredMenus.length === 0 && (
            <Text style={styles.emptyText}>Menu tidak ditemukan...</Text>
          )}
        </ScrollView>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={[styles.bottomNav, { paddingHorizontal: screenPadding }]}>
        <TouchableOpacity style={[styles.navItem, styles.navActive]}>
          <Ionicons name="home" size={24} color="#0C513F" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/user/cart')}>
          <View style={styles.cartWrap}>
            <Ionicons name="cart-outline" size={24} color="#0C513F" />
            {totalItems > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{totalItems}</Text></View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/user/profile')}>
          <Ionicons name="person-outline" size={24} color="#0C513F" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function MenuCard({ name, price, imageUri, tag, onPress }: MenuItem & { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.cardImage} />
      {tag && <View style={styles.tagBadge}><Text style={styles.tagText}>{tag}</Text></View>}
      <View style={styles.cardText}>
        <Text style={styles.cardTitle} numberOfLines={1}>{name}</Text>
        <Text style={styles.cardPrice}>Rp {price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7F6" },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  userMeta: { flex: 1 },
  greeting: { fontSize: 20, fontWeight: "800", color: "#0C513F" },
  metaBadge: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  metaBadgeText: { fontSize: 12, color: "#6B7280" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#1F8A45", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontWeight: "bold" },
  searchRow: { marginBottom: 15 },
  searchBar: { height: 45, borderRadius: 12, backgroundColor: "#fff", paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 10, elevation: 2 },
  searchInput: { flex: 1, fontSize: 14 },
  bannerWrap: { marginBottom: 20 },
  banner: { width: "100%", borderRadius: 20 },
  chipsRow: { flexDirection: "row", marginBottom: 20, gap: 10 },
  chip: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5EBE7" },
  chipActive: { backgroundColor: "#0C513F", borderColor: "#0C513F" },
  chipText: { fontSize: 14, fontWeight: "600", color: "#0C513F" },
  chipTextActive: { color: "#fff" },
  sectionHeader: { marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#0C513F" },
  card: { width: 200, backgroundColor: "#fff", borderRadius: 20, overflow: "hidden", elevation: 4, marginBottom: 10 },
  cardImage: { width: "100%", height: 130 },
  tagBadge: { position: "absolute", top: 10, left: 10, backgroundColor: "#1F8A45", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, zIndex: 1 },
  tagText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  cardText: { padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#0C513F" },
  cardPrice: { marginTop: 4, fontSize: 16, fontWeight: "800", color: "#1F8A45" },
  emptyText: { color: "#9AA0A6", marginTop: 20 },
  bottomNav: { height: 75, flexDirection: "row", justifyContent: "space-around", alignItems: "center", backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#EEE" },
  navItem: { padding: 10 },
  navActive: { backgroundColor: "#E8F2EB", borderRadius: 15 },
  cartWrap: { position: "relative" },
  badge: { position: "absolute", top: -5, right: -5, backgroundColor: "#EF4444", borderRadius: 10, minWidth: 18, height: 18, alignItems: "center", justifyContent: "center", zIndex: 1 },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
});