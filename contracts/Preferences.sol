pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./RBACPausable.sol";

contract PreferencesProxy is RBACPausable {
  using SafeMath for uint256;

  event Upgraded(address indexed implementation);

  address internal _preferencesImplementation;

  address[] public donators;
  mapping(address => uint256) public donations;
  uint256 public totalDonations;

  mapping(address => bytes32) public preferences;

  constructor(address[] _team) RBACBlock16(_team) public {

  }

  /**
   * @dev fallback function accepts payment as donation, thank you for donating!
   */
  function() public payable {
    donate();
  }

  function donate() public payable returns (bool) {
    // Add donator to the donators list if they're not already in there
    if (donations[msg.sender] == uint256(0)) {
      donators.push(msg.sender);
    }
    // Add the amount they've donated
    donations[msg.sender].add(msg.value);
    totalDonations.add(msg.value);
    return true;
  }

  function withdrawDonations() onlyAdmin public {
    msg.sender.transfer(this.balance);
  }

  function setPreferences(bytes32 _preferences) public {
    preferences[msg.sender] = _preferences;
  }
}
