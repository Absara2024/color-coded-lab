import React, { useState, useEffect } from "react";
import ImageSlider from "../components/ImageSlider";
import CommentBox from "../components/CommentBox";
import GraduateList from "../components/GraduateList";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import GraduateForm from "../components/GraduateForm";
import UploadImageForm from "../components/UploadImageForm"; 

const HomePage = () => {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [graduates, setGraduates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploadVisible, setImageUploadVisible] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("http://localhost:5005/api/schools");
        if (!response.ok) throw new Error("Failed to fetch schools");
        const data = await response.json();
        setSchools(data);
      } catch (err) {
        setError("Failed to fetch schools");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      const fetchGraduates = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `http://localhost:5005/api/graduationRecords/school/${encodeURIComponent(selectedSchool)}`
          );
          if (!response.ok) throw new Error("Failed to fetch graduates");
          const data = await response.json();
          setGraduates(data);
        } catch (err) {
          setError("Failed to fetch graduates");
        } finally {
          setIsLoading(false);
        }
      };

      fetchGraduates();
    }
  }, [selectedSchool]);

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school.name);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleImageUpload = (fileUrl) => {
    setImageUrl(fileUrl ? `http://localhost:5005${fileUrl}` : "");
  };

  const toggleImageUpload = () => {
    setImageUploadVisible((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <ImageSlider />

      <Sidebar
        schools={schools}
        selectedSchool={selectedSchool}
        onSchoolSelect={handleSchoolSelect}
        isLoading={isLoading}
        error={error}
      />

      <div className="mt-20 px-4">
        <GraduateList
          graduates={graduates}
          selectedSchool={selectedSchool}
          onOpenModal={handleModalOpen}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div className="mt-10 px-4">
        <CommentBox />
      </div>

      <div className="flex justify-center items-center mt-10">
        <button
          onClick={toggleImageUpload}
          className="bg-blue-600 text-white p-2 rounded-md"
        >
          {imageUploadVisible ? "Hide Image Upload" : "Upload School Image"}
        </button>
      </div>

      {imageUploadVisible && selectedSchool && (
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 text-center">
              Share Your School Image
            </h2>
            <UploadImageForm 
              selectedSchool={selectedSchool}
              onImageUpload={handleImageUpload}
            />
            {imageUrl && (
              <div className="mt-3">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <GraduateForm
          selectedSchool={selectedSchool}
          setGraduates={setGraduates}
          onClose={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default HomePage;
