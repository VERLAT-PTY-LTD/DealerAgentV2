'use client';

import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

const PieChartComp = ({ agents }) => {
  // Transform agents data to suitable format if needed
  const data01 = agents.map((agent, index) => ({
    name: agent.name,
    value: agent.todos.length // example data transformation
  }));

  const data02 = agents.flatMap(agent =>
    agent.todos.map((todo, index) => ({
      name: `${agent.name} - ${todo.name}`,
      value: 1 // example calculation
    }))
  );

  return (
    <Card className="p-4 bg-background-light dark:bg-background-dark">
      <CardTitle className="mb-6 text-center">Current Usage:</CardTitle>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart width={400} height={400}>
            <Pie data={data01} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" />
            <Pie
              data={data02}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#82ca9d"
              label
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PieChartComp;
