import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from '@mui/icons-material/Logout';

const UserMenu = ({ loading,username, handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for the menu

  // Open Menu
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close Menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* User Icon */}
      <IconButton onClick={handleOpen} color="inherit">
        <AccountCircleIcon fontSize="medium" />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        className="min-w-40"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled>
          <Typography variant="body1">👤 {username.split("@")[0]}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout} disabled={loading}><LogoutIcon/> Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
