import React, { useState } from "react";
import { Client } from "@gradio/client";
import { useDropzone } from "react-dropzone";

const todos = {
  Corn___Common_Rust: [
    "Remove infected leaves.",
    "Apply fungicides.",
    "Monitor for rust development.",
  ],
  Corn___Gray_Leaf_Spot: [
    "Use resistant hybrids.",
    "Apply foliar fungicides.",
    "Practice crop rotation.",
  ],
  Corn___Healthy: [
    "No actions needed.",
    "Continue regular monitoring.",
    "Maintain good crop management practices.",
  ],
  Corn___Northern_Leaf_Blight: [
    "Use resistant hybrids.",
    "Apply fungicides at tasseling.",
    "Remove crop residue.",
  ],
  Corn___Northern_Leaf_Spot: [
    "Use resistant hybrids.",
    "Apply foliar fungicides.",
    "Practice crop rotation.",
  ],
  Corn___Phaeosphaeria_Leaf_Spot: [
    "Apply appropriate fungicides.",
    "Practice crop rotation.",
    "Remove crop debris.",
  ],
};

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );
};

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);

    try {
      const client = await Client.connect(
        "srijonashraf/maize-leaf-disease-detection"
      );
      const predictionResult = await client.predict("/predict", {
        image: new Blob([image], { type: image.type }),
      });
      console.log(predictionResult);
      setResult(predictionResult.data[0]);
    } catch (error) {
      console.error("Error:", error);
      setResult({ label: "An error occurred while processing your request." });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setImagePreview(null);
    setResult(null);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Maize Leaf Disease Detection
      </h1>
      <p className="mb-4 text-center text-gray-600">
        Upload an image of a maize leaf to classify its disease.
      </p>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-4 rounded-lg mb-4 text-center"
      >
        <input {...getInputProps()} accept="image/*" />
        {imagePreview ? (
          <img src={imagePreview} alt="Image Preview" className="mx-auto" />
        ) : (
          <>
            <p className="mb-2">Drop Image Here</p>
            <p>- or -</p>
            <p className="text-blue-500">Click to Upload</p>
          </>
        )}
      </div>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={handleClear}
          disabled={loading}
          className={`${
            loading ? "bg-gray-200 text-gray-400" : "bg-gray-300 text-gray-700"
          } px-4 py-2 rounded-md`}
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${
            loading ? "bg-orange-300" : "bg-orange-500"
          } text-white px-4 py-2 rounded-md`}
        >
          Submit
        </button>
      </div>
      {loading && (
        <div className="flex justify-center mb-6">
          <Spinner />
        </div>
      )}
      {result && !loading && (
        <div className="text-center mt-6 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Classified Label:
          </h2>
          <p className="text-3xl break-all font-bold font-raleway mb-4 text-orange-500">
            {result.label}
          </p>
          {todos[result.label] && (
            <div className="text-left inline-block">
              <h3 className="text-lg text-center font-semibold mb-2 text-gray-800">
                Recommended Actions:
              </h3>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 text-center px-4 bg-gray-200 text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {todos[result.label].map((todo, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {todo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
