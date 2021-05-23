import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyDT2ME1UymMcSGUT1kpaLq1Cy1tQUEoKrc',
  authDomain: 'ecommerce-react-e94fc.firebaseapp.com',
  projectId: 'ecommerce-react-e94fc',
  storageBucket: 'ecommerce-react-e94fc.appspot.com',
  messagingSenderId: '972767282205',
  appId: '1:972767282205:web:56686caa0a989ae418f2f4',
  measurementId: 'G-HJDTSRGT0Q'
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
