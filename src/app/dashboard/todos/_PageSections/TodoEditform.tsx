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
import { getAllAgents } from '@/lib/API/Database/agents/queries';
import { listVoices } from '@/lib/API/Services/blandAi/blandai';
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
  const [agents, setAgents] = useState([]);
  const [voices, setVoices] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState(
    Array.isArray(todo.datasets) ? todo.datasets.map(dataset => dataset.id) : []
  );

  const form = useForm<todoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      name: todo.name,
      agentId: todo.agentId,
      transferPhoneNumber: todo.transferPhoneNumber,
      aiVoice: todo.aiVoice,
      model: todo.model,
      language: todo.language,
      localDialing: todo.localDialing,
      maxDuration: todo.maxDuration,
      answeredByEnabled: todo.answeredByEnabled,
      waitForGreeting: todo.waitForGreeting,
      record: todo.record,
      amd: todo.amd,
      interruptionThreshold: todo.interruptionThreshold,
      voicemailMessage: todo.voicemailMessage,
      temperature: todo.temperature,
      transferList: JSON.stringify(todo.transferList),
      metadata: JSON.stringify(todo.metadata),
      pronunciationGuide: JSON.stringify(todo.pronunciationGuide),
      startTime: todo.startTime ? new Date(todo.startTime) : null,
      requestData: JSON.stringify(todo.requestData),
      tools: JSON.stringify(todo.tools),
      webhook: todo.webhook,
      calendly: JSON.stringify(todo.calendly),
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
    const fetchDatasetsAndAgents = async () => {
      const fetchedDatasets = await getAllKnowledgeDatasets();
      setDatasets(fetchedDatasets);
      const fetchedAgents = await getAllAgents();
      setAgents(fetchedAgents);
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
    };

    const props = {
      id: todo.id,
      ...processedValues,
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
                    <FormMessage />
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
                        {...register('model')}
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
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input
                        {...register('language')}
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
                    <FormMessage />
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
                        {...register('maxDuration')}
                        type="number"
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
                    <FormMessage />
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
                    <FormMessage />
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
                    <FormMessage />
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
                    <FormMessage />
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
                        {...register('interruptionThreshold')}
                        type="number"
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
                name="voicemailMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voicemail Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...register('voicemailMessage')}
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
