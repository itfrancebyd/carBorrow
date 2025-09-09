import TableGrid from "../components/forms/tableGrid";
import vehicleContent from "@/docs/vehicle_info.json"

export default function Home() {
  const tableTitle = [
    "plate_number", "VIN", "exterior_color", "interior_color", "action"
  ]
  return (
    <div className="mx-10 flex h-[calc(100vh-11rem)]">
      <div className="flex-1"><TableGrid formTitle="Vehicle" tableTitle={tableTitle} tableContent={vehicleContent} pushQuery={tableTitle[0]} dragDropLink="importvehicle" buttonLink="addvehicle"></TableGrid></div>
    </div>
  );
}