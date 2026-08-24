import React from 'react';
import useRole from '../Hooks/useRole';
import Forbidden from '../Component/Forbidden';

const ModeratorRoute = ({ children }: { children: React.ReactNode }) => {
    // const { role, roleLoading } = useRole()
    // if (roleLoading) {
    //     return (
    //         <div className="min-h-screen w-full flex items-center justify-center bg-(--bg)">
    //             <div className="flex flex-col items-center gap-3">
    //                 <span className="loading loading-spinner loading-lg text-[#c43448]"></span>
    //                 <p className="text-xs font-semibold uppercase tracking-wider text-(--text-muted)">Loading Agency Portal...</p>
    //             </div>
    //         </div>
    //     )
    // }
    // // console.log(roleLoading)
    // if (role !== "moderator") {
    //     return <Forbidden></Forbidden>
    // }
    return children

};

export default ModeratorRoute;