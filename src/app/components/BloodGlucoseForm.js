'use client'
import React, { useState, useEffect } from 'react';
import Message from '@/app/components/Message';
import withAuth from '@/app/services/withAuth';
import firebaseService from '@/app/services/firebaseService';
import { useAuth } from '@/app/services/firebaseService';

const BloodGlucoseForm = () => {
  const [bloodGlucose, setBloodGlucose] = useState('');
  const [insulin, setInsulin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [slowMessage, setSlowMessage] = useState('');
  const { user } = useAuth();
  const [pautaData, setPautaData] = useState(null);
  const [todayData, setTodayData] = useState([]);

  useEffect(() => {
    firebaseService.getDataByKey('config')
      .then((dato) => {
        // Actualizamos el estado con la pauta obtenida desde Firebase
        setPautaData(dato.pauta);
        controlSlow(dato.pauta.lenta);
      })
      .catch((error) => {
        // Manejar errores si es necesario
        setError('Error al obtener la pauta:', error);
      });
    firebaseService.getReadingsForToday(user)
      .then((data) => {
        setTodayData(data);
      })
      .catch((error) => {
        // Manejar errores si es necesario
        setError('Error al obtener lecturas del día:', error);
      });
  }, []); // El segundo argumento es un arreglo vacío, lo que indica que el useEffect solo se ejecutará una vez al montar el componente


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

  const controlSlow = (lenta) => {
    const currentHour = getCurrentHour();
    if (currentHour < 9) {
      setSlowMessage('Recuerda las ' + (lenta || pautaData.lenta) + ' unidades de lenta');
    }
  }

  const setError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
    setBloodGlucose('');
  }

  const handleBloodGlucoseChange = (event) => {
    const value = event.target.value;
    setBloodGlucose(value);

    if (value == '') {
      setInsulinAux('');
    } else {
      // pauta
      setInsulinAux(controlPautaInsulina() + ' unidades');
      controlSlow();
    }
  };

  const controlPautaInsulina = () => {
    if (todayData.length % 2 === 1){
      const pauta = pautaData[`r${todayData.length-1}`];
      if (bloodGlucose > 180)
        pautaData[`r${todayData.length-1}`] = pauta + 2;
      if (bloodGlucose < 120)
        pautaData[`r${todayData.length-1}`] = pauta - 2;
    }

    return pautaData[`r${todayData.length}`]
  }

  const handleSaveData = async () => {
    try {
      if (!bloodGlucose) {
        setError('¡Por favor, ingresa un valor para la glucosa!');
        return;
      }

      if (!/^\d+$/.test(bloodGlucose)) {
        setError('¡La glucosa solo debe contener caracteres numéricos!');
        setInsulinAux('');
        return;
      }

      const data = {
        bloodGlucose,
        insulin,
        date: new Date().toLocaleString(),
      };

      if (todayData.length % 2 === 1) {
        data.insulin = 0;
      }

      await firebaseService.saveData(data, user);
      setTodayData([...todayData, data])

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
        inputMode="numeric" // Indica que se debe mostrar el teclado numérico
        pattern="[0-9]*" 
        value={bloodGlucose}
        onChange={handleBloodGlucoseChange}
        placeholder="Glucosa"
      />
      {todayData.length % 2 == 0 && (
        <>
          <img className='label-image' src="/insulina.png" alt="Insulin label" />
          <div className='reminder-insuline'>{reminderMessage}</div>
          <input
            className='form-input'
            type="text"
            value={insulin}
            disabled
            placeholder="Insulina"
          />
        </>)}
      <button className='form-button' onClick={handleSaveData}>Guardar</button>
      {/* Utiliza el componente FeedbackMessage para mostrar los mensajes */}
      {errorMessage && <Message message={errorMessage} type="error" />}
      {successMessage && <Message message={successMessage} type="success" />}
    </div>
  );
};

BloodGlucoseForm.displayName = 'BloodGlucoseForm';

export default withAuth(BloodGlucoseForm);