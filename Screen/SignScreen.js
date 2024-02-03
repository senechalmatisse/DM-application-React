import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { commonStyles } from './styles/Styles';
import { signUp, signIn} from '../api/sign';
import { TokenContext, UsernameContext } from '../Context/Context'

// Le composant SignScreen sert à afficher un formulaire d'inscription ou de connexion.
// Il gère la saisie utilisateur, la validation des données et la gestion des erreurs.

const SignScreen = ({ action, title }) => {
  const [, setToken] = useContext(TokenContext);
  const [, setUsername] = useContext(UsernameContext);

  // Des états pour les données des champs et les erreurs
  const [inputData, setInputData] = useState({ username: '', password: '' });
  const [inputErrors, setInputErrors] = useState({ username: '', password: '' });

  /**
   * La fonction toggleAllTodos permet de gérer les changements dans les champs de saisie.
   *
   * @param {string} text - Texte saisi dans le champ
   * @param {string} type - Type de champ (username ou password)
   */
  const handleInputChange = (text, type) => {
    setInputData({ ...inputData, [type]: text });
    setInputErrors({ ...inputErrors, [type]: '' });
  };

  /**
   * La fonction validateInput permet de valider les entrées en fonction des expressions régulières.
   *
   * @param {string} input - Texte à valider
   * @param {RegExp} regex - Expression régulière pour la validation
   * @returns {boolean} - Renvoie true si la validation est réussie, sinon false
   */
  const validateInput = (input, regex) => regex.test(input);

  /**
   * La fonction handleSignAction peret de gérer l'action de connexion ou d'inscription
   */
  const handleSignAction = async () => {
    const { username, password } = inputData;
    const trimUsername = username.trim();
    const trimPassword = password.trim();
    const newInputErrors = { username: '', password: '' };
    const usernameRegex = /^[a-zA-Z]+(-[a-zA-Z]+)?$/;
    const passwordRegex = /^[a-zA-Z0-9_\-!]+$/;

    if (!validateInput(trimUsername, usernameRegex)) {
      newInputErrors.username = "Le nom d'utilisateur n'est pas valide.\nUtilisez des lettres et éventuellement un tiret.";
    }

    if (!validateInput(trimPassword, passwordRegex)) {
      newInputErrors.password = "Le mot de passe n'est pas valide.\nUtilisez des lettres, des chiffres, _, - ou !";
    }

    if (trimUsername === '') {
      newInputErrors.username = "Un champ vide. Veuillez recommencer.";
    }

    if (trimPassword === '') {
      newInputErrors.password = "Un champ vide. Veuillez recommencer.";
    }

    // Affichage des erreurs ou soumission des données
    if (newInputErrors.username || newInputErrors.password) {
      setInputErrors(newInputErrors);
    } else {
      switch (action) {
        case 'signup':
          signUp(username, password)
            .then((response) => {
              setToken(response);
              setUsername(username);
            })
            .catch((error) => {
              setInputErrors({ username: error.message, password: error.message });
            });
          break;
        case 'signin':
          signIn(username, password)
            .then((response) => {
              setToken(response);
              setUsername(username);
            })
            .catch((error) => {
              setInputErrors({ username: error.message, password: error.message });
            });
          break;
      }
    }
  };

  return (
    <View style={commonStyles.container}>
      {/* Titre de l'écran */}
      <Text style={commonStyles.title}>{title}</Text>

      {/* Champ de saisie pour le nom d'utilisateur */}
      <TextInput
        style={[
          commonStyles.textInput,
          inputErrors.username ? commonStyles.errorBorder : null,
        ]}
        placeholder="Nom d'utilisateur"
        value={inputData.username}
        onChangeText={(text) => handleInputChange(text, 'username')}
      />

      {/* Affichage des erreurs pour le nom d'utilisateur s'il y en a */}
      {inputErrors.username !== '' && (
        <View style={commonStyles.errorContainer}>
          <Image source={require('../assets/icon-error.png')} style={commonStyles.imageError} />
          <Text style={commonStyles.errorText}>{inputErrors.username}</Text>
        </View>
      )}

      {/* Titre et champ de saisie pour le mot de passe */}
      <Text style={commonStyles.title}>Mot de passe :</Text>
      <TextInput
        style={[
          commonStyles.textInput,
          inputErrors.password ? commonStyles.errorBorder : null,
        ]}
        placeholder="Mot de passe"
        value={inputData.password}
        onChangeText={(text) => handleInputChange(text, 'password')}
        secureTextEntry={true}
      />

      {/* Affichage des erreurs pour le mot de passe s'il y en a */}
      {inputErrors.password !== '' && (
        <View style={commonStyles.errorContainer}>
          <Image source={require('../assets/icon-error.png')} style={commonStyles.imageError} />
          <Text style={commonStyles.errorText}>{inputErrors.password}</Text>
        </View>
      )}

      {/* Bouton pour effectuer l'action (connexion ou inscription) */}
      <View style={commonStyles.buttonContainer}>
        <TouchableOpacity style={commonStyles.button} onPress={handleSignAction}>
          <Text style={commonStyles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </View>
  </View>
  );
};

export default SignScreen;