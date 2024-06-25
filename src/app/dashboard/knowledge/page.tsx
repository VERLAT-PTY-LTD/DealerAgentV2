'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Textarea } from '@/components/ui/Textarea';

import { createKnowledgeDataset, deleteKnowledgeDataset } from '@/lib/API/Database/knowledge/mutations';
import { getAllKnowledgeDatasets } from '@/lib/API/Database/knowledge/queries';

export default function KnowledgeDatasetPage() {
  const [datasets, setDatasets] = useState([]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputType, setInputType] = useState('');
  const [inputData, setInputData] = useState('');
  // const [inputMetadata, setInputMetadata] = useState('{}');
  // const [metadataError, setMetadataError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const allDatasets = await getAllKnowledgeDatasets();
      setDatasets(allDatasets);
    };
    fetchData();
  }, []);

  const handleTitleChange = (event) => {
    setInputTitle(event.target.value);
  };

  const handleTypeChange = (event) => {
    setInputType(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputData(event.target.value);
  };



  const handleSubmit = async (event) => {
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

  const handleDelete = async (id) => {
    try {
      await deleteKnowledgeDataset(id);
      setDatasets(datasets.filter(dataset => dataset.id !== id));
    } catch (error) {
      console.error('Error deleting dataset:', error);
    }
  };

  return (
    <div className="mb-24">
      <h2 className="text-2xl mb-4 font-bold">Knowledge Datasets</h2>
      <Separator />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-2">Add New Dataset:</h1>
          <form onSubmit={handleSubmit} className="h-full">
            <input
              type="text"
              placeholder="Title"
              className="w-full mb-4 p-2 border"
              value={inputTitle}
              onChange={handleTitleChange}
            />
            <select
              className="w-full mb-4 p-2 border"
              value={inputType}
              onChange={handleTypeChange}
            >
              <option value="" disabled>Select Dataset Type</option>
              <option value="customerCallList">Customer Call List</option>
              <option value="vehicleDetails">Vehicle Details</option>
              <option value="demonstratorDetails">Demonstrator Details</option>
              <option value="serviceSpecials">Service Specials</option>
            </select>
            <Textarea
              placeholder="Enter dataset content"
              className="min-h-[18rem] mb-4"
              value={inputData}
              onChange={handleInputChange}
            />
            
            <Button type="submit">Add Dataset</Button>
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
                  <Button variant="destructive" onClick={() => handleDelete(dataset.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {datasets.length === 0 && <p>No datasets added yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
