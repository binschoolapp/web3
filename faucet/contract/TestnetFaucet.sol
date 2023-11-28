//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TestnetFaucet is Ownable {
    string constant name = "YlemTestFaucet"; // contract name
    string constant version = "1"; // contract version
    uint256 constant NUM_PER_DAY = 1 ether; // number of claims per day

    bytes32 constant CLAIM_HASH = keccak256("Claim(address receiver,uint256 nonce)");
    bytes32 immutable DOMAIN_SEPARATOR; // sepearator of EIP712

    mapping(address => uint256) nonces; // claim sequence
    mapping(address => uint256) claimed; // claim timestamp

    event Claim(address indexed, uint256); // claim log

    constructor() {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(name)),
                keccak256(bytes(version)),
                block.chainid,
                address(this)
            )
        );
    }

    // get nonce of the specified receiver address
    function nonce(address receiver) external view returns(uint256) {
        return nonces[receiver];
    }
    
    // get balance of the current contract
    function balance() external view returns(uint256) {
        return address(this).balance;
    }

    // claim token from the airdrop
    function claim(address receiver, uint8 v, bytes32 r, bytes32 s) external onlyOwner{
        require(receiver != address(0), "receiver is zero");
        require(block.timestamp - claimed[receiver] >= 1 days, "only one claim per day");

        bytes32 hash = keccak256(
            abi.encodePacked(
                '\x19\x01',
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(CLAIM_HASH, receiver,nonces[receiver]++))
            )
        );

        address addrRecover = ecrecover(hash, v, r, s);
        require(receiver == addrRecover, "signature is invalid");
        claimed[receiver] = block.timestamp;

        payable(receiver).transfer(NUM_PER_DAY);
        emit Claim(receiver, NUM_PER_DAY);
    }

    function clean() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
        emit Claim(msg.sender, address(this).balance);
    }

    receive() external payable {}
}