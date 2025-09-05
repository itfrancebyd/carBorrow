'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react"
import PopModalForm from "./popModal";
import Link from "next/link";

interface tableGridProp {
    formTitle: string,
    tableTitle: Array<string>,
    tableContent: Record<string, string>[], // safer type
    pushQuery: string,
    buttonLink: string
}

const TableGrid: FC<tableGridProp> = ({ formTitle, tableTitle, tableContent, pushQuery, buttonLink }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentNumber, setCurrentNumber] = useState('')
    const searchParam = useSearchParams()
    const router = useRouter()

    const handleClick = (getPushQuery: string) => {
        router.push(`?${pushQuery}=${getPushQuery}`)
        setCurrentNumber(getPushQuery)
        setIsOpen(true)
    }

    const handleClose = () => {
        const params = new URLSearchParams(window.location.search)
        params.delete(pushQuery)
        const queryString = params.toString()
        const currentPath = window.location.pathname
        router.replace(queryString ? `?${queryString}` : currentPath)
        setIsOpen(false)
        setCurrentNumber('')
    }

    useEffect(() => {
        if (searchParam.has(pushQuery)) {
            const requestQuery = searchParam.get(pushQuery)
            if (requestQuery) {
                setCurrentNumber(requestQuery)
                setIsOpen(true)
            }
        }
    }, [])

    return (
        <div className="relative h-full text-[#494949]">
            <div className="bg-white h-full py-5 px-8 rounded-xl overflow-y-scroll">
                <div className="flex justify-between py-5">
                    <div className="font-semibold text-lg">{formTitle}</div>
                    <div className="flex gap-3">
                        <button className="bg-[#26361C] hover:bg-[#7a856b] text-white px-3 cursor-pointer flex items-center">import</button>
                        <button className="bg-[#26361C] hover:bg-[#7a856b] text-white px-3 cursor-pointer flex items-center">export</button>
                        <Link href={`/${buttonLink}`} className="bg-[#26361C] hover:bg-[#7a856b] px-3 text-white cursor-pointer flex items-center">add new</Link>
                    </div>
                </div>
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="h-10 bg-[#26361C] text-white">
                            {tableTitle.map((title, index) =>
                                <th key={index} className="text-start px-3">{title}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent.map((item, index) => (
                            <tr onClick={() => handleClick(item[pushQuery])} key={index} className="h-10 border-b-2 border-[#F3F5F7] hover:bg-[#B6C6A1] hover:cursor-pointer">
                                {tableTitle.map((field: string) => (
                                    <td key={field} className="px-3">{item[field as keyof typeof item]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={`${isOpen ? 'absolute top-0 left-1 w-full h-full bg-white z-40 p-7' : 'hidden'} `}>
                <button onClick={handleClose} className="text-3xl hover:cursor-pointer absolute right-6">x</button>
                <PopModalForm currentID={currentNumber}></PopModalForm>
            </div>
        </div>
    )
}

export default TableGrid