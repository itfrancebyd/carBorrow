'use client'
import { useRouter, useSearchParams } from "next/navigation";
import React, { cloneElement, FC, ReactNode, useEffect, useState } from "react"
import Link from "next/link";

interface tableGridProp {
    formTitle: string;
    tableTitle: Array<{ key: string; label: string; }>;
    tableContent: Record<string, any>[]; // safer type
    pushQuery: string;
    dragDropLink: string;
    buttonLink: string;
    children?: ReactNode
}

const TableGrid: FC<tableGridProp> = ({
    formTitle,
    tableTitle,
    tableContent,
    pushQuery,
    dragDropLink,
    buttonLink,
    children
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentNumber, setCurrentNumber] = useState('')
    const router = useRouter()
    const searchParam = useSearchParams()

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

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
        <div className="w-full h-full overflow-hidden flex px-6 text-[#494949] text-xs lg:text-sm">
            <div className="bg-white w-full flex flex-col mb-4">
                <div className="flex justify-between py-5">
                    <div className="font-semibold text-sm lg:text-base">{formTitle}</div>
                    <div className="flex gap-3">
                        {/* <Link href={`/${dragDropLink}`} className="bg-[#26361C] hover:bg-[#7a856b] text-white px-3 cursor-pointer flex items-center">import</Link> */}
                        {/* <button className="bg-[#26361C] hover:bg-[#7a856b] text-white px-3 cursor-pointer flex items-center">export</button> */}
                        <Link href={`/${buttonLink}`} className="bg-[#26361C] hover:bg-[#7a856b] px-3 text-white cursor-pointer flex items-center">add new</Link>
                    </div>
                </div>
                <div className="w-full flex-1 text-[#494949] text-xs lg:text-sm">
                    <div className="grid" style={{
                        gridTemplateRows: "auto 1fr", // header fixed, content scrollable   
                    }}>
                        {/* Header */}
                        <div
                            className="grid bg-[#26361C] text-white font-semibold shadow-2xl"
                            style={{
                                gridTemplateColumns: tableTitle
                                    .map((item) =>
                                        item.key.toLowerCase() === "status" ? "0.5fr" : "1fr"
                                    )
                                    .join(" "),
                            }}
                        >
                            {tableTitle.map((item, index) => (
                                <div key={index} className="px-3 py-2 whitespace-nowrap border-r border-[#394d2d]">
                                    {item.label}
                                </div>
                            ))}
                        </div>

                        {/* Scrollable content */}
                        <div>
                            {tableContent.map((item, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    onClick={() => handleClick(item.id)}
                                    className="grid border-b border-[#F3F5F7] hover:bg-[#B6C6A1] cursor-pointer items-center"
                                    style={{
                                        gridTemplateColumns: tableTitle
                                            .map((field) =>
                                                field.key.toLowerCase() === "status" ? "0.5fr" : "1fr"
                                            )
                                            .join(" "),
                                    }}
                                >
                                    {tableTitle.map((field, colIndex) => (
                                        <div
                                            key={colIndex}
                                            className="px-3 py-2 flex items-center truncate whitespace-nowrap"
                                        >
                                            {field.key.toLowerCase() === "status" ? (
                                                item.status === "enable" ? (
                                                    <svg
                                                        viewBox="0 0 1024 1024"
                                                        width="16"
                                                        height="16"
                                                        fill="#26361C"
                                                    >
                                                        <path d="M510.6 63.9c-246.3 0-446.7 200.4-446.7 446.7s200.4 446.7 446.7 446.7 446.8-200.4 446.8-446.7S756.9 63.9 510.6 63.9zM788 386.1 454.6 719.6c-8 8-21 8-29 0l-43.7-43.7-143.7-144c-8-8-8-21 0-29l43.7-43.7c8-8 21-8 29 0l164.2 164.2 275.3-275.3c8-8 21-8 29 0l43.6 43.8c8.1 8 8.1 21 0.1 29z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        viewBox="0 0 1024 1024"
                                                        width="16"
                                                        height="16"
                                                        fill="#d81e06"
                                                    >
                                                        <path d="M506.6 25.9C239.7 25.9 23.4 242.2 23.4 509.1s216.3 483.2 483.2 483.2 483.2-216.3 483.2-483.2S773.1 25.9 506.6 25.9z m239 663.7l-81.3 81.3-157.8-157.8-157.8 157.8-81.3-81.3 157.8-157.8-157.8-157.8 81.3-81.3 157.8 157.8 157.8-157.8 81.3 81.3-157.8 157.8 157.8 157.8z"></path>
                                                    </svg>
                                                )
                                            ) : (
                                                <p className="truncate">{item[field.key as keyof typeof item]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={`${isOpen ? 'fixed inset-0 w-full h-screen overflow-hidden bg-gray-400/50 z-40 p-7' : 'hidden'} `}
                onClick={handleClose}
            >
                {children &&
                    cloneElement(children as React.ReactElement<any>, {
                        closeEvent: handleClose,
                        currentID: currentNumber
                    })}
            </div>
        </div>
    )
}

export default TableGrid