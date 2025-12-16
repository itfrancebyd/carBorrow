'use client'
import { useRouter, useSearchParams } from "next/navigation";
import React, { cloneElement, FC, ReactNode, useEffect, useState } from "react"
import AllocateCarModal from "./allocateCarModal";
import Link from "next/link";

interface tableGridTableLoanReqProp {
    formTitle: string;
    tableTitle: Array<{ key: string; label: string; }>;
    tableContent: Record<string, any>[]; // safer type
    pushQuery: string;
    dragDropLink: string;
    buttonLink: string;
    children?: ReactNode;
}
interface allocateProp {
    id: string
    applicant: string
    department: string
    loan_start_date: string
    loan_start_time: string
    loan_end_time: string
    loan_end_date: string
    prefered_model: string
    vehicle_number: number
    allocated_vehicle_id: string[] | null
    status: string
    checkin_location: string
    checkin_km: number
    checkin_energy: number
    checkout_location: string
    checkout_km: number
    checkout_energy: number
    key_given_date: string | null
}

const TableCell = ({
    field,
    item,
    handleAllocate
}: {
    handleAllocate: (event: React.MouseEvent, item: any) => void;
    field: { key: string; label: string };
    item: Record<string, any>;
}) => {
    const key = field.key.toLowerCase()
    if (key === "status") {
        if (item.status === "new") {
            return (
                <div className="bg-[#4C763B] text-white text-[8px] font-semibold px-1 py-0.5 rounded-sm">NEW</div>
                // <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6188" width="32" height="32"><path d="M930.90671 255.998645H93.091484C41.890671 255.998645 0.000903 297.892026 0.000903 349.091032v325.81613c0 51.200813 41.889768 93.092387 93.090581 93.092386H930.90671c51.202619 0 93.092387-41.891574 93.092387-93.092386V349.091032c0-51.199007-41.891574-93.092387-93.092387-93.092387zM325.818839 605.089678c0 9.768018-6.516828 18.618477-15.826067 21.884116-2.319182 0.933814-5.111592 1.390787-7.44703 1.390787-6.973801 0-13.962052-3.726224-18.618477-9.768018l-97.745201-129.395528v115.890449c0 12.576684-10.241246 23.274903-23.273096 23.274903s-23.271291-10.698219-23.271291-23.274903V419.840524c0-9.764405 6.516828-18.614865 15.826067-21.884117 9.782467-3.251189 20.021907 0 26.065507 8.380844 32.582335 42.982529 65.162865 85.96867 97.7452 128.936749v-115.433476c0-12.558622 10.23944-22.814318 23.273097-22.814318s23.273097 10.255696 23.273097 22.814318l-0.001806 185.249154z m162.908064-116.360065c13.033657 0 23.273097 10.237634 23.273097 23.27129s-10.23944 23.271291-23.273097 23.271291h-69.817484v46.546193h69.817484c13.033657 0 23.273097 10.241246 23.273097 23.273097 0 13.033657-10.23944 23.274903-23.273097 23.274903h-93.09058c-13.03185 0-23.273097-10.241246-23.273097-23.274903V418.910322c0-13.03185 10.23944-23.271291 23.273097-23.27129h93.09058c13.033657 0 23.273097 10.237634 23.273097 23.27129s-10.23944 23.273097-23.273097 23.273097h-69.817484v46.548l69.817484-0.001806z m388.18839-63.761241a1045968.307762 1045968.307762 0 0 0-68.887283 182.458549 22.704139 22.704139 0 0 1-21.410887 14.89406c-9.307432 0-18.145249-6.058049-21.410888-14.89406-15.824261-41.889768-31.650328-83.783148-47.476395-125.687365-15.826067 41.906024-31.646715 83.797598-47.474588 125.687365-6.516828 17.68647-36.304947 17.68647-42.821776 0a1045968.307762 1045968.307762 0 0 0-68.887283-182.458549c-4.181391-11.644676 1.40343-24.678333 13.506886-29.331146 12.099843-4.654619 25.133499 1.387174 29.31489 13.488823 15.824261 41.906024 31.648522 83.797598 47.476395 125.689172a1178505.221411 1178505.221411 0 0 0 47.474588-125.689172c6.515022-17.68647 36.306753-17.68647 42.821776 0 15.826067 41.906024 31.652134 83.797598 47.476395 125.689172 15.826067-41.891574 31.650328-83.783148 47.476395-125.689172 4.19584-12.101649 17.68647-17.68647 29.331146-13.488823 12.101649 4.19584 18.145249 17.229497 13.490629 29.331146z" fill="#26361C" p-id="6189"></path></svg>
            )
        }
        if (item.status === "allocated") {
            return (
                <div className="bg-[#82b640] text-white text-[6px] font-semibold px-1 py-0.5 rounded-sm">ALLOCATED</div>
            )
        }
        if (item.status === "canceled") {
            return (
                <div className="bg-[#99A1AF] text-white text-[7px] font-semibold px-1 py-0.5 rounded-sm">CANCELED</div>
            )
        }
        if (item.status === "issued") {
            return (
                <div className="bg-[#f4d138] text-white text-[7px] font-semibold px-1 py-0.5 rounded-sm">ISSUED</div>
            )
        }
        if (item.status === "completed") {
            return (
                <div className="bg-[#f43845] text-white text-[7px] font-semibold px-1 py-0.5 rounded-sm">COMPLETED</div>
            )
        }
    }
    if (key === "allocate") {
        if (item.status === "canceled") {
            return (
                <button
                    className="bg-[#737572] text-white px-1 py-0.5 rounded-sm hover:cursor-not-allowed"
                    onClick={(event) => event.stopPropagation()}
                >
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12341" width="16" height="16"><path d="M872.8 63.1H151.4c-48.7 0-88.3 39.6-88.3 88.3v718.4c0 48.7 39.6 88.3 88.3 88.3h721.4c48.7 0 88.3-39.6 88.3-88.3V151.4c0-48.7-39.6-88.3-88.3-88.3z m-721.4 64h721.4c13.4 0 24.3 10.9 24.3 24.3v104.2h-770V151.4c0-13.4 10.9-24.3 24.3-24.3z m721.4 767H151.4c-13.4 0-24.3-10.9-24.3-24.3V319.6h770v550.2c0 13.4-10.9 24.3-24.3 24.3z" fill="#ffffff" p-id="12342"></path><path d="M224.6 479.6m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#ffffff" p-id="12343"></path><path d="M418.1 479.6m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#ffffff" p-id="12344"></path><path d="M610.1 479.6m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#ffffff" p-id="12345"></path><path d="M800.6 479.6m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#ffffff" p-id="12346"></path></svg>
                </button>
            )
        }
        return (
            <button
                className="bg-[#26361C] text-white px-1 py-0.5 rounded-sm hover:bg-[#425d31] hover:cursor-pointer"
                onClick={e => handleAllocate(e, item)}
            >
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12341" width="16" height="16"><path d="M872.8 63.1H151.4c-48.7 0-88.3 39.6-88.3 88.3v718.4c0 48.7 39.6 88.3 88.3 88.3h721.4c48.7 0 88.3-39.6 88.3-88.3V151.4c0-48.7-39.6-88.3-88.3-88.3z m-721.4 64h721.4c13.4 0 24.3 10.9 24.3 24.3v104.2h-770V151.4c0-13.4 10.9-24.3 24.3-24.3z m721.4 767H151.4c-13.4 0-24.3-10.9-24.3-24.3V319.6h770v550.2c0 13.4-10.9 24.3-24.3 24.3z" fill="#ffffff" p-id="12342"></path><path d="M224.6 479.6m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#ffffff" p-id="12343"></path><path d="M418.1 479.6m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#ffffff" p-id="12344"></path><path d="M610.1 479.6m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#ffffff" p-id="12345"></path><path d="M800.6 479.6m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#ffffff" p-id="12346"></path></svg>
            </button>
        )
    }
    return <p className="truncate">{item[key]}</p>
}

const TableGridLoanReq: FC<tableGridTableLoanReqProp> = ({
    formTitle,
    tableTitle,
    tableContent,
    pushQuery,
    dragDropLink,
    buttonLink,
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentNumber, setCurrentNumber] = useState('')
    const [isAllocateOpen, setAllocateOpen] = useState(false)
    const [isCurrentRequest, setCurrentRequest] = useState<allocateProp>({
        id: "loading",
        applicant: "loading",
        department: "loading",
        loan_start_date: "loading",
        loan_start_time: "00:00:00",
        loan_end_time: "00:00:00",
        loan_end_date: "loading",
        prefered_model: "loading",
        vehicle_number: 0,
        allocated_vehicle_id: [],
        status: "loading",
        checkin_location: "loading",
        checkin_km: 0,
        checkin_energy: 0,
        checkout_location: "loading",
        checkout_km: 0,
        checkout_energy: 0,
        key_given_date: null
    })
    const searchParam = useSearchParams()
    const router = useRouter()

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

    const handleAllocate = (event: React.MouseEvent, item: any) => {
        event.stopPropagation()
        setAllocateOpen(true)
        setCurrentRequest({
            id: item.id,
            applicant: item.applicant,
            department: item.applicant_department,
            loan_start_date: item.loan_start_date,
            loan_start_time: item.loan_start_time,
            loan_end_date: item.loan_end_date,
            loan_end_time: item.loan_end_time,
            prefered_model: item.prefered_model,
            vehicle_number: item.vehicle_number,
            allocated_vehicle_id: item.allocated_vehicle_id,
            status: item.status,
            checkin_location: item.checkin_location,
            checkin_km: item.checkin_km,
            checkin_energy: item.checkin_energy,
            checkout_location: item.checkout_location,
            checkout_km: item.checkout_km,
            checkout_energy: item.checkout_energy,
            key_given_date: item.key_given_date
        })
    }

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
                                        item.key.toLowerCase() === "status" || item.key.toLowerCase() === "allocate" ? "0.5fr" : "1fr"
                                    )
                                    .join(" "),
                            }}
                        >
                            {tableTitle.map((item, index) => (
                                <div key={index} className="px-3 py-2 whitespace-nowrap border-r border-[#394d2d] truncate">
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
                                                (field.key.toLowerCase() === "status" || field.key.toLowerCase() === "allocate") ? "0.5fr" : "1fr"
                                            )
                                            .join(" "),
                                    }}
                                >
                                    {tableTitle.map((field, colIndex) => (
                                        <div
                                            key={colIndex}
                                            className="px-3 py-2 flex items-center truncate whitespace-nowrap"
                                        >
                                            <TableCell field={field} item={item} handleAllocate={handleAllocate}></TableCell>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {isAllocateOpen &&
                <AllocateCarModal
                    onClose={() => setAllocateOpen(false)}
                    currentRequest={isCurrentRequest}
                />}
            <div
                className={`${isOpen ? 'fixed inset-0 w-full h-screen overflow-hidden bg-gray-400/50 z-40 p-7' : 'hidden'} `}
                onClick={handleClose}>
                {children &&
                    cloneElement(children as React.ReactElement<any>, {
                        closeEvent: handleClose,
                        currentID: currentNumber
                    })}
            </div>
        </div>
    )
}

export default TableGridLoanReq