'use client';

import { useRouter } from 'next/navigation';
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
import { toast } from 'react-toastify';
import { Todo } from '@prisma/client';
import config from '@/lib/config/api';
import configuration from '@/lib/config/auth';
interface EditFormProps {
  todo: {
    id: number;
    name: string;
    task: string;
    transferPhoneNumber: string;
    aiVoice: string;
    metadataKey: string;
    metadataValue: string;
    user_id: string;
    author: string;
  };
}

export default function TodosEditForm({ todo }: EditFormProps) {
  const router = useRouter();
  const { name, task, id } = todo;

  const form = useForm<todoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      name: '',
      task: '',
      transferPhoneNumber: '',
      aiVoice: '',
      metadataKey: '',
      metadataValue: '',
    }
  });

  const {
    register,
    reset,
    formState: { isSubmitting, isSubmitted }
  } = form;

  const onSubmit = async (values: todoFormValues) => {
    const {
      name,
      task,
      transferPhoneNumber,
      aiVoice,
      metadataKey,
      metadataValue
    } = values;
    
    const todo_id = Number(id);
    const props = {
      id: todo_id,
      name,
      task,
      transferPhoneNumber,
      aiVoice,
      metadataKey,
      metadataValue
    };

    try {
      await UpdateTodo(props);
    } catch (err) {
      toast.error(config.errorMessageGeneral);
      throw err;
    }

    reset({
      name: '',
      task: '',
      transferPhoneNumber: '',
      aiVoice: '',
      metadataKey: '',
      metadataValue: '',
    });
    toast.success('Todo Updated');
    router.refresh();
    router.push(configuration.redirects.toMyTodos);
  };

  return (
    <div>
      <Card className="bg-background-light dark:bg-background-dark">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Update Todo</CardTitle>
          <CardDescription>Update Todo with campaign details</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormMessage />
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...register('name')}
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
                control={form.control}
                name="transferPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transfer Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...register('transferPhoneNumber')}
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aiVoice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Voice</FormLabel>
                    <FormControl>
                      <Input
                        {...register('aiVoice')}
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="metadataKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata Key</FormLabel>
                    <FormControl>
                      <Input
                        {...register('metadataKey')}
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="metadataValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata Value</FormLabel>
                    <FormControl>
                      <Input
                        {...register('metadataValue')}
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={isSubmitting || isSubmitted} className="w-full">
                {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
