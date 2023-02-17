// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 
import "./Admin.sol";

contract ContentCollection is ERC721Enumerable, Admin {
    using SafeERC20 for IERC20;

    address private deployer;
    uint256 private currentTokenId = 0;

    //Whitelists: tokenId => user address => is in whitelist bool
    mapping(uint256 => mapping(address => bool)) private whitelists;
    //Remaining whitelist places: tokenId => how much places in whitelist is currently availible. if not rescticted, set 2**256
    mapping(uint256 => uint256) public whitelistLimits;

    //Last created token id: creator address => last created nft by creator
    mapping(address => uint256) public lastCreatedTokenId;

    event NftCreated(uint256 tokenId, address indexed creator);
    event WhiteListMembersSet(uint256 indexed tokenId, address[] members);
    event WhiteListMembersDeleted(uint256 indexed tokenId, address[] members);

    modifier tokenMinted(uint256 tokenId) {
        _requireMinted(tokenId);
        _;
    }

    constructor(string memory collectionName, string memory collectionSymbol) ERC721(collectionName, collectionSymbol) {
        deployer = msg.sender;
    }

    function createNft(uint256 whitelistLimit, address[] memory initialWhitelistMembers) public onlyAdmin returns(uint256) {
        currentTokenId++;
        _mint(msg.sender, currentTokenId);
        whitelistLimits[currentTokenId] = whitelistLimit;
        setWhitelistMembers(currentTokenId, initialWhitelistMembers);
        emit NftCreated(currentTokenId, msg.sender);
        return currentTokenId;
    }

    function changeRemainingWhitelistPlaces(uint256 tokenId, uint256 newRemaningPlacesCount) public onlyAdmin tokenMinted(tokenId) {
        require (whitelistLimits[tokenId] != newRemaningPlacesCount, "changewhitelistLimits: newRemaningPlacesCount is the same");
        whitelistLimits[tokenId] = newRemaningPlacesCount;
    } 

    function setWhitelistMembers(uint256 tokenId, address[] memory members) public onlyAdmin tokenMinted(tokenId) {
        require (whitelistLimits[tokenId] >= members.length, 'setWhitelistMembers: not enough places in whitelist'); //todo require token is deployed
        for (uint256 i = 0; i < members.length; i++) {
            if (getAccess(tokenId, members[i])) continue;
            whitelists[tokenId][members[i]] = true;
            whitelistLimits[tokenId] -= 1;
        }
        if (members.length > 0) {
            emit WhiteListMembersSet(tokenId, members);
        }
    }

    function deleteWhitelistMembers(uint256 tokenId, address[] memory members) public onlyAdmin tokenMinted(tokenId) {
        for (uint256 i = 0; i < members.length; i++) {
            if (!getAccess(tokenId, members[i])) continue;
            whitelists[tokenId][members[i]] = false;
            whitelistLimits[tokenId] += 1;
        }
        if (members.length > 0) {
            emit WhiteListMembersDeleted(tokenId, members);
        }
    }

    function getAccess(uint256 tokenId, address user) public view returns (bool){
        if (user == owner() || isAdmin(user)) return true;
        return whitelists[tokenId][user];
    }

    function getDeployer() public view returns (address) {
        return deployer;
    }
}