import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { mockDashboardData } from '../utils/mockData';

export default function Dashboard({ isOpen, onToggle }) {
  if (!isOpen) {
    return (
      <TouchableOpacity style={styles.toggleClosed} onPress={onToggle}>
        <Text style={styles.toggleText}>☰</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={onToggle}>
          <Text style={styles.toggleText}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <Section title="GitHub" items={mockDashboardData.github} />
        <Section title="Jira" items={mockDashboardData.jira} />
      </ScrollView>
    </View>
  );
}

function Section({ title, items }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, i) => (
        <Text key={i} style={styles.item}>• {item}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  toggleText: {
    fontSize: 24,
    color: '#60A5FA',
  },
  toggleClosed: {
    padding: 16,
    paddingTop: 48,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    maxHeight: 200,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60A5FA',
    marginBottom: 8,
  },
  item: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
});

