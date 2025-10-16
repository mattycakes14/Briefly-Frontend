import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  setAudioModeAsync,
  AudioModule,
} from 'expo-audio';
import Constants from 'expo-constants';

export default function VoiceScreen({ navigation }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const { isRecording } = useAudioRecorderState(recorder);
  const [transcript, setTranscript] = useState('');
  const apiKey = Constants.expoConfig?.extra?.OPENAI_API_KEY;

  useEffect(() => {
    (async () => {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted) return;
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
    })();
  }, []);

  const startRec = async () => {
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stopRec = async () => {
    await recorder.stop();
    const uri = recorder.uri; // file:///.../recording.m4a
    if (uri) await transcribe(uri);
  };

  const transcribe = async (uri) => {
    try {
      if (!apiKey) {
        console.warn('Missing OPENAI_API_KEY');
        return;
      }
      const form = new FormData();
      form.append('file', { uri, name: 'audio.m4a', type: 'audio/m4a' });
      form.append('model', 'whisper-1');

      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });
      const json = await res.json();
      setTranscript(json?.text || '');
      console.log('Transcription:', json?.text);
      
      const summary = await summarize(json?.text);
      console.log('Summary:', summary);
    } catch (e) {
      console.error('Transcription error', e);
    }
  };

  //send to FastAPI backend for summarization
  const summarize = async (text) => {
    try {
      if (!text) {
        console.warn('No text to summarize');
        return;
      }
      
      // set to my computer IP address (from iphone, need to send over network to computer not within phone remember localhost is within device)
      const response = await fetch('http://10.0.0.143:8000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: text }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Summarization:', data);
      return data;
    } catch (e) {
      console.error('Summarization error:', e.message);
      console.error('Hint: Replace localhost with your PC IP address (ipconfig)');
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.voiceContainer}>
        <Text style={styles.voiceIcon}>🎤</Text>
        <Text style={styles.voiceText}>{isRecording ? 'Recording…' : 'Ready'}</Text>
        <Text style={styles.hintText}>Tap to {isRecording ? 'stop' : 'start'} and auto-transcribe</Text>
      </View>

      <TouchableOpacity
        onPress={isRecording ? stopRec : startRec}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>

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
  backButton: {
    marginBottom: 40,
  },
  backText: {
    color: '#60A5FA',
    fontSize: 16,
  },
  voiceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  voiceText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  hintText: {
    color: '#64748B',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#F59E0B',
    width: 300,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  transcript: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

