'use client'
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import type { ModelProps } from "@/app/(home)/model/page"

const NewVehiclesForm = () => {
    const [fetchedModelInfo, setFetchedModelInfo] = useState<ModelProps[]>()
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            let { data: vehicle_model, error } = await supabase
                .from('vehicle_model')
                .select('*')
            if (error) {
                console.error("Error fetching vehicle models: ", error)
            } else if (vehicle_model) {
                setFetchedModelInfo(vehicle_model)
            }
        }
        fetchData()
    }, [])

    const vehiclesInfo = [
        {
            subtitle: "Identification",
            fields: ["VIN", "Plate Number", "Plate Registration Date"],
        },
        {
            subtitle: "Model Information",
            fields: ["Model Name", "Version Name", "Interior Colour", "Exterior Colour"],
        },
        {
            subtitle: "Usage & Battery",
            fields: ["Km", "Battery %", "Update Date"],
        },
        {
            subtitle: "Key & Location",
            fields: ["Key 1", "Key 2", "Current Location"],
        },
        {
            subtitle: "Status",
            fields: ["Status"],
        },
    ]


    return (
        <div className="flex flex-col gap-3">
            <div className="text-xs text-gray-400 font-semibold">VEHICLES DETAILS</div>
            <form className="text-sm flex flex-col gap-4">
                {vehiclesInfo.map((group) => (
                    <div key={group.subtitle} className="flex flex-col gap-1">
                        <div className="text-gray-400 text-xs font-semibold">{group.subtitle}</div>
                        <div className="grid grid-cols-4 gap-x-3">
                            {group.fields.map((field) => (
                                <div key={field} className="flex flex-col">
                                    <label className="text-gray-500 text-xs">{field}</label>
                                    <input
                                        type="text"
                                        name={field.toLowerCase().replace(/\s+/g, "_")}
                                        className="border border-gray-400 rounded-md py-1 px-2"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </form>
            <button className="bg-[#26361C] hover:bg-[#7a856b] text-white hover:text-black font-semibold px-4 py-2 cursor-pointer">Submit</button>
        </div>
    )
}
export default NewVehiclesForm