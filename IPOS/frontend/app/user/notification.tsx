import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrder } from "../components/orderContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import CustomAlert from "../components/customAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationPage() {
  const router = useRouter();
  const { cart, orderType, tableNumber, orderStatus, setOrderStatus, setCart } =
    useOrder();

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [showWebView, setShowWebView] = useState(false);
  const [snapUrl, setSnapUrl] = useState("");
  const [showMejaModal, setShowMejaModal] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "" });
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "success" as "success" | "error" | "warning",
    title: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 1. REFRESH STATUS
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "http://10.0.2.2:3000/api/payment/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      if (response.ok && data.length > 0) {
        const latestOrder = data[0];
        if (latestOrder.status_order === "sudah") setOrderStatus("paid");
        if (latestOrder.no_antrian_id)
          setQueueNumber(latestOrder.no_antrian_id);
      }
    } catch (error) {
      console.log("Refresh Error:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // 2. CHECKOUT KE MIDTRANS
  const handleProcessPayment = async (method: string) => {
    if (!customerInfo.name || !customerInfo.email) {
      return setAlertConfig({
        visible: true,
        type: "warning",
        title: "Lengkapi data pembayar",
      });
    }

    const generatedAntrian =
      orderType === "take-away" ? Math.floor(Math.random() * 900) + 100 : null;
    setQueueNumber(generatedAntrian);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "http://10.0.2.2:3000/api/payment/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: total,
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
            payment_type: method,
            items: cart,
            meja_id: orderType === "dine-in" ? tableNumber : null,
            order_type: orderType,
            no_antrian_id: generatedAntrian,
          }),
        },
      );

      const data = await response.json();
      if (response.ok && data.redirect_url) {
        setSnapUrl(data.redirect_url);
        setModalVisible(false);
        setShowWebView(true);
      } else {
        throw new Error(data.message || "Gagal membuat transaksi");
      }
    } catch (error: any) {
      setAlertConfig({ visible: true, type: "error", title: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = () => {
    if (orderType === "dine-in") {
      setShowMejaModal(true);
    } else {
      Alert.alert(
        "Download Berhasil",
        `Nomor Antrian #${queueNumber || "101"} telah disimpan ke galeri ponsel Anda.`,
        [{ text: "OK", onPress: () => setOrderStatus("checked-in") }],
      );
    }
  };

  const handleFinishEating = async () => {
    setLoading(true); 
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://10.0.2.2:3000/api/meja/${tableNumber}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "dibersihkan" }),
        },
      );

      if (response.ok) {
        setShowMejaModal(false);
        setAlertConfig({
          visible: true,
          type: "success",
          title: `Meja ${tableNumber} ditandai untuk dibersihkan.`,
        });
        setOrderStatus("checked-in");
      } else {
        throw new Error("Gagal memperbarui status meja");
      }
    } catch (error) {
      setAlertConfig({ visible: true, type: "error", title: "Koneksi Gagal" });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAgain = () => {
    setCart([]);
    setOrderStatus("pending");
    router.replace("/user/dashboard");
  };

  if (showWebView && snapUrl) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.webviewHeader}>
          <TouchableOpacity onPress={() => setShowWebView(false)}>
            <Ionicons name="close" size={28} color="red" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pembayaran</Text>
          <View style={{ width: 28 }} />
        </View>
        <WebView
          source={{ uri: snapUrl }}
          onNavigationStateChange={(nav) => {
            if (
              nav.url.includes("status_code=200") ||
              nav.url.includes("settlement")
            ) {
              setShowWebView(false);
              setOrderStatus("paid");
              setAlertConfig({
                visible: true,
                type: "success",
                title: "Pembayaran Berhasil!",
              });
            }
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerTop}>
        {orderStatus === "pending" ? (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0C513F" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}

        <Text style={styles.headerTitle}>Status Pesanan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1F8A45"]}
          />
        }
      >
        <View style={styles.infoCard}>
          <View>
            <Text style={styles.infoLabel}>Metode Pesanan</Text>
            <Text style={styles.infoValue}>
              {orderType === "dine-in" ? "Makan di Tempat" : "Bawa Pulang"}
            </Text>
            {queueNumber && (
              <Text style={styles.queueText}>No. Antrian: #{queueNumber}</Text>
            )}
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  orderType === "dine-in" ? "#1F8A45" : "#007AFF",
              },
            ]}
          >
            <Text style={styles.badgeText}>
              {orderType === "dine-in" ? tableNumber : "TA"}
            </Text>
            <Text style={styles.badgeSub}>
              {orderType === "dine-in" ? "MEJA" : "TAKEAWAY"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rincian Menu</Text>
          {cart.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.textGray}>
                {item.name} x{item.qty}
              </Text>
              <Text style={styles.textBold}>
                Rp {(item.price * item.qty).toLocaleString("id-ID")}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Bayar</Text>
            <Text style={styles.totalValue}>
              Rp {total.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <MaterialCommunityIcons
            name={
              orderStatus === "paid" || orderStatus === "checked-in"
                ? "check-circle"
                : "clock-fast"
            }
            size={50}
            color={
              orderStatus === "paid" || orderStatus === "checked-in"
                ? "#1F8A45"
                : "#F59E0B"
            }
          />
          <Text
            style={[
              styles.statusMainText,
              {
                color:
                  orderStatus === "paid" || orderStatus === "checked-in"
                    ? "#1F8A45"
                    : "#F59E0B",
              },
            ]}
          >
            {orderStatus === "paid"
              ? "Pesanan Siap / Ditempati"
              : orderStatus === "checked-in"
                ? "Selesai / Dibersihkan"
                : "Menunggu Pembayaran"}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {orderStatus === "pending" && (
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.btnText}>Pilih Metode Pembayaran</Text>
          </TouchableOpacity>
        )}

        {orderStatus === "paid" && (
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: "#1F8A45" }]}
            onPress={handleCheckIn}
          >
            <MaterialCommunityIcons
              name="login-variant"
              size={20}
              color="#fff"
            />
            <Text style={[styles.btnText, { marginLeft: 10 }]}>
              Check-In / Selesai Makan
            </Text>
          </TouchableOpacity>
        )}

        {orderStatus === "checked-in" && (
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: "#333" }]}
            onPress={handleOrderAgain}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={[styles.btnText, { marginLeft: 10 }]}>Pesan Lagi</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* MODAL INPUT DATA */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Informasi Pembayaran</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nama"
              value={customerInfo.name}
              onChangeText={(t) =>
                setCustomerInfo({ ...customerInfo, name: t })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={customerInfo.email}
              onChangeText={(t) =>
                setCustomerInfo({ ...customerInfo, email: t })
              }
            />
            <TouchableOpacity
              style={styles.btnPayment}
              onPress={() => handleProcessPayment("gopay")}
            >
              <Text style={styles.btnPaymentText}>Bayar Sekarang</Text>
              {loading && <ActivityIndicator size="small" color="#00AED6" />}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL POPUP MEJA (Selesai Makan) */}
      <Modal visible={showMejaModal} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.modalContentSmall}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="silverware-clean"
                size={40}
                color="#1F8A45"
              />
            </View>
            <Text style={styles.modalTitleCenter}>Meja {tableNumber}</Text>
            <Text style={styles.modalDescCenter}>
              Apakah Anda sudah selesai makan? Status meja akan diubah menjadi
              **Dibersihkan**.
            </Text>

            <TouchableOpacity
              style={styles.btnSuccess}
              onPress={handleFinishEating}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Selesai Makan</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowMejaModal(false)}
              style={{ marginTop: 15 }}
            >
              <Text style={styles.cancelText}>Belum</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAF9" },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#0C513F" },
  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
    elevation: 5,
  },
  infoLabel: { color: "#999", fontSize: 12 },
  infoValue: { fontSize: 18, fontWeight: "bold" },
  queueText: { color: "#007AFF", fontWeight: "bold" },
  badge: {
    width: 70,
    height: 70,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  badgeSub: { color: "#fff", fontSize: 8, fontWeight: "bold" },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  textGray: { color: "#666" },
  textBold: { fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: "bold" },
  totalValue: { fontSize: 20, fontWeight: "bold", color: "#1F8A45" },
  statusContainer: { alignItems: "center", padding: 20 },
  statusMainText: { fontSize: 16, fontWeight: "bold", marginTop: 12 },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#EEE",
  },
  btnPrimary: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 25,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalContentSmall: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 25,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  modalTitleCenter: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  modalDescCenter: { color: "#666", textAlign: "center", marginBottom: 20 },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  btnPayment: {
    borderColor: "#00AED6",
    borderWidth: 1.5,
    padding: 16,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPaymentText: { fontWeight: "bold", color: "#00AED6", marginRight: 10 },
  btnSuccess: {
    backgroundColor: "#1F8A45",
    padding: 18,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  cancelText: { color: "#999", fontWeight: "bold" },
  iconCircle: {
    width: 80,
    height: 80,
    backgroundColor: "#E8F5E9",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  webviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
    backgroundColor: "#fff",
  },
});