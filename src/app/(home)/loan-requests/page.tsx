'use client'
import SubTitle from "@/app/components/subTitle"
import { useEffect, useState } from "react"
import JotformServer from "@/utils/jotform/server"
import TableGridLoanReq from "@/app/components/forms/tableGridLoanReq"
import LoanReqPopModal from "@/app/components/forms/loanReqPopModal"

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
    const [isAnswerArr, setAnswerArr] = useState<answerContent[]>([])
    const tableTitle = [
        { key: "request_date", label: "Request date" },
        { key: "applicant", label: "Applicant" },
        { key: "applicant_department", label: "Department" },
        { key: "loan_start_date", label: "Borrow date" },
        { key: "loan_end_date", label: "Return date" },
        { key: "loan_intended", label: "Intend" },
        { key: "loan_reason", label: "Comment" },
        { key: "prefered_model", label: "model" },
    ]

    const popupWindowInfo = [
        { key: "request_date", label: "Request date" },
        { key: "applicant", label: "Applicant" },
        { key: "applicant_department", label: "Department" },
        { key: "loan_start_date", label: "Borrow date" },
        { key: "loan_end_date", label: "Return date" },
        { key: "loan_intended", label: "Intend" },
        { key: "loan_reason", label: "Comment" },
        { key: "driver_name", label: "Driver name" },
        { key: "license_no", label: "License number" },
        { key: "licence_obtained_date", label: "licence obtain date" },
        { key: "licence_issue_city", label: "Issue city" },
        { key: "licence_expiration_date", label: "Expiration date" },
        { key: "licence_photo", label: "license" },
        { key: "prefered_model", label: "model" },
    ]
    useEffect(() => {
        const getAnswers = async () => {
            const resObj = await JotformServer()
            if (resObj) {
                const answersContent = resObj.content
                const formattedAnswers: answerContent[] = answersContent.map((item: any) => {
                    const answers = item.answers
                    return {
                        id: item.id,
                        request_date: answers[9]?.prettyFormat ?? "",
                        applicant: `${answers[3]?.answer?.first ?? ""} ${answers[3]?.answer?.last ?? ""}`,
                        applicant_department: answers[65]?.answer ?? "",
                        loan_start_date: answers[61]?.prettyFormat ?? "",
                        loan_end_date: answers[64]?.prettyFormat ?? "",
                        loan_intended: answers[9]?.prettyFormat ?? "",
                        loan_reason: answers[80]?.answer ?? "",
                        driver_name: answers[16]?.answer ?? "",
                        license_no: answers[19]?.answer ?? "",
                        licence_obtained_date: answers[82]?.prettyFormat ?? "",
                        licence_issue_city: answers[83]?.answer ?? "",
                        licence_expiration_date: answers[84]?.prettyFormat ?? "",
                        licence_photo: answers[86]?.answer?.[0] ?? "",
                        prefered_model: answers[88]?.answer ?? "",
                    }
                })

                setAnswerArr(formattedAnswers)
            }
        }
        getAnswers()
    }, [])

    return (
        <div className="flex flex-col h-screen">
            <SubTitle subTitleName="Loan Requests"></SubTitle>
            <div className="flex-1">
                <TableGridLoanReq
                    formTitle="Loan Requests"
                    tableTitle={tableTitle}
                    tableContent={isAnswerArr}
                    pushQuery={"loan_id"}
                    dragDropLink="importvehicle"
                    buttonLink="addloanrequest"
                >
                    <LoanReqPopModal
                        popupWindowInfo={popupWindowInfo}
                    ></LoanReqPopModal>
                </TableGridLoanReq>
            </div>
        </div>
    )
}

export default LoanReq