import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { createTodoList, getTodoLists, deleteTodoList } from '../api/todoList';
import TodoScreen from './TodoScreen';
import Input from '../components/UI/Input';
import { useTokenContext, useUsernameContext } from '../Context/Context';
import { commonStyles } from './styles/Styles';
import { ScrollView } from 'react-native-web';

const TodoListsScreen = () => {
  const [token] = useTokenContext();
  const [username] = useUsernameContext();

  // État stockant la liste des tâches
  const [todoLists, setTodoLists] = useState([]);
  // État gérant l'état des flèches associées à chaque liste de tâches
  const [arrowState, setArrowState] = useState({});
  // État stockant une référence sur la liste de tâches actuellement sélectionnée
  const [selectedTodoList, setSelectedTodoList] = useState(null);

  // Chargement de la liste de tâches
  useEffect(() => {
    loadTodoLists();
  }, []);

  /**
   * Charge les listes de tâches
   */
  const loadTodoLists = async () => {
    try {
      const listsTodo = await getTodoLists(username, token);
      setTodoLists(listsTodo);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Ajoute une nouvelle liste de tâches avec le titre spécifié.
   *
   * @param {string} title - Le titre de la nouvelle liste de tâches à ajouter.
   */
  const addTodoList = async (title) => {
    try {
      const newList = await createTodoList(username, title, token);
      setTodoLists((prevTodoLists) => [...prevTodoLists, newList]);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Supprime une liste de tâches en fonction de son identifiant.
   *
   * @param {number} id - L'identifiant de la liste de tâches à supprimer.
   */
  const removeTodoList = async (id) => {
    try {
      await deleteTodoList(id, token);
      setTodoLists((prevTodoLists) => prevTodoLists.filter((list) => list.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Gère l'ouverture et la fermeture de l'écran d'une liste de tâches spécifique .
   *
   * @param {Object} todoList - Liste de tâches à ouvrir ou fermer
   */
  const openTodoScreen = (todoList) => {
    // Vérifie si la liste est déjà sélectionnée et si elle correspond à la liste cliquée
    if (selectedTodoList && selectedTodoList.id === todoList.id) {
      setSelectedTodoList(null);
    } else {
      setSelectedTodoList(todoList);
    }

    // Met à jour l'état de la flèche pour la todoList sélectionnée
    setArrowState((prevState) => ({
      ...prevState,
      [todoList.id]: !prevState[todoList.id]
    }));
  };

  const renderTodoItem = ({ item }) => (
    <View key={item.id}>
      {/* Bouton pour ouvrir/fermer les détails de la tâche */}
      <TouchableOpacity style={styles.todoList} onPress={() => openTodoScreen(item)}>
        {/* Affiche le titre de la tâche */}
        <Text style={{ marginRight: 10 }}>{item.title}</Text>
        {/* Affiche la flèche vers le haut/bas en fonction de l'état de la liste */}
        <Image
          source={
            arrowState[item.id]
              ? require('../assets/icon-triangle-down.png')
              : require('../assets/icon-triangle-up.png')
          }
          style={styles.imageArrow}
        />
        {/* Bouton pour supprimer la liste de tâches */}
        <TouchableOpacity onPress={() => removeTodoList(item.id)}>
          <Image source={require('../assets/trash-can-outline.png')} style={commonStyles.imageTrash} />
        </TouchableOpacity>
      </TouchableOpacity>
      {/* Affiche les détails de la liste si elle est sélectionnée */}
      {selectedTodoList && selectedTodoList.id === item.id && (
        <TodoScreen todoList={selectedTodoList} token={token} />
      )}
    </View>
  );

  return (
    <ScrollView>
      {/* Conteneur principal */}
      <View style={styles.container}>
        {/* Input pour ajouter une nouvelle liste de tâches */}
        <Input onSubmit={addTodoList} />

        {/* Liste des tâches */}
        <FlatList
          data={todoLists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTodoItem}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  },
  todoList: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageArrow: {
    width: 20,
    height: 20
  }
});

export default TodoListsScreen;