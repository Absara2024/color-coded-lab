import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 

const Modal = ({ isOpen, onClose, selectedSchool, setGraduates }) => {
  const [formData, setFormData] = useState({
    name: '',
    graduationYear: '',
    cclYear: '',
    photoUrl: '',  
    location: '',  
  });

  const [imageFile, setImageFile] = useState(null);  
  const [preview, setPreview] = useState(null);      
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [error, setError] = useState(null);  

  useEffect(() => {
    if (selectedSchool) {
      setFormData((prev) => ({ ...prev, location: selectedSchool }));
    }
  }, [selectedSchool]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);  
      reader.readAsDataURL(file); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let uploadedImageUrl = '';

      if (imageFile) {
        const formImageData = new FormData();
        formImageData.append('image', imageFile);

        const uploadRes = await fetch('http://localhost:5005/api/upload', {
          method: 'POST',
          body: formImageData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.imageUrl) {
          throw new Error(uploadData.message || 'Image upload failed');
        }

        uploadedImageUrl = uploadData.imageUrl;
      }

      const response = await fetch('http://localhost:5005/api/graduationRecords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          schoolName: selectedSchool,  
          photoUrl: uploadedImageUrl,  
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGraduates((prev) => [...prev, data.graduate]);  
        onClose();  
      } else {
        setError(data.message || 'Failed to add graduate');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Submission failed: ' + err.message);
    } finally {
      setIsSubmitting(false);  
    }
  };

  if (!isOpen) return null;  

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-3"
      onClick={(e) => e.target === e.currentTarget && onClose()}  
    >
      <div
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
        >
          <X size={24} /> 
        </button>

        <h2 className="text-xl font-bold mb-4">Add Yourself</h2>

        {error && <div className="text-red-600 text-sm mb-3">{error}</div>} 

        <form onSubmit={handleSubmit} className="space-y-4">
  
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            name="graduationYear"
            placeholder="Graduation Year"
            value={formData.graduationYear}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />

          <div className="w-full border p-2 rounded bg-gray-100">
            {formData.location || 'School Location'}
          </div>

          <input
            type="number"
            name="cclYear"
            placeholder="CCL Year"
            value={formData.cclYear}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover mt-2 rounded-md border"
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
