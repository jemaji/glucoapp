'use client'
import React, { useState, useEffect, useRef } from 'react';
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
  const inputRef = useRef(null);
  const [pautaData, setPautaData] = useState(null);
  const [todayData, setTodayData] = useState([]);

  useEffect(() => {
    firebaseService.getReadingsForToday(user)
      .then((data) => {
        setTodayData(data);
      })
      .catch((error) => {
        // Manejar errores si es necesario
        setError('Error al obtener lecturas del día:', error);
      });
    firebaseService.getDataByKeyAndUser('config', user?.uid)
      .then((dato) => {
        // Actualizamos el estado con la pauta obtenida desde Firebase
        if (!dato) {
          firebaseService.saveConfigKey('pauta', firebaseService.defaultPauta(), user.uid);
        }
        setPautaData(dato?.pauta || firebaseService.defaultPauta);
      })
      .catch((error) => {
        // Manejar errores si es necesario
        setError('Error al obtener la pauta:', error);
      });

  }, []); // El segundo argumento es un arreglo vacío, lo que indica que el useEffect solo se ejecutará una vez al montar el componente

  const setInsulinAux = (insulin_) => {
    if (insulin_ !== '') {
      setReminderMessage('Recuerda purgar el bolígrafo con 2 unidades');
    } else {
      setReminderMessage('');
    }
    setInsulin(insulin_.split(" ")[0]);
  }

  const controlSlow = (lenta) => {
    if (todayData.length === 0) {
      // setSlowMessage('Recuerda las ' + (lenta || pautaData.lenta) + ' unidades de lenta');
      setSlowMessage('Recuerda tomarte la pastilla');
    }
  }

  const setError = (message) => {
    setErrorMessage(message);
    console.log(message);
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
      setInsulinAux(pautaData[`r${todayData.length}`] + ' unidades');
    }
    controlSlow();
  };

  // metodo de control de lenta y flags, solo usar una vez al guardar
  const controlPautaInsulinaLenta = () => {
    // si es la primera lectura del día
    if (todayData.length === 0) {
      // incremento el día
      const day = pautaData.day;
      pautaData.day = day + 1;

      const lenta = pautaData.lenta;
      const lentabaja = pautaData.lentabaja;

      if (bloodGlucose < 80) {
        if (lentabaja === 4) {
          pautaData.lenta = lenta - lentabaja;
          pautaData.lentabaja = 0;
        } else {
          pautaData.lentabaja = 4;
        }
      } else if (80 < bloodGlucose < 120) {
        if (lentabaja === 2) {
          pautaData.lenta = lenta - lentabaja;
          pautaData.lentabaja = 0;
        } else {
          pautaData.lentabaja = 2;
        }
      }

      setPautaData(pautaData);
    }
  }

  const controlPautaInsulinaRapida = () => {
    // rápida por comida
    if (todayData.length % 2 === 1) {
      const rapida = pautaData[`r${todayData.length - 1}`];
      if (bloodGlucose > 180)
        pautaData[`r${todayData.length - 1}`] = rapida + 2;
      if (bloodGlucose < 120)
        pautaData[`r${todayData.length - 1}`] = rapida - 2;
    }

    setPautaData(pautaData);

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
      
      data.insulin = '';
      // if (todayData.length % 2 === 1) {
        // data.insulin = '0';
      // }

      await firebaseService.saveData(data, user);
      // controlPautaInsulinaRapida();
      // controlPautaInsulinaLenta();
      // firebaseService.saveConfigKey('pauta', pautaData, user.uid);
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

  const handleNextField = (event) => {
    // Ocultar el teclado desenfocando el campo de entrada
    if (event.key === 'Enter') {
      inputRef?.current?.blur();
    }
    // Aquí puedes agregar lógica adicional para pasar al siguiente campo si lo deseas
  };

  return (
    <div className='form-container'>
      <div className='reminder-insuline'>{slowMessage}</div><br />
      <img className='label-image' src="/gluco.png" alt="Glucose label" />
      <input
        ref={inputRef}
        className={`form-input${bloodGlucose ? '' : ' error'}`}
        type="text"
        inputMode="numeric" // Indica que se debe mostrar el teclado numérico
        pattern="[0-9]*"
        value={bloodGlucose}
        onChange={handleBloodGlucoseChange}
        onKeyDown={handleNextField}
        placeholder="Glucosa"
      />
      {/* {todayData.length % 2 == 0 && ( */}
      {false && (
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