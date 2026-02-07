import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Image } from "react-native";
import AdminFooter from "../components/adminFooter";
import CustomAlert from "../components/customAlert";

export default function AdminDashboard() {
  const [showMenu, setShowMenu] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [latestOrders, setLatestOrders] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("January");

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "warning" as "warning" | "success" | "error",
    title: "",
    onConfirm: undefined as (() => void) | undefined,
  });

  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMenus: 0,
    totalTables: 0,
  });

  // Ambil total uang berdasarkan pilihan picker (Format tanpa desimal)
  const currentMonthIncome =
    incomeData.find((i) => i.bulan === selectedMonth)?.total || 0;

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await fetch(`http://10.0.2.2:3000/api/admin/stats`);
      const data = await response.json();

      if (response.ok) {
        setStats({
          totalUsers: data.totalUsers || 0,
          totalMenus: data.totalMenus || 0,
          totalTables: data.totalTables || 0,
        });
        setLatestOrders(data.latestOrders || []);
        setIncomeData(data.monthlyIncome || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoadingStats(false);
    }
  };

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
    fetchStats();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const confirmLogout = async () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/login");
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogoutRequest = () => {
    setShowMenu(false);
    setAlertConfig({
      visible: true,
      type: "warning",
      title: "Apakah Anda yakin ingin Logout?",
      onConfirm: confirmLogout,
    });
  };

  // Helper untuk format Rupiah tanpa desimal (.00)
  const formatCurrency = (amount: number) => {
    return Number(amount).toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <CustomAlert
          visible={alertConfig.visible}
          type={alertConfig.type}
          title={alertConfig.title}
          onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
          onConfirm={alertConfig.onConfirm}
        />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <View style={styles.headerRight}>
              <Pressable style={styles.userButton} onPress={() => setShowMenu(!showMenu)}>
                <Image
                  source={
                    userPhoto
                      ? { uri: `http://10.0.2.2:3000/public/avatars/${userPhoto}` }
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
                    onPress={() => { setShowMenu(false); router.push("/admin/profile"); }}
                  >
                    <Ionicons name="person-outline" size={18} color="black" />
                    <Text style={styles.dropdownText}>Profile</Text>
                  </Pressable>
                  <View style={styles.dropdownDivider} />
                  <Pressable style={styles.dropdownItem} onPress={handleLogoutRequest}>
                    <Ionicons name="log-out-outline" size={18} color="#FF3B30" />
                    <Text style={[styles.dropdownText, { color: "#FF3B30" }]}>Logout</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>

          {/* STATS CARDS */}
          <View style={styles.cardRow}>
            {loadingStats ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <StatCard title="Jumlah User" value={stats.totalUsers.toString()} icon="account-group" />
                <StatCard title="Jumlah Menu" value={stats.totalMenus.toString()} icon="book-open-variant" />
                <StatCard title="Jumlah Meja" value={stats.totalTables.toString()} icon="table-chair" />
              </>
            )}
          </View>

          {/* INCOME SECTION (CHART) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Penghasilan Bulanan</Text>
            <View style={styles.dropdown}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(val) => setSelectedMonth(val)}
              >
                <Picker.Item label="January" value="January" />
                <Picker.Item label="February" value="February" />
                <Picker.Item label="March" value="March" />
                <Picker.Item label="April" value="April" />
                <Picker.Item label="May" value="May" />
                <Picker.Item label="June" value="June" />
              </Picker>
            </View>

            <View style={styles.chartContainer}>
              <View style={styles.barWrapper}>
                {incomeData.length > 0 ? (
                  incomeData.map((data, index) => {
                    const maxIncome = Math.max(...incomeData.map((i) => i.total), 1);
                    const barHeight = (data.total / maxIncome) * 150;
                    return (
                      <View key={index} style={styles.barGroup}>
                        <View
                          style={[
                            styles.bar,
                            {
                              height: barHeight,
                              backgroundColor: data.bulan === selectedMonth ? "#1F8A45" : "#A5D6A7",
                            },
                          ]}
                        />
                        <Text style={styles.barLabel}>{data.bulan.substring(0, 3)}</Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={{ color: "#999" }}>Data tidak tersedia</Text>
                )}
              </View>
              <View style={styles.incomeBadge}>
                <Text style={styles.incomeBadgeTitle}>Total {selectedMonth}</Text>
                <Text style={styles.incomeBadgeValue}>Rp {formatCurrency(currentMonthIncome)}</Text>
              </View>
            </View>
          </View>

          {/* LATEST ORDERS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Terbaru (Sukses)</Text>
            {loadingStats ? (
              <ActivityIndicator color="#000" />
            ) : latestOrders.length > 0 ? (
              latestOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  title={`Order #${order.id}`}
                  time={new Date(order.created_at).toLocaleTimeString()}
                  items={order.items || "Tanpa menu"}
                  total={formatCurrency(order.total_harga)}
                />
              ))
            ) : (
              <Text style={{ textAlign: "center", color: "#999", marginTop: 10 }}>Belum ada order sukses</Text>
            )}
          </View>
        </ScrollView>
        <AdminFooter />
      </View>
    </SafeAreaView>
  );
}

// SUB-COMPONENTS
function StatCard({ title, value, icon }: { title: string; value: string; icon: any }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <MaterialCommunityIcons name={icon} size={18} color="black" />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <View style={styles.statValueContainer}>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <View style={styles.statFooter}><Text style={styles.statFooterText}>Update</Text></View>
    </View>
  );
}

function OrderCard({ title, time, items, total }: { title: string; time: string; items: string; total: string }) {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>{title}</Text>
        <Text style={styles.orderTime}>{time}</Text>
      </View>
      <Text style={styles.orderItems} numberOfLines={2}>
        <Text style={{ fontWeight: "700" }}>Menu: </Text>{items}
      </Text>
      <Text style={styles.orderTotal}>Rp {total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  mainContainer: { flex: 1 },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "700" },
  headerRight: { marginLeft: "auto", position: "relative" },
  userButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: "#F3F4F6" },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#ddd" },
  userName: { fontSize: 14, fontWeight: "600" },
  dropdownMenu: { position: "absolute", top: 45, right: 0, width: 150, backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", elevation: 10, zIndex: 999 },
  dropdownItem: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12 },
  dropdownText: { fontSize: 14, fontWeight: "500" },
  dropdownDivider: { height: 1, backgroundColor: "#E5E7EB" },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  statCard: { width: "31%", backgroundColor: "#FFF9B1", borderRadius: 8, borderWidth: 1, borderColor: "#000", overflow: "hidden" },
  statCardHeader: { flexDirection: "row", alignItems: "center", padding: 6, gap: 4 },
  statTitle: { fontSize: 10, fontWeight: "600" },
  statValueContainer: { paddingHorizontal: 8, paddingBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "700" },
  statFooter: { borderTopWidth: 1, borderColor: "#000", padding: 2, paddingLeft: 6 },
  statFooterText: { fontSize: 9 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  dropdown: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 16, backgroundColor: "#fff" },
  chartContainer: { backgroundColor: "#fff", borderRadius: 15, padding: 15, borderWidth: 1, borderColor: "#EEE", elevation: 3 },
  barWrapper: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", height: 180, paddingBottom: 10 },
  barGroup: { alignItems: "center", width: 45 },
  bar: { width: 22, borderRadius: 4, marginBottom: 5 },
  barLabel: { fontSize: 10, color: "#666", fontWeight: "bold" },
  incomeBadge: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#EEE", alignItems: "center" },
  incomeBadgeTitle: { fontSize: 12, color: "#666" },
  incomeBadgeValue: { fontSize: 20, fontWeight: "bold", color: "#1F8A45" },
  orderCard: { backgroundColor: "#F3F4F6", borderRadius: 14, padding: 14, marginBottom: 12 },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  orderTitle: { fontSize: 16, fontWeight: "700" },
  orderTime: { fontSize: 12, color: "#6B7280" },
  orderItems: { fontSize: 14, color: "#374151", marginBottom: 4 },
  orderTotal: { fontSize: 14, fontWeight: "bold", color: "#1F8A45", textAlign: "right" },
});