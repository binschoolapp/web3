const { expect } = require("chai");

// 定义一个测试套件，用于测试 uniswap 合约
describe("Uniswap V2 Test：", async function () {

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

  // 测试用例
  it("should be correctly", async function () {
    // 部署合约
    console.log("\n*************** Deploy contract **********************\n");

    // 获得部署者地址
    const [deployer] = await ethers.getSigners();
    console.log("deployer address: ",deployer.address);

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

    // 添加流动性
    console.log("\n*************** Add liquidity **********************\n");

    // 对于代币 token0，deployer 授权给 router，额度为 totalSupply 
    const txApproveT0 = await token0.approve(router.target, totalSupply, {
      gasLimit: 30000000
    });
    receipt = await txApproveT0.wait();
    if (receipt.status !== 1) {
      console.log("approve Transaction failed!");
    }

    // 对于代币 token0，获得 deployer 授权 router 的额度 
    let allowance = await token0.allowance(deployer.address, router.target);
    console.log("token0 allowance：", allowance);

    // 对于代币 token1，deployer 授权给 router，额度为 totalSupply 
    const txApproveT1 = await token1.approve(router.target, totalSupply, {
      gasLimit: 30000000
    });
    receipt = await txApproveT1.wait();
    if (receipt.status !== 1) {
      console.log("approve Transaction failed!");
    }

    // 对于代币 token1，获得 deployer 授权 router 的额度 
    allowance = await token1.allowance(deployer.address, router.target);
    console.log("token1 allowance：", allowance);

    // 添加流动性
    const amountA = BigInt(5000*10**18); // 添加流动性的代币A的数量
    const amountB = BigInt(5000*10**18); // 添加流动性的代币B的数量
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 截止时间为当前时间后的20分钟

    const lq = await router.addLiquidity(token0.target, token1.target, amountA, amountB, 0, 0, deployer.address, deadline, {
      gasLimit: 30000000
    });
    receipt = await lq.wait();
    if (receipt.status === 1) {
      console.log("addLiquidity transaction succeeded!");
    }
    else{
      console.log("addLiquidity transaction failed!");
    }

    // 获取 deployer 对于 token0 的余额
    let amount = await token0.balanceOf(deployer.address);
    console.log("current token0 blance：", amount);
 
    // 获取 deployer 对于 token1 的余额
    amount = await token1.balanceOf(deployer.address);
    console.log("current token1 blance：", amount);

    console.log("\n*************** Swap **********************\n");

    // 构建交易对 pairs 合约
    const pairsAddress = await factory.getPair(token0, token1); // 交易对地址
    const pairsABI = 
    [
      {
        "inputs": [],
        "name": "getReserves",
        "outputs": [
          {
            "internalType": "uint112",
            "name": "reserve0",
            "type": "uint112"
          },
          {
            "internalType": "uint112",
            "name": "reserve1",
            "type": "uint112"
          },
          {
            "internalType": "uint32",
            "name": "blockTimestampLast",
            "type": "uint32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]; // 交易对 ABI

    const pairsContract = await ethers.getContractAt(pairsABI, pairsAddress);

     // 交换前的储备
    let reservesBefore = await pairsContract.getReserves();

    // 交换收到地址
    const receiver = "0xc7977fa83BdD087C57eF5B20Aa9CBc6eD7A88dEb";
    
    // 交换 1000 Token0 
    amount = BigInt(1000);
    console.log("token0 amount for swap：", amount);
    const swap = await router.swapExactTokensForTokens(amount, 0, [token0.target, token1.target], receiver, deadline);
    receipt = await swap.wait();
    if (receipt.status !== 1) {
      console.log("swap failed!");
    }

    // 交换得到的 Token1 数量 
    amount = await token1.balanceOf(receiver);
    console.log("token1 amount received：", amount);

    // 交换前的储备和K值
    console.log("[reserveA, reserveB] before swap：", reservesBefore);
    console.log("K before swap：", reservesBefore[0]*reservesBefore[1]);
    
    // 交换后的储备和K值
    const reservesAfter = await pairsContract.getReserves();
    console.log("[reserveA, reserveB] after swap：", reservesAfter);
    console.log("K after swap：", reservesAfter[0]*reservesAfter[1]);

    expect(amount).to.equal(996);
  });
  
});