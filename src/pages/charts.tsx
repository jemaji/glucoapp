'use client'
import React, { useState, useEffect } from 'react';
import Chart from '@/app/components/Chart';
import firebaseService from '@/app/services/firebaseService';

const ChartsPage = () => {
  const [glucoseData, setGlucoseData] = useState([]);
  const [insulinData, setInsulinData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await firebaseService.getData();
        const extractedGlucoseData = extractGlucoseData(Object.values(data));
        const extractedInsulinData = extractInsulinData(Object.values(data));
        setGlucoseData(extractedGlucoseData);
        setInsulinData(extractedInsulinData);
      } catch (error) {
        console.error('Error al recuperar los datos de Firebase:', error);
      }
    };

    fetchData();
  }, []);

  const extractInsulinData = (data:any) => {
    return data.map((entry:any) => ({
      date: entry.date,
      value: parseInt(entry.insulin),
    }));
  };

  const extractGlucoseData = (data:any) => {
    return data.map((entry:any) => ({
      date: entry.date,
      value: parseInt(entry.bloodGlucose),
    }));
  };

  return (
    <div className="page-content">
      <Chart glucoseData={glucoseData} insulinData={insulinData} />
    </div>
  );
};

export default ChartsPage;
