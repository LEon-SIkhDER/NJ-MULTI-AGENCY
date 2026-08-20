import { Navigate } from "react-router";
import useAuth from "../Hook/useAuth";


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, userLoading } = useAuth()


    if (userLoading) {
        return <span className="loading loading-spinner text-error"></span>
    }
    if (!user) {
        return <Navigate to={"/sign-in"}></Navigate>
    }
    return children
};

export default PrivateRoute;