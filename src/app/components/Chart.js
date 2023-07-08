'use client'
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Chart = ({ glucoseData, insulinData }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);

  // Filtrar los datos por el mes seleccionado
  const filteredGlucoseData = glucoseData.filter(entry => entry.date.includes(selectedMonth));
  const filteredInsulinData = insulinData.filter(entry => entry.date.includes(selectedMonth));

  const chartData = filteredGlucoseData.map((entry, index) => ({
    date: entry.date, // Fecha
    glucosa: entry.value, // Valor de glucosa
    insulina: filteredInsulinData[index].value, // Valor de insulina
  }));

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  useEffect(() => {
    // Obtener los meses disponibles en los datos
    const months = glucoseData.map(entry => entry.date.slice(0, 7));
    const uniqueMonths = [...new Set(months)];
    setAvailableMonths(uniqueMonths);
    setSelectedMonth(uniqueMonths[0]); // Establecer el primer mes como seleccionado inicialmente
  }, [glucoseData]);

  return (
    <div>
      <div className="button-container">
        {availableMonths.map((month) => (
          <button
            key={month}
            onClick={() => handleMonthChange(month)}
            className="form-button small-button"
          >
            {month}
          </button>
        ))}
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="blue" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'blue' }}
              tickFormatter={(value) => value.slice(0, 7)}
              label={{ value: 'Fecha', position: 'top', fontSize: 12, fill: 'blue' }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: 'Glucosa', angle: -90, position: 'insideLeft', fontSize: 12, fill: 'blue' }}
              tick={{ fontSize: 10, fill: 'blue' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Insulina', angle: 90, position: 'insideRight', fontSize: 12, fill: 'blue' }}
              tick={{ fontSize: 10, fill: 'blue' }}
            />
            <Tooltip />
            <Legend
              wrapperStyle={{ fontSize: 10, color: 'blue' }}
              align="center"
              verticalAlign="top"
              height={36}
            />
            <Line type="monotone" dataKey="glucosa" yAxisId="left" stroke="red" strokeWidth={3} name="Glucosa" />
            <Line type="monotone" dataKey="insulina" yAxisId="right" stroke="green" strokeWidth={1} name="Insulina" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;

