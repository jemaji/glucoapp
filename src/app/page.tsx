'use client'
import React from 'react';
import './styles/globals.scss';
import BloodGlucoseForm from './components/BloodGlucoseForm';
import Header from './components/Header';
import Chart from './components/Chart';

const Page = () => {

  const glucoseData = [
    { date: '2023-05-01', value: 120 },
    { date: '2023-05-02', value: 110 },
    { date: '2023-05-04', value: 130 },
    { date: '2023-05-05', value: 130 },
    { date: '2023-05-06', value: 130 },
    { date: '2023-05-07', value: 130 },
    { date: '2023-05-08', value: 130 },
    { date: '2023-05-09', value: 130 },
    { date: '2023-05-10', value: 130 },
    // ... más datos de glucosa
  ];

  const insulinData = [
    { date: '2023-05-01', value: 12 },
    { date: '2023-05-02', value: 14 },
    { date: '2023-05-04', value: 16 },
    { date: '2023-05-05', value: 10 },
    { date: '2023-05-06', value: 18 },
    { date: '2023-05-07', value: 13 },
    { date: '2023-05-08', value: 10 },
    { date: '2023-05-09', value: 12 },
    { date: '2023-05-10', value: 12 },
    // ... más datos de insulina
  ];

  return (
    <div>
      <Header />
      <div className="page-content">
        <BloodGlucoseForm />
      </div>
      <Chart glucoseData={glucoseData} insulinData={insulinData} />
    </div>
  );
};

export default Page;

