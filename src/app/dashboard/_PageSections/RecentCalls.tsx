'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { listCalls, getTranscript } from '@/lib/API/Services/blandAi/blandai';
import { toast } from 'react-toastify';

const RecentCalls = ({ calls }) => {
  const [selectedCall, setSelectedCall] = useState(null);

  const handleViewTranscript = async (call) => {
    try {
      const transcriptData = await getTranscript(call.call_id);

      if (transcriptData.status === 'processing') {
        toast.info('Transcript is still processing. Please try again later.');
        return;
      }

      if (transcriptData.status === 'not available') {
        toast.info('Transcript data is not yet available.');
        return;
      }

      setSelectedCall({ ...call, transcript: transcriptData.corrected.map(entry => entry.text).join('\n') });
    } catch (error) {
      console.error('Error viewing transcript:', error);
      toast.error('Error viewing transcript');
    }
  };

  return (
    <Card className="bg-background-light dark:bg-background-dark">
      <CardHeader>
        <CardTitle>Recent Calls</CardTitle>
        <CardDescription>Calls made within the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {calls.slice(0, 5).map((call) => (
            <div key={call.call_id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{call.customerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{call.customerName}</p>
                <p className="text-sm text-muted-foreground">{new Date(call.dateTime).toLocaleString()}</p>
              </div>
              <div className="ml-auto font-medium">{call.duration} mins</div>
              <Button onClick={() => handleViewTranscript(call)}>View Transcript</Button>
            </div>
          ))}
          {selectedCall && (
            <div className="mt-4 p-4 border-t">
              <h2 className="text-xl font-bold">{selectedCall.customerName} - Transcript</h2>
              <pre>{selectedCall.transcript}</pre>
              <Button onClick={() => setSelectedCall(null)}>Close Transcript</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCalls;
