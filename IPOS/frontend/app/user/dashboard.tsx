import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserFooter from "../components/userFooter";

type CategoryKey = "makanan" | "minuman" | "dessert";

type MenuItem = {
  id?: number;
  name: string;
  desc: string;
  price: string;
  imageUri: string;
  tag?: string;
};

type UserProfile = {
  nama: string;
  foto: string | null;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const categories: { key: CategoryKey; icon: any; label: string }[] = [
  { key: "makanan", icon: "hamburger", label: "Makanan" },
  { key: "minuman", icon: "cup", label: "Minuman" },
  { key: "dessert", icon: "cupcake", label: "Dessert" },
];

const BASE_URL = "http://10.0.2.2:3000";

export default function UserDashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [menuData, setMenuData] = useState<Record<CategoryKey, MenuItem[]>>({
    makanan: [],
    minuman: [],
    dessert: [],
  });
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<CategoryKey>("makanan");

  const screenPadding = clamp(width * 0.045, 14, 22);
  const bannerHeight = clamp(width * 0.5, 170, 210);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchMenus(), fetchUserProfile()]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const response = await fetch(`${BASE_URL}/api/user/profile/${parsedUser.id}`);
        const data = await response.json();
        if (response.ok) setUser(data);
      }
    } catch (error) {
      console.error("Profile Fetch Error:", error);
    }
  };

  const fetchMenus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user-menu/menus`);
      const data = await response.json();

      const formattedData: any = {};
      Object.keys(data).forEach((key) => {
        formattedData[key] = data[key].map((item: any) => ({
          ...item,
          price: Number(item.price).toLocaleString("id-ID").replace(/,/g, "."),
        }));
      });

      setMenuData(formattedData);
    } catch (error) {
      console.error("Menu Fetch Error:", error);
    }
  };

  // --- PERBAIKAN LOGIKA PENCARIAN ---
  const filteredMenus = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    
    // Jika tidak ada keyword, tampilkan berdasarkan kategori yang diklik
    if (!keyword) {
      return menuData[activeCat] || [];
    }

    // Jika ada keyword, cari di SEMUA kategori (Global Search)
    const allItems = [
      ...(menuData.makanan || []),
      ...(menuData.minuman || []),
      ...(menuData.dessert || []),
    ];

    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.desc.toLowerCase().includes(keyword)
    );
  }, [activeCat, search, menuData]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0C513F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* TOP BAR */}
        <View style={[styles.topBar, { paddingHorizontal: screenPadding }]}>
          <View style={styles.userMeta}>
            <Text style={styles.greeting}>Hai, {user?.nama || "Foodie"}!</Text>
            <View style={styles.metaBadge}>
              <Ionicons name="time-outline" size={12} color="#0C513F" />
              <Text style={styles.metaBadgeText}>Order buka s/d 22.00</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push("/user/profile")}>
            {user?.foto ? (
              <Image source={{ uri: `${BASE_URL}/public/avatars/${user.foto}` }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{user ? getInitials(user.nama) : "U"}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
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
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#9AA0A6" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* BANNER */}
        <View style={[styles.bannerWrap, { paddingHorizontal: screenPadding }]}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1400&auto=format&fit=crop" }}
            style={[styles.banner, { height: bannerHeight }]}
          />
        </View>

        {/* CATEGORY CHIPS */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.chipsRow, { paddingHorizontal: screenPadding }]}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                onPress={() => {
                  setActiveCat(cat.key);
                  setSearch(""); // Reset search saat ganti kategori
                }}
                style={[styles.chip, activeCat === cat.key && !search && styles.chipActive]}
              >
                <MaterialCommunityIcons
                  name={cat.icon}
                  size={18}
                  color={activeCat === cat.key && !search ? "#fff" : "#0C513F"}
                />
                <Text style={[styles.chipText, activeCat === cat.key && !search && styles.chipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SECTION HEADER */}
        <View style={[styles.sectionHeader, { paddingHorizontal: screenPadding }]}>
          <Text style={styles.sectionTitle}>
            {search.trim() ? `Hasil Pencarian: "${search}"` : `Rekomendasi ${activeCat}`}
          </Text>
        </View>

        {/* MENU LIST (HORIZONTAL) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: screenPadding, gap: 16, paddingBottom: 15 }}
        >
          {filteredMenus.length > 0 ? (
            filteredMenus.map((item, index) => {
              const fullImageUrl = `${BASE_URL}/public/menus/${item.imageUri}`;
              return (
                <MenuCard
                  key={index}
                  {...item}
                  imageUri={fullImageUrl}
                  onPress={() =>
                    router.push({
                      pathname: "/user/detail",
                      params: { ...item, imageUri: fullImageUrl },
                    })
                  }
                />
              );
            })
          ) : (
            <View style={{ width: width - screenPadding * 2, alignItems: 'center', marginTop: 20 }}>
              <MaterialCommunityIcons name="filter-variant-remove" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Menu tidak ditemukan</Text>
            </View>
          )}
        </ScrollView>
      </ScrollView>

      <UserFooter />
    </SafeAreaView>
  );
}

// SUB-COMPONENT: MENU CARD
function MenuCard({ name, price, imageUri, tag, onPress }: MenuItem & { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.cardImage} />
      {tag && (
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      )}
      <View style={styles.cardText}>
        <Text style={styles.cardTitle} numberOfLines={1}>{name}</Text>
        <Text style={styles.cardPrice}>Rp {price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7F6" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  userMeta: { flex: 1 },
  greeting: { fontSize: 20, fontWeight: "800", color: "#0C513F" },
  metaBadge: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  metaBadgeText: { fontSize: 12, color: "#6B7280" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#1F8A45", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarImage: { width: "100%", height: "100%" },
  avatarText: { color: "#fff", fontWeight: "bold" },
  searchRow: { marginBottom: 15 },
  searchBar: { height: 45, borderRadius: 12, backgroundColor: "#fff", paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 10, elevation: 2 },
  searchInput: { flex: 1, fontSize: 14, color: "#000" },
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
  cardImage: { width: "100%", height: 130, backgroundColor: '#eee' },
  tagBadge: { position: "absolute", top: 10, left: 10, backgroundColor: "#1F8A45", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, zIndex: 1 },
  tagText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  cardText: { padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#0C513F" },
  cardPrice: { marginTop: 4, fontSize: 16, fontWeight: "800", color: "#1F8A45" },
  emptyText: { color: "#9AA0A6", marginTop: 10, fontSize: 14, fontWeight: '600' },
});