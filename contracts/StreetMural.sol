// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Project.sol"; // Import the Project contract

contract MuralDAO {
    struct MuralProject { // Renamed from Project to MuralProject
        uint256 id;
        string title;
        string description;
        string location;
        uint256 estimatedFunding;
        uint256 fundsCollected;
        uint256 contributors;
        uint256 muralsSubmitted;
        uint256 totalVotes; // Track total votes across all murals
        address creator;
    }

    struct Mural {
        uint256 id;
        uint256 projectId; // Link mural to project
        string ipfsHash;
        address artist;
        string description;
        uint256 votes;
    }

    mapping(uint256 => MuralProject) public projects; // Update mapping to use MuralProject
    mapping(uint256 => Mural[]) public murals;
    mapping(uint256 => mapping(address => bool)) public hasVoted; // Track who has voted
    mapping(uint256 => address) public projectContracts; // Store project contract addresses

    uint256 public projectCount;
    event ProjectCreated(uint256 projectId, address projectAddress);
    event MuralSubmitted(uint256 projectId, uint256 muralId, string ipfsHash, address artist);
    event VoteCasted(uint256 projectId, uint256 muralId, address voter);
    event ContributionReceived(uint256 projectId, address contributor, uint256 amount);

    // Create a new project
    function createProject(
        string memory _title,
        string memory _description,
        string memory _location,
        uint256 _estimatedFunding
    ) public {
        Project newProject = new Project(_title, _description, _location, _estimatedFunding);
        projectContracts[projectCount] = address(newProject); // Store the address of the new project contract

        emit ProjectCreated(projectCount, address(newProject));
        projectCount++;
    }

    // Submit a mural for a project
    function submitMural(uint256 _projectId, string memory _ipfsHash, string memory _description) public {
        require(_projectId < projectCount, "Invalid project ID");

        murals[_projectId].push(Mural({
            id: murals[_projectId].length,
            projectId: _projectId, // Link mural to project
            ipfsHash: _ipfsHash,
            artist: msg.sender,
            description: _description,
            votes: 0
        }));

        projects[_projectId].muralsSubmitted++;
        emit MuralSubmitted(_projectId, murals[_projectId].length - 1, _ipfsHash, msg.sender);
    }

    // Vote for a mural & increase project votes
    function voteMural(uint256 _projectId, uint256 _muralIndex) public {
        require(!hasVoted[_projectId][msg.sender], "You have already voted");
        require(_muralIndex < murals[_projectId].length, "Invalid mural ID");

        murals[_projectId][_muralIndex].votes++;
        projects[_projectId].totalVotes++; // Update project-wide vote count
        hasVoted[_projectId][msg.sender] = true;

        emit VoteCasted(_projectId, _muralIndex, msg.sender);
    }

    // Contribute to a project
    function contribute(uint256 _projectId) public payable {
        require(msg.value > 0, "Must send ETH");
        require(_projectId < projectCount, "Invalid project ID");

        projects[_projectId].fundsCollected += msg.value;
        projects[_projectId].contributors++;

        emit ContributionReceived(_projectId, msg.sender, msg.value);
    }

    // Get all murals for a project
    function getMurals(uint256 _projectId) public view returns (Mural[] memory) {
        return murals[_projectId];
    }
}
