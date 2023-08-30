import React, { useState } from 'react';
import Web3 from 'web3';
import { abi } from '../web3config';
import { RelayProvider } from '@opengsn/provider/dist/RelayProvider.js' ;

const web3 = new Web3(
  'https://goerli.infura.io/v3/318af53be76b4bc39a0b3e9f97830a26'
);

const Main = () => {
  
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const forwarder = '0xB2b5841DBeF766d4b521221732F9B618fCf34A87' ;
  const paymaster = '0xa1874f6E5F801962A0c4e3730143Bbb229d6D3e1' ;
  var gsnProvider = 0 ;
  var provider = 0 ;

  const async setting = () => {

  //GSN Provider 셋팅
  gsnProvider = await RelayProvider.newProvider({
    provider : window.ethereum,
    config: {
         paymasterAddress: PaymasterAddress,
    }
    }).init();

gsnProvider = RelayProvider.newProvider({provider: 'https://goerli.infura.io/v3/318af53be76b4bc39a0b3e9f97830a26'
  , config: {
    paymasterAddress: "0xa1874f6E5F801962A0c4e3730143Bbb229d6D3e1"
  }})
  provider = new ethers.providers.Web3Provider(gsnProvider);

  }

  
  const Login = () => {
    const savedAddress = localStorage.getItem('address');

    if (savedAddress) {
      setAddress(savedAddress);
    } else {
      createAccount();
    }
  };

  const createAccount = () => {

    const newAccount = web3.eth.accounts.create();
    setAddress(newAccount.address);
    setPrivateKey(newAccount.privateKey);

    // 로컬 스토리지에 계정 정보 저장
    localStorage.setItem('address', newAccount.address);
    localStorage.setItem('Pvk', newAccount.privateKey);
    console.log(newAccount.address);
    console.log(newAccount.privateKey);
  };

  const Call_GSNContract_Change = async() => {

    //const mycontract = web3.eth.Contract(abi, '0x5B2046cDca4a377d6c9CF69eB1eBE3a27279427c');
    const test_contract = await new ethers.Contract('0x5B2046cDca4a377d6c9CF69eB1eBE3a27279427c' , abi , provider.getSigner());
    const transaction = await test_contract.change(ChangeData_Input);
    const hash = transaction.hash;
    console.log(`Transaction HASH : ${hash}`);

  }

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
