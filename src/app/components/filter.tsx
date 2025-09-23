'use client'

import { FC, useRef } from "react"
import { normalizeKey } from "./forms/newModelForm"
import modelInfoJson from "@/docs/modelInfo.json"

interface FilterProps {
    setFilterInfo: any;
    selectInfo: any
}

const Filter: FC<FilterProps> = ({ setFilterInfo, selectInfo }) => {
    const formRef = useRef<HTMLFormElement>(null)

    const vehicleModelInfo = [
        "Model Name",
        "Version Name",
        "Interior Colour",
        "Exterior Colour"
    ]

    const handleFilterSubmit = (event: React.MouseEvent) => {
        event.preventDefault()
        if (!formRef.current) return
        const formData = new FormData(formRef.current)
        const modelName = formData.get(normalizeKey(vehicleModelInfo[0]))
        const versionName = formData.get(normalizeKey(vehicleModelInfo[1]))
        const interiorColour = formData.get(normalizeKey(vehicleModelInfo[2]))
        const exteriorColour = formData.get(normalizeKey(vehicleModelInfo[3]))

        const newModel = [
            {
                model_name: modelName,
                version_name: versionName,
                interior_colour: interiorColour,
                exterior_colour: exteriorColour
            }
        ]
        setFilterInfo(newModel)
    }
    return (
        <div className="mx-8 text-xs">
            <form className="grid grid-cols-9 gap-3" ref={formRef}>
                {vehicleModelInfo.map((title) => (
                    <div key={title} className="col-span-2 flex flex-col gap-1">
                        <label className="text-gray-600">{title}</label>
                        <select
                            name={normalizeKey(title)}
                            defaultValue=""
                            className="border-1 border-gray-400 rounded-md py-1 px-2"
                        >
                            <option value="" disabled>
                                -- please select --
                            </option>
                            {(selectInfo[title] ?? []).map((option: string) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
                <button type="submit" onClick={handleFilterSubmit} className="col-span-1 bg-[#26361C] text-white font-semibold cursor-pointer">Filter</button>
            </form>
        </div>
    )
}
export default Filter