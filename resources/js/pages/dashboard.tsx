import { Head } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { dashboard } from '@/routes';
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* M3 hero: primary-container, large shape, headline type */}
                <section className="rounded-lg bg-primary-container px-6 py-10 text-on-primary-container sm:px-10">
                    <div className="max-w-2xl space-y-4">
                        <span className="inline-flex items-center gap-2 text-label-large text-on-primary-container">
                            <Sparkles className="size-[18px]" /> Your workspace
                        </span>
                        <h1 className="text-display-small text-on-primary-container">
                            Start building something useful.
                        </h1>
                        <p className="max-w-xl text-body-large text-on-primary-container/90">
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
                        <Card key={step} variant="filled">
                            <CardContent className="p-5 pt-5">
                                <span className="text-label-large text-primary">
                                    0{index + 1}
                                </span>
                                <h2 className="mt-3 text-title-medium text-on-surface">
                                    {step}
                                </h2>
                                <p className="mt-2 text-body-medium text-on-surface-variant">
                                    Replace this starter content with the work that
                                    matters to your product.
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </section>
                <Card variant="outlined">
                    <CardContent className="p-6 pt-6">
                        <h2 className="text-title-medium text-on-surface">
                            Project status
                        </h2>
                        <p className="mt-2 flex items-center gap-2 text-body-medium text-on-surface-variant">
                            <CheckCircle2 className="size-5 text-primary" />{' '}
                            Authentication and settings are ready to customize.
                        </p>
                        <a
                            className="mt-5 inline-flex items-center gap-2 rounded-full px-2 py-1 text-label-large text-primary hover:bg-primary/8"
                            href="https://laravel.com/docs"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Read Laravel documentation{' '}
                            <ArrowRight className="size-[18px]" />
                        </a>
                    </CardContent>
                </Card>
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
