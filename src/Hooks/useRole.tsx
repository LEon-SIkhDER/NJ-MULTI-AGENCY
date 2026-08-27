import { useQuery } from '@tanstack/react-query';
import useAuth from '../Hook/useAuth';
import axios from 'axios';

const useRole = () => {
    const { user, userLoading } = useAuth()
    const { data: role, isLoading } = useQuery({
        queryKey: ["role", user?.email],
        queryFn: async () => {
            const { data: result } = await axios.get(`https://nj-multi-agency-api.vercel.app/role?email=${user?.email}`)
            return result.role
        },
        enabled: !!user?.email && !userLoading

    })
    const roleLoading = userLoading || isLoading
    // console.log({ role, roleLoading })
    return { role, roleLoading }
};

export default useRole;