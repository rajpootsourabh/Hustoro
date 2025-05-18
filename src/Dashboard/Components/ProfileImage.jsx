import React, { useState } from "react";
import { GoPerson } from "react-icons/go";

const ProfileImage = ({
  src,
  alt = "Profile",
  height = 10,
  width = 10,
  iconSize = 20,
  className = "",
}) => {
  const [imgError, setImgError] = useState(false);

  // Build dynamic Tailwind classes, e.g., "w-10 h-10"
  const sizeClass = `w-${width} h-${height}`;

  return (
    <div
      className={`flex items-center justify-center rounded-full overflow-hidden bg-gray-300 ${sizeClass} ${className}`}
    >
      {!src || imgError ? (
        <GoPerson size={iconSize} className="text-gray-600" />
      ) : (
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
};

export default ProfileImage;
