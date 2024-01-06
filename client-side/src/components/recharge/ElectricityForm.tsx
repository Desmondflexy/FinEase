import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IDisco, OutletContextType } from "../../types";
import Api from "../../api.config";
import { toast } from "react-toastify";

function ElectricityForm() {
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
  const [discoInfo, setDiscoInfo] = useState('');
  const [user, setUser] = useOutletContext() as OutletContextType;

  useEffect(fetchDiscos, []);

  const discoOptions = state.discos.map((disco: IDisco) => {
    return <option key={disco.id} value={disco.id}>{disco.name}</option>
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
    Api.get(`transaction/customer-validate/${operatorId}?bill=electricity&deviceNumber=${meterNumber}`)
      .then(res => {
        const { address, name } = res.data.customer;
        setState(s => ({ ...s, feedback: { message: '', customer: { address, name } } }));
      })
      .catch((err) => {
        setState(s => ({ ...s, feedback: { message: err.response.data.message, customer: null } }));
      });
  }

  function buyElectricity() {
    const { amount, meterNumber, meterType, operatorId } = state.formInput;
    Api.post('transaction/electricity', { amount, operatorId, meterType, meterNumber })
      .then(res => {
        const { message, units, token } = res.data;
        toast.success(message);
        setState(s => ({ ...s, token, units, processing: false, formInput: { amount: '', meterNumber: '', meterType: '', operatorId: '' } }));
        setUser({ ...user, balance: res.data.balance })
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setState(s => ({ ...s, processing: false }));
      });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(s => ({ ...s, processing: true }));
    buyElectricity();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    switch (name) {
      case 'disco': {
        setDiscoInfo(state.discos.find(disco => disco.id === value)?.desc || '');
        setState(s => ({ ...s, formInput: { ...s.formInput, operatorId: value, meterType: '', meterNumber: '', amount: '' }, token: '', feedback: { message: '', customer: null } }));
        break;
      }
      case 'meterType':
        setState(s => ({ ...s, formInput: { ...s.formInput, meterType: value }, token: '' }));
        break;
      case 'meterNumber':
        setState(s => ({ ...s, formInput: { ...s.formInput, meterNumber: value }, token: '', feedback: { message: '', customer: null } }));
        break;
      case 'amount':
        setState(s => ({ ...s, formInput: { ...s.formInput, amount: value }, token: '' }));
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <h2>Electricity</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <div className="form-floating">
            <select className="form-control" name="disco" id="disco" required value={state.formInput.operatorId} onChange={handleInputChange}>
              <option value=""> -- SELECT DISCO -- </option>
              {discoOptions}
            </select>
            <label htmlFor="disco">Disco</label>
          </div>
        </div>
        <div className="input-group mb-3">
          <div className="form-floating">
            <select className="form-control" name="meterType" id="meter-type" required value={state.formInput.meterType} onChange={handleInputChange}>
              <option value=""> -- SELECT METER TYPE -- </option>
              <option value="prepaid">Prepaid</option>
              <option value="postpaid">Postpaid</option>
            </select>
            <label htmlFor="meter-type">Meter Type</label>
          </div>
        </div>
        <div className="input-group mb-3">
          <div className="form-floating">
          <input className="form-control" type="text" name="meterNumber" id="meter-number" placeholder="Enter customer meter number" required value={state.formInput.meterNumber} onChange={handleInputChange} onBlur={confirmUser} />
          <label htmlFor="meter-number">Meter Number</label>
          </div>
        </div>

        <div className="input-group mb-3">
          <div className="form-floating">
          <input className="form-control" type="number" name="amount" id="amount" placeholder="Enter amount in Naira" required value={state.formInput.amount} onChange={handleInputChange} />
          <label htmlFor="amount">Amount</label>
          </div>
        </div>
        <button className="btn btn-danger w-100" disabled={state.processing}>{state.processing ? 'Processing...' : 'Proceed'}</button>
      </form>

      <div >
        <p className="feedback success">{discoInfo}</p>
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

export default ElectricityForm;