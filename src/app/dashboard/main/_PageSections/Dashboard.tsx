// src/app/dashboard/_PageSections/Dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaLaptop, FaTasks, FaUser } from 'react-icons/fa';
import SummaryCard from './SummaryCard';
import { Icons } from '@/components/Icons';
import ComposeChart from '../../_PageSections/charts/Compose';
import BarChart from '../../_PageSections/charts/Bar';
import PieChart from '../../_PageSections/charts/Pie';
import RecentCalls from '../../_PageSections/RecentCalls';
import { getUserDashboardData } from '@/lib/API/Database/dashboard/queries';
import { toast } from 'react-toastify';




const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDashboardData();
        setDashboardData(data);
      } catch (error) {
        toast.error('Error fetching dashboard data');
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  const { agents, todos, calls } = dashboardData;
  const totalCalls = calls.length;
  const totalTodos = todos.length;
  const totalAgents = agents.length;

  // Assuming you have some logic to determine trends
  const callTrend = 'up'; // Replace with actual logic
  const todoTrend = 'down'; // Replace with actual logic
  const agentTrend = 'up'; // Replace with actual logic

  return (
    <div className="w-11/12 space-y-6">
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          card_title={'Total Calls'}
          icon={<FaLaptop />}
          content_main={totalCalls}
          content_secondary={`Total calls made by agents`}
          trend={callTrend}
        />
        <SummaryCard
          card_title={'Total Todos'}
          icon={<FaTasks />}
          content_main={totalTodos}
          content_secondary={`Total tasks created`}
          trend={todoTrend}
        />
        <SummaryCard
          card_title={'Total Agents'}
          icon={<FaUser />}
          content_main={totalAgents}
          content_secondary={`Total agents assigned`}
          trend={agentTrend}
        />
      </div>
      {/* <div>
        <ComposeChart calls={calls} />
      </div> */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-4">
        <div className="md:col-span-3">
          <BarChart todos={todos} />
        </div>
        {/* <div className="md:col-span-1">
          <PieChart agents={agents} />
        </div> */}
      </div>
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <RecentCalls calls={calls} />
        {/* <DocShare /> You can replace with another relevant component */}
      </div>
    </div>
  );
};

export default Dashboard;