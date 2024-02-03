import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTokenContext, useUsernameContext } from '../Context/Context';
import { commonStyles } from './styles/Styles';

// Composant pour l'écran de déconnexion
const SignOutScreen = () => {
  const [, setToken] = useTokenContext();
  const [, setUsername] = useUsernameContext();

  /**
   * La fonction toggleAllTodo permet de déconnecter l'utilisateur
   */
  const handleSignOut = () => {
    setToken(null);
    setUsername(null);
  };

  return (
    <View style={commonStyles.container}>
      {/* Texte pour demander confirmation de la déconnexion */}
      <Text style={commonStyles.text}>Voulez-vous déconnecter ?</Text>

      <View style={commonStyles.buttonContainer}>
        {/* Bouton de déconnexion */}
        <TouchableOpacity style={commonStyles.button} onPress={handleSignOut}>
          <Text style={commonStyles.buttonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SignOutScreen;