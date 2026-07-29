import React from 'react'
import { useForm } from 'react-hook-form'
import API from '../../api/axios.js'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: '',
        }
    })

    const onSubmit = async (data) => {
        try {
            const res = await API.post("/auth/register", data)
            if (res.data.success) {
                toast.success(res.data.message || "Registered successfully!")
                console.log("Register success:", res.data)
                navigate("/home");
            } else {
                toast.error(res.data.message || "Registration failed");
                reset({name:data.name,username:data.username,email:data.email,password:""});
                console.error("Register error:", res.data.message)
            }
        } catch (err) {
            console.error("Network or Server error:", err)
            toast.error(err.response?.data?.message || err.message || "Something went wrong");
            reset({name:data.name,username:data.username,email:data.email,password:""});
        }
    }

    return (
        <>
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-black via-indigo-950 to-fuchsia-950">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="w-full sm:w-87.5 text-center bg-white/6 border border-white/10 rounded-2xl px-8 py-4">
                    <div className='flex justify-center items-center mt-1 -mb-6'>
                        <img
                            src="/convo-fullLogo.svg"
                            alt="Convo Logo"
                            className="w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-[0_0_25px_rgba(236,200,221,0.35)] transition-all"
                        />
                    </div>
                    <h1 className="text-white text-3xl font-medium">
                        Sign up
                    </h1>

                    <p className="text-gray-400 text-sm mt-2">Please create an account to continue</p>

                    <div className="mt-6">
                        <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <circle cx="12" cy="8" r="5" /> <path d="M20 21a8 8 0 0 0-16 0" /> </svg>
                            <input
                                type="text"
                                placeholder="Name"
                                autoComplete="name"
                                className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
                                {...register("name", {
                                    required: "Name is required"
                                })}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-400 text-xs text-left pl-4 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /> <circle cx="12" cy="7" r="4" /> </svg>
                            <input
                                type="text"
                                placeholder="Username"
                                autoComplete="username"
                                className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
                                {...register("username", {
                                    required: "Username is required"
                                })}
                            />
                        </div>
                        {errors.username && (
                            <p className="text-red-400 text-xs text-left pl-4 mt-1">{errors.username.message}</p>
                        )}
                    </div>

                    <div className="mt-4">
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
                                autoComplete="new-password"
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

                    <button type="submit" disabled={isSubmitting} className="mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-50 cursor-pointer">
                        Sign up
                    </button>

                    <p onClick={() => navigate("/")} className="text-gray-400 text-sm mt-3 mb-6 cursor-pointer">
                        Already have an account?
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

export default Register
