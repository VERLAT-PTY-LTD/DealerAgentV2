'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoFormSchema, todoFormValues } from '@/lib/types/validations';
import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/Icons';
import { CreateTodo } from '@/lib/API/Database/todos/mutations';
import { getAllKnowledgeDatasets } from '@/lib/API/Database/knowledge/queries';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Switch } from '@/components/ui/Switch';

export default function TodosCreateForm() {
  const router = useRouter();
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const form = useForm<todoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      name: '',
      task: '',
      transferPhoneNumber: '',
      aiVoice: '',
      metadataKey: '',
      metadataValue: '',
      scheduleTime: new Date(),
      isActive: false,
    },
  });

  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    const fetchDatasets = async () => {
      const fetchedDatasets = await getAllKnowledgeDatasets();
      setDatasets(fetchedDatasets);
    };

    fetchDatasets();
  }, []);

  const onSubmit = async (values: todoFormValues) => {
    try {
      const newTodo = await CreateTodo({
        ...values,
        datasetIds: selectedDatasets,
      });
      toast.success('Todo Created Successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Error creating todo');
      console.error('Error creating todo:', error);
    } finally {
      reset();
    }
  };

  return (
    <div>
      <Card className="bg-background-light dark:bg-background-dark">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">New Todo</CardTitle>
          <CardDescription>Create a Todo with campaign details</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="task"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="transferPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transfer Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="aiVoice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Voice</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="metadataKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata Key</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="metadataValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata Value</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="scheduleTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Time</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Select Datasets</FormLabel>
                <FormControl>
                  <select
                    multiple
                    value={selectedDatasets}
                    onChange={(e) =>
                      setSelectedDatasets(Array.from(e.target.selectedOptions, option => option.value))
                    }
                    className="bg-background-light dark:bg-background-dark w-full"
                  >
                    {datasets.map(dataset => (
                      <option key={dataset.id} value={dataset.id}>
                        {dataset.title}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </div>
              <Button disabled={isSubmitting} className="w-full">
                {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
