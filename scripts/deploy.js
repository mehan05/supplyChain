const hre = require('hardhat');
const fs = require('fs');
const path = require('path');
async function main (){
    const [owner,customer1,customer2]  = await hre.ethers.getSigners();
    const Supplychain = await hre.ethers.getContractFactory('SupplyChain');
    const supplychain = await Supplychain.deploy(owner.address);
    await supplychain.waitForDeployment();
    // console.log(supplychain)
    const contAddr = await supplychain.getAddress();
    const filePath  = path.join(__dirname,"contractAddress.json");
     fs.writeFileSync(filePath,JSON.stringify({CONTRACT_ADDRESS:contAddr},null,2));
    console.log(`Contract deployed At:${await supplychain.getAddress()}`)
    
   
}

main().catch((error)=>{
    console.log(error);
    process.exitCode=1
})