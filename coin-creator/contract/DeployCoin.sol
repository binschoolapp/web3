// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 代币合约
contract Coin is ERC20, Ownable{
    // 构造函数，参数为：代币名称、符号、总量、合约所有者地址
    constructor(string memory _name,string memory _symbol, uint256 _totalSupply, address _owner) 
        ERC20(_name, _symbol) {
        // 将当前合约的所有权转让给 _owner
        transferOwnership(_owner);
        // 铸造代币，分配给 _owner，总量为 _totalSupply
        _mint(_owner, _totalSupply*10**18);
    }
}

// 部署合约
contract DeployCoin {
    Coin private coin; // 部署的代币合约
    
    // 部署代币，参数为：代币名称、代币符号、发行总量
    function deploy(string memory _name, string memory _symbol, uint256 _totalSupply) external {
        coin = new Coin(_name, _symbol, _totalSupply, msg.sender);
    }

    // 查询代币地址
    function coinAddress() external view returns(address) {
        require(address(coin) != address(0), "The coin contract hasn't been deployed yet");
        return address(coin);
    }
    
    // 查询代币名称
    function name() external view returns(string memory) {
        require(address(coin) != address(0), "The coin contract hasn't been deployed yet");
        return coin.name();
    }

    // 查询代币符号
    function symbol() external view returns(string memory) {
        require(address(coin) != address(0), "The coin contract hasn't been deployed yet");
        return coin.symbol();
    }
    
    // 查询代币合约的所有者
    function owner() external view returns(address) {
        require(address(coin) != address(0), "The coin contract hasn't been deployed yet");
        return coin.owner();
    }
}
