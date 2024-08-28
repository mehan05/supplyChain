const { expect } = require("chai");
const { ethers } = require('hardhat');
const token = (n)=>{
    return ethers.parseUnits(n.toString(),'ether');
}
describe("SupplyChain Management", () => {
    let owner, supplyChain;
    let customer1, customer2, customer3;

    beforeEach(async () => {
        [owner, customer1, customer2, customer3] = await ethers.getSigners();

        supplyChain = await ethers.getContractFactory('SupplyChain');
        supplyChain = await supplyChain.deploy(owner.address);
        await supplyChain.waitForDeployment();
    });

    it("check Owner", async () => {
        const result = await supplyChain.owner();
        expect(result).to.be.equal(owner.address); 
    });

    it("Adding Product", async () => {
        const tx = await supplyChain.addProductDetails("Product_1", token(12), 21, 120824, 200824, 10);
    
        const productFromStruct = await supplyChain.ShowcaseProduct(0);
        // console.log(productFromStruct);
        const [
            id,
            description,
            price,
            temperature,
            manufactureDate,
            expiryDate,
            quantity,
            isSoledOut
        ] = await supplyChain.ShowcaseProduct(0);
       console.log(id)
        expect(description).to.equal("Product_1");
        expect(price).to.equal(token(12));
        expect(temperature).to.equal(21);
        expect(manufactureDate).to.equal(120824);
        expect(expiryDate).to.equal(200824);
        expect(quantity).to.equal(10);
        expect(isSoledOut).to.equal(false);
    });
    it("Should return correct product details", async function () {
        const description = "Product 2";
        const price = token(2);
        const temperature = 30;
        const manufactureDate = 1621000000;
        const expiryDate = 1641000000;
        const quantity = 20;
    
        await supplyChain.addProductDetails(description, token(price), temperature, manufactureDate, expiryDate, quantity);
        const productDetails = await supplyChain.ShowcaseProduct(0);
    
        expect(productDetails.decription).to.equal(description);
        expect(productDetails.price).to.equal(token(price));
        expect(productDetails.temperature).to.equal(temperature);
        expect(productDetails.manufactureDate).to.equal(manufactureDate);
        expect(productDetails.expiryDate).to.equal(expiryDate);
        expect(productDetails.quantity).to.equal(quantity);
        expect(productDetails.IsSoledOut).to.equal(false);
      });
    

    it("Checking PlaceOrder",async()=>{

        let tx = await supplyChain.addProductDetails("Product_1", token(12), 21, 120824, 200824, 10);
        let transaction = await supplyChain.connect(customer1).PlaceOrder(0,5);

        transaction = await supplyChain.productDetails(0);
        expect(transaction.quantity).to.equal(5);
        expect(transaction.IsSoledOut).to.equal(false);

        tx = await supplyChain.addProductDetails("Product_1", token(12), 21, 120824, 200824, 10);
        transaction = await supplyChain.connect(customer1).PlaceOrder(1,10);
        transaction = await supplyChain.productDetails(1);
        expect(transaction.IsSoledOut).to.equal(true);
    })

    it("Testing Shipment Status",async()=>{

        let tx = await supplyChain.addProductDetails("Product_1", token(12), 21, 120824, 200824, 10);
        let transaction = await supplyChain.connect(customer1).PlaceOrder(0,5);

        transaction = await supplyChain.productDetails(0);
        expect(transaction.quantity).to.equal(5);
        expect(transaction.IsSoledOut).to.equal(false);

        transaction = await supplyChain.UpdateShipmentStatus(0,1);//shipped

        transaction = await supplyChain.productShipment(0);
        
        expect(transaction.status).to.be.equal(1);
        expect(transaction.buyer).to.be.equal(customer1.address);
        expect(transaction.productId).to.be.equal(0);

    })

});
