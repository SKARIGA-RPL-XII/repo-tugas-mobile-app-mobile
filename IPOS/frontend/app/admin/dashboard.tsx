import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { router, useRouter } from "expo-router";
import { Image } from "react-native";
import AdminFooter from "../components/adminFooter";

export default function AdminDashboard() {
  const [showMenu, setShowMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.nama);
        setUserPhoto(user.foto);
      }
    };

    getUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Dashboard</Text>

            <View style={styles.headerRight}>
              <Pressable
                style={styles.userButton}
                onPress={() => setShowMenu(!showMenu)}
              >
                <Image
                  source={
                    userPhoto
                      ? { uri: `http://10.0.2.2:3000/uploads/${userPhoto}` }
                      : require("../assets/default-avatar.png")
                  }
                  style={styles.avatar}
                />
                <Text style={styles.userName}>{userName}</Text>
                <Ionicons name="chevron-down" size={16} color="black" />
              </Pressable>

              {showMenu && (
                <View style={styles.dropdownMenu}>
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={async () => {
                      await AsyncStorage.removeItem("token");
                      await AsyncStorage.removeItem("user");
                      setShowMenu(false);
                      router.replace("/login");
                    }}
                  >
                    <Ionicons name="log-out-outline" size={18} color="black" />
                    <Text style={styles.dropdownText}>Logout</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>

          {/* CARD STATISTIK */}
          <View style={styles.cardRow}>
            <StatCard
              title="Jumlah User"
              value="16"
              icon="account-group"
              trend="^1"
            />
            <StatCard title="Jumlah Menu" value="16" icon="book-open-variant" />
            <StatCard title="Jumlah Order" value="16" icon="table-chair" />
          </View>

          {/* PENGHASILAN */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Penghasilan</Text>

            <View style={styles.dropdown}>
              <Picker selectedValue="Januari">
                <Picker.Item label="Januari" value="Januari" />
                <Picker.Item label="Februari" value="Februari" />
                <Picker.Item label="Maret" value="Maret" />
              </Picker>
            </View>

            {/* PLACEHOLDER CHART */}
            <View style={styles.chart}>
              <Text style={styles.chartText}>Chart Penghasilan</Text>
            </View>
          </View>
        </ScrollView>

        <AdminFooter />
      </View>
    </SafeAreaView>
  );
}

/* ===== KOMPONEN CARD ===== */
interface StatCardProps {
  title: string;
  value: string;
  icon: any;
  trend?: string;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <MaterialCommunityIcons name={icon} size={18} color="black" />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <View style={styles.statValueContainer}>
        <Text style={styles.statValue}>{value}</Text>
        {trend && <Text style={styles.statTrend}>{trend}</Text>}
      </View>
      <View style={styles.statFooter}>
        <Text style={styles.statFooterText}>Update</Text>
      </View>
    </View>
  );
}

/* ===== STYLE ===== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "31%",
    backgroundColor: "#FFF9B1",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
    overflow: "hidden",
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    gap: 4,
  },
  statTitle: {
    fontSize: 10,
    fontWeight: "600",
  },
  statValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statTrend: {
    fontSize: 16,
    fontWeight: "700",
  },
  statFooter: {
    borderTopWidth: 1,
    borderColor: "#000",
    padding: 2,
    paddingLeft: 6,
  },
  statFooterText: {
    fontSize: 9,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  chart: {
    height: 200,
    backgroundColor: "#D1D5DB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chartText: {
    color: "#4B5563",
    fontWeight: "600",
  },
  headerRight: {
    marginLeft: "auto",
    position: "relative",
  },

  userButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },

  userName: {
    fontSize: 14,
    fontWeight: "600",
  },

  dropdownMenu: {
    position: "absolute",
    top: 40,
    right: 0,
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
    zIndex: 10,
  },

  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },

  dropdownText: {
    fontSize: 14,
    fontWeight: "500",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});