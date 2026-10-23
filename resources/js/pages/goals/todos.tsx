"use client";

import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import todos from '@/routes/todos';
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { CrudPagination, type Paginated } from '@/components/crud';
import {
    TodoList,
    TodoListItem,
    type TodoListTodo,
} from '@/components/todos/todo-list-item';
import { GoalLayout, type GoalSummary } from '@/components/goals/goal-layout';
import type { BreadcrumbItem } from '@/types/navigation';

interface Props {
    goal: GoalSummary;
    todos: Paginated<TodoListTodo>;
}

export default function GoalTodos({ goal, todos: todosData }: Props) {
    const createHref = todos.create.url({
        query: { goal_id: goal.id },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Goals', href: goals.index().url },
        { title: goal.title, href: goals.show(goal.id).url },
        { title: 'Todos', href: goals.todos(goal.id).url },
    ];

    (
        GoalTodos as typeof GoalTodos & {
            layout: { breadcrumbs: BreadcrumbItem[] };
        }
    ).layout = {
        breadcrumbs,
    };

    return (
        <GoalLayout goal={goal} activeTab="todos">
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
                    <CardTitle>Todos</CardTitle>
                    <Button as={Link} href={createHref}>
                        <Plus className="size-4" />
                        Add Todo
                    </Button>
                </CardHeader>
                <CardContent>
                    {todosData.data.length === 0 ? (
                        <EmptyState title="No todos yet" />
                    ) : (
                        <TodoList>
                            {todosData.data.map((todo) => (
                                <TodoListItem key={todo.id} todo={todo} />
                            ))}
                        </TodoList>
                    )}
                    <CrudPagination links={todosData.links} />
                </CardContent>
            </Card>
        </GoalLayout>
    );
}
