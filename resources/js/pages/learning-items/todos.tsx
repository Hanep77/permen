"use client";

import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import todos from '@/routes/todos';
import learningItems from '@/routes/learning-items';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { CrudPagination, type Paginated } from '@/components/crud';
import {
    TodoList,
    TodoListItem,
    type TodoListTodo,
} from '@/components/todos/todo-list-item';
import {
    LearningItemLayout,
    type LearningItemSummary,
} from '@/components/learning-items/learning-item-layout';
import type { BreadcrumbItem } from '@/types/navigation';

interface Props {
    learningItem: LearningItemSummary;
    todos: Paginated<TodoListTodo>;
}

export default function LearningItemTodos({
    learningItem,
    todos: todosData,
}: Props) {
    const createHref = todos.create.url({
        query: { learning_item_id: learningItem.id },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Learning Items', href: learningItems.index().url },
        {
            title: learningItem.title,
            href: learningItems.show(learningItem.id).url,
        },
        { title: 'Todos', href: learningItems.todos(learningItem.id).url },
    ];

    (
        LearningItemTodos as typeof LearningItemTodos & {
            layout: { breadcrumbs: BreadcrumbItem[] };
        }
    ).layout = {
        breadcrumbs,
    };

    return (
        <LearningItemLayout learningItem={learningItem} activeTab="todos">
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
        </LearningItemLayout>
    );
}
