import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Switch, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    soundEnabled: true,
    autoSync: true,
    reminderTime: 15, // minutes before event
  });

  const toggleSetting = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const SettingItem = ({ icon, title, description, value, onPress, type = 'switch' }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={type === 'select' ? onPress : null}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={24} color="#4285F4" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#e0e0e0', true: '#4285F4' }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#5f6368" />
      )}
    </TouchableOpacity>
  );

  const handleReminderTimeChange = () => {
    Alert.alert(
      'Hatırlatıcı Zamanı',
      'Etkinlikten kaç dakika önce hatırlatılsın?',
      [
        { text: '5 dakika', onPress: () => setSettings({...settings, reminderTime: 5}) },
        { text: '10 dakika', onPress: () => setSettings({...settings, reminderTime: 10}) },
        { text: '15 dakika', onPress: () => setSettings({...settings, reminderTime: 15}) },
        { text: '30 dakika', onPress: () => setSettings({...settings, reminderTime: 30}) },
        { text: '1 saat', onPress: () => setSettings({...settings, reminderTime: 60}) },
        { text: 'İptal', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ayarlar</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genel</Text>
          <SettingItem
            icon="notifications-outline"
            title="Bildirimler"
            description="Etkinlik ve görev bildirimleri"
            value={settings.notifications}
            onPress={() => toggleSetting('notifications')}
          />
          <SettingItem
            icon="moon-outline"
            title="Karanlık Mod"
            description="Uygulamayı karanlık temada kullan"
            value={settings.darkMode}
            onPress={() => toggleSetting('darkMode')}
          />
          <SettingItem
            icon="volume-high-outline"
            title="Ses"
            description="Bildirim sesleri"
            value={settings.soundEnabled}
            onPress={() => toggleSetting('soundEnabled')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Senkronizasyon</Text>
          <SettingItem
            icon="sync-outline"
            title="Otomatik Senkronizasyon"
            description="Verileri otomatik olarak senkronize et"
            value={settings.autoSync}
            onPress={() => toggleSetting('autoSync')}
          />
          <SettingItem
            icon="cloud-upload-outline"
            title="Verileri Yedekle"
            description="Tüm verileri yedekle ve geri yükle"
            type="select"
            onPress={() => Alert.alert('Bilgi', 'Yedekleme özelliği yakında eklenecek.')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hatırlatıcılar</Text>
          <SettingItem
            icon="time-outline"
            title="Hatırlatıcı Zamanı"
            description={`Etkinlikten ${settings.reminderTime} dakika önce hatırlat`}
            type="select"
            onPress={handleReminderTimeChange}
          />
          <SettingItem
            icon="repeat-outline"
            title="Tekrarlanan Hatırlatıcılar"
            description="Tekrarlanan etkinlikler için hatırlatıcılar"
            value={true}
            onPress={() => Alert.alert('Bilgi', 'Bu özellik yakında eklenecek.')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hakkında</Text>
          <SettingItem
            icon="information-circle-outline"
            title="Uygulama Bilgileri"
            description="Versiyon 1.0.0"
            type="select"
            onPress={() => Alert.alert('Uygulama Bilgileri', 'Akıllı Ajanda v1.0.0\n\nBu uygulama, günlük planlarınızı ve görevlerinizi yönetmenize yardımcı olmak için tasarlanmıştır.')}
          />
          <SettingItem
            icon="help-circle-outline"
            title="Yardım ve Destek"
            type="select"
            onPress={() => Alert.alert('Yardım ve Destek', 'Yardım ve destek için lütfen e-posta gönderin: destek@akilliajanda.com')}
          />
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5f6368',
    marginBottom: 8,
    marginLeft: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#202124',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 2,
  },
}); 