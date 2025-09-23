'use client'
import DataMeasure from "@/app/components/DataMeasure"
import Filter from "@/app/components/filter"
import TableGrid from "@/app/components/forms/tableGrid"
import SubTitle from "@/app/components/subTitle"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import modelInfoJson from "@/docs/modelInfo.json"

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
    const [isFilterInfo, setFilterInfo] = useState([])
    const supabase = createClient()
    const modelInfo = modelInfoJson as Record<string, string[]>

    useEffect(() => {
        const fetchVehicleModels = async () => {
            setLoading(true)

            if (isFilterInfo.length === 0 || !isFilterInfo) {
                let { data: vehicle_model, error } = await supabase
                    .from('vehicle_model')
                    .select('*')
                if (error) {
                    console.error("Error fetching vehicle models: ", error)
                } else if (vehicle_model) {
                    setModelData(vehicle_model)
                }
                setLoading(false)
                return
            }
            //filter the info
            const f = isFilterInfo[0]
            let query = supabase.from("vehicle_model").select("*")
            // add eq condition: not null && not empty string
            Object.entries(f).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    query = query.eq(key, value as string)
                }
            })

            const { data, error } = await query

            if (error) {
                console.error("Error while filtering:", error.message)
                setModelData([])
                return
            } else {
                setModelData(data ?? []);
            }
            setLoading(false);
        }
        fetchVehicleModels()
    }, [isFilterInfo])

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

    const deleteVehicle = async (id: string) => {
        const { error } = await supabase
            .from('vehicle_model')
            .delete()
            .eq('id', id)
    }

    const editModel = async (
        table: string,
        id: string,
        updateData: Record<string, any>
    ) => {
        const { data, error } = await supabase
            .from(table)
            .update(updateData)
            .eq("id", id)
            .select();

        if (error) {
            console.error(`Update error in ${table}:`, error.message);
            throw new Error(error.message);
        }

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
            <Filter setFilterInfo={setFilterInfo} selectInfo={modelInfo}></Filter>
            <div className="flex-1">
                {isLoading
                    ?
                    <div className="flex items-center justify-center bg-[#7a856b] mx-8 mt-6 py-6 h-full text-white">
                        Loading...
                    </div>
                    :
                    <TableGrid
                        formTitle="Loan Requests"
                        tableTitle={tableTitle}
                        tableContent={modelData}
                        pushQuery={"model"}
                        dragDropLink="importModel"
                        buttonLink="addmodel"
                        fetchDetailWithId={fetchVehicleDetail}
                        actionDelete={deleteVehicle}
                        actionEdit={editModel}
                        selectInfo={modelInfo}
                    ></TableGrid>
                }
            </div>
        </div>
    )
}

export default ModelPage