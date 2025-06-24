// utils/avatarUtils.js
export const getAvatarUrl = (first, last, profilePic) =>
  profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(first + " " + last)}`;
