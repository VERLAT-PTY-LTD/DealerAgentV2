'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Textarea } from '@/components/ui/Textarea';
import { createKnowledgeDataset, deleteKnowledgeDataset, createCustomerCallList, deleteCustomerCallList, createCustomer } from '@/lib/API/Database/knowledge/mutations';
import { getAllKnowledgeDatasets, getAllCustomerCallLists } from '@/lib/API/Database/knowledge/queries';
import { set } from 'zod';

export default function KnowledgeDatasetPage() {
  const [datasets, setDatasets] = useState([]);
  const [callLists, setCallLists] = useState([]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputType, setInputType] = useState('');
  const [inputData, setInputData] = useState('');
  const [callListName, setCallListName] = useState('');
  const [callListDescription, setCallListDescription] = useState('');
  const [customerCallList, setCustomerCallList] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const allDatasets = await getAllKnowledgeDatasets();
      const allCallLists = await getAllCustomerCallLists();
      setDatasets(allDatasets);
      setCallLists(allCallLists);
    };
    fetchData();
  }, []);

  const handleSubmitDataset = async (event) => {
    event.preventDefault();
    const newDataset = {
      title: inputTitle,
      type: inputType,
      content: inputData,
    };

    try {
      const createdDataset = await createKnowledgeDataset(newDataset);
      setDatasets([...datasets, createdDataset]);
      setInputTitle('');
      setInputType('');
      setInputData('');
    } catch (error) {
      console.error('Error creating dataset:', error);
    }
  };

  const handleSubmitCallList = async (event) => {
    event.preventDefault();
    const newCallList = {
      name: callListName,
      description : callListDescription
    };

    try {
      const createdCallList = await createCustomerCallList(newCallList);
      setCallLists([...callLists, createdCallList]);
      setCallListName('');
      setCallListDescription('');
    } catch (error) {
      console.error('Error creating call list:', error);
    }
  };

  const handleSubmitCustomer = async (event) => {
    event.preventDefault();
    const newCustomer = {
      callListId: customerCallList,
      name: customerName,
      phone: customerPhone,
    };

    try {
      const createdCustomer = await createCustomer(newCustomer);
      
      const allCallLists = await getAllCustomerCallLists();
      setCallLists(allCallLists);

      setCustomerCallList('');
      setCustomerName('');
      setCustomerPhone('');
    } catch (error) {
      console.error('Error creating call list:', error);
    }
  }

  const handleDeleteDataset = async (id) => {
    try {
      await deleteKnowledgeDataset(id);
      setDatasets(datasets.filter(dataset => dataset.id !== id));
    } catch (error) {
      console.error('Error deleting dataset:', error);
    }
  };

  const handleDeleteCallList = async (id) => {
    try {
      await deleteCustomerCallList(id);
      setCallLists(callLists.filter(callList => callList.id !== id));
    } catch (error) {
      console.error('Error deleting call list:', error);
    }
  };

  return (
    <div className="mb-24">
      <h2 className="text-2xl mb-4 font-bold">Knowledge Datasets</h2>
      <Separator />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-2">Add New Dataset:</h1>
          <form onSubmit={handleSubmitDataset} className="h-full">
            <input
              type="text"
              placeholder="Title"
              className="w-full mb-4 p-2 border"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
            />
            <select
              className="w-full mb-4 p-2 border"
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
            >
              <option value="" disabled>Select Dataset Type</option>
              <option value="vehicleDetails">Vehicle Details</option>
              <option value="demonstratorDetails">Demonstrator Details</option>
              <option value="serviceSpecials">Service Specials</option>
            </select>
            <Textarea
              placeholder="Enter dataset content"
              className="min-h-[18rem] mb-4"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
            <Button type="submit">Add Dataset</Button>
          </form>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-2">Add Customer Call List:</h1>
          <form onSubmit={handleSubmitCallList} className="h-full">
            <input
              type="text"
              placeholder="Call List Name"
              className="w-full mb-4 p-2 border"
              value={callListName}
              onChange={(e) => setCallListName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Call List Description"
              className="w-full mb-4 p-2 border"
              value={callListDescription}
              onChange={(e) => setCallListDescription(e.target.value)}
            />
            <Button type="submit">Add Call List</Button>
          </form>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-2">Add Customer:</h1>
          <form onSubmit={handleSubmitCustomer} className="h-full">
            <select
                className="w-full mb-4 p-2 border"
                value={customerCallList}
                onChange={(e) => setCustomerCallList(e.target.value)}
              >
                <option value="" disabled>Select Call List</option>
              {
                callLists.map((callList) => (
                  <option key={callList.id} value={callList.id}>{callList.name}</option>
                ))
              }
            </select>
            <input
              type="text"
              placeholder="Customer Name"
              className="w-full mb-4 p-2 border"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Customer Phone"
              className="w-full mb-4 p-2 border"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <Button type="submit">Add to Call List</Button>
          </form>
        </div>
        <div className="col-span-2">
          <h1 className="text-xl font-bold tracking-tight mb-2">Existing Datasets:</h1>
          <div className="space-y-4">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="rounded-md border bg-muted p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-bold">{dataset.title} ({dataset.type})</h2>
                    <pre>{dataset.content}</pre>
                  </div>
                  <Button variant="destructive" onClick={() => handleDeleteDataset(dataset.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {datasets.length === 0 && <p>No datasets added yet.</p>}
          </div>
        </div>
        <div className="col-span-2">
          <h1 className="text-xl font-bold tracking-tight mb-2">Customer Call Lists:</h1>
          <div className="space-y-4">
            {callLists.map((callList) => (
              <div key={callList.id} className="rounded-md border bg-muted p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-bold">{callList.name}</h2>
                    <h3 className="font-bold">{callList.description}</h3>
                    {callList.customers && callList.customers.map((customer) => (
                      <p key={customer.id}>{customer.name} - {customer.phone}</p>
                    ))}
                  </div>
                  <Button variant="destructive" onClick={() => handleDeleteCallList(callList.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {callLists.length === 0 && <p>No call lists added yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
