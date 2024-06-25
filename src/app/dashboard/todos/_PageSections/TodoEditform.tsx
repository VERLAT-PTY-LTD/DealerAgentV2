'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { todoFormSchema, todoFormValues } from '@/lib/types/validations';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/Icons';
import { UpdateTodo } from '@/lib/API/Database/todos/mutations';
import { getAllKnowledgeDatasets } from '@/lib/API/Database/knowledge/queries';
import { toast } from 'react-toastify';
import config from '@/lib/config/api';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Switch } from '@/components/ui/Switch';
import { useEffect, useState } from 'react';

export default function TodosEditForm({ todo }) {
  const router = useRouter();
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState(
    Array.isArray(todo.datasets) ? todo.datasets.map(dataset => dataset.id) : []
  );

  const form = useForm<todoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      name: todo.name,
      task: todo.task,
      transferPhoneNumber: todo.transferPhoneNumber,
      aiVoice: todo.aiVoice,
      metadataKey: todo.metadataKey,
      metadataValue: todo.metadataValue,
      scheduleTime: new Date(todo.scheduleTime),
      isActive: todo.isActive,
    }
  });

  const {
    reset,
    register,
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  useEffect(() => {
    const fetchDatasets = async () => {
      const fetchedDatasets = await getAllKnowledgeDatasets();
      setDatasets(fetchedDatasets);
    };

    fetchDatasets();
  }, []);

  const onSubmit = async (values: todoFormValues) => {
    const {
      name,
      task,
      transferPhoneNumber,
      aiVoice,
      metadataKey,
      metadataValue,
      scheduleTime,
      isActive
    } = values;
    
    const props = {
      id: todo.id,
      name,
      task,
      transferPhoneNumber,
      aiVoice,
      metadataKey,
      metadataValue,
      scheduleTime,
      isActive,
      datasetIds: selectedDatasets,
    };

    try {
      await UpdateTodo(props);
      toast.success('Todo Updated');
      router.push('/dashboard/todos');
    } catch (err) {
      toast.error(config.errorMessageGeneral);
      throw err;
    }
  };

  return (
    <div>
      <Card className="bg-background-light dark:bg-background-dark">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Edit Todo</CardTitle>
          <CardDescription>Edit the details of your Todo</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Existing Fields */}
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...register('name')}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
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
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
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
                        {...register('transferPhoneNumber')}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
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
                        {...register('aiVoice')}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
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
                        {...register('metadataKey')}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
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
                        {...register('metadataValue')}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
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
                {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}Update
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
