import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Briefly</Text>
      <Text style={styles.tagline}>Your AI Meeting Prep Assistant</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Chat')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#60A5FA',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    color: '#94A3B8',
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#60A5FA',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

