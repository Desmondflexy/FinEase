import Transaction from "../models/transaction";
import User from "../models/users";
import axios from "axios";
import { phoneNetworks } from "./constants";

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


/**The Blochq Api class */
class Blochq {
  dataCategoryId: string;
  airtimeCategoryId: string;
  baseUrl: string;

  constructor() {
    this.dataCategoryId = 'pctg_ftZLPijqrVsTan5Ag7khQx';
    this.airtimeCategoryId = 'pctg_xkf8nz3rFLjbooWzppWBG6';
    this.baseUrl = 'https://api.blochq.io/v1/bills';
  }

  async getOperators(bill: string) {
    const url = `${this.baseUrl}/operators?bill=${bill}`;

    try {
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${process.env.BLOCHQ_SECRET}` } });
      return response.data.data;

    } catch (error: any) {
      console.error(error);
      throw new Error('Error getting operators');
    }
  }

  async getProducts(operatorID: string) {
    const url = `${this.baseUrl}/operators/${operatorID}/products?bill=telco`;

    try {
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${process.env.BLOCHQ_SECRET}` } });
      return response.data.data;

    } catch (error: any) {
      console.error(error);
      throw new Error('Error getting products');
    }
  }

  async getDataPlans(operatorId: string) {
    try {
      const products = await this.getProducts(operatorId);
      return products
        .filter((product: { category: string }) => product.category === this.dataCategoryId)
        .map((product: { id: string; meta: { fee: string; data_expiry: string; data_value: string }; name: string }) => {
          const { id, meta } = product;
          const { fee, data_value } = meta;
          const dataPlanName = `${data_value} for ${repairKey(meta, 'data_expiry')} at ₦${Number(fee)}`
          return { id, name: dataPlanName, amount: Number(meta.fee) * 100, meta };
        });

    } catch (error) {
      console.error(error);
      throw new Error('Error getting data plans');
    }

    /**Remove extra spaces from an object key */
    function repairKey(obj: { [key: string]: string }, normalKey: string) {
      const trimmedKey = Object.keys(obj).find(key => key.trim() === normalKey);
      return trimmedKey ? obj[trimmedKey] : undefined;
    }
  }

  /**Returns true if phoneNumber matches selected network, otherwise false */
  async verifyNetwork(phone: string, operatorId: string) {
    const phoneNetwork = phoneNetworks[phone.slice(0, 4)]?.toLowerCase();
    const operators = await this.getOperators('telco');
    const operator: { name: string } = operators.find((i: { id: string }) => i.id === operatorId);
    const response = {
      isMatch: phoneNetwork?.includes(operator.name.toLowerCase()),
      selectedOperator: operator.name,
      numberOperator: phoneNetwork,
    }
    return response;
  }

  async buyAirtime(amount: number, operatorId: string, phone: string) {
    const url = `${this.baseUrl}/payment?bill=telco`;

    const getAirtimeId = async () => {
      const products = await this.getProducts(operatorId);
      const airtimeProduct = products.find((product: { category: string }) => product.category === this.airtimeCategoryId);
      return airtimeProduct.id;
    }

    const data = {
      amount,
      operator_id: operatorId,
      product_id: await getAirtimeId(),
      device_details: { "beneficiary_msisdn": phone },
    }

    try {
      const response = await axios.post(url, data, { headers: { Authorization: `Bearer ${process.env.BLOCHQ_SECRET}` } });
      return response.data.data;

    } catch (error: any) {
      console.error(error)
      throw new Error('Error buying airtime');
    }
  }

  async buyData(dataPlanId: string, amount: number, operatorId: string, phone: string) {
    console.log('buying data', dataPlanId, amount, operatorId, phone);

    return { meta_data: await this.getDataPlanMeta(dataPlanId, operatorId) };
  }

  async getDataPlanMeta(dataPlanId: string, operatorId: string) {
    const products = await this.getProducts(operatorId);
    const targetPlan = products.find((product: { id: string }) => product.id === dataPlanId);
    const { data_value, fee } = targetPlan.meta;
    const operators = await this.getOperators('telco');
    const operatorName = operators.find((i: { id: string }) => i.id === operatorId).name;
    return { data_value, amount: fee * 100, operator_name: operatorName }
  }
}

export const blocApi = new Blochq();