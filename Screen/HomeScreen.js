import React from 'react';
import { View, Text } from 'react-native';
import { useTokenContext, useUsernameContext } from '../Context/Context';
import { commonStyles } from './styles/Styles';

// Composant pour l'écran d'accueil
const HomeScreen = () => {
    const [token] = useTokenContext();
    const [username] = useUsernameContext();

    // Message de bienvenue basé sur la présence du token et du nom d'utilisateur
    const welcomeMessage = token ? (
        `Bienvenue !\nVous êtes connecté en tant que : ${username}`
    ) : (
        "Vous n'êtes pas connecté.\nConnectez-vous pour voir ce contenu."
    );

    return (
        <View style={commonStyles.container}>
            {/* Affichage du message de bienvenue */}
            <Text style={commonStyles.welcomeText}>{welcomeMessage}</Text>
        </View>
    );
}

export default HomeScreen;