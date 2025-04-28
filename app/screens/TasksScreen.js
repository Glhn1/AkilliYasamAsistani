import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, TextInput, FlatList, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

export default function TasksScreen() {
  const route = useRoute();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    completed: false,
  });
  const [editTask, setEditTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    showCompleted: true,
    dateFilter: 'all', // 'all', 'today', 'week', 'month', 'year'
  });

  // Örnek görevler - gerçek uygulamada bu veriler bir veritabanından gelecektir
  useEffect(() => {
    setTasks([
      { id: 1, title: 'Proje raporunu hazırla', completed: false },
      { id: 2, title: 'E-posta yanıtla', completed: true },
      { id: 3, title: 'Toplantı notlarını gönder', completed: false },
      { id: 4, title: 'Haftalık raporu gözden geçir', completed: false },
      { id: 5, title: 'Yeni proje planını hazırla', completed: false },
    ]);
  }, []);

  // Route parametrelerini kontrol et ve gerekirse modalı aç
  useEffect(() => {
    if (route.params?.showNewTaskModal) {
      setEditTask(null);
      setNewTask({ title: '', description: '', date: '', time: '', completed: false });
      setModalVisible(true);
    }
  }, [route.params]);

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (!newTask.title) {
      Alert.alert('Hata', 'Lütfen görev başlığını girin.');
      return;
    }

    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setModalVisible(false);
    setNewTask({ title: '', description: '', date: '', time: '', completed: false });
  };

  const editTaskItem = () => {
    if (editTask.title.trim() === '') {
      Alert.alert('Hata', 'Görev boş olamaz');
      return;
    }
    
    setTasks(tasks.map(task => 
      task.id === editTask.id ? { ...task, title: editTask.title } : task
    ));
    
    setEditTask(null);
    setModalVisible(false);
  };

  const deleteTask = (taskId) => {
    Alert.alert(
      'Görevi Sil',
      'Bu görevi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: () => {
            setTasks(tasks.filter(task => task.id !== taskId));
          }
        }
      ]
    );
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setModalVisible(true);
  };

  const filterTasks = (tasks) => {
    let filteredTasks = [...tasks];

    if (!filters.showCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filters.dateFilter) {
      case 'today':
        filteredTasks = filteredTasks.filter(task => {
          if (!task.date) return false;
          const taskDate = new Date(task.date);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        });
        break;
      case 'week':
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        filteredTasks = filteredTasks.filter(task => {
          if (!task.date) return false;
          const taskDate = new Date(task.date);
          return taskDate >= today && taskDate <= weekEnd;
        });
        break;
      case 'month':
        filteredTasks = filteredTasks.filter(task => {
          if (!task.date) return false;
          const taskDate = new Date(task.date);
          return taskDate.getMonth() === today.getMonth() &&
                 taskDate.getFullYear() === today.getFullYear();
        });
        break;
      case 'year':
        filteredTasks = filteredTasks.filter(task => {
          if (!task.date) return false;
          const taskDate = new Date(task.date);
          return taskDate.getFullYear() === today.getFullYear();
        });
        break;
    }

    return filteredTasks;
  };

  const renderTaskItem = (item) => (
    <View key={item.id} style={styles.taskItem}>
      <TouchableOpacity 
        style={styles.taskCheckbox}
        onPress={() => toggleTaskCompletion(item.id)}
      >
        <Ionicons 
          name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
          size={24} 
          color={item.completed ? "#34A853" : "#5f6368"} 
        />
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text 
          style={[
            styles.taskTitle,
            item.completed && styles.completedTask
          ]}
          onPress={() => openEditModal(item)}
        >
          {item.title}
        </Text>
        {item.description && (
          <Text style={styles.taskDescription}>{item.description}</Text>
        )}
        {(item.date || item.time) && (
          <View style={styles.taskDateTime}>
            {item.date && (
              <Text style={styles.taskDate}>
                <Ionicons name="calendar-outline" size={14} color="#5f6368" /> {item.date}
              </Text>
            )}
            {item.time && (
              <Text style={styles.taskTime}>
                <Ionicons name="time-outline" size={14} color="#5f6368" /> {item.time}
              </Text>
            )}
          </View>
        )}
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#EA4335" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Görevler</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
          >
            <Ionicons name="filter" size={24} color="#4285F4" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditTask(null);
              setNewTask({ title: '', description: '', date: '', time: '', completed: false });
              setModalVisible(true);
            }}
          >
            <Ionicons name="add" size={24} color="#4285F4" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.tasksList}>
        {filterTasks(tasks).map(item => renderTaskItem(item))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editTask ? 'Görevi Düzenle' : 'Yeni Görev'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#5f6368" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Görev başlığı"
              value={editTask ? editTask.title : newTask.title}
              onChangeText={text => editTask ? setEditTask({...editTask, title: text}) : setNewTask({...newTask, title: text})}
              autoFocus
            />
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              placeholder="Açıklama (opsiyonel)"
              value={editTask ? editTask.description : newTask.description}
              onChangeText={text => editTask ? setEditTask({...editTask, description: text}) : setNewTask({...newTask, description: text})}
              multiline
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Tarih (GG/AA/YYYY)"
              value={editTask ? editTask.date : newTask.date}
              onChangeText={text => editTask ? setEditTask({...editTask, date: text}) : setNewTask({...newTask, date: text})}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Saat (SS:DD)"
              value={editTask ? editTask.time : newTask.time}
              onChangeText={text => editTask ? setEditTask({...editTask, time: text}) : setNewTask({...newTask, time: text})}
            />
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={editTask ? editTaskItem : addTask}
            >
              <Text style={styles.saveButtonText}>
                {editTask ? 'Güncelle' : 'Ekle'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtreler</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <Ionicons name="close" size={24} color="#5f6368" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setFilters({ ...filters, showCompleted: !filters.showCompleted })}
            >
              <Ionicons
                name={filters.showCompleted ? 'checkbox' : 'square-outline'}
                size={24}
                color="#4285F4"
              />
              <Text style={styles.filterOptionText}>Tamamlanan görevleri göster</Text>
            </TouchableOpacity>

            <View style={styles.dateFilterContainer}>
              <Text style={styles.dateFilterTitle}>Tarih Filtresi</Text>
              {['all', 'today', 'week', 'month', 'year'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.dateFilterOption,
                    filters.dateFilter === filter && styles.selectedDateFilter
                  ]}
                  onPress={() => setFilters({ ...filters, dateFilter: filter })}
                >
                  <Text style={[
                    styles.dateFilterText,
                    filters.dateFilter === filter && styles.selectedDateFilterText
                  ]}>
                    {filter === 'all' && 'Tümü'}
                    {filter === 'today' && 'Bugün'}
                    {filter === 'week' && 'Bu Hafta'}
                    {filter === 'month' && 'Bu Ay'}
                    {filter === 'year' && 'Bu Yıl'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.applyButtonText}>Uygula</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  taskCheckbox: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#202124',
    fontWeight: '500',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#5f6368',
  },
  taskDescription: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 4,
  },
  taskDateTime: {
    flexDirection: 'row',
    marginTop: 8,
  },
  taskDate: {
    fontSize: 12,
    color: '#5f6368',
    marginRight: 16,
  },
  taskTime: {
    fontSize: 12,
    color: '#5f6368',
  },
  deleteButton: {
    padding: 8,
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
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  textArea: {
    height: 100,
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
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  filterOptionText: {
    fontSize: 16,
    color: '#202124',
    marginLeft: 12,
  },
  dateFilterContainer: {
    marginTop: 16,
  },
  dateFilterTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 12,
  },
  dateFilterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  selectedDateFilter: {
    backgroundColor: '#e8f0fe',
  },
  dateFilterText: {
    fontSize: 14,
    color: '#5f6368',
  },
  selectedDateFilterText: {
    color: '#4285F4',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#4285F4',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 