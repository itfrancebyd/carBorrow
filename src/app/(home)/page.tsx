import TableGrid from "../components/forms/tableGrid";
import vehicleContent from "@/docs/vehicle_info.json"
import SubTitle from "../components/subTitle";

export default function Home() {
  const tableTitle = [
    { key: "plate_number", label: "Plate Number" },
    { key: "VIN", label: "VIN" },
    { key: "exterior_color", label: "Exterior Color" },
    { key: "interior_color", label: "Interior Color" },
    { key: "action", label: "Action" }
  ]

  return (
    <div className="flex flex-col min-h-full">
      <SubTitle subTitleName="Vehicles"></SubTitle>
      <div className="flex-1"><TableGrid formTitle="Vehicle" tableTitle={tableTitle} tableContent={vehicleContent} pushQuery={"plate_number"} dragDropLink="importvehicle" buttonLink="addvehicle"></TableGrid></div>
    </div>
  );
}