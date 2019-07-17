import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC7wKZOfi0BzMllX7zaNjxzKdOQwjBbYqM',
  authDomain: 'react-slack-clone-d4f46.firebaseapp.com',
  databaseURL: 'https://react-slack-clone-d4f46.firebaseio.com',
  projectId: 'react-slack-clone-d4f46',
  storageBucket: 'react-slack-clone-d4f46.appspot.com',
  messagingSenderId: '864520592841',
  appId: '1:864520592841:web:357471a369eb5135',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase
