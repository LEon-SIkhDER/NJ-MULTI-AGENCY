import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../firebase.config';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(true);

    const logOut = async () => {
        setUserLoading(true);
        try {
            await signOut(auth);
            setUser(null);
        } finally {
            setUserLoading(false);
        }
    };

    useEffect(() => {
        const subscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setUserLoading(false);
        });
        return () => subscribe();
    }, []);

    const context = {
        user,
        userLoading,
        logOut
    };

    return (
        <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;