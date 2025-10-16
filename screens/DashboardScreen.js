import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { mockChats } from '../data/mockData';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Briefly</Text>
      
      <TouchableOpacity 
        style={styles.askButton}
        onPress={() => navigation.navigate('Voice')}
      >
        <Text style={styles.askText}>Ask Briefly about meetings</Text>
      </TouchableOpacity>

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
    backgroundColor: '#0F172A',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#60A5FA',
    marginBottom: 30,
  },
  askButton: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#60A5FA',
    marginBottom: 30,
  },
  askText: {
    color: '#60A5FA',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  historySection: {
    flex: 1,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
  },
  chatItem: {
    backgroundColor: '#1E293B',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  chatTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  chatTime: {
    color: '#64748B',
    fontSize: 12,
  },
});
