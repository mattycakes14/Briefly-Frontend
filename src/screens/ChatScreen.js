import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Dashboard from '../components/Dashboard';
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import { getMockResponse } from '../utils/mockData';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [dashboardOpen, setDashboardOpen] = useState(true);

  const handleSendMessage = async (text) => {
    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const response = getMockResponse(text);
      const aiMsg = { id: Date.now() + 1, text: response, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Dashboard isOpen={dashboardOpen} onToggle={() => setDashboardOpen(!dashboardOpen)} />
      <View style={styles.chatContainer}>
        <ChatMessages messages={messages} />
        <ChatInput onSend={handleSendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  chatContainer: {
    flex: 1,
  },
});

