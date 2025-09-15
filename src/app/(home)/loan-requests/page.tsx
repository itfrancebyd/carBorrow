import SubTitle from "@/app/components/subTitle"
import TableGrid from "../../components/forms/tableGrid"
import loanInfo from "@/docs/loan_request_info.json"

const LoanReq = () => {
    const tableTitle = [
        { key: "loan_id", label: "Loan ID" },
        { key: "name", label: "Borrower Name" },
        { key: "car", label: "Car" },
        { key: "borrow_date", label: "Borrow Date" },
        { key: "return_data", label: "Return Date" },
        { key: "action", label: "Action" }
    ]

    return (
        <div className="flex flex-col min-h-full">
            <SubTitle subTitleName="Loan Requests"></SubTitle>
            <div className="flex-1"><TableGrid formTitle="Loan Requests" tableTitle={tableTitle} tableContent={loanInfo} pushQuery={"loan_id"} dragDropLink="importLoan" buttonLink="addloanrequest"></TableGrid></div>
        </div>
    )
}

export default LoanReq