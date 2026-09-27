"use client";

import todos from '@/routes/todos';
import {
    CrudFilterBar,
    CrudIndexLayout,
    priorityOptions,
    scopeOptions,
    todoStatusOptions,
    useCrudFilters,
    type Paginated,
} from '@/components/crud';
import { TodoList, TodoListItem, type TodoListTodo } from '@/components/todos/todo-list-item';
import type { BreadcrumbItem } from '@/types/navigation';

interface Todo extends TodoListTodo {}

interface Filters {
    search?: string;
    status?: string;
    priority?: string;
    project_id?: string;
    goal_id?: string;
    learning_item_id?: string;
    scope?: string;
}

export default function TodosIndex({ todos: todosData, filters }: { todos: Paginated<Todo>; filters: Filters }) {
    const { values, set, update, submit } = useCrudFilters(todos.index().url, {
        search: filters.search || '',
        status: filters.status || '',
        priority: filters.priority || '',
        scope: filters.scope || 'independent',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Todos', href: todos.index().url },
    ];

    (TodosIndex as typeof TodosIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <CrudIndexLayout
            title="Todos"
            description="Manage your tasks and stay organized"
            createHref={todos.create().url}
            createLabel="New Todo"
            emptyTitle="No todos yet"
            emptyDescription="Create your first todo to start tracking tasks."
            emptyActionLabel="Create Todo"
            isEmpty={todosData.data.length === 0}
            paginationLinks={todosData.links}
            filterBar={
                <CrudFilterBar
                    searchValue={values.search}
                    onSearchChange={(v) => set('search', v)}
                    searchPlaceholder="Search todos..."
                    onSubmit={submit}
                    fields={[
                        {
                            value: values.status,
                            onChange: (v) => update('status', v),
                            options: todoStatusOptions,
                            placeholder: 'Filter by status',
                            widthClassName: 'w-[160px]',
                        },
                        {
                            value: values.priority,
                            onChange: (v) => update('priority', v),
                            options: priorityOptions,
                            placeholder: 'Filter by priority',
                            widthClassName: 'w-[160px]',
                        },
                        {
                            value: values.scope,
                            onChange: (v) => update('scope', v),
                            options: scopeOptions,
                            placeholder: 'Scope',
                            widthClassName: 'w-[160px]',
                        },
                    ]}
                />
            }
        >
            <TodoList>
                {todosData.data.map((todo) => (
                    <TodoListItem key={todo.id} todo={todo} />
                ))}
            </TodoList>
        </CrudIndexLayout>
    );
}
