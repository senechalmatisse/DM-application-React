import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 10,
    alignSelf: 'start',
    marginLeft: 20,
  },
  textInput: {
    fontWeight: 'italic',
    marginRight: 20,
    backgroundColor: 'lightgrey',
    padding: 10,
    width: 260,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    opacity: 0.6,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  imageError: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 0,
    flexWrap: 'wrap',
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    flex: 1,
  },
  errorBorder: {
    borderColor: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageTrash: {
    width: 24,
    height: 24,
  },
  listTodo: {
    borderWidth: 1,
    borderColor: 'dimgray',
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: 'lightgray',
    marginLeft: -20,
  }
});