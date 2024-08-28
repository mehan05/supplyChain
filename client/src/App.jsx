import { useEffect, useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
import contractAddress from "../../scripts/contractAddress.json";
import abi from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import AddProduct from './components/AddProduct';
import UpdateShipment from './components/UpdateShipment';
import PlaceOrder from './components/PlaceOrder';

function App() {
  const [account, setAccount] = useState('');
  const [owner, setOwner] = useState('');
  const [OrderToogle, setOrderToogle] = useState(false);
  const [toogle, setToogle] = useState(false);
  const [displayToogle, setdisplayToogle] = useState(false);
  const [shipToogle, setShiptoogle] = useState(false);
  const [shipmentStatus, setshipmentStatus] = useState([]);
  const [ProductDetails, setProductDetails] = useState([]);
  const [state, setState] = useState({
    provider: null,
    contract: null,
    signer: null
  });

  const enumObject = {
    "0": "Pending",
    "1": "Shipped",
    "2": "Accepted",
    "3": "Rejected",
    "4": "Canceled"
  };

  const contractAddr = contractAddress.CONTRACT_ADDRESS || "";

  const connectMetamask = async () => {
    const ABI = abi.abi;
    const ethereum = window.ethereum;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddr, ABI, signer);

    setState({ provider, contract, signer });

    if (!ethereum) {
      alert("Install Metamask");
      return;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts"
    });
    const Currentaccount = ethers.utils.getAddress(accounts[0]);
    setAccount(Currentaccount);

    const GettingOwner = await contract.owner();
    setOwner(GettingOwner);
    setdisplayToogle(Currentaccount === GettingOwner);

    ethereum.on("accountsChanged", async () => {
      window.location.reload();
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });
      const newaccount = ethers.utils.getAddress(accounts[0]);
      setAccount(newaccount);
    });

    if (account) console.log("Account Connected:", account);
  };

  useEffect(() => {
    connectMetamask();
  }, []);

  useEffect(() => {
    if (account) setdisplayToogle(owner === account);
  }, [account]);

  const fetchProduct = async () => {
    if (state.contract) {
        try {
            const datas = await state.contract.getAllProducts();
            const shipmentDetails = await state.contract.getShipmentDetails();

            const gettingShip = shipmentDetails.map((item)=>({
              productId:item.productId.toString(),
              status: item.status
            }))

            setshipmentStatus(gettingShip);
           

            setProductDetails(datas);
        } catch (error) {
            console.log(error);
        }
    }
};

  useEffect(() => {
    fetchProduct();
  }, [state.contract]);

  const handleAddprop = () => {
    setToogle(!toogle);
  };

  const handleShipProp = () => {
    setShiptoogle(!shipToogle);
  };

  const handleOrderToogle = () => {
    setOrderToogle(!OrderToogle);
  };

  return (
    <>
      {displayToogle ?
        <div className='body-container'>
          <header className='header'>
            <h3 className='heading'>
              SUPPLYCHAIN MANAGEMENT
            </h3>
            <button className='connect-button' onClick={connectMetamask}>
              {account ? account.toString() : 'Connect'}
            </button>
          </header>

          <div className='body'>
            <div className="buttons">
              <div className='add-product-container'>
                <button className='add-product-button' onClick={handleAddprop}>
                  Add Product
                </button>
              </div>

              <div className='place-order-container'>
                <button className='place-order-button' onClick={handleOrderToogle}>
                  Place Order
                </button>
              </div>

              <div className="update-shipment-container">
                <button className='update-shipment-button' onClick={handleShipProp}>
                  Update Shipment
                </button>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product_ID</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Temperature</th>
                    <th>manufactureDate</th>
                    <th>ExpiryDate</th>
                    <th>Quantity</th>
                    <th>IsSoldOut</th>
                  </tr>
                </thead>
                <tbody>
                  {ProductDetails.map((item, index) => {
                  
                   return( <tr key={index}>
                      <td>{item.productId.toString()}</td>
                      <td>{ethers.utils.formatEther(item.price)}</td>
                      <td>{item.decription.toString()}</td>
                      <td>{new Date(item.manufactureDate * 1000).toLocaleDateString()}</td>
                      <td>{new Date(item.expiryDate * 1000).toLocaleDateString()}</td>
                      <td>{new Date(item.expiryDate * 1000).toLocaleDateString()}</td>
                      <td>{item.quantity.toString()}</td>
                      <td>{item.IsSoledOut ? "true" : "false"}</td>
                    </tr>
                    )})}
                </tbody>
              </table>
            </div>
          </div>

          {toogle &&
            <AddProduct state={state} setToogle={setToogle} toogle={toogle} setProductDetails={setProductDetails} />
          }

          {shipToogle &&
            <UpdateShipment state={state} shipToogle={shipToogle} setShiptoogle={setShiptoogle} fetchProduct={fetchProduct} />
          }

          {OrderToogle &&
            <PlaceOrder state={state} OrderToogle={OrderToogle} setOrderToogle={setOrderToogle} />
          }
        </div>
        :
        <div className='body-container'>
          <header className='header'>
            <h3 className='heading'>
              SUPPLYCHAIN MANAGEMENT
            </h3>
            <button className='connect-button' onClick={connectMetamask}>
              {account ? account.toString() : 'Connect'}
            </button>
          </header>

          <div className='body'>
            <div className="buttons">
              <div className='place-order-container'>
                <button className='place-order-button' onClick={handleOrderToogle}>
                  Place Order
                </button>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product_ID</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Temperature</th>
                    <th>manufactureDate</th>
                    <th>ExpiryDate</th>
                    <th>Quantity</th>
                    <th>IsSoldOut</th>
                    <th>Shipment_Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ProductDetails.map((item, index) => {
                      const shipment = shipmentStatus.find(s=>s.productId===item.productId.toString());
                    const statuses = shipment? enumObject[shipment.status.toString()]:"Not Shipped"
                   return( <tr key={index}>
                      <td>{item.productId.toString()}</td>
                      <td>{ethers.utils.formatEther(item.price)}</td>
                      <td>{item.decription.toString()}</td>
                      <td>{new Date(item.manufactureDate * 1000).toLocaleDateString()}</td>
                      <td>{new Date(item.expiryDate * 1000).toLocaleDateString()}</td>
                      <td>{new Date(item.expiryDate * 1000).toLocaleDateString()}</td>
                      <td>{item.quantity.toString()}</td>
                      <td>{item.IsSoledOut ? "true" : "false"}</td>
                      <td>{statuses}</td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>

          {OrderToogle &&
            <PlaceOrder state={state} OrderToogle={OrderToogle} setOrderToogle={setOrderToogle} />
          }
        </div>
      }
    </>
  );
}

export default App;
