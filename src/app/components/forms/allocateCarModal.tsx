"use client"
import React, { useEffect, useState } from "react"
import modelInfoJson from "@/docs/modelInfo.json"
import { createClient } from "@/utils/supabase/client"
import dayjs from "dayjs"

interface AllocateCarModalProps {
    onClose: () => void
    currentRequest: {
        id: string
        applicant: string
        department: string
        loan_start_date: string
        loan_start_time: string
        loan_end_date: string
        loan_end_time: string
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
}

interface FilterVehicleProp {
    id: string;
    vin: string;
    plate_number: string;
    model_name: string;
    version_name: string;
    interior_colour: string;
    exterior_colour: string
}

const AllocateCarModal: React.FC<AllocateCarModalProps> = ({
    onClose,
    currentRequest,
}) => {
    const [selectedVehicle, setSelectedVehicle] = useState<FilterVehicleProp>()
    const modelInfo = modelInfoJson as Record<string, string[]>
    const [selectedModelName, setSelectedModelName] = useState("")
    const [availableVehicles, setAvailableVehicles] = useState<any[]>([])
    const [isAllocatedInfo, setAllocatedInfo] = useState<any[]>([])
    const [reassignMode, setReassignMode] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [selectedVehicles, setSelectedVehicles] = useState<FilterVehicleProp[]>([])
    const supabase = createClient()

    const flattenData = (data: any[] = []) => {
        return data.map((item) => {
            const modelInfo = Array.isArray(item.model_information)
                ? item.model_information[0]
                : item.model_information

            return {
                ...item,
                model_name: modelInfo?.model_name,
                version_name: modelInfo?.version_name,
                interior_colour: modelInfo?.interior_colour,
                exterior_colour: modelInfo?.exterior_colour,
            }
        })
    }

    const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const modelName = e.target.value
        setSelectedModelName(modelName)
        if (!modelName) return

        // 查出所有匹配该 model_name 的车型 ID
        const { data: modelRows, error: modelError } = await supabase
            .from("vehicle_model")
            .select("id")
            .eq("model_name", modelName)

        if (modelError || !modelRows?.length) {
            console.error("Model not found:", modelError)
            setAvailableVehicles([])
            return
        }

        const modelIds = modelRows.map((m) => m.id)

        // 查找这些车型下的所有车辆
        const { data: allVehicles, error: vehicleError } = await supabase
            .from("car_fleet")
            .select(`
                    id,
                    vin,
                    plate_number,
                    model_information (
                                        id,
                                        model_name,
                                        version_name,
                                        interior_colour,
                                        exterior_colour
                                        )
                    `)
            .in("model_information", modelIds) as any// .in() 支持多 id

        if (vehicleError || !allVehicles) {
            console.error("Vehicle fetch error:", vehicleError)
            return
        }

        const flattenVehicles: FilterVehicleProp[] = allVehicles.map((v: { id: string; vin: string; plate_number: string; model_information: { model_name: string; version_name: string; interior_colour: string; exterior_colour: string } }) => ({
            id: v.id as string,
            vin: v.vin as string,
            plate_number: v.plate_number as string,
            model_name: v.model_information?.model_name ?? "" as string,
            version_name: v.model_information?.version_name ?? "" as string,
            interior_colour: v.model_information?.interior_colour ?? "" as string,
            exterior_colour: v.model_information?.exterior_colour ?? "" as string,
        }))

        // 获取当前所有已分配的车辆借用记录
        const { data: requests } = await supabase
            .from("loan_requests")
            .select("allocated_vehicle_id,loan_start_date,loan_start_time,loan_end_time,loan_end_date")
            .not("allocated_vehicle_id", "is", null)

        const startDate = currentRequest.loan_start_date + ' ' + currentRequest.loan_start_time
        const endDate = currentRequest.loan_end_date + ' ' + currentRequest.loan_end_time

        // 排除时间冲突车辆
        const available = flattenVehicles.filter((v) => {
            const conflict = requests?.some(
                (r) =>
                    r.allocated_vehicle_id === v.id &&
                    dayjs(r.loan_start_date + ' ' + r.loan_start_time).isBefore(endDate) &&
                    dayjs(r.loan_end_date + ' ' + r.loan_end_time).isAfter(startDate)
            )
            return !conflict
        })

        setAvailableVehicles(available)
    }

    const handleVehicleSelect = (vehicle: FilterVehicleProp) => {
        setSelectedVehicle(vehicle)
        const exists = selectedVehicles.some(v => v.id === vehicle.id)

        // already selected → romove
        if (exists) {
            setSelectedVehicles(prev =>
                prev.filter(v => v.id !== vehicle.id)
            )
            return
        }

        // all selected → no more alowed
        if (selectedVehicles.length >= currentRequest.vehicle_number) {
            return
        }

        // selection does not exit & not all selected → add
        setSelectedVehicles(prev => [...prev, vehicle])
    }

    useEffect(() => {
        setLoading(true)
        const fetchVehicleDetail = async (ids: string[]) => {
            if (!ids || ids.length === 0) {
                setAllocatedInfo([])
                return
            }
            const { data, error } = await supabase
                .from("car_fleet")
                .select(
                    `id,
            vin,
            plate_number,
            model_information(model_name,version_name,interior_colour,exterior_colour),
            plate_registration_date,
            km,
            battery,
            usage_update_date,
            key_1,
            key_2,
            current_location,
            status
            `
                )
                .in("id", ids)
            if (error) throw error
            setAllocatedInfo(flattenData(data) ?? null)
            setLoading(false)
        }
        if (Array.isArray(currentRequest.allocated_vehicle_id) && currentRequest.allocated_vehicle_id.length > 0) {
            fetchVehicleDetail(currentRequest.allocated_vehicle_id)
        }
        setLoading(false)
    }, [])

    const handleCancelAllocation = async () => {
        const { error } = await supabase
            .from("loan_requests")
            .update({
                allocated_vehicle_id: null,
                status: "new",
            })
            .eq("id", currentRequest.id)
            .select()

        if (error) console.error(error)
        else {
            alert("✅The allocated vehicle has been canceled!")
            window.location.href = '/loan-requests'
        }
    }

    const handleAssign = async () => {
        if (!selectedVehicle) return alert("Please select a vehicle")

        const allocatedId = selectedVehicles.map((item) => item.id)

        const { error } = await supabase
            .from("loan_requests")
            .update({
                allocated_vehicle_id: allocatedId,
                status: "allocated",
            })
            .eq("id", currentRequest.id)
            .select()

        if (error) console.error(error)
        else {
            alert("✅ Vehicle allocated successfully!")
            window.location.href = '/loan-requests'
            setReassignMode(false)
        }
    }

    const removeVehicle = (id: string) => {
        setSelectedVehicles(prev =>
            prev.filter(v => v.id !== id)
        )
    }

    const handleKeyGiven = async () => {
        const { error } = await supabase
            .from("loan_requests")
            .update({
                status: "issued",
                key_given_date: dayjs().format("YYYY-MM-DD"),
            })
            .eq("id", currentRequest.id)
            .select()

        if (error) console.error(error)
        else {
            alert("🔑The key has been passed to the user!")
            window.location.href = '/loan-requests'
        }
    }

    const handleComplete = async () => {
        const { error } = await supabase
            .from("loan_requests")
            .update({
                status: "completed"
            })
            .eq("id", currentRequest.id)
            .select()

        if (error) console.error(error)
        else {
            alert("🎉 Request marked as complete!")
            window.location.href = '/loan-requests'
        }
    }


    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-lg p-6 relative animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-lg font-semibold text-[#26361C] flex gap-1">Allocate Vehicle <div className="">{currentRequest.status}</div></h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                    >
                        ×
                    </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {/* Loan Request Info */}
                    <div className="space-y-2 text-sm mb-5 bg-[#F7F8F5] rounded-md p-3">
                        <p><strong>Applicant:</strong> {currentRequest.applicant}</p>
                        <p><strong>Department:</strong> {currentRequest.department}</p>
                        <p>
                            <strong>Loan Period:</strong>{" "}
                            {currentRequest.loan_start_date + ' ' + currentRequest.loan_start_time} → {currentRequest.loan_end_date + ' ' + currentRequest.loan_end_time}
                        </p>
                        <p><strong>Preferred Model:</strong> {currentRequest.prefered_model}</p>
                        <p><strong>Vehicle Number:</strong> {currentRequest.vehicle_number}</p>
                    </div>
                    {isLoading
                        ?
                        <div className="bg-[#F7F8F5] text-5xl text-gray-700 h-[300px] p-4">...</div>
                        :
                        (currentRequest.allocated_vehicle_id && isAllocatedInfo.length > 0 && !reassignMode
                            ? (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                                    <h3 className="text-sm font-semibold text-[#26361C] mb-3">
                                        Assigned Vehicle
                                    </h3>
                                    <div className="space-y-4">
                                        {isAllocatedInfo.map((vehicle) => (
                                            <div
                                                key={vehicle.id}
                                                className="border border-gray-200 rounded-lg bg-white px-4 py-3"
                                            >
                                                {/* Header */}
                                                <div className="mb-3 flex justify-between items-center">
                                                    <span className="text-sm font-semibold text-[#26361C]">
                                                        {vehicle.plate_number}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        VIN: {vehicle.vin}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                                                    <div className="flex justify-between gap-2">
                                                        <span className="text-gray-500">Model</span>
                                                        <span className="font-medium text-[#26361C]">
                                                            {vehicle.model_name}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between gap-2">
                                                        <span className="text-gray-500">Version</span>
                                                        <span className="font-medium text-[#26361C]">
                                                            {vehicle.version_name}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between gap-2">
                                                        <span className="text-gray-500">Interior</span>
                                                        <span className="font-medium text-[#26361C]">
                                                            {vehicle.interior_colour}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between gap-2">
                                                        <span className="text-gray-500">Exterior</span>
                                                        <span className="font-medium text-[#26361C]">
                                                            {vehicle.exterior_colour}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between gap-2">
                                                        <span className="text-gray-500">Location</span>
                                                        <span className="font-medium text-[#26361C]">
                                                            {vehicle.current_location ?? "N/A"}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between gap-2">
                                                        <span className="text-gray-500">Key</span>
                                                        <span className="font-medium text-[#26361C]">
                                                            {vehicle.key_1 || vehicle.key_2 ? vehicle.key_1 + '+' + vehicle.key_2 : "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action */}
                                    {currentRequest.status !== "completed" &&
                                        <div className="flex justify-end mt-5 gap-2">
                                            {/* If NOT key_given -> show 3 buttons */}
                                            {currentRequest.status !== "issued" ? (
                                                <>
                                                    <button
                                                        onClick={handleKeyGiven}
                                                        className="px-4 py-2 bg-[#4A7B2C] text-white rounded-md text-sm hover:bg-[#365b20] transition-colors cursor-pointer"
                                                    >
                                                        Key Given
                                                    </button>

                                                    <button
                                                        onClick={handleCancelAllocation}
                                                        className="px-4 py-2 border bg-[#26361C] border-[#26361C] text-white rounded-md text-sm hover:text-[#26361C] hover:bg-white transition-colors cursor-pointer"
                                                    >
                                                        Cancel allocate
                                                    </button>

                                                    <button
                                                        onClick={() => setReassignMode(true)}
                                                        className="px-4 py-2 border border-[#26361C] text-[#26361C] rounded-md text-sm hover:bg-[#26361C] hover:text-white transition-colors cursor-pointer"
                                                    >
                                                        Reallocate Vehicle
                                                    </button>
                                                </>
                                            ) : (<>
                                                {/* Key Given Card */}
                                                <div className="bg-[#E7F4DB] border border-[#C4E3B2] px-4 py-3 rounded-lg shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-7 h-7 rounded-full bg-[#4A7B2C] flex items-center justify-center text-white text-xs font-bold shadow">
                                                            ✓
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-bold text-[#2E4A1F] whitespace-nowrap">
                                                                Key has been given to the user
                                                            </span>

                                                            {currentRequest.key_given_date && (
                                                                <span className="text-[9px] text-[#6B8F4E] mt-0.5">
                                                                    Given at:{" "}
                                                                    <span className="font-semibold">{currentRequest.key_given_date}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Complete Button */}
                                                <button
                                                    onClick={handleComplete}
                                                    className="mt-4 w-full px-4 py-2 bg-[#26361C] text-white rounded-md text-xs font-medium hover:bg-[#3a5230] hover:cursor-pointer shadow-sm transition-all"
                                                >
                                                    Mark as Complete
                                                </button>
                                            </>

                                            )}
                                        </div>
                                    }

                                    {/* Check-in / Check-out Information */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                                        <h3 className="text-sm font-semibold text-[#26361C] mb-3">
                                            Check-in / Check-out Information
                                        </h3>

                                        {!currentRequest.checkin_location && !currentRequest.checkin_km && !currentRequest.checkin_energy && !currentRequest.checkout_location && !currentRequest.checkout_km && !currentRequest.checkout_energy ? (
                                            // ===== Placeholder when NO check info =====
                                            <div className="text-xs text-gray-500 italic">
                                                No check-in or check-out information has been provided yet.
                                                The user will submit this information via Jotform.
                                            </div>
                                        ) : (
                                            // ===== Show detailed check info =====
                                            <div className="space-y-4 text-sm text-gray-700">

                                                {/* Check-in */}
                                                <div>
                                                    <div className="text-[#26361C] font-medium mb-1">Check-in</div>
                                                    <div className="grid grid-cols-1 gap-x-6 gap-y-1">
                                                        <div>
                                                            <span className="font-medium text-[#26361C]">Pickup Location:</span>{" "}
                                                            {currentRequest.checkin_location || "N/A"}
                                                        </div>
                                                        <div className="grid grid-cols-2">
                                                            <div>
                                                                <span className="font-medium text-[#26361C]">Kilometer:</span>{" "}
                                                                {currentRequest.checkin_km || "N/A"}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-[#26361C]">Battery:</span>{" "}
                                                                {currentRequest.checkin_energy || "N/A"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Check-out */}
                                                <div>
                                                    <div className="text-[#26361C] font-medium mb-1">Check-out</div>
                                                    <div className="grid grid-cols-1 gap-x-6 gap-y-1">
                                                        <div>
                                                            <span className="font-medium text-[#26361C]">Return Location:</span>{" "}
                                                            {currentRequest.checkout_location || "N/A"}
                                                        </div>
                                                        <div className="grid grid-cols-2">
                                                            <div>
                                                                <span className="font-medium text-[#26361C]">Kilometer:</span>{" "}
                                                                {currentRequest.checkout_km || "N/A"}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-[#26361C]">Battery:</span>{" "}
                                                                {currentRequest.checkout_energy || "N/A"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                    </div>


                                </div>
                            )
                            :
                            <>
                                {/* Model Selection */}
                                <div className="flex flex-col gap-2 mb-4">
                                    <label className="text-sm font-medium text-[#26361C]">
                                        Select Vehicle Model
                                    </label>
                                    <select
                                        value={selectedModelName}
                                        onChange={handleModelChange}
                                        className="border border-gray-400 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#26361C]"
                                    >
                                        <option value="">-- Select a Model --</option>
                                        {modelInfo["Model Name"].map((model) => (
                                            <option key={model} value={model}>
                                                {model}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Available Vehicles List */}
                                {selectedModelName && (
                                    <div className="mt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-sm font-medium text-[#26361C]">
                                                Available Vehicles
                                            </h3>
                                            <span className="text-xs text-[#26361C] bg-[#E8EDE1] px-2 py-1 rounded-md">
                                                Selected {selectedVehicles.length} / {currentRequest.vehicle_number}
                                            </span>
                                        </div>

                                        {availableVehicles.length > 0 ? (
                                            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-100">
                                                {availableVehicles.map((v) => (
                                                    <div
                                                        key={v.id}
                                                        onClick={() => handleVehicleSelect(v)}
                                                        className={`flex justify-between items-center px-3 py-2 cursor-pointer text-sm transition-colors
                                                                ${selectedVehicle?.id === v.id
                                                                ? "bg-[#C7D3B4] text-[#26361C]"
                                                                : "hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{v.plate_number}</span>
                                                            <span className="text-gray-500 text-xs">{v.interior_colour}, {v.exterior_colour}, {v.model_name}</span>
                                                        </div>
                                                        <span className="text-xs bg-[#E8EDE1] text-[#26361C] px-2 py-0.5 rounded-md">
                                                            {v.version_name ?? "N/A"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">
                                                No available vehicles for this model.
                                            </p>
                                        )}
                                    </div>
                                )}
                                {selectedVehicles.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-xs font-medium text-[#26361C] mb-2">
                                            Selected Vehicles
                                        </h4>

                                        <div className="border border-gray-400 bg-gray-200 rounded-md divide-y divide-gray-400">
                                            {selectedVehicles.map(v => (
                                                <div
                                                    key={v.id}
                                                    className="flex justify-between items-center px-3 py-2 text-xs"
                                                >
                                                    <div>
                                                        <div className="font-medium">{v.plate_number}</div>
                                                        <div className="text-gray-500">
                                                            {v.interior_colour}, {v.exterior_colour}, {v.model_name}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => removeVehicle(v.id)}
                                                        className="text-red-500 hover:underline cursor-pointer"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 hover:cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={selectedVehicles.length !== currentRequest.vehicle_number}
                                        onClick={handleAssign}
                                        className={`px-4 py-2 rounded-md text-white transition-colors ${selectedVehicles.length == currentRequest.vehicle_number
                                            ? "bg-[#26361C] hover:bg-[#4a5b38] cursor-pointer"
                                            : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Confirm Allocation ({selectedVehicles.length}/{currentRequest.vehicle_number})
                                    </button>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default AllocateCarModal
