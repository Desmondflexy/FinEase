import Transaction from "../models/transaction";
import User from "../models/users";
import axios from "axios";
import { phoneNetworks } from "./constants";

// constants from Blochq
const dataCategoryId = 'pctg_ftZLPijqrVsTan5Ag7khQx';
const airtimeCategoryId = 'pctg_xkf8nz3rFLjbooWzppWBG6';
const blochqUrl = 'https://api.blochq.io/v1/bills';


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
  //   console.error(error);
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
  const url = `${blochqUrl}/operators?bill=${bill}`;

  try {
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${process.env.BLOCHQ_SECRET}` } });
    return response.data.data;

  } catch (error: any) {
    console.error(error);
    throw new Error('Error getting operators');
  }
}

export async function getProducts(operatorID: string) {
  const url = `${blochqUrl}/operators/${operatorID}/products?bill=telco`;

  try {
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${process.env.BLOCHQ_SECRET}` } });
    return response.data.data;

  } catch (error: any) {
    console.error(error);
    throw new Error('Error getting products');
  }
}

export async function buyAirtimeBlochq(amount: number, operatorId: string, phone: string) {
  const url = `${blochqUrl}/payment?bill=telco`;
  const data = {
    amount,
    operator_id: operatorId,
    product_id: await getAirtimeId(),
    device_details: {
      "beneficiary_msisdn": phone
    },
  }

  try {
    const response = await axios.post(url, data, { headers: { Authorization: `Bearer ${process.env.BLOCHQ_SECRET}` } });
    return response.data.data;

  } catch (error: any) {
    console.error(error)
    throw new Error('Error buying airtime');
  }

  async function getAirtimeId() {
    const products = await getProducts(operatorId);
    const airtimeProduct = products.find((product: { category: string }) => product.category === airtimeCategoryId);
    return airtimeProduct.id;
  }

}

/**Returns true if phoneNumber matches selected network, otherwise false */
export async function verifyNetwork(phone: string, operatorId: string) {
  const phoneNetwork = phoneNetworks[phone.slice(0, 4)]?.toLowerCase();
  const operators = await getOperators('telco');
  const operator: { name: string } = operators.find((i: { id: string }) => i.id === operatorId);
  const response = {
    isMatch: phoneNetwork?.includes(operator.name.toLowerCase()),
    selectedOperator: operator.name,
    numberOperator: phoneNetwork,
  }
  return response;
}

export async function getDataPlansFromBloc(operatorId: string) {
  try {
    const products = await getProducts(operatorId);
    return products
      .filter((product: { category: string }) => product.category === dataCategoryId)
      .map((product: { id: string; meta: { fee: string; data_expiry: string; data_value: string }; name: string }) => {
        const { id, meta } = product;
        const { fee, data_value } = meta;
        const dataPlanName = `${data_value} for ${getDataExpiry(meta)} at ₦${Number(fee)}`
        return { id, name: dataPlanName, amount: Number(meta.fee) * 100, meta };
      });
  } catch (error) {
    console.error(error);
    throw new Error('Error getting data plans');
  }

  /**To normalize the keys in the meta object. Some keys had extra spaces */
  function getDataExpiry(meta: { [key: string]: string }) {
    // Find the key with 'age' in it, regardless of spaces
    const dataExpiryKey = Object.keys(meta).find(key => key.trim() === 'data_expiry');

    // Return the value if the key is found, otherwise return undefined
    return dataExpiryKey ? meta[dataExpiryKey] : undefined;
  }
}

// export async function buyDataBlochq(amount: number, operatorId: string, phone: string, dataPlanId: string) {
//   const url = `${blochqUrl}/payment?bill=telco`;
//   const data = {
//     amount,
//     operator_id: operatorId,
//     product_id: dataPlanId,
//     device_details: {
//       "beneficiary_msisdn": phone
//     },
//   }

//   try {
//     const response = await axios.post(url, data, { headers: { Authorization: `Bearer ${process.env.BLOCHQ_SECRET}` } });
//     return response.data.data;

//   } catch (error: any) {
//     console.error(error)
//     throw new Error('Error buying airtime');
//   }
// }