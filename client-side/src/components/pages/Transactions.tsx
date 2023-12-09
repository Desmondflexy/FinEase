import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import Api from "../../api.config";
import Error from "./Error";
import { formatDateTime, formatNumber } from "../../utils";

export default function Transactions() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [error, setError] = useState({ status: 0, statusText: "", goto: "/" });
  const [status, setStatus] = useState('loading');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(transactions);

  useEffect(getTransactions, []);

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

  useEffect(() => {
    setSearchResults(transactions);
  }, [transactions]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchTerm(text);
    setSearchResults(transactions.filter(trx => {
      const searchPool = [
        trx.amount,
        trx.type,
        trx.description.toLowerCase(),
        trx.reference.toLowerCase(),
      ];
      return searchPool.some(item => item.toString().includes(text.trim()));
    }));
  };

  if (status === 'success') {
    return (
      <Layout>
        <section id="all-transactions">
          <h1>Transactions</h1>
          <form className="searchbox">
            <input value={searchTerm} onChange={handleSearch} type="search" placeholder="Search transaction..." />
          </form>
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
              {searchResults.map((trx: ITransaction, index: number) => (
                <tr key={trx._id}>
                  <td>{index + 1}</td>
                  <td>{formatNumber(+trx.amount).slice(3)}</td>
                  <td>{trx.type}</td>
                  <td>{trx.description}</td>
                  <td>{trx.reference}</td>
                  <td>{formatDateTime(trx.createdAt)}</td>
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
  amount: number;
  type: string;
  description: string;
  reference: string;
  createdAt: string;
}