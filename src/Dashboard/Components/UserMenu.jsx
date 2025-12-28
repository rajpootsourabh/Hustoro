import React, { useState } from "react";
import {
  Avatar,
  Menu,
  Typography,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";

const UserMenu = ({
  loading,
  handleLogout,
  handleViewProfile,
  handleNavigateToSettings,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isManager = JSON.parse(localStorage.getItem("isManager")) || false;
  const role = user?.role;
  const email = user?.email || "user@example.com";

  // Get data from appropriate tables based on role
  let displayName = "User";
  let profileImage = null;
  let companyName = "Company";
  let companyLogo = null;
  let firstName = "";
  let lastName = "";
  

  console.log("User data in UserMenu:", user); // Debug log
  console.log("Is Manager:", isManager); // Debug log
  

  switch (role) {
    case 1: // Employer/Admin
      // Get company data
      const company = user?.company || {};
      companyName = company?.name || "Company";
      companyLogo = company?.company_logo;
      displayName = companyName;
      profileImage = companyLogo;
      // Employer might have first_name/last_name in user table
      firstName = user?.first_name || "";
      lastName = user?.last_name || "";
      break;

    case 5: // Employee
      // Get employee data
      const employee = user?.employee || {};
      firstName = employee?.first_name || "";
      lastName = employee?.last_name || "";
      displayName = `${firstName} ${lastName}`.trim();
      profileImage = employee?.profile_image;
      // Employee company info
      const empCompany = user?.company || {};
      companyName = empCompany?.name || "Company";
      companyLogo = empCompany?.company_logo;
      break;

    case 6: // Candidate
      // Get candidate data
      const candidate = user?.candidate || {};
      firstName = candidate?.first_name || "";
      lastName = candidate?.last_name || "";
      displayName = `${firstName} ${lastName}`.trim();
      profileImage = candidate?.profile_pic;
      // Candidate company info
      const candCompany = user?.company || {};
      companyName = candCompany?.name || "Company";
      companyLogo = candCompany?.company_logo;
      break;

    default:
      // For other roles
      firstName = user?.first_name || "";
      lastName = user?.last_name || "";
      displayName = `${firstName} ${lastName}`.trim();
      if (!displayName.trim()) {
        displayName = email?.split("@")[0] || "User";
      }
      profileImage = user?.profile_image;
      const defCompany = user?.company || {};
      companyName = defCompany?.name || "Company";
      companyLogo = defCompany?.company_logo;
      break;
  }

  // Fallback for display name
  if (!displayName.trim() || displayName === "User") {
    displayName = email?.split("@")[0] || "User";
  }

  // Use display_name from user object if available (from backend)
  if (user?.display_name && user.display_name.trim()) {
    displayName = user.display_name;
  }

  // Use profile_image from user object if available (from backend)
  if (user?.profile_image && !profileImage) {
    profileImage = user.profile_image;
  }

  // Role display text
  const roleDisplay = role === 1 ? "Admin" :
    role === 5 ? (isManager ? "Manager" : "Employee") :
      role === 6 ? "Candidate" :
        `Role ${role}`;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Determine what to show in trigger - only show company logo for role 1
  const showCompanyLogo = role === 1 && companyLogo;
  const showProfileImage = profileImage && role !== 1;
  const showInitial = !showCompanyLogo && !showProfileImage;

  console.log("UserMenu debug:", {
    role,
    showCompanyLogo,
    showProfileImage,
    showInitial,
    displayName,
    profileImage,
    companyLogo
  });

  return (
    <>
      {/* Trigger Button */}
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: showCompanyLogo ? "#ffffff" : "#0d9488",
          border: showCompanyLogo ? "1px solid #e0e0e0" : "none",
          p: 0,
          overflow: "hidden",
          "&:hover": {
            backgroundColor: showCompanyLogo ? "#f5f5f5" : "#0b8377",
          },
        }}
      >
        {showCompanyLogo ? (
          <Box
            component="img"
            src={companyLogo}
            sx={{
              width: 36,
              height: 36,
              objectFit: "cover",
            }}
            alt={companyName}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.fallback-avatar').style.display = 'flex';
            }}
          />
        ) : showProfileImage ? (
          <Box
            component="img"
            src={profileImage}
            sx={{
              width: 36,
              height: 36,
              objectFit: "cover",
            }}
            alt={displayName}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.fallback-avatar').style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback avatar */}
        <Avatar
          className="fallback-avatar"
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#0d9488",
            color: "#ffffff",
            fontSize: "14px",
            display: showCompanyLogo || showProfileImage ? "none" : "flex",
          }}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      {/* Menu Popup */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
            width: 280,
            overflow: "visible",
            mt: 1,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: -8,
              right: 20,
              width: 16,
              height: 16,
              bgcolor: "background.paper",
              transform: "rotate(45deg)",
              borderTop: "1px solid #e5e7eb",
              borderLeft: "1px solid #e5e7eb",
            },
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* User Info Section with Centered Avatar */}
        <Box sx={{ p: 2.5, textAlign: "center" }}>
          {/* Avatar/Logo in Center */}
          <Avatar
            sx={{
              bgcolor: (showCompanyLogo || showProfileImage) ? "#ffffff" : "#0d9488",
              color: (showCompanyLogo || showProfileImage) ? "#374151" : "#ffffff",
              width: 65,
              height: 65,
              fontSize: 24,
              fontWeight: 600,
              mx: "auto",
              mb: 2,
              border: (showCompanyLogo || showProfileImage) ? "1px solid #e0e0e0" : "none",
              overflow: "hidden",
            }}
          >
            {showCompanyLogo ? (
              <Box
                component="img"
                src={companyLogo}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt={companyName}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#0d9488';
                  e.target.parentElement.style.color = '#ffffff';
                  e.target.parentElement.textContent = displayName.charAt(0).toUpperCase();
                }}
              />
            ) : showProfileImage ? (
              <Box
                component="img"
                src={profileImage}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt={displayName}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#0d9488';
                  e.target.parentElement.style.color = '#ffffff';
                  e.target.parentElement.textContent = displayName.charAt(0).toUpperCase();
                }}
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </Avatar>

          {/* User Info - Center Aligned */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#111827",
              fontSize: "1rem",
              lineHeight: 1.4,
              mb: 0.5,
            }}
          >
            {displayName}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              fontSize: "0.875rem",
              lineHeight: 1.4,
              mb: 1.5,
            }}
          >
            {email}
          </Typography>

          {/* Role Badge - Center Aligned */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#f3f4f6",
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              mb: 1.5,
              mx: "auto",
            }}
          >
            <BadgeIcon sx={{ fontSize: 14, color: "#6b7280", mr: 0.75 }} />
            <Typography
              variant="caption"
              sx={{
                color: "#4b5563",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            >
              {roleDisplay}
            </Typography>
          </Box>

          {/* Show Company Name for all roles except employer (where it's already the display name) */}
          {role !== 1 && companyName && companyName !== "Company" && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#f8fafc",
                px: 1.5,
                py: 1,
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                mt: 1,
              }}
            >
              <BusinessIcon sx={{ fontSize: 16, color: "#64748b", mr: 1 }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#334155",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                {companyName}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 0 }} />

        {/* Menu Options - Center Aligned Text */}
        <Box sx={{ py: 1 }}>
          {/* User Settings - Not for role 5 */}
          {role == 1 && (
            <Box
              onClick={() => {
                handleNavigateToSettings();
                handleClose();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                py: 1.25,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              <SettingsIcon
                sx={{
                  color: "#6b7280",
                  fontSize: 20,
                  mr: 1.5,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                Settings
              </Typography>
            </Box>
          )}

          {/* View Profile - Only for role 5 */}
          {role === 5 && (
            <Box
              onClick={() => {
                handleViewProfile();
                handleClose();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                py: 1.25,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              <PersonIcon
                sx={{
                  color: "#6b7280",
                  fontSize: 20,
                  mr: 1.5,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                View Profile
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          {/* Logout Option - Center Aligned */}
          <Box
            onClick={handleLogout}
            disabled={loading}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
              py: 1.25,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#fef2f2",
              },
              opacity: loading ? 0.6 : 1,
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            <LogoutIcon
              sx={{
                color: "#dc2626",
                fontSize: 20,
                mr: 1.5,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#dc2626",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              Logout
            </Typography>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default UserMenu;