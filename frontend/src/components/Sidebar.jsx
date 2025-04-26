import React, { useState, useEffect } from "react";
import { Menu, X, School } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ selectedSchool, onSchoolSelect, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("http://localhost:5005/api/schools");
        const data = await response.json();
        setSchools(data);
      } catch (err) {
        setError("Failed to load schools.");
      }
    };

    fetchSchools();
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 rounded bg-white shadow"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <School className="text-blue-600" />
                  Schools
                </h2>
                <button onClick={() => setIsOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              {isLoading ? (
                <p>Loading schools...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="space-y-2">
                  {schools.map((school) => (
                    <button
                      key={school._id}
                      onClick={() => {
                        onSchoolSelect(school); 
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded ${
                        selectedSchool === school.name
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      aria-label={`Select ${school.name}`}
                    >
                      {school.name}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
