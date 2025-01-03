import { UserContext } from "../utils/contexts";
import { UserContextType } from "../utils/types";

export default function UserProvider({ children, value }: Props) {
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

type Props = {
    children: React.ReactNode;
    value: UserContextType;
}