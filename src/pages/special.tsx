import { useEffect, useState } from 'react'
import Dashboard from '../components/dashboard'
import Footer from '../components/footer';

export default function Special() {
    const [analysis, setanalysis] = useState<any>(null)

    useEffect(() => {
        async function fetchAnalysis() {
            try {
                const response = await fetch("http://localhost:8000/default", {
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
            <h1>loading...</h1>
        )
    )
}