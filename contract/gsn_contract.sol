// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./test2.sol";

contract MyContract is ERC2771Recipient {
    constructor(address forwarder) {
        _setTrustedForwarder(forwarder);
    }

    string data = "hi";

    function get() public view returns(string memory){
        return data;
    }

    function change(string memory _input) public {
        data = _input;
    }

}