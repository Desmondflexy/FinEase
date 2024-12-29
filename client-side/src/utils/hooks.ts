import { useContext } from "react";
import { UserContext } from "../components/account/Account";

/**Get authenticated user details and setter function. */
export function useUserHook() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUserHook must be used within a UserProvider");
    return context;
}