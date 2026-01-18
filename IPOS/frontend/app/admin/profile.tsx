import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../components/customAlert";

export default function ProfileAdmin() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "success" as "success" | "error" | "warning",
    title: "",
  });

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, []),
  );

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (jsonValue !== null && token) {
        const user = JSON.parse(jsonValue);

        setUserData(user);
        setUserName(user.nama);
        setUserEmail(user.email);
        setUserPhoto(user.foto);

        const response = await fetch(
          `http://10.0.2.2:3000/api/admin/profile/${user.id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const result = await response.json();
        if (response.ok) {
          setUserData(result.user);
          setUserName(result.user.nama);
          setUserEmail(result.user.email);
          setUserPhoto(result.user.foto);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleDeleteRequest = () => setShowConfirmModal(true);

  const proceedToPassword = () => {
    setShowConfirmModal(false);
    setShowPasswordModal(true);
  };

  const handleSubmitDelete = async () => {
    if (!passwordInput) return;

    try {
      const userData = await AsyncStorage.getItem("user");
      const user = JSON.parse(userData!);
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `http://10.0.2.2:3000/api/admin/delete-account/${user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: passwordInput }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setShowPasswordModal(false);
        setAlertConfig({
          visible: true,
          type: "success",
          title: "Akun Berhasil Dihapus",
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server");
    }
  };

  const handleFinalOk = async () => {
    setAlertConfig({ ...alertConfig, visible: false });
    if (alertConfig.type === "error" || alertConfig.type === "success") {
      await AsyncStorage.clear();
      router.replace("/login");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={handleFinalOk}
        onConfirm={handleFinalOk}
      />

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

      {/* MODAL PASSWORD DELETE */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.passwordBox}>
            <TouchableOpacity
              onPress={() => setShowPasswordModal(false)}
              style={styles.backBtnModal}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitleSmall}>
              Masukan password untuk menghapus akun
            </Text>
            <View style={styles.inputGroupModal}>
              <Text style={styles.labelSmall}>Password</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry
                value={passwordInput}
                onChangeText={setPasswordInput}
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

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/admin/dashboard")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Account Setting</Text>
          </View>

          {/* Penyeimbang agar judul tetap di tengah */}
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.profileSection}>
          <Image
            source={
              userPhoto
                ? { uri: `http://10.0.2.2:3000/avatars/${userPhoto}` } // URL yang sudah diperbaiki
                : require("../assets/default-avatar.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.displayUsername}>{userName || "Admin"}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={userEmail}
              editable={false}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value="********"
              secureTextEntry
              editable={false}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.btnEdit}
            onPress={() => {
              // Gunakan userData.id jika ada, jika tidak ada gunakan data dari storage langsung
              if (userData && userData.id) {
                router.push({
                  pathname: "/admin/edit_profile",
                  params: { id: String(userData.id) },
                });
              } else {
                // Jika masih null, coba ambil ID langsung dari AsyncStorage lagi atau tampilkan loading
                alert("Sedang menyinkronkan data, silakan tunggu sebentar...");
              }
            }}
          >
            <Text style={styles.btnText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={handleDeleteRequest}
          >
            <Text style={styles.btnText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 30,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: -1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  backButton: {
    padding: 5,
    zIndex: 1,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E1E1E1",
    marginBottom: 15,
  },
  displayUsername: {
    fontSize: 22,
    fontWeight: "bold",
  },
  form: {
    width: "100%",
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#555",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
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
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
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
  modalButtons: {
    flexDirection: "row",
    gap: 15,
  },
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
  btnTextModal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backBtnModal: {
    alignSelf: "flex-start",
  },
  inputGroupModal: {
    marginBottom: 20,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 15,
  },
  btnSubmitDelete: {
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
});