import React, { useState } from 'react';

const GraduateForm = ({ selectedSchool, setGraduates, onClose }) => {
  const [name, setName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [location, setLocation] = useState('');
  const [cclYear, setCclYear] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !graduationYear || !location || !cclYear) {
      setError('Please fill out all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5005/api/graduationRecords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          graduationYear,
          schoolName: selectedSchool,
          location,
          cclYear,
          photoUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGraduates((prev) => [...prev, data.graduate]);
        onClose();
      } else {
        setError(data.message || 'Failed to add graduate');
      }
    } catch (error) {
      console.error(error);
      setError('Error submitting form');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">Graduation Year</label>
        <input
          id="graduationYear"
          type="number"
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (City)</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="cclYear" className="block text-sm font-medium text-gray-700">CCL Year</label>
        <input
          id="cclYear"
          type="number"
          value={cclYear}
          onChange={(e) => setCclYear(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">Photo URL (Optional)</label>
        <input
          id="photoUrl"
          type="url"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default GraduateForm;
