import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; 

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type ViewMode = "main" | "edit";

export default function UserProfile() {
  const { width } = useWindowDimensions();
  const router = useRouter(); // <--- 2. Inisialisasi Router
  
  // State navigasi internal & Modal
  const [viewMode, setViewMode] = useState<ViewMode>("main");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Responsive metrics
  const screenPadding = clamp(width * 0.05, 16, 24);
  const avatarSize = clamp(width * 0.35, 120, 160);
  const smallAvatarSize = clamp(width * 0.2, 80, 100);

  // Form State
  const [formData, setFormData] = useState({
    username: "Username",
    email: "email@example.com",
    password: "",
  });

  // --- RENDER FUNCTIONS ---

  // 1. Tampilan Utama (Account Setting)
  const renderMainView = () => (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingHorizontal: screenPadding }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* FUNGSI BACK DIPASANG DI SINI */}
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => router.back()} // <--- 3. Aksi kembali ke Dashboard
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Account Setting</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=600&auto=format&fit=crop" }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <Text style={styles.userNameDisplay}>{formData.username}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={styles.btnEdit} 
          activeOpacity={0.8}
          onPress={() => setViewMode("edit")}
        >
          <Text style={styles.btnEditText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnDelete} 
          activeOpacity={0.8}
          onPress={() => setShowDeleteModal(true)}
        >
          <Text style={styles.btnDeleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // 2. Tampilan Edit (Edit Profile)
  const renderEditView = () => (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingHorizontal: screenPadding }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Edit Profile */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setViewMode("main")}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Konten Form Edit Profile (Sama seperti sebelumnya) */}
      <View style={styles.editAvatarWrapper}>
        <View style={[styles.avatarContainer, { width: smallAvatarSize, height: smallAvatarSize, borderRadius: smallAvatarSize / 2 }]}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=600&auto=format&fit=crop" }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput 
          style={styles.input} 
          value={formData.username}
          onChangeText={(t) => setFormData({...formData, username: t})}
        />
        
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          value={formData.email}
          onChangeText={(t) => setFormData({...formData, email: t})}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          secureTextEntry
          placeholder="********"
        />

        <Text style={styles.label}>Upload Image</Text>
        <TouchableOpacity style={styles.uploadArea}>
          <Text style={styles.uploadText}>Upload File</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnSubmit} onPress={() => setViewMode("main")}>
        <Text style={styles.btnSubmitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {viewMode === "main" ? renderMainView() : renderEditView()}

      {/* Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: width - (screenPadding * 2) }]}>
            <Text style={styles.modalTitle}>Are you sure you want to delete your account?</Text>
            
            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnYes]}
                onPress={() => {
                   console.log("Account Deleted");
                   setShowDeleteModal(false);
                }}
              >
                <Text style={styles.modalBtnText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnNo]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalBtnText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F6",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111", 
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarContainer: {
    backgroundColor: "#C4C4C4",
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "#fff",
  },
  userNameDisplay: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
  },
  editAvatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionSection: {
    gap: 16,
  },
  btnEdit: {
    backgroundColor: "#BFBFBF",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  btnEditText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  btnDelete: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  btnDeleteText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  formGroup: {
    gap: 12,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000",
    marginBottom: -4,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000",
  },
  uploadArea: {
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#000",
  },
  btnSubmit: {
    backgroundColor: "#2ECC71",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  btnSubmitText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 24,
    color: "#000",
    lineHeight: 22,
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  modalBtnYes: {
    backgroundColor: "#E60023",
  },
  modalBtnNo: {
    backgroundColor: "#1F8A45",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});