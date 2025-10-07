'use client'
import Filter from "@/app/components/filter"
import TableGrid from "@/app/components/forms/tableGrid"
import SubTitle from "@/app/components/subTitle"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import modelInfoJson from "@/docs/modelInfo.json"
import DataMeasure from "@/app/components/dataMeasure"
import PopModalForm from "@/app/components/forms/popModal"

export interface ModelProps {
    id: string;
    modelName: string;
    versionName: string;
    exteriorColour: string;
    interiorColour: string;
    status: string;
    modified_by: string;
}

const ModelPage = () => {
    const [modelData, setModelData] = useState<ModelProps[]>([])
    const [dataSum, setDataSum] = useState<ModelProps[]>([])
    const [isLoading, setLoading] = useState(true)
    const [isFilterInfo, setFilterInfo] = useState([])
    const supabase = createClient()
    const modelInfo = modelInfoJson as Record<string, string[]>

    useEffect(() => {
        const fetchData = async () => {
            let { data: vehicle_model, error } = await supabase
                .from('vehicle_model')
                .select('*')
            if (error) {
                console.error("Error fetching vehicle models: ", error)
            } else if (vehicle_model) {
                setDataSum(vehicle_model)
            }
        }
        fetchData()
    }, [])

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
            let query = supabase.from("vehicle_model").select("*")
            // add eq condition: not null && not empty string
            Object.entries(isFilterInfo).forEach(([key, value]) => {
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

    const deleteVehicleModel = async (id: string) => {
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
    }

    const tableTitle = [
        { key: "model_name", label: "Model Name" },
        { key: "version_name", label: "Version Name" },
        { key: "interior_colour", label: "Interior Colour" },
        { key: "exterior_colour", label: "Exterior Colour" },
        { key: "status", label: "Status" }
    ]

    const dataMeasure = [
        { title: "Total models", dataCount: dataSum.length, color: "bg-blue-600" },
        { title: "Active models", dataCount: dataSum.filter((item) => item.status === "enable").length, color: "bg-green-400" },
        { title: "Disabled models", dataCount: dataSum.filter((item) => item.status === "disable").length, color: "bg-red-600" }
    ]

    return (
        <div className="flex flex-col h-screen">
            <SubTitle subTitleName="Vehicle Models"></SubTitle>
            <DataMeasure dataMeasure={dataMeasure}></DataMeasure>
            <Filter setFilterInfo={setFilterInfo} selectInfo={modelInfo} filterItems={tableTitle}></Filter>
            <div className="flex-1">
                {isLoading
                    ?
                    <div className="flex items-center justify-center h-full text-white">
                        <div className="bg-[#7a856b] mx-8 py-6 w-full">Loading...</div>
                    </div>
                    :
                    <TableGrid
                        formTitle="Vehicle Models"
                        tableTitle={tableTitle}
                        tableContent={modelData}
                        pushQuery={"model"}
                        dragDropLink="importModel"
                        buttonLink="addmodel"
                    >
                        <PopModalForm
                            fetchData={fetchVehicleDetail}
                            popupWindowInfo={tableTitle}
                            actionDelete={deleteVehicleModel}
                            actionEdit={editModel}
                            selectInfo={modelInfo}
                        ></PopModalForm>
                    </TableGrid>
                }
            </div>
        </div>
    )
}

export default ModelPage