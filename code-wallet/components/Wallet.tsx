import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const Wallet = () => {
  const [account, setAccount] = useState("");
  const [privateKey, setprivateKey] = useState("");
  const [tPrivateKeyPretty, setPrivateKeyPretty] = useState("");

  const createAccount = () => {
    const randomWallet = ethers.Wallet.createRandom();
    setAccount(randomWallet.address);
    setprivateKey(randomWallet.privateKey.substring(2));
    setPrivateKeyPretty(formatString(randomWallet.privateKey.substring(2)));
  }

  const formatString = (str:string) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str[i];
      if ((i + 1) % 10 === 0 && i !== str.length - 1) {
        result += ' : ';
      }
    }
    return result;
  }

  return (
    <div className='w-full flex-1 flex flex-row justify-center bg-[#f4f4f4]'>
      <div className='min-w-[260px] max-w-[480px]'>
        <div className="mx-auto p-4 bg-white shadow-md rounded-lg mt-[20px] leading-[2em]">
          <p className="mb-2 text-green overflow-wrap"><span className="text-highlight text-xl"><strong>【冷钱包】</strong></span>用于离线保存大额加密资产，通常不与任何智能合约或外部资源进行互动，防止资产被窃取。</p>
          <p><span className="text-highlight"><strong>【热钱包】</strong></span>与<span className="text-highlight"><strong>【冷钱包】</strong></span>相对应，用于日常支付，或者与外界进行频繁互动，一般会存放小额资产。当需要充钱的时候，由冷钱包进行转账。</p>
          <div className='w-full text-center'>
            <button className="w-[280px] px-4 py-2 my-2 button" onClick={createAccount}>生成冷钱包账号
            </button>
          </div>
          <div className="mx-auto mt-[5px] text-center">
          {account !== "" && (
            <>
            <div className="w-full font-bold"></div>
            <div>地址：<span className="text-highlight "><strong>{account}</strong></span>
            </div>
            <div className="w-full">私钥：</div>
            <div><span className="text-highlight whitespace-normal break-words"><strong>{privateKey}</strong></span>
            </div>
            <div className="w-full">格式化私钥：</div>
            <div><span className="text-highlight"><strong>{tPrivateKeyPretty}</strong></span>
            </div>
            </>
          )}
      </div>

        </div>
      </div>
    </div>
    
  );
};
export default Wallet;