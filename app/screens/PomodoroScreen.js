import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PomodoroScreen() {
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const timerRef = useRef(null);

  const WORK_TIME = 25 * 60; // 25 minutes
  const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
  const LONG_BREAK_TIME = 15 * 60; // 15 minutes
  const POMODOROS_UNTIL_LONG_BREAK = 4;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'work') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      if (newCount % POMODOROS_UNTIL_LONG_BREAK === 0) {
        Alert.alert(
          'Pomodoro Tamamlandı!',
          'Uzun mola zamanı!',
          [
            {
              text: 'Uzun Mola',
              onPress: () => {
                setMode('longBreak');
                setTimeLeft(LONG_BREAK_TIME);
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Pomodoro Tamamlandı!',
          'Kısa mola zamanı!',
          [
            {
              text: 'Kısa Mola',
              onPress: () => {
                setMode('shortBreak');
                setTimeLeft(SHORT_BREAK_TIME);
              }
            }
          ]
        );
      }
    } else {
      Alert.alert(
        'Mola Tamamlandı!',
        'Çalışmaya devam etmek ister misiniz?',
        [
          {
            text: 'Çalışmaya Başla',
            onPress: () => {
              setMode('work');
              setTimeLeft(WORK_TIME);
            }
          }
        ]
      );
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (mode === 'work') {
      setTimeLeft(WORK_TIME);
    } else if (mode === 'shortBreak') {
      setTimeLeft(SHORT_BREAK_TIME);
    } else {
      setTimeLeft(LONG_BREAK_TIME);
    }
  };

  const changeMode = (newMode) => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setMode(newMode);
    if (newMode === 'work') {
      setTimeLeft(WORK_TIME);
    } else if (newMode === 'shortBreak') {
      setTimeLeft(SHORT_BREAK_TIME);
    } else {
      setTimeLeft(LONG_BREAK_TIME);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pomodoro Zamanlayıcı</Text>
      </View>

      <View style={styles.modeSelector}>
        <TouchableOpacity 
          style={[styles.modeButton, mode === 'work' && styles.activeModeButton]} 
          onPress={() => changeMode('work')}
        >
          <Text style={[styles.modeText, mode === 'work' && styles.activeModeText]}>
            Çalışma
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeButton, mode === 'shortBreak' && styles.activeModeButton]} 
          onPress={() => changeMode('shortBreak')}
        >
          <Text style={[styles.modeText, mode === 'shortBreak' && styles.activeModeText]}>
            Kısa Mola
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeButton, mode === 'longBreak' && styles.activeModeButton]} 
          onPress={() => changeMode('longBreak')}
        >
          <Text style={[styles.modeText, mode === 'longBreak' && styles.activeModeText]}>
            Uzun Mola
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.pomodoroCount}>
          Tamamlanan Pomodoro: {pomodoroCount}
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={resetTimer}
        >
          <Ionicons name="refresh" size={24} color="#5f6368" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.controlButton, styles.playButton]} 
          onPress={toggleTimer}
        >
          <Ionicons 
            name={isRunning ? "pause" : "play"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Pomodoro Tekniği Nedir?</Text>
        <Text style={styles.infoText}>
          Pomodoro Tekniği, 25 dakikalık çalışma ve 5 dakikalık mola periyotlarından oluşan bir zaman yönetimi yöntemidir. Her 4 pomodoro'dan sonra 15-30 dakikalık uzun bir mola verilir.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#202124',
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#4285F4',
  },
  modeText: {
    fontSize: 14,
    color: '#5f6368',
  },
  activeModeText: {
    color: '#fff',
    fontWeight: '500',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 16,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '300',
    color: '#202124',
  },
  pomodoroCount: {
    fontSize: 16,
    color: '#5f6368',
    marginTop: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4285F4',
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
  },
}); 