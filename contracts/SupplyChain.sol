// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
contract SupplyChain{
    address immutable public owner;
    uint256 public randomNumber;
    uint public  count = 0;
    constructor(address _owner)
    {
        owner=_owner;
    }
    //enums
    enum Status{
        Pending,
        Shipped,
        Accepted,
        Rejected,
        Canceled
    }
    Status public status;
    //events
    event ProductAdded(
        uint256 indexed productid,
         string decription,
        uint256 price,
        uint256 temperature,
        uint256 manufactureDate,
        uint256 expiryDate,
        uint256 quantity,
        bool IsSoledOut
    );
    //modifier
    modifier OnlyOwner(){
        require(msg.sender==owner,"Not a owner");
        _;
    }
    //struct
    struct ProductDetails{
        uint productId;
        string decription;
        uint256 price;
        uint256 temperature;
        uint256 manufactureDate;
        uint256 expiryDate;
        uint256 quantity;
        bool IsSoledOut;
    }
    ProductDetails[] public productDetails;

    struct ProductsOrdered {
        address buyer;
        uint productId;
        string decription;
        uint256 price;
        uint256 temperature;
        uint256 manufactureDate;
        uint256 expiryDate;
        uint256 quantity;
    }
    ProductsOrdered[] public productsOrdered;

    struct ProductShipment{
        address buyer;
        uint256 productId;
        Status status;
    }
    ProductShipment[] public productShipment;
    //mapping
    mapping(uint256=>bool) public IsSoledOut;
    function addProductDetails(string memory _description, uint256 _price, uint256 _temperature, uint256 _manufactureDate,uint256 _expiryDate,uint256 _quantity) public 
    {

            productDetails.push(ProductDetails({productId:count++,decription:_description,price:_price,temperature:_temperature,manufactureDate:_manufactureDate,expiryDate:_expiryDate,quantity:_quantity,IsSoledOut:false}));
            
            emit ProductAdded(randomNumber,_description,_price,_temperature,_manufactureDate,_expiryDate,_quantity,false);
    }

    function ShowcaseProduct(uint256 index) public view  returns(ProductDetails memory)
    {
        return productDetails[index];
    }

    function PlaceOrder(uint256 _index, uint256 _quantity) public 
    {
            require(productDetails[_index].quantity>=_quantity,"Low Stock in Storage");
            require(!productDetails[_index].IsSoledOut,"Product Sold out");
            productDetails[_index].quantity-=_quantity;
            if(productDetails[_index].quantity==0)
            {
                productDetails[_index].IsSoledOut=true; 
            }
            productsOrdered.push( ProductsOrdered({buyer:msg.sender,productId: productDetails[_index].productId, decription: productDetails[_index].decription, price: productDetails[_index].price, temperature: productDetails[_index].temperature, manufactureDate: productDetails[_index].manufactureDate, expiryDate: productDetails[_index].expiryDate, quantity: _quantity}));
    }

    function UpdateShipmentStatus(uint256 _index,Status _status) public OnlyOwner
    {
            productShipment.push(ProductShipment({buyer:productsOrdered[_index].buyer,productId:_index,status:_status}));

    }

    function getAllProducts() public view returns(ProductDetails[] memory)
    {
        return productDetails;
    }

    function getShipmentDetails() public view returns(ProductShipment[] memory)
    {
        return productShipment;
    }



}