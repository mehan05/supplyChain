import { useState } from "react"

const PlaceOrder = ({state,OrderToogle,setOrderToogle}) => {
  const[productId,setproductId] = useState(0);
  const[quantity,setQuantity] = useState(0);
  const {contract} = state;

  const handlePlaceOrder =async (e)=>{
    e.preventDefault();

    try {
      const transaction = await contract.PlaceOrder(productId,quantity);
      await transaction.wait();
      // fetchProduct();
      alert("Order Placed");
    } catch (error) {
      console.log(error);
      alert("Failed To place order");
    }

  }

  const toggleModal=()=>{
    OrderToogle?setOrderToogle(false):setOrderToogle(true);
  }
  return (
    <div className="main-container">
      <h3>Place Order</h3>

      <div className="modal">
        <div className="modal-content">
        <span className="close" onClick={toggleModal}>&times;</span>
            <form onSubmit={handlePlaceOrder}>
                <input type="number"  className="inp" placeholder="Product_ID"  onChange={(e)=>setproductId(Number(e.target.value))} />
                <input type="number"  className="inp" placeholder="Quantity"  onChange={(e)=>setQuantity(Number(e.target.value))} />
                <button type="submit"  style={{padding:"10px", width:"200px" }}>PlaceOrder</button>
            </form>
        </div>
      </div>
      
    </div>
  )
}

export default PlaceOrder