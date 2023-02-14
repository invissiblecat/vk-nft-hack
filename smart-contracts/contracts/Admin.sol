pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Admin is Ownable {
    mapping(address => bool) private _admins;

    modifier onlyAdmin() {
        require(_admins[msg.sender] || msg.sender == owner(), "access denied");
        _;
    }

    function addAdmins(address[] memory addrs) public onlyOwner {
        for (uint256 i; i < addrs.length; i++) {
            _admins[addrs[i]] = true;
        }
    }

    function removeAdmins(address[] memory addrs) public onlyOwner {
        for (uint256 i; i < addrs.length; i++) {
            _admins[addrs[i]] = false;
        }
    }

    function isAdmin(address addr) public view returns (bool) {
        return _admins[addr];
    }
}