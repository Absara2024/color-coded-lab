import React, { useState } from 'react';

const UploadImageForm = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image before uploading.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('http://localhost:5005/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed. Please try again.');
      }

      const data = await response.json();

      if (!data.imageUrl) {
        throw new Error('No image URL returned.');
      }

      onImageUpload(data.imageUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Image upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md w-full max-w-md mx-auto">
      <label className="block mb-2 text-sm font-medium text-gray-700">Choose an image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {imagePreview && (
        <div className="mt-4">
          <p className="text-sm text-gray-700 font-medium">Image Preview:</p>
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 w-48 h-48 object-cover rounded border"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </form>
  );
};

export default UploadImageForm;
