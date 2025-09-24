'use client'

import { FC, useRef } from "react"
import { normalizeKey } from "./forms/newModelForm"

interface FilterProps {
    setFilterInfo: any;
    selectInfo: any;
    filterItems: any
}

const Filter: FC<FilterProps> = ({ setFilterInfo, selectInfo, filterItems }) => {
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
        const modelName = formData.get(normalizeKey(filterItems[0].label))
        const versionName = formData.get(normalizeKey(filterItems[1].label))
        const interiorColour = formData.get(normalizeKey(filterItems[2].label))
        const exteriorColour = formData.get(normalizeKey(filterItems[3].label))
        const status = formData.get(normalizeKey(filterItems[4].label))

        const newModel = [
            {
                model_name: modelName,
                version_name: versionName,
                interior_colour: interiorColour,
                exterior_colour: exteriorColour,
                status: status
            }
        ]
        setFilterInfo(newModel)
    }
    return (
        <div className="mx-8 text-xs">
            <form className="grid grid-cols-17 gap-3" ref={formRef}>
                <div className="col-span-16 flex flex-row gap-2">
                    {filterItems.map((item: any) => (
                        <div key={item.key} className="flex flex-col flex-1">
                            <label className="text-gray-600">{item.label}</label>
                            <select
                                name={normalizeKey(item.label)}
                                defaultValue=""
                                className="border-1 border-gray-400 rounded-md py-1 px-2 w-full"
                            >
                                <option value="" disabled>
                                    -- please select --
                                </option>
                                {(selectInfo[item.label] ?? []).map((option: string) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
                <div className="col-span-1 flex gap-1 justify-end">
                    <button type="submit" onClick={handleFilterSubmit} className="bg-[#26361C] hover:bg-[#67924d] rounded-full px-3 py-3 cursor-pointer">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5532" width="16" height="16"><path d="M828.72183 738.215042l176.526936 176.523323c24.987196 24.989002 24.987196 65.522302 0 90.509498-24.98539 24.989002-65.522302 24.989002-90.507692 0l-176.526935-176.523323m106.58121-367.917225c0-212.07869-171.92289-384.00158-384.003387-384.00158-212.064241 0-383.985324 171.92289-383.985324 384.00158 0 212.064241 171.921084 383.985324 383.985324 383.985325 212.080497 0 384.003387-171.921084 384.003387-383.985325z m-106.58121 367.917225c-193.248886 145.725529-466.310856 117.077133-625.13326-65.574682C-45.74333 580.517911-36.173996 306.117535 134.964996 134.978542 306.118438-36.173093 580.502559-45.744233 763.154373 113.07817c182.648202 158.82421 211.296599 431.884374 65.569264 625.136872" fill="#ffffff" p-id="5533"></path></svg>
                    </button>
                </div>
            </form>
        </div>
    )
}
export default Filter