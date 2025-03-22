import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GraduateList = ({ 
  graduates, 
  selectedSchool, 
  onOpenModal, 
  isLoading = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-20 right-4 max-w-sm w-full">
      {/* School Header Button */}
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between p-4 bg-white bg-opacity-90 rounded-t-lg shadow-lg hover:bg-opacity-100 transition-all"
      >
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          <span className="font-semibold">{selectedSchool || 'Select School'}</span>
        </div>
        {isExpanded ? (
          <ChevronDown size={20} className="text-gray-600" />
        ) : (
          <ChevronUp size={20} className="text-gray-600" />
        )}
      </button>

      {/* Graduates List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white bg-opacity-90 rounded-b-lg shadow-lg"
          >
            {/* Add Yourself Button */}
            <button
              onClick={onOpenModal}
              className="w-full flex items-center justify-center gap-2 p-3 text-blue-600 hover:bg-blue-50 transition-colors border-b border-gray-200"
            >
              <Plus size={20} />
              <span>Add Yourself</span>
            </button>

            {/* Graduates */}
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading...
                </div>
              ) : graduates?.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {graduates.map((graduate) => (
                    <motion.div
                      key={graduate._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{graduate.name}</h3>
                          <p className="text-sm text-gray-500">
                            Graduation Year: {graduate.graduationYear}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            CCL Year: {graduate.cclYear}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No graduates found for this school
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GraduateList;