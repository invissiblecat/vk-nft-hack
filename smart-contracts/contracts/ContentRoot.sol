// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ContentCollection.sol";

contract ContentRoot {
    //add comission?
    //add events

    event CollectionCreated(uint256 ownerId, address collectionAddress);

    //Owner to collection: user/groupId => collection address
    mapping(uint256 => address) public ownerToCollection;

    function createCollection(uint256 ownerId, string memory collectionName, string memory collectionSymbol) public returns (address) {
        require(ownerToCollection[ownerId] == address(0), "createCollection: you already have a collection");
        ContentCollection collection = new ContentCollection(collectionName, collectionSymbol);
        collection.transferOwnership(msg.sender);
        address collectionAddress = address(collection);
        ownerToCollection[ownerId] = collectionAddress;
        emit CollectionCreated(ownerId, collectionAddress);
        return collectionAddress;
    }

    function deleteCollection(uint256 ownerId) public { //todo REMOVE 
        ownerToCollection[ownerId] = address(0);
    }
}
