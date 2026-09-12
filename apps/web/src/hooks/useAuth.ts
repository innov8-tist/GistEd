import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserData } from '@/apis/auth';
import { User } from '../types/User';

const useAuth = () => {
    const queryClient = useQueryClient();
    
    // Check for mock user in localStorage
    const getMockUser = (): User | null => {
        try {
            const mockUserStr = localStorage.getItem('mockUser');
            if (mockUserStr) {
                return JSON.parse(mockUserStr) as User;
            }
        } catch (error) {
            console.error('Error reading mock user:', error);
        }
        return null;
    };

    const mockUser = getMockUser();
    const isMockMode = mockUser !== null;

    const query = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            // If in mock mode, return mock user instead of making API call
            if (isMockMode) {
                return mockUser;
            }
            return getUserData();
        },
        enabled: isMockMode || document.cookie.includes('x-auth-cookie'),
        retry: false,
    });
    
    const { data, error, isLoading, isError, isFetching } = query;

    function invalidateUser() {
        // Clear mock user on logout
        localStorage.removeItem('mockUser');
        queryClient.invalidateQueries({ queryKey: ['user'] });
    }

    return {
        user: data as User,
        error,
        isLoading,
        isError,
        isFetching,
        invalidate: invalidateUser,
        isMockMode,
    };
};

export default useAuth;
