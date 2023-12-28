import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contract/abi.json";

const Main = () => {
  // 测试链上的合约地址
  const contractAddress = "0x777C05c2740c21Af2A91DeC027C989199BB3c313"; 
  
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
    setAccount(accounts[0]);

    const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const sum = await contract.add(1, 5);
    setResult(Number(sum));
  }
  
  return (
    <div className='flex flex-row bg-white justify-center mt-5'>
      <div className="w-full md:w-[450px] bg-white shadow-md rounded-lg leading-[2em] p-4">
        <div className="text-lg font-lg text-center font-bold text-highlight">合约测试模板</div>
        <div className='w-full text-center'>
          <a className="text-blue-500 text-sm hover:text-blue-300" href="https://faucet.binschool.app" target="_balnk">切换到测试链</a>
        </div> 

        <div className="mb-2">智能合约地址：</div>
        <div className="w-[300px] md:w-[420px] mx-auto text-highlight font-bold break-words">{contractAddress}</div>
        <div className='w-full text-center'>
          <button className="w-[280px] px-4 py-2 my-2 button" onClick={test}>测试</button>
        </div> 
        {account !== "" && (
        <>
          <div className="mb-2 mt-3">账户地址：</div>
          <div className="w-[300px] md:w-[420px] mx-auto text-highlight font-bold break-words">{account}</div>
          <div className="mt-3">测试结果：</div>
          <div className="w-[300px] md:w-[420px] mx-auto text-highlight font-bold break-words text-center text-xl">{result}</div>
        </>
        )}
      </div>    
    </div>
  );
};
export default Main;