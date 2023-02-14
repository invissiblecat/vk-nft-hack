// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Admin.sol";

contract ContentCollection is ERC721, Admin {
    using SafeERC20 for IERC20;

    //Whitelists: tokenId => user address => is in whitelist bool
    mapping(uint256 => mapping(address => bool)) public whitelists;
    //Remaining whitelist places: tokenId => how much places in whitelist is currently availible
    mapping(uint256 => uint256) public remainingWhitelistPlaces;

    //Prices: token id => currency address => price 
    mapping(uint256 => mapping(address => uint256)) private _prices;

    constructor(string memory collectionName, string memory collectionSymbol) ERC721(collectionName, collectionSymbol) {}

    function createNft(uint256 tokenId, uint256 whitelistPlaces, address[] memory currencies, uint256[] memory prices) public onlyAdmin {
        _mint(msg.sender, tokenId);
        remainingWhitelistPlaces[tokenId] = whitelistPlaces;
        _setPrices(tokenId, currencies, prices);
    }

    function changePrices(uint256 tokenId, address[] memory currencies, uint256[] memory prices) public onlyAdmin {
        _setPrices(tokenId, currencies, prices);
    }

    function _setPrices(uint256 tokenId, address[] memory currencies, uint256[] memory prices) private {
        for (uint256 i = 0; i < currencies.length; i++) {
            require (prices[i] > 0, "_setPrices: price should be bigger than 0");
            _prices[tokenId][currencies[i]] = prices[i];
        }
    }

    // function changeRemainingWhitelistPlaces(uint256 tokenId, uint256 newRemaningPlacesCount) public onlyAdmin {
    //     require ()
    //     remainingWhitelistPlaces[tokenId] = newRemaningPlacesCount;
    // } //todo remove? to prevent scam 

    function buyAccess(uint256 tokenId, address currency) public {
        require (msg.sender != owner(), "buyAccess: owner cannot buy access");
        uint256 price = _prices[tokenId][currency];
        require (price > 0, "buyAccess: currency is not accepted");
        IERC20(currency).safeTransferFrom(msg.sender, address(this), price);
        whitelists[tokenId][msg.sender] = true;
        remainingWhitelistPlaces[tokenId] -= 1;
    } 

    function withdraw(address currency, uint256 amount) public onlyOwner {
        IERC20(currency).safeTransferFrom(address(this), msg.sender, amount);
    }

    function getAccess(uint256 tokenId, address user) public view returns (bool){
        //owner?
        return whitelists[tokenId][user];
    }

    function getPrice(uint256 tokenId, address currency) public view returns (uint256) {
        return _prices[tokenId][currency];
    }

}