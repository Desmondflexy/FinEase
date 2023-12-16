import { toast } from "react-toastify";
import Api from "../../api.config";
import { useEffect, useState } from "react";
import { phoneNumberRegex } from "../../utils";
import { useOutletContext } from "react-router-dom";
import { IDisco, OutletContextType } from "../../types";

const networkLogo: { [key: string]: string } = {
  'mtn': '/src/assets/images/mtn-logo.png',
  'airtel': '/src/assets/images/airtel-logo.svg',
  'globacom': '/src/assets/images/glo-logo.png',
  '9mobile': '/src/assets/images/9mobile-logo.png'
};

export default function Recharge() {

  const [service, setService] = useState('');

  return (
    <section id="recharge">
      <h1>Recharge</h1>
      <form>
        <label htmlFor="service">What do you want to do?</label>
        <select id="service" value={service} onChange={(e) => setService(e.target.value)}>
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
  const [network, setNetwork] = useState('');
  const [networks, setNetworks] = useState([]);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [user, setUser] = useOutletContext() as OutletContextType

  const options = networks.map((network: { id: string; name: string }) => {
    return <option key={network.id} value={network.id}>{network.name}</option>
  });

  const fetchNetworks = () => {
    Api.get('transaction/networks')
      .then(res => {
        const list = res.data.networks.map((network: { id: string; name: string }) => {
          return { id: network.id, name: network.name };
        });
        setNetworks(list);
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  const buyAirtime = () => {
    Api.post('transaction/airtime', { operatorId: network, amount, phone })
      .then(res => {
        toast.success(res.data.message);
        setProcessing(false);
        setAmount('');
        setPhone('');
        setNetwork('');
        setUser({
          ...user,
          balance: res.data.balance
        })
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setProcessing(false);
      });
  }

  const determineNetwork = () => {
    Api.get(`transaction/phone-network?phone=${phone}`)
      .then(res => {
        const network = res.data.network.toLowerCase() as string;
        setLogoUrl(networkLogo[network]);
      })
      .catch(() => {
        setLogoUrl('');
      });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true)
    buyAirtime();
  }

  useEffect(fetchNetworks, []);

  return (
    <div>
      <h2>Airtime</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="network">Network</label>
          <select required id="network" value={network} onChange={e => setNetwork(e.target.value)}>
            <option value="">-- SELECT NETWORK --</option>
            {options}
          </select>
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input maxLength={11} required id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07022345678" pattern={phoneNumberRegex.source} onBlur={determineNetwork} />
          {logoUrl && <img className="small-network-logo" src={logoUrl} />}
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input min={1} required autoComplete="off" type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="50" />
        </div>
        <button className="form-submit" disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
      </form>
    </div>

  );
}

export function Data() {
  const [operatorId, setOperatorId] = useState('');
  const [networks, setNetworks] = useState([]);
  const [phone, setPhone] = useState('');
  const [planId, setPlanId] = useState('');
  const [plans, setPlans] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [user, setUser] = useOutletContext() as OutletContextType;

  const options = networks.map((network: { id: string; name: string }) => {
    return <option key={network.id} value={network.id}>{network.name}</option>
  });

  const planOptions = plans.map((plan: { id: string; name: string }) => {
    return <option key={plan.id} value={plan.id}>{plan.name}</option>
  });

  const fetchNetworks = () => {
    Api.get('transaction/networks')
      .then(res => {
        const list = res.data.networks.map((network: { id: string; name: string }) => {
          return { id: network.id, name: network.name };
        });
        setNetworks(list);
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  const fetchDataPlans = () => {
    if (operatorId)
      Api.get(`transaction/data-plans?operatorId=${operatorId}`)
        .then(res => {
          setPlans(res.data.dataPlans);
        })
        .catch(err => {
          console.log(err.response);
        })
  };

  const determineNetwork = () => {
    Api.get(`transaction/phone-network?phone=${phone}`)
      .then(res => {
        const network = res.data.network.toLowerCase() as string;
        setLogoUrl(networkLogo[network]);
      })
      .catch(() => {
        setLogoUrl('');
      })
  };

  const buyData = () => {
    const data = {
      operatorId,
      dataPlanId: planId,
      phone,
    };

    Api.post('transaction/buy-data', data)
      .then(res => {
        toast.success(res.data.message);
        setPlanId('');
        setPhone('');
        setOperatorId('');
        setProcessing(false);
        setUser({
          ...user,
          balance: res.data.balance
        })
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setProcessing(false);
      });
  }

  useEffect(fetchNetworks, []);
  useEffect(fetchDataPlans, [operatorId]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProcessing(true);
    buyData();
  }

  function handleNetworkChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setOperatorId(e.target.value);
    setPlanId('');
  }

  return (
    <div>
      <h2>Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="network">Network</label>
          <select required id="network" value={operatorId} onChange={handleNetworkChange}>
            <option value="">-- SELECT NETWORK --</option>
            {options}
          </select>
        </div>
        <div>
          <label htmlFor="data-plans">Data Plan</label>
          <select id="data-plans" required disabled={!operatorId} value={planId} onChange={e => setPlanId(e.target.value)} >
            <option value="">-- SELECT DATAPLANS --</option>
            {planOptions}
          </select>
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input maxLength={11} required id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07022345678" pattern={phoneNumberRegex.source} onBlur={determineNetwork} />
          {logoUrl && <img className="small-network-logo" src={logoUrl} />}
        </div>
        <button className="form-submit" disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
      </form>
    </div>

  )
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
      message: '',
      customer: null,
    }
  });

  useEffect(fetchDiscos, []);

  const discoOptions = state.discos.map((disco: IDisco) => {
    return <option key={disco.id} value={disco.id}>{disco.desc} ({disco.name})</option>
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
        setState({ ...state, feedback: { message: '', customer: { address, name } } });
      })
      .catch((err) => {
        setState({ ...state, feedback: { message: err.response.data.message, customer: null } });
      });
  }

  function buyElectricity() {
    const { amount, meterNumber, meterType, operatorId } = state.formInput;
    Api.post('transaction/electricity', { amount, operatorId, meterType, meterNumber })
      .then(res => {
        const { message, units, token } = res.data;
        toast.success(message);
        setState({
          ...state,
          token,
          units,
          processing: false,
          formInput: {
            ...state.formInput,
            amount: '',
            meterNumber: '',
            meterType: '',
            operatorId: ''
          }
        })
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setState({ ...state, processing: false });
      });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ ...state, processing: true });
    buyElectricity();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'disco':
        setState({
          ...state,
          formInput: { ...state.formInput, operatorId: value, meterType: '', meterNumber: '', amount: '' },
          token: '',
          feedback: { ...state.feedback, customer: null }
        });
        break;
      case 'meterType':
        setState({ ...state, formInput: { ...state.formInput, meterType: value }, token: '' });
        break;
      case 'meterNumber':
        setState({
          ...state,
          formInput: { ...state.formInput, meterNumber: value }, token: '',
          feedback: { ...state.feedback, customer: null }
        });
        break;
      case 'amount':
        setState({ ...state, formInput: { ...state.formInput, amount: value }, token: '' });
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <h2 style={{ color: "green" }}>Electricity</h2>
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
