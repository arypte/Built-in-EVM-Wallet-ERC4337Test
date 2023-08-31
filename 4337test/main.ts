import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import { Presets, Client } from 'userop';

dotenv.config();
const signingKey = process.env.SIGNING_KEY || '';
const rpcUrl = process.env.RPC_URL || '';
const paymasterUrl = process.env.PAYMASTER_URL || '';

async function approveAndSendToken(
  to: string,
  token: string,
  value: string
): Promise<any[]> {
  const ERC20_ABI = require('./erc20abi.json');
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const decimals = await Promise.all([erc20.decimals()]);
  const amount = ethers.utils.parseUnits(value, decimals);
  const approve = {
    to: token,
    value: ethers.constants.Zero,
    data: erc20.interface.encodeFunctionData('approve', [to, amount]),
  };
  const send = {
    to: token,
    value: ethers.constants.Zero,
    data: erc20.interface.encodeFunctionData('transfer', [to, amount]),
  };
  return [approve, send];
}

async function T_mint(to: string, token: string): Promise<any[]> {
  const ERC20_ABI = require('./erc20abi.json');
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const mint = {
    to: token,
    value: ethers.constants.Zero,
    data: erc20.interface.encodeFunctionData('t_mint', [to]),
  };
  return [mint];
}

async function N_mint(to: string, token: string): Promise<any[]> {
  const ERC20_ABI = require('./erc721abi.json');
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const mint = {
    to: token,
    value: ethers.constants.Zero,
    data: erc20.interface.encodeFunctionData('mint', [to]),
  };
  return [mint];
}

async function main() {
  // Create a userop builder
  const signer = new ethers.Wallet(signingKey);
  // signer 유저 지갑

  const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
    paymasterUrl,
    {
      type: 'payg',
      // token : "erc20token을 넣는건가?? 잘 모르겠다"
    }
  );

  const builder = await Presets.Builder.Kernel.init(signer, rpcUrl, {
    paymasterMiddleware: paymasterMiddleware,
  });
  const address = builder.getSender();
  console.log(`Account address : ${address}`);

  // Create the calls
  // const to = signer.address;
  // const to = '';
  const token_c = '0x39a5Af9B84c13C3a14E94354e2899201a45f51D2';
  const value = '2';
  // const calls = await approveAndSendToken(address, token_c, value);
  // const calls = await T_mint(to, token_c);

  const nft_c = '0x18d0BEA129d017D024c26E4AF1a858E5572646a6';
  const calls2 = await N_mint(
    '0x97b54C834A814aaeEAa8C1DBeD2512a18138C8Ad',
    nft_c
  );

  builder.executeBatch(calls2);
  console.log(builder.getOp());

  // Send the user operation
  const client = await Client.init(rpcUrl);
  const res = await client.sendUserOperation(builder, {
    onBuild: (op) => console.log('Signed UserOperation :', op),
  });
  console.log(`UserOPHash: ${res.userOpHash}`);
  console.log('Waiting for transaction...');
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);

  //   builder.executeBatch(calls);
  //   console.log(builder.getOp());

  //   // Send the user operation
  //   const client = await Client.init(rpcUrl);
  //   const res = await client.sendUserOperation(builder, {
  //     onBuild: (op) => console.log('Signed UserOperation :', op),
  //   });
  //   console.log(`UserOPHash: ${res.userOpHash}`);
  //   console.log('Waiting for transaction...');
  //   const ev = await res.wait();
  //   console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
}

export default main();
