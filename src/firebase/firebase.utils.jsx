import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyDPwEzamdqzMfurbweuxD9bbC4fyOs4rBc',
  authDomain: 'ecommerce-react-cc764.firebaseapp.com',
  projectId: 'ecommerce-react-cc764',
  storageBucket: 'ecommerce-react-cc764.appspot.com',
  messagingSenderId: '1065185293618',
  appId: '1:1065185293618:web:8291378bb2be5e2f11132b',
  measurementId: 'G-H44KF11YGK'
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
