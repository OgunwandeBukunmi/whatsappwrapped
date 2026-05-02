import React, { useEffect, useState } from "react";
import Dashboard from "./components/dashboard";
import Footer from "./components/footer";


type Props = {
  onFileSelect?: (file: File) => void;
};

export const domain = "https://whatsappwrappedbackend.onrender.com"
export async function health() {
  try {
    const response = await fetch(`${domain}/health`);
    const data = await response.json();
    if (response.ok) {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
}
const FileUploader: React.FC<Props> = ({ onFileSelect }) => {



  useEffect(() => {
    health();
  }, []);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<"upload" | "report">("upload");
  const [loading, setLoading] = useState<boolean>(false);
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
    setLoading(true);
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`${domain}/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) setCurrentStatus("report");
      setAnalysis(data);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return currentStatus === "upload" ? (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center grow bg-[#301014] p-6 text-[#EDF4ED]">
        <div className="w-full max-w-lg bg-[#51291E] shadow-xl rounded-2xl p-6">

          {/* Title */}
          <h2 className="text-2xl font-bold text-[#79B791] mb-6 text-center">
            Upload Whatsapp Chat File
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
              accept=".txt"
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
              } ${loading ? "bg-[#79B791]/80 cursor-not-allowed" : "bg-[#79B791] cursor-pointer hover:bg-[#79B791]/80"}`}

          >
            {loading ? "Loading..." : "Upload & Analyze"}
          </button>
        </div>
        <div className="mt-5 p-4 bg-[#301014]  flex justify-between items-center">
          <p>Have any issues? <a target="_blank" href="https://wa.me/+2349161276874" className="underline text-heading">Chat me</a></p>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <>
      <Dashboard analysis={analysis} />
      <Footer />
    </>
  )
};

export default FileUploader;
