import React, { useState } from 'react';
import Web3 from 'web3';

const Main = () => {
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const Login = () => {
    const savedAddress = localStorage.getItem('address');

    if (savedAddress) {
      setAddress(savedAddress);
    } else {
      createAccount();
    }
  };

  const createAccount = () => {
    const web3 = new Web3(
      'https://goerli.infura.io/v3/318af53be76b4bc39a0b3e9f97830a26'
    );

    const newAccount = web3.eth.accounts.create();
    setAddress(newAccount.address);
    setPrivateKey(newAccount.privateKey);

    // 로컬 스토리지에 계정 정보 저장
    localStorage.setItem('address', newAccount.address);
    localStorage.setItem('Pvk', newAccount.privateKey);
    console.log(newAccount.address);
    console.log(newAccount.privateKey);
  };

  return (
    <div className="min-h-screen w-[640px] flex flex-col justify-center mx-auto">
      <div className="mx-auto">
        <a className="fancy w-60" href="#" onClick={Login}>
          <span className="top-key"></span>
          <span className="text">Make Account</span>
          <span className="bottom-key-1"></span>
          <span className="bottom-key-2"></span>
        </a>
      </div>

      {address && (
        <div className="mx-auto">
          <p>주소: {address}</p>
          <p>개인 키: {privateKey}</p>
        </div>
      )}
    </div>
  );
};

export default Main;
