'use client'
import dayjs from "dayjs";
import { useEffect, useState } from "react";

type ScheduleStatus = "upcoming" | "ongoing" | "completed";

const ScheduleForm = (
    { handleScheduleClose, currentId, fetchVehicleSchedule, fetchExistingSchedule }: {
        handleScheduleClose: () => void;
        fetchVehicleSchedule: (id: string) => Promise<any>;
        fetchExistingSchedule: (id: string) => Promise<any>;
        currentId: string
    }) => {

    const [isLoading, setLoading] = useState(false)
    const [isScheduleData, setScheduleData] = useState<Record<string, any> | null>(null)
    const [isExistSchedule, setExistSchedule] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const getScheduleStatus = (
        startDate: string | Date,
        endDate: string | Date
    ): ScheduleStatus => {
        const today = dayjs()
        const start = dayjs(startDate)
        const end = dayjs(endDate)

        if (today.isBefore(start)) return "upcoming"
        if (today.isAfter(end)) return "completed"
        return "ongoing"
    }

    useEffect(() => {
        if (!currentId) return

        setLoading(true)
        setError(null)

        fetchVehicleSchedule(currentId)
            .then((res) => { setScheduleData(res[0]) })
            .catch((err) => {
                console.error("Failed to fetch data:", err);
                setError(err instanceof Error ? err.message : "Something went wrong");
            })
            .finally(() => setLoading(false))

        fetchExistingSchedule(currentId)
            .then((res) => { setExistSchedule(res) })
            .catch((err) => {
                console.error("Failed to fetch data:", err);
                setError(err instanceof Error ? err.message : "Something went wrong");
            })
            .finally(() => setLoading(false))
    }, [currentId, fetchVehicleSchedule])

    return (
        <div className="bg-[#8C8C8C]/70 z-50 fixed top-0 bottom-0 left-0 right-0">
            <div className="bg-white shadow-xl rounded-2xl z-50 absolute top-1/8 bottom-1/8 left-1/8 right-1/8 py-6 overflow-y-auto">
                <div className="text-sm flex justify-between pb-3 px-6 border-b-1 border-[#dadada]">
                    <div className="flex flex-row gap-2 items-center">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8620" width="16" height="16"><path d="M919.68 949.12H103.68a96 96 0 0 1-96-96V167.04a96 96 0 0 1 96-96H384a95.36 95.36 0 0 1 72.96 33.92l56.32 64a33.28 33.28 0 0 0 24.32 10.88h378.88a96 96 0 0 1 96.64 96v576a96 96 0 0 1-93.44 97.28zM103.68 135.04a32 32 0 0 0-32 32v686.08a32 32 0 0 0 32 32h816a32.64 32.64 0 0 0 32-32v-576a32 32 0 0 0-32-32H540.8a99.2 99.2 0 0 1-74.24-33.28l-56.32-64a33.92 33.92 0 0 0-26.24-12.8z" fill="#26361C" p-id="8621"></path><path d="M945.28 374.4H78.08a32 32 0 1 1 0-64h867.2a32 32 0 0 1 0 64z" fill="#26361C" p-id="8622"></path></svg>
                        <div>Schedule</div>
                    </div>
                    <button onClick={handleScheduleClose} className="cursor-pointer">X</button>
                </div>
                <div className="px-6 pt-3 text-sm">
                    {/* --- Vehicle Summary --- */}
                    <div className="bg-[#f5f7f4] border border-[#d9dfd5] rounded-md p-4 mb-4 shadow-sm">
                        {isScheduleData &&
                            <>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-semibold text-[#26361C] text-base">Vehicle Information</div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${isScheduleData.status === "enable"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {isScheduleData.status === "enable" ? "Available" : "Unavailable"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-1 text-xs text-gray-700">
                                    <p>
                                        <span className="font-medium">Model:</span> {isScheduleData.model_name}
                                    </p>
                                    <p className="whitespace-nowrap truncate">
                                        <span className="font-medium">Version:</span> {isScheduleData.version_name}
                                    </p>
                                    <p>
                                        <span className="font-medium">Plate Number:</span> {isScheduleData.plate_number}
                                    </p>
                                    <p>
                                        <span className="font-medium">Exterior:</span> {isScheduleData.exterior_colour}
                                    </p>
                                    <p>
                                        <span className="font-medium">Interior:</span> {isScheduleData.interior_colour}
                                    </p>
                                </div>
                            </>}

                    </div>

                    {/* --- Existing Schedules --- */}
                    <div className="border border-[#dadada] rounded-md p-4 bg-white mb-4">
                        <div className="font-semibold text-[#26361C] mb-2">Existing Schedules</div>
                        {isExistSchedule.length > 0 ? (
                            <div className="overflow-y-auto max-h-[40vh] divide-y divide-gray-200 text-xs">
                                {isExistSchedule.map((sch) => {
                                    const status = getScheduleStatus(sch.loan_start_date, sch.loan_end_date);
                                    return (
                                        <div
                                            key={sch.id}
                                            className="flex justify-between items-center py-2 hover:bg-gray-50"
                                        >
                                            <div className="w-2/5 truncate">
                                                {sch.loan_start_date} → {sch.loan_end_date}
                                            </div>
                                            <div className="w-1/3 truncate text-gray-600">
                                                {sch.applicant || "—"}
                                            </div>
                                            <div
                                                className={`text-right w-1/4 font-semibold ${status === "ongoing"
                                                    ? "text-green-600"
                                                    : status === "upcoming"
                                                        ? "text-blue-600"
                                                        : "text-gray-500"
                                                    }`}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </div>
                                            {/* <ScheduleStatus start_date={sch.loan_start_date} end_date={sch.loan_end_date} status={sch.status} /> */}
                                        </div>
                                    )
                                }
                                )
                                }
                            </div>
                        ) : (
                            <div className="text-gray-400 italic text-xs py-2">
                                No schedules yet.
                            </div>
                        )}
                    </div>

                    {/* <div>
                        <button type="button" className="bg-[#26361C] hover:bg-[#425d31] text-white px-2 py-1 hover:cursor-pointer">add schedule</button>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ScheduleForm