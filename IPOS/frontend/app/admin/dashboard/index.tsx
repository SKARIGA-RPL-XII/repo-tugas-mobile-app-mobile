import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function AdminDashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View style={styles.header}>
            <Pressable>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </Pressable>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>

          {/* CARD STATISTIK */}
          <View style={styles.cardRow}>
            <StatCard title="Jumlah User" value="16" icon="account-group" trend="^1" />
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

        {/* FOOTER / BOTTOM NAVIGATION */}
        <View style={styles.footer}>
          <Pressable style={styles.footerItemActive}>
            <Ionicons name="home-outline" size={28} color="black" />
          </Pressable>
          <Pressable style={styles.footerItem}>
            <FontAwesome6 name="bowl-food" size={28} color="black" />
          </Pressable>
          <Pressable style={styles.footerItem}>
            <MaterialCommunityIcons name="monitor" size={28} color="black" />
          </Pressable>
          <Pressable style={styles.footerItem}>
            <Ionicons name="person-outline" size={28} color="black" />
          </Pressable>
        </View>
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
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '31%',
    backgroundColor: '#FFF9B1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 4,
  },
  statTitle: {
    fontSize: 10,
    fontWeight: '600',
  },
  statValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statTrend: {
    fontSize: 16,
    fontWeight: '700',
  },
  statFooter: {
    borderTopWidth: 1,
    borderColor: '#000',
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
    fontWeight: '700',
    marginBottom: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  chart: {
    height: 200,
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  /* FOOTER STYLES */
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  footerItem: {
    padding: 8,
  },
  footerItemActive: {
    backgroundColor: '#DCF7E3', // Background hijau muda untuk aktif
    padding: 12,
    borderRadius: 30,
  },
});