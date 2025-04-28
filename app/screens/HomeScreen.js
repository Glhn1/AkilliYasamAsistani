import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newReminder, setNewReminder] = useState({ title: '', date: '', time: '' });

  // Örnek görevler - gerçek uygulamada bu veriler bir veritabanından gelecektir
  useEffect(() => {
    // Örnek görevler
    setTasks([
      { id: 1, title: 'Proje raporunu hazırla', completed: false },
      { id: 2, title: 'E-posta yanıtla', completed: true },
      { id: 3, title: 'Toplantı notlarını gönder', completed: false },
    ]);
    
    // Örnek notlar
    setNotes([
      { id: 1, title: 'Alışveriş listesi', content: 'Süt, ekmek, yumurta' },
      { id: 2, title: 'Toplantı notları', content: 'Proje teslim tarihi: 15 Haziran' },
    ]);
    
    // Örnek hatırlatıcılar
    setReminders([
      { id: 1, title: 'Doğum günü', date: '2023-06-10', time: '09:00' },
      { id: 2, title: 'Doktor randevusu', date: '2023-06-15', time: '14:30' },
    ]);
  }, []);

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addNote = () => {
    if (newNote.trim() === '') {
      Alert.alert('Hata', 'Not boş olamaz');
      return;
    }
    
    const newNoteObj = {
      id: Date.now(),
      title: newNote.split('\n')[0] || 'Yeni Not',
      content: newNote
    };
    
    setNotes([...notes, newNoteObj]);
    setNewNote('');
    setNoteModalVisible(false);
  };

  const addReminder = () => {
    if (newReminder.title.trim() === '' || newReminder.date === '' || newReminder.time === '') {
      Alert.alert('Hata', 'Tüm alanları doldurun');
      return;
    }
    
    const newReminderObj = {
      id: Date.now(),
      ...newReminder
    };
    
    setReminders([...reminders, newReminderObj]);
    setNewReminder({ title: '', date: '', time: '' });
    setReminderModalVisible(false);
  };

  const FeatureCard = ({ icon, title, description, color, onPress }) => (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </TouchableOpacity>
  );

  const QuickActionButton = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#4285F4" />
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Akıllı Ajanda</Text>
        <Text style={styles.subtitle}>Hoş Geldiniz</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
          <View style={styles.quickActionsContainer}>
            <QuickActionButton 
              icon="calendar" 
              title="Takvim" 
              onPress={() => navigation.navigate('Takvim')} 
            />
            <QuickActionButton 
              icon="list" 
              title="Görevler" 
              onPress={() => navigation.navigate('Görevler')} 
            />
            <QuickActionButton 
              icon="timer" 
              title="Pomodoro" 
              onPress={() => navigation.navigate('Pomodoro')} 
            />
            <QuickActionButton 
              icon="settings" 
              title="Ayarlar" 
              onPress={() => navigation.navigate('Ayarlar')} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bugünkü Görevler</Text>
          <View style={styles.card}>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <View key={task.id} style={styles.taskItem}>
                  <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)}>
                    <Ionicons 
                      name={task.completed ? "checkbox" : "square-outline"} 
                      size={24} 
                      color={task.completed ? "#4285F4" : "#5f6368"} 
                    />
                  </TouchableOpacity>
                  <Text style={[
                    styles.taskText,
                    task.completed && styles.completedTaskText
                  ]}>
                    {task.title}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Henüz görev eklenmemiş</Text>
            )}
            <TouchableOpacity 
              style={styles.addTaskButton}
              onPress={() => navigation.navigate('Görevler', { showNewTaskModal: true })}
            >
              <Text style={styles.addTaskText}>+ Yeni Görev Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yaklaşan Etkinlikler</Text>
          <View style={styles.card}>
            {reminders.length > 0 ? (
              reminders.map(reminder => (
                <View key={reminder.id} style={styles.eventItem}>
                  <View style={[styles.eventIndicator, { backgroundColor: '#4285F4' }]} />
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTime}>{reminder.time}</Text>
                    <Text style={styles.eventTitle}>{reminder.title}</Text>
                    <Text style={styles.eventLocation}>{reminder.date}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Henüz etkinlik eklenmemiş</Text>
            )}
            <TouchableOpacity 
              style={styles.addEventButton}
              onPress={() => setReminderModalVisible(true)}
            >
              <Text style={styles.addEventText}>+ Yeni Etkinlik Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özellikler</Text>
          <View style={styles.featuresContainer}>
            <FeatureCard
              icon="calendar"
              title="Takvim Entegrasyonu"
              description="Etkinliklerinizi kolayca planlayın ve takip edin."
              color="#4285F4"
              onPress={() => navigation.navigate('Takvim')}
            />
            <FeatureCard
              icon="list"
              title="Görev Yönetimi"
              description="Günlük görevlerinizi organize edin ve takip edin."
              color="#EA4335"
              onPress={() => navigation.navigate('Görevler')}
            />
            <FeatureCard
              icon="document-text"
              title="Not Alma"
              description="Önemli notlarınızı hızlıca kaydedin."
              color="#FBBC05"
              onPress={() => setNoteModalVisible(true)}
            />
            <FeatureCard
              icon="notifications"
              title="Hatırlatıcılar"
              description="Önemli etkinlikler için hatırlatıcılar oluşturun."
              color="#34A853"
              onPress={() => setReminderModalVisible(true)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Not Alma Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={noteModalVisible}
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Not</Text>
              <TouchableOpacity onPress={() => setNoteModalVisible(false)}>
                <Ionicons name="close" size={24} color="#5f6368" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.noteInput}
              multiline
              placeholder="Notunuzu buraya yazın..."
              value={newNote}
              onChangeText={setNewNote}
            />
            <TouchableOpacity style={styles.saveButton} onPress={addNote}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hatırlatıcı Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reminderModalVisible}
        onRequestClose={() => setReminderModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Hatırlatıcı</Text>
              <TouchableOpacity onPress={() => setReminderModalVisible(false)}>
                <Ionicons name="close" size={24} color="#5f6368" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Hatırlatıcı başlığı"
              value={newReminder.title}
              onChangeText={(text) => setNewReminder({...newReminder, title: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Tarih (YYYY-MM-DD)"
              value={newReminder.date}
              onChangeText={(text) => setNewReminder({...newReminder, date: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Saat (HH:MM)"
              value={newReminder.time}
              onChangeText={(text) => setNewReminder({...newReminder, time: text})}
            />
            <TouchableOpacity style={styles.saveButton} onPress={addReminder}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  subtitle: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 8,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quickActionButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '23%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  quickActionText: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  taskText: {
    fontSize: 14,
    color: '#202124',
    marginLeft: 12,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#5f6368',
  },
  addTaskButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  addTaskText: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  eventIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  eventContent: {
    marginLeft: 12,
    flex: 1,
  },
  eventTime: {
    fontSize: 12,
    color: '#5f6368',
  },
  eventTitle: {
    fontSize: 14,
    color: '#202124',
    fontWeight: '500',
  },
  eventLocation: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 2,
  },
  addEventButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  addEventText: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#5f6368',
    lineHeight: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#5f6368',
    textAlign: 'center',
    paddingVertical: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#202124',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    height: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4285F4',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 