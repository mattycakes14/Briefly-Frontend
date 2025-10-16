import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';

export default function ChatMessages({ messages }) {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Ask me anything about your meetings</Text>
        <Text style={styles.exampleText}>Try: "Prep me for standup"</Text>
      </View>
    );
  }

  return (
    <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={styles.content}>
      {messages.map(msg => (
        <View key={msg.id} style={[styles.message, msg.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
          <Text style={styles.messageText}>{msg.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#64748B',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#475569',
    fontStyle: 'italic',
  },
  message: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#60A5FA',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#1E293B',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
  },
});

