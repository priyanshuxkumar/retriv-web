import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import AxiosInstance from './axiosInstance';

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
            toast(response.data.message);
        }
    } catch (err: unknown) {
        console.error(err);
    }
};

export { handleLogout };
