import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import AxiosInstance from './axiosInstance';
import { resetLocalStorage } from '@/lib/storage';

const handleLogout = async (router: AppRouterInstance) => {
    try {
        const response = await AxiosInstance.post(
            '/api/v1/auth/logout',
            {},
            {
                withCredentials: true,
            },
        );
        if (response.data.success === true) {
            router.push('/login');
            resetLocalStorage('user_fullname');
            resetLocalStorage('user_email');

            toast(response.data.message);
        }
    } catch (err: unknown) {
        console.error(err);
    }
};

export { handleLogout };
