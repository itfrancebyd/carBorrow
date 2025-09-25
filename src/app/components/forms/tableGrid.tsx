'use client'
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react"
import PopModalForm from "./popModal";
import Link from "next/link";

interface tableGridProp {
    formTitle: string;
    tableTitle: Array<{ key: string; label: string; }>;
    tableContent: Record<string, any>[]; // safer type
    pushQuery: string;
    dragDropLink: string;
    buttonLink: string;
    fetchDetailWithId: any;
    actionDelete: any;
    actionEdit: any;
    selectInfo: any
}

const TableGrid: FC<tableGridProp> = ({
    formTitle,
    tableTitle,
    tableContent,
    pushQuery,
    dragDropLink,
    buttonLink,
    fetchDetailWithId,
    actionDelete,
    actionEdit,
    selectInfo
}) => {
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
        <div className="h-full w-full px-8 text-[#494949] text-xs lg:text-sm">
            <div className="bg-white h-full overflow-y-auto">
                <div className="flex justify-between py-5">
                    <div className="font-semibold text-sm lg:text-base">{formTitle}</div>
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
                                <th key={index} className="text-start px-3 whitespace-nowrap">{item.label}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent.map((item, index) => (
                            <tr
                                key={index}
                                onClick={() => handleClick(item.id)}
                                className="h-10 border-b-2 border-[#F3F5F7] whitespace-nowrap hover:bg-[#B6C6A1] hover:cursor-pointer"
                            >
                                {tableTitle.map((field) => (
                                    field.key.toLowerCase() === "status"
                                        ? (
                                            <td key={field.key} className="px-3">
                                                {item.status === "enable" ? (
                                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5933" width="16" height="16"><path d="M510.567403 63.852903c-246.304387 0-446.663336 200.358949-446.663336 446.663336 0 246.304387 200.358949 446.663336 446.663336 446.663336 246.304387 0 446.765664-200.358949 446.765664-446.663336C957.230738 264.211852 756.87179 63.852903 510.567403 63.852903L510.567403 63.852903zM787.979614 386.084941 454.593784 719.573099c-7.981613 7.981613-20.977316 7.981613-28.958929 0l-43.694214-43.694214c0 0 0 0 0 0L237.145998 531.084241c-7.981613-7.981613-7.981613-20.977316 0-28.958929l43.694214-43.694214c7.981613-7.981613 20.977316-7.981613 28.958929 0L440.063156 588.592785 715.326471 313.329469c7.981613-7.981613 20.977316-7.981613 29.061257 0L787.979614 357.126012C796.063556 365.107625 796.063556 378.103328 787.979614 386.084941L787.979614 386.084941z" p-id="5934" fill="#26361C"></path></svg>
                                                ) : (
                                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1490" width="16" height="16"><path d="M 506.56 25.92 C 239.68 25.92 23.36 242.24 23.36 509.12 s 216.32 483.2 483.2 483.2 s 483.2 -216.32 483.2 -483.2 C 989.44 242.24 773.12 25.92 506.56 25.92 Z m 239.04 663.68 l -81.28 81.28 l -157.76 -157.76 l -157.76 157.76 l -81.28 -81.28 l 157.76 -157.76 l -157.76 -157.76 l 81.28 -81.28 l 157.76 157.76 l 157.76 -157.76 l 81.28 81.28 l -157.76 157.76 l 157.76 157.76 Z" fill="#d81e06" p-id="1491"></path></svg>
                                                )}
                                            </td>
                                        )
                                        : (
                                            <td key={field.key} className="px-3 whitespace-nowrap">{item[field.key as keyof typeof item]}</td>
                                        )
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={`${isOpen ? 'fixed inset-0 w-full h-screen overflow-hidden bg-gray-400/50 z-40 p-7' : 'hidden'} `}>
                <PopModalForm
                    closeEvent={handleClose}
                    currentID={currentNumber}
                    fetchData={fetchDetailWithId}
                    tableTitle={tableTitle}
                    actionDelete={actionDelete}
                    actionEdit={actionEdit}
                    selectInfo={selectInfo}
                ></PopModalForm>
            </div>
        </div>
    )
}

export default TableGrid