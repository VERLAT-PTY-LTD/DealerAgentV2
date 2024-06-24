import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Todo } from '@prisma/client';

interface TodoCardProps {
  todo: Todo;
}

interface MyTodosProps {
  todos: Todo[];
}

const TodoCard = ({ todo }: TodoCardProps) => {
  const { name, task, aiVoice } = todo;
  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{task}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>AI Voice: {aiVoice}</div>
      </CardContent>
    </Card>
  );
};

const TodosList = ({ todos }: MyTodosProps) => {
  return (
    <div>
      {todos?.map((todo) => <TodoCard key={todo.id} todo={todo} />)}
      {todos.length === 0 && <div>No Todos Found</div>}
    </div>
  );
};

export default TodosList;
