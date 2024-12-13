import React, { useState } from "react";
import "./Donut.css"; // Import CSS file for styling

function Donut() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(""); // State to hold inference result

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate temporary URL for image preview
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("https://learna1.com/donut", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setResult(data.result); // Display result in textarea
        } else {
          setResult("Error: " + data.error);
        }
      } else {
        setResult("Error during inference.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("Error during inference.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="donut-container">
      <h1>Donut Model Inference</h1>
      <div className="form-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Selected"
            className="image-preview"
          />
        )}
        <button
          onClick={handleSubmit}
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>
        {isLoading && <div className="spinner"></div>}
      </div>
      <textarea
        className="result-textarea"
        value={result}
        readOnly
        placeholder="Inference result will appear here..."
      />
    </div>
  );
}

export default Donut;
