import { useOutletContext } from "react-router-dom";
import { IUser } from "../../types";
import { useState } from "react";
import Api from "../../api.config";
import { toast } from "react-toastify";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const user = useOutletContext() as IUser;
  const [first, setFirst] = useState(user.fullName.split(' ')[0]);
  const [last, setLast] = useState(user.fullName.split(' ')[1]);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    Api.put('account', { first, last, email, phone })
      .then(res => {
        toast.success(res.data.message);
        setLoading(false);
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setLoading(false);
      });
  }

  function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    Api.put('account', { password: newPassword, confirm: confirmPassword, oldPassword })
      .then(res => {
        toast.success(res.data.message);
        setLoading(false);
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setLoading(false);
      });
  }

  return (
    <section id="settings">
      <h2>Settings</h2>
      <div>
        <h3>Edit User Information</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="first" >First name</label>
            <input id="first" type="text" placeholder="first name" value={first} onChange={(e) => setFirst(e.target.value)} />
          </div>
          <div>
            <label htmlFor="last">Last name</label>
            <input id="last" type="text" placeholder="last name" value={last} onChange={(e) => setLast(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="phone">Phone number</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <button disabled={loading} >{loading ? 'Processing...' : 'Confirm'}</button>
        </form>
      </div>

      <h3>Security</h3>
      <form onSubmit={handlePasswordSubmit}>
        <div>
          <label htmlFor="new-password" >New Password</label>
          <input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="confirn-new">Confirm New Password</label>
          <input id="confirm-new" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="old">Old Password</label>
          <input id="old" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>
        <button disabled={loading} >{loading ? 'Processing...' : 'Confirm Change Password'}</button>
      </form>

      <h3>Change Theme</h3>
    </section>
  )
}