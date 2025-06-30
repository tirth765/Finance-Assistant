import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Profile/Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    avatar: null,
    bio: '',
    occupation: '',
    company: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    monthlyIncome: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch user profile data
      const profileResponse = await axios.get('http://localhost:8000/api/v1/profile/me', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.data.success) {
        const profileData = profileResponse.data.data;
        setProfileData(prev => ({
          ...prev,
          ...profileData,
          dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '',
          avatar: null // Reset avatar file since we'll use the URL
        }));

        // Set the preview image if avatar exists
        if (profileData.avatar) {
          setPreviewImage(`http://localhost:8000/uploads/profile-pictures/${profileData.avatar}`);
        } else {
          setPreviewImage(null);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error fetching profile data' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    if (!isEditMode) return;
    
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    if (!isEditMode) return;
    
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        setMessage({
          type: 'error',
          text: 'Please select a valid image file (JPEG, PNG, or GIF)'
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: 'error',
          text: 'Image size should be less than 5MB'
        });
        return;
      }

      setProfileData(prev => ({
        ...prev,
        avatar: file
      }));

      // Revoke previous preview URL to prevent memory leaks
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditMode) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Append all profile data to formData
      Object.keys(profileData).forEach(key => {
        if (key === 'address') {
          Object.keys(profileData.address).forEach(addressKey => {
            if (profileData.address[addressKey]) {
              formData.append(`address[${addressKey}]`, profileData.address[addressKey]);
            }
          });
        } else if (key === 'avatar' && profileData[key] instanceof File) {
          formData.append('avatar', profileData[key]);
        } else if (profileData[key] !== null && key !== 'avatar') {
          // Don't append the avatar URL to form data
          formData.append(key, profileData[key]);
        }
      });

      const response = await axios.put('http://localhost:8000/api/v1/profile/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        setIsEditMode(false); // Disable edit mode after successful update
        await fetchProfileData(); // Refresh the data to get the updated avatar URL
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error updating profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // If canceling edit mode, reset the form to original data
      fetchProfileData();
    }
    setIsEditMode(!isEditMode);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile Settings</h2>
          <button 
            type="button" 
            onClick={toggleEditMode}
            className={`edit-button ${isEditMode ? 'cancel' : ''}`}
          >
            {isEditMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="profile-picture-section">
            <div className="profile-picture-container">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile" 
                  className="profile-picture"
                />
              ) : (
                <div className="profile-picture-placeholder">
                  <span>No Image</span>
                </div>
              )}
            </div>
            {isEditMode && (
              <div className="profile-picture-upload">
                <label htmlFor="avatar" className="upload-button">
                  Change Photo
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                required
                disabled={loading || !isEditMode}
                readOnly={!isEditMode}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                required
                disabled={loading || !isEditMode}
                readOnly={!isEditMode}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={loading || !isEditMode}
                readOnly={!isEditMode}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={profileData.dateOfBirth}
                onChange={handleInputChange}
                disabled={loading || !isEditMode}
                readOnly={!isEditMode}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Professional Information</h3>
            <div className="form-group">
              <label htmlFor="occupation">Occupation</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={profileData.occupation}
                onChange={handleInputChange}
                placeholder="Your job title"
                disabled={loading || !isEditMode}
                readOnly={!isEditMode}
              />
            </div>

            <div className="form-group">
              <label htmlFor="monthlyIncome">Monthly Income</label>
              <input
                type="number"
                id="monthlyIncome"
                name="monthlyIncome"
                value={profileData.monthlyIncome}
                onChange={handleInputChange}
                placeholder="Your monthly income"
                disabled={loading || !isEditMode}
                readOnly={!isEditMode}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Address Information</h3>
            <div className="form-group">
              <label htmlFor="address.street">Street</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={profileData.address.street}
                onChange={handleInputChange}
                placeholder="Street address"
                disabled={loading || !isEditMode}
                readOnly={!isEditMode}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.city">City</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={profileData.address.city}
                onChange={handleInputChange}
                placeholder="City"
                disabled={loading || !isEditMode}
                readOnly={!isEditMode}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.state">State</label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={profileData.address.state}
                onChange={handleInputChange}
                placeholder="State"
                disabled={loading || !isEditMode}
                readOnly={!isEditMode}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.country">Country</label>
              <input
                type="text"
                id="address.country"
                name="address.country"
                value={profileData.address.country}
                onChange={handleInputChange}
                placeholder="Country"
                disabled={loading || !isEditMode}
                readOnly={!isEditMode}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.zipCode">ZIP Code</label>
              <input
                type="text"
                id="address.zipCode"
                name="address.zipCode"
                value={profileData.address.zipCode}
                onChange={handleInputChange}
                placeholder="ZIP Code"
                disabled={loading || !isEditMode}
                readOnly={!isEditMode}
              />
            </div>
          </div>

          {isEditMode && (
            <div className="form-actions">
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;