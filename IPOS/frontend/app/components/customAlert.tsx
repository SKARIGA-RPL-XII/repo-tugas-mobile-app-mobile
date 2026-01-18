import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomAlertProps {
  visible: boolean;
  type: "warning" | "success" | "error";
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function CustomAlert({
  visible,
  type,
  title,
  onClose,
  onConfirm,
}: CustomAlertProps) {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return { name: "alert-circle-outline", color: "#000" };
      case "success":
        return { name: "checkmark-circle-outline", color: "#000" };
      case "error":
        return { name: "close-circle-outline", color: "#000" };
      default:
        return { name: "information-circle-outline", color: "#000" };
    }
  };

  const icon = getIcon();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={alertStyles.overlay}>
        <View style={alertStyles.alertContainer}>
          <Ionicons name={icon.name as any} size={100} color="black" />

          <Text style={alertStyles.title}>{title}</Text>

          <View style={alertStyles.buttonContainer}>
            {type === "warning" && (
              <TouchableOpacity
                style={[alertStyles.button, { backgroundColor: "#ddd" }]}
                onPress={onClose}
              >
                <Text style={alertStyles.buttonText}>Batal</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                alertStyles.button,
                {
                  backgroundColor: "#FEF987",
                  flex: type === "warning" ? 0 : 1,
                  minWidth: type === "warning" ? 100 : "80%",
                },
              ]}
              onPress={() => {
                if (onConfirm) {
                  onConfirm();
                } else {
                  onClose();
                }
              }}
            >
              <Text style={alertStyles.buttonText}>ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const alertStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 30,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 25,
    textAlign: "center",
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    width: "100%",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 15, 
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    color: "#000",
  },
});