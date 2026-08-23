import { Navigate, useLocation } from "react-router";
import useAuth from "../Hook/useAuth";


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, userLoading } = useAuth()
    const location = useLocation()
    console.log(location)


    if (userLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-(--bg)">
                <div className="flex flex-col items-center gap-3">
                    <span className="loading loading-spinner loading-lg text-[#c43448]"></span>
                    <p className="text-xs font-semibold uppercase tracking-wider text-(--text-muted)">Loading Agency Portal...</p>
                </div>
            </div>
        );
    }
    if (!user) {
        return <Navigate to={"/sign-in"} state={location.pathname}></Navigate>
    }
    return children
};

export default PrivateRoute;