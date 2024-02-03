import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TextInput, Text, Switch, TouchableOpacity, Image } from 'react-native';
import { createTodo, getTodos, deleteTodo, updateTodo } from '../api/todo';
import { commonStyles } from './styles/Styles';

export default function TodoScreen({ todoList, token }) {
  // Stocke la liste des tâches
  const [todos, setTodos] = useState([]);
  // Contient le contenu de la nouvelle tâche
  const [newTodoContent, setNewTodoContent] = useState('');
  // Indique si les tâches terminées doivent être affichées
  const [showDoneTodos, setShowDoneTodos] = useState(false);
  // Indique si les tâches non terminées doivent être affichées
  const [showUndoneTodos, setShowUndoneTodos] = useState(false);

  /**
   * Chargement de la liste des tâches sélectionnée.
   */
  useEffect(() => {
    loadTodos();
  }, [todoList]);

  /**
   * Met à jour lors du changement dans la liste de tâches
   */
  useEffect(() => {
    calculateProgress();
  }, [todos]);

  /**
   * La fonction loadTodos permet de charger les tâches de la liste actuelle.
   */
  const loadTodos = async () => {
    try {
      const todosData = await getTodos(todoList.id, token);
      setTodos(todosData);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Compte le nombre de tâches effectuées dans la liste de tâches.
   *
   * @returns {number} - Le nombre de tâches effectuées
   */
  const countDoneTodos = () => {
    return todos.filter((todo) => todo.done).length;
  };

  /**
   * Calcule le pourcentage de progression des tâches accomplies par rapport au total des tâches.
   *
   * @returns {number} - Le pourcentage de progression des tâches
   */
  const calculateProgress = () => {
    const totalTasks = todos.length;
    const completedTasks = countDoneTodos();
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    return progress;
  };

  /**
   * Ajoute une nouvelle tâche à la liste des tâches.
   * Vérifie si le contenu de la nouvelle tâche n'est pas vide avant de l'ajouter.
   */
  const addTodo = async () => {
    try {
      if (newTodoContent.trim() === '')
        return;

      const newTodo = await createTodo(newTodoContent, todoList.id, token);
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setNewTodoContent('');
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Supprime une tâche à la liste.
   *
   * @param {number} id - L'identifiant de la tâche à mettre à jour.
   */
  const removeTodo = async (id) => {
    try {
      await deleteTodo(id, token);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Change l'état d'une tâche.
   *
   * @param {number} id - L'identifiant de la tâche à mettre à jour.
   * @param {boolean} currentDoneValue - L'état actuel de la tâche (terminée ou non terminée).
   */
  const toggleTodo = async (id, currentDoneValue) => {
    try {
      const updatedTodo = await updateTodo(id, !currentDoneValue, token);

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          // Vérifie si l'ID de la tâche dans la liste correspond à l'ID de la tâche mise à jour
          todo.id === updatedTodo.id ? { ...todo, done: updatedTodo.done } : todo
        )
      );
      calculateProgress();
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Met à jour l'état de toutes les tâches dans la liste.
   *
   * @param {boolean} newValue - La nouvelle valeur pour l'état 'done' des tâches.
   */
  const toggleAllTodos = async (newValue) => {
    try {
      // Récupère tous les todos
      const updatedTodos = await Promise.all(
        todos.map(async (todo) => {
          // Mise à jour pour chaque todo avec la nouvelle valeur de 'done'
          const updatedTodo = await updateTodo(todo.id, newValue, token);
          return updatedTodo;
        })
      );
  
      setTodos(updatedTodos);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Bascule l'affichage des tâches terminées.
   */
  const toggleShowDoneTodos = () => {
    setShowDoneTodos((prevState) => !prevState);
    setShowUndoneTodos(false);
  };

  /**
   * Inverse l'état de l'affichage des tâches non terminées.
   * Elle met également à jour l'état de l'affichage des tâches terminées à false.
   */
  const toggleShowUndoneTodos = () => {
    setShowUndoneTodos((prevState) => !prevState);
    setShowDoneTodos(false);
  };

  // Filtre les tâches terminées
  const filteredDoneTodos = todos.filter(todo => todo.done);
  // Filtre les tâches non terminées
  const filteredUndoneTodos = todos.filter(todo => !todo.done);

  // Sélectionne la liste de tâches à afficher en fonction des filtres choisis
  const filteredTodos = showDoneTodos ? filteredDoneTodos : (showUndoneTodos ? filteredUndoneTodos : todos);

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      {/* Vue pour le contenu de la tâche */}
      <View style={styles.todoContent}>
        <Text style={[commonStyles.text, { textDecorationLine: item.done ? 'line-through' : 'none' }]}>
          {item.content}
        </Text>
      </View>
      {/* Vue pour le switch de la tâche */}
      <View style={styles.todoSwitch}>
        <Switch
          value={item.done}
          onValueChange={() => toggleTodo(item.id, item.done)}
          style={styles.switch}
        />
      </View>
      {/* Bouton pour supprimer la tâche */}
      <TouchableOpacity onPress={() => removeTodo(item.id)}>
        <Image
          source={require('../assets/trash-can-outline.png')}
          style={commonStyles.imageTrash}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      {/* Bouton pour activer/désactiver le filtrage */}
      {todos.length > 0 && (
        <View style={styles.filterContainer}>
          {/* Bouton pour afficher/cacher les tâches terminées */}
          <TouchableOpacity onPress={toggleShowDoneTodos} style={[commonStyles.button, {marginBottom: 5}]}>
            <Text style={commonStyles.buttonText}>
              {showDoneTodos ? "Afficher les tâches" : "Tâches terminées"}
            </Text>
          </TouchableOpacity>
          {/* Bouton pour afficher/cacher les tâches non terminées */}
          <TouchableOpacity onPress={toggleShowUndoneTodos} style={[commonStyles.button, {marginBottom: 5}]}>
            <Text style={commonStyles.buttonText}>
              {showUndoneTodos ? "Afficher les tâches" : "Tâches non terminées"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* View créant des nouvelles tâches */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[commonStyles.textInput, {marginLeft: 15}]}
          placeholder="Nouvelle tâche"
          value={newTodoContent}
          onChangeText={(text) => setNewTodoContent(text)}
          onSubmitEditing={addTodo}
        />
        {/* Bouton pour ajouter une nouvelle tâche */}
        <TouchableOpacity onPress={addTodo}>
          <Image source={require('../assets/icon-checked.png')} style={styles.iconChecked} />
        </TouchableOpacity>
      </View>

      {/* Compteur du nombre de tâches effectuées */}
      <Text style={{marginLeft: -15}}>Nombre de tâches côchées : {countDoneTodos(todos)}</Text>
  
      {/* Liste des tâches */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={[
          styles.listTodo,
          {padding: filteredTodos.length > 0 ? 5 : 0},
          {display: filteredTodos.length == 0 ? 'none' : 'flex'}
        ]}
      />

      {/* Condition pour afficher la barre de progression et les boutons pour cocher/décocher toutes les tâches */}
      {todos.length > 1 && (
        <>
          {/* Barre de progression */}
          <View style={styles.progressBar}>
            <View style={{ width: `${calculateProgress()}%`, backgroundColor: 'green', height: 5 }} />
          </View>
          {/* Boutons pour côcher/décôcher toutes les tâches */}
          <View style={styles.buttonContainer}>
            {/* Bouton pour côcher toutes les tâches */}
            <TouchableOpacity onPress={() => toggleAllTodos(true)} style={[commonStyles.button, {marginRight: '4%'}]}>
              <Text style={commonStyles.buttonText}>Tout cocher</Text>
            </TouchableOpacity>
            {/* Bouton pour décôcher toutes les tâches */}
            <TouchableOpacity onPress={() => toggleAllTodos(false)} style={commonStyles.button}>
              <Text style={commonStyles.buttonText}>Tout décocher</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 240
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8
  },
  todoSwitch: {
    marginLeft: 10
  },
  switch: {
    marginLeft: '1%'
  },
  iconChecked: {
    width: 24,
    height: 24,
    marginTop: -10
  },
  listTodo: {
    borderWidth: 1,
    borderColor: 'dimgray',
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: 'lightgray',
    marginLeft: -20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginLeft: -7
  },
  filterContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: -20
  },
  progressBar: {
    backgroundColor: 'lightgray',
    height: 5,
    width: '70%',
    borderRadius: 2,
    marginTop: 5,
    overflow: 'hidden',
    marginLeft: -10
  }
});