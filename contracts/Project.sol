// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Project {
    string public title;
    string public description;
    string public location;
    uint256 public estimatedFunding;
    address public creator;

    constructor(
        string memory _title,
        string memory _description,
        string memory _location,
        uint256 _estimatedFunding
    ) {
        title = _title;
        description = _description;
        location = _location;
        estimatedFunding = _estimatedFunding;
        creator = msg.sender;
    }
} 