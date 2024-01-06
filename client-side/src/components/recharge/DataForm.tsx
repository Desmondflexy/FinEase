import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../../types";
import { useEffect, useState } from "react";
import Api from "../../api.config";
import { networkLogo, phoneNumberRegex } from "../../utils/constants";
import { toast } from "react-toastify";

export default function DataForm() {
  const [user, setUser] = useOutletContext() as OutletContextType;

  const [state, setState] = useState<IState>({
    networks: [],
    plans: [],
    processing: false,
    logoUrl: '',
    formInput: {
      operatorId: '',
      planId: '',
      phone: ''
    }
  });

  const { operatorId, planId, phone } = state.formInput;

  const options = state.networks.map(network => {
    return <option key={network.id} value={network.id}>{network.name}</option>
  });

  const planOptions = state.plans.map(plan => {
    return <option key={plan.id} value={plan.id}>{plan.name}</option>
  });

  useEffect(fetchNetworks, []);
  useEffect(fetchDataPlans, [operatorId]);

  function fetchNetworks() {
    Api.get('transaction/networks')
      .then(res => {
        setState(s => ({ ...s, networks: res.data.networks }));
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  function fetchDataPlans() {
    if (operatorId)
      Api.get(`transaction/data-plans?operatorId=${operatorId}`)
        .then(res => {
          setState(s => ({ ...s, plans: res.data.dataPlans }));
        })
        .catch(err => {
          console.log(err.response);
        })
  }

  function determineNetwork() {
    Api.get(`transaction/phone-network?phone=${phone}`)
      .then(res => {
        const network = res.data.network.toLowerCase() as string;
        setState(s => ({ ...s, logoUrl: networkLogo[network] }));
      })
      .catch(() => {
        setState(s => ({ ...s, logoUrl: '' }));
      })
  }

  function buyData() {
    const data = {
      operatorId,
      dataPlanId: planId,
      phone,
    };

    Api.post('transaction/buy-data', data)
      .then(res => {
        const { message, balance } = res.data;
        toast.success(message);
        setState(s => ({ ...s, processing: false, formInput: { operatorId: '', phone: '', planId: '' } }));
        setUser({ ...user, balance });
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setState(s => ({ ...s, processing: false }));
      });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(s => ({ ...s, processing: true }));
    buyData();
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'network':
        setState(s => ({ ...s, formInput: { ...s.formInput, operatorId: value } }));
        break;
      case 'data-plan':
        setState(s => ({ ...s, formInput: { ...s.formInput, planId: value } }));
        break;
      case 'phone':
        setState(s => ({ ...s, formInput: { ...s.formInput, phone: value } }));
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <h2>Data</h2>
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
          <select className="form-control" name="data-plan" id="data-plan" required disabled={!operatorId} value={planId} onChange={handleChange} >
            <option value="">-- SELECT DATAPLANS --</option>
            {planOptions}
          </select>
          <label htmlFor="data-plan">Data Plan</label>
          </div>

        </div>
        <div className="input-group mb-3">
          <div className="form-floating">
            <input className="form-control" name="phone" type="tel" maxLength={11} required id="phone" value={phone} onChange={handleChange} placeholder="Phone Number" pattern={phoneNumberRegex.source} onBlur={determineNetwork} />
            <label htmlFor="phone">Phone Number</label>
          </div>
          {state.logoUrl && <img className="small-network-logo" src={state.logoUrl} style={{ width: '40px' }} />}
        </div>
        <button className="w-100 btn btn-primary" disabled={state.processing}>{state.processing ? 'Processing...' : 'Proceed'}</button>
      </form>
    </div>
  );

  interface IState {
    networks: {
      id: string;
      name: string;
    }[];
    plans: {
      amount: number;
      id: string;
      name: string;
    }[];
    processing: boolean;
    logoUrl: string;
    formInput: {
      operatorId: string;
      planId: string;
      phone: string;
    }
  }
}