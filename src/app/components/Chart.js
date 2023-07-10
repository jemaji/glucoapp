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

const Chart = ({ glucoseData = [], insulinData = [] }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [chartData, setChartData] = useState([]);

  const glucoseValues = glucoseData.map(entry => entry.value);
  const glucoseMax = Math.max(...glucoseValues); // Valor máximo de glucosa
  const glucoseMin = Math.min(...glucoseValues); // Valor mínimo de glucosa

  const insulinValues = insulinData.map(entry => entry.value);
  const insulinMax = Math.max(...insulinValues); // Valor máximo de glucosa
  const insulinMin = Math.min(...insulinValues); // Valor mínimo de glucosa

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    const filteredGlucoseData = glucoseData.filter(entry => {
      const [day, month, year] = entry.date.split('/');
      return selectedMonth === month && selectedYear === year.split(',')[0];
    });
    const filteredInsulinData = insulinData.filter(entry => {
      const [day, month, year] = entry.date.split('/');
      return selectedMonth === month && selectedYear === year.split(',')[0];
    });

    const chartData = filteredGlucoseData.map((entry, index) => ({
      date: entry.date, // Fecha
      glucosa: entry.value, // Valor de glucosa
      insulina: filteredInsulinData[index].value, // Valor de insulina
    }));
    setChartData(chartData);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    const filteredGlucoseData = glucoseData.filter(entry => {
      const [day, month, year] = entry.date.split('/');
      return selectedMonth === month && selectedYear === year.split(',')[0];
    });
    const filteredInsulinData = insulinData.filter(entry => {
      const [day, month, year] = entry.date.split('/');
      return selectedMonth === month && selectedYear === year.split(',')[0];
    });

    const chartData = filteredGlucoseData.map((entry, index) => ({
      date: entry.date, // Fecha
      glucosa: entry.value, // Valor de glucosa
      insulina: filteredInsulinData[index].value, // Valor de insulina
    }));
    setChartData(chartData);
  };

  useEffect(() => {
    // Obtener los meses y años disponibles en los datos
    const months = glucoseData.map(entry => entry.date.split('/')[1]);
    const uniqueMonths = [...new Set(months)];
    setAvailableMonths(uniqueMonths);
    setSelectedMonth(uniqueMonths[0]); // Establecer el primer mes como seleccionado inicialmente

    const years = glucoseData.map(entry => entry.date.split('/')[2].split(',')[0]);
    const uniqueYears = [...new Set(years)];
    setAvailableYears(uniqueYears);
    setSelectedYear(uniqueYears[0]); // Establecer el primer año como seleccionado inicialmente

    const chartData = glucoseData.map((entry, index) => ({
      date: entry.date, // Fecha
      glucosa: entry.value, // Valor de glucosa
      insulina: insulinData[index].value, // Valor de insulina
    }));
    setChartData(chartData);

  }, [glucoseData]);

  const formatTick = (value) => {
    const date = new Date(value);
    return date.getDate().toString();
  };

  return (
    <div>
      <div className="selection-container">
        <select value={selectedMonth} onChange={handleMonthChange} className="form-select">
          <option key="" value="">
            Todos
          </option>
          {availableMonths.map(month => (
            <option key={month} value={month}>
              {new Date(2023, month - 1, 1).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select value={selectedYear} onChange={handleYearChange} className="form-select">
          <option key="" value="">
            Todos
          </option>
          {availableYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="blue" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'blue' }}
              tickFormatter={formatTick}
              label={{ value: 'Fecha', position: 'top', fontSize: 12, fill: 'blue' }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: 'Glucosa', angle: -90, position: 'insideLeft', fontSize: 12, fill: 'blue' }}
              tick={{ fontSize: 10, fill: 'blue' }}
              domain={[glucoseMin, glucoseMax]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Insulina', angle: 90, position: 'insideRight', fontSize: 12, fill: 'blue' }}
              tick={{ fontSize: 10, fill: 'blue' }}
              domain={[insulinMin, insulinMax]}
            />
            <Tooltip />
            <Legend
              wrapperStyle={{ fontSize: 10, color: 'blue' }}
              align="center"
              verticalAlign="top"
              height={36}
            />
            <Line type="monotone" dataKey="glucosa" yAxisId="left" stroke="red" strokeWidth={3} name="Glucosa" />
            <Line type="monotone" dataKey="insulina" yAxisId="right" stroke="green" strokeWidth={2} name="Insulina" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
