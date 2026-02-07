import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserFooter from "../components/userFooter";
import CustomAlert from "../components/customAlert";

const BASE_URL = "http://10.0.2.2:3000";

export default function UserProfile() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [passwordInput, setPasswordInput] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "success" as "success" | "error" | "warning",
    title: "",
  });

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, []),
  );

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const jsonValue = await AsyncStorage.getItem("user");
      if (jsonValue !== null) {
        const user = JSON.parse(jsonValue);
        const response = await fetch(`${BASE_URL}/api/user/profile/${user.id}`);
        const result = await response.json();

        if (response.ok) {
          setUserData(result);
        } else {
          setUserData(user);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutAlert(false);
    await AsyncStorage.clear();
    router.replace("/login");
  };

  const proceedToPassword = () => {
    setShowConfirmModal(false);
    setShowPasswordModal(true);
  };

  const handleSubmitDelete = async () => {
  if (!passwordInput) return;

  try {
    setIsLoading(true);
    
    const jsonUser = await AsyncStorage.getItem("user");
    const token = await AsyncStorage.getItem("token");
    
    if (!jsonUser || !token) {
      setIsLoading(false);
      alert("Sesi habis, silakan login kembali");
      return;
    }

    const userObj = JSON.parse(jsonUser);
    const userId = userObj.id; 


    const response = await fetch(`${BASE_URL}/api/user/delete/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ password: passwordInput }),
    });

    const result = await response.json();

    if (response.ok) {
      setShowPasswordModal(false);
      setPasswordInput("");
      setAlertConfig({
        visible: true,
        type: "success",
        title: "Akun Berhasil Dihapus",
      });
    } else {
      setIsLoading(false);
      setAlertConfig({
        visible: true,
        type: "warning",
        title: result.message || "Gagal menghapus akun",
      });
    }
  } catch (error) {
    setIsLoading(false);
    setAlertConfig({
      visible: true,
      type: "error",
      title: "Terjadi kesalahan koneksi",
    });
  }
};

  const handleAlertClose = async () => {
    const currentType = alertConfig.type;
    setAlertConfig({ ...alertConfig, visible: false });

    if (currentType === "success") {
      await AsyncStorage.clear();
      router.replace("/login");
    }
  };

  if (isLoading && !userData) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1F8A45" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* CUSTOM ALERT UTAMA */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={handleAlertClose}
        onConfirm={handleAlertClose}
      />

      {/* ALERT LOGOUT */}
      <CustomAlert
        visible={showLogoutAlert}
        type="warning"
        title="Apakah Anda yakin ingin logout?"
        onClose={() => setShowLogoutAlert(false)}
        onConfirm={handleLogout}
      />

      {/* 3. MODAL KONFIRMASI DELETE (YES/NO) */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.modalText}>
              Apakah anda yakin ingin menghapus akun ini?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnYes}
                onPress={proceedToPassword}
              >
                <Text style={styles.btnTextModal}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnNo}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.btnTextModal}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 4. MODAL INPUT PASSWORD */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.passwordBox}>
            <TouchableOpacity
              onPress={() => {
                setShowPasswordModal(false);
                setPasswordInput("");
              }}
              style={styles.backBtnModal}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitleSmall}>
              Masukkan password untuk menghapus akun
            </Text>
            <View style={styles.inputGroupModal}>
              <Text style={styles.labelSmall}>Password</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry
                value={passwordInput}
                onChangeText={setPasswordInput}
                placeholder="Password"
              />
            </View>
            <TouchableOpacity
              style={styles.btnSubmitDelete}
              onPress={handleSubmitDelete}
            >
              <Text style={styles.btnTextModal}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account Setting</Text>
        </View>

        <View style={styles.profileHeaderSection}>
          <Image
            source={
              userData?.foto && userData.foto !== "default-avatar.png"
                ? { uri: `${BASE_URL}/public/avatars/${userData.foto}` }
                : require("../assets/default-avatar.png")
            }
            style={styles.avatarImg}
          />
          <Text style={styles.userNameDisplay}>{userData?.nama || "User"}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={userData?.email}
              editable={false}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nomor Telepon</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={userData?.no_telepon}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.btnEdit}
            onPress={() =>
              router.push({
                pathname: "/user/edit_profile",
                params: { id: userData?.id },
              })
            }
          >
            <Text style={styles.btnText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={() => setShowConfirmModal(true)}
          >
            <Text style={styles.btnText}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnLogout}
            onPress={() => setShowLogoutAlert(true)}
          >
            <Text style={styles.btnLogoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <UserFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7F6" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 25, paddingBottom: 120 },
  header: { alignItems: "center", marginBottom: 30 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#111" },
  profileHeaderSection: { alignItems: "center", marginBottom: 30 },
  avatarImg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E1E1E1",
    marginBottom: 15,
  },
  userNameDisplay: { fontSize: 22, fontWeight: "bold", color: "#000" },
  form: { width: "100%", marginBottom: 30 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 8 },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#F9F9F9",
    color: "#777",
    borderColor: "#CCC",
  },
  actionSection: { gap: 15 },
  btnEdit: {
    backgroundColor: "#C4C4C4",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  btnDelete: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  btnLogout: { alignItems: "center", marginTop: 10 },
  btnLogoutText: { color: "#FF4D4D", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  passwordBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  modalTitleSmall: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  modalButtons: { flexDirection: "row", gap: 15 },
  btnYes: {
    backgroundColor: "#E30016",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  btnNo: {
    backgroundColor: "#1D8F49",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  btnTextModal: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  backBtnModal: { alignSelf: "flex-start" },
  inputGroupModal: { marginBottom: 20 },
  labelSmall: { fontSize: 12, fontWeight: "bold", marginBottom: 5 },
  modalInput: {
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 15,
  },
  btnSubmitDelete: {
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
});