import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screen/HomeScreen';
import TodoListsScreen from '../Screen/TodoListsScreen';
import SignOutScreen from '../Screen/SignOutScreen';
import SignInScreen from '../Screen/SignInScreen';
import SignUpScreen from '../Screen/SignUpScreen';
import { TokenContext } from '../Context/Context';

// Crée un onglet de navigation en bas de l'écran
const Tab = createBottomTabNavigator();

// Composant de navigation
const Navigation = () => {
  // Utilise le contexte pour accéder au jeton d'authentification
  const [token] = useContext(TokenContext);

  return (
    <NavigationContainer style={styles.container}>
      <Tab.Navigator >
        {token ? ( // Vérifie si un jeton d'authentification est présent
          // Si l'utilisateur est authentifié, affiche ces écrans
          <>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="TodoLists" component={TodoListsScreen} />
            <Tab.Screen name="SignOut" component={SignOutScreen} />
          </>
        ) : (
          // Si l'utilisateur n'est pas authentifié, affiche ces écrans
          <>
            <Tab.Screen name="SignIn" component={SignInScreen} />
            <Tab.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'scroll'
  }
})

export default Navigation;