import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import SetNumber from '../components/setNumber'
import App from '../components/readNumber';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>RainbowKit App</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
      </Head>

      <main className={styles.main}>
        <ConnectButton />
        <App />
        <SetNumber />
      </main>

      <h1 className="text-7xl font-bold underline">
        Hello world!
      </h1>
    </div>
  );
};

export default Home;
