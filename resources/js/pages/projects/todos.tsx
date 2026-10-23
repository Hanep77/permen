"use client";

import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import todos from '@/routes/todos';
import projects from '@/routes/projects';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { CrudPagination, type Paginated } from '@/components/crud';
import {
    TodoList,
    TodoListItem,
    type TodoListTodo,
} from '@/components/todos/todo-list-item';
import {
    ProjectLayout,
    type ProjectSummary,
} from '@/components/projects/project-layout';
import type { BreadcrumbItem } from '@/types/navigation';

interface Props {
    project: ProjectSummary;
    todos: Paginated<TodoListTodo>;
}

export default function ProjectTodos({ project, todos: todosData }: Props) {
    const createHref = todos.create.url({
        query: { project_id: project.id },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: projects.index().url },
        { title: project.title, href: projects.show(project.id).url },
        { title: 'Todos', href: projects.todos(project.id).url },
    ];

    (
        ProjectTodos as typeof ProjectTodos & {
            layout: { breadcrumbs: BreadcrumbItem[] };
        }
    ).layout = {
        breadcrumbs,
    };

    return (
        <ProjectLayout project={project} activeTab="todos">
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
        </ProjectLayout>
    );
}
