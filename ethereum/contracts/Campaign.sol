// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CampaignFactory {
    address[] public deployedContracts;

    function createCampaign(uint _minimumContribution) public {
        Campaign newComapign = new Campaign(_minimumContribution, msg.sender);
        deployedContracts.push(address(newComapign));
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedContracts;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool isComplete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    mapping(uint => Request) public requests;
    uint public reqCounter;
    uint public approverCount;

    modifier _onlyManager() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint _minimumContribution, address _manager) {
        manager = _manager;
        minimumContribution = _minimumContribution;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "minimum criteria not meet");
        approvers[msg.sender] = true;
        approverCount++;
    }

    function createRequest(
        string memory _description,
        uint _value,
        address _recipient
    ) public _onlyManager {
        Request storage newRequest = requests[reqCounter++];
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = payable(_recipient);
        newRequest.isComplete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender]);

        Request storage request = requests[index];

        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finilizeRequest(uint index) public _onlyManager {
        Request storage req = requests[index];
        require(!req.isComplete);
        require(req.approvalCount > (approverCount / 2));

        req.isComplete = true;
        req.recipient.transfer(req.value);
    }

    function getSummary()
        public
        view
        returns (uint, uint, uint, uint, address)
    {
        return (
            address(this).balance,
            minimumContribution,
            reqCounter,
            approverCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return reqCounter;
    }
}
