'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import CountUp from 'react-countup';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface SummaryCardProps {
  card_title: string;
  icon: React.ReactNode;
  content_main: number;
  content_secondary: string;
  trend?: 'up' | 'down';
}

const SummaryCard = ({ card_title, icon, content_main, content_secondary, trend }: SummaryCardProps) => {
  return (
    <Card className="bg-background-light dark:bg-background-dark">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{card_title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="text-2xl font-bold">
            +
            <CountUp start={content_main * 0.9} end={content_main} />
          </div>
          {trend && (
            <div className={`ml-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{content_secondary}</p>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
