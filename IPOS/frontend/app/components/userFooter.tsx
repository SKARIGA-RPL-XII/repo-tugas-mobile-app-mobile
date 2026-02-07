import { View, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
// 1. Import useOrder untuk mendapatkan data keranjang
import { useOrder } from "./orderContext"; 

export default function UserFooter() {
  const router = useRouter();
  const pathname = usePathname();
  
  // 2. Ambil data cart dari context
  const { cart } = useOrder();

  // 3. Hitung total item (opsional: bisa jumlah jenis barang atau total quantity)
  // Di sini kita hitung jumlah baris item yang ada di keranjang
  const cartItemCount = cart.length;

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <View style={styles.footer}>
      {/* DASHBOARD */}
      <Pressable
        style={[styles.item, isActive("/user/dashboard") && styles.active]}
        onPress={() => router.replace("/user/dashboard")}
      >
        <Ionicons 
          name={isActive("/user/dashboard") ? "home" : "home-outline"} 
          size={26} 
          color={isActive("/user/dashboard") ? "#1F8A45" : "#000"} 
        />
      </Pressable>

      {/* CART DENGAN BADGE */}
      <Pressable
        style={[styles.item, isActive("/user/cart") && styles.active]}
        onPress={() => router.replace("/user/cart")}
      >
        <View>
          <MaterialCommunityIcons 
            name={isActive("/user/cart") ? "cart" : "cart-outline"} 
            size={26} 
            color={isActive("/user/cart") ? "#1F8A45" : "#000"} 
          />
          
          {/* 4. Tampilkan Badge hanya jika ada item (cartItemCount > 0) */}
          {cartItemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      {/* PROFILE */}
      <Pressable style={[styles.item, isActive("/user/profile") && styles.active]}
        onPress={() => router.replace("/user/profile")}
      >
        <Ionicons 
          name={isActive("/user/profile") ? "person" : "person-outline"} 
          size={26} 
          color={isActive("/user/profile") ? "#1F8A45" : "#000"} 
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    // Tambahkan sedikit elevasi agar terlihat lebih bagus
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  item: {
    padding: 10,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center'
  },
  active: {
    backgroundColor: "#DCF7E3",
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff", 
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});