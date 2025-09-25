'use client'

import TableGrid from "../components/forms/tableGrid";
import vehicleContent from "@/docs/vehicle_info.json"
import SubTitle from "../components/subTitle";
import Filter from "../components/filter";
import { useState } from "react";
import modelInfoJson from "@/docs/modelInfo.json"
import DataMeasure from "@/app/components/dataMeasure"

export default function Home() {
  const [isVehicleInfo, setVehicleInfo] = useState([])
  const modelInfo = modelInfoJson as Record<string, string[]>

  const tableTitle = [
    { key: "vin", label: "VIN" },
    { key: "plate_number", label: "Plate Number" },
    { key: "model_name", label: "Model Name" },
    { key: "status", label: "status" }
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
          tableContent={vehicleContent}
          pushQuery={"plate_number"}
          dragDropLink="importvehicle"
          buttonLink="addvehicle"
          fetchDetailWithId={''}
          actionDelete={''}
          actionEdit={''}
          selectInfo={modelInfo}
        ></TableGrid></div>
    </div>
  );
}