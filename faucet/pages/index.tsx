import { useState } from 'react';
import Head from 'next/head';

import Header from '../components/Header'
import Footer from '../components/Footer'
import Faucet from '../components/Faucet';
import { LogDescription } from 'ethers/lib/utils';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>以太坊测试链</title>
        <meta name="keywords" content="Web3,区块链,智能合约,Solidity"/>
        <meta name="description" content="BinSchool 提供 Web3 编程技术，包括区块链、智能合约、Solidity等。"/>
      </Head>
      <Header/>
      <Faucet/>
      <Footer/>
  </div>
  );
}