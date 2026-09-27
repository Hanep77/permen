import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, Rocket, Video } from 'lucide-react';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col bg-surface text-on-surface">
                {/* M3 top app bar */}
                <header className="flex h-16 items-center gap-2 bg-surface-container px-4 lg:px-8">
                    <span className="flex size-10 items-center justify-center rounded-md bg-primary-container text-label-large text-on-primary-container">
                        P
                    </span>
                    <span className="text-title-large">Permen</span>
                    <div className="flex-1" />
                    <nav className="flex items-center gap-2">
                        {auth.user ? (
                            <Button as={Link} href={dashboard().url}>
                                Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button as={Link} href={login().url} variant="text">
                                    Log in
                                </Button>
                                <Button as={Link} href={register().url}>
                                    Register
                                </Button>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-6 p-6 lg:p-10">
                    {/* M3 hero */}
                    <section className="rounded-lg bg-primary-container p-8 text-on-primary-container sm:p-12">
                        <p className="text-label-large">PERSONAL MANAGEMENT</p>
                        <h1 className="mt-2 text-display-small">
                            Let&apos;s get started
                        </h1>
                        <p className="mt-3 max-w-xl text-body-large text-on-primary-container/90">
                            Laravel has an incredibly rich ecosystem. We suggest
                            starting with the following.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href="https://cloud.laravel.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-14 items-center gap-2 rounded-md bg-primary px-8 text-label-large text-on-primary transition hover:elevation-1"
                            >
                                <Rocket className="size-5" />
                                Deploy now
                            </a>
                            <a
                                href="https://laravel.com/docs"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-14 items-center gap-2 rounded-full border border-outline px-6 text-label-large text-primary transition hover:bg-primary/8"
                            >
                                <BookOpen className="size-5" />
                                Documentation
                            </a>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        <Card variant="filled">
                            <CardContent className="p-6 pt-6">
                                <span className="flex size-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                                    <BookOpen className="size-6" />
                                </span>
                                <h2 className="mt-4 text-title-large">
                                    Read the documentation
                                </h2>
                                <p className="mt-1 text-body-medium text-on-surface-variant">
                                    Everything you need to build with Laravel.
                                </p>
                                <a
                                    href="https://laravel.com/docs"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 text-label-large text-primary hover:underline"
                                >
                                    Open docs <ArrowRight className="size-4" />
                                </a>
                            </CardContent>
                        </Card>
                        <Card variant="filled">
                            <CardContent className="p-6 pt-6">
                                <span className="flex size-12 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container">
                                    <Video className="size-6" />
                                </span>
                                <h2 className="mt-4 text-title-large">
                                    Watch video tutorials
                                </h2>
                                <p className="mt-1 text-body-medium text-on-surface-variant">
                                    Learn step by step at Laracasts.
                                </p>
                                <a
                                    href="https://laracasts.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 text-label-large text-primary hover:underline"
                                >
                                    Visit Laracasts <ArrowRight className="size-4" />
                                </a>
                            </CardContent>
                        </Card>
                    </section>
                </main>
            </div>
        </>
    );
}
