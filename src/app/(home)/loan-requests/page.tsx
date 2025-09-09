import TableGrid from "../../components/forms/tableGrid"
import loanInfo from "@/docs/loan_request_info.json"

const LoanReq = () => {
    const tableTitle = ["loan_id", "name", "car", "borrow_date", "return_data", "action"]
    return (
        <div className="mx-10 flex h-[calc(100vh-11rem)]">
            <div className="flex-1"><TableGrid formTitle="Loan Requests" tableTitle={tableTitle} tableContent={loanInfo} pushQuery={tableTitle[0]} dragDropLink="importLoan" buttonLink="addloanrequest"></TableGrid></div>
        </div>
    )
}

export default LoanReq