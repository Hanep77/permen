"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash2, Calendar, Target, Clock, Plus } from 'lucide-react';
import goals from '@/routes/goals'
import projects from '@/routes/projects'
import opportunities from '@/routes/opportunities'
import notes from '@/routes/notes'
import resources from '@/routes/resources'
import todos from '@/routes/todos';
import learningItems from '@/routes/learning-items';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { SectionVisibilityMenu, useSectionVisibility } from '@/components/crud';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';
import { MarkdownContent } from '@/components/ui/markdown-content';

interface Props {
    goal: {
        id: number;
        title: string;
        description: string;
        status: string;
        start_date: string;
        target_date: string;
        completed_at?: string;
        user: { name: string };
        projects: Array<{ id: number; title: string; status: string }>;
        opportunities: Array<{ id: number; title: string; status: string }>;
        notes: Array<{ id: number; title: string }>;
        resources: Array<{ id: number; title: string }>;
        todos: Array<{ id: number; title: string; status: string }>;
        learning_items: Array<{ id: number; title: string; type: string }>;
        created_at: string;
        updated_at: string;
    };
}

export default function GoalsShow({ goal }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const sections = [
        { id: 'projects', label: 'Projects' },
        { id: 'opportunities', label: 'Opportunities' },
        { id: 'notes', label: 'Notes' },
        { id: 'resources', label: 'Resources' },
        { id: 'todos', label: 'Todos' },
        { id: 'learning_items', label: 'Learning Items' },
    ];
    const {
        isVisible: isSectionVisible,
        toggle: toggleSection,
        showAll: showAllSections,
        hiddenCount: hiddenSectionCount,
        allHidden: allSectionsHidden,
    } = useSectionVisibility('permen:goals.show:sections', sections);

    const { delete: destroy, processing } = useForm({
        _method: 'delete',
    });

    const handleDelete = () => {
        destroy(goals.destroy(goal.id).url, {
            onSuccess: () => {},
        });
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'active': return 'default';
            case 'completed': return 'success';
            case 'abandoned': return 'destructive';
            default: return 'secondary';
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Goals', href: goals.index().url },
        { title: goal.title, href: goals.show(goal.id).url },
    ];

    (GoalsShow as typeof GoalsShow & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={goal.title} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-headline-small text-on-surface">{goal.title}</h1>
                            <p className="mt-1 text-sm text-on-surface-variant text-on-surface-variant">
                                Created by {goal.user.name} · {new Date(goal.created_at).toLocaleDateString()}
                            </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <SectionVisibilityMenu
                            sections={sections}
                            isVisible={isSectionVisible}
                            onToggle={toggleSection}
                            onShowAll={showAllSections}
                            hiddenCount={hiddenSectionCount}
                        />
                        <Button
                            variant="outline"
                            as={Link}
                            href={goals.edit(goal.id).url}
                        >
                            <Edit className="size-4" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MarkdownContent content={goal.description} />
                            </CardContent>
                        </Card>

                        {isSectionVisible('projects') && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Projects</CardTitle>
                                    <CardDescription>
                                        {goal.projects.length} project{goal.projects.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    as={Link}
                                    href={projects.create.url({ query: { goal_id: goal.id } })}
                                >
                                    <Plus className="size-4" />
                                    Add Project
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {goal.projects.length === 0 ? (
                                    <p className="text-sm text-on-surface-variant text-on-surface-variant">
                                        No projects yet. Create a project to break down this goal.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {goal.projects.map((project) => (
                                            <Link
                                                key={project.id}
                                                href={projects.show(project.id).url}
                                                className="flex items-center justify-between p-3 rounded-md border border-outline-variant hover:bg-on-surface/5 transition-colors border-outline-variant hover:bg-on-surface/8"
                                            >
                                                <div>
                                                    <p className="font-medium text-on-surface text-on-surface">
                                                        {project.title}
                                                    </p>
                                                    <Badge variant={getStatusVariant(project.status)}>
                                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                                    </Badge>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        )}

                        {isSectionVisible('opportunities') && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Opportunities</CardTitle>
                                    <CardDescription>
                                        {goal.opportunities.length} opportunit{goal.opportunities.length !== 1 ? 'ies' : 'y'}
                                    </CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    as={Link}
                                    href={opportunities.create.url({ query: { goal_id: goal.id } })}
                                >
                                    <Plus className="size-4" />
                                    Add Opportunity
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {goal.opportunities.length === 0 ? (
                                    <p className="text-sm text-on-surface-variant text-on-surface-variant">
                                        No opportunities yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {goal.opportunities.map((opp) => (
                                            <Link
                                                key={opp.id}
                                                href={opportunities.show(opp.id).url}
                                                className="flex items-center justify-between p-3 rounded-md border border-outline-variant hover:bg-on-surface/5 transition-colors border-outline-variant hover:bg-on-surface/8"
                                            >
                                                <div>
                                                    <p className="font-medium text-on-surface text-on-surface">
                                                        {opp.title}
                                                    </p>
                                                    <Badge variant={getStatusVariant(opp.status)}>
                                                        {opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}
                                                    </Badge>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        )}

                        {isSectionVisible('notes') && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                                <CardDescription>
                                    {goal.notes.length} note{goal.notes.length !== 1 ? 's' : ''}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {goal.notes.length === 0 ? (
                                    <p className="text-sm text-on-surface-variant text-on-surface-variant">
                                        No notes yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {goal.notes.map((note) => (
                                            <Link
                                                key={note.id}
                                                href={notes.show(note.id).url}
                                                className="flex items-center justify-between p-3 rounded-md border border-outline-variant hover:bg-on-surface/5 transition-colors border-outline-variant hover:bg-on-surface/8"
                                            >
                                                <p className="font-medium text-on-surface text-on-surface">
                                                    {note.title}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        )}

                        {isSectionVisible('resources') && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Resources</CardTitle>
                                <CardDescription>
                                    {goal.resources.length} resource{goal.resources.length !== 1 ? 's' : ''}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {goal.resources.length === 0 ? (
                                    <p className="text-sm text-on-surface-variant text-on-surface-variant">
                                        No resources yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {goal.resources.map((resource) => (
                                            <Link
                                                key={resource.id}
                                                href={resources.show(resource.id).url}
                                                className="flex items-center justify-between p-3 rounded-md border border-outline-variant hover:bg-on-surface/5 transition-colors border-outline-variant hover:bg-on-surface/8"
                                            >
                                                <p className="font-medium text-on-surface text-on-surface">
                                                    {resource.title}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        )}

                        {isSectionVisible('todos') && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Todos</CardTitle>
                                <CardDescription>
                                    {goal.todos.length} todo{goal.todos.length !== 1 ? 's' : ''}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {goal.todos.length === 0 ? (
                                    <p className="text-sm text-on-surface-variant text-on-surface-variant">
                                        No todos yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {goal.todos.map((todo) => (
                                            <Link
                                                key={todo.id}
                                                href={todos.show(todo.id).url}
                                                className="flex items-center justify-between p-3 rounded-md border border-outline-variant hover:bg-on-surface/5 transition-colors border-outline-variant hover:bg-on-surface/8"
                                            >
                                                <div>
                                                    <p className="font-medium text-on-surface text-on-surface">
                                                        {todo.title}
                                                    </p>
                                                    <Badge variant={getStatusVariant(todo.status)}>
                                                        {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                                                    </Badge>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        )}

                        {isSectionVisible('learning_items') && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Learning Items</CardTitle>
                                    <CardDescription>
                                        {goal.learning_items.length} learning item{goal.learning_items.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    as={Link}
                                    href={learningItems.create.url({ query: { goal_id: goal.id } })}
                                >
                                    <Plus className="size-4" />
                                    Add Learning Item
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {goal.learning_items.length === 0 ? (
                                    <p className="text-sm text-on-surface-variant text-on-surface-variant">
                                        No learning items yet. Track what you're learning for this goal.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {goal.learning_items.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={learningItems.show(item.id).url}
                                                className="flex items-center justify-between p-3 rounded-md border border-outline-variant hover:bg-on-surface/5 transition-colors border-outline-variant hover:bg-on-surface/8"
                                            >
                                                <div>
                                                    <p className="font-medium text-on-surface text-on-surface">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-sm text-on-surface-variant text-on-surface-variant capitalize">
                                                        {item.type}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        )}

                        {allSectionsHidden && (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm text-on-surface-variant text-on-surface-variant">
                                    All sections are hidden.{' '}
                                    <button
                                        type="button"
                                        onClick={showAllSections}
                                        className="font-medium text-primary hover:underline text-primary"
                                    >
                                        Show all
                                    </button>
                                </p>
                            </CardContent>
                        </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-on-surface-variant text-on-surface-variant">Current Status</span>
                                        <Badge variant={getStatusVariant(goal.status)} className="text-base px-3 py-1">
                                            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-on-surface-variant text-on-surface-variant">Start Date</span>
                                        <span className="text-sm font-medium">
                                            <Calendar className="size-4 inline mr-1" />
                                            {new Date(goal.start_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-on-surface-variant text-on-surface-variant">Target Date</span>
                                        <span className="text-sm font-medium">
                                            <Target className="size-4 inline mr-1" />
                                            {new Date(goal.target_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {goal.completed_at && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-on-surface-variant text-on-surface-variant">Completed At</span>
                                            <span className="text-sm font-medium">
                                                <Clock className="size-4 inline mr-1" />
                                                {new Date(goal.completed_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    as={Link}
                                    href={projects.create.url({ query: { goal_id: goal.id } })}
                                    className="w-full justify-start"
                                >
                                    <Plus className="size-4" />
                                    Add Project
                                </Button>
                                <Button
                                    variant="outline"
                                    as={Link}
                                    href={opportunities.create.url({ query: { goal_id: goal.id } })}
                                    className="w-full justify-start"
                                >
                                    <Plus className="size-4" />
                                    Add Opportunity
                                </Button>
                                <Button
                                    variant="outline"
                                    as={Link}
                                    href={notes.create.url({ query: { goal_id: goal.id } })}
                                    className="w-full justify-start"
                                >
                                    <Plus className="size-4" />
                                    Add Note
                                </Button>
                                <Button
                                    variant="outline"
                                    as={Link}
                                    href={resources.create.url({ query: { goal_id: goal.id } })}
                                    className="w-full justify-start"
                                >
                                    <Plus className="size-4" />
                                    Add Resource
                                </Button>
                                <Button
                                    variant="outline"
                                    as={Link}
                                    href={todos.create.url({ query: { goal_id: goal.id } })}
                                    className="w-full justify-start"
                                >
                                    <Plus className="size-4" />
                                    Add Todo
                                </Button>
                                <Button
                                    variant="outline"
                                    as={Link}
                                    href={learningItems.create.url({ query: { goal_id: goal.id } })}
                                    className="w-full justify-start"
                                >
                                    <Plus className="size-4" />
                                    Add Learning Item
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={handleDelete}
                    title="Delete Goal"
                    description="Are you sure you want to delete this goal? This action cannot be undone."
                    confirmText="Delete"
                    variant="destructive"
                    isLoading={processing}
                />
            </div>
        </>
    );
}