import { UserContext } from "../utils/contexts";

export default function UserProvider(props: Props) {
    const { children, value } = props;
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