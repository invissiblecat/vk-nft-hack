/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { ContentRoot, ContentRootInterface } from "../ContentRoot";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "ownerId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "collectionAddress",
        type: "address",
      },
    ],
    name: "CollectionCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "ownerId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "collectionName",
        type: "string",
      },
      {
        internalType: "string",
        name: "collectionSymbol",
        type: "string",
      },
    ],
    name: "createCollection",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "ownerIdToCollection",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class ContentRoot__factory {
  static readonly abi = _abi;
  static createInterface(): ContentRootInterface {
    return new utils.Interface(_abi) as ContentRootInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ContentRoot {
    return new Contract(address, _abi, signerOrProvider) as ContentRoot;
  }
}
