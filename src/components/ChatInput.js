import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as Speech from 'expo-speech';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  const handleVoice = () => {
    Alert.alert('Voice Input', 'Voice recognition would be active here. For demo, use text input.');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.voiceButton} onPress={handleVoice}>
        <Text style={styles.voiceIcon}>🎤</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Ask about your meetings..."
        placeholderTextColor="#64748B"
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    alignItems: 'center',
  },
  voiceButton: {
    padding: 8,
    marginRight: 8,
  },
  voiceIcon: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#0F172A',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#60A5FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});

