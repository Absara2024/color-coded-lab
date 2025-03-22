import React, { useState } from 'react';
import ImageSlider from '../components/ImageSlider';
import CommentBox from '../components/CommentBox';
import GraduateList from '../components/GraduateList';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';

const HomePage = () => {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [graduates, setGraduates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school.name);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <ImageSlider />

      <Sidebar
        schools={schools}
        selectedSchool={selectedSchool}
        onSchoolSelect={handleSchoolSelect}
        isLoading={false}
      />

      <div className="relative z-10">
        <div className="absolute bottom-0 left-0 right-0">
          <CommentBox />
        </div>

        <GraduateList
          graduates={graduates}
          selectedSchool={selectedSchool}
          onOpenModal={() => setIsModalOpen(true)}
          isLoading={false}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;