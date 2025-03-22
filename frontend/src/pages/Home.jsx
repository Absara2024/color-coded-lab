import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState({
    schools: false,
    graduates: false,
  });

  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(prev => ({ ...prev, schools: true }));
      try {
        const response = await fetch('/api/schools');
        const data = await response.json();
        setSchools(data);
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, schools: false }));
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchGraduates = async () => {
      if (!selectedSchool) return;

      setIsLoading(prev => ({ ...prev, graduates: true }));
      try {
        const response = await fetch(`/api/graduates?school=${selectedSchool}`);
        const data = await response.json();
        setGraduates(data);
      } catch (error) {
        console.error('Error fetching graduates:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, graduates: false }));
      }
    };

    fetchGraduates();
  }, [selectedSchool]);

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school.name);
  };

  const handleAddGraduate = async (formData) => {
    try {
      const response = await fetch('/api/graduates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const newGraduate = await response.json();
      setGraduates(prev => [...prev, newGraduate]);
    } catch (error) {
      console.error('Error adding graduate:', error);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <ImageSlider />

      <Sidebar
        schools={schools}
        selectedSchool={selectedSchool}
        onSchoolSelect={handleSchoolSelect}
        isLoading={isLoading.schools}
      />

      <div className="relative z-10">
        <div className="absolute bottom-0 left-0 right-0">
          <CommentBox />
        </div>

        <GraduateList
          graduates={graduates}
          selectedSchool={selectedSchool}
          onOpenModal={() => setIsModalOpen(true)}
          isLoading={isLoading.graduates}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddGraduate}
      />
    </div>
  );
};

export default HomePage;