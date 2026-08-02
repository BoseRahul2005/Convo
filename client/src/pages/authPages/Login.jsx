import React from 'react'
import { useForm } from 'react-hook-form'
import API from '../../api/axios.js'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (data) => {
        try {
            const { email, password } = data;
            const res = await API.post("/auth/login", { email, password });
            if (res.data.success) {
                toast.success(res.data.message || "Logged in successfully!");
                navigate("/home");
                console.log("Login success:", res.data)
            } else {
                toast.error(res.data.message || "Login failed");
                reset({ email: data.email, password: "" });
                console.error("Login error:", res.data.message)
            }
        } catch (err) {
            console.error("Network or Server error:", err);
            reset({ email: data.email, password: "" });
            toast.error(err.response?.data?.message || err.message || "Something went wrong");
        }
    }

    return (
        <>
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-black via-indigo-950 to-fuchsia-950 relative p-4">
                {/* Top Left Full Logo Header */}
                <div className="absolute top-2 left-4 sm:top-1 sm:left-8 z-10 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <img
                        src="/convo-fullLogo.svg"
                        alt="Convo Logo"
                        className="h-16 sm:h-28 w-auto object-contain drop-shadow-[0_0_20px_rgba(236,200,221,0.4)] transition-all hover:scale-105"
                    />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="w-full sm:w-87.5 max-w-sm text-center bg-white/6 border border-white/10 rounded-2xl px-6 sm:px-8 py-6">
                    <h1 className="text-white text-3xl mt-2 font-medium">
                        Login
                    </h1>

                    <p className="text-gray-400 text-sm mt-2">C'mon everyone is waiting for you</p>

                    <div className="mt-6">
                        <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /> </svg>
                            <input
                                type="email"
                                placeholder="Email id"
                                autoComplete="email"
                                className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Please enter a valid email address"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-400 text-xs text-left pl-4 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 10 0v4" /> </svg>
                            <input
                                type="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-xs text-left pl-4 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="mt-4 text-left">
                        <button type="button" onClick={() => navigate("/reset-password")} className="cursor-pointer text-sm text-indigo-400 hover:underline">
                            Forget password?
                        </button>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="mt-2 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-50 cursor-pointer">
                        Login
                    </button>

                    <p onClick={() => navigate("/register")} className="text-gray-400 text-sm mt-3 mb-6 cursor-pointer">
                        Don't have an account?
                        <span className="text-indigo-400 hover:underline ml-1">click here</span>
                    </p>
                </form>
            </div>
            {/* Soft Backdrop*/}
            <div className='fixed inset-0 -z-10 pointer-events-none'>
                <div className='absolute left-1/2 top-20 -translate-x-1/2 w-245 h-115 bg-linear-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl' />
                <div className='absolute right-12 bottom-10 w-105 h-55 bg-linear-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl' />
            </div>
        </>
    )
}

export default Login