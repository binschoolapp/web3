import { useState } from 'react';
import Head from 'next/head';

import Header from '../components/Header'
import Footer from '../components/Footer'
import Wallet from '../components/Wallet';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>BTC冷钱包生成器</title>
        <meta name="keywords" content="Web3,区块链,智能合约,Solidity,以太坊,比特币"/>
        <meta name="description" content="BinSchool提供Web3编程技术，包括区块链、智能合约、Solidity等。"/>
      </Head>
      <Header/>
      <Wallet/>
      <Footer/>
  </div>
  );
}