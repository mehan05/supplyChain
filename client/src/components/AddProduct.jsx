/* eslint-disable react/prop-types */
import { ethers } from "ethers";
import { useState } from "react"
import "./Component.css";
const AddProduct = ({state,setToogle,toogle,setProductDetails}) => {
  const {provider,contract,signer} = state;
  const[description,setDescription] = useState('')
  const[price,setPrice] = useState('')
  const[temperature,setTemperature] = useState('')
  const[manufacturedDate,setmanufacturedDate] = useState('')
  const[expiryDate,setexpiryDate] = useState('')
  const[quantity,setQuantity] = useState('')

  const toggleModal = ()=>{
      toogle?setToogle(false):setToogle(true)
  }

  const handleAddProduct = async(e)=>{
    e.preventDefault();
    if(!description||!price||!temperature||!manufacturedDate||!expiryDate||!quantity)
    {
      alert("Fill all the fields");
      return;
    }
    try {
      
      const Parseprice = ethers.utils.parseEther(price);
      const UNIXManufactureDate = Math.floor(new Date(manufacturedDate).setUTCHours(0,0,0,0)/1000);
      const UNIXExpiryDate = Math.floor(new Date(expiryDate).setUTCHours(0,0,0,0)/1000);
      console.log("button Clickedd")
      console.log("Contract:", contract);  
  
      if (!contract) {
        console.log("Contract is not initialized.");
        return;
      }

      const transaction = await contract.addProductDetails(description,Parseprice,temperature,UNIXManufactureDate,UNIXExpiryDate,quantity);
      console.log("Transaction sent:", transaction);
      await transaction.wait();
      window.location.reload();
    

    } catch (error) {
      console.log(error.message);
    }

  }
  return (
    <div className="main-container">
        <h3>Add Product</h3>
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <form onSubmit={handleAddProduct}>
              <input type="text" className="inp" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
              <input type="number" className="inp" placeholder="Price in ETH" onChange={(e) => setPrice(e.target.value)} />
              <input type="number" className="inp" placeholder="Temperature" onChange={(e) => setTemperature(e.target.value)} />
              <input type="date" className="inp" placeholder="Manufacture Date" onChange={(e) => setmanufacturedDate(e.target.value)} />
              <input type="date" className="inp" placeholder="Expiry Date" onChange={(e) => setexpiryDate(e.target.value)} />
              <input type="number" className="inp" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
              <button className="submit-button" type="submit">Add Product</button>
            </form>
          </div>
        </div>


    </div>
  )
}

export default AddProduct