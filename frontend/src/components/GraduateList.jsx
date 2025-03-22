import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GraduateList = ({
  selectedSchool,
  onOpenModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [graduates, setGraduates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGraduates = async () => {
      if (!selectedSchool) {
        setGraduates([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/graduation-records/school/${selectedSchool}`);
        if (response.ok) {
          const data = await response.json();
          setGraduates(data);
        } else {
          console.error('Failed to fetch graduates:', response.status);
          setGraduates([]);
        }
      } catch (error) {
        console.error('Error fetching graduates:', error);
        setGraduates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraduates();
  }, [selectedSchool]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-20 right-4 max-w-sm w-full">
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between p-4 bg-black bg-opacity-30 text-white rounded-t-lg shadow-lg hover:bg-opacity-50 transition-all"
      >
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          <span className="font-bold text-white">{selectedSchool || 'Select School'}</span>
          </div>
        {isExpanded ? (
          <ChevronDown size={20} className="text-white" />
        ) : (
          <ChevronUp size={20} className="text-white" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-b-lg bg-neutral-800/70 flex flex-col"
            style={{ maxHeight: 'calc(3 * 115px + 40px)' }}
          >
            <div className="overflow-y-auto">
              <div className="">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading...
                  </div>
                ) : graduates.length > 0 ? (
                  <div className="space-y-2 p-2">
                    {graduates.map((graduate) => (
                      <motion.div
                        key={graduate._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-white rounded-lg shadow-md"
                      >
                        <h3 className="font-medium text-black">{graduate.name}</h3>
                        <p className="text-sm text-gray-700">Graduation Year: {graduate.graduationYear}</p>
                        <p className="text-sm text-gray-700">CCL Year: {graduate.cclYear}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {selectedSchool ? "No graduates found for this school" : "Select a school"}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onOpenModal}
              className="w-full flex items-center justify-center gap-2 p-3 text-white hover:bg-gray-700 transition-colors border-t border-gray-200 bg-black rounded-b-lg"
            >
              <Plus size={20} />
              <span>Add Yourself</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GraduateList;