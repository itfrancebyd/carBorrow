'use client'

import TableGrid from "../components/forms/tableGrid";
import vehicleContent from "@/docs/vehicle_info.json"
import SubTitle from "../components/subTitle";
import Filter from "../components/filter";
import { useEffect, useState } from "react";
import modelInfoJson from "@/docs/modelInfo.json"
import DataMeasure from "@/app/components/dataMeasure"
import { createClient } from "@/utils/supabase/client";

interface carFleet {
  id: string;
  vin: string;
  plat_number: string;
  model_name: string;
  plate_registration_date: string;
  status: string;
  modified_by: string;
}

export default function Home() {
  const [vehicleInfo, setVehicleInfo] = useState<carFleet[]>([])
  // const [modelData, setModelData] = useState<Model[]>([])
  const [dataSum, setDataSum] = useState<carFleet[]>([])
  const [isLoading, setLoading] = useState(true)
  const [isFilterInfo, setFilterInfo] = useState([])
  const supabase = createClient()
  const modelInfo = modelInfoJson as Record<string, string[]>

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
          .select('*')
        if (error) {
          console.error("Error fetching car fleet: ", error)
        } else if (car_fleet) {
          setVehicleInfo(car_fleet)
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
      .select("*")
      .eq("id", id)
      .single()
    if (error) throw error
    return data;
  };

  const tableTitle = [
    { key: "vin", label: "VIN" },
    { key: "plate_number", label: "Plate Number" },
    { key: "model_name", label: "Model Name" },
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
          fetchDetailWithId={fetchVehicleDetail}
          actionDelete={''}
          actionEdit={''}
          selectInfo={modelInfo}
        ></TableGrid></div>
    </div>
  );
}