'use client'

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
import { CreateTodo, ActivateTodo } from '@/lib/API/Database/todos/mutations';
import { getAllKnowledgeDatasets, getAllCustomerCallLists } from '@/lib/API/Database/knowledge/queries';
import { getAllAgents } from '@/lib/API/Database/agents/queries';
import { listVoices } from '@/lib/API/Services/blandAi/blandai';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Switch } from '@/components/ui/Switch';
export default function TodosCreateForm() {
  const router = useRouter();
  const [datasets, setDatasets] = useState([]);
  const [callLists, setCallLists] = useState([]); // Add state for call lists
  const [agents, setAgents] = useState([]);
  const [voices, setVoices] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [createdTodoId, setCreatedTodoId] = useState<number | null>(null);
  const form = useForm<todoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      name: '',
      agentId: '',
      transferPhoneNumber: '',
      aiVoice: '',
      scheduleTime: new Date(new Date().getTime() + 5 * 60000),
      isActive: false,
      model: 'base',
      language: 'en',
      localDialing: false,
      maxDuration: 12,
      answeredByEnabled: false,
      waitForGreeting: false,
      record: false,
      amd: false,
      interruptionThreshold: 100,
      voicemailMessage: '',
      temperature: 0.7,
      transferList: '{}',
      metadata: '{}',
      pronunciationGuide: '[]',
      startTime: null,
      requestData: '{}',
      tools: '[]',
      webhook: '',
      calendly: '{}',
      customerCallList: '' // Add field for customer call list
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = form;

  useEffect(() => {
    const fetchDatasetsAndAgents = async () => {
      const fetchedDatasets = await getAllKnowledgeDatasets();
      setDatasets(fetchedDatasets);
      const fetchedAgents = await getAllAgents();
      setAgents(fetchedAgents);
      const fetchedCallLists = await getAllCustomerCallLists(); // Fetch call lists
      setCallLists(fetchedCallLists);
    };

    fetchDatasetsAndAgents();

    const fetchVoices = async () => {
      try {
        const allVoices = await listVoices();
        setVoices(allVoices);
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };

    fetchVoices();
  }, []);


  const onSubmit = async (values: todoFormValues) => {
    const processedValues = {
      ...values,
      transferList: JSON.parse(values.transferList || '{}'),
      metadata: JSON.parse(values.metadata || '{}'),
      pronunciationGuide: JSON.parse(values.pronunciationGuide || '[]'),
      requestData: JSON.parse(values.requestData || '{}'),
      tools: JSON.parse(values.tools || '[]'),
      calendly: JSON.parse(values.calendly || '{}'),
      customerCallList: values.customerCallList, // Ensure customer call list is included
      agentId: values.agentId || '', // Ensure agentId is included
    };
  
    try {
      const newTodo = await CreateTodo({
        ...processedValues,
        datasetIds: selectedDatasets,
      });
      setCreatedTodoId(newTodo.id);
      toast.success('Todo Created Successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Error creating todo');
      console.error('Error creating todo:', error);
    } finally {
      reset();
    }
  };
  

  const onActivate = async (todoId: number) => {
    try {
      await ActivateTodo({ id: todoId });
      toast.success('Todo Activated Successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Error activating todo');
      console.error('Error activating todo:', error);
    }
  };

  const onError = (errors: any) => {
    console.error('Validation errors:', errors);
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
            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
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
                    <FormMessage>{errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="agentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Agent</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="bg-background-light dark:bg-background-dark w-full"
                      >
                        <option value="">Select an agent</option>
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage>{errors.agentId?.message}</FormMessage>
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
                    <FormMessage>{errors.transferPhoneNumber?.message}</FormMessage>
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
                      <select
                        {...field}
                        className="bg-background-light dark:bg-background-dark w-full"
                      >
                        <option value="">Select a voice</option>
                        {voices.map(voice => (
                          <option key={voice.id} value={voice.id}>
                            {voice.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage>{errors.aiVoice?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="customerCallList"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Customer Call List</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="bg-background-light dark:bg-background-dark w-full"
                      >
                        <option value="">Select a call list</option>
                        {callLists.map(callList => (
                          <option key={callList.id} value={callList.id}>
                            {callList.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage>{errors.customerCallList?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage>{errors.model?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage>{errors.language?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="localDialing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local Dialing</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage>{errors.localDialing?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="maxDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Duration</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage>{errors.maxDuration?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="answeredByEnabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answered By Enabled</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage>{errors.answeredByEnabled?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="waitForGreeting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wait For Greeting</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage>{errors.waitForGreeting?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="record"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage>{errors.record?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="amd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AMD</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage>{errors.amd?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="interruptionThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interruption Threshold</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage>{errors.interruptionThreshold?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="voicemailMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voicemail Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-background-light dark:bg-background-dark"
                      />
                    </FormControl>
                    <FormMessage>{errors.voicemailMessage?.message}</FormMessage>
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
                      <Controller
                        control={control}
                        name="scheduleTime"
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value}
                            onChange={field.onChange}
                            showTimeSelect
                            dateFormat="Pp"
                            className="bg-background-light dark:bg-background-dark"
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage>{errors.scheduleTime?.message}</FormMessage>
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
                      <option key={dataset.id} value={dataset.id}>{dataset.title}</option>
                    ))}
                  </select>
                </FormControl>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}Submit
              </Button>
              {createdTodoId && (
                <Button
                  type="button"
                  onClick={() => onActivate(createdTodoId)}
                  disabled={isSubmitting}
                  className="w-full mt-4"
                >
                  Start Now
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
