'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const BarChartComp = ({ todos }) => {
  // Group todos by agent name and date
  const data = todos.reduce((acc, todo) => {
    const date = new Date(todo.scheduleTime).toISOString().split('T')[0];
    const agent = todo.agent?.name || 'Unknown Agent';

    if (!acc[date]) acc[date] = {};
    if (!acc[date][agent]) acc[date][agent] = 0;

    acc[date][agent] += 1; // Increment the count of todos for the agent on that date

    return acc;
  }, {});

  // Transform grouped data to array format suitable for the chart
  const chartData = Object.keys(data).map(date => ({
    date,
    ...data[date]
  }));

  return (
    <Card className="p-4 bg-background-light dark:bg-background-dark">
      <CardTitle className="mb-6 text-center">Workload per Agent per Day</CardTitle>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(chartData[0] || {}).filter(key => key !== 'date').map(agent => (
              <Bar key={agent} dataKey={agent} fill="#8884d8" />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartComp;
