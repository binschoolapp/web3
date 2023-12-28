import Head from 'next/head';
import Main from '../components/Main';

export default function Home() {
  return (
    <div className='flex flex-row justify-center'>
      <Head>
        <title>智能合约测试模板</title>
      </Head>
      <Main/>
  </div>
  );
}