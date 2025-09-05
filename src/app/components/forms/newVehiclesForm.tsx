const NewVehiclesForm = () => {
    const vehiclesInfo = [
        "Arrival Date",
        "Status",
        "Model",
        "Trim",
        "Exterior Color",
        "Interior Color",
        "Vin",
        "Plate Number",
        "Insurance",
        "Pool Flag",
        "Mileage",
        "Update Rate",
        "Key 1",
        "Key 2",
        "Current Location"
    ];

    return (
        <div className="flex flex-col gap-3">
            <div className="text-xs text-gray-400">VEHICLES DETAILS</div>
            <form className="text-sm grid grid-cols-2 gap-x-5 gap-y-3">
                {vehiclesInfo.map((title) => (
                    <div key={title} className="flex flex-col">
                        <label className="text-gray-600">{title}</label>
                        <input type="text" name={title.toLocaleLowerCase()} className="border-1 border-gray-400 rounded-md py-1 px-2"></input>
                    </div>
                ))}
            </form>
            <button className="bg-[#26361C] hover:bg-[#7a856b] text-white hover:text-black font-semibold px-4 py-2 cursor-pointer">Submit</button>
        </div>
    )
}
export default NewVehiclesForm