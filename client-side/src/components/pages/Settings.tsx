import { useOutletContext } from "react-router-dom";
import { IUser } from "../../types";
import { useState } from "react";
import Api from "../../api.config";
import { toast } from "react-toastify";

export default function Settings() {
  interface IState {
    basic: {
      first: string;
      last: string;
      email: string;
      phone: string;
      loading: boolean;
    };
    security: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
      loading: boolean;
    };
  }

  const [user] = useOutletContext() as [IUser];
  const [state, setState] = useState<IState>({
    basic: {
      first: user.fullName.split(' ')[0],
      last: user.fullName.split(' ')[1],
      email: user.email,
      phone: user.phone,
      loading: false
    },
    security: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      loading: false
    }
  });

  const { first, last, email, phone } = state.basic;
  const { newPassword, confirmPassword, oldPassword } = state.security;

  function handleBasic(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(s => ({ ...s, basic: { ...s.basic, loading: true } }));
    Api.put('account', { first, last, email, phone })
      .then(res => {
        toast.success(res.data.message);
        setState(s => ({ ...s, basic: { ...s.basic, loading: false } }));
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setState(s => ({ ...s, basic: { ...s.basic, loading: false } }));
      });
  }

  function handleSecuritySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(s => ({ ...s, security: { ...s.security, loading: true } }));
    Api.put('account', { password: newPassword, confirm: confirmPassword, oldPassword })
      .then(res => {
        toast.success(res.data.message);
        setState(s => ({ ...s, security: { ...s.security, loading: false } }));
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setState(s => ({ ...s, security: { ...s.security, loading: false } }));
      });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'first':
        setState(s => ({ ...s, basic: { ...s.basic, first: value } }));
        break;
      case 'last':
        setState(s => ({ ...s, basic: { ...s.basic, last: value } }));
        break;
      case 'email':
        setState(s => ({ ...s, basic: { ...s.basic, email: value } }));
        break;
      case 'phone':
        setState(s => ({ ...s, basic: { ...s.basic, phone: value } }));
        break;
      case 'newPassword':
        setState(s => ({ ...s, security: { ...s.security, newPassword: value } }));
        break;
      case 'confirmPassword':
        setState(s => ({ ...s, security: { ...s.security, confirmPassword: value } }));
        break;
      case 'oldPassword':
        setState(s => ({ ...s, security: { ...s.security, oldPassword: value } }));
        break;
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'first':
        if (!value)
          setState(s => ({ ...s, basic: { ...s.basic, first: user.fullName.split(' ')[0] } }));
        break;
      case 'last':
        if (!value)
          setState(s => ({ ...s, basic: { ...s.basic, last: user.fullName.split(' ')[1] } }));
        break;
      case 'email':
        if (!value)
          setState(s => ({ ...s, basic: { ...s.basic, email: user.email } }));
        break;
      case 'phone':
        if (!value)
          setState(s => ({ ...s, basic: { ...s.basic, phone: user.phone } }));
        break;
    }
  }

  return (
    <section id="settings">
      <div className="mb-3">
        <h1>Settings</h1>
      </div>
      <div className="mb-4">
        <h3>Edit User Information</h3>
        <form className="form" onSubmit={handleBasic}>
          <div className="input-group mb-3">
            <div className="form-floating">
              <input onBlur={handleBlur} className="form-control" name="first" id="first" type="text" placeholder="first name" value={first} onChange={handleChange} />
              <label htmlFor="first" >First name</label>
            </div>
          </div>

          <div className="input-group mb-3">
            <div className="form-floating">
              <input onBlur={handleBlur} className="form-control" name="last" id="last" type="text" placeholder="last name" value={last} onChange={handleChange} />
              <label htmlFor="last">Last name</label>
            </div>
          </div>

          <div className="input-group mb-3">
            <div className="form-floating">
              <input onBlur={handleBlur} className="form-control" name="email" id="email" type="email" value={email} onChange={handleChange} />
              <label htmlFor="email">Email</label>
            </div>
          </div>

          <div className="input-group mb-3">
            <div className="form-floating">
              <input onBlur={handleBlur} className="form-control" name="phone" id="phone" type="tel" value={phone} onChange={handleChange} />
              <label htmlFor="phone">Phone number</label>
            </div>
          </div>

          <button className="btn btn-secondary w-100" disabled={state.basic.loading} >{state.basic.loading ? 'Processing...' : 'Confirm'}</button>
        </form>
      </div>

      <h3>Security</h3>
      <form className="form" onSubmit={handleSecuritySubmit}>
        <div className="input-group mb-3">
          <div className="form-floating">
            <input placeholder="New Password" className="form-control" name="newPassword" id="new-password" type="password" value={newPassword} onChange={handleChange} />
            <label htmlFor="new-password" >New Password</label>
          </div>
        </div>
        <div className="input-group mb-3">
          <div className="form-floating">
            <input placeholder="Confirm New Password" className="form-control" name="confirmPassword" id="confirm-new" type="password" value={confirmPassword} onChange={handleChange} />
            <label htmlFor="confirn-new">Confirm New Password</label>
          </div>
        </div>
        <div className="input-group mb-3">
          <div className="form-floating">
            <input placeholder="Old Password" className="form-control" name="oldPassword" id="old" type="password" value={oldPassword} onChange={handleChange} />
            <label htmlFor="old">Old Password</label>
          </div>
        </div>
        <button className="btn btn-secondary w-100" disabled={state.security.loading} >{state.security.loading ? 'Processing...' : 'Confirm Change Password'}</button>
      </form>
    </section>
  )
}