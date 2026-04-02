import React, { useState } from "react";
import Dashboard from "./components/dashboard";
import Footer from "./components/footer";

type Props = {
  onFileSelect?: (file: File) => void;
};

const FileUploader: React.FC<Props> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<"upload" | "report">("upload");
  const [analysis, setAnalysis] = useState<any>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const uploadedFile = e.dataTransfer.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      onFileSelect?.(uploadedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      onFileSelect?.(uploadedFile);
    }
  };

  async function fetchAnalysis() {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) setCurrentStatus("report");
      setAnalysis(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return currentStatus === "upload" ? (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#301014] p-6 text-[#EDF4ED]">
        <div className="w-full max-w-lg bg-[#51291E] shadow-xl rounded-2xl p-6">

          {/* Title */}
          <h2 className="text-2xl font-bold text-[#79B791] mb-6 text-center">
            Upload Chat File
          </h2>

          {/* Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer 
            ${dragging
                ? "border-[#79B791] bg-[#51291E] scale-[1.02]"
                : "border-[#ABD1B5] hover:border-[#79B791] bg-[#51291E]"
              }`}
          >
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer text-center">
              <p className="text-lg font-medium text-[#ABD1B5]">Drag & Drop file</p>
              <p className="text-sm text-[#EDF4ED] mt-1">or click to browse</p>
            </label>
          </div>

          {/* File Preview */}
          {file && (
            <div className="mt-5 p-4 bg-[#301014] border border-[#79B791] rounded-lg flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-[#79B791] truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-[#ABD1B5]">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          )}

          {/* Upload Button */}
          <button
            disabled={!file}
            onClick={fetchAnalysis}
            className={`mt-6 w-full py-2 rounded-lg font-medium transition
            ${file
                ? "bg-[#79B791] text-[#301014] hover:bg-[#79B791]/80"
                : "bg-[#ABD1B5]/60 text-[#301014]/80 cursor-not-allowed"
              }`}
          >
            Upload & Analyze
          </button>
        </div>

      </div>
      <Footer />
    </div>

  ) : (
    <>
      <Dashboard analysis={analysis} />
      <Footer />
    </>
  );
};

export default FileUploader;