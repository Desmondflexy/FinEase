import { toast } from "react-toastify";
import Api from "../../api.config";
import Layout from "../Layout";
import { useEffect, useState } from "react";

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
            <option value="airtime">Airtime</option>
            <option value="data">Data</option>
            <option value="electricity">Electricity</option>
            <option value="tv">Tv</option>
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


  useEffect(() => {
    fetchNetworks();
  }, [])

  const options = networks.map((network: { id: string; name: string }) => {
    return <option key={network.id} value={network.id}>{network.name}</option>
  });


  function fetchNetworks() {
    Api.get('transaction/networks')
      .then(res => {
        const list = res.data.networks.map((network: { id: string; name: string }) => {
          return { id: network.id, name: network.name };
        });
        setNetworks(list);
      })
      .catch(err => {
        console.log(err.response);
      })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProcessing(true)
    buyAirtime();
  }

  function buyAirtime() {
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

  return (
    <div>
      <h2 style={{ color: 'red' }}>Airtime</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="network">Network</label>
        <select id="network" value={network} onChange={e => setNetwork(e.target.value)}>
          <option value="">--select--</option>
          {options}
        </select>
        <label htmlFor="phone">Phone Number</label>
        <input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="phone number" />
        <label htmlFor="amount">Amount</label>
        <input autoComplete="off" type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="amount" />
        <button disabled={processing}>{processing ? 'Processing...' : 'Proceed'}</button>
      </form>
    </div>

  )
}

export function Data() {
  return (
    <h2 style={{ color: 'blue' }}>Data</h2>
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