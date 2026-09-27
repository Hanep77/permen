import { Form } from '@inertiajs/react';
import { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="Delete account"
                description="Delete your account and all of its resources"
            />
            <div className="space-y-4 rounded-md border border-outline-variant bg-error-container/50 p-5">
                <div className="relative space-y-0.5 text-on-error-container">
                    <p className="text-title-small">Warning</p>
                    <p className="text-body-medium">
                        Please proceed with caution, this cannot be undone.
                    </p>
                </div>

                {!isConfirming ? (
                    <button
                        type="button"
                        className="rounded-full bg-error px-6 py-2.5 text-label-large text-on-error transition hover:elevation-1"
                        onClick={() => setIsConfirming(true)}
                        data-test="delete-user-button"
                    >
                        Delete account
                    </button>
                ) : (
                    <div className="space-y-4 border-t border-error/30 pt-4">
                        <h3 className="text-title-medium text-on-error-container">
                            Confirm account deletion
                        </h3>
                        <p className="text-body-medium text-on-surface-variant">
                            Enter your password. This action permanently removes
                            your account and its data.
                        </p>
                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Password
                                        </label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Password"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            className="rounded-full px-6 py-2.5 text-label-large text-primary transition hover:bg-primary/8"
                                            onClick={() => {
                                                resetAndClearErrors();
                                                setIsConfirming(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-full bg-error px-6 py-2.5 text-label-large text-on-error transition hover:elevation-1 disabled:opacity-40"
                                            data-test="confirm-delete-user-button"
                                        >
                                            Delete account
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                )}
            </div>
        </div>
    );
}
