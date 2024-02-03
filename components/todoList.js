// Importe l'URL de l'API depuis le module apiUrl.js.
import API_URL from "../api/apiUrl.js"

// Importe le module node-fetch pour effectuer des requêtes HTTP.
import fetch from "node-fetch"

// Une mutation GraphQL pour créer une nouvelle liste de tâches (TodoList).
const CREATE_TODOLIST = `
mutation createTodoLists($input: [TodoListCreateInput!]!) {
  createTodoLists(input: $input) {
    todoLists {
      id
      owner {
        username
      }
      title
    }
  }
}`

// Cette fonction crée une nouvelle liste de tâches en effectuant une requête POST vers votre API.
// Elle prend trois paramètres : username (nom d'utilisateur), title (titre de la liste) et token (jeton d'authentification).
export function createTodoList(username, title, token) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token // Ajoute le jeton d'authentification dans l'en-tête
    },
    body: JSON.stringify({
      query: CREATE_TODOLIST, // Utilise la mutation CREATE_TODOLIST définie précédemment
      variables: {
        "input": [
          {
            "owner": {
              "connect": {
                "where": {
                  "username": username // Connecte la liste au propriétaire (utilisateur) par nom d'utilisateur
                }
              }
            },
            "title": title // Spécifie le titre de la nouvelle liste
          }
        ]
      }
    })
  })
    .then(response => {
      return response.json()
    })
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0]
      }
      return jsonResponse.data.createTodoLists.todoLists[0] // Retourne la nouvelle liste de tâches créée
    })
    .catch(error => {
      console.log('error API', error.message)
      throw error
    })
}

// Définit une requête GraphQL pour obtenir la liste des listes de tâches appartenant à un utilisateur spécifique.
const TODOLISTS = `
query TodoLists($where: TodoListWhere) {
  todoLists(where: $where) {
    id
    title
  }
}`

// Cette fonction récupère la liste des listes de tâches appartenant à un utilisateur spécifique.
// Elle prend deux paramètres : username (nom d'utilisateur) et token (jeton d'authentification).
export function getTodoLists(username, token) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token // Ajoute le jeton d'authentification dans l'en-tête
    },
    body: JSON.stringify({
      query: TODOLISTS, // Utilise la requête TODOLISTS définie précédemment
      variables: {
        "where": {
          "owner": {
            "username": username // Recherche les listes appartenant à l'utilisateur spécifié
          }
        }
      }
    })
  })
    .then(response => {
      return response.json()
    })
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0] 
      }
      return jsonResponse.data.todoLists // Retourne la liste des listes de tâches
    })
    .catch(error => {
        console.log('error API', error.message)
      throw error
    })
}

// Définit une mutation GraphQL pour supprimer une liste de tâches en fonction de son identifiant.
const DELETE_TODOLIST = `
mutation DeleteTodoLists($where: TodoListWhere) {
  deleteTodoLists(where: $where) {
    nodesDeleted
  }
}`

// Cette fonction supprime une liste de tâches en effectuant une requête POST vers votre API.
// Elle prend deux paramètres : id (identifiant de la liste à supprimer) et token (jeton d'authentification).
export function deleteTodoList(id, token) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token // Ajoute le jeton d'authentification dans l'en-tête
    },
    body: JSON.stringify({
      query: DELETE_TODOLIST, // Utilise la mutation DELETE_TODOLIST définie précédemment
      variables: {
        "where": {
          "id": id // Spécifie l'identifiant de la liste à supprimer
        }
      }
    })
  })
    .then(response => {
      return response.json()
    })
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0]
      }
      return jsonResponse.data.deleteTodoLists.nodesDeleted // Retourne le nombre de nœuds (listes) supprimés
    })
    .catch(error => {
        console.log('error API', error.message)
      throw error
    })
}