import { User, Camera } from 'lucide-react';

export default function ProfileImageUpload({ profileImage, handleImageUpload }) {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file); // Send only the file to the parent
        }
    };

    return (
        <div className="flex items-center gap-6 mb-8">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                    {profileImage ? (
                        <img
                            src={typeof profileImage === 'string' ? profileImage : URL.createObjectURL(profileImage)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User className="h-12 w-12" />
                        </div>
                    )}
                </div>
                <label
                    htmlFor="profile-upload"
                    className="absolute -bottom-2 -right-2 bg-teal-600 text-white rounded-full p-2 cursor-pointer hover:bg-teal-700"
                    title="Upload photo"
                >
                    <Camera className="h-4 w-4" />
                </label>
                <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange} // 🔁 fixed
                />
            </div>
            <div>
                <p className="text-sm mb-1">Profile photo</p>
                <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 5MB</p>
            </div>
        </div>
    );
}
