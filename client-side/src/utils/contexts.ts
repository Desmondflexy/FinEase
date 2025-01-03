import { createContext } from "react";
import { UserContextType } from "./types";

// UserContext variable is required by useUser hook function
export const UserContext = createContext<UserContextType | null>(null);