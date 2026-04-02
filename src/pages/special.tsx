import { useEffect, useState } from 'react'
import Dashboard from '../components/dashboard'
import Footer from '../components/footer';


export default function Special() {
    const [analysis, setanalysis] = useState<any>(null)

    useEffect(() => {
        async function fetchAnalysis() {
            try {
                const response = await fetch("https://whatsappwrappedbackend.onrender.com/default", {
                    method: "GET",
                });
                const data = await response.json();
                if (response.ok) {
                    setanalysis(data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAnalysis()
    }, [])

    return (
        analysis ? (
            <div className='flex flex-col justify-between min-h-screen'>
                <Dashboard analysis={analysis} />
                <Footer />
            </div>
        ) : (
            <div className='flex flex-col justify-between min-h-screen'>
                <div className="flex items-center justify-center grow">
                    <div className="w-10 h-10 border-4 border-[#ABD1B5] border-t-[#79B791] rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        )
    )
}
