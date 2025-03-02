import { useState, useEffect } from "react";
import { apiService } from "../../api.service";
import { formatDateTime, formatNumber, toastError } from "../../utils/helpers";
import { toast } from "react-toastify";

export default function Receipts() {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    function fetchTransactions() {
        apiService.fetchUserBillTransactions(1, 1000).then(res => {
            setTransactions(res.data.transactions)
        }).catch(err => {
            toastError(err, toast);
        });
    }

    function downloadReceipt(id: number) {
        apiService.generateReceipt(id).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = `receipt-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch((error) => {
            toastError(error, toast);
        });
    }

    const receiptTableRows = transactions.map((trx, index) => (
        <tr key={trx.id}>
            <td>{index + 1}</td>
            <td>{trx.description}</td>
            <td><button onClick={() => downloadReceipt(trx.id)}>Download</button></td>
            <td>{formatNumber(+trx.amount).slice(3)}</td>
            <td>{formatDateTime(trx.createdAt)}</td>
        </tr>
    ));

    return (
        <div>
            <h1>Bill Receipts</h1>
            <hr />
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Description</th>
                            <th>
                                Download
                            </th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receiptTableRows}
                    </tbody>
                </table>
            </div>
        </div>
    )
}