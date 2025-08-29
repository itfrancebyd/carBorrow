'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const Header = () => {
    const pathname = usePathname()
    
    return (
        <div className="bg-white grid grid-cols-7 p-8 content-center">
            <div className="col-span-1 font-extrabold text-2xl text-end">
                MMCar
            </div>
            <div className="col-span-5 flex justify-center gap-40 text-xl font-semibold">
                <Link className={`${pathname == '/' ? 'text-black underline underline-offset-8 decoration-[#B6C6A1]' : 'text-[#bdbcbc] hover:text-black hover:underline hover:underline-offset-8 hover:decoration-[#B6C6A1]'}`} href="/">Vehicles</Link>
                <Link className={`${pathname == '/loan-requests' ? 'text-black underline underline-offset-8 decoration-[#B6C6A1]' : 'text-[#bdbcbc] hover:text-black hover:underline hover:underline-offset-8 decoration-[#B6C6A1]'}`} href="/loan-requests">Loan Requests</Link>
            </div>
        </div>
    )
}

export default Header