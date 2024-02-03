import React, { createContext, useState, useContext } from 'react';

// Création de deux contextes, l'un pour le jeton (token) et l'autre pour le nom d'utilisateur (username).
export const TokenContext = createContext();
export const UsernameContext = createContext();

// Composant AuthContextProvider qui fournit les contextes aux composants enfants.
export function AuthContextProvider({ children }) {
  // Utilisation de useState pour gérer l'état du jeton et du nom d'utilisateur.
  const [token, setToken] = useState(null); // Le jeton est initialement null.
  const [username, setUsername] = useState(''); // Le nom d'utilisateur est initialement une chaîne vide.

  return (
    // children : Les composants enfants auront accès au contexte
    <TokenContext.Provider value={[token, setToken]}>
      <UsernameContext.Provider value={[username, setUsername]} >
        {children}
      </UsernameContext.Provider>
    </TokenContext.Provider>
  );
}

// Hook personnalisé useTokenContext pour accéder au contexte du jeton.
export function useTokenContext() {
  return useContext(TokenContext);
}

// Hook personnalisé useUsernameContext pour accéder au contexte du nom d'utilisateur.
export function useUsernameContext() {
  return useContext(UsernameContext);
}