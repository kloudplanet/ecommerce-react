import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyCRcGwJfG7u3SP8rQ-G2zSrVUhm9Y-WKZ0',
  authDomain: 'ecommerce-react-352d8.firebaseapp.com',
  projectId: 'ecommerce-react-352d8',
  storageBucket: 'ecommerce-react-352d8.appspot.com',
  messagingSenderId: '498703188319',
  appId: '1:498703188319:web:2e44918a918f0541a2b6ea',
  measurementId: 'G-W6X3DWSGJ2'
}

firebase.initializeApp(config)

export const firestore = firebase.firestore()
export const auth = firebase.auth()

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })
export const signInWithGoogle = () => auth.signInWithPopup(provider)

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return

  // Get a reference to the place in the database where the user is stored
  const userRef = firestore.doc(`users/${userAuth.uid}`)

  const snapshot = await userRef.get()

  if (!snapshot.exists) {
    const { displayName, email } = userAuth
    const createdAt = new Date()
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      })
    } catch (error) {
      console.error('error creating user', error.message)
    }
  }

  return getUserDocumentRef(userAuth.uid)
}

export const getUserDocumentRef = async (uid) => {
  if (!uid) return null

  try {
    return firestore.doc(`users/${uid}`)
  } catch (error) {
    console.error('error fetching user', error.message)
  }
}

export default firebase
