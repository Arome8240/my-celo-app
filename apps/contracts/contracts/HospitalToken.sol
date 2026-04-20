// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title HospitalToken
/// @notice Full-featured ERC-20 for payments and incentives across hospital partners.
contract HospitalToken is
    ERC20,
    ERC20Burnable,
    ERC20Capped,
    ERC20Pausable,
    ERC20Permit,
    AccessControl
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    error ZeroAddress();
    error InvalidCap();

    /// @notice Creates token and optionally mints initial supply.
    /// @param name_ Token name.
    /// @param symbol_ Token symbol.
    /// @param admin Address receiving admin, minter and pauser roles.
    /// @param initialRecipient Address receiving initial supply.
    /// @param initialSupply Initial token amount in 18-decimal base units.
    /// @param maxSupply Hard cap in 18-decimal base units.
    constructor(
        string memory name_,
        string memory symbol_,
        address admin,
        address initialRecipient,
        uint256 initialSupply,
        uint256 maxSupply
    ) ERC20(name_, symbol_) ERC20Capped(maxSupply) ERC20Permit(name_) {
        if (admin == address(0) || initialRecipient == address(0)) revert ZeroAddress();
        if (maxSupply == 0) revert InvalidCap();
        if (initialSupply > maxSupply) revert ERC20ExceededCap(initialSupply, maxSupply);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);

        if (initialSupply > 0) {
            _mint(initialRecipient, initialSupply);
        }
    }

    /// @notice Mints tokens. Caller must have MINTER_ROLE.
    /// @param to Recipient address.
    /// @param amount Amount in 18-decimal base units.
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        _mint(to, amount);
    }

    /// @notice Pauses all token transfers, mints and burns.
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /// @notice Unpauses token operations.
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /// @dev Resolves multiple inheritance overrides in OpenZeppelin extensions.
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Capped, ERC20Pausable) {
        super._update(from, to, value);
    }
}
