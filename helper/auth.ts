import { SigninFormSchema } from '@/types';
import { z } from 'zod';

interface ValidateFormProp {
    email: string;
    password: string;
    setErrors: ({}) => void;
}

const validateSigninForm = ({ email, password, setErrors }: ValidateFormProp): boolean => {
    try {
        SigninFormSchema.parse({ email, password });
        setErrors({});
        return true;
    } catch (validationError: unknown) {
        if (validationError instanceof z.ZodError) {
            const fieldErrors: {
                email?: string;
                password?: string;
            } = {};

            validationError.errors.forEach((err) => {
                if (err.path[0] === 'email') fieldErrors.email = err.message;
                if (err.path[0] === 'password') fieldErrors.password = err.message;
            });

            setErrors(fieldErrors);
        }
        return false;
    }
};

export { validateSigninForm };
