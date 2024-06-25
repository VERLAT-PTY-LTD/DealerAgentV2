'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { getAllCalls } from '@/lib/API/Database/history/queries';
import { deleteCall } from '@/lib/API/Database/history/mutations';

export default function CallListPage() {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const allCalls = await getAllCalls();
      setCalls(allCalls);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCall(id);
      setCalls(calls.filter(call => call.id !== id));
    } catch (error) {
      console.error('Error deleting call:', error);
    }
  };

  const handleViewTranscript = (call) => {
    setSelectedCall(call);
  };

  return (
    <div className="mb-24">
      <h2 className="text-2xl mb-4 font-bold">Customer Calls</h2>
      <Separator />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="col-span-3">
          <h1 className="text-xl font-bold tracking-tight mb-2">Calls List:</h1>
          <div className="space-y-4">
            {calls.map((call) => (
              <div key={call.id} className="rounded-md border bg-muted p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-bold">{call.customerName}</h2>
                    <p>Time: {new Date(call.dateTime).toLocaleString()}</p>
                    <p>Duration: {call.duration} seconds</p>
                    <p>Todo: {call.todo.name}</p>
                    <audio controls>
                      <source src={call.recording} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="flex flex-col items-end">
                    <Button onClick={() => handleViewTranscript(call)}>
                      View Transcript
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(call.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                {selectedCall && selectedCall.id === call.id && (
                  <div className="mt-4 p-4 border-t">
                    <h2 className="text-xl font-bold">{selectedCall.customerName} - Transcript</h2>
                    <pre>{selectedCall.transcript}</pre>
                    <Button onClick={() => setSelectedCall(null)}>Close Transcript</Button>
                  </div>
                )}
              </div>
            ))}
            {calls.length === 0 && <p>No calls logged yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
