import React, { useState } from "react";

function Donut() {
  const [image, setImage] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Send image to server
  const handleSubmit = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:3001/donut", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("Inference Result:", data.result);
          alert("Inference completed successfully! Check console for result.");
        } else {
          alert("Error: " + data.error);
        }
      } else {
        alert("Error during inference.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error during inference.");
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Donut;
