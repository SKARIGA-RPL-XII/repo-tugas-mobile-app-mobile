import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// 1. IMPORT CONTEXT (Pastikan path-nya sesuai lokasi file OrderContext.tsx kamu)
import { useOrder } from "../../../context/OrderContext"; 

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

const categories: { key: CategoryKey; icon: any }[] = [
  { key: "makanan", icon: "hamburger" },
  { key: "minuman", icon: "cup" },
  { key: "dessert", icon: "cupcake" },
];

const MENU_DATA: Record<CategoryKey, MenuItem[]> = {
  makanan: [
    {
      name: "Ayam Bakar Madu",
      desc: "Ayam e bosok, Gak usah tuku nang kene",
      price: "24.000",
      imageUri:
        "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop",
      hot: true,
      tag: "Paling laris",
    },
    {
      name: "Nasi Ayam Geprek",
      desc: "Kriuk sambal pedas",
      price: "18.000",
      imageUri:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
      tag: "Pedas",
    },
    {
      name: "Pasta Creamy Mushroom",
      desc: "Jamur dengan saus gurih",
      price: "32.000",
      imageUri:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Salad Quinoa",
      desc: "Segar, ringan, kaya serat",
      price: "28.000",
      imageUri:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  minuman: [
    {
      name: "Matcha Latte",
      desc: "Creamy, earthy, sedikit manis",
      price: "22.000",
      imageUri:
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200&auto=format&fit=crop",
      hot: true,
      tag: "Favorit sore",
    },
    {
      name: "Es Kopi Susu",
      desc: "Robusta, susu segar, gula aren",
      price: "19.000",
      imageUri:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Lychee Sparkling",
      desc: "Leci dingin, sedikit soda",
      price: "17.000",
      imageUri:
        "https://images.unsplash.com/photo-1582719478248-51e37d2c2cbe?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Cold Brew Citrus",
      desc: "Kopi dingin, irisan jeruk",
      price: "21.000",
      imageUri:
        "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  dessert: [
    {
      name: "Tiramisu",
      desc: "Mascarpone lembut",
      price: "27.000",
      imageUri:
        "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=1200&auto=format&fit=crop",
      hot: true,
      tag: "Mood booster",
    },
    {
      name: "Panna Cotta",
      desc: "Vanilla bean, berry compote",
      price: "23.000",
      imageUri:
        "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Brownies Fudge",
      desc: "Dark chocolate legit",
      price: "16.000",
      imageUri:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Mango Sticky Rice",
      desc: "Ketan wangi, santan gurih",
      price: "24.000",
      imageUri:
        "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop",
    },
  ],
};

export default function UserDashboard() {
  const router = useRouter();
  
  // 2. PANGGIL DATA KERANJANG
  const { cart } = useOrder(); 
  // Hitung total item di keranjang untuk badge
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<CategoryKey>("makanan");
  const { width } = useWindowDimensions();

  // Responsif: pakai clamp supaya proporsional di semua device
  const screenPadding = clamp(width * 0.045, 14, 22);
  const gap = clamp(width * 0.04, 12, 18);
  const cardWidth = useMemo(() => (width - screenPadding * 2 - gap) / 2, [width, screenPadding, gap]);
  const bannerHeight = clamp(width * 0.55, 190, 240);
  const chipSize = clamp(width * 0.14, 46, 56);
  const cardImgHeight = clamp(cardWidth * 0.7, 120, 150);

  const handleBack = useCallback(() => {
    Alert.alert(
      "Keluar",
      "Anda ingin kembali ke halaman login?",
      [
        { text: "Tidak", style: "cancel" },
        { text: "Ya", style: "destructive", onPress: () => router.replace("/login") },
      ],
      { cancelable: true },
    );
  }, [router]);

  const filteredMenus = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const list = MENU_DATA[activeCat];
    if (!keyword) return list;
    return list.filter(
      (item) => item.name.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword)
    );
  }, [activeCat, search]);

  const sectionTitle =
    activeCat === "makanan"
      ? "Menu Makanan"
      : activeCat === "minuman"
        ? "Menu Minuman"
        : "Menu Dessert";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90, paddingTop: 8, backgroundColor: "#F5F7F6" }}
      >
        {/* Top Bar */}
        <View style={[styles.topBar, { paddingHorizontal: screenPadding }]}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="arrow-back" size={22} color="#0C513F" />
          </TouchableOpacity>

          <View style={styles.userMeta}>
            <Text style={styles.greeting}>Hai, Foodie!</Text>
            <Text style={styles.subGreeting}>Kurasi menu segar setiap hari</Text>
            <View style={styles.metaBadge}>
              <Ionicons name="time-outline" size={12} color="#0C513F" />
              <Text style={styles.metaBadgeText}>Order buka s/d 22.00</Text>
            </View>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DK</Text>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchRow, { paddingHorizontal: screenPadding }]}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#9AA0A6" />
            <TextInput
              placeholder="Cari menu, rasa, atau topping"
              placeholderTextColor="#9AA0A6"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={18} color="#0C513F" />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={[styles.bannerWrap, { paddingHorizontal: screenPadding }]}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1400&auto=format&fit=crop",
            }}
            style={[styles.banner, { height: bannerHeight }]}
          />
        </View>

        {/* Info Row */}
        <View style={[styles.infoRow, { paddingHorizontal: screenPadding, gap }]}>
          <InfoCard icon="leaf" title="Sehat" subtitle="Bahan segar harian" />
          <InfoCard icon="flash" title="Cepat" subtitle="< 20 menit" />
          <InfoCard icon="shield-check" title="Higienis" subtitle="Dapur tersertifikasi" />
        </View>

        {/* Category Chips */}
        <View style={[styles.chipsRow, { paddingHorizontal: screenPadding, gap }]}>
          {categories.map((cat) => (
            <CategoryChip
              key={cat.key}
              size={chipSize}
              icon={cat.icon}
              active={activeCat === cat.key}
              onPress={() => setActiveCat(cat.key)}
            />
          ))}
        </View>

        {/* Section Header */}
        <View style={[styles.sectionHeader, { paddingHorizontal: screenPadding }]}>
          <View>
            <Text style={styles.sectionTitle}>{sectionTitle}</Text>
            <Text style={styles.sectionHint}>{filteredMenus.length} rekomendasi khusus buatmu</Text>
          </View>
          <TouchableOpacity style={styles.sortBtn} activeOpacity={0.85}>
            <Ionicons name="sparkles-outline" size={16} color="#0C513F" />
            <Text style={styles.sortText}>Kurasi</Text>
          </TouchableOpacity>
        </View>

        {/* MENU GRID */}
        <View
          style={{
            paddingHorizontal: screenPadding,
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: gap,
            rowGap: gap,
          }}
        >
          {filteredMenus.map((item) => (
            <MenuCard 
                key={item.name} 
                width={cardWidth} 
                imgHeight={cardImgHeight} 
                {...item} 
                // 3. TAMBAHKAN NAVIGASI KE DETAIL SAAT CARD DIKLIK
                onPress={() => router.push({
                    pathname: "/user/dashboard/detail",
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
            <View style={[styles.emptyState, { width: width - screenPadding * 2 }]}>
              <Ionicons name="leaf-outline" size={18} color="#1F8A45" />
              <Text style={styles.emptyText}>Menu belum ditemukan. Coba kata kunci lain.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={[styles.bottomNav, { paddingHorizontal: screenPadding }]}>
        <TouchableOpacity style={[styles.navItem, styles.navActive]}>
          <Ionicons name="home-outline" size={22} color="#0C513F" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/user/dashboard/notification')}>
          <Ionicons name="notifications-outline" size={22} color="#0C513F" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/user/dashboard/profil")}
        >
          <Ionicons name="person-outline" size={22} color="#0C513F" />
        </TouchableOpacity>

        {/* 4. TOMBOL KERANJANG (NAVIGASI + BADGE) */}
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/user/dashboard/cart')}>
          <View style={styles.cartWrap}>
            <Ionicons name="cart-outline" size={22} color="#0C513F" />
            {/* Tampilkan Badge Merah jika ada item */}
            {totalItems > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalItems}</Text>
                </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- COMPONENTS ---

function InfoCard({ icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <View style={styles.infoCard}>
      <MaterialCommunityIcons name={icon} size={18} color="#0C513F" />
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoSubtitle}>{subtitle}</Text>
    </View>
  );
}

function CategoryChip({
  icon,
  active,
  onPress,
  size,
}: {
  icon: any;
  active: boolean;
  onPress: () => void;
  size: number;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        { width: size, height: size, borderRadius: size / 2 },
        active && styles.chipActive,
      ]}
      activeOpacity={0.85}
    >
      <MaterialCommunityIcons
        name={icon}
        size={Math.round(size * 0.5)}
        color={active ? "#0C513F" : "#215F45"}
      />
    </TouchableOpacity>
  );
}

// 5. UPDATE MENUCARD AGAR MENERIMA PROPS onPress
function MenuCard({ name, desc, price, imageUri, hot, tag, width, imgHeight, onPress }: MenuItem & { width: number; imgHeight: number; onPress: () => void }) {
  return (
    // Ganti View jadi TouchableOpacity
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.card, { width }]}>
      <Image source={{ uri: imageUri }} style={[styles.cardImage, { height: imgHeight }]} />

      <View style={styles.cardText}>
        <View style={styles.cardTopRow}>
          {tag && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          )}
          {hot && (
            <View style={styles.flameWrap}>
              <Ionicons name="flame" size={14} color="#F59E0B" />
            </View>
          )}
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {desc}
        </Text>

        <Text style={styles.cardPrice}>
          <Text style={styles.rp}>Rp</Text> {price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7F6" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 4,
    paddingBottom: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F2EB",
  },
  userMeta: { flex: 1 },
  greeting: { fontSize: 16, fontWeight: "800", color: "#0C513F" },
  subGreeting: { marginTop: 2, fontSize: 12, color: "#6B7280" },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
    backgroundColor: "#E8F2EB",
    borderRadius: 14,
  },
  metaBadgeText: { fontSize: 11, color: "#0C513F", fontWeight: "600" },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F8A45",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2F0",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13, color: "#111", paddingVertical: 0 },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F2EB",
    alignItems: "center",
    justifyContent: "center",
  },

  bannerWrap: { marginTop: 6, position: "relative" },
  banner: { width: "100%", borderRadius: 24, backgroundColor: "#E6ECE9" },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5EBE7",
  },
  infoTitle: { fontSize: 13, fontWeight: "800", color: "#0C513F" },
  infoSubtitle: { fontSize: 11, color: "#6B7280" },

  chipsRow: {
    marginTop: 18,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    backgroundColor: "#E8F2EB",
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: "#D0E9D8",
    borderWidth: 2,
    borderColor: "#1F8A45",
  },

  sectionHeader: {
    marginTop: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: "#0C513F" },
  sectionHint: { marginTop: 4, fontSize: 12, color: "#6B7280" },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E8F2EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  sortText: { fontSize: 12, fontWeight: "700", color: "#0C513F" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5EBE7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },
  cardImage: { width: "100%", borderRadius: 14, backgroundColor: "#E6ECE9" },
  cardText: { paddingHorizontal: 14, paddingVertical: 12 },
  cardTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  tagBadge: {
    backgroundColor: "#E8F2EB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: { fontSize: 10, fontWeight: "800", color: "#0C513F" },
  flameWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFF5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 14, fontWeight: "800", color: "#0C513F" },
  cardDesc: { marginTop: 4, fontSize: 12, color: "#6B7280" },
  cardPrice: { marginTop: 12, fontSize: 18, fontWeight: "900", color: "#0C513F" },
  rp: { fontSize: 11, fontWeight: "900" },

  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5EBE7",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  emptyText: { fontSize: 12, color: "#0C513F" },

  bottomNav: {
    height: 70,
    borderTopWidth: 1,
    borderColor: "#E5EBE7",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navItem: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  navActive: { backgroundColor: "#E8F2EB" },
  cartWrap: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", position: 'relative' },
  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444", // Merah biar kelihatan
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4
  },
  badgeText: { fontSize: 10, fontWeight: "900", color: "#fff" },
});
