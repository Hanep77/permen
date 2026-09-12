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
            <div className="space-y-4 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/70 dark:bg-red-950/30">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Warning</p>
                    <p className="text-sm">
                        Please proceed with caution, this cannot be undone.
                    </p>
                </div>

                {!isConfirming ? (
                    <button
                        type="button"
                        className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500"
                        onClick={() => setIsConfirming(true)}
                        data-test="delete-user-button"
                    >
                        Delete account
                    </button>
                ) : (
                    <div className="space-y-4 border-t border-red-200 pt-4 dark:border-red-900/70">
                        <h3 className="font-semibold">
                            Confirm account deletion
                        </h3>
                        <p className="text-sm text-stone-600 dark:text-stone-300">
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

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-white dark:border-stone-700 dark:hover:bg-stone-900"
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
                                            className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:opacity-60 dark:bg-red-600"
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
