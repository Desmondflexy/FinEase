import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../../types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Api from "../../api.config";
import { networkLogo, phoneNumberRegex } from "../../utils/constants";

function AirtimeForm() {
  const [state, setState] = useState<IState>({
    networks: [],
    processing: false,
    logoUrl: '',
    formInput: {
      operatorId: '',
      phone: '',
      amount: ''
    }
  });
  const [user, setUser] = useOutletContext() as OutletContextType;
  const { operatorId, amount, phone } = state.formInput
  const options = state.networks.map(network => {
    return <option key={network.id} value={network.id}>{network.name}</option>
  });
  useEffect(fetchNetworks, []);

  function fetchNetworks() {
    Api.get('transaction/networks')
      .then(res => {
        const { networks } = res.data
        setState(s => ({ ...s, networks }));
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  function buyAirtime() {
    Api.post('transaction/airtime', { operatorId, amount, phone })
      .then(res => {
        toast.success(res.data.message);
        setState(s => ({ ...s, processing: false, formInput: { operatorId: '', phone: '', amount: '' } }));
        setUser({ ...user, balance: res.data.balance });
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setState(s => ({ ...s, processing: false }));
      });
  }

  function determineNetwork() {
    Api.get(`transaction/phone-network?phone=${phone}`)
      .then(res => {
        const network = res.data.network.toLowerCase() as string;
        setState(s => ({ ...s, logoUrl: networkLogo[network] }));
      })
      .catch(() => {
        setState(s => ({ ...s, logoUrl: '' }));
      });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(s => ({ ...s, processing: true }));
    buyAirtime();
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'network':
        setState(s => ({ ...s, formInput: { ...s.formInput, operatorId: value } }));
        break;
      case 'phone':
        setState(s => ({ ...s, formInput: { ...s.formInput, phone: value } }));
        break;
      case 'amount':
        setState(s => ({ ...s, formInput: { ...s.formInput, amount: value } }));
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <h2>Airtime</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <div className="form-floating">
            <select className="form-control" name="network" required id="network" value={operatorId} onChange={handleChange}>
              <option value="">-- SELECT NETWORK --</option>
              {options}
            </select>
            <label htmlFor="network">Network</label>
          </div>
        </div>

        <div className="input-group mb-3">
          <div className="form-floating">
            <input className="form-control" name="phone" type="tel" maxLength={11} required id="phone" value={phone} onChange={handleChange} placeholder="Phone Number" pattern={phoneNumberRegex.source} onBlur={determineNetwork} />
            <label htmlFor="phone">Phone Number</label>
          </div>
          {state.logoUrl && <img className="small-network-logo" src={state.logoUrl} style={{ width: '40px' }} />}
        </div>

        <div className="input-group mb-3">
          <div className="form-floating">
            <input className="form-control" name="amount" min={1} required autoComplete="off" type="number" id="amount" value={amount} onChange={handleChange} placeholder="50" />
            <label htmlFor="amount">Amount</label>
          </div>
        </div>
        <button className="w-100 btn btn-success" disabled={state.processing}>{state.processing ? 'Processing...' : 'Proceed'}</button>
      </form>
    </div>
  );

  interface IState {
    networks: {
      id: string;
      name: string;
    }[];
    processing: boolean;
    logoUrl: string;
    formInput: {
      operatorId: string;
      phone: string;
      amount: string;
    }
  }
}

export default AirtimeForm;