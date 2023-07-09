import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, get } from 'firebase/database';

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

const firebaseService = {
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
    saveData: async (data) => {
        try {
            const formDataRef = ref(database, 'formData');
            const newFormEntryRef = push(formDataRef);
            await set(newFormEntryRef, data);
            return newFormEntryRef.key;
        } catch (error) {
            console.error('Error al guardar los datos en Firebase:', error);
            throw error;
        }
    },
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
};

export default firebaseService;