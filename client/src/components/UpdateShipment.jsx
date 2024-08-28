/* eslint-disable react/prop-types */
import { useState } from "react";
import "./Component.css";
const UpdateShipment = ({state,shipToogle,setShiptoogle,fetchProduct}) => {
  const[indexOfProduct,setindexOfProduct] = useState(null);
  const[statusOfShipment,setstatusOfShipment] = useState(null)  
  const {contract} = state
  
  const toggleModal = ()=>{
    shipToogle?setShiptoogle(false):setShiptoogle(true);
}
  const handleUpdate = async(e)=>{
      e.preventDefault();
      let numberOfStatus=0;
      if(statusOfShipment==='Pending') numberOfStatus=0 ;
      else if(statusOfShipment==='Shipped') numberOfStatus=1; 
      else if(statusOfShipment==='Accepted') numberOfStatus=2; 
      else if(statusOfShipment==='Rejected') numberOfStatus=3; 
      else if(statusOfShipment==='Canceled') numberOfStatus=4 ;

      if(indexOfProduct===null||numberOfStatus===null)
      {
        alert("Invalid Input");
        return;
      }
      console.log("IndexOfProduct:",indexOfProduct);
      console.log("StatusOf Shipment:",statusOfShipment);
    try {

      const transaction = await  contract.UpdateShipmentStatus(Number(indexOfProduct),numberOfStatus,{gasLimit:500000});
      await transaction.wait();

      // console.log(typeof(fetchProduct()));

      fetchProduct();
      console.log("Shipment Details updated");

    } catch (error) {
      console.error("Transaction Error:", error.message);
      if (error.data) {
      console.error("Error Data:", error.data);
    }
    }

  }
  return (
    <div className="main-container">

      <div className="modal">

        <div className="modal-content">
        <span className="close" onClick={toggleModal}>&times;</span>
        <form onSubmit={handleUpdate}>
          <input className="inp" type="number" placeholder="ProductId" onChange={(e)=>setindexOfProduct(e.target.value)}/>
          <select name="select" className="inp" id="select" onChange={(e)=>setstatusOfShipment(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Canceled">Canceled</option>
          </select>
          <button className="submit-button" type="submit">Update</button>
        </form>

        </div>

      </div>
      
    </div>
  )
}

export default UpdateShipment