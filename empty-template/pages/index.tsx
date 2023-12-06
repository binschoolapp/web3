import Head from 'next/head';
import Main from '../components/Main';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>合约测试空模板</title>
      </Head>
      <Main/>
  </div>
  );
}