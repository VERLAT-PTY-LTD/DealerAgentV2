'use client';

import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DeleteTodo } from '@/lib/API/Database/todos/mutations';
import { Button, buttonVariants } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils/helpers';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import config from '@/lib/config/api';
import { Todo } from '@prisma/client';

interface TodoCardProps {
  todo: Todo;
}

interface MyTodosProps {
  todos: Todo[];
}

const TodoCard = ({ todo }: TodoCardProps) => {
  const router = useRouter();

  const { id, name, task, transferPhoneNumber, aiVoice, metadataKey, metadataValue } = todo;

  const Delete = async () => {
    const todo_id = Number(id);
    try {
      await DeleteTodo({ id: todo_id });
    } catch (err) {
      toast.error(config.errorMessageGeneral);
      throw err;
    }

    toast.success('Todo Deleted');
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{task}</CardDescription>
      </CardHeader>
      <CardContent>
        <div><strong>Transfer Phone Number:</strong> {transferPhoneNumber}</div>
        <div><strong>AI Voice:</strong> {aiVoice}</div>
        <div><strong>Metadata Key:</strong> {metadataKey}</div>
        <div><strong>Metadata Value:</strong> {metadataValue}</div>
        <Link
          href={`/dashboard/todos/edit/${id}`}
          className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'mr-6')}
        >
          Edit
        </Link>
        <Button onClick={Delete} variant="destructive">
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

const MyTodos = ({ todos }: MyTodosProps) => {
  return (
    <div>
      {todos?.map((todo) => <TodoCard key={todo.id} todo={todo} />)}
      {todos.length === 0 && <div>No Todos Found</div>}
    </div>
  );
};

export default MyTodos;
