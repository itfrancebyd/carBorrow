'use client'
import { useState } from "react"
import { normalizeKey } from "./forms/newModelForm"

type SelectWindowType = {
    item: { key: string; label: string };
    selectInfo: any;
    handleChange: any;
    handleClear: any
    filters: Record<string, string>;
}

const SelectWindow = ({ item, selectInfo, handleChange, handleClear, filters }: SelectWindowType) => {
    const [selectedValue, setSelectedValue] = useState<Record<string, string>>({})
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, key: string) => {
        const value = e.target.value
        setSelectedValue((prev) => ({ ...prev, [key]: value }))
        handleChange(key, value)
    }
    const handleClearClick = (key: string) => {
        setSelectedValue((prev => ({ ...prev, [key]: "" })))
        handleClear(key)
    }
    return (
        <div className="relative">
            <select
                name={normalizeKey(item.label)}
                value={Object.keys(selectedValue).length == 0 ? "" : selectedValue[item.key]}
                className="border-1 border-gray-400 rounded-md py-1 px-2 w-full"
                onChange={(e) => handleSelectChange(e, item.key)}
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
            {filters[item.key] && (
                <button
                    type="button"
                    onClick={() => handleClearClick(item.key)}
                    className="absolute right-1 top-1 px-0.5 bg-white text-gray-400 hover:cursor-pointer hover:text-black font-bold"
                >
                    x
                </button>
            )}
        </div>
    )
}

export default SelectWindow