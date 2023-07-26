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
        const data = await firebaseService.getUserData(user, selectedMonth, selectedYear);
        const extractedGlucoseData = extractGlucoseData(Object.values(data));
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
  }, [user, selectedMonth, selectedYear]);

  const extractInsulinData = (data: any) => {
    return data.map((entry: any) => ({
      date: entry.date,
      value: parseInt(entry.insulin),
    }));
  };

  const extractGlucoseData = (data: any) => {
    return data.map((entry: any) => ({
      date: entry.date,
      value: parseInt(entry.bloodGlucose),
    }));
  };

  const handleMonthChange = (event: any) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event: any) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="page-content">
      <div className="selection-container">
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
      <Chart glucoseData={glucoseData} insulinData={insulinData} />
      {errorMessage && <Message message={errorMessage} type="error" />}
    </div>
  );
};

export default withAuth(ChartsPage);
