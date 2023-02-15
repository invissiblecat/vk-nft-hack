// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 
import "./Admin.sol";

contract ContentCollection is ERC721, Admin {
    using SafeERC20 for IERC20;

    address private deployer;

    //Whitelists: tokenId => user address => is in whitelist bool
    mapping(uint256 => mapping(address => bool)) public whitelists;
    //Remaining whitelist places: tokenId => how much places in whitelist is currently availible. if not rescticted, set 2**256
    mapping(uint256 => uint256) public remainingWhitelistPlaces;

    event NftCreated(uint256 tokenId, address indexed creator);
    event WhiteListMembersSet(uint256 indexed tokenId, address[] members);
    event WhiteListMembersDeleted(uint256 indexed tokenId, address[] members);

    constructor(string memory collectionName, string memory collectionSymbol) ERC721(collectionName, collectionSymbol) {
        deployer = msg.sender;
    }

    function createNft(uint256 tokenId, uint256 whitelistPlaces, address[] memory initialWhitelistMembers) public onlyAdmin {
        _mint(msg.sender, tokenId);
        remainingWhitelistPlaces[tokenId] = whitelistPlaces;
        setWhitelistMembers(tokenId, initialWhitelistMembers);
        emit NftCreated(tokenId, msg.sender);
    }

    function changeRemainingWhitelistPlaces(uint256 tokenId, uint256 newRemaningPlacesCount) public onlyAdmin {
        require (remainingWhitelistPlaces[tokenId] != newRemaningPlacesCount, "changeRemainingWhitelistPlaces: newRemaningPlacesCount is the same");
        remainingWhitelistPlaces[tokenId] = newRemaningPlacesCount;
    } 

    function setWhitelistMembers(uint256 tokenId, address[] memory members) public onlyAdmin {
        for (uint256 i = 0; i < members.length; i++) {
            whitelists[tokenId][members[i]] = true;
            remainingWhitelistPlaces[tokenId] -= 1;
        }
        if (members.length > 0) {
            emit WhiteListMembersSet(tokenId, members);
        }
    }

    function deleteWhitelistMembers(uint256 tokenId, address[] memory members) public onlyAdmin {
        for (uint256 i = 0; i < members.length; i++) {
            whitelists[tokenId][members[i]] = false;
            remainingWhitelistPlaces[tokenId] += 1;
        }
        if (members.length > 0) {
            emit WhiteListMembersDeleted(tokenId, members);
        }
    }

    function getAccess(uint256 tokenId, address user) public view returns (bool){
        if (user == owner()) return true;
        return whitelists[tokenId][user];
    }

    function getDeployer() public view returns (address) {
        return deployer;
    }

}