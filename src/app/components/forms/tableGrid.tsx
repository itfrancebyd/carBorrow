import { it } from "node:test"

const TableGrid = () => {
    const tableTitle = [
        "plat_number", "VIN", "exterior_color", "interior_color"
    ]
    const tableContent = [
        {
            plat_number: "12456778",
            VIN: "hhhhhhhh",
            exterior_color: "red",
            interior_color: "blue"
        }
    ]


    return (
        <div className="">
            <div className="bg-white py-5 px-8 rounded-xl">
                <div className="font-semibold text-lg">Vihicle</div>
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b-2 border-[#F3F5F7]">
                            {tableTitle.map((title, index) =>
                                <th key={index} className="text-start">{title}</th>
                            )}
                        </tr>
                    </thead>
                    {tableContent.map((item, index) => (
                        <tr key={index}>
                            <td>{item.plat_number}</td>
                            <td>{item.VIN}</td>
                            <td>{item.exterior_color}</td>
                            <td>{item.interior_color}</td>
                        </tr>
                    ))}
                </table>
            </div>
            <div>page1</div>
        </div>
    )
}

export default TableGrid