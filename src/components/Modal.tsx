import type { Analysis } from "./dashboard";
import { useRef } from "react";
import { toPng } from "html-to-image";
import { FaTimes } from "react-icons/fa";   // Font Awesome
import { FiDownload } from "react-icons/fi";
export default function Modal({ setModal, analysis }: { setModal: (modal: Boolean) => void, analysis: Analysis }) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                style: {
                    transform: "none",
                }, // higher quality
            });

            const link = document.createElement("a");
            link.download = "card.png";
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Download failed:", err);
        }
    }
    return (
        <section className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 w-full h-full bg-[#301014]/80 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setModal(false)}
            ></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="">
                    <div id="summaryreport" ref={cardRef} className="bg-[#51291E] max-w-[410px] md:min-w-[480px] md:max-w-[100vw] py-8 px-6  md:px-12 md:py-12 rounded-3xl shadow-2xl shadow-[#000000]/40 border border-[#EDF4ED]/10 text-[#EDF4ED] animate-[modalIn_0.25s_ease-out]">

                        {/* Top row */}
                        <div className="flex justify-around gap-6 items-baseline pb-7 mb-7 border-b border-[#EDF4ED]/15">
                            <div className="flex gap-2">
                                <span className="text-xl md:text-3xl font-bold text-[#79B791] tracking-wide max-w-[150px] md:max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap inline-block">{analysis.users[0]}</span>
                                <span className="text-[#ABD1B5]/60 mx-3 text-lg">×</span>
                                <span className="text-xl md:text-3xl font-bold text-[#79B791] tracking-wide max-w-[150px] md:max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap inline-block">{analysis.users[1]}</span>
                            </div>
                            <div className="flex flex-col md:flex-row items-baseline gap-2">
                                <span className="text-xl md:text-4xl font-extrabold text-[#EDF4ED]">{analysis.total_length}</span>
                                <span className="text-sm font-medium text-[#ABD1B5]/70 uppercase tracking-widest">msgs</span>
                            </div>
                        </div>

                        {/* bottom part with image */}
                        <div className="flex flex-row items-center gap-10">
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm md:text-lg font-medium text-[#ABD1B5]">Longest Streak</span>
                                    <span className="text-[#ABD1B5]/30">·</span>
                                    <span className="flex gap-1 text-sm md:text-xl font-bold text-[#79B791]"> <span className="text-[#ABD1B5] italic">{analysis.longest_streak}</span>  days</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm md:text-lg font-medium text-[#ABD1B5]">Average Messages</span>
                                    <span className="text-[#ABD1B5]/30">·</span>
                                    <span className="flex gap-1 text-sm md:text-xl font-bold text-[#79B791]"> <span className="text-[#ABD1B5] italic">{Math.round(analysis.average_messages_per_day)}</span> msgs</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm md:text-lg font-medium text-[#ABD1B5]">Most Active Day</span>
                                    <span className="text-[#ABD1B5]/30">·</span>
                                    <span className="flex gap-1 text-sm md:text-xl font-bold text-[#79B791]"> <span className="text-[#ABD1B5] italic">{analysis.message_stats.max_messages}</span> msgs</span>
                                </div>
                            </div>
                            <div className="ml-auto ">
                                <img
                                    src="/favicon.png"
                                    alt="img"
                                    className="w-15 h-15 md:w-28 md:h-28 rounded-2xl md:rounded-xl object-cover md:object-fit shadow-lg"
                                />
                            </div>
                        </div>

                    </div>
                    <div className="flex gap-2 justify-around mt-18">
                        <button
                            onClick={handleDownload}
                            className=" flex gap-1 items-center bg-[#51291E]  px-6 py-3  text-white rounded-xl font-semibold hover:bg-[#51291E]/90 transition-colors"
                        >
                            <FiDownload className="text-xl md:text-3xl text-[#79B791]" />
                            <span className="text-sm md:text-2xl">Download</span>
                        </button>
                        <a href="https://x.com/waynethefuture"></a>
                        <button
                            onClick={() => setModal(false)}
                            className=" flex gap-1 items-center bg-[#51291E]  px-6 py-3  text-white rounded-xl font-semibold hover:bg-[#51291E]/90 transition-colors"
                        >
                            <FaTimes className="text-xl md:text-3xl text-[#79B791]" />
                            <span className="text-sm md:text-2xl">
                                Quote
                            </span>
                        </button>
                    </div>
                </div>

            </div>
        </section>
    )
}