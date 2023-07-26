import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { createContext, useContext, useState, useEffect } from 'react';

// Configura la conexión con Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB1rUWZHhUTUAqoEOr9TgfWYS68-SIwczY",
    authDomain: "gluinsapp.firebaseapp.com",
    databaseURL: "https://gluinsapp-default-rtdb.europe-west1.firebasedatabase.app", // Actualiza la URL de la base de datos aquí
    projectId: "gluinsapp",
    storageBucket: "gluinsapp.appspot.com",
    messagingSenderId: "294375015945",
    appId: "1:294375015945:web:bec406427d930497c09ad8"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

const AuthContext = createContext(null);

const firebaseService = {
  getCurrentUser: () => {
    return auth.currentUser;
  },
  // Función para obtener datos de Firebase
  getData: async () => {
    try {
      const snapshot = await get(ref(database, 'formData'));
      const dataFromFirebase = snapshot.val();
      return dataFromFirebase;
    } catch (error) {
      console.error('Error al recuperar los datos de Firebase:', error);
      throw error;
    }
  },

  // Función para guardar datos en Firebase junto con información del usuario logado
  saveData: async (data, user) => {
    try {
      // Obtener el usuario logado desde el contexto de autenticación
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Incluir información del usuario en el objeto data
      const dataWithUserInfo = {
        ...data,
        userId: user.uid, // Guardar el ID del usuario
        userEmail: user.email, // Guardar el email del usuario (opcional)
      };

      const formDataRef = ref(database, 'formData');
      const newFormEntryRef = push(formDataRef);
      await set(newFormEntryRef, dataWithUserInfo);
      return newFormEntryRef.key;
    } catch (error) {
      console.error('Error al guardar los datos en Firebase:', error);
      throw error;
    }
  },

  getUserData: async (user, month, year) => {
    try {
      // Obtener el usuario logado desde el contexto de autenticación
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Obtener la referencia a la base de datos de Firebase y aplicar el filtro por userId
      const databaseRef = ref(database, 'formData');
      const userQuery = query(databaseRef, orderByChild('userId'), equalTo(user.uid));

      // Ejecutar la consulta en Firebase y obtener los resultados
      let snapshot;

      if (user.uid === "56Pz6XnN06NsQLlc53sUmAdWRJ62") {
        snapshot = await get(databaseRef);
      } else {
        snapshot = await get(userQuery);
      }

      // Filtrar los datos por mes y/o año
      const userFormData = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        // Obtener el mes y el año de la fecha
        const [day, monthData, yearData] = data.date.split('/');
        const dataMonth = Number(monthData);
        const dataYear = Number(yearData.split(',')[0]);

        // Verificar si el mes y el año coinciden con los parámetros proporcionados
        const monthMatch = !month || dataMonth === Number(month);
        const yearMatch = !year || dataYear === Number(year);

        // Agregar el dato al resultado si coincide con el mes y el año especificados
        if (monthMatch && yearMatch) {
          userFormData.push(data);
        }
      });

      // Ordenar los datos por fecha
      userFormData.sort((a, b) => new Date(a.date) - new Date(b.date));

      return userFormData;
    } catch (error) {
      console.error('Error al obtener los datos del usuario en Firebase:', error);
      throw error;
    }
  },

  // Función para insertar un array de datos en Firebase
  insertDataArray: async (dataArray) => {
    try {
      const formDataRef = ref(database, 'formData');

      // Recorrer el array de datos y guardar cada objeto en Firebase
      for (let i = 0; i < dataArray.length; i++) {
        const newFormEntryRef = push(formDataRef);
        await set(newFormEntryRef, dataArray[i]);
      }

      console.log('Datos insertados exitosamente en Firebase');
    } catch (error) {
      console.error('Error al insertar los datos en Firebase:', error);
      throw error;
    }
  },

  // Función para registrar un usuario con email y contraseña
  registerUserWithEmail: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.error('Error al registrar el usuario con email y contraseña:', error);
      throw error;
    }
  },

  // Función para iniciar sesión con email y contraseña
  loginUserWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión con email y contraseña:', error);
      throw error;
    }
  },

  // Función para iniciar sesión con Google
  loginUserWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  },

  // Función para cerrar sesión
  logoutUser: async () => {
    try {
      await signOut(auth);
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default firebaseService;
