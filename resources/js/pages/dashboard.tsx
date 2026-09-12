import { Head } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-8">
                <section className="rounded-2xl bg-emerald-800 px-6 py-10 text-white shadow-sm sm:px-10">
                    <div className="max-w-2xl space-y-4">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-100">
                            <Sparkles className="size-4" /> Your workspace
                        </span>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Start building something useful.
                        </h1>
                        <p className="max-w-xl text-emerald-100">
                            Your application is ready for its first feature. Add
                            a route, build a page, and let Laravel handle the
                            rest.
                        </p>
                    </div>
                </section>
                <section className="grid gap-4 md:grid-cols-3">
                    {[
                        'Create your first model',
                        'Add an Inertia page',
                        'Write a feature test',
                    ].map((step, index) => (
                        <article
                            key={step}
                            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
                        >
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                0{index + 1}
                            </span>
                            <h2 className="mt-3 font-semibold">{step}</h2>
                            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                                Replace this starter content with the work that
                                matters to your product.
                            </p>
                        </article>
                    ))}
                </section>
                <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                    <h2 className="font-semibold">Project status</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                        <CheckCircle2 className="size-4 text-emerald-600" />{' '}
                        Authentication and settings are ready to customize.
                    </p>
                    <a
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                        href="https://laravel.com/docs"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Read Laravel documentation{' '}
                        <ArrowRight className="size-4" />
                    </a>
                </section>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
