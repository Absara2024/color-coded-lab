import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Users, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';

const GraduateList = ({ selectedSchool }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [graduates, setGraduates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGraduates = async () => {
      if (!selectedSchool) {
        setGraduates([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:5005/api/graduationRecords/school/${encodeURIComponent(selectedSchool.trim())}`
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Error fetching data');
        setGraduates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch graduates');
        setGraduates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraduates();
  }, [selectedSchool]);

  const toggleExpand = () => setIsExpanded((prev) => !prev);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="fixed bottom-20 right-4 max-w-sm w-full z-40">
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between p-4 bg-black bg-opacity-30 text-white rounded-t-lg shadow-lg hover:bg-opacity-50 transition-all"
      >
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          <span className="font-bold">{selectedSchool || 'Select School'}</span>
        </div>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-b-lg bg-neutral-800/70"
          >
            <div className="overflow-y-auto max-h-[400px]">
              {error && <div className="p-4 text-center text-red-500">{error}</div>}
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : graduates.length > 0 ? (
                <div className="space-y-2 p-2">
                  {graduates.map((graduate) => (
                    <motion.div
                      key={graduate._id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-white rounded-lg shadow-md"
                    >
                      <h3 className="font-medium text-black">{graduate.name}</h3>
                      <p className="text-sm text-gray-700">Graduation Year: {graduate.graduationYear}</p>
                      <p className="text-sm text-gray-700">Location: {graduate.location}</p>
                      <p className="text-sm text-gray-700">CCL Year: {graduate.cclYear}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No graduates found</div>
              )}
            </div>

            {selectedSchool && (
              <button
                onClick={handleOpenModal}
                className="w-full flex items-center justify-center gap-2 p-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-b-lg text-sm"
              >
                <Plus size={18} />
                <span>Add Yourself</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedSchool={selectedSchool}
          setGraduates={setGraduates}
        />
      )}
    </div>
  );
};

export default GraduateList;
