import React from "react";
import { Bar, Pie } from "react-chartjs-2";
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

type Analysis = {
    users: string[];
    message_stats: {
        longest_day: string;
        longest_count: number;
        shortest_day: string;
        shortest_count: number;
    };
    word_stats: {
        most_common: [string, number][];
        least_common: [string, number][];
    };
    longest_silence: {
        start_of_silence: string;
        end_of_silence: string;
        duration: string;
    };
    average_messages_per_day: number;
    longest_streak: number;
    conversation_starters: Record<string, number>;
};

type Props = {
    analysis: Analysis;
};

const Dashboard: React.FC<Props> = ({ analysis }) => {
    const mostCommon = analysis.word_stats.most_common.slice(0, 5);
    const leastCommon = analysis.word_stats.least_common.slice(0, 5);

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

    const pieData = {
        labels: Object.keys(analysis.conversation_starters),
        datasets: [
            {
                data: Object.values(analysis.conversation_starters),
                backgroundColor: ["#79B791", "#ABD1B5"],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-[#301014] p-6 text-[#EDF4ED]">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-[#51291E] rounded-2xl shadow-lg p-6 text-center">
                    <h1 className="text-2xl font-bold text-[#79B791]">
                        {analysis.users[0]} × {analysis.users[1]}
                    </h1>
                    <p className="text-[#ABD1B5] text-sm mt-1">
                        Whatsapp Chat Analytics Dashboard
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-[#51291E] p-4 rounded-xl shadow">
                        <p className="text-[#ABD1B5] text-sm">Longest Streak</p>
                        <h2 className="text-xl font-semibold">{analysis.longest_streak} days</h2>
                    </div>

                    <div className="bg-[#51291E] p-4 rounded-xl shadow">
                        <p className="text-[#ABD1B5] text-sm">Average Messages</p>
                        <h2 className="text-xl font-semibold">
                            {analysis.average_messages_per_day.toFixed(1)}
                        </h2>
                    </div>

                    <div className="bg-[#51291E] p-4 rounded-xl shadow">
                        <p className="text-[#ABD1B5] text-sm">Longest Silence</p>
                        <h2 className="text-sm font-medium">{analysis.longest_silence.duration}</h2>
                    </div>
                </div>

                {/* Message Days */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#51291E] p-4 rounded-xl shadow">
                        <p className="text-[#ABD1B5] text-sm">Most Active Day</p>
                        <h2 className="font-semibold">{analysis.message_stats.longest_day}</h2>
                        <p className="text-sm text-[#EDF4ED]">{analysis.message_stats.longest_count} messages</p>
                    </div>

                    <div className="bg-[#51291E] p-4 rounded-xl shadow">
                        <p className="text-[#ABD1B5] text-sm">Least Active Day</p>
                        <h2 className="font-semibold">{analysis.message_stats.shortest_day}</h2>
                        <p className="text-sm text-[#EDF4ED]">{analysis.message_stats.shortest_count} messages</p>
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
                        <h2 className="font-semibold mb-4 text-[#79B791]">Conversation Starters</h2>
                        <Pie data={pieData} />
                    </div>

                    <div className="bg-[#51291E] p-5 rounded-2xl shadow text-sm">
                        <h2 className="font-semibold mb-2 text-[#79B791]">Silence Period</h2>
                        <p><strong>Start:</strong> {analysis.longest_silence.start_of_silence}</p>
                        <p><strong>End:</strong> {analysis.longest_silence.end_of_silence}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;