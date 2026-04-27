import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
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
    longest_streak: number;
    conversation_starters: Record<string, number>;
    total_length: number;
    first_message: string | null;
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

    return (
        <>
            <div className="min-h-screen bg-[#301014] p-6 text-[#EDF4ED]">
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

                    {/* Top Stats */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-[#51291E] p-4 rounded-xl shadow">
                            <h2 className="font-semibold mb-2 text-[#79B791]">First Message</h2>
                            <p>
                                {analysis.first_message
                                    ? new Date(analysis.first_message).toLocaleString()
                                    : "N/A"}
                            </p>
                        </div>

                        <div className="bg-[#51291E] p-4 rounded-xl shadow">
                            <h2 className="font-semibold mb-2 text-[#79B791]">Total Messages</h2>
                            <p>{analysis.total_length ?? 0}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#51291E] p-4 rounded-xl shadow">
                            <p className="text-[#ABD1B5] text-sm">Longest Streak</p>
                            <h2 className="text-xl font-semibold">
                                {analysis.longest_streak ?? 0} days
                            </h2>
                        </div>

                        <div className="bg-[#51291E] p-4 rounded-xl shadow">
                            <p className="text-[#ABD1B5] text-sm">Average Messages</p>
                            <h2 className="text-xl font-semibold">
                                {(analysis.average_messages_per_day ?? 0).toFixed(1)}
                            </h2>
                        </div>

                        <div className=" relative bg-[#51291E] p-4 rounded-xl shadow">
                            <p className="text-[#ABD1B5] text-sm">Longest Silence</p>
                            <h2 className="text-sm font-medium">
                                {silence?.duration ?? "No data"}
                            </h2>
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

                    {/* Bottom */}
                    <div className="grid md:grid-cols-2 gap-6">
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

                        <div className="bg-[#51291E] p-5 rounded-2xl shadow text-sm">
                            <h2 className="font-semibold mb-2 text-[#79B791]">Silence Period</h2>
                            <p>Start: {silence?.start ?? "N/A"}</p>
                            <p>End: {silence?.end ?? "N/A"}</p>
                        </div>
                    </div>

                </div>
            </div>
            {modal && <Modal setModal={setModal} analysis={analysis} />}
        </>
    );
};

export default Dashboard