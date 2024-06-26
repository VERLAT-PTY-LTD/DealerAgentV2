'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer
} from 'recharts';

const ComposeChart = ({ calls }) => {
  // Transform calls data to suitable format if needed
  const data = calls.map(call => ({
    name: new Date(call.dateTime).toLocaleString('default', { month: 'short' }),
    uv: call.duration, // example data transformation
    pv: call.duration * 1.2, // example calculation
    amt: call.duration * 1.5,
    cnt: call.duration / 2
  }));

  return (
    <Card className="p-4 bg-background-light dark:bg-background-dark">
      <CardTitle className="mb-6 text-center">Current Sales Growth:</CardTitle>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" scale="band" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
            <Bar dataKey="pv" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="uv" stroke="#ff7300" />
            <Scatter dataKey="cnt" fill="red" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ComposeChart;
