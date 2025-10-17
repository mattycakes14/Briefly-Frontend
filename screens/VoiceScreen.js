import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  setAudioModeAsync,
  AudioModule,
  createAudioPlayer,
} from 'expo-audio';
import Constants from 'expo-constants';

const WaveformBar = ({ isRecording }) => {
  const height = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!isRecording) {
      Animated.timing(height, {
        toValue: 20,
        duration: 200,
        useNativeDriver: false,
      }).start();
      return;
    }

    const animate = () => {
      Animated.timing(height, {
        toValue: Math.random() * 60 + 20,
        duration: 150,
        useNativeDriver: false,
      }).start(() => {
        if (isRecording) animate();
      });
    };
    animate();
  }, [isRecording]);

  return <Animated.View style={[styles.bar, { height }]} />;
};

const AnimatedBlob = ({ delay = 0 }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 3000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -20,
            duration: 3000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          transform: [{ scale }, { translateY }],
        },
      ]}
    />
  );
};

const phrases = [
  'Fetching PRs...',
  'Toggling through sources...',
  'Getting meeting notes from Notion...',
  'Checking Jira dashboard...',
  'Scanning GitHub activity...',
];

const AnimatedPhrase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      opacity.stopAnimation();
    };
  }, []);

  return (
    <Animated.Text style={[styles.animatedPhrase, { opacity }]}>
      {phrases[currentIndex]}
    </Animated.Text>
  );
};

export default function VoiceScreen({ navigation }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const { isRecording } = useAudioRecorderState(recorder);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [gotResponse, setGotResponse] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const buttonScale = useRef(new Animated.Value(0.95)).current;
  const apiKey = Constants.expoConfig?.extra?.OPENAI_API_KEY;

  useEffect(() => {
    (async () => {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted) return;
      await setAudioModeAsync({ 
        playsInSilentMode: true, 
        allowsRecording: true,
        shouldPlayInBackground: false,
      });
    })();
  }, []);

  useEffect(() => {
    if (gotResponse) {
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [gotResponse]);

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
      // UPDATE: deployed to railway
      const response = await fetch('https://briefly-backend-production.up.railway.app/summarize', {
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
      const summary = data.result?.summary;

      // save summary to state for tts output
      setSummary(summary);
      setGotResponse(true);
      console.log('Summary set to state:', summary);

      return data;
    } catch (e) {
      console.error('Summarization error:', e.message);
      console.error('Hint: Replace localhost with your PC IP address (ipconfig)');
    }
  };

  const tts = async () => {
    if (!summary || !apiKey) {
      console.warn('No summary or API key available');
      return;
    }

    try {
      console.log('Requesting TTS from OpenAI...');
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'alloy',
          input: summary,
          speed: 1.0,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      // Get audio as blob and convert to data URL
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      await new Promise((resolve, reject) => {
        reader.onloadend = () => {
          try {
            const dataUrl = reader.result;
            console.log('Creating audio player with data URL');
            
            // Create and store audio player
            const player = createAudioPlayer(dataUrl);
            setAudioPlayer(player);
            
            // Set volume to max and play
            player.volume = 1.0;
            player.play();
            
            console.log('Audio player playing, volume:', player.volume);
            resolve();
          } catch (e) {
            console.error('Audio playback error:', e);
            reject(e);
          }
        };
        reader.onerror = reject;
      });
    } catch (e) {
      console.error('TTS error:', e.message);
    }
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.voiceContainer}>
        <View style={styles.blobContainer}>
          <AnimatedBlob delay={0} />
          <AnimatedBlob delay={1000} />
          <AnimatedBlob delay={2000} />
        </View>
        
        {isRecording && (
          <View style={styles.waveform}>
            {[...Array(12)].map((_, i) => (
              <WaveformBar key={i} isRecording={isRecording} />
            ))}
          </View>
        )}
        
        {!isRecording && <AnimatedPhrase />}
      </View>

      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity 
          style={[
            styles.summaryButton, 
            !gotResponse && styles.summaryButtonDisabled
          ]} 
          onPress={() => gotResponse && tts()}
          disabled={!gotResponse}
        >
          <Text style={[
            styles.summaryButtonText,
            !gotResponse && styles.summaryButtonTextDisabled
          ]}>
            {gotResponse ? 'Listen to Summary' : 'Processing...'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      
      <TouchableOpacity
        onPress={isRecording ? stopRec : startRec}
        style={[styles.button, isRecording && styles.stopButton]}
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
  blobContainer: {
    width: 300,
    height: 200,
    position: 'relative',
    marginBottom: 40,
  },
  blob: {
    position: 'absolute',
    width: 250,
    height: 120,
    backgroundColor: '#5B6FFF',
    borderRadius: 100,
    opacity: 0.6,
    left: 25,
    top: 40,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    gap: 6,
    marginBottom: 20,
  },
  bar: {
    width: 4,
    backgroundColor: '#60A5FA',
    borderRadius: 2,
  },
  voiceText: {
    color: '#8B92B0',
    fontSize: 18,
    fontWeight: '500',
  },
  animatedPhrase: {
    color: '#8B92B0',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  summaryButton: {
    backgroundColor: '#252A3F',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A4057',
  },
  summaryButtonDisabled: {
    backgroundColor: '#1A1E2E',
    borderColor: '#2A2F3F',
    opacity: 0.5,
  },
  summaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  summaryButtonTextDisabled: {
    color: '#6B7280',
  },
  button: {
    backgroundColor: '#5B6FFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'center',
    shadowColor: '#5B6FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stopButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  transcript: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

