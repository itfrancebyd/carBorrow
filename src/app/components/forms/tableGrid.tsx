'use client'
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react"
import PopModalForm from "./popModal";
import Link from "next/link";

interface tableGridProp {
    formTitle: string,
    tableTitle: Array<{ key: string; label: string; }>,
    tableContent: Record<string, any>[], // safer type
    pushQuery: string,
    dragDropLink: string,
    buttonLink: string
}

const TableGrid: FC<tableGridProp> = ({ formTitle, tableTitle, tableContent, pushQuery, dragDropLink, buttonLink }) => {
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

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation()
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
        <div className="relative h-full w-full text-[#494949] text-sm">
            <div className="bg-white h-full px-8 overflow-y-auto">
                <div className="flex justify-between py-5">
                    <div className="font-semibold text-base">{formTitle}</div>
                    <div className="flex gap-3">
                        <Link href={`/${dragDropLink}`} className="bg-[#26361C] hover:bg-[#7a856b] text-white px-3 cursor-pointer flex items-center">import</Link>
                        <button className="bg-[#26361C] hover:bg-[#7a856b] text-white px-3 cursor-pointer flex items-center">export</button>
                        <Link href={`/${buttonLink}`} className="bg-[#26361C] hover:bg-[#7a856b] px-3 text-white cursor-pointer flex items-center">add new</Link>
                    </div>
                </div>
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="h-10 bg-[#26361C] text-white">
                            {tableTitle.map((item, index) =>
                                <th key={index} className="text-start px-3">{item.label}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent.map((item,index) => (
                            <tr onClick={() => handleClick(item.id)} key={index} className="h-10 border-b-2 border-[#F3F5F7] hover:bg-[#B6C6A1] hover:cursor-pointer">
                                {tableTitle.map((field) => (
                                    field.key.toLowerCase() === "action" ? (
                                        <td key={field.key} className="px-3">
                                            <button
                                                disabled={item.edit === "disable"}
                                                className={`px-1 py-1 rounded-md ${item.edit == 'enable' ? 'bg-[#26361C] hover:bg-[#4f693d] hover:cursor-pointer' : 'bg-[#cdcdcd] hover:cursor-not-allowed'}`}
                                                onClick={(e) => handleEdit(e)}
                                            >
                                                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5380" width="16" height="16"><path d="M800 531.52a32 32 0 0 1 64 0v305.92A90.56 90.56 0 0 1 773.44 928H186.88A90.88 90.88 0 0 1 96 837.44V250.88A90.88 90.88 0 0 1 186.88 160h288a32 32 0 0 1 0 64h-288A26.56 26.56 0 0 0 160 250.88v586.56A26.56 26.56 0 0 0 186.88 864h586.56A26.56 26.56 0 0 0 800 837.44z" fill="#ffffff" p-id="5381"></path><path d="M825.28 209.92l-43.2-43.2-405.12 405.12-13.76 56.96 56.96-13.76zM444.16 675.2L327.36 704A32 32 0 0 1 288 664.64l28.16-116.8a32 32 0 0 1 8.32-15.04l424-423.04a48 48 0 0 1 67.2 0l66.56 66.88a47.68 47.68 0 0 1 0 66.88L459.2 666.56a33.92 33.92 0 0 1-15.04 8.64z" fill="#ffffff" p-id="5382"></path></svg>
                                            </button>
                                        </td>
                                    ) : (
                                        <td key={field.key} className="px-3">{item[field.key as keyof typeof item]}</td>
                                    )
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