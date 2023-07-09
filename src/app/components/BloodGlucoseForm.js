'use client'
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB1rUWZHhUTUAqoEOr9TgfWYS68-SIwczY",
  authDomain: "gluinsapp.firebaseapp.com",
  databaseURL: "https://gluinsapp-default-rtdb.europe-west1.firebasedatabase.app", // Actualiza la URL de la base de datos aquí
  projectId: "gluinsapp",
  storageBucket: "gluinsapp.appspot.com",
  messagingSenderId: "294375015945",
  appId: "1:294375015945:web:bec406427d930497c09ad8"
};

// Inicializa la app de Firebase
const firebaseApp = initializeApp(firebaseConfig);

const insulinGuidelines = {
  80: 10,    // Glucosa < 80
  129: 12,   // 80 <= Glucosa < 129
  149: 13,  // 129 <= Glucosa < 149
  199: 14,  // 149 <= Glucosa < 199
  249: 15,  // 199 <= Glucosa < 249
  300: 16,  // 249 <= Glucosa < 299
};

const BloodGlucoseForm = () => {
  const [bloodGlucose, setBloodGlucose] = useState('');
  const [insulin, setInsulin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [slowMessage, setSlowMessage] = useState('');


  const getCurrentHour = () => {
    const date = new Date();
    return date.getHours();
  };

  const setInsulinAux = (insulin_) => {
    if (insulin_ !== '') {
      const currentHour = getCurrentHour();
      if (currentHour >= 7 && currentHour < 23) {
        setReminderMessage('Recuerda purgar el bolígrafo con 2 unidades');
      }
    }
    setInsulin(insulin_);
  }

  const controlSlow = () => {
    const currentHour = getCurrentHour();
    console.log(currentHour);
    if (currentHour > 9) {
      setSlowMessage('Recuerda las 40 unidades de lenta');
    }
  }

  const setError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
    setBloodGlucose('')
  }

  const handleBloodGlucoseChange = (event) => {
    const value = event.target.value;
    setBloodGlucose(value);

    if (value == '') {
      setInsulinAux('');
    } else {
      // pauta
      let insulinValue = ''
      for (const glucoseThreshold in insulinGuidelines) {
        if (value < parseInt(glucoseThreshold)) {
          insulinValue = insulinGuidelines[glucoseThreshold];
          break;
        } else {
          insulinValue = 18;
        }
      }
      setInsulinAux(insulinValue + ' unidades');
      controlSlow(); 
    }
  };

  const handleSaveData = () => {
    if (!bloodGlucose) {
      setError('¡Por favor, ingresa un valor para la glucosa!');
      return;
    }

    if (!/^\d+$/.test(bloodGlucose)) {
      setError('¡La glucosa solo debe contener caracteres numéricos!');
      return;
    }

    const data = {
      bloodGlucose,
      insulin,
      date: new Date().toLocaleString()
    };

    // Guarda los datos en Firebase Realtime Database
    const database = getDatabase(firebaseApp);
    const formDataRef = ref(database, 'formData');

    push(formDataRef, data)
      .then(() => {
        setBloodGlucose('');
        setInsulinAux('');
        setSuccessMessage('¡Guardado exitosamente!');
        setTimeout(() => setSuccessMessage(''), 2000);
      })
      .catch((error) => {
        setError(`¡Error al guardar: ${error.message}`);
      });
  };

  return (
    <div className='form-container'>
      <div className='reminder-insuline'>{slowMessage}</div><br/>
      <img className='label-image' src="/gluco.png" alt="Glucose label" />
      <input
        className={`form-input${bloodGlucose ? '' : ' error'}`}
        type="text"
        value={bloodGlucose}
        onChange={handleBloodGlucoseChange}
        placeholder="Glucosa"
      />
      <img className='label-image' src="/insulina.png" alt="Insulin label" />
      <div className='reminder-insuline'>{reminderMessage}</div>
      <input
        className='form-input'
        type="text"
        value={insulin}
        disabled
        placeholder="Insulina"
      />
      <button className='form-button' onClick={handleSaveData}>Guardar</button>
      {errorMessage && (
        <div className="error-popup">
          <p>{errorMessage}</p>
        </div>
      )}
      {successMessage && (
        <div className="success-popup">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default BloodGlucoseForm;