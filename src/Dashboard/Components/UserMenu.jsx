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
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { getAvatarUrl } from "../../utils/avatarUtils.js";

const UserMenu = ({
  loading,
  handleLogout,
  handleViewProfile,
  handleNavigateToSettings,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // ✅ Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const email = user?.email || "user@example.com";
  const company = user?.company || {};
  const companyName = company?.name || "Company";
  const companyLogo = company?.company_logo;

  const name = email?.split("@")[0] || "User";

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
            width: 80,
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
              fontSize: "1rem",
            }}
          >
            {name}
          </Typography>

          {/* ✅ Conditionally show View Profile for role === 5 */}
          {role === 5 && (
            <button
              onClick={() => {
                handleViewProfile();
                handleClose();
              }}
              className="w-[90%] mx-auto mt-3 text-sm text-teal-700 font-medium border border-teal-500 px-4 py-1.5 rounded-md hover:bg-teal-50 transition flex items-center justify-center gap-2"
            >
              <VisibilityIcon fontSize="small" />
              View Profile
            </button>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Settings (only if not role 5) */}
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

        {/* Help Option */}
        <MenuItem onClick={handleClose}>
          <ListItemIcon><HelpOutlineIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Help" />
        </MenuItem>

        {/* Logout Option */}
        <MenuItem onClick={handleLogout} disabled={loading}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
