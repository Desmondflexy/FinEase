import Transaction from "../models/transaction";
import User from "../models/users";
import axios from "axios";
import phoneNetworksData from "../phoneNumbers.json";

export async function generateAcctNo() {
  let acctNo = Math.floor(Math.random() * 10000000000);
  let user = await User.findOne({ acctNo });
  while (user) {
    acctNo = Math.floor(Math.random() * 10000000000);
    user = await User.findOne({ acctNo });
  }
  return String(acctNo);
}

export async function generateReference(prefix: string) {
  let ref = Math.floor(Math.random() * 10000000000);
  let trx = await Transaction.findOne({ reference: prefix + ref });
  while (trx) {
    ref = Math.floor(Math.random() * 10000000000);
    trx = await Transaction.findOne({ reference: prefix + ref });
  }
  return prefix + ref;
}

export async function calcBalance(user: string) {
  try {
    const transactions = await Transaction.find({ user });
    const balance = transactions.reduce((acc, curr) => {
      if (curr.type === 'credit') return acc + curr.amount;
      return acc - curr.amount;
    }, 0);
    return balance;
  } catch (error) {
    throw new Error("Error getting balance");
  }
}

export async function runCommand() {
  // try {
  //   const trxs = await Transaction.find();
  //   for (const trx of trxs) {
  //     // if (trx.description && trx.type !== 'fund wallet') continue;
  //     await trx.deleteOne();
  //   }
  // }
  // catch (error: any) {
  //   console.log(error);
  // }
}


export async function verifyTransaction(ref: string) {
  const headers = {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
  }
  const url = `https://api.paystack.co/transaction/verify/${ref}`;
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  }
  catch {
    throw new Error("Error verifying transaction");
  }
}

/**Used during user registration to check if the value of a given field has not been taken. */
export async function isFieldAvailable(field: string, value: string) {
  const found = Boolean(await User.findOne({ [field]: value }));
  return !found;
}

/**Returns a list of operators of bill (telco and electricity) */
export async function getOperators(bill: string) {
  const headers = { Authorization: `Bearer ${process.env.BLOCHQ_SECRET}` };
  const url = `https://api.blochq.io/v1/bills/operators?bill=${bill}`;

  try {
    const response = await axios.get(url, { headers });
    return response.data.data;

  } catch (error: any) {
    console.log(error);
    throw new Error('Error getting operators');
  }
}

export async function getProducts(operatorID: string) {
  const headers = { Authorization: `Bearer ${process.env.BLOCHQ_SECRET}` };
  const url = `https://api.blochq.io/v1/bills/operators/${operatorID}/products?bill=telco`;

  try {
    const response = await axios.get(url, { headers });
    return response.data.data;

  } catch (error: any) {
    console.log(error);
    throw new Error('Error getting products');
  }
}

export async function buyAirtimeBlochq(amount: number, operatorId: string, phone: string) {
  const url = 'https://api.blochq.io/v1/bills/payment?bill=telco';
  const headers = { Authorization: `Bearer ${process.env.BLOCHQ_SECRET}` };
  const data = {
    amount,
    operator_id: operatorId,
    product_id: await getAirtimeId(),
    device_details: {
      "beneficiary_msisdn": phone
    },
  }

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.data;

  } catch (error: any) {
    console.log(error)
    throw new Error('Error buying airtime');
  }

  async function getAirtimeId() {
    const products = await getProducts(operatorId);
    const airtimeProduct = products.find((product: { category: string }) => product.category === 'pctg_xkf8nz3rFLjbooWzppWBG6');
    return airtimeProduct.id;
  }

}

/**Returns true if phoneNumber matches selected network, otherwise false */
export async function verifyNetwork(phone: string, operatorId: string) {
  const phoneNetworks: IPhoneNetworks = phoneNetworksData;
  const phoneNetwork = phoneNetworks[phone.slice(0, 4)].toLowerCase();
  const operators = await getOperators('telco');
  const operator: { name: string } = operators.find((i: { id: string }) => i.id === operatorId);
  return phoneNetwork.includes(operator.name.toLowerCase())
}

interface IPhoneNetworks {
  [key: string]: string
}