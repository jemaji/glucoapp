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
  const [chartData, setChartData] = useState([]);

  const glucoseValues = glucoseData.map(entry => entry.value);
  const glucoseMax = Math.max(...glucoseValues); // Valor máximo de glucosa
  const glucoseMin = Math.min(...glucoseValues); // Valor mínimo de glucosa

  const insulinValues = insulinData.map(entry => entry.value);
  const insulinMax = Math.max(...insulinValues); // Valor máximo de glucosa
  const insulinMin = Math.min(...insulinValues); // Valor mínimo de glucosa

  useEffect(() => {
    // Procesar y filtrar los datos de glucosa y de insulina para el gráfico
    const filteredGlucoseData = glucoseData.map(entry => ({
      date: entry.date,
      glucosa: entry.value,
    }));
    const filteredInsulinData = insulinData.map(entry => ({
      date: entry.date,
      insulina: entry.value,
    }));

    // Combinar los datos filtrados para el gráfico
    const chartData = filteredGlucoseData.map((entry, index) => ({
      date: entry.date, // Fecha
      glucosa: entry.glucosa, // Valor de glucosa
      insulina: filteredInsulinData[index].insulina, // Valor de insulina
    }));

    setChartData(chartData);
  }, [glucoseData, insulinData]);

  const formatTick = (value) => {
    const date = new Date(value);
    return date.getDate().toString();
  };

  const parseDate = (dateString) => {
    const [datePart] = dateString.split(','); // Extraemos solo la parte de la fecha (día/mes/año)
    const [day, month, year] = datePart.split('/'); // Dividimos en día, mes y año
    return new Date(Number(year), Number(month) - 1, Number(day)); // Restamos 1 al mes ya que en JavaScript los meses van de 0 a 11
  };

  const lastSixData = chartData.slice(-6);

  return (
    <div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="blue" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'blue' }}
              type='category'
              tickFormatter={(value) => parseDate(value).getDate().toString()} // Convertimos las fechas al formato deseado
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
      <div className="table-container">
        <div className="title-container">
          <span>Últimos 6 datos introducidos</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Glucosa</th>
              <th>Insulina</th>
            </tr>
          </thead>
          <tbody>
            {lastSixData.map((entry) => (
              <tr key={entry.date}>
                <td>{entry.date}</td>
                <td>{entry.glucosa}</td>
                <td>{entry.insulina}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Chart;
