'use client'
import { createClient } from "@/utils/supabase/client"
import { useEffect, useRef, useState } from "react"

interface ModelDatabaseProps {
    model_name: string;
    version_name: string;
    exterior_colour: string;
    interior_colour: string;
    status: string;
    id: string
}

const NewVehiclesForm = () => {
    const [fetchedModelInfo, setFetchedModelInfo] = useState<ModelDatabaseProps[]>()
    const [findVersionName, setFindVersionName] = useState<ModelDatabaseProps[] | null>(null)
    const [findExteriorColo, setFindExteriorColo] = useState<ModelDatabaseProps[] | null>(null)
    const [findInteriorColo, setFindInteriorColo] = useState<ModelDatabaseProps[] | null>(null)
    const [selectedModel, setSelectedModel] = useState<string>("")
    const [selectedVersion, setSelectedVersion] = useState<string>("")
    const [selectedExterior, setSelectedExterior] = useState<string>("")
    const [selectedInterior, setSelectedInterior] = useState<string>("")
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
    const [isError, setError] = useState<{ vin: string | null; plate_number: string | null }>({
        vin: null,
        plate_number: null,
    })
    const formRef = useRef<HTMLFormElement>(null)
    const supabase = createClient()

    const handleVehicleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setError({ vin: null, plate_number: null }) //reset error

        if (!formRef.current) return
        const formData = new FormData(formRef.current)

        const vin = formData.get("vin")?.toString() ?? ""
        const plate_number = formData.get("plate_number")
        const plate_registration_date = formData.get("plate_registration_date")
        const model_information = selectedModelId
        const km = formData.get("km")
        const battery = formData.get("battery")
        const update_date = formData.get("update_date")
        const key_1 = formData.get("key_1")
        const key_2 = formData.get("key_2")
        const current_location = formData.get("current_location")
        const status = formData.get("status")

        const submitData = [
            { key: "vin", label: "VIN", value: vin },
            { key: "plate_number", label: "Plate Number", value: plate_number },
            { key: "plate_registration_date", label: "Plate Registration Date", value: plate_registration_date },
            { key: "model_information", label: "Model Information", value: model_information },
            { key: "km", label: "Km", value: km },
            { key: "battery", label: "Battery %", value: battery },
            { key: "update_date", label: "Update Date", value: update_date },
            { key: "key_1", label: "Key 1", value: key_1 },
            { key: "key_2", label: "Key 2", value: key_2 },
            { key: "current_location", label: "Current Location", value: current_location },
            { key: "status", label: "Status", value: status },
        ]

        let hasError = false

        if (vin.length !== 17) {
            setError((prev) => ({ ...prev, vin: "VIN must be exactly 17 characters long" }))
            hasError = true
        }

        const empty = submitData.find(
            (f) => !f.value || (typeof f.value === "string" && f.value.trim() === "")
        );

        if (empty) {
            alert(`Please fill in the "${empty.label}" field before submitting.`);
            return;
        }

        if (hasError) return
    }

    useEffect(() => {
        setSelectedModelId(null)
    }, [selectedModel, selectedVersion, selectedExterior])

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
            fields: ["Model Name", "Version Name", "Exterior Colour", "Interior Colour"],
        },
        {
            subtitle: "Usage & Battery",
            fields: ["Km", "Battery", "Update Date"],
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

    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value
        setSelectedModel(selected)

        const found = fetchedModelInfo?.filter(
            (item) => item.model_name === selected
        )
        setFindVersionName(found ?? null) // fallback if not found

        // reset lower levels
        setFindExteriorColo(null)
        setFindInteriorColo(null)

        setSelectedVersion("")
        setSelectedExterior("")
        setSelectedInterior("")
    }

    const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value
        setSelectedVersion(selected)

        const found = findVersionName?.filter(
            (item) => item.version_name === selected
        )
        setFindExteriorColo(found ?? null)

        setSelectedExterior("")
        setSelectedInterior("")
    }

    const handleExteriorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value
        setSelectedExterior(selected)

        const found = findExteriorColo?.filter(
            (item) => item.exterior_colour === selected
        )
        setFindInteriorColo(found ?? null)
        setSelectedInterior("")
    }

    const handleInteriorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value
        setSelectedInterior(selected)
        const found = findInteriorColo?.find(
            (item) => item.interior_colour === selected
        )
        setSelectedModelId(found ? found.id : null)
    }

    const RenderGroupFields = (group: { subtitle: string; fields: string[] }) => {
        switch (group.subtitle) {
            case "Identification":
                return (
                    <>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">vin</label>
                            <input
                                required
                                type="text"
                                name="vin"
                                className={`border border-gray-400 rounded-md py-1 px-2 text-xs ${isError.vin ? "border-red-500" : "border-gray-400"}`}
                            />
                            {isError.vin && <span className="text-red-500 text-[10px] whitespace-nowrap">{isError.vin}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">Plate Number</label>
                            <input
                                required
                                type="text"
                                name="plate_number"
                                className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">Plate Registration Date</label>
                            <input
                                type="date"
                                name="plate_registration_date"
                                className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                            />
                        </div>
                    </>
                )
            case "Model Information":
                return (
                    <>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">Model Name</label>
                            <select
                                value={selectedModel}
                                name="model_name"
                                className="border border-gray-400 rounded-md py-1 px-1 text-xs"
                                onChange={handleModelChange}
                            >
                                <option className="text-xs" value="" disabled>
                                    -- please select --
                                </option>
                                {[...new Set(fetchedModelInfo?.map((car) => car.model_name))].map(
                                    (uniqueModel) => (
                                        <option className="text-xs" key={uniqueModel} value={uniqueModel}>
                                            {uniqueModel}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">Version Name</label>
                            <select
                                disabled={!findVersionName}
                                value={selectedVersion}
                                name="version_name"
                                className={`border border-gray-400 rounded-md py-1 px-2 text-xs ${findVersionName ? '' : 'bg-[#4f6244] cursor-not-allowed'}`}
                                onChange={handleVersionChange}
                            >
                                <option className="text-xs" value="" disabled>
                                    -- please select --
                                </option>
                                {[...new Set(findVersionName?.map((car) => car.version_name))].map(
                                    (uniqueVersion) => (
                                        <option className="text-xs" key={uniqueVersion} value={uniqueVersion}>
                                            {uniqueVersion}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">Exterior Colour</label>
                            <select
                                disabled={!findExteriorColo}
                                value={selectedExterior}
                                name="exterior_colour"
                                className={`border border-gray-400 rounded-md py-1 px-1 text-xs ${findExteriorColo ? '' : 'bg-[#4f6244] cursor-not-allowed'}`}
                                onChange={handleExteriorChange}
                            >
                                <option className="text-xs" value="" disabled>
                                    -- please select --
                                </option>
                                {[...new Set(findExteriorColo?.map((car) => car.exterior_colour))].map(
                                    (uniqueExterior) => (
                                        <option className="text-xs" key={uniqueExterior} value={uniqueExterior}>
                                            {uniqueExterior}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">Interior Colour</label>
                            <select
                                disabled={!findInteriorColo}
                                value={selectedInterior}
                                name="interior_colour"
                                className={`border border-gray-400 rounded-md py-1 px-1 text-xs ${findInteriorColo ? '' : 'bg-[#4f6244] cursor-not-allowed'}`}
                                onChange={handleInteriorChange}
                            >
                                <option className="text-xs" value="" disabled>
                                    -- please select --
                                </option>
                                {[...new Set(findInteriorColo?.map((car) => car.interior_colour))].map(
                                    (uniqueInterior) => (
                                        <option className="text-xs" key={uniqueInterior} value={uniqueInterior}>
                                            {uniqueInterior}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </>
                )
            case "Usage & Battery":
                return (
                    <>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">Km</label>
                            <input
                                type="number"
                                name="km"
                                min={0}
                                className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">Battery %</label>
                            <input
                                type="number"
                                name="battery"
                                min={0}
                                max={100}
                                className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">Update Date</label>
                            <input
                                type="date"
                                name="update_date"
                                className="border border-gray-400 rounded-md py-1 px-2 text-xs"
                            />
                        </div>
                    </>
                )
            case "Status":
                return (
                    <>
                        <div className="flex flex-col">
                            <label className="text-gray-500 text-xs">Status</label>
                            <select
                                defaultValue=""
                                name="status"
                                className="border border-gray-400 rounded-md py-1 px-1 text-xs"
                            >
                                <option className="text-xs" value="" disabled>-- please select --</option>
                                <option className="text-xs" value="enable">enable</option>
                                <option className="text-xs" value="disable">disable</option>
                            </select>
                        </div>
                    </>
                )
            default:
                return (
                    <>
                        {group.fields.map((field) => (
                            <div key={field} className="flex flex-col">
                                <label className="text-gray-500 text-xs">{field.toLowerCase().replace(/\s+/g, "_")}</label>
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
                        <div className="grid grid-cols-4 gap-x-3">
                            {RenderGroupFields(group)}
                        </div>
                    </div>
                ))
                }
            </form >
            <button onClick={handleVehicleSubmit} className="bg-[#26361C] hover:bg-[#7a856b] text-white hover:text-black font-semibold px-4 py-2 cursor-pointer text-xs">Submit</button>
        </div >
    )
}
export default NewVehiclesForm