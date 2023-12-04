import { toast } from "react-toastify";
import Api from "../../api.config";
import Layout from "../Layout";
import { useEffect, useState } from "react";
import { phoneNumberRegex } from "../../utils";

const networkLogo: { [key: string]: string } = {
  'mtn': 'images/mtn-logo.png',
  'airtel': 'images/airtel-logo.svg',
  'globacom': 'images/glo-logo.png',
  '9mobile': 'images/9mobile-logo.png'
}

export default function Recharge() {

  const [service, setService] = useState('');

  return (
    <Layout>
      <div id="recharge">
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
      </div>
    </Layout>
  )
}

export function Airtime() {
  const [network, setNetwork] = useState('');
  const [networks, setNetworks] = useState([]);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

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
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setProcessing(false)
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
  }

  const fetchDataPlans = () => {
    if (operatorId)
      Api.get(`transaction/data-plans?operatorId=${operatorId}`)
        .then(res => {
          setPlans(res.data.dataPlans);
        })
        .catch(err => {
          console.log(err.response);
        })
  }

  const determineNetwork = () => {
    Api.get(`transaction/phone-network?phone=${phone}`)
      .then(res => {
        const network = res.data.network.toLowerCase() as string;
        setLogoUrl(networkLogo[network]);
      })
      .catch(() => {
        setLogoUrl('');
      })
  }

  useEffect(fetchNetworks, []);
  useEffect(fetchDataPlans, [operatorId]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      const data = {
        operatorId,
        planId,
        phone,
      }
      console.log(data);
      setProcessing(false);
      toast.success('Data bought successfully');
    }, 1500);
  }

  function handleNetworkChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setOperatorId(e.target.value);
    setPlanId('');
  }

  function handlePlanChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPlanId(e.target.value);
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
          <select id="data-plans" required disabled={!operatorId} value={planId} onChange={handlePlanChange} >
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
  return (
    <h2 style={{ color: "green" }}>Electricity</h2>
  )
}

export function Tv() {
  return (
    <h2 style={{ color: "cyan" }}>Tv</h2>
  )
}