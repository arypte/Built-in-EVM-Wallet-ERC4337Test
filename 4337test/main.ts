import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import { Presets, Client } from 'userop';

dotenv.config();
const signingKey = process.env.SIGNING_KEY || '';
const rpcUrl = process.env.RPC_URL || '';
// const paymasterUrl = process.env.PAYMASTER_URL || "";

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
    data: erc20.interface.encodeFunctionData('send', [to, amount]),
  };
  return [approve, send];
}

async function T_mint(
  to: string,
  token: string,
  value: string
): Promise<any[]> {
  const ERC20_ABI = require('./erc20abi.json');
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const decimals = await Promise.all([erc20.decimals()]);
  const amount = ethers.utils.parseUnits(value, decimals);
  const mint = {
    to: token,
    value: ethers.constants.Zero,
    data: erc20.interface.encodeFunctionData('t_mint', [to]),
  };
  return [mint];
}

async function main() {
  // Create a userop builder
  const signer = new ethers.Wallet(signingKey);

  const builder = await Presets.Builder.Kernel.init(
    signer,
    rpcUrl /*{
    paymasterMiddleware : paymasterMiddleware
    }*/
  );
  const address = builder.getSender();
  console.log(`Account address : ${address}`);

  // Create the calls
  const to = address;
  const token_c = '0xC02beF5edd08caDC16cB4Bd3cd14d3F6bCeB0a83';
  const value = '2';
  const calls = await approveAndSendToken(address, token_c, value);
  const nft_c = '0xAB26E4125F97bF41b5D0C127A7fE08dF32068dcC';
  builder.executeBatch(calls);
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
}

export default main();
