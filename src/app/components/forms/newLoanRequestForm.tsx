'use client'
import { useRef } from "react"
import modelInfoJson from "@/docs/modelInfo.json";
import { createClient } from "@/utils/supabase/client";

const modelInfo = modelInfoJson as Record<string, string[]>

const NewLoanRequest = () => {
    const formRef = useRef<HTMLFormElement>(null)
    const supabase = createClient()

    const handleLoanSubmit = async (event: React.MouseEvent) => {
        event.preventDefault()
        if (!formRef.current) return

        const formData = new FormData(formRef.current)

        const applicant = formData.get("applicant")
        const request_date = formData.get("request_date")
        const applicant_department = formData.get("department")
        const loan_start_date = formData.get("borrow_date")
        const loan_start_time = formData.get("borrow_time")
        const loan_end_date = formData.get("return_date")
        const loan_end_time = formData.get("return_time")
        const loan_intended = formData.get("intend")
        const loan_reason = formData.get("comment")
        const prefered_model = formData.get("modelname")
        const vehicle_number = formData.get("vehicle_number")

        const fields = [
            { key: "applicant", label: "Applicant", value: applicant },
            { key: "request_date", label: "Request Date", value: request_date },
            { key: "applicant_department", label: "Department", value: applicant_department },
            { key: "loan_start_date", label: "Borrow Date", value: loan_start_date },
            { key: "loan_start_time", label: "Borrow Time", value: loan_start_time },
            { key: "loan_end_date", label: "Return Date", value: loan_end_date },
            { key: "loan_end_time", label: "Return Time", value: loan_end_time },
            { key: "loan_intended", label: "Intend", value: loan_intended },
            { key: "loan_reason", label: "Comment", value: loan_reason },
            { key: "prefered_model", label: "Prefered Model", value: prefered_model },
            { key: "vehicle_number", label: "Vehicle Number", value: vehicle_number },
        ]

        const empty = fields.find(
            (f) => !f.value || (typeof f.value === "string" && f.value.trim() === "")
        )

        if (empty) {
            alert(`Please fill in the "${empty.label}" field before submitting.`);
            return
        }

        const submitData = [{
            applicant,
            request_date,
            applicant_department,
            loan_start_date,
            loan_start_time,
            loan_end_date,
            loan_end_time,
            loan_intended,
            loan_reason,
            prefered_model,
            vehicle_number
        }]

        const { error } = await supabase.from('loan_requests').insert(submitData).select()
        if (error) {
            alert("cannot insert into database, please contact the admin")
        } else {
            formRef.current.reset()
            window.location.href = '/loan-requests'
        }
    }
    const vehiclesInfo = [
        {
            subtitle: "General Information",
            fields: ["Applicant", "Request Date", "Department", "Borrow Date", "Borrow time", "Return Date", "Return time"],
        },
        {
            subtitle: "Intend",
            fields: ["Intend", "Comment"],
        },
        {
            subtitle: "Model",
            fields: ["Prefered Model", "Number of the Vehicle"],
        }
    ]
    const RenderGroupFields = (group: { subtitle: string; fields: string[] }) => {
        switch (group.subtitle) {
            case "General Information":
                return (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col">
                                <label className="text-gray-500 text-xs">Applicant</label>
                                <input
                                    required
                                    type="text"
                                    name="applicant"
                                    className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-500 text-xs">Request Date</label>
                                <input
                                    required
                                    type="date"
                                    name="request_date"
                                    className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-500 text-xs">Department</label>
                                <input
                                    required
                                    type="text"
                                    name="department"
                                    className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-end">
                            <div className="flex flex-col">
                                <label className="text-gray-500 text-xs">Borrow Date</label>
                                <input
                                    required
                                    type="date"
                                    name="borrow_date"
                                    className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-500 text-xs">Borrow Time</label>
                                <input
                                    required
                                    type="time"
                                    name="borrow_time"
                                    className="border border-gray-400 rounded-md py-0.5 px-2 text-xs"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-end">
                            <div className="flex flex-col">
                                <label className="text-gray-500 text-xs">Return Date</label>
                                <input
                                    required
                                    type="date"
                                    name="return_date"
                                    className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-500 text-xs">Return Time</label>
                                <input
                                    required
                                    type="time"
                                    name="return_time"
                                    className="border border-gray-400 rounded-md py-0.5 px-2 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                )
            case "Intend":
                return (
                    <>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">intend</label>
                            <select
                                required
                                name="intend"
                                className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                            >
                                <option>Déplacement professionnel</option>
                                <option>Test sur le véhicule</option>
                                <option>Cas expetionnel</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">Comment</label>
                            <textarea
                                name="comment"
                                rows={3}
                                className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                            />
                        </div>
                    </>
                )
            case "Model":
                return (
                    <>
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col">
                                <label className="text-gray-500 text-xs">Prefered Model</label>
                                <select
                                    required
                                    name="modelname"
                                    defaultValue=""
                                    className="border-1 border-gray-400 rounded-md py-1 px-2"
                                >
                                    <option value="" disabled>
                                        -- please select --
                                    </option>
                                    {(modelInfo["Model Name"] ?? []).map((option) => (
                                        <option key={option} value={option} className="text-xs">
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-500 text-xs">Vehicle Number</label>
                                <input name="vehicle_number" type="number" className="border-1 border-gray-400 rounded-md py-1 px-2" />
                            </div>
                        </div>
                    </>
                )
            default:
                return (
                    <>
                        {group.fields.map((field) => (
                            <div key={field} className="flex flex-col">
                                <label className="text-gray-500 text-xs">{field}</label>
                                <input
                                    type="text"
                                    name={field.toLowerCase().replace(/\s+/g, "_")}
                                    className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                                />
                            </div>
                        ))}
                    </>
                )
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="text-xs text-gray-400 font-semibold">VEHICLES DETAILS</div>
            <form ref={formRef} className="text-sm flex flex-col gap-4">
                {vehiclesInfo.map((group) => (
                    <div key={group.subtitle} className="flex flex-col gap-1">
                        <div className="text-gray-400 text-xs font-semibold">{group.subtitle}</div>
                        <div className="">
                            {RenderGroupFields(group)}
                        </div>
                    </div>
                ))
                }
            </form >
            <button onClick={handleLoanSubmit} className="bg-[#26361C] hover:bg-[#7a856b] text-white hover:text-black font-semibold px-4 py-2 cursor-pointer text-xs">Submit</button>
        </div >
    )
}

export default NewLoanRequest