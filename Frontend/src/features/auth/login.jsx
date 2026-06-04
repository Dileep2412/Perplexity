import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const submitForm = async (event) => {
        event.preventDefault()

        const payload = {
            email,
            password,
        }

        console.log(payload)
        navigate("/")
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center">
                <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900/70 p-8 shadow-2xl shadow-black/50 backdrop-blur-md">

                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-700 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm text-zinc-400">
                        Sign in with your email and password.
                    </p>

                    <form onSubmit={submitForm} className="mt-8 space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-zinc-200"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-zinc-200"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-4 py-3 font-semibold text-white transition-all duration-300 hover:from-red-600 hover:via-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/25"
                        >
                            Login
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-400">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-red-400 transition hover:text-red-300"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Login