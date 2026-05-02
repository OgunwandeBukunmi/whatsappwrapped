import { FaGithub } from "react-icons/fa6"

export default function Footer() {
    return (
        <div className="w-full  flex flex-row justify-around items-center  bg-heading  shadow-xl p-1 border-t-2 border-t-subheading">
            <p className="text-center text-card">Made with ❤️ by Wayne</p>

            <div className="flex items-center justify-center">
                <a href="https://github.com/OgunwandeBukunmi" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="text-background text-2xl hover:text-subheading" />
                </a>
            </div>
        </div>
    )
}
