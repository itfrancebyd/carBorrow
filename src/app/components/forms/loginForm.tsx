'use client'
import { createClient } from "@/utils/supabase/client"
import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import AddAction from "../addAction"

const LoginForm = () => {
    const [isShowPass, setShowPass] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const router = useRouter()

    const supabase = createClient()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!formRef.current) return // check null guard
        const formData = new FormData(formRef.current)
        const email = formData.get("email")?.toString() || ""
        const passWord = formData.get("password")?.toString() || ""
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: passWord
        })
        if (error) {
            setErrorMsg(error.message)
            return
        }

        const { data, error: userErr } = await supabase.auth.getUser()
        if (userErr) {
            console.error("use not find: " + error)
            return
        } 
        if (!data.user.email) {
            console.error("❌ AddAction called without a user_id")
            return
        }
        await AddAction({
            action_at: new Date().toISOString(),
            action: "LOGIN",
            target: "-",
            detail: "User logged in successfully",
            user_email: data.user.email,
        })
        router.push('/')
    }

    return (
        <div className="bg-gray-100/50 border border-gray-300 shadow-2xl py-7 px-5 rounded-xl w-1/3 min-w-[315px]">
            <form className="text-gray-600 flex flex-col gap-7" ref={formRef} onSubmit={handleSubmit}>
                <div className="flex flex-row justify-center items-center gap-2">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4523" width="16" height="16"><path d="M409.002667 469.333333L300.8 361.130667 361.130667 300.8l211.2 211.2-211.2 211.2-60.330667-60.330667L409.002667 554.666667H128v-85.333334h281.002667zM469.333333 128h341.333334c46.933333 0 85.333333 38.4 85.333333 85.333333v597.333334c0 46.933333-38.4 85.333333-85.333333 85.333333h-341.333334v-85.333333h341.333334V213.333333h-341.333334V128z" fill="#26361C" p-id="4524"></path></svg>
                    <div className="font-bold">Login</div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold text-sm">Email</label>
                        <input
                            name="email"
                            type="text"
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                            placeholder="Enter your email"
                        ></input>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold text-sm">Password</label>
                        <div className="flex relative items-center">
                            <input
                                name="password"
                                type={`${isShowPass ? 'text' : 'password'}`}
                                className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                                placeholder="Enter your password"
                            ></input>
                            <button onClick={() => setShowPass(!isShowPass)} type="button" className="absolute right-3 cursor-pointer">
                                {isShowPass
                                    ?
                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10081" width="16" height="16"><path d="M661.333333 512a149.333333 149.333333 0 1 1-298.666666 0 149.333333 149.333333 0 0 1 298.666666 0z m-58.660571 0a90.672762 90.672762 0 1 0-181.321143 0 90.672762 90.672762 0 0 0 181.321143 0z" p-id="10082" fill="#26361C"></path><path d="M89.063619 525.433905a30.037333 30.037333 0 0 1 0-26.86781C168.374857 339.846095 335.36 192 512 192c176.64 0 343.649524 147.821714 422.960762 306.566095 4.242286 8.46019 4.242286 18.407619 0 26.86781C855.649524 684.153905 688.64 832 512 832c-176.64 0-343.625143-147.821714-422.936381-306.566095z m210.773333 166.326857c66.633143 51.321905 140.288 81.578667 212.163048 81.578667 71.92381 0 145.554286-30.256762 212.187429-81.578667 62.512762-48.152381 115.760762-112.615619 151.673904-179.760762-35.913143-67.145143-89.161143-131.608381-151.673904-179.760762C657.554286 280.917333 583.899429 250.63619 512 250.63619c-71.875048 0-145.554286 30.256762-212.163048 81.578667C237.29981 380.391619 184.07619 444.854857 148.138667 512c35.937524 67.145143 89.161143 131.608381 151.698285 179.760762z" p-id="10083" fill="#26361C"></path></svg>
                                    :
                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7079" width="16" height="16"><path d="M825.880381 134.192762l51.736381 51.736381-655.116191 655.11619-51.736381-51.736381 655.116191-655.11619z m-21.479619 191.585524c41.301333 39.497143 81.310476 87.942095 120.027428 145.310476a73.142857 73.142857 0 0 1 2.755048 77.385143l-2.755048 4.437333-6.92419 10.118095C795.184762 740.303238 659.992381 828.952381 512 828.952381c-58.441143 0-114.858667-13.824-169.301333-41.447619l55.100952-55.100952c37.449143 15.701333 75.50781 23.405714 114.200381 23.405714 120.880762 0 235.471238-75.142095 345.088-234.008381l6.704762-9.801143-6.729143-9.825524c-34.279619-49.688381-69.046857-91.184762-104.350476-124.708571l51.687619-51.687619zM512 195.047619c51.44381 0 101.302857 10.703238 149.650286 32.109714l-56.466286 56.490667A289.401905 289.401905 0 0 0 512 268.190476c-120.880762 0-235.471238 75.142095-345.088 234.008381L160.207238 512l6.729143 9.825524c29.549714 42.812952 59.440762 79.530667 89.721905 110.34819l-51.663238 51.663238c-36.132571-36.693333-71.289905-80.335238-105.423238-130.925714a73.142857 73.142857 0 0 1-2.755048-77.385143l2.755048-4.437333 6.92419-10.118095C228.815238 283.696762 364.007619 195.047619 512 195.047619z m152.795429 270.384762a161.694476 161.694476 0 0 1-205.799619 205.799619l65.097142-65.097143a88.600381 88.600381 0 0 0 75.629715-75.629714l65.072762-65.097143zM512 356.717714c6.41219 0 12.751238 0.365714 18.968381 1.097143l-179.541333 179.565714A161.694476 161.694476 0 0 1 512 356.742095z" p-id="7080" fill="#26361C"></path></svg>
                                }
                            </button>
                        </div>
                    </div>
                </div>
                <button type="submit" className="bg-[#26361C] hover:bg-[#7a856b] cursor-pointer text-white py-2 rounded-md">Login</button>
            </form>
        </div>
    )
}

export default LoginForm