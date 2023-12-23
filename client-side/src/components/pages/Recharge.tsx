import { toast } from "react-toastify";
import Api from "../../api.config";
import { useEffect, useState } from "react";
import { phoneNumberRegex } from "../../utils";
import { useOutletContext } from "react-router-dom";
import { IDisco, OutletContextType } from "../../types";

const networkLogo: { [key: string]: string } = {
  'mtn': '/images/mtn-logo.png',
  'airtel': '/images/airtel-logo.svg',
  'globacom': '/images/glo-logo.png',
  '9mobile': '/images/9mobile-logo.png'
};

export default function Recharge() {
  const [state, setState] = useState({
    service: '',
  });
  const { service } = state;

  function handleServiceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setState(s => ({ ...s, service: e.target.value }));
  }

  return (
    <section id="recharge">
      <h1>Recharge</h1>
      <form>
        <label htmlFor="service">What do you want to do?</label>
        <select id="service" value={service} onChange={handleServiceChange}>
          <option value='' >--select--</option>
          <option value="airtime">Buy Airtime</option>
          <option value="data">Buy Data</option>
          <option value="electricity">Buy Electricity</option>
          <option value="tv">Tv Subscription</option>
        </select>
      </form>

      {service === 'airtime' && <Airtime />}
      {service === 'data' && <Data />}
      {service === 'electricity' && <Electricity />}
      {service === 'tv' && <Tv />}
    </section>
  )
}

export function Airtime() {
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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="network">Network</label>
          <select name="network" required id="network" value={operatorId} onChange={handleChange}>
            <option value="">-- SELECT NETWORK --</option>
            {options}
          </select>
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input name="phone" maxLength={11} required id="phone" value={phone} onChange={handleChange} placeholder="07022345678" pattern={phoneNumberRegex.source} onBlur={determineNetwork} />
          {state.logoUrl && <img className="small-network-logo" src={state.logoUrl} />}
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input name="amount" min={1} required autoComplete="off" type="number" id="amount" value={amount} onChange={handleChange} placeholder="50" />
        </div>
        <button className="form-submit" disabled={state.processing}>{state.processing ? 'Processing...' : 'Proceed'}</button>
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

export function Data() {
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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="network">Network</label>
          <select name="network" required id="network" value={operatorId} onChange={handleChange}>
            <option value="">-- SELECT NETWORK --</option>
            {options}
          </select>
        </div>
        <div>
          <label htmlFor="data-plan">Data Plan</label>
          <select name="data-plan" id="data-plan" required disabled={!operatorId} value={planId} onChange={handleChange} >
            <option value="">-- SELECT DATAPLANS --</option>
            {planOptions}
          </select>
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input name="phone" maxLength={11} required id="phone" value={phone} onChange={handleChange} placeholder="07022345678" pattern={phoneNumberRegex.source} onBlur={determineNetwork} />
          {state.logoUrl && <img className="small-network-logo" src={state.logoUrl} />}
        </div>
        <button className="form-submit" disabled={state.processing}>{state.processing ? 'Processing...' : 'Proceed'}</button>
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

export function Electricity() {
  const [state, setState] = useState<IState>({
    processing: false,
    token: '',
    units: 0,
    discos: [],
    formInput: {
      operatorId: '',
      meterType: '',
      meterNumber: '',
      amount: ''
    },
    feedback: {
      // disco_desc: '',
      message: '',
      customer: null,
    }
  });
  const [discoInfo, setDiscoInfo] = useState('');
  const [user, setUser] = useOutletContext() as OutletContextType;

  useEffect(fetchDiscos, []);

  const discoOptions = state.discos.map((disco: IDisco) => {
    return <option key={disco.id} value={disco.id}>{disco.name}</option>
  });

  function fetchDiscos() {
    setState(s => ({ ...s, feedback: { ...s.feedback, message: 'Fetching discos...' } }));
    Api.get('transaction/discos')
      .then(res => {
        setState(s => ({ ...s, discos: res.data.discos, feedback: { customer: null, message: '' } }));
      })
      .catch(() => {
        setState(s => ({ ...s, feedback: { ...s.feedback, message: 'Error fetching discos' } }));
      });
  }

  function confirmUser() {
    if (!state.formInput.meterNumber) return;
    if (state.feedback.customer) return;
    setState({ ...state, feedback: { ...state.feedback, message: 'Validating customer info...' } });
    const { meterNumber, operatorId } = state.formInput;
    Api.get(`transaction/customer-validate?bill=electricity&operatorID=${operatorId}&deviceNumber=${meterNumber}`)
      .then(res => {
        const { address, name } = res.data.customer;
        setState(s => ({ ...s, feedback: { message: '', customer: { address, name } } }));
      })
      .catch((err) => {
        setState(s => ({ ...s, feedback: { message: err.response.data.message, customer: null } }));
      });
  }

  function buyElectricity() {
    const { amount, meterNumber, meterType, operatorId } = state.formInput;
    Api.post('transaction/electricity', { amount, operatorId, meterType, meterNumber })
      .then(res => {
        const { message, units, token } = res.data;
        toast.success(message);
        setState(s => ({ ...s, token, units, processing: false, formInput: { amount: '', meterNumber: '', meterType: '', operatorId: '' } }));
        setUser({ ...user, balance: res.data.balance })
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setState(s => ({ ...s, processing: false }));
      });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(s => ({ ...s, processing: true }));
    buyElectricity();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'disco': {
        setDiscoInfo(state.discos.find(disco => disco.id === value)?.desc || '');
        setState(s => ({ ...s, formInput: { ...s.formInput, operatorId: value, meterType: '', meterNumber: '', amount: '' }, token: '', feedback: { message: '', customer: null } }));
        break;
      }
      case 'meterType':
        setState(s => ({ ...s, formInput: { ...s.formInput, meterType: value }, token: '' }));
        break;
      case 'meterNumber':
        setState(s => ({ ...s, formInput: { ...s.formInput, meterNumber: value }, token: '', feedback: { message: '', customer: null } }));
        break;
      case 'amount':
        setState(s => ({ ...s, formInput: { ...s.formInput, amount: value }, token: '' }));
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <h2>Electricity</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="disco">Disco</label>
          <select name="disco" id="disco" required value={state.formInput.operatorId} onChange={handleInputChange}>
            <option value=""> -- SELECT DISCO -- </option>
            {discoOptions}
          </select>
        </div>
        <div>
          <label htmlFor="meter-type">Meter Type</label>
          <select name="meterType" id="meter-type" required value={state.formInput.meterType} onChange={handleInputChange}>
            <option value=""> -- SELECT METER TYPE -- </option>
            <option value="prepaid">Prepaid</option>
            <option value="postpaid">Postpaid</option>
          </select>
        </div>
        <div>
          <label htmlFor="meter-number">Meter Number</label>
          <input type="text" name="meterNumber" id="meter-number" placeholder="Enter customer meter number" required value={state.formInput.meterNumber} onChange={handleInputChange} onBlur={confirmUser} />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input type="number" name="amount" id="amount" placeholder="Enter amount in Naira" required value={state.formInput.amount} onChange={handleInputChange} />
        </div>
        <button className="form-submit" disabled={state.processing}>{state.processing ? 'Processing...' : 'Proceed'}</button>
      </form>

      <div >
        <p className="feedback success">{discoInfo}</p>
        <p className="feedback error">{state.feedback.message}</p>
        {state.feedback.customer && (
          <div className="feedback success">
            <p>Name: {state.feedback.customer.name}</p>
            <p>Address: {state.feedback.customer.address}</p>
            {state.token && (
              <>
                <p>Electricity token: {state.token}</p>
                <p>Units: {state.units}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  interface IState {
    processing: boolean;
    token: string;
    units: number;
    discos: IDisco[];
    formInput: {
      operatorId: string;
      meterType: string;
      meterNumber: string;
      amount: string;
    };
    feedback: {
      // disco_desc: string;
      message: string;
      customer: {
        address: string;
        name: string;
      } | null;
    };
  }
}

export function Tv() {
  return (
    <div style={{ color: 'navy' }}>
      <h2>Television</h2>
      <p>Coming soon... </p>
    </div>
  )
}
