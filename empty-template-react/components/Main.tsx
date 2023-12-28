import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contract/abi.json";

const Main = () => {
  const contractAddress = "0x3EA9E160242234eE589645BAAe9370397C5a41D6"; // 测试链合约地址
  
  const [account, setAccount] = useState("");
  const [result, setResult] = useState(0);
  

  const test = async() => {
    if (typeof window === "undefined" || typeof (window as any).ethereum === "undefined") {
      alert("请首先安装 MetaMask");
      return
    }

    const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length === 0) {
      alert("错误原因：没有连接有效账户");
      return;
    }
   
    const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const sum = await contract.add(1, 5);
    setAccount(accounts[0]);
    setResult(Number(sum));
  }
  
  return (
    <div className='w-full flex flex-row bg-[#f4f4f4] flex-1'>
      <div className='flex-1'></div>
      <div className='flex-1 flex-auto min-w-[260px] max-w-[480px]'>
        <div className="mx-auto p-4 bg-white shadow-md rounded-lg mt-[20px] leading-[2em]">
          <div className="mb-2 text-green overflow-wrap">为了防止浪费和滥用，每地址每天可以领取 1 ETH 测试币，并需要签名来验证身份。</div>
          <div className='w-full text-center'>
            <button className="w-[280px] px-4 py-2 my-2 button" onClick={test}>测试
            </button>
          </div>
        
          {account !== "" && (
          <>
            <div className="mb-2 text-green overflow-wrap mt-3">账户地址：<span className="text-highlight"><strong>{account}</strong></span>
            </div>

            <div className="mb-2 text-green overflow-wrap">测试结果：<span className="text-highlight"><strong>{result}</strong></span>
            </div>
            </>
          )}
        </div>
      </div>
    <div className="flex-1"></div>
  </div>
  );
};
export default Main;