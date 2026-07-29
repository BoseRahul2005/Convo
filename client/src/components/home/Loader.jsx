import React from 'react'

const Loader = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-gradient-to-tr from-black via-indigo-950 to-fuchsia-950">
            <img
                src="/convo-logo.svg"
                alt="Convo Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 animate-[zoomPulse_1.8s_ease-in-out_infinite] object-contain drop-shadow-[0_0_20px_rgba(236,200,221,0.4)]"
            />
            <p className="text-gray-400 text-sm italic tracking-wide">
                Patience is bitter, but its fruit is sweet. — Aristotle
            </p>
        </div>
    )
}

export default Loader
