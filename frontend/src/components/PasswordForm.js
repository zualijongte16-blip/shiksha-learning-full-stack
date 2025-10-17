import React, { useState } from 'react';


const PasswordForm = ({ username, signupData, onSetPassword, onBackToSignup, isPasswordChange = false }) => {

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isDuplicateUser, setIsDuplicateUser] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleGoToLogin = () => {
    // Use the parent's navigation handler if available
    if (onBackToSignup) {
      onBackToSignup();
    } else {
      // Fallback to direct navigation
      window.location.href = '/login';
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match!');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long!');
      return;
    }

    try {
      let response;
      let data;

      if (isPasswordChange) {
        // Password change request
        const userEmail = localStorage.getItem('userEmail');
        const token = localStorage.getItem('token');

        if (!token) {
          setMessage('User session expired. Please log in again.');
          return;
        }

        // For teachers, send teacherId instead of email
        const requestData = {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        };

        // Add teacherId for teachers, email for students
        if (userEmail && userEmail.includes('teacher.')) {
          const teacherId = userEmail.split('teacher.')[1].split('@')[0];
          requestData.teacherId = teacherId;
        } else {
          requestData.email = userEmail;
        }

        response = await fetch('http://localhost:5001/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Password change failed');
        }

        setMessage('Password changed successfully!');
        setTimeout(() => {
          window.location.reload(); // Refresh to update session
        }, 1500);

      } else {

        // For new user registration with password - try registration first

        const registrationData = {
          ...signupData,
          password: formData.newPassword,
        };

        response = await fetch('http://localhost:5001/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData),
        });

        data = await response.json();


        if (response.ok) {
          // Registration successful
          onSetPassword();
        } else {
          // If registration fails due to duplicate user, try to update password instead
          if (data.message && data.message.includes('already exists')) {
            setIsDuplicateUser(true);

            // Try to update password for existing user
            try {
              const updateResponse = await fetch('http://localhost:5001/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: signupData.email,
                  currentPassword: signupData.phone, // Default password is phone number
                  newPassword: formData.newPassword
                }),
              });

              const updateData = await updateResponse.json();

              if (updateResponse.ok) {
                // Password updated successfully for existing user
                onSetPassword();
                return;
              } else {
                throw new Error(updateData.message || 'Password update failed');
              }
            } catch (updateError) {
              console.error('Password update error:', updateError);
              if (data.existingUser) {
                throw new Error(`A user with phone number ${data.existingUser.phone} already exists with name "${data.existingUser.name}" and email "${data.existingUser.email}". If this is you, please use the "Go to Login & Reset Password" option instead of signing up again.`);
              } else {
                throw new Error('A user with this phone number already exists. If this is you, please reset your password instead of signing up again.');
              }
            }
          } else {
            throw new Error(data.message || 'Registration failed');
          }
        }

      }

    } catch (error) {
      console.error('Error:', error);
      setMessage(error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>{isPasswordChange ? 'Change Password' : 'Set Your Password'}</h2>
      {isPasswordChange && (
        <p className="password-info">
          Please change your temporary password to continue.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        {isPasswordChange && (
          <div className="form-group">
            <label htmlFor="currentPassword">
              Current Password {isPasswordChange && '(Teacher ID)'}
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder={isPasswordChange ? "Enter your Teacher ID" : "Enter current password"}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          {isPasswordChange ? 'Change Password' : 'Set Password'}
        </button>

        {isPasswordChange && (
          <button
            type="button"
            className="skip-btn"
            onClick={() => window.location.reload()}
          >
            Skip for Now
          </button>
        )}
      </form>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}

          {isDuplicateUser && (
            <div style={{ marginTop: '10px' }}>
              <button
                type="button"
                onClick={handleGoToLogin}
                className="reset-password-btn"
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Go to Login & Reset Password
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default PasswordForm;
