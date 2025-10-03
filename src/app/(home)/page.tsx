'use client'

import TableGrid from "../components/forms/tableGrid";
import vehicleContent from "@/docs/vehicle_info.json"
import SubTitle from "../components/subTitle";
import Filter from "../components/filter";
import { useEffect, useState } from "react";
import modelInfoJson from "@/docs/modelInfo.json"
import DataMeasure from "@/app/components/dataMeasure"
import { createClient } from "@/utils/supabase/client";
import VehiclePopModal from "../components/forms/vehiclePopModal";

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
  // const [modelData, setModelData] = useState<Model[]>([])
  const [dataSum, setDataSum] = useState<carFleet[]>([])
  const [isLoading, setLoading] = useState(true)
  const [isFilterInfo, setFilterInfo] = useState([])
  const supabase = createClient()
  const modelInfo = modelInfoJson as Record<string, string[]>


  const flattenData = (data: any[]) =>
    data.map(({ model_information, ...rest }) => ({
      ...rest,
      model_name: model_information?.model_name ?? undefined,
      version_name: model_information?.version_name ?? undefined,
      interior_colour: model_information?.interior_colour ?? undefined,
      exterior_colour: model_information?.exterior_colour ?? undefined
    }))

  useEffect(() => {
    const fetchData = async () => {
      let { data: car_fleet, error } = await supabase
        .from('car_fleet')
        .select('*')
      if (error) {
        console.error("Error fetching car fleet: ", error)
      } else if (car_fleet) {
        setDataSum(car_fleet)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchVehicleModels = async () => {
      setLoading(true)
      if (isFilterInfo.length === 0 || !isFilterInfo) {
        let { data: car_fleet, error } = await supabase
          .from('car_fleet')
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
            `)
        if (error) {
          console.error("Error fetching car fleet: ", error)
        } else if (car_fleet) {
          setVehicleInfo(flattenData(car_fleet))
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
        setVehicleInfo([])
        return
      } else {
        setVehicleInfo(data ?? []);
      }
      setLoading(false);
    }
    fetchVehicleModels()
  }, [isFilterInfo])

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
    { key: "vin", label: "VIN" },
    { key: "plate_number", label: "Plate Number" },
    { key: "model_name", label: "Model Name" },
    { key: "version_name", label: "Version Name" },
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

  return (
    <div className="flex flex-col min-h-full">
      <SubTitle subTitleName="Vehicles"></SubTitle>
      {/* <DataMeasure></DataMeasure> */}
      <Filter setFilterInfo={setVehicleInfo} selectInfo={modelInfo} filterItems={tableTitle}></Filter>
      <div className="flex-1">
        <TableGrid
          formTitle="Vehicle"
          tableTitle={tableTitle}
          tableContent={vehicleInfo}
          pushQuery={"plate_number"}
          dragDropLink="importvehicle"
          buttonLink="addvehicle"
        >
          <VehiclePopModal
            fetchData={fetchVehicleDetail}
            popupWindowInfo={popupWindowInfo}
            actionDelete={handleVehicleDel}
            actionEdit={handleVehicleSave}
            selectInfo={vehicleInfo}
          ></VehiclePopModal>
        </TableGrid>
      </div>
    </div>
  );
}