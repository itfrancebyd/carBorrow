'use client'
import { createClient } from "@/utils/supabase/client";
import { useRef } from "react";

const normalizeKey = (label: string) =>
    label.toLowerCase().replace(/\s+/g, '');

const NewModelForm = () => {
    const formRef = useRef<HTMLFormElement>(null)
    const supabase = createClient()

    const vehicleModelInfo = [
        "Model Name",
        "Version Name",
        "Interior Colour",
        "Exterior Colour"
    ]

    const handleSubmit = async (event: React.MouseEvent) => {
        event.preventDefault()
        if (!formRef.current) return // check null guard
        const formData = new FormData(formRef.current)
        const newModel = [{
            modelName: formData.get(normalizeKey(vehicleModelInfo[0])),
            versionName: formData.get(normalizeKey(vehicleModelInfo[1])),
            interiorColour: formData.get(normalizeKey(vehicleModelInfo[2])),
            exteriorColour: formData.get(normalizeKey(vehicleModelInfo[3])),
            status: formData.get('status')
        }]

        const { data, error } = await supabase.from('vehicle_model').insert(newModel).select()
        if (error) {
            console.error("Insert error:", error.message);
            return;
        }
        formRef.current.reset() //reset form
        window.location.href = '/model'
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="text-xs text-gray-400">MODEL DETAILS</div>
            <form
                className="text-sm grid grid-cols-2 gap-x-5 gap-y-3"
                ref={formRef}
            >
                {vehicleModelInfo.map((title) => (
                    <div key={title} className="flex flex-col">
                        <label className="text-gray-600">{title}</label>
                        <input type="text" name={normalizeKey(title)} className="border-1 border-gray-400 rounded-md py-1 px-2"></input>
                    </div>
                ))}
                <div className="flex flex-col">
                    <label className="text-gray-600">Status</label>
                    <select name="status" className="border-1 border-gray-400 rounded-md py-1 px-2">
                        <option value="enable">Enable</option>
                        <option value="disable">Disable</option>
                    </select>
                </div>
            </form>
            <div className="flex gap-3 self-end">
                <button className="w-20 border border-[#26361C] hover:bg-[#7a856b] text-[#26361C] text-sm hover:text-black font-semibold px-4 py-2 cursor-pointer">Cancel</button>
                <button type="submit" onClick={handleSubmit} className="w-20 border bg-[#26361C] border-[#26361C] hover:bg-[#7a856b] text-white text-sm hover:text-black font-semibold px-4 py-2 cursor-pointer">Submit</button>
            </div>
        </div>
    )
}

export default NewModelForm