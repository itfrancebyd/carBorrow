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
        loan_end_date: string
        prefered_model: string
        allocated_vehicle_id: string | null
        status: string
        checkin_location: string
        checkin_km: number
        checkin_energy: number
        checkout_location: string
        checkout_km: number
        checkout_energy: number
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
    const [isAllocatedInfo, setAllocatedInfo] = useState<any>()
    const [reassignMode, setReassignMode] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const supabase = createClient()

    const flattenData = (data: any[]) =>
        data.map(({ model_information, ...rest }) => ({
            ...rest,
            model_name: model_information?.model_name ?? undefined,
            version_name: model_information?.version_name ?? undefined,
            interior_colour: model_information?.interior_colour ?? undefined,
            exterior_colour: model_information?.exterior_colour ?? undefined,
        }))

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
            .select("allocated_vehicle_id,loan_start_date,loan_end_date")
            .not("allocated_vehicle_id", "is", null)

        const startDate = currentRequest.loan_start_date
        const endDate = currentRequest.loan_end_date

        // 排除时间冲突车辆
        const available = flattenVehicles.filter((v) => {
            const conflict = requests?.some(
                (r) =>
                    r.allocated_vehicle_id === v.id &&
                    dayjs(r.loan_start_date).isBefore(endDate) &&
                    dayjs(r.loan_end_date).isAfter(startDate)
            )
            return !conflict
        })

        setAvailableVehicles(available)
    }

    const handleVehicleSelect = (vehicle: any) => {
        setSelectedVehicle(vehicle);
    }

    useEffect(() => {
        setLoading(true)
        const fetchVehicleDetail = async (id: string) => {
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
                .eq("id", id)
                .single()
            if (error) throw error
            setAllocatedInfo(flattenData([data])[0] ?? null)
            setLoading(false)
        }
        if (currentRequest.allocated_vehicle_id) {
            fetchVehicleDetail(currentRequest.allocated_vehicle_id)
        }
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

        const { error } = await supabase
            .from("loan_requests")
            .update({
                allocated_vehicle_id: selectedVehicle.id,
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

    const handleKeyGiven = async () => {
        console.log('give key')
        const { error } = await supabase
            .from("loan_requests")
            .update({
                status: "issued",
            })
            .eq("id", currentRequest.id)
            .select()

        if (error) console.error(error)
        else {
            alert("🔑The key has been passed to the user!")
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
                            {currentRequest.loan_start_date} → {currentRequest.loan_end_date}
                        </p>
                        <p><strong>Preferred Model:</strong> {currentRequest.prefered_model}</p>
                    </div>
                    {isLoading
                        ?
                        <div className="bg-[#F7F8F5] text-5xl text-gray-700 h-[300px] p-4">...</div>
                        :
                        currentRequest.allocated_vehicle_id && isAllocatedInfo && !reassignMode
                            ? (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                                    <h3 className="text-sm font-semibold text-[#26361C] mb-3">
                                        Assigned Vehicle
                                    </h3>

                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                                        <div>
                                            <span className="font-medium text-[#26361C]">Model:</span>{" "}
                                            {isAllocatedInfo.model_name}
                                        </div>
                                        <div>
                                            <span className="font-medium text-[#26361C]">Version:</span>{" "}
                                            {isAllocatedInfo.version_name}
                                        </div>
                                        <div>
                                            <span className="font-medium text-[#26361C]">Plate No.:</span>{" "}
                                            {isAllocatedInfo.plate_number}
                                        </div>
                                        <div>
                                            <span className="font-medium text-[#26361C]">VIN:</span>{" "}
                                            {isAllocatedInfo.vin}
                                        </div>
                                        <div>
                                            <span className="font-medium text-[#26361C]">Interior:</span>{" "}
                                            {isAllocatedInfo.interior_colour}
                                        </div>
                                        <div>
                                            <span className="font-medium text-[#26361C]">Exterior:</span>{" "}
                                            {isAllocatedInfo.exterior_colour}
                                        </div>
                                        <div>
                                            <span className="font-medium text-[#26361C]">Location:</span>{" "}
                                            {isAllocatedInfo.current_location ?? "N/A"}
                                        </div>
                                        <div>
                                            <span className="font-medium text-[#26361C]">Key:</span>{" "}
                                            {isAllocatedInfo.key_1 ?? "N/A"}
                                        </div>
                                    </div>

                                    {/* Action */}
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
                                        ) : (
                                            /* If key_given -> show simple green badge */
                                            <div className="text-sm text-[#4A7B2C] font-medium bg-[#E3F2D7] px-3 py-1 rounded-md">
                                                ✓ Key has been given to the user
                                            </div>
                                        )}

                                    </div>

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
                                        <h3 className="text-sm font-medium text-[#26361C] mb-2">Available Vehicles</h3>
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
                                                            <span className="text-gray-500 text-xs">{v.interior_colour}, {v.exterior_colour}</span>
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

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 hover:cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={!selectedVehicle}
                                        onClick={handleAssign}
                                        className={`px-4 py-2 rounded-md text-white transition-colors ${selectedVehicle
                                            ? "bg-[#26361C] hover:bg-[#4a5b38]"
                                            : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Confirm Allocation
                                    </button>
                                </div>
                            </>

                    }
                </div>
            </div>
        </div>
    )
}

export default AllocateCarModal
