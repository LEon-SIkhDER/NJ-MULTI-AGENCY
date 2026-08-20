import type { User } from "firebase/auth";
import { createContext } from "react";

export interface AuthContextType {
  user: User | null;
  userLoading: boolean;
  logOut?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;