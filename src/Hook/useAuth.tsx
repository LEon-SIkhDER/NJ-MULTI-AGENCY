import { useContext } from 'react';
import AuthContext from '../Context/AuthContext';

const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("Context related problem")
    }
    return context
};

export default useAuth;