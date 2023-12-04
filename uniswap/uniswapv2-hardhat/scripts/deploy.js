// 定义一个异步函数 main，用于部署智能合约
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contract address: ${deployer.address}`);
  
  async function deployFactory(deployer) {
    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    const factory = await Factory.deploy(deployer.address);
    return factory;
  };
 
  async function deployToken(deployer, name, symbol, totalSupply) {
      const Token = await ethers.getContractFactory("StdERC20");
      const token = await Token.deploy(name, symbol, deployer.address, totalSupply);
      return token;
  };

  async function deployWETH() {
    const Token = await ethers.getContractFactory("WETH");
    const token = await Token.deploy();
    return token;
  };
  
  async function deployRouter(factory, weth) {
    const Router = await ethers.getContractFactory("UniswapV2Router02");
    const router = await Router.deploy(factory,weth);
    return router;
  };

   // 部署代币 token0 合约
   const totalSupply = BigInt(10000*10**18);
   const token0 = await deployToken(deployer, "Token01", "Token01", totalSupply);
   console.log("token0 address: ",token0.target);

   // 部署代币 token1 合约
   const token1 = await deployToken(deployer, "Token11", "Token11", totalSupply);
   console.log("token1 address: ",token1.target);

   // 部署 factory 合约
   const factory = await deployFactory(deployer);
   console.log("factory address: ",factory.target)

   // 部署交易对 pairs 合约
   const pairs = await factory.createPair(token0, token1, {
     gasLimit: 30000000
   });
   receipt = await pairs.wait();
   if (receipt.status !== 1) {
     console.log("createPair Transaction failed!");
   }

   // 部署 WETH 合约
   const weth = await deployWETH();
   console.log("WETH address: ",weth.target)

   // 部署路由 router 合约
   const router = await deployRouter(factory.target, weth.target);
   console.log("router address: ",router.target)
}

// 执行 main 函数，并在完成后退出程序
main().then(() => process.exit(0))
  .catch((error) => {
    // 打印错误信息
    console.error(error); 
    // 出现错误时退出程序并返回错误代码
    process.exit(1); 
  });