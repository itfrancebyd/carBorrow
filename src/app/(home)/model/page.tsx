import DataMeasure from "@/app/components/DataMeasure"
import Filter from "@/app/components/filter"
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
            <DataMeasure></DataMeasure>
            <Filter></Filter>
            <div className="flex-1"><TableGrid formTitle="Loan Requests" tableTitle={tableTitle} tableContent={model_info} pushQuery={"model"} dragDropLink="importModel" buttonLink="addmodel"></TableGrid></div>
        </div>
    )
}

export default ModelPage