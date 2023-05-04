/**
 * Copyright 2020 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
 */

import { BigNumber } from "ethers";
import { ethers as Ethers } from "hardhat";

export const blankFunctionSig = "0x00000000";
export const blankFunctionDepositerOffset = 0;
const AbiCoder = new Ethers.utils.AbiCoder();

export const toHex = (covertThis: BigNumber | number | string, padding: any): string => {
  //This checks if padding < convertThis, then error is not thrown in ethers-v5
  if (Ethers.utils.hexlify(covertThis).length > 2 * padding + 2) return Ethers.utils.hexlify(covertThis);

  return Ethers.utils.hexZeroPad(Ethers.utils.hexlify(covertThis), padding);
};

export const abiEncode = (valueTypes: any, values: any) => {
  return AbiCoder.encode(valueTypes, values);
};

export const getFunctionSignature = (contractInstance: any, functionName: any) => {
  return contractInstance.abi.filter((abiProperty: any) => abiProperty.name === functionName)[0].signature;
};

export const createERCDepositData = (
  srcTokenAmount: BigNumber,
  srcStableTokenAmount: BigNumber,
  destStableTokenAmount: BigNumber,
  destTokenAmount: BigNumber,
  lenRecipientAddress: number,
  lenSrcTokenAddress: number,
  lenDestStableTokenAddress: number,
  lenDestTokenAddress: number,
  recipientAddress: string,
  srcTokenAddress: string,
  destStableToken: string,
  destToken: string,
): string => {
  return (
    "0x" +
    toHex(srcTokenAmount, 32).substr(2) + // srcTokenAmount (32 bytes)
    toHex(srcStableTokenAmount, 32).substr(2) + // srcStableTokenAmount          (32 bytes)
    toHex(destStableTokenAmount, 32).substr(2) + //           (32 bytes)
    toHex(destTokenAmount, 32).substr(2) + //           (32 bytes)
    toHex(lenRecipientAddress, 32).substr(2) + //           (32 bytes)
    toHex(lenSrcTokenAddress, 32).substr(2) + //           (32 bytes)
    toHex(lenDestStableTokenAddress, 32).substr(2) + //           (32 bytes)
    toHex(lenDestTokenAddress, 32).substr(2) + //          (32 bytes)
    recipientAddress.substr(2) + // recipientAddress               (?? bytes)
    srcTokenAddress.substr(2) + // recipientAddress               (?? bytes)
    destStableToken.substr(2) + // recipientAddress               (?? bytes)
    destToken.substr(2)
  ); // recipientAddress               (?? bytes)
};

export const createERC721DepositProposalData = (
  tokenAmountOrID: string,
  lenRecipientAddress: string,
  recipientAddress: string,
  lenMetaData: string,
  metaData: string,
): string => {
  return (
    "0x" +
    toHex(tokenAmountOrID, 32).substr(2) + // Token amount or ID to deposit (32 bytes)
    toHex(lenRecipientAddress, 32).substr(2) + // len(recipientAddress)         (32 bytes)
    recipientAddress.substr(2) + // recipientAddress              (?? bytes)
    toHex(lenMetaData, 32).substr(2) + // len(metaData)                 (32 bytes)
    toHex(metaData, lenMetaData).substr(2)
  ); // metaData                      (?? bytes)
};

export const delay = (n: number): Promise<any> => {
  return new Promise(function (resolve) {
    setTimeout(resolve, n);
  });
};

export const createGenericDepositData = (hexMetaData: string): string => {
  if (hexMetaData === null) {
    return "0x" + toHex(0, 32).substr(2); // len(metaData) (32 bytes)
  }
  const hexMetaDataLength = hexMetaData.substr(2).length / 2;
  return "0x" + toHex(hexMetaDataLength, 32).substr(2) + hexMetaData.substr(2);
};

export const createResourceID = (contractAddress: string, chainID: number): string => {
  return toHex(contractAddress + toHex(chainID, 0).substr(2), 32);
};

//uint72 nonceAndID = (uint72(depositNonce) << 8) | uint72(chainID);
export const nonceAndId = (nonce: any, id: any) => {
  return (
    Ethers.utils.hexZeroPad(Ethers.utils.hexlify(nonce), 8) +
    Ethers.utils.hexZeroPad(Ethers.utils.hexlify(id), 1).substr(2)
  );
};
