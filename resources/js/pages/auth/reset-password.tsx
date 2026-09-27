import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <label className="form-label" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="form-input"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="form-label" htmlFor="password">
                                Password
                            </label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className=""
                                autoFocus
                                placeholder="Password"
                                passwordrules={passwordRules}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <label
                                className="form-label"
                                htmlFor="password_confirmation"
                            >
                                Confirm password
                            </label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className=""
                                placeholder="Confirm password"
                                passwordrules={passwordRules}
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <button
                            type="submit"
                            className="button-primary mt-4 w-full"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && (
                                <span className="size-4 animate-spin rounded-full border-2 border-on-primary/40 border-t-on-primary" />
                            )}
                            Reset password
                        </button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset password',
    description: 'Please enter your new password below',
};
