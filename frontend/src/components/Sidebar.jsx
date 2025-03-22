import React, { useState } from 'react';
import { Menu, X, School, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ 
  schools = [], 
  selectedSchool, 
  onSchoolSelect, 
  isLoading = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      display: "block"
    },
    closed: {
      opacity: 0,
      transitionEnd: {
        display: "none"
      }
    }
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-white bg-opacity-90 hover:bg-opacity-100 shadow-lg transition-all"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <School className="text-blue-600" />
                Schools
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Schools List */}
            <div className="overflow-y-auto h-[calc(100vh-70px)]">
              {isLoading ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  Loading schools...
                </div>
              ) : schools.length > 0 ? (
                <div className="divide-y">
                  {schools.map((school) => (
                    <motion.button
                      key={school._id}
                      whileHover={{ x: 5 }}
                      onClick={() => {
                        onSchoolSelect(school);
                        setIsOpen(false);
                      }}
                      className={`w-full p-4 flex items-center justify-between transition-colors ${
                        selectedSchool === school.name
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{school.name}</span>
                      <ChevronRight
                        size={20}
                        className={selectedSchool === school.name ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  No schools found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;