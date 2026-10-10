import { useState, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export default function PersonalDetailsForm() {
  const [formData, setFormData] = useState({
    full_name: '', fathers_name: '', mothers_name: '', date_of_birth: '', gender: '', marital_status: '',
    email: '', mobile_number: '', alternate_mobile_number: '', full_address: '', city: '', state: '', pin_code: '', country: '',
    qualification_10th: '', percentage_10th: '', qualification_12th: '', percentage_12th: '', graduation_qualification: '', college_university: '', passing_year: '',
    current_occupation: '', company_name: '', designation: '', work_experience: '', annual_salary: '',
    profile_photo_url: '', skills: '', hobbies: '', about_yourself: '', terms_accepted: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const fileInputRef = useRef(null);

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
      case 'mobile_number':
      case 'alternate_mobile_number':
        if (!value && name === 'alternate_mobile_number') return ''; // Optional
        return /^\d{10}$/.test(value) ? '' : 'Must be exactly 10 digits';
      case 'pin_code':
        return /^\d{6}$/.test(value) ? '' : 'Must be a 6-digit Indian PIN';
      case 'passing_year':
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        return (year >= 1950 && year <= currentYear + 5) ? '' : 'Enter a valid passing year';
      case 'terms_accepted':
        return value ? '' : 'You must accept the terms';
      default:
        // Basic required check for other fields except optional ones
        const optional = ['alternate_mobile_number', 'annual_salary', 'profile_photo_url'];
        if (!optional.includes(name) && (!value || value.toString().trim() === '')) {
          return 'This field is required';
        }
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    
    // Clear error for this field as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (700KB)
    if (file.size > 700 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'File size must be under 700 KB' }));
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, photo: 'Only JPG, PNG, or WEBP allowed' }));
      return;
    }

    setErrors(prev => ({ ...prev, photo: '' }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setFormData(prev => ({ ...prev, profile_photo_url: reader.result })); // Storing as base64 for simplicity
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate all
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      setSubmitStatus({ type: 'error', message: 'Please fix the errors in the form before submitting.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_URL}/api/forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save record');
      }

      setSubmitStatus({ type: 'success', message: 'Your details have been saved successfully!' });
      
      // Reset form
      setFormData({
        full_name: '', fathers_name: '', mothers_name: '', date_of_birth: '', gender: '', marital_status: '',
        email: '', mobile_number: '', alternate_mobile_number: '', full_address: '', city: '', state: '', pin_code: '', country: '',
        qualification_10th: '', percentage_10th: '', qualification_12th: '', percentage_12th: '', graduation_qualification: '', college_university: '', passing_year: '',
        current_occupation: '', company_name: '', designation: '', work_experience: '', annual_salary: '',
        profile_photo_url: '', skills: '', hobbies: '', about_yourself: '', terms_accepted: false
      });
      setPhotoPreview(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
      setErrors({});
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitStatus && (
        <div className={`alert alert-${submitStatus.type}`}>
          {submitStatus.type === 'success' 
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          }
          {submitStatus.message}
        </div>
      )}

      {/* 1. Personal Details */}
      <div className="form-section">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Personal Details
        </h2>
        <div className="grid-2">
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className={errors.full_name ? 'error' : ''} />
            {errors.full_name && <span className="error-text">{errors.full_name}</span>}
          </div>
          <div className="form-group">
            <label>Father's Name *</label>
            <input type="text" name="fathers_name" value={formData.fathers_name} onChange={handleChange} className={errors.fathers_name ? 'error' : ''} />
            {errors.fathers_name && <span className="error-text">{errors.fathers_name}</span>}
          </div>
          <div className="form-group">
            <label>Mother's Name *</label>
            <input type="text" name="mothers_name" value={formData.mothers_name} onChange={handleChange} className={errors.mothers_name ? 'error' : ''} />
            {errors.mothers_name && <span className="error-text">{errors.mothers_name}</span>}
          </div>
          <div className="form-group">
            <label>Date of Birth *</label>
            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className={errors.date_of_birth ? 'error' : ''} />
            {errors.date_of_birth && <span className="error-text">{errors.date_of_birth}</span>}
          </div>
          <div className="form-group">
            <label>Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className={errors.gender ? 'error' : ''}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="error-text">{errors.gender}</span>}
          </div>
          <div className="form-group">
            <label>Marital Status *</label>
            <select name="marital_status" value={formData.marital_status} onChange={handleChange} className={errors.marital_status ? 'error' : ''}>
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
            {errors.marital_status && <span className="error-text">{errors.marital_status}</span>}
          </div>
        </div>
      </div>

      {/* 2. Contact Details */}
      <div className="form-section">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          Contact Details
        </h2>
        <div className="grid-2">
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Mobile Number *</label>
            <input type="tel" name="mobile_number" placeholder="10 digits" value={formData.mobile_number} onChange={handleChange} className={errors.mobile_number ? 'error' : ''} />
            {errors.mobile_number && <span className="error-text">{errors.mobile_number}</span>}
          </div>
          <div className="form-group">
            <label>Alternate Mobile (Optional)</label>
            <input type="tel" name="alternate_mobile_number" placeholder="10 digits" value={formData.alternate_mobile_number} onChange={handleChange} className={errors.alternate_mobile_number ? 'error' : ''} />
            {errors.alternate_mobile_number && <span className="error-text">{errors.alternate_mobile_number}</span>}
          </div>
          <div className="form-group">
            <label>City *</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'error' : ''} />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>
          <div className="form-group">
            <label>State *</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} className={errors.state ? 'error' : ''} />
            {errors.state && <span className="error-text">{errors.state}</span>}
          </div>
          <div className="form-group">
            <label>PIN Code *</label>
            <input type="text" name="pin_code" placeholder="6 digits" value={formData.pin_code} onChange={handleChange} className={errors.pin_code ? 'error' : ''} />
            {errors.pin_code && <span className="error-text">{errors.pin_code}</span>}
          </div>
          <div className="form-group">
            <label>Country *</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} className={errors.country ? 'error' : ''} />
            {errors.country && <span className="error-text">{errors.country}</span>}
          </div>
        </div>
        <div className="form-group" style={{marginTop: '1.5rem'}}>
          <label>Full Address *</label>
          <textarea name="full_address" rows="3" value={formData.full_address} onChange={handleChange} className={errors.full_address ? 'error' : ''} />
          {errors.full_address && <span className="error-text">{errors.full_address}</span>}
        </div>
      </div>

      {/* 3. Education Details */}
      <div className="form-section">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          Education Details
        </h2>
        <div className="grid-2">
          <div className="form-group">
            <label>10th Qualification *</label>
            <input type="text" name="qualification_10th" value={formData.qualification_10th} onChange={handleChange} className={errors.qualification_10th ? 'error' : ''} />
            {errors.qualification_10th && <span className="error-text">{errors.qualification_10th}</span>}
          </div>
          <div className="form-group">
            <label>10th Percentage/CGPA *</label>
            <input type="text" name="percentage_10th" value={formData.percentage_10th} onChange={handleChange} className={errors.percentage_10th ? 'error' : ''} />
            {errors.percentage_10th && <span className="error-text">{errors.percentage_10th}</span>}
          </div>
          <div className="form-group">
            <label>12th Qualification *</label>
            <input type="text" name="qualification_12th" value={formData.qualification_12th} onChange={handleChange} className={errors.qualification_12th ? 'error' : ''} />
            {errors.qualification_12th && <span className="error-text">{errors.qualification_12th}</span>}
          </div>
          <div className="form-group">
            <label>12th Percentage/CGPA *</label>
            <input type="text" name="percentage_12th" value={formData.percentage_12th} onChange={handleChange} className={errors.percentage_12th ? 'error' : ''} />
            {errors.percentage_12th && <span className="error-text">{errors.percentage_12th}</span>}
          </div>
          <div className="form-group">
            <label>Graduation Qualification *</label>
            <input type="text" name="graduation_qualification" value={formData.graduation_qualification} onChange={handleChange} className={errors.graduation_qualification ? 'error' : ''} />
            {errors.graduation_qualification && <span className="error-text">{errors.graduation_qualification}</span>}
          </div>
          <div className="form-group">
            <label>College / University *</label>
            <input type="text" name="college_university" value={formData.college_university} onChange={handleChange} className={errors.college_university ? 'error' : ''} />
            {errors.college_university && <span className="error-text">{errors.college_university}</span>}
          </div>
          <div className="form-group">
            <label>Passing Year *</label>
            <input type="number" name="passing_year" placeholder="YYYY" value={formData.passing_year} onChange={handleChange} className={errors.passing_year ? 'error' : ''} />
            {errors.passing_year && <span className="error-text">{errors.passing_year}</span>}
          </div>
        </div>
      </div>

      {/* 4. Professional Details */}
      <div className="form-section">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          Professional Details
        </h2>
        <div className="grid-2">
          <div className="form-group">
            <label>Current Occupation *</label>
            <input type="text" name="current_occupation" value={formData.current_occupation} onChange={handleChange} className={errors.current_occupation ? 'error' : ''} />
            {errors.current_occupation && <span className="error-text">{errors.current_occupation}</span>}
          </div>
          <div className="form-group">
            <label>Company Name *</label>
            <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className={errors.company_name ? 'error' : ''} />
            {errors.company_name && <span className="error-text">{errors.company_name}</span>}
          </div>
          <div className="form-group">
            <label>Designation *</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} className={errors.designation ? 'error' : ''} />
            {errors.designation && <span className="error-text">{errors.designation}</span>}
          </div>
          <div className="form-group">
            <label>Work Experience (in years) *</label>
            <input type="text" name="work_experience" value={formData.work_experience} onChange={handleChange} className={errors.work_experience ? 'error' : ''} />
            {errors.work_experience && <span className="error-text">{errors.work_experience}</span>}
          </div>
          <div className="form-group">
            <label>Annual Salary (Optional)</label>
            <input type="text" name="annual_salary" value={formData.annual_salary} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* 5. Additional Details */}
      <div className="form-section">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          Additional Details
        </h2>
        
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label>Profile Photo (Max 700 KB, JPG/PNG/WEBP)</label>
          <div className="photo-upload">
            <div className="photo-preview">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              )}
            </div>
            <div>
              <label htmlFor="photo-upload" className="photo-input-label">Upload Photo</label>
              <input id="photo-upload" type="file" accept="image/jpeg, image/png, image/webp" onChange={handlePhotoUpload} ref={fileInputRef} />
              {errors.photo && <div className="error-text" style={{position: 'static', marginTop: '0.5rem'}}>{errors.photo}</div>}
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Skills *</label>
            <input type="text" name="skills" placeholder="e.g. React, Node.js, Design" value={formData.skills} onChange={handleChange} className={errors.skills ? 'error' : ''} />
            {errors.skills && <span className="error-text">{errors.skills}</span>}
          </div>
          <div className="form-group">
            <label>Hobbies *</label>
            <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} className={errors.hobbies ? 'error' : ''} />
            {errors.hobbies && <span className="error-text">{errors.hobbies}</span>}
          </div>
        </div>
        
        <div className="form-group" style={{marginTop: '1.5rem'}}>
          <label>About Yourself *</label>
          <textarea name="about_yourself" rows="4" value={formData.about_yourself} onChange={handleChange} className={errors.about_yourself ? 'error' : ''} />
          {errors.about_yourself && <span className="error-text">{errors.about_yourself}</span>}
        </div>

        <div className="checkbox-group">
          <input type="checkbox" id="terms" name="terms_accepted" checked={formData.terms_accepted} onChange={handleChange} />
          <label htmlFor="terms" style={{ color: errors.terms_accepted ? 'var(--error-color)' : 'inherit' }}>
            I accept the Terms & Conditions and declare that the information provided is correct. *
          </label>
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            Saving Details...
          </>
        ) : 'Submit Details'}
      </button>
    </form>
  );
}
