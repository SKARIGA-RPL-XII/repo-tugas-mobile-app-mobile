import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽 The Cozy Plate</Text>
      <Text style={styles.subtitle}>Self Service Restaurant</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/menu')}>
        <Text style={styles.buttonText}>Mulai Pesan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/login')}>
        <Text style={styles.secondaryButtonText}>Login Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B2E2E',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: '#7B5E57',
  },
  button: {
    backgroundColor: '#D35400',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#D35400',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#D35400',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
