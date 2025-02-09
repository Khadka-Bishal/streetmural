// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StreetMural {
    // A counter for the total number of projects
    uint256 public projectCount;

    // A structure to store project details
    struct Project {
        uint256 id;             // Unique identifier for the project
        address owner;          // The creator of the project
        uint256 goalAmount;     // Funding goal in wei
        uint256 fundsRaised;    // Total funds contributed so far
        uint256 milestoneCount; // Number of milestones planned
        uint256 endDate;        // Deadline (as a Unix timestamp)
        string metaHash;        // A hash (e.g., an IPFS hash) for off-chain metadata
        bool finalized;         // Whether the project is finalized
        uint256 winningProposalId; // The ID of the winning proposal (if finalized)
    }

    // A structure to store proposal details for a project
    struct Proposal {
        uint256 id;           // Unique proposal id within the project
        address proposer;     // The address that submitted the proposal
        string proposalHash;  // A hash representing the proposal details (e.g., stored on IPFS)
        uint256 voteCount;    // Total number of votes the proposal has received
    }

    // Mapping of project ID to the project details
    mapping(uint256 => Project) public projects;
    // Mapping from project ID to an array of proposals submitted for that project
    mapping(uint256 => Proposal[]) public projectProposals;
    // Mapping to track if an address has already voted on a given project
    mapping(uint256 => mapping(address => bool)) public projectVoted;

    // EVENTS
    event ProjectCreated(
        uint256 indexed projectId,
        address indexed owner,
        uint256 goalAmount,
        uint256 milestoneCount,
        uint256 endDate,
        string metaHash
    );
    event ProposalSubmitted(
        uint256 indexed projectId,
        uint256 proposalId,
        address indexed proposer,
        string proposalHash
    );
    event ProposalVoted(
        uint256 indexed projectId,
        uint256 proposalId,
        address indexed voter
    );
    event ProposalFinalized(
        uint256 indexed projectId,
        uint256 winningProposalId
    );
    event ContributionMade(
        uint256 indexed projectId,
        address indexed contributor,
        uint256 amount
    );

    // FUNCTION: Create a new project.
    // Anyone can call this function to start a new project.
    function createProject(
        uint256 _goalAmount,
        uint256 _milestoneCount,
        uint256 _endDate,
        string memory _metaHash
    ) external {
        projectCount++;  // Increment the counter to get a new project ID.
        // Create a new project and store it in the mapping.
        projects[projectCount] = Project(
            projectCount,
            msg.sender,     // The creator becomes the project owner.
            _goalAmount,
            0,              // Initially, no funds have been raised.
            _milestoneCount,
            _endDate,
            _metaHash,
            false,          // Not finalized at creation.
            0               // No winning proposal yet.
        );
        // Emit an event so external applications can know a new project has been created.
        emit ProjectCreated(projectCount, msg.sender, _goalAmount, _milestoneCount, _endDate, _metaHash);
    }

    // FUNCTION: Submit a proposal for a project.
    // This allows someone (e.g., an artist) to propose a design or plan.
    function submitProposal(uint256 _projectId, string memory _proposalHash) external {
        require(_projectId > 0 && _projectId <= projectCount, "Project does not exist");
        Project storage proj = projects[_projectId];
        require(!proj.finalized, "Project already finalized");
        // Determine the new proposal's ID as the next number in the array.
        uint256 proposalId = projectProposals[_projectId].length + 1;
        // Create the new proposal.
        Proposal memory newProposal = Proposal(proposalId, msg.sender, _proposalHash, 0);
        // Store the proposal in the array for that project.
        projectProposals[_projectId].push(newProposal);
        // Emit an event indicating a proposal was submitted.
        emit ProposalSubmitted(_projectId, proposalId, msg.sender, _proposalHash);
    }

    // FUNCTION: Vote for a proposal.
    // Each address can vote only once per project.
    function voteProposal(uint256 _projectId, uint256 _proposalId) external {
        require(_projectId > 0 && _projectId <= projectCount, "Project does not exist");
        Project storage proj = projects[_projectId];
        require(!proj.finalized, "Project finalized");
        // Ensure the caller has not already voted on this project.
        require(!projectVoted[_projectId][msg.sender], "Already voted");
        Proposal[] storage proposals = projectProposals[_projectId];
        require(_proposalId > 0 && _proposalId <= proposals.length, "Invalid proposal id");
        // Increment the vote count for the chosen proposal.
        proposals[_proposalId - 1].voteCount++;
        // Mark the caller as having voted for this project.
        projectVoted[_projectId][msg.sender] = true;
        // Emit an event for the vote.
        emit ProposalVoted(_projectId, _proposalId, msg.sender);
    }

    // FUNCTION: Finalize the project by selecting the winning proposal.
    // Only the project owner can finalize, and only once.
    function finalizeProposal(uint256 _projectId, uint256 _winningProposalId) external {
        require(_projectId > 0 && _projectId <= projectCount, "Project does not exist");
        Project storage proj = projects[_projectId];
        require(msg.sender == proj.owner, "Only project owner can finalize");
        require(!proj.finalized, "Project already finalized");
        Proposal[] storage proposals = projectProposals[_projectId];
        require(_winningProposalId > 0 && _winningProposalId <= proposals.length, "Invalid proposal id");
        // Mark the project as finalized and record the winning proposal.
        proj.finalized = true;
        proj.winningProposalId = _winningProposalId;
        // Emit an event indicating the finalization.
        emit ProposalFinalized(_projectId, _winningProposalId);
    }

    // FUNCTION: Contribute funds to a project.
    // This function is payable, so it can receive Ether.
    function contribute(uint256 _projectId) external payable {
        require(_projectId > 0 && _projectId <= projectCount, "Project does not exist");
        Project storage proj = projects[_projectId];
        require(!proj.finalized, "Project finalized");
        // Optionally, you could check if the current time is before the project's end date.
        proj.fundsRaised += msg.value;
        // Emit an event for the contribution.
        emit ContributionMade(_projectId, msg.sender, msg.value);
    }

    // ... (rest of your contract code)

    // Helper function to get the number of proposals for a given project.
    function getProposalCount(uint256 _projectId) public view returns (uint256) {
        return projectProposals[_projectId].length;
    }

}
