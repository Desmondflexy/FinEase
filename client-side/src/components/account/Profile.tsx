import { IUser } from "../../utils/types";
import { useUserHook } from "../../utils/hooks";

export default function Profile() {
    const vv = useUserHook();
    const user = vv.user as IUser;

    return (
        <div id="user-profile">
            <h1>Account Info</h1>
            <hr />
            <div>
                <p><b>Name: </b><i>{user.fullName} <b style={{ color: 'darkblue' }}>{user.isAdmin && '(Admin)'}</b></i></p>
                <p><b>Email: </b><i>{user.email}</i></p>
                <p><b>Phone: </b><i>{user.phone}</i></p>
                <p><b>Wallet Account Number: </b><i>{user.acctNo}</i></p>
                <p><b>Date Registered: </b><i>{user.createdAt.split('T')[0]}</i></p>
            </div>
        </div>
    )
}