import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function AdminDashboard() {
  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      {/* CARD STATISTIK */}
      <View style={styles.cardRow}>
        <StatCard title="Jumlah User" value="16" />
        <StatCard title="Jumlah Menu" value="16" />
        <StatCard title="Jumlah Order" value="16" />
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
  );
}

/* ===== KOMPONEN CARD ===== */
function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

/* ===== STYLE ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '32%',
    backgroundColor: '#FFF9B1',
    borderRadius: 12,
    padding: 12,
  },
  statTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },

  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
  },

  chart: {
    height: 200,
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartText: {
    color: '#999',
  },
});
