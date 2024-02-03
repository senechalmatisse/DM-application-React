import API_URL from "./apiUrl.js"
import fetch from "node-fetch"

// Mutation GraphQL pour créer une liste de tâches (TodoList).
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

// Fonction pour créer une nouvelle liste de tâches (TodoList).
export function createTodoList(username, title, token) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: CREATE_TODOLIST,
      variables: {
        "input": [
          {
            "owner": {
              "connect": {
                "where": {
                  "username": username
                }
              }
            },
            "title": title
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
      return jsonResponse.data.createTodoLists.todoLists[0]
    })
    .catch(error => {
      console.log('error API', error.message)
      throw error
    })
}

// Requête GraphQL pour récupérer la liste de tâches (TodoLists) d'un utilisateur.
const TODOLISTS = `
query TodoLists($where: TodoListWhere) {
  todoLists(where: $where) {
    id
    title
  }
}`;

// Fonction pour récupérer les listes de tâches (TodoLists) d'un utilisateur.
export function getTodoLists(username, token) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: TODOLISTS,
      variables: {
        "where": {
          "owner": {
            "username": username
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
      return jsonResponse.data.todoLists
    })
    .catch(error => {
        console.log('error API', error.message)
      throw error
    })
}

// Mutation GraphQL pour supprimer une liste de tâches (TodoList).
const DELETE_TODOLIST = `
mutation DeleteTodoLists($where: TodoListWhere) {
  deleteTodoLists(where: $where) {
    nodesDeleted
  }
}`

// Fonction pour supprimer une liste de tâches (TodoList) en fonction de son ID.
export function deleteTodoList(id, token) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: DELETE_TODOLIST,
      variables: {
        "where": {
          "id": id
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
      return jsonResponse.data.deleteTodoLists.nodesDeleted
    })
    .catch(error => {
        console.log('error API', error.message)
      throw error
    })
}