"use client";

import { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Calendar, Check, ChevronRight, Flag, Loader2 } from 'lucide-react';
import todos from '@/routes/todos';
import projects from '@/routes/projects';
import goals from '@/routes/goals';
import learningItems from '@/routes/learning-items';
import { StatusBadge, statusVariants } from '@/components/crud';
import { cn } from '@/lib/utils';
import type { RelatedRef } from '@/components/crud';

export interface TodoListTodo {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    project: RelatedRef | null;
    goal: RelatedRef | null;
    learning_item: RelatedRef | null;
}

function startOfToday(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

function startOfDay(d: Date): Date {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
}

interface DueInfo {
    label: string;
    tone: 'overdue' | 'today' | 'upcoming' | 'muted';
}

function dueInfo(dueDate: string, status: string): DueInfo {
    const due = startOfDay(new Date(dueDate));
    const today = startOfToday();
    const formatted = new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const done = status === 'completed' || status === 'cancelled';

    if (done) {
        return { label: formatted, tone: 'muted' };
    }
    if (due.getTime() < today.getTime()) {
        return { label: `Overdue · ${formatted}`, tone: 'overdue' };
    }
    if (due.getTime() === today.getTime()) {
        return { label: 'Due today', tone: 'today' };
    }
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (due.getTime() === tomorrow.getTime()) {
        return { label: 'Due tomorrow', tone: 'upcoming' };
    }
    return { label: `Due ${formatted}`, tone: 'upcoming' };
}

const dueToneClass: Record<DueInfo['tone'], string> = {
    overdue: 'font-medium text-red-600 dark:text-red-400',
    today: 'font-medium text-amber-600 dark:text-amber-400',
    upcoming: 'text-stone-500 dark:text-stone-400',
    muted: 'text-stone-400 dark:text-stone-500',
};

function nextStatus(current: string): string {
    return current === 'completed' ? 'todo' : 'completed';
}

export function TodoStatusToggle({
    todoId,
    status,
    onStatusChange,
    size = 'md',
}: {
    todoId: number;
    status: string;
    onStatusChange?: (status: string) => void;
    size?: 'md' | 'sm';
}) {
    const [current, setCurrent] = useState(status);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        setCurrent(status);
    }, [status]);

    const isCompleted = current === 'completed';
    const isCancelled = current === 'cancelled';
    const isInProgress = current === 'in_progress';

    const handleToggle = () => {
        if (pending) {
            return;
        }
        const previous = current;
        const next = nextStatus(previous);
        setCurrent(next);
        onStatusChange?.(next);
        setPending(true);
        router.patch(
            todos.update(todoId).url,
            { status: next },
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    setCurrent(previous);
                    onStatusChange?.(previous);
                },
                onFinish: () => setPending(false),
            },
        );
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={pending}
            aria-pressed={isCompleted}
            aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
            title={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
            className={cn(
                'flex shrink-0 items-center justify-center rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-wait',
                size === 'md' ? 'size-6' : 'size-5',
                isCompleted
                    ? 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
                    : isCancelled
                      ? 'border-stone-300 bg-stone-200 text-stone-500 hover:border-stone-400 dark:border-stone-700 dark:bg-stone-800'
                      : isInProgress
                        ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20'
                        : 'border-stone-300 hover:border-emerald-500 hover:bg-emerald-50 dark:border-stone-600 dark:hover:bg-emerald-900/20',
            )}
        >
            {pending ? (
                <Loader2 className={cn('animate-spin text-stone-400', size === 'md' ? 'size-3.5' : 'size-3')} />
            ) : isCompleted ? (
                <Check className={cn(size === 'md' ? 'size-3.5' : 'size-3')} strokeWidth={3} />
            ) : isInProgress ? (
                <span className="size-2 rounded-full bg-emerald-500" />
            ) : null}
        </button>
    );
}

function RelatedPill({ href, dotClassName, children }: { href: string; dotClassName: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="inline-flex max-w-[160px] items-center gap-1.5 rounded-full bg-stone-100 py-0.5 pr-2.5 pl-2 text-[11px] font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
        >
            <span className={cn('size-1.5 shrink-0 rounded-full', dotClassName)} />
            <span className="truncate">{children}</span>
        </Link>
    );
}

function PriorityMeta({ priority }: { priority: string }) {
    if (priority === 'high') {
        return (
            <span className="inline-flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
                <Flag className="size-3" />
                High
            </span>
        );
    }
    if (priority === 'medium') {
        return (
            <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="size-1.5 rounded-full bg-amber-500" />
                Medium
            </span>
        );
    }
    return null;
}

export function TodoList({ children }: { children: React.ReactNode }) {
    return <ul className="divide-y divide-stone-100 dark:divide-stone-800">{children}</ul>;
}

export function TodoListItem({ todo }: { todo: TodoListTodo }) {
    const [status, setStatus] = useState(todo.status);

    useEffect(() => {
        setStatus(todo.status);
    }, [todo.status]);

    const isDone = status === 'completed' || status === 'cancelled';
    const due = dueInfo(todo.due_date, status);
    const showMeta =
        todo.priority !== 'low' || todo.project !== null || todo.goal !== null || todo.learning_item !== null;

    return (
        <li
            className={cn(
                'group flex items-center gap-3 px-1 py-3 transition-colors first:pt-1 last:pb-1 hover:bg-stone-50/80 sm:rounded-lg dark:hover:bg-stone-800/40',
                isDone && 'opacity-55',
            )}
        >
            <TodoStatusToggle todoId={todo.id} status={status} onStatusChange={setStatus} />

            <Link href={todos.show(todo.id).url} className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <h3
                        className={cn(
                            'truncate text-sm font-medium text-stone-900 dark:text-stone-100',
                            isDone && 'text-stone-400 line-through decoration-stone-300 dark:text-stone-500',
                        )}
                    >
                        {todo.title}
                    </h3>
                    {status === 'in_progress' || status === 'cancelled' ? (
                        <StatusBadge value={status} variants={statusVariants.todo} />
                    ) : null}
                </div>
                {showMeta ? (
                    <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
                        <PriorityMeta priority={todo.priority} />
                        {todo.project && (
                            <RelatedPill href={projects.show(todo.project.id).url} dotClassName="bg-emerald-500">
                                {todo.project.title}
                            </RelatedPill>
                        )}
                        {todo.goal && (
                            <RelatedPill href={goals.show(todo.goal.id).url} dotClassName="bg-blue-500">
                                {todo.goal.title}
                            </RelatedPill>
                        )}
                        {todo.learning_item && (
                            <RelatedPill
                                href={learningItems.show(todo.learning_item.id).url}
                                dotClassName="bg-purple-500"
                            >
                                {todo.learning_item.title}
                            </RelatedPill>
                        )}
                    </div>
                ) : null}
            </Link>

            <div className="flex shrink-0 items-center gap-1">
                <span className={cn('inline-flex items-center gap-1 text-xs whitespace-nowrap', dueToneClass[due.tone])}>
                    {due.tone === 'overdue' && <span className="size-1.5 animate-pulse rounded-full bg-red-500" />}
                    <Calendar className="size-3" />
                    {due.label}
                </span>
                <ChevronRight className="size-4 text-stone-300 opacity-30 transition-opacity group-hover:opacity-100 sm:opacity-0 dark:text-stone-600" />
            </div>
        </li>
    );
}
