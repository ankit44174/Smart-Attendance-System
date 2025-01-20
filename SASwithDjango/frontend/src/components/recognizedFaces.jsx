import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './recognize.css';

function RecognizedFaces() {
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('')
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    const type = selectedFile.type.split('/')[0]
    setFileType(type);
  };

  const handleGetRecognizedFaces = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    setLoading(true);

    try {
      alert(` uploaded successfully and processing started.`);


      const uploadResponse = await axios.post(`http://localhost:8000/api/upload/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'multipart/form-data',
        },
      });



      const { session_id } = uploadResponse.data;
      setSessionId(session_id);

      const facesResponse = await axios.get(`http://localhost:8000/api/recognized-faces/?session_id=${session_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        params: { session_id },
      });
      setFaces(facesResponse.data.recognized_faces);





    } catch (error) {
      console.log('Error processing file:', error);
      alert("Failed to process file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {

    localStorage.removeItem("accessToken");


    navigate('/login');
  };

  return (
    <div className="paru">
      <h1>Smart Attendance System</h1>

      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*,video/*"
      />

      <button onClick={handleGetRecognizedFaces} disabled={loading}>
        {loading ? "Processing..." : "Get Attendance"}
      </button>

      {loading && <p>Processing file, please wait...</p>}

      <ul text="black">
        {faces.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>

  
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default RecognizedFaces;
