// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address[] public players;
    address public lastWinner;
    
    constructor() {
        manager = msg.sender;
        lastWinner = address(0);
    }
    
    function enter() public payable {
        require(msg.value > 0.1 ether);
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
    
    function pickWinner() public onlyManagerCall {
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        lastWinner = players[index];
        players = new address[](0);
    }
    
    modifier onlyManagerCall(){
        require(msg.sender == manager);
        _;
    }

    function getLastWinner() public view returns (address) {
        return lastWinner;
    }
    
    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}