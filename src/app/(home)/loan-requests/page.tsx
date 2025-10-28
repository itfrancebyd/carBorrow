'use client'
import SubTitle from "@/app/components/subTitle"
import TableGrid from "../../components/forms/tableGrid"
import loanInfo from "@/docs/loan_request_info.json"
import { useEffect } from "react"
import JotformServer from "@/utils/jotform/server"

interface answerContent {
    request_date: Date;
    applicant: string;
    applicant_department: string;
    loan_start_date: Date;
    loan_end_date: Date;
    loan_intended: string;
    loan_reason: string;
    driver_name: string;
    license_no: string;
    licence_obtained_date: Date;
    licence_issue_city: string;
    licence_expiration_date: Date;
    licence_photo: string;
    prefered_model: string;
}

const LoanReq = () => {
    const tableTitle = [
        { key: "loan_id", label: "Loan ID" },
        { key: "name", label: "Borrower Name" },
        { key: "car", label: "Car" },
        { key: "borrow_date", label: "Borrow Date" },
        { key: "return_data", label: "Return Date" },
        { key: "action", label: "Action" }
    ]
    let answersArr: answerContent[] = []
    useEffect(() => {
        console.log("dd")
        const getAnswers = async () => {
            const resObj = await JotformServer()
            if (resObj) {
                const answersContent = resObj.content
                const length = answersContent.length as number
                for (let i = 0; i < length; i++) {
                    const answers = answersContent[i].answers
                    const answersObj = {
                        "request_date": answers[9].prettyFormat,
                        "applicant": answers[3].answer.first + " " + answers[3].answer.last,
                        "applicant_department": answers[65].answer,
                        "loan_start_date": answers[61].prettyFormat,
                        "loan_end_date": answers[64].prettyFormat,
                        "loan_intended": answers[9].prettyFormat,
                        "loan_reason": answers[80].answer,
                        "driver_name": answers[16].answer,
                        "license_no": answers[19].answer,
                        "licence_obtained_date": answers[82].prettyFormat,
                        "licence_issue_city": answers[83].answer,
                        "licence_expiration_date": answers[84].prettyFormat,
                        "licence_photo": answers[86].answer[0],
                        "prefered_model": answers[88].answer,
                    }
                    answersArr.push(answersObj)
                }
            }
        }
        getAnswers()
    }, [])

    return (
        <div className="flex flex-col min-h-full">
            <SubTitle subTitleName="Loan Requests"></SubTitle>
            {/* <div className="flex-1"><TableGrid formTitle="Loan Requests" tableTitle={tableTitle} tableContent={loanInfo} pushQuery={"loan_id"} dragDropLink="importLoan" buttonLink="addloanrequest"></TableGrid></div> */}
        </div>
    )
}

export default LoanReq