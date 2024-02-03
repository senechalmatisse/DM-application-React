import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { commonStyles } from '../../Screen/styles/Styles';

/**
 * Composant d'entrée permettant d'ajouter une nouvelle liste.
 *
 * @param {Function} onSubmit - Fonction de rappel appelée lors de la soumission du formulaire
 */
export default function Input({ onSubmit }) {
  const [inputText, setInputText] = useState('');

  /**
   * Gère le changement de texte dans le champ de saisie.
   *
   * @param {string} text - Texte saisi dans le champ
   */
  const handleInputChange = (text) => {
    setInputText(text);
  };

  /**
   * Gère la soumission du formulaire.
   */
  const handleSubmit = () => {
    if (inputText.trim() !== '') {
      onSubmit(inputText);
      setInputText('');
    }
  };

  return (
    <View style={styles.inputContainer}>
      {/* Champ de saisie pour l'ajout d'une nouvelle liste de tâches */}
      <TextInput
        style={commonStyles.textInput}
        placeholder="Nouvelle liste"
        onChangeText={handleInputChange}
        value={inputText}
      />
      {/* Bouton pour soumettre le formulaire */}
      <TouchableOpacity onPress={handleSubmit}>
        <Image
          source={require('../../assets/icon-plus.png')}
          style={styles.imagePlus} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 240
  },
  imagePlus: {
    width: 48,
    height: 48,
    marginLeft: -20
  }
});