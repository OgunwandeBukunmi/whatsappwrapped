import React, { useState } from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { FaUpload } from "react-icons/fa";
import Modal from "./Modal.tsx";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export type Analysis = {
    users: string[];
    message_stats: {
        longest_day: string | null;
        max_messages: number;
        shortest_day: string | null;
        min_messages: number;
    };
    word_stats: {
        most_common: [string, number][];
        least_common: [string, number][];
    };
    longest_silence: {
        start?: string;
        end?: string;
        duration?: string;
        type?: string;
        is_current: boolean;
    } | null;
    average_messages_per_day: number;
    longest_streak: { count: number, is_current: boolean, start: string, end: string }
    conversation_starters: Record<string, number>;
    total_length: number;
    first_message: string | null;
    final_score: number;
    compatibility_score: number;
    balance_score: number;
    consistency_score: number;
    silence_penalty: number;
    effort_score: number;
    activity_score: number;
    relationship_status: string;
    ghosting_count: number;
    peak_hours: number;
    message_share: Record<string, number>;

};

type Props = {
    analysis: Analysis;
};

const Dashboard: React.FC<Props> = ({ analysis }) => {
    const mostCommon = analysis.word_stats?.most_common?.slice(0, 5) ?? [];
    const leastCommon = analysis.word_stats?.least_common?.slice(0, 5) ?? [];
    const [modal, setModal] = useState<Boolean>(false)

    const mostData = {
        labels: mostCommon.map(w => w[0]),
        datasets: [
            {
                label: "Frequency",
                data: mostCommon.map(w => w[1]),
                backgroundColor: "#79B791",
            },
        ],
    };

    const leastData = {
        labels: leastCommon.map(w => w[0]),
        datasets: [
            {
                label: "Frequency",
                data: leastCommon.map(w => w[1]),
                backgroundColor: "#ABD1B5",
            },
        ],
    };

    const conversationData = analysis.conversation_starters
        ? {
            labels: Object.keys(analysis.conversation_starters),
            datasets: [
                {
                    data: Object.values(analysis.conversation_starters),
                    backgroundColor: ["#79B791", "#ABD1B5", "#EDF4ED", "#51291E"],
                },
            ],
        }
        : null;

    const silence = analysis.longest_silence;

    const breakdownMetrics = [
        { label: "Activity", value: analysis.activity_score ?? 0, weight: 0.25, color: "#4ECDC4" },
        { label: "Consistency", value: analysis.consistency_score ?? 0, weight: 0.20, color: "#5BA88C" },
        { label: "Balance", value: analysis.balance_score ?? 0, weight: 0.25, color: "#ABD1B5" },
        { label: "Effort", value: analysis.effort_score ?? 0, weight: 0.30, color: "#8FD4A4" },
    ];

    const silencePenalty = analysis.silence_penalty ?? 0;
    const finalScore = analysis.final_score ?? 0;

    const makeDonutData = (value: number, color: string, max = 100) => ({
        labels: [],
        datasets: [
            {
                data: [Math.min(value, max), max - Math.min(value, max)],
                backgroundColor: [color, "#3a1a1e"],
                borderWidth: 0,
                cutout: "75%",
            },
        ],
    });

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    return (
        <>
            <div className="min-h-screen bg-[#301014] p-3 md:p-6 text-[#EDF4ED]">
                <div className="max-w-6xl flex flex-col mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex justify-around items-center bg-[#51291E] rounded-2xl shadow-lg">
                        <div className=" p-6 text-center">
                            <h1 className="text-2xl font-bold text-[#79B791]">
                                {analysis.users?.[0] ?? "User 1"} ×  <span className="text-xl md:text-3xl font-bold text-heading tracking-wide max-w-[150px] md:max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap inline-block">{analysis.users?.[1] ?? "User 2"}</span>
                            </h1>
                            <p className="text-[#ABD1B5] text-sm mt-1">
                                Whatsapp Chat Analytics Dashboard
                            </p>
                        </div>
                        <div className="p-2">
                            <button className=" flex items-center bg-[#79B791] text-[#301014] hover:bg-[#79B791]/80 px-4 py-2 rounded-lg font-medium transition"
                                onClick={() => setModal(true)}>
                                <FaUpload className="mr-2 text-[#301014]" /> <span className="mr-2">Export</span>
                            </button>
                        </div>
                    </div>

                    {/* Score Section — Final Score + Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Final Score — Large Donut (3/4 width) */}
                        {(() => {
                            const scoreColor = finalScore <= 35 ? "#E8665D" : "#79B791";
                            const scoreBgTint = finalScore <= 35 ? "rgba(232,102,93,0.12)" : "rgba(121,183,145,0.12)";
                            const scoreBorderTint = finalScore <= 35 ? "rgba(232,102,93,0.3)" : "rgba(121,183,145,0.3)";
                            return (
                                <div className="lg:col-span-9 bg-[#51291E] rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center gap-5">
                                    <h2 className="text-sm uppercase tracking-widest font-medium" style={{ color: scoreColor }}>
                                        Final Score
                                    </h2>
                                    <div className="relative w-52 h-52 md:w-64 md:h-64">
                                        <Doughnut
                                            data={makeDonutData(finalScore, scoreColor)}
                                            options={donutOptions}
                                        />
                                        <span className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-5xl md:text-6xl font-extrabold" style={{ color: scoreColor }}>
                                                {Math.round(finalScore)}
                                            </span>
                                            <span className="text-[#ABD1B5] text-xs mt-1">/ 100</span>
                                        </span>
                                    </div>
                                    <div className="mt-2 flex flex-col items-center gap-1.5">
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#ABD1B5] font-medium">
                                            Relationship Status
                                        </span>
                                        <div
                                            className="px-7 py-3 rounded-2xl text-lg md:text-xl font-bold tracking-wide border-2 transition-all duration-300"
                                            style={{
                                                color: scoreColor,
                                                backgroundColor: scoreBgTint,
                                                borderColor: scoreBorderTint,
                                                boxShadow: `0 0 20px ${scoreBgTint}, 0 0 40px ${finalScore <= 35 ? "rgba(232,102,93,0.06)" : "rgba(121,183,145,0.06)"}`,
                                            }}
                                        >
                                            {analysis["relationship_status"]}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Breakdown — Right Column (1/4 width) */}
                        <div className="lg:col-span-3 bg-[#51291E] rounded-2xl shadow-lg p-5 flex flex-col justify-between">
                            <h2 className="text-sm font-semibold text-[#79B791] mb-3 text-center">Score Breakdown</h2>
                            <div className="space-y-3 flex-1">
                                {breakdownMetrics.map((m) => (
                                    <div key={m.label} className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 shrink-0">
                                            <Doughnut
                                                data={makeDonutData(m.value, m.color)}
                                                options={donutOptions}
                                            />
                                            <span
                                                className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
                                                style={{ color: m.color }}
                                            >
                                                {Math.round(m.value)}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <span className="text-xs text-[#EDF4ED] truncate">{m.label}</span>
                                                <span className="text-[10px] text-[#ABD1B5] ml-1">×{m.weight}</span>
                                            </div>
                                            <div className="w-full bg-[#3a1a1e] rounded-full h-1.5 mt-1">
                                                <div
                                                    className="h-1.5 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min(m.value, 100)}%`, backgroundColor: m.color }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Silence Penalty */}
                            <div className="mt-4 pt-3 border-t border-[#3a1a1e]">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 shrink-0">
                                        <Doughnut
                                            data={makeDonutData(silencePenalty, "#E8665D", 50)}
                                            options={donutOptions}
                                        />
                                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#E8665D]">
                                            -{Math.round(silencePenalty)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-xs text-[#E8665D]">Silence Penalty</span>
                                        </div>
                                        <div className="w-full bg-[#3a1a1e] rounded-full h-1.5 mt-1">
                                            <div
                                                className="h-1.5 rounded-full transition-all duration-500 bg-[#E8665D]"
                                                style={{ width: `${Math.min(silencePenalty / 50 * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Stats */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-[#51291E] p-4 rounded-xl shadow">
                            <h2 className="font-semibold mb-2 text-[#79B791]">First Message</h2>
                            <p>
                                {analysis.first_message
                                    ? new Date(analysis.first_message).toLocaleString()
                                    : "N/A"}
                            </p>
                        </div>

                        <div className="bg-[#51291E] p-4 rounded-xl shadow relative">
                            <p className="text-[#ABD1B5] text-sm">Average Messages</p>
                            <h2 className="text-xl font-semibold">
                                {(analysis.average_messages_per_day ?? 0).toFixed(1)}
                            </h2>
                        </div>
                        <div className="bg-[#51291E] p-4 rounded-xl shadow">
                            <h2 className="font-semibold mb-2 text-[#79B791]">Total Messages</h2>
                            <p>{analysis.total_length ?? 0}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#51291E] p-4 rounded-xl shadow relative">
                            <p className="text-[#ABD1B5] text-sm">Longest Streak</p>
                            <h2 className="text-xl font-semibold">
                                {analysis.longest_streak.count ?? 0} days
                            </h2>
                            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#3a1a1e]">
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-[#ABD1B5]/60 font-medium">Start</span>
                                    <p className="text-xs text-[#EDF4ED] mt-0.5">{analysis.longest_streak.start ?? "N/A"}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-[#ABD1B5]/60 font-medium">End</span>
                                    <p className="text-xs text-[#EDF4ED] mt-0.5">{analysis.longest_streak.end ?? "N/A"}</p>
                                </div>
                            </div>
                            <span className={`absolute p-2 rounded-lg font-bold top-4 right-2 text-xs ${analysis.longest_streak.is_current ? "text-green-200 bg-green-800" : "text-red-200 bg-red-800"}`}>{analysis.longest_streak.is_current ? "current" : "Ended"}</span>
                        </div>



                        <div className="relative bg-[#51291E] p-4 rounded-xl shadow">
                            <p className="text-[#ABD1B5] text-sm">Longest Silence</p>
                            <h2 className="text-xl font-semibold mt-1">
                                {silence?.duration ?? "No data"}
                            </h2>
                            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#3a1a1e]">
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-[#ABD1B5]/60 font-medium">Start</span>
                                    <p className="text-xs text-[#EDF4ED] mt-0.5">{silence?.start ?? "N/A"}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-[#ABD1B5]/60 font-medium">End</span>
                                    <p className="text-xs text-[#EDF4ED] mt-0.5">{silence?.end ?? "N/A"}</p>
                                </div>
                            </div>
                            <span className={`absolute p-2 rounded-lg font-bold top-4 right-2 text-xs ${!silence?.is_current ? "text-green-200 bg-green-800" : "text-red-200 bg-red-800"}`}>{silence?.type}</span>
                        </div>
                    </div>

                    {/* Activity Days */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#51291E] p-4 rounded-xl shadow">
                            <p className="text-[#ABD1B5] text-sm">Most Active Day</p>
                            <h2 className="font-semibold">
                                {analysis.message_stats?.longest_day ?? "N/A"}
                            </h2>
                            <p className="text-sm">
                                {analysis.message_stats?.max_messages ?? 0} messages
                            </p>
                        </div>

                        <div className="bg-[#51291E] p-4 rounded-xl shadow">
                            <p className="text-[#ABD1B5] text-sm">Least Active Day</p>
                            <h2 className="font-semibold">
                                {analysis.message_stats?.shortest_day ?? "N/A"}
                            </h2>
                            <p className="text-sm">
                                {analysis.message_stats?.min_messages ?? 0} messages
                            </p>
                        </div>
                    </div>

                    {/* Conversation starters */}
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-[#51291E] p-5 rounded-2xl shadow">
                            <h2 className="font-semibold mb-4 text-[#79B791]">
                                Conversation Starters
                            </h2>

                            {conversationData ? (
                                <Pie data={conversationData} />
                            ) : (
                                <p>No data</p>
                            )}
                        </div>
                        {/* ghosting */}
                        <div className="bg-[#51291E] p-5 rounded-2xl shadow">
                            <h2 className="font-semibold mb-4 text-[#79B791]">
                                How many times did you not reply each other for over 24 hours?
                            </h2>
                            <p className="text-4xl font-bold"> <span className="text-[#ABD1B5]">{analysis.ghosting_count ?? 0}</span> times</p>
                        </div>
                        {/* peak hour */}
                        <div className="bg-[#51291E] p-5 rounded-2xl shadow">
                            <h2 className="font-semibold mb-4 text-[#79B791]">
                                What time do you talk the most?
                            </h2>
                            <p className="text-4xl font-bold">
                                <span className="text-[#ABD1B5]">
                                    {(() => {
                                        const h = analysis.peak_hours ?? 0;
                                        const ampm = h >= 12 ? "PM" : "AM";
                                        const hour12 = h % 12 || 12;
                                        return `${hour12} ${ampm}`;
                                    })()}
                                </span>
                            </p>
                        </div>
                        {/* message share */}
                        <div className="bg-[#51291E] p-5 rounded-2xl shadow">
                            <h2 className="font-semibold mb-4 text-[#79B791]">
                                Who talks the most?
                            </h2>
                            {(() => {
                                const first = Object.entries(analysis.message_share)[0]
                                return (
                                    <>
                                        <p className="text-4xl font-bold"> <span className="text-[#ABD1B5]">{first[0]}</span> </p>
                                        <p className="text-sm"> {first[1]}% messages</p>
                                    </>
                                )
                            })()}
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-[#51291E] p-5 rounded-2xl shadow">
                            <h2 className="font-semibold mb-4 text-[#79B791]">Most Common Words</h2>
                            <Bar data={mostData} />
                        </div>

                        <div className="bg-[#51291E] p-5 rounded-2xl shadow">
                            <h2 className="font-semibold mb-4 text-[#79B791]">Least Common Words</h2>
                            <Bar data={leastData} />
                        </div>
                    </div>



                </div>
            </div>
            {modal && <Modal setModal={setModal} analysis={analysis} />}
        </>
    );
};

export default Dashboard