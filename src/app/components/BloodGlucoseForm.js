'use client'
import React, { useState } from 'react';
import Message from '@/app/components/Message';
import withAuth from '@/app/services/withAuth';
import firebaseService from '@/app/services/firebaseService';
import { useAuth } from '@/app/services/firebaseService';

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
  const { user } = useAuth();

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
    setInsulin(insulin_.split(" ")[0]);
  }

  const controlSlow = () => {
    const currentHour = getCurrentHour();
    if (currentHour < 9) {
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

  const handleSaveData = async () => {
    try {
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
        date: new Date().toLocaleString(),
      };

      await firebaseService.saveData(data, user);

      setBloodGlucose('');
      setInsulinAux('');
      setSuccessMessage('¡Guardado exitosamente!');
      setReminderMessage('');
      setSlowMessage('');
      setTimeout(() => setSuccessMessage(''), 2000);

    } catch (error) {
      setError(`¡Error al guardar: ${error.message}`);
    };
  };

  return (
    <div className='form-container'>
      <div className='reminder-insuline'>{slowMessage}</div><br />
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
      {/* Utiliza el componente FeedbackMessage para mostrar los mensajes */}
      {errorMessage && <Message message={errorMessage} type="error" />}
      {successMessage && <Message message={successMessage} type="success" />}
    </div>
  );
};

BloodGlucoseForm.displayName = 'BloodGlucoseForm';

export default withAuth(BloodGlucoseForm);