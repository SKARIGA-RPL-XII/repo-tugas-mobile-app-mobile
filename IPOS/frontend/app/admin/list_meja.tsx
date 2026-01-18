import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AdminFooter from "../components/adminFooter";

export default function ListTableAdmin() {
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://10.0.2.2:3000/api/meja"; 

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setTables(data);
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil data dari server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>List Table</Text>
          
          <TouchableOpacity 
            style={styles.btnConfig}
            onPress={() => router.push("/admin/config_meja")}
          >
            <Ionicons name="settings-outline" size={20} color="white" />
            <Text style={styles.btnConfigText}>Konfigurasi Meja</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableWrapper}>
          {loading ? (
            <ActivityIndicator size="large" color="#1D8F49" style={{ marginTop: 20 }} />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.tableHeader}>
                <View style={[styles.cell, styles.colId]}>
                  <Text style={styles.headerText}>ID</Text>
                </View>
                <View style={[styles.cell, styles.colMeja]}>
                  <Text style={styles.headerText}>No.Meja</Text>
                </View>
                <View style={[styles.cell, styles.colStatus]}>
                  <Text style={styles.headerText}>Status</Text>
                </View>
                <View style={[styles.cell, styles.colTime]}>
                  <Text style={styles.headerText}>Time Update</Text>
                </View>
              </View>

              {tables.map((item) => (
                <View key={item.id} style={styles.row}>
                  <View style={[styles.cell, styles.colId]}>
                    <Text style={styles.rowText}>{item.id}</Text>
                  </View>
                  <View style={[styles.cell, styles.colMeja]}>
                    <Text style={[styles.rowText, styles.boldText]}>{item.no_meja}</Text>
                  </View>
                  <View style={[styles.cell, styles.colStatus]}>
                    <Text style={[styles.rowText, styles.boldText]}>{item.status.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.cell, styles.colTime]}>
                    <Text style={[styles.rowText, styles.boldText]}>-</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
      <AdminFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  btnConfig: {
    flexDirection: "row",
    backgroundColor: "#1D8F49",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignItems: "center",
    gap: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  btnConfigText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  tableWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#C1F2B0",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  cell: {
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  rowText: {
    fontSize: 13,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  colId: { width: "15%" },
  colMeja: { width: "20%" },
  colStatus: { width: "35%" },
  colTime: { width: "30%", borderRightWidth: 0 }, 
});