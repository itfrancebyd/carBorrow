'use client'
import DataMeasure from "@/app/components/DataMeasure"
import Filter from "@/app/components/filter"
import TableGrid from "@/app/components/forms/tableGrid"
import SubTitle from "@/app/components/subTitle"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

interface Model {
    id: string;
    modelName: string;
    versionName: string;
    exteriorColour: string;
    interiorColour: string;
    status: string;
    lastOperationUser: string;
}


const ModelPage = () => {
    const [modelData, setModelData] = useState<Model[]>([])
    const [isLoading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchVehicleModels = async () => {
            setLoading(true)
            let { data: vehicle_model, error } = await supabase.from('vehicle_model').select('*')
            if (error) {
                console.error("Error fetching vehicle models: ", error)
            } else if (vehicle_model) {
                setModelData(vehicle_model)
            }
            setLoading(false)
        }
        fetchVehicleModels()
    }, [])

    // fetch detail with id
    const fetchVehicleDetail = async (id: string) => {
        const { data, error } = await supabase
            .from("vehicle_model")
            .select("*")
            .eq("id", id)
            .single()
        if (error) throw error
        return data;
    };

    const tableTitle = [
        { key: "model_name", label: "Model Name" },
        { key: "version_name", label: "Version Name" },
        { key: "interior_colour", label: "Interior Colour" },
        { key: "exterior_colour", label: "Exterior Colour" }
    ]

    return (
        <div className="flex flex-col min-h-full">
            <SubTitle subTitleName="Loan Requests"></SubTitle>
            <DataMeasure></DataMeasure>
            <Filter></Filter>
            <div className="flex-1">
                {isLoading
                    ?
                    <div className="flex items-center justify-center bg-[#7a856b] mx-8 mt-6 py-6 h-full text-white">
                        Loading...
                    </div>
                    :
                    <TableGrid formTitle="Loan Requests" tableTitle={tableTitle} tableContent={modelData} pushQuery={"model"} dragDropLink="importModel" buttonLink="addmodel" fetchDetailWithId={fetchVehicleDetail}></TableGrid>
                }
            </div>
        </div>
    )
}

export default ModelPage