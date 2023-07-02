'use client'
import React, { useState } from 'react';

const BloodGlucoseForm = () => {
  const [bloodGlucose, setBloodGlucose] = useState('');
  const [insulin, setInsulin] = useState('');

  const handleBloodGlucoseChange = (event) => {
    const value = event.target.value;
    setBloodGlucose(value);
    setInsulin(value <= 120 ? '12' : '14');
  };

  const handleSaveData = () => {
    const data = {
      bloodGlucose,
      insulin,
      date: new Date().toLocaleString()
    };
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    savedData.push(data);
    localStorage.setItem('data', JSON.stringify(savedData));
    setBloodGlucose('');
    setInsulin('');
  };

  return (
    <div className='form-container'>
        <img className='label-image' src="/gluco.png"></img>
        <input
          className='form-input'
          type="number"
          value={bloodGlucose}
          onChange={handleBloodGlucoseChange}
          placeholder="Glucosa"
        />
        <img className='label-image' src="/insulina.png"/>
        <input
          className='form-input'
          type="number"
          value={insulin}
          disabled
          placeholder="Insulina"
        />
      <button className='form-button' onClick={handleSaveData}>Guardar</button>
    </div>
  );
};

export default BloodGlucoseForm ;
