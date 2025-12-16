'use client'
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react"

interface tableGridLogProp {
    formTitle: string;
    tableTitle: Array<{ key: string; label: string; }>;
    tableContent: Record<string, any>[]; // safer type
    // pushQuery: string;
    // dragDropLink: string;
    // buttonLink: string;
    // children?: ReactNode
}

type DetailDiff = Record<string, { old: string; new: string }>
const renderDetail = (item: any) => {
    const detail = item.detail

    if (item.action == "INSERT" && item.target == "loan_requests" && !item.user_email) {
        return (
            <div className="truncate text-xs">
                New loan request is submitted from jotform.
            </div>)
    }
    if (item.action == "INSERT" && item.target == "loan_requests" && item.user_email) {
        return (
            <div className="truncate text-xs">
                New loan request is added by the user.
            </div>)
    }
    if (item.action == "UPDATE" && item.target == "loan_requests" && !item.user_email) {
        return (
            <div className="truncate text-xs">
                User submitted a check-in check-out form.
            </div>)
    }
    if (item.action == "DELETE" && item.target == "loan_requests" && !item.user_email) {
        return (
            <div className="truncate text-xs">
                One loan request has been deleted.
            </div>)
    }

    let parsedDetail: DetailDiff = detail

    if (typeof detail === "string") {
        try {
            parsedDetail = JSON.parse(detail)
        } catch (e) {
            return <p className="truncate text-xs">{detail}</p>
        }
    }

    if (typeof parsedDetail !== "object" || parsedDetail === null) {
        return <p className="truncate">{String(parsedDetail)}</p>
    }

    return (
        <div className="flex flex-col text-xs text-gray-600">
            {Object.entries(parsedDetail).map(([key, value]: [string, { old: string, new: string }]) => (
                <div key={key} className="flex gap-1 whitespace-nowrap">
                    <span className="font-semibold">{key}:</span>
                    <span className="truncate">change from {String(value.old)} to {String(value.new)}</span>
                </div>
            ))}
        </div>
    )
}

const TableGridLog: FC<tableGridLogProp> = ({
    formTitle,
    tableTitle,
    tableContent,
    // pushQuery,
    // dragDropLink,
    // buttonLink,
    // children
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


    return (
        <div className="w-full h-full overflow-hidden flex px-6 text-[#494949] text-xs lg:text-sm">
            <div className="bg-white w-full flex flex-col mb-4">
                <div className="flex justify-between py-5">
                    <div className="font-semibold text-sm lg:text-base">{formTitle}</div>
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
                                        item.key.toLowerCase() === "action_at" || item.key.toLowerCase() === "user_email" || item.key.toLowerCase() === "target" || item.key.toLowerCase() === "action" ? "0.6fr" : "2fr"
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
                                    className="grid border-b border-[#F3F5F7] hover:bg-[#B6C6A1] cursor-pointer items-center"
                                    style={{
                                        gridTemplateColumns: tableTitle
                                            .map((field) =>
                                                field.key.toLowerCase() === "action_at" || field.key.toLowerCase() === "user_email" || field.key.toLowerCase() === "target" || field.key.toLowerCase() === "action" ? "0.6fr" : "2fr"
                                            )
                                            .join(" "),
                                    }}
                                >
                                    {tableTitle.map((field, colIndex) => (
                                        <div
                                            key={colIndex}
                                            className="px-3 py-2 flex items-center truncate whitespace-nowrap"
                                        >
                                            {field.key.toLowerCase() === "detail" ? (
                                                renderDetail(item)
                                            ) : (
                                                <p className="truncate text-xs">{item[field.key as keyof typeof item]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TableGridLog