'use client'
import SubTitle from "../components/subTitle";
import { Suspense, useEffect, useState } from "react";
import modelInfoJson from "@/docs/modelInfo.json"
import DataMeasure from "@/app/components/dataMeasure"
import { createClient } from "@/utils/supabase/client";
import VehiclePopModal from "../components/forms/vehiclePopModal";
import FilterVehicle from "../components/filterVehicle";
import TableGridVehicle from "../components/forms/tableGridVehicle";

interface carFleet {
  id: string;
  vin: string;
  plate_number: string;
  plate_registration_date: Date;
  model_information?: {
    model_name?: string;
    version_name?: string;
  };
  model_name?: string;
  version_name?: string;
  km: number;
  battery: number;
  usage_update_date: Date;
  key_1: string;
  key_2: string;
  status: string;
  current_location?: string;
}

export default function Home() {
  const [vehicleInfo, setVehicleInfo] = useState<carFleet[]>([])
  const [allVehicleData, setAllVehicleData] = useState<carFleet[]>([])
  const [dataSum, setDataSum] = useState<carFleet[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFilterInfo, setFilterInfo] = useState<Record<string, string | null>>({})
  const supabase = createClient()
  const modelInfo = modelInfoJson as Record<string, string[]>

  // flat model_information
  const flattenData = (data: any[]) =>
    data.map(({ model_information, ...rest }) => ({
      ...rest,
      model_name: model_information?.model_name ?? undefined,
      version_name: model_information?.version_name ?? undefined,
      interior_colour: model_information?.interior_colour ?? undefined,
      exterior_colour: model_information?.exterior_colour ?? undefined,
    }))

  //first time load all the info in one go
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from("car_fleet")
          .select(`
            id,
            vin,
            plate_number,
            model_information(model_name,version_name,interior_colour,exterior_colour),
            plate_registration_date,
            km,
            battery,
            usage_update_date,
            key_1,
            key_2,
            current_location,
            status
          `)

        if (error) throw error

        const flattened = flattenData(data ?? [])
        setAllVehicleData(flattened)
        setVehicleInfo(flattened)
        setDataSum(flattened)
      } catch (err: unknown) {
        const error = err as { message: string };
        console.error("Fetch error:", error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [])

  //filter
  useEffect(() => {
    if (!allVehicleData.length) return

    const filtered = allVehicleData.filter((item) => {
      return Object.entries(isFilterInfo).every(([key, value]) => {
        if (!value) return true
        const itemValue = String(item[key as keyof typeof item] ?? "").toLowerCase()
        return itemValue.includes(String(value).toLowerCase())
      })
    })

    setVehicleInfo(filtered)
  }, [isFilterInfo, allVehicleData])

  // fetch detail with id
  const fetchVehicleDetail = async (id: string) => {
    const { data, error } = await supabase
      .from("car_fleet")
      .select(
        `id,
            vin,
            plate_number,
            model_information(model_name,version_name,interior_colour,exterior_colour),
            plate_registration_date,
            km,
            battery,
            usage_update_date,
            key_1,
            key_2,
            current_location,
            status
            `
      )
      .eq("id", id)
      .single()
    if (error) throw error
    return flattenData([data])
  }

  // fetch detail with id
  const fetchExistingSchedule = async (id: string) => {
    const { data, error } = await supabase
      .from("loan_requests")
      .select('*')
      .contains("allocated_vehicle_id", [id])
    if (error) throw error
    return data
  }

  const handleVehicleDel = async (id: string) => {
    const { error } = await supabase
      .from('car_fleet')
      .delete()
      .eq('id', id)
      .single()
    if (error) {
      alert("delete error: " + error.message)
    }
  }

  const handleVehicleSave = async (
    table: string,
    id: string,
    updateData: Record<string, unknown>
  ) => {
    const { data, error } = await supabase
      .from(table)
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      console.error(`Update error in ${table}:`, error.message)
      throw new Error(error.message)
    }

    return data
  }

  const tableTitle = [
    { key: "vehicle_schedule", label: "Schedule" },
    { key: "vin", label: "VIN" },
    { key: "plate_number", label: "Plate Number" },
    { key: "model_name", label: "Model Name" },
    { key: "version_name", label: "Version Name" },
    { key: "status", label: "Status" }
  ]
  const filterTitle = [
    { key: "vin", label: "VIN" },
    { key: "plate_number", label: "Plate Number" },
    { key: "model_name", label: "Model Name" },
    { key: "version_name", label: "Version Name" },
    { key: "interior_colour", label: "Interior Colour" },
    { key: "exterior_colour", label: "Exterior Colour" },
    { key: "km", label: "Km" },
    { key: "battery", label: "Battery" },
    { key: "usage_update_date", label: "Usage Update Date" },
    { key: "key_1", label: "Key 1" },
    { key: "key_2", label: "Key 2" },
    { key: "current_location", label: "Current Location" },
    { key: "status", label: "Status" }
  ]
  const popupWindowInfo = [
    { key: "id", label: "Vehicle Id" },
    { key: "vin", label: "VIN" },
    { key: "plate_number", label: "Plate Number" },
    { key: "plate_registration_date", label: "Plate Registration Date" },
    { key: "model_name", label: "Model Name" },
    { key: "version_name", label: "Version Name" },
    { key: "interior_colour", label: "Interior Colour" },
    { key: "exterior_colour", label: "Exterior Colour" },
    { key: "km", label: "Km" },
    { key: "battery", label: "Battery" },
    { key: "usage_update_date", label: "Usage Update Date" },
    { key: "key_1", label: "Key 1" },
    { key: "key_2", label: "Key 2" },
    { key: "current_location", label: "Current Location" },
    { key: "status", label: "Status" }
  ]
  const dataMeasure = [
    { title: "Total Vehicles", dataCount: dataSum.length, color: "bg-blue-600" },
    { title: "Active Vehicles", dataCount: dataSum.filter((item) => item.status === "enable").length, color: "bg-green-400" },
    { title: "Disabled Vehicles", dataCount: dataSum.filter((item) => item.status === "disable").length, color: "bg-red-600" }
  ]

  return (
    <div className="flex flex-col h-screen">
      <SubTitle subTitleName="Vehicles"></SubTitle>
      <DataMeasure dataMeasure={dataMeasure}></DataMeasure>
      <div className="hidden sm:inline">
        <FilterVehicle setFilterInfo={setFilterInfo} selectInfo={modelInfo} filterItems={filterTitle}></FilterVehicle>
      </div>
      <div className="flex-1">
        {isLoading
          ?
          <div className="flex items-center justify-center h-full py-5 bg-[#f7f9f4]">
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[#e6ecde] shadow-md mx-8 w-full h-full animate-pulse">
              <div className="w-10 h-10 border-4 border-[#b8c4aa] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[#55624c] text-lg font-medium tracking-wide">Loading...</p>
            </div>
          </div>
          :
          <Suspense fallback={<div>Loading table...</div>}>
            <TableGridVehicle
              formTitle="Vehicle"
              tableTitle={tableTitle}
              tableContent={vehicleInfo}
              pushQuery={"vehicleid"}
              dragDropLink="importvehicle"
              buttonLink="addvehicle"
              fetchVehicleSchedule={fetchVehicleDetail}
              fetchExistingSchedule={fetchExistingSchedule}
            >
              <VehiclePopModal
                fetchData={fetchVehicleDetail}
                popupWindowInfo={popupWindowInfo}
                actionDelete={handleVehicleDel}
                actionEdit={handleVehicleSave}
              ></VehiclePopModal>
            </TableGridVehicle>
          </Suspense>
        }
      </div>
    </div>
  )
}