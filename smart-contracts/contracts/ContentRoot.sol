// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ContentCollection.sol";

contract ContentRoot {
    //add comission?

    //Owner to collection: user/groupId => collection address
    mapping(uint256 => address) public ownerToCollection;

    function createCollection(uint256 userId, string memory collectionName, string memory collectionSymbol) public returns (address) {
        require(ownerToCollection[userId] == address(0), "createCollection: you already have a collection");
        address collectionAddress = address(new ContentCollection(collectionName, collectionSymbol));
        ownerToCollection[userId] = collectionAddress;
        return collectionAddress;
    }

}
