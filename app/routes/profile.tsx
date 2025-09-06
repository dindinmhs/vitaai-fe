import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatLayout } from "layouts/chat";
import { useUserProfile } from "hooks/user";
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const Profile = () => {
    const { user, loading, error, updating, updateUserProfile, fetchUserProfile } = useUserProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper function to safely format dates
    const formatSafeDate = (dateString: string | undefined | null) => {
        if (!dateString) return 'Unknown';
        
        try {
            const date = parseISO(dateString);
            if (isValid(date)) {
                return formatDistanceToNow(date, { 
                    addSuffix: true, 
                    locale: id 
                });
            }
            return 'Invalid date';
        } catch (error) {
            console.error('Date parsing error:', error);
            return 'Invalid date';
        }
    };

    // Initialize edit form when user data loads
    useEffect(() => {
        if (user && !editName) {
            setEditName(user.name);
        }
    }, [user, editName]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.match(/\/(jpg|jpeg|png|gif)$/)) {
                alert('Only JPG, JPEG, PNG, and GIF files are allowed');
                return;
            }
            
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            setSelectedFile(file);
            
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) return;

        // Validate that at least one field is being updated
        const nameChanged = editName.trim() !== user.name;
        const fileSelected = selectedFile !== null;

        if (!nameChanged && !fileSelected) {
            alert('Please make at least one change before saving.');
            return;
        }

        try {
            const updates: { name?: string } = {};
            
            // Only include name if it's different
            if (nameChanged) {
                updates.name = editName.trim();
            }

            console.log('Submitting profile update:', { updates, hasFile: !!selectedFile });

            // Call update API
            await updateUserProfile(updates, selectedFile || undefined);
            
            // Reset form
            setIsEditing(false);
            setSelectedFile(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            alert('Profile updated successfully!');
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            alert(error.message || 'Failed to update profile. Please try again.');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditName(user?.name || "");
        handleRemoveFile();
    };

    // Fetch profile on component mount
    useEffect(() => {
        if (!user && !loading) {
            fetchUserProfile();
        }
    }, [user, loading, fetchUserProfile]);

    if (loading) {
        return (
            <ChatLayout>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading profile...</p>
                    </div>
                </div>
            </ChatLayout>
        );
    }

    if (error && !user) {
        return (
            <ChatLayout>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Profile</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={fetchUserProfile}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </ChatLayout>
        );
    }

    if (!user) {
        return (
            <ChatLayout>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-800">No Profile Data</h2>
                        <p className="text-gray-600">Unable to load profile information.</p>
                    </div>
                </div>
            </ChatLayout>
        );
    }

    return (
        <ChatLayout>
            <div className="flex-1 bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
                        <p className="text-gray-600 mt-1">Manage your account information</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="max-w-4xl mx-auto p-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-4xl mx-auto p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                        {/* Profile Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    {/* Profile Picture */}
                                    <div className="relative">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-20 h-20 rounded-full object-cover"
                                            />
                                        ) : user.imgUrl ? (
                                            <img
                                                src={user.imgUrl}
                                                alt={user.name}
                                                className="w-20 h-20 rounded-full object-cover"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                                                {user? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : null}
                                            </div>
                                        )}
                                        
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                                                title="Change profile picture"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                                        <p className="text-gray-600">{user.email}</p>
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                            user.role === 'ADMIN' 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Edit Form */}
                        {isEditing && (
                            <form onSubmit={handleSubmit} className="p-6 border-b border-gray-200">
                                <div className="space-y-6">
                                    {/* File Input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.gif"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    {/* Upload Instructions */}
                                    <div className="text-sm text-gray-600">
                                        <p className="mb-1">📷 Click on your profile picture to change it</p>
                                        <p>Supported formats: JPG, JPEG, PNG, GIF (max 5MB)</p>
                                    </div>

                                    {/* Selected File Info */}
                                    {selectedFile && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-800">{selectedFile.name}</p>
                                                        <p className="text-xs text-blue-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFile}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Remove file"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Name Field */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={updating}
                                            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                        >
                                            {updating && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            )}
                                            <span>{updating ? 'Updating...' : 'Save Changes'}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={updating}
                                            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Profile Info */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                    <p className="text-gray-800">{user.email}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                                    <p className="text-gray-800">{user.role}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
                                    <p className="text-gray-800">
                                        {formatSafeDate(user.createdAt)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                                    <p className="text-gray-800">
                                        {formatSafeDate(user.updatedAt)}
                                    </p>
                                </div>

                                {user.verifiedAt && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Verified</label>
                                        <p className="text-green-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {formatSafeDate(user.verifiedAt)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </ChatLayout>
    );
};

export default Profile;