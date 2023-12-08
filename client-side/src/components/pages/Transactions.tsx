import { useEffect, useState } from "react";
import Layout from "../Layout";
import Api from "../../api.config";
import Error from "./Error";
import { formatNumber } from "../../utils";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState({ status: 0, statusText: "", goto: "/" });
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    getTransactions();
  }, []);

  function getTransactions() {
    Api.get('/transaction')
      .then(res => {
        setStatus('success');
        setTransactions(res.data.transactions);
      })
      .catch(err => {
        setStatus('error');
        const { status, statusText } = err.response;
        setError(e => ({ ...e, status, statusText, goto: '/' }));
      });
  }

  if (status === 'success') {
    return (
      <Layout>
        <section id="all-transactions">
          <h1>Transactions</h1>
          <hr />
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Description</th>
                <th>Reference</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx: ITransaction, index: number) => (
                <tr key={trx._id}>
                  <td>{index + 1}</td>
                  <td>{formatNumber(+trx.amount).slice(3)}</td>
                  <td>{trx.type}</td>
                  <td>{trx.description}</td>
                  <td>{trx.reference}</td>
                  <td>{new Date(trx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </Layout>
    )
  }

  if (status === 'error') {
    return <Error code={error.status} message={error.statusText} goto={error.goto} />
  }
}

interface ITransaction {
  _id: string;
  amount: string;
  type: string;
  description: string;
  reference: string;
  createdAt: string;
  isCredit: boolean;
}