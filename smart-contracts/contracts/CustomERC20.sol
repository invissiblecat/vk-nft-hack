pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomErc20 is ERC20 {
    constructor(address recipient) ERC20("ERC20", "ERC") {
        _mint(recipient, 100e6 * 10**18);
    }
}
