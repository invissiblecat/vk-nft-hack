export const rootAbi = `[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ownerId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "collectionAddress",
        "type": "address"
      }
    ],
    "name": "CollectionCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "ownerId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "collectionName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "collectionSymbol",
        "type": "string"
      }
    ],
    "name": "createCollection",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ownerIdToCollection",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]`;
