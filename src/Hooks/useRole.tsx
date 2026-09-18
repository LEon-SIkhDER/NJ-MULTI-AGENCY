import { useQuery } from '@tanstack/react-query';
import useAuth from '../Hook/useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
    const { user, userLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: role, isLoading } = useQuery({
        queryKey: ["role", user?.email],
        queryFn: async () => {
            const { data: result } = await axiosSecure.get(`/role?email=${user?.email}`);
            return result?.role;
        },
        enabled: !!user?.email && !userLoading,
        retry: 1
    });
    const roleLoading = userLoading || isLoading
    // console.log({ role, roleLoading })
    return { role, roleLoading }
};

export default useRole;