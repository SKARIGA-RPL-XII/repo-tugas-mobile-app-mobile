import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export default function AdminFooter() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <View style={styles.footer}>
      {/* DASHBOARD */}
      <Pressable
        style={[styles.item, isActive("/admin/dashboard") && styles.active]}
        onPress={() => router.replace("/admin/dashboard")}
      >
        <Ionicons name="home-outline" size={26} />
      </Pressable>

      {/* LIST MENU */}
      <Pressable
        style={[styles.item, isActive("/admin/list_menu") && styles.active]}
        onPress={() => router.replace("/admin/list_menu")}
      >
        <MaterialCommunityIcons name="book-open-variant" size={26} />
      </Pressable>

      {/* ORDER */}
      <Pressable
        style={[styles.item, isActive("/admin/list_meja") && styles.active]}
        onPress={() => router.replace("/admin/list_meja")}
      >
        <MaterialCommunityIcons name="table-chair" size={26} />
      </Pressable>

      {/* PROFILE */}
      <Pressable style={[styles.item, isActive("/admin/list_user") && styles.active]}
        onPress={() => router.replace("/admin/list_user")}
      >
        <Ionicons name="person-outline" size={26} />
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
  },
  item: {
    padding: 10,
    borderRadius: 20,
  },
  active: {
    backgroundColor: "#DCF7E3",
  },
});
