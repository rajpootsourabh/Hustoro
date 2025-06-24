import React, { useState } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SettingsIcon from "@mui/icons-material/Settings";
import BusinessIcon from "@mui/icons-material/Business";
import AppsIcon from "@mui/icons-material/Apps";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { getAvatarUrl } from "../../utils/avatarUtils.js";

const UserMenu = ({ loading, username, companyName, companyLogo, role, handleLogout, handleViewProfile, handleNavigateToSettings }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const name = username?.split("@")[0] || "User";

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const avatarUrl = companyLogo
    ? companyLogo
    : getAvatarUrl(companyName, "", "");

  return (
    <>
      {companyLogo ? (
        <Box
          onClick={handleOpen}
          sx={{
            width: 80, // fixed width
            height: 30,
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            padding: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={avatarUrl}
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      ) : (
        <Avatar
          onClick={handleOpen}
          sx={{
            bgcolor: "#0d9488",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          <PersonIcon fontSize="small" />
        </Avatar>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 250,
            py: 1,
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {/* Profile Info */}
        <Box
          sx={{
            px: 2,
            py: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#2D3748" }}>
            {companyName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "gray",
              fontSize: "1rem", // equivalent to Tailwind's text-md
            }}
          >
            {name}
          </Typography>

          {role === 4 && (
            <button
              onClick={() => {
                handleViewProfile();
                handleClose();
              }}
              className="w-[90%] mx-auto mt-3 text-sm text-teal-700 font-medium border border-teal-500 px-4 py-1.5 rounded-md hover:bg-teal-50 transition"
            >
              View profile
            </button>
          )}


        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Unified Options */}
        {/* Settings should not be shown if role === 5 */}
        {role !== 5 && (
          <MenuItem
            onClick={() => {
              handleNavigateToSettings();
              handleClose();
            }}
          >
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
        )}
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Switch company" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon><AppsIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Switch app" />
        </MenuItem> */}
        <MenuItem onClick={handleClose}>
          <ListItemIcon><HelpOutlineIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Help" />
        </MenuItem>

        {/* Logout */}
        <MenuItem onClick={handleLogout} disabled={loading}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
