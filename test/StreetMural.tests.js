const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StreetMural Contract", function () {
  let StreetMural;
  let streetMural;
  let deployer, addr1, addr2;

  // Deploy a fresh contract before each test suite
  beforeEach(async function () {
    [deployer, addr1, addr2] = await ethers.getSigners();
    StreetMural = await ethers.getContractFactory("StreetMural");
    streetMural = await StreetMural.deploy();
    await streetMural.waitForDeployment();
  });

  describe("Project Creation", function () {
    it("should create a project and emit a ProjectCreated event", async function () {
      // Set up test parameters
      const goalAmount = ethers.parseEther("10");
      const milestoneCount = 3;
      // Set the end date to one hour from now
      const endDate = Math.floor(Date.now() / 1000) + 3600;
      const metaHash = "ipfs://examplehash";

      // Call createProject and verify the event is emitted with correct arguments
      await expect(
        streetMural.createProject(goalAmount, milestoneCount, endDate, metaHash)
      )
        .to.emit(streetMural, "ProjectCreated")
        .withArgs(1, deployer.address, goalAmount, milestoneCount, endDate, metaHash);

      // Retrieve the stored project and check its properties
      const project = await streetMural.projects(1);
      expect(project.id).to.equal(1);
      expect(project.owner).to.equal(deployer.address);
      expect(project.goalAmount).to.equal(goalAmount);
      expect(project.fundsRaised).to.equal(0);
      expect(project.milestoneCount).to.equal(milestoneCount);
      expect(project.endDate).to.equal(endDate);
      expect(project.metaHash).to.equal(metaHash);
      expect(project.finalized).to.be.false;
    });
  });

  describe("Contributions", function () {
    beforeEach(async function () {
      // Create a project before testing contributions
      const goalAmount = ethers.parseEther("10");
      const milestoneCount = 3;
      const endDate = Math.floor(Date.now() / 1000) + 3600;
      const metaHash = "ipfs://examplehash";
      await streetMural.createProject(goalAmount, milestoneCount, endDate, metaHash);
    });

    it("should allow contributions and update fundsRaised", async function () {
      const contribution = ethers.parseEther("1");

      // addr1 contributes to project 1
      await expect(
        streetMural.connect(addr1).contribute(1, { value: contribution })
      )
        .to.emit(streetMural, "ContributionMade")
        .withArgs(1, addr1.address, contribution);

      // Check that the fundsRaised is updated
      const project = await streetMural.projects(1);
      expect(project.fundsRaised).to.equal(contribution);
    });
  });

  describe("Proposal Submission and Voting", function () {
    beforeEach(async function () {
      // Create a project and submit two proposals
      const goalAmount = ethers.parseEther("10");
      const milestoneCount = 3;
      const endDate = Math.floor(Date.now() / 1000) + 3600;
      const metaHash = "ipfs://examplehash";
      await streetMural.createProject(goalAmount, milestoneCount, endDate, metaHash);

      // addr1 submits a proposal for project 1
      await streetMural.connect(addr1).submitProposal(1, "ipfs://proposalhash1");
      // addr2 submits another proposal for project 1
      await streetMural.connect(addr2).submitProposal(1, "ipfs://proposalhash2");
    });
    
    it("should register proposals and store them correctly", async function () {
        // Use the helper function to get the number of proposals:
        const proposalCount = await streetMural.getProposalCount(1);
        expect(proposalCount).to.equal(2);
      
        // Retrieve each proposal by providing both the project ID and the index:
        const proposal1 = await streetMural.projectProposals(1, 0);
        const proposal2 = await streetMural.projectProposals(1, 1);
      
        expect(proposal1.id).to.equal(1);
        expect(proposal1.proposer).to.equal(addr1.address);
        expect(proposal1.proposalHash).to.equal("ipfs://proposalhash1");
      
        expect(proposal2.id).to.equal(2);
        expect(proposal2.proposer).to.equal(addr2.address);
        expect(proposal2.proposalHash).to.equal("ipfs://proposalhash2");
      });
      

      it("should allow a user to vote on a proposal and prevent double voting", async function () {
        // addr1 votes for proposal 1
        await expect(
          streetMural.connect(addr1).voteProposal(1, 1)
        )
          .to.emit(streetMural, "ProposalVoted")
          .withArgs(1, 1, addr1.address);
      
        // Retrieve the proposal individually using the two-argument getter:
        const proposal1 = await streetMural.projectProposals(1, 0);
        expect(proposal1.voteCount).to.equal(1);
      
        // Trying to vote a second time by addr1 should revert
        await expect(
          streetMural.connect(addr1).voteProposal(1, 1)
        ).to.be.revertedWith("Already voted");
      });
      
  });

  describe("Finalizing a Proposal", function () {
    beforeEach(async function () {
      // Create a project and submit proposals
      const goalAmount = ethers.parseEther("10");
      const milestoneCount = 3;
      const endDate = Math.floor(Date.now() / 1000) + 3600;
      const metaHash = "ipfs://examplehash";
      await streetMural.createProject(goalAmount, milestoneCount, endDate, metaHash);
      await streetMural.connect(addr1).submitProposal(1, "ipfs://proposalhash1");
      await streetMural.connect(addr2).submitProposal(1, "ipfs://proposalhash2");
      // Let addr1 vote for proposal 1
      await streetMural.connect(addr1).voteProposal(1, 1);
    });

    it("should not allow non-owners to finalize the project", async function () {
      // addr1 is not the project owner, so finalization should revert
      await expect(
        streetMural.connect(addr1).finalizeProposal(1, 1)
      ).to.be.revertedWith("Only project owner can finalize");
    });

    it("should allow the project owner to finalize the project and set the winning proposal", async function () {
      // The deployer is the project owner and finalizes the project with proposal 1 as the winner
      await expect(
        streetMural.finalizeProposal(1, 1)
      )
        .to.emit(streetMural, "ProposalFinalized")
        .withArgs(1, 1);

      const project = await streetMural.projects(1);
      expect(project.finalized).to.be.true;
      expect(project.winningProposalId).to.equal(1);
    });
  });
});
