pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/ownership/rbac/RBACWithAdmin.sol";

contract RBACBlock16 is RBACWithAdmin {

  string constant ROLE_TEAM = "team";

  constructor(address[] _team) public {
    addRole(msg.sender, ROLE_TEAM);
    for (uint256 i = 0; i < _team.length; i++) {
      addRole(_team[i], ROLE_TEAM);
    }
  }

  modifier onlyAdminOrTeam()
  {
    require(
      hasRole(msg.sender, ROLE_ADMIN) ||
      hasRole(msg.sender, ROLE_TEAM)
    );
    _;
  }
}
