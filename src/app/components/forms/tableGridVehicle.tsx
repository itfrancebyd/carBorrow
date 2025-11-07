'use client'
import { useRouter, useSearchParams } from "next/navigation";
import React, { cloneElement, FC, ReactNode, useEffect, useState } from "react"
import Link from "next/link";
import ScheduleForm from "./scheduleForm";

const SCHEDULEQUERY = "schedulevehicle"

interface tableGridTableGridVehicleProp {
    formTitle: string;
    tableTitle: Array<{ key: string; label: string; }>;
    tableContent: Record<string, any>[]; // safer type
    pushQuery: string;
    dragDropLink: string;
    buttonLink: string;
    children?: ReactNode;
    fetchVehicleSchedule: (id: string) => Promise<any>;
    fetchExistingSchedule: (id: string) => Promise<any>
}

const TableCell = ({
    handleScheduleOpen,
    field,
    item,
}: {
    handleScheduleOpen: (event: React.MouseEvent, id: string) => void;
    field: { key: string; label: string };
    item: Record<string, any>;
}) => {

    const key = field.key.toLowerCase()
    if (key === "status") {
        return item.status === "enable" ? (
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
    }

    if (key === "vehicle_schedule") {
        return (
            <Link
                href={`/?${SCHEDULEQUERY}=${item.id}`}
                className="text-[#26361C] hover:underline bg-[#26361C] hover:bg-[#425d31] px-1 py-1 rounded-md"
                onClick={(e) => handleScheduleOpen(e, item.id)} // prevent row click
            >
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4748" width="16" height="16"><path d="M682.666667 128.170667h128c49.322667 0 86.954667 42.752 86.954666 93.696v665.770666c0 50.901333-37.674667 93.738667-86.954666 93.738667H215.893333c-49.322667 0-86.997333-42.794667-86.997333-93.738667V221.866667c0-50.944 37.546667-93.696 86.997333-93.696H341.333333V64a21.333333 21.333333 0 0 1 42.666667 0v170.666667a21.333333 21.333333 0 0 1-42.666667 0V170.837333H215.893333c-24.533333 0-44.330667 22.485333-44.330666 51.029334v665.770666c0 28.501333 19.84 51.072 44.330666 51.072H810.666667c24.448 0 44.288-22.613333 44.288-51.072V221.866667c0-28.501333-19.797333-51.029333-44.288-51.029334h-128V234.666667a21.333333 21.333333 0 1 1-42.666667 0v-170.666667a21.333333 21.333333 0 1 1 42.666667 0v64.170667z" p-id="4749" fill="#ffffff"></path><path d="M447.872 170.666667h127.786667a21.333333 21.333333 0 1 0 0-42.666667h-127.786667a21.333333 21.333333 0 1 0 0 42.666667zM341.632 384h341.333333a21.333333 21.333333 0 0 0 0-42.666667h-341.333333a21.333333 21.333333 0 0 0 0 42.666667zM341.632 554.666667h170.666667a21.333333 21.333333 0 1 0 0-42.666667h-170.666667a21.333333 21.333333 0 1 0 0 42.666667zM341.632 725.333333h341.077333a21.333333 21.333333 0 1 0 0-42.666666H341.632a21.333333 21.333333 0 1 0 0 42.666666z" p-id="4750" fill="#ffffff"></path></svg>
            </Link>
        )
    }
    return <p className="truncate">{item[key]}</p>
}

const TableGridVehicle: FC<tableGridTableGridVehicleProp> = ({
    formTitle,
    tableTitle,
    tableContent,
    pushQuery,
    dragDropLink,
    buttonLink,
    children,
    fetchVehicleSchedule,
    fetchExistingSchedule
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScheduleOpen, setScheduleOpen] = useState(false)
    const [currentNumber, setCurrentNumber] = useState('')
    const [currentVehicleId, setCurrentVehicleId] = useState('')
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

    const handleScheduleOpen = (event: React.MouseEvent, id: string) => {
        event.stopPropagation()
        setCurrentVehicleId(id)
        setScheduleOpen(true)
    }

    const handleScheduleClose = () => {
        const param = new URLSearchParams(window.location.search)
        param.delete(SCHEDULEQUERY)
        const currentPath = window.location.pathname
        const queryString = param.toString()
        router.replace(queryString ? `?${queryString}` : currentPath)
        setScheduleOpen(false)
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
                            className="grid bg-[#26361C] text-white font-semibold sticky top-0 z-10 shadow-2xl"
                            style={{
                                gridTemplateColumns: tableTitle
                                    .map((item) =>
                                        item.key.toLowerCase() === "status" || item.key.toLowerCase() === "vehicle_schedule" || item.key.toLowerCase() === "model_name" || item.key.toLowerCase() === "plate_number" ? "0.5fr" : "1fr"
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
                                                (field.key.toLowerCase() === "status" || field.key.toLowerCase() === "vehicle_schedule" || field.key.toLowerCase() === "model_name" || field.key.toLowerCase() === "plate_number") ? "0.5fr" : "1fr"
                                            )
                                            .join(" "),
                                    }}
                                >
                                    {tableTitle.map((field, colIndex) => (
                                        <div
                                            key={colIndex}
                                            className="px-3 py-2 flex items-center truncate whitespace-nowrap"
                                        >
                                            <TableCell handleScheduleOpen={handleScheduleOpen} field={field} item={item}></TableCell>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {isScheduleOpen
                &&
                <ScheduleForm
                    handleScheduleClose={handleScheduleClose}
                    currentId={currentVehicleId}
                    fetchVehicleSchedule={fetchVehicleSchedule}
                    fetchExistingSchedule={fetchExistingSchedule}
                ></ScheduleForm>}
            <div className={`${isOpen ? 'fixed inset-0 w-full h-screen overflow-hidden bg-gray-400/50 z-40 p-7' : 'hidden'} `}>
                {children &&
                    cloneElement(children as React.ReactElement<any>, {
                        closeEvent: handleClose,
                        currentID: currentNumber
                    })}
            </div>
        </div>
    )
}

export default TableGridVehicle