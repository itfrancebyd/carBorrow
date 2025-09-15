import TableGrid from "@/app/components/forms/tableGrid"
import SubTitle from "@/app/components/subTitle"
import model_info from "@/docs/vehicle_model.json"

const ModelPage = () => {
    const tableTitle = [
        { key: "modelName", label: "Model Name" },
        { key: "versionName", label: "Version Name" },
        { key: "interiorColour", label: "Interior Colour" },
        { key: "exteriorColour", label: "Exterior Colour" }
    ]

    return (
        <div className="flex flex-col min-h-full">
            <SubTitle subTitleName="Loan Requests"></SubTitle>
            <div className="flex-1"><TableGrid formTitle="Loan Requests" tableTitle={tableTitle} tableContent={model_info} pushQuery={"model"} dragDropLink="importModel" buttonLink="addModel"></TableGrid></div>
        </div>
    )
}

export default ModelPage