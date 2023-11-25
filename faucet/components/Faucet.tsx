import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contract/abi.json";

const Faucet = () => {
  const chainIdYlem = "0x2c66d"; // 链ID：181869
  const contractAddress = "0x3e4678e6377Dc26419B4FE0EF030a1B2aB1464C9"; // 合约地址
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [faucetBalance, setFaucetBalance] = useState("0");

  useEffect(() => {
    const interval = setInterval(() => {
      refreshBalance();
    }, 3000);

    return () => clearInterval(interval);
  }, []); 


  // 刷新余额
  const refreshBalance = async() => {
    if (typeof window === "undefined" || typeof (window as any).ethereum === "undefined") {
      return
    }

    const chainId = await (window as any).ethereum.request({ method: "eth_chainId" });
    if (chainId !== chainIdYlem) {
      console.log("没有选择 Ylem 测试网");
      return;
    }

    try {
      const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const curentFaucetBalance = await contract.balance();
      setFaucetBalance(ethers.utils.formatEther(curentFaucetBalance));
    } catch (error) {
      console.error(error);
    }
    
    try {
      const accounts =  await (window as any).ethereum.request({ 
        method: "eth_accounts"
      });
      if (accounts.length == 0) {
        return
      }
      setAccount(accounts[0]);

      const currentBalance = await (window as any).ethereum.request({ 
        method: 'eth_getBalance',
        params: [accounts[0]] });
      setBalance(ethers.utils.formatEther(currentBalance));

    } catch (error) {
      console.error(error);
    }

  
  };

  const startChain = async () => {
    if (typeof window === "undefined" || typeof (window as any).ethereum === "undefined") {
      alert("未检测到钱包，请安装 MetaMask");
      return
    }

    try {
      let chainIdMask = await (window as any).ethereum.request({ 
        method: "eth_chainId" 
      });
      if (chainIdMask === chainIdYlem) {
        alert("Ylem 测试链已启用，可去领取测试币");
        return;
      }
    } catch (error) {
      console.error(error);
      alert("无法获得当前钱包使用的网络");
      return
    }

    try {
      await (window as any).ethereum.request({ 
        method: "wallet_switchEthereumChain",
        params: [{chainId:chainIdYlem}]
      });
    } catch (error) {
      console.error(error);
      if (error.code === 4001 || error.code === "ACTION_REJECTED") {
        alert("错误原因：用户拒绝");
        return
      } 
      if (error.code !== 4902) {
        alert("无法切换网络");
        return
      }
    }
     
    try{
      const chainData = {
        chainId: chainIdYlem,
        chainName: "Ylem Testnet",
        nativeCurrency: {
          name: "Ylem ETH",
          symbol: "YLEM",
          decimals: 18,
        },
        rpcUrls: ["https://testnet.ylem.network"],
        //blockExplorerUrls: [],
      };

      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [chainData],
      });

      alert("Ylem 测试链已启用，可去领取测试币");
    } catch (error) {
      console.error(error);
      alert("Ylem 启用出现了错误：" + error.message);
    }
  }

  const claimToken = async() => {
    if (typeof window === "undefined" || typeof (window as any).ethereum === "undefined") {
      alert("请首先安装 MetaMask");
      return
    }

    try {
      const chainIdMetaMask = await (window as any).ethereum.request({ method: "eth_chainId" });
      if (chainIdMetaMask !== chainIdYlem) {
        alert("请首先启用 Ylem 测试链");
        return;
      }
    } catch(error) {
      console.error(error);
      alert("请首先启用 Ylem 测试链");
      return;
    }

    try {
      const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
        alert("错误原因：没有连接有效账户");
        return;
      }
   
      const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      let nonce = await contract.nonce(accounts[0]);
      const data = {
        domain:{
          name: "YlemTestFaucet",
          version: '1',
          chainId: chainIdYlem,
          verifyingContract: contractAddress,
        },
        types: {
          Claim: [
            {name:'receiver', type:'address'},
            {name:'nonce', type:'uint256'},
          ]
        },
        data:{
          receiver: accounts[0],
          nonce: nonce,
        },
      }
      
      const signer = provider.getSigner(accounts[0]);
      const sig = await signer._signTypedData(data.domain, data.types, data.data);
      const cryptoSig = (ethers as any).utils.splitSignature(sig);
   
      let result = await fetchDataFromAPI(accounts[0],cryptoSig.r,cryptoSig.s,cryptoSig.v);
      if (result) {
        if (result.code === 2) {
          alert("当前地址已经领取，每日只能领取 1 ETH");
          return;
        }
        if (result.code === 0) {
          alert("领取成功，测试币将在 15 秒内到账");
          return;
        }
      }
      alert("无法连接服务，请稍后再试");
      
    }catch(error) {
      console.error(error);
      if (error.code === 4001 || error.code === "ACTION_REJECTED") {
        alert("错误原因：用户拒绝");
        return
      } 
      alert("错误原因：" + error.message);
    }
  }
  
  const fetchDataFromAPI = async (receiver: string, r: string, s: string, v: string) => {
    let url = 'https://binschool.app/faucet/api/claim?';
    url += "receiver=" + receiver;
    url += "&r=" + r;
    url += "&s=" + s;
    url += "&v=" + v;
    try {
      const response = await fetch(url);
      if (response && response.status == 200) {
        const result = await response.json();
        return result;
      }
      console.error('Error fetching data:', response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return null;
  }

  const formatAccount = (s:string) => {
    if (!s || (s.length < 10)) {
      return "";
    }
    return s.substring(0,6) + "..." + s.substring(s.length-4);
  }

  return (
    <div className='w-full flex flex-row bg-[#f4f4f4] flex-1'>
      <div className='flex-1'></div>
      <div className='flex-1 flex-auto min-w-[260px] max-w-[480px]'>
        <div className="mx-auto p-4 bg-white shadow-md rounded-lg mt-[20px] leading-[2em]">
          <p className="mb-2 text-green overflow-wrap"><span className="text-xl"><b>Ylem</b></span> 测试链是一条兼容 EVM 的高性能区块链，用于测试以太坊、BSC上的智能合约，交易确认时间 3 秒。</p>
          <p className="mb-2 text-green mt-1 overflow-wrap">点击下方按钮，MetaMask 将会切换至 Ylem 测试链。</p>
          <div className='w-full text-center'>
            <button className="w-[280px] px-4 py-2 my-2 button" onClick={startChain}>启用 Ylem 测试链
            </button>
          </div>
        </div>
        <div className="mx-auto p-4 bg-white shadow-md rounded-lg mt-[20px] leading-[2em]">
          <div className="mb-2 text-green overflow-wrap">为了防止浪费和滥用，每地址每天可以领取 1 ETH 测试币，并需要签名来验证身份。</div>
          <div className='w-full text-center'>
            <button className="w-[280px] px-4 py-2 my-2 button" onClick={claimToken}>领取 Ylem 测试币
            </button>
          </div>
        </div>

        <div className="mx-auto p-4 bg-white shadow-md rounded-lg mt-[20px] text-center">
          {account !== "" && (
          <>
          <div className="mb-2 text-green overflow-wrap">当前账户地址：<span className="text-highlight text-xl"><strong>{formatAccount(account)}</strong></span>
          </div>

          <div className="mb-2 text-green overflow-wrap">当前账户余额：<span className="text-highlight text-xl"><strong>{balance} ETH</strong></span>
          </div>
          </>
          )}

          <div className="mb-2 text-green overflow-wrap">水龙头余额：<span className="text-highlight text-xl"><strong>{faucetBalance} ETH</strong></span>
          </div>
        </div>
      </div>
      <div className="flex-1"></div>
    </div>
    
  );
};
export default Faucet;