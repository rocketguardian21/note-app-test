import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase';

export const firebaseAuthService = {
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error('Error en el inicio de sesión: ' + error.message);
    }
  },

  async register(name, email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar el perfil con el nombre
      await updateProfile(userCredential.user, {
        displayName: name
      });

      return userCredential.user;
    } catch (error) {
      throw new Error('Error en el registro: ' + error.message);
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error('Error al cerrar sesión: ' + error.message);
    }
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  isAuthenticated() {
    return !!auth.currentUser;
  }
}; 