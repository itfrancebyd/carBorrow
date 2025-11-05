"use client"
import React, { useState } from "react"

interface AllocateCarModalProps {
    onClose: () => void
    onConfirm: (selectedVehicleId: string) => void
    currentRequest: {
        id: string
        applicant: string
        department: string
        loan_start_date: string
        loan_end_date: string
        prefered_model: string
    }
    availableVehicles: Array<{
        id: string
        model_name: string
        version_name: string
        plate_number: string
    }>
}

const AllocateCarModal: React.FC<AllocateCarModalProps> = ({
    onClose,
    onConfirm,
    currentRequest,
    availableVehicles,
}) => {
    const [selectedVehicle, setSelectedVehicle] = useState("")

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-lg p-6 relative">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-lg font-semibold text-[#26361C]">Allocate Vehicle</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                {/* Loan Request Info */}
                <div className="space-y-2 text-sm mb-5">
                    <p><strong>Applicant:</strong> {currentRequest.applicant}</p>
                    <p><strong>Department:</strong> {currentRequest.department}</p>
                    <p>
                        <strong>Loan Period:</strong>{" "}
                        {currentRequest.loan_start_date} → {currentRequest.loan_end_date}
                    </p>
                    <p><strong>Preferred Model:</strong> {currentRequest.prefered_model}</p>
                </div>

                {/* Select Vehicle */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#26361C]">
                        Select Vehicle to Allocate
                    </label>
                    <select
                        value={selectedVehicle}
                        onChange={(e) => setSelectedVehicle(e.target.value)}
                        className="border border-gray-400 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#26361C]"
                    >
                        <option value="">-- Select a Vehicle --</option>
                        {availableVehicles.map((car) => (
                            <option key={car.id} value={car.id}>
                                {car.model_name} {car.version_name} — {car.plate_number}
                            </option>
                        ))}
                    </select>
                </div>

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
                        onClick={() => onConfirm(selectedVehicle)}
                        className={`px-4 py-2 rounded-md text-white ${selectedVehicle
                                ? "bg-[#26361C] hover:bg-[#4a5b38]"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Confirm Allocation
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AllocateCarModal
