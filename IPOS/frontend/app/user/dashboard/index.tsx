import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function UserDashboard() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER & SEARCH */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <Ionicons name="search" size={20} color="#999" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNER PROMO */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.bannerImage}
          />
        </View>

        {/* KATEGORI */}
        <View style={styles.categoryRow}>
          <TouchableOpacity style={[styles.catCircle, styles.catActive]}>
             <MaterialCommunityIcons name="hamburger" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.catCircle}>
             <MaterialCommunityIcons name="food-apple" size={24} color="#FFA500" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.catCircle}>
             <MaterialCommunityIcons name="cupcake" size={24} color="#FF69B4" />
          </TouchableOpacity>
        </View>

        {/* MENU SECTION */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu Makanan</Text>
          
          <View style={styles.menuGrid}>
            <MenuCard 
              name="Chicken Burger" 
              desc="Cheesy Mozarella" 
              price="12,000" 
              isHot={true}
            />
            <MenuCard 
              name="Chicken Burger" 
              desc="Cheesy Mozarella" 
              price="12,000" 
              isHot={false}
            />
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navActive}>
          <Ionicons name="home-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartIcon}>
          <Ionicons name="cart-outline" size={24} color="black" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>4</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ===== SUB-KOMPONEN MENU CARD ===== */
function MenuCard({ name, desc, price, isHot }: { name: string, desc: string, price: string, isHot: boolean }) {
  return (
    <View style={styles.card}>
      {isHot && (
        <View style={styles.hotBadge}>
          <Text>🔥</Text>
        </View>
      )}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.menuImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.menuName}>{name}</Text>
        <Text style={styles.menuDesc}>{desc}</Text>
        <Text style={styles.menuPrice}><Text style={{fontSize: 10}}>Rp</Text> {price}</Text>
      </View>
    </View>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  bannerContainer: {
    padding: 16,
  },
  bannerImage: {
    width: '100%',
    height: 180,
    borderRadius: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  catCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DCF7E3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catActive: {
    backgroundColor: '#22C55E',
    borderWidth: 3,
    borderColor: '#DCF7E3',
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#DCF7E3',
    borderRadius: 20,
    padding: 10,
    paddingTop: 0,
    alignItems: 'center',
    marginBottom: 20,
  },
  hotBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    elevation: 3,
    zIndex: 1,
  },
  menuImage: {
    width: 100,
    height: 100,
    marginTop: -20,
  },
  cardInfo: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 5,
  },
  menuName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  menuDesc: {
    fontSize: 10,
    color: '#666',
    marginVertical: 4,
  },
  menuPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#166534',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  navActive: {
    backgroundColor: '#DCF7E3',
    padding: 10,
    borderRadius: 20,
  },
  cartIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#DCF7E3',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});