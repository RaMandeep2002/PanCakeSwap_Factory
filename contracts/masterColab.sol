// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '../pancakeswap/pancake-swap-lib/contracts/token/BEP20/IBEP20.sol';
import "./MasterChef.sol";
import "./Factory.sol";
import "hardhat/console.sol";

contract masterColab {
    MasterChef public master;
    Factory public factory;
    address user;
    function initailize(address _factoryAddress,address _master) external{
        master = MasterChef(_master);
        console.log("master dscdc",address(master));
    console.log(_factoryAddress);
    factory = Factory(_factoryAddress);
    console.log("check init");
    }
    function get() public view {
        console.log("inside get");
        console.log(address(master));  
        console.log(address(factory));
    }

    function newFarm(uint256 _allocPoint, IBEP20 lpToken, bool _withUpdate) public {
        console.log("inside newFarm");
        master.add(_allocPoint, lpToken, _withUpdate);
        console.log("check");
    }

    function depositit(uint id, uint amount,IBEP20 lpToken) public {
        console.log("inside deposit"); 
        user =msg.sender;

        lpToken.transferFrom(user,address(this),amount);
        lpToken.approve(address(master),amount); 

        console.log("after aprove");
        master.deposit(id, amount);
    } 

    function withdraw(uint id, uint amount,IBEP20 lpToken) public {
        console.log("inside withdraw");
        master.withdraw(id, amount);
        lpToken.transfer(user,amount);

    }
}
