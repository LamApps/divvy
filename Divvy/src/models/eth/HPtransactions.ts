import { useState } from 'react';
import { BigNumber, ethers, providers } from 'ethers'
import { HPSCaddress, USDCSCaddress } from '../../constants/eth/addresses';
import HPContract from '../eth-abis/HPContract.json'
import usdc from "../eth-abis/usdc.json"
declare let window: any;
async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
}
export async function HouseDeposit(amount: number) {
    if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const HPToken = new ethers.Contract(HPSCaddress, HPContract.abi, signer)
        const USDCoken = new ethers.Contract(USDCSCaddress, usdc.usdc, signer)
        try {
            let transaction1 = await USDCoken.approve(HPToken.address, amount * 10 ** 6)
            await transaction1.wait()
            let transaction2 = await HPToken.process_deposit(amount)
            transaction2.wait()
        } catch (err) {
            console.log("Error: ", err)
        }
    }
}
