import React, { useEffect, useState } from "react";
import Dashboard from "./components/dashboard";
import Footer from "./components/footer";
import { Typewriter } from "react-simple-typewriter";
import posthog from "posthog-js";


type Props = {
  onFileSelect?: (file: File) => void;
};

export const domain = "https://whatsappwrappedbackend.onrender.com"
// export const domain = "http://localhost:8000"
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
  const [currentStatus, setCurrentStatus] = useState<"upload" | "loading" | "report">("upload");
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0)

  function useProgress(loading: boolean) {

    useEffect(() => {
      posthog.capture("view", { view: "upload_page" })
    }, [])

    useEffect(() => {
      if (!loading) return;

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev; // stop near end
          return prev + Math.random() * 5;
        });
      }, 500);

      return () => clearInterval(interval);
    }, [loading]);

    return progress;
  }
  useProgress(loading);



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
    posthog.capture("view", { view: "loading_page" })
    const start = performance.now();
    setLoading(true);
    setCurrentStatus("loading");
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
      const end = performance.now();
      posthog.capture("report_generated", { load_time: end - start })
      setAnalysis(data);
      console.log(data);
      setLoading(false);
    } catch (error) {
      posthog.capture("upload_failed", { error: error })
      console.log(error);
      setLoading(false);
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
  ) : currentStatus == "loading" ? (

    <div className="w-screen h-screen bg-[#301014] flex items-center justify-center p-4 text-[#EDF4ED]">
      <div className="max-w-md w-full bg-[#51291E] p-10 rounded-[3rem] shadow-2xl flex flex-col items-center text-center gap-8 border border-[#EDF4ED]/5 animate-pulse-subtle">

        {/* GIF Container */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-inner border-2 border-[#79B791]/10 bg-[#301014]/50">
          <img
            src="https://tenor.com/view/love-romance-romantic-love-you-couples-gif-27417192.gif"
            alt="Loading animation"
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>

        <div className="space-y-3 w-full">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#79B791] font-bold">
            Processing Data
          </h2>
          <div className="h-10 flex items-center justify-center">
            <p className="text-base md:text-lg font-medium text-[#ABD1B5] italic">
              <Typewriter
                words={[
                  "Calculating total messages...",
                  "Analyzing word patterns...",
                  "Breaking down conversation stats...",
                  "Calculating relationship score..."
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={50}
                deleteSpeed={30}
                delaySpeed={1500}
              />
            </p>
          </div>
        </div>

        {/* Loading Bar Section */}
        <div className="w-full space-y-4 pt-4">
          <div className="flex justify-between items-end px-1">
            <span className="text-[10px] uppercase tracking-widest text-[#ABD1B5]/50 font-semibold">System Load</span>
            <span className="text-sm font-black text-[#79B791] tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full bg-[#301014] rounded-full h-4 p-1 border border-[#EDF4ED]/5 shadow-inner">
            <div
              className="bg-gradient-to-r from-[#79B791] to-[#ABD1B5] h-full rounded-full transition-all duration-500 ease-out  relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-white/20 skew-x-[-20deg] translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>

          <p className="text-[9px] text-[#ABD1B5]/40 uppercase tracking-tighter">
            Please keep this tab open for optimal processing
          </p>
        </div>
      </div>
    </div>

  ) : (
    <>
      <Dashboard analysis={analysis} />
      <Footer />
    </>
  )
};

export default FileUploader;
