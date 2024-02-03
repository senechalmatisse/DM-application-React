import fetch from "node-fetch"
import API_URL from "./apiUrl.js"

// La requête de mutation GraphQL pour la fonction de connexion (SignIn)
const SIGN_IN = `
mutation SignIn($username: String!, $password: String!) {
  signIn(username: $username, password: $password)
}`;

// La requête de mutation GraphQL pour la fonction d'inscription (SignUp)
const SIGN_UP = `
mutation SignUp($username: String!, $password: String!) {
  signUp(username: $username, password: $password)
}`;

// Définit une fonction signIn qui prend un nom d'utilisateur (username) et un mot de passe (password) comme arguments
export function signIn(username, password) {
  // Effectue une requête POST vers l'API définie dans API_URL
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'  // Définit l'en-tête de la requête avec le type de contenu JSON
    },
    body: JSON.stringify({ // Utilise JSON.stringify pour convertir la requête en JSON
      query: SIGN_IN, // Utilise la requête de connexion définie ci-dessus
      variables: {
        username: username, // Transmet le nom d'utilisateur fourni comme variable
        password: password // Transmet le mot de passe fourni comme variable
      }
    })
  })
    .then(response => {
      return response.json() // Analyse la réponse HTTP en tant qu'objet JSON
    })
    .then(jsonResponse => {
      if (jsonResponse.errors != null) { 
        throw jsonResponse.errors[0] // Vérifie s'il y a des erreurs de réponse et lancez la première erreur si c'est le cas
      }
      return jsonResponse.data.signIn // Renvoie la réponse de la mutation signIn
    })
    .catch(error => {
      throw error // Gére toute erreur qui pourrait survenir pendant le processus
    })
}

// Définit une fonction signUp qui prend un nom d'utilisateur (username) et un mot de passe (password) comme arguments
export function signUp(username, password) {
  // Effectue une requête POST vers l'API définie dans API_URL, similaire à la fonction signIn
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: SIGN_UP,
      variables: {
        username: username,
        password: password
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
      return jsonResponse.data.signUp // Renvoie la réponse de la mutation signUp
    })
    .catch(error => {
      throw error
    })
}