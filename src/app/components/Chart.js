'use client'
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Chart = ({ glucoseData, insulinData }) => {
  const chartData = glucoseData.map((entry, index) => ({
    date: entry.date, // Fecha
    glucosa: entry.value, // Valor de glucosa
    insulina: insulinData[index].value, // Valor de insulina
  }));

  return (
    <LineChart width={600} height={400} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis yAxisId="left" label={{ value: 'Glucosa', angle: -90, position: 'insideLeft' }} />
      <YAxis yAxisId="right" orientation="right" label={{ value: 'Insulina', angle: 90, position: 'insideRight' }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="glucosa" yAxisId="left" stroke="blue" name="Glucosa" />
      <Line type="monotone" dataKey="insulina" yAxisId="right" stroke="orange" name="Insulina" />
    </LineChart>
  );
};

export default Chart;
