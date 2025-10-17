import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { mockChats } from '../data/mockData';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Briefly</Text>
      
      <Text style={styles.greeting}>Good morning! Matt 👋</Text>
      <Text style={styles.subtitle}>Let's see what I can do for you?</Text>

      <View style={styles.card}>
        <Image source={require('../assets/chat.png')} style={styles.cardImage} />
        <Text style={styles.cardTitle}>Ask Briefly about meetings</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('Voice')}
        >
          <Text style={styles.createButtonText}>Create new</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>PREVIOUS CHATS</Text>
        <FlatList
          data={mockChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.chatItem}>
              <Text style={styles.chatTitle}>{item.summary}</Text>
              <Text style={styles.chatTime}>{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D2E',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '400',
    color: '#8B92B0',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 28,
    lineHeight: 30,
  },
  card: {
    backgroundColor: '#2D3348',
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#3A4057',
  },
  cardImage: {
    width: 48,
    height: 48,
    marginBottom: 16,
    tintColor: '#8B92B0',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#5B6FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  historySection: {
    flex: 1,
  },
  sectionTitle: {
    color: '#8B92B0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  chatItem: {
    backgroundColor: '#252A3F',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  chatTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
  },
  chatTime: {
    color: '#6B7280',
    fontSize: 13,
  },
});
