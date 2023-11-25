import Api from "../../api.config";
import Layout from "../Layout";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState({
    email: '',
  });
  const [balance, setBalance] = useState('NGN ------');
  const [fundAmount, setFundAmount] = useState('');

  useEffect(() => {
    Api.get('/account')
      .then(res => {
        const {email} = res.data.user;
        setUser(u => ({ ...u, email }));
      })
      .catch(err => {
        console.log(err.response.data)
      })
  }, []);

  useEffect(() => {
    Api.get('/account/balance')
      .then(res => {
        setBalance(formatNumber(res.data.balance));
      })
      .catch(err => console.log(err.response.data))
  })

  function payWithPaystack(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const handler = PaystackPop.setup({
      key: import.meta.env.VITE_APP_PAYSTACK_PUBLIC,
      email: user.email,
      amount: Number(fundAmount) * 100,
      onClose: () => {
        console.log('window closed!');
      },
      callback: function (response: { reference: string }) {
        // post trxref to server to verify transaction before giving value
        const {reference} = response;
        Api.post('/transaction/fund-wallet', {reference})
          .then(res => {
            setBalance(formatNumber(res.data.balance))
          })
          .catch(err => {
            console.log(err.response.data);
          });

        setFundAmount('');
      }
    });

    handler.openIframe();
  }

  return (
    <div>
      <Layout>
        <h1>Dashboard</h1>
        <h2>Wallet Balance: {balance}</h2>

        <form className="fund-wallet" onSubmit={payWithPaystack}>
          <fieldset>
            <legend>Add Money to Wallet</legend>
            <input autoComplete="off" type="number" min={100} name="amount" id="amount" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} required />
            <button>Proceed</button>
          </fieldset>
        </form>
      </Layout>
    </div>
  )
}


/** Formats num from kobo to naira. */
function formatNumber(num: number) {
  num /= 100;
  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);

  return formattedNumber;
}

declare const PaystackPop: {
  setup: (options: {
    key: string;
    email: string;
    amount: number;
    onClose: () => void;
    callback: (response: { reference: string }) => void;
    ref?: string;
  }) => {
    openIframe: () => void;
  };
};