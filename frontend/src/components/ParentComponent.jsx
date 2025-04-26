import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; 

const ParentComponent = () => {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school.name); 
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000); 
  }, []);

  return (
    <div className="flex">
      <Sidebar
        selectedSchool={selectedSchool}
        onSchoolSelect={handleSchoolSelect}
        isLoading={isLoading}
      />

      <div className="mt-20 p-4 ml-64">
        <h1 className="text-2xl font-bold">Selected School:</h1>
        <p className="text-xl">{selectedSchool || "None"}</p>
      </div>
    </div>
  );
};

export default ParentComponent;
