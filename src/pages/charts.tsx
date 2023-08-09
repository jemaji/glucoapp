import React, { useState, useEffect } from 'react';
import Chart from '@/app/components/Chart';
import firebaseService from '@/app/services/firebaseService';
import withAuth from '@/app/services/withAuth';
import { useAuth } from '@/app/services/firebaseService';
import Message from '@/app/components/Message';

const ChartsPage = () => {
  const [glucoseData, setGlucoseData] = useState([]);
  const [insulinData, setInsulinData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();
  const [selectedHalf, setSelectedHalf] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableMonths, setAvailableMonths] = useState(new Array<any>());
  const [availableYears, setAvailableYears] = useState(new Array<any>());

  const setError = (message: any) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await firebaseService.getUserDataChart({ user, selectedHalf, selectedMonth, selectedYear });
        const extractedGlucoseData: any = Object.values(data);
        const extractedInsulinData = extractInsulinData(Object.values(data));
        setGlucoseData(extractedGlucoseData);
        setInsulinData(extractedInsulinData);

        // Obtener los meses y años únicos de los datos de glucosa
        const glucoseMonths = extractedGlucoseData.map((entry: any) => entry.date.split('/')[1]);
        const glucoseUniqueMonths: Array<any> = [...new Set(glucoseMonths)];
        if (availableMonths?.length === 0)
          setAvailableMonths(glucoseUniqueMonths);

        const glucoseYears = extractedGlucoseData.map((entry: any) => entry.date.split('/')[2].split(',')[0]);
        const glucoseUniqueYears: Array<any> = [...new Set(glucoseYears)];
        if (availableYears?.length === 0)
          setAvailableYears(glucoseUniqueYears);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, [user, selectedMonth, selectedYear, selectedHalf]);

  const extractInsulinData = (data: any) => {
    return data.map((entry: any) => ({
      date: entry.date,
      value: entry.insulin,
    }));
  };

  const handleHalfChange = (event: any) => {
    if (selectedMonth === '')
      setError('Seleccione un mes');
    else
      setSelectedHalf(event.target.value);
  };

  const handleMonthChange = (event: any) => {
    setSelectedMonth(event.target.value);
    if (event.target.value === '')
      setSelectedHalf('');
  };

  const handleYearChange = (event: any) => {
    setSelectedYear(event.target.value);
  };

  const handlePreviousHalf = () => {
    // Obtener el valor actual del combo de quincenas
    let currentHalf: any = selectedHalf || 1;
    // Restar 1 a la quincena actual
    currentHalf -= 1;
    if (currentHalf < 1) {
      // Si la quincena es menor a 1, ajustarla a 1
      currentHalf = 2;
      const indexOfCurrentMonth = availableMonths.indexOf(selectedMonth);
      if (indexOfCurrentMonth-1 < 0) {
        setSelectedMonth(availableMonths[availableMonths.length-1]);
      } else {
        setSelectedMonth(availableMonths[indexOfCurrentMonth-1]);
      }
    }
    // Actualizar el estado con la nueva quincena seleccionada
    setSelectedHalf(currentHalf);
  };

  const handleNextHalf = () => {
    // Obtener el valor actual del combo de quincenas
    let currentHalf: any = selectedHalf || 1;
    // Sumar 1 a la quincena actual
    currentHalf = currentHalf + 1;
    if (currentHalf > 2) {
      // Si la quincena es mayor a 2, ajustarla a 2
      currentHalf = 1;
      const indexOfCurrentMonth = availableMonths.indexOf(selectedMonth);
      if (indexOfCurrentMonth+1 == availableMonths.length) {
        setSelectedMonth(availableMonths[0]);
      } else {
        setSelectedMonth(availableMonths[indexOfCurrentMonth+1]);
      }
    }
    // Actualizar el estado con la nueva quincena seleccionada
    setSelectedHalf(currentHalf);
  };


  return (
    <div className="page-content">
      <div className="selection-container">
        <div className='selects-container'>
          <select value={selectedHalf} onChange={handleHalfChange} className="form-select">
            <option key="" value="">
              Mitad
            </option>
            <option key="1" value="1">Primera</option>
            <option key="2" value="2">Segunda</option>
          </select>
          <select value={selectedMonth} onChange={handleMonthChange} className="form-select">
            <option key="" value="">
              Meses
            </option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {new Date(2023, parseInt(month) - 1, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select value={selectedYear} onChange={handleYearChange} className="form-select">
            <option key="" value="">
              Años
            </option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="navigation-buttons">
          <button className='form-button-navigation' onClick={handlePreviousHalf} disabled={selectedMonth==''}>Anterior</button>
          <button className='form-button-navigation' onClick={handleNextHalf} disabled={selectedMonth==''}>Siguiente</button>
        </div>
      </div>
      <Chart glucoseData={glucoseData} insulinData={insulinData} />
      {errorMessage && <Message message={errorMessage} type="error" />}
    </div>
  );
};

ChartsPage.displayName = 'ChartsPage';

export default withAuth(ChartsPage);
