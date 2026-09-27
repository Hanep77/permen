export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-1'}>
            <h2
                className={
                    variant === 'small'
                        ? 'text-title-small text-on-surface'
                        : 'text-headline-small text-on-surface'
                }
            >
                {title}
            </h2>
            {description && (
                <p className="text-body-medium text-on-surface-variant">{description}</p>
            )}
        </header>
    );
}
