'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { listCalls, getTranscript } from '@/lib/API/Services/blandAi/blandai';
import { deleteCall } from '@/lib/API/Database/history/mutations';

export default function CallListPage() {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = new Date();
        startDate.setDate(1); // Set to the first day of the current month
        const startDateString = startDate.toISOString().split('T')[0];
        const endDate = new Date();
        const endDateString = endDate.toISOString().split('T')[0];

        const allCalls = await listCalls(startDateString, endDateString);
        console.log("Fetched Calls from BlandAI API:", allCalls); // Log fetched calls
        setCalls(allCalls);
      } catch (error) {
        console.error('Error fetching calls:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCall(id);
      setCalls(calls.filter(call => call.call_id !== id));
    } catch (error) {
      console.error('Error deleting call:', error);
    }
  };

  const handleViewTranscript = async (call) => {
    try {
      const transcriptData = await getTranscript(call.call_id);
  
      if (transcriptData.status === 'processing') {
        alert('Transcript is still processing. Please try again later.');
        return;
      }
  
      if (transcriptData.status === 'not available') {
        alert('Transcript data is not yet available.');
        return;
      }
  
      setSelectedCall({ ...call, transcript: transcriptData.corrected.map(entry => entry.text).join('\n') });
    } catch (error) {
      console.error('Error viewing transcript:', error);
    }
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
              <div key={call.call_id} className="rounded-md border bg-muted p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-bold">To: {call.to}</h2>
                    <p>From: {call.from}</p>
                    <p>Time: {new Date(call.created_at).toLocaleString()}</p>
                    <p>Duration: {call.call_length} minutes</p>
                    <p>Status: {call.queue_status}</p>
                    {call.recording_url && (
                      <audio controls>
                        <source src={call.recording_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <Button onClick={() => handleViewTranscript(call)}>
                      View Transcript
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(call.call_id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                {selectedCall && selectedCall.call_id === call.call_id && (
                  <div className="mt-4 p-4 border-t">
                    <h2 className="text-xl font-bold">{selectedCall.customerName} - Transcript</h2>
                    <pre>{selectedCall.transcript.map((item, index) => (
                      <div key={index}>
                        <strong>{item.speaker === 0 ? "Agent: " : "Customer: "}</strong>{item.text}
                      </div>
                    ))}</pre>
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
