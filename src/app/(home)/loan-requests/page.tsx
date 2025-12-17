'use client'
import SubTitle from "@/app/components/subTitle"
import { Suspense, useEffect, useState } from "react"
import TableGridLoanReq from "@/app/components/forms/tableGridLoanReq"
import LoanReqPopModal from "@/app/components/forms/loanReqPopModal"
import modelInfoJson from "@/docs/modelInfo.json"
import { createClient } from "@/utils/supabase/client"
import FilterLoan from "@/app/components/filterLoan"
import DataMeasure from "@/app/components/dataMeasure"

export interface answerContent {
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
    applicant_declaration: string;
    manager_approval: string;
    status: string
}

const LoanReq = () => {
    const [isLoanData, setLoanData] = useState<answerContent[]>([])
    const [isAllLoanData, setAllLoanData] = useState<answerContent[]>([])
    const modelInfo = modelInfoJson as Record<string, string[]>
    const [isFilterInfo, setFilterInfo] = useState<Record<string, string | null>>({})
    const [isLoading, setLoading] = useState(true)
    const supabase = createClient()
    // const [dataSum, setDataSum] = useState<ModelProps[]>([])

    const tableTitle = [
        { key: "status", label: "Status" },
        { key: "allocate", label: "Allocate" },
        { key: "request_date", label: "Request date" },
        { key: "applicant", label: "Applicant" },
        { key: "applicant_department", label: "Department" },
        { key: "loan_start_date", label: "Borrow date" },
        { key: "loan_end_date", label: "Return date" },
        { key: "prefered_model", label: "Preferred Model" },
        { key: "vehicle_number", label: "Vehicle Number" },
    ]

    const filterTitle = [
        { key: "status", label: "Status" },
        { key: "request_date", label: "Request date" },
        { key: "applicant", label: "Applicant" },
        { key: "applicant_department", label: "Department" },
        { key: "prefered_model", label: "Preferred Model" },
    ]

    const popupWindowInfo = [
        { key: "id", label: "Submission id" },
        { key: "request_date", label: "Request date" },
        { key: "applicant", label: "Applicant" },
        { key: "applicant_department", label: "Department" },
        { key: "loan_start_date", label: "Borrow date" },
        { key: "loan_end_date", label: "Return date" },
        { key: "loan_intended", label: "Intend" },
        { key: "loan_reason", label: "Comment" },
        { key: "prefered_model", label: "Preferred Model" },
        { key: "comment", label: "User Comment" },
        { key: "driver_name", label: "Driver name" },
        { key: "license_no", label: "License number" },
        { key: "licence_obtained_date", label: "licence obtain date" },
        { key: "licence_issue_city", label: "Issue city" },
        { key: "licence_expiration_date", label: "Expiration date" },
        { key: "licence_photo", label: "License" },
        { key: "applicant_declaration", label: "Applicant declaration" },
        { key: "manager_approval", label: "Manager Approval" },
    ]

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const { data: loan_requests, error } = await supabase
                .from('loan_requests')
                .select('*')
            if (error) {
                console.error("Error fetching loan requests: ", error)
            }
            if (loan_requests) {
                const statusOrder: Record<string, number> = {
                    new: 1,
                    allocated: 2,
                    issued: 3,
                    completed: 4,
                    canceled: 5,
                }

                const sorted = loan_requests.sort((a, b) => {
                    const statusA = statusOrder[a.status] ?? 999
                    const statusB = statusOrder[b.status] ?? 999

                    if (statusA !== statusB) {
                        return statusA - statusB
                    }

                    return (
                        new Date(b.request_date).getTime() - new Date(a.request_date).getTime()
                    )
                })

                setLoanData(sorted)
                setAllLoanData(sorted)
                setLoading(false)
            }

        }
        fetchData()
    }, [])

    //filter
    useEffect(() => {
        if (!isAllLoanData.length) return

        const filtered = isAllLoanData.filter((item) => {
            return Object.entries(isFilterInfo).every(([key, value]) => {
                if (!value) return true
                const itemValue = String(item[key as keyof typeof item] ?? "").toLowerCase()
                return itemValue.includes(String(value).toLowerCase())
            })
        })

        setLoanData(filtered)
    }, [isFilterInfo, isAllLoanData])

    // fetch detail with id
    const fetchVehicleDetail = async (id: string) => {
        const { data, error } = await supabase
            .from("loan_requests")
            .select("*")
            .eq("id", id)
            .single()
        if (error) throw error
        return data
    }

    const handleDetele = async (id: string) => {
        const { data, error } = await supabase
            .from("loan_requests")
            .update({ status: "canceled" })
            .eq("id", id)
            .select()
        if (error) {
            throw error
        }
    }

    const handleEdit = async (id: string, updatedData: answerContent) => {
        const { data, error } = await supabase
            .from("loan_requests")
            .update(updatedData)
            .eq("id", id)
            .select()
        if (error) {
            throw error
        }
    }

    const dataMeasure = [
        { title: "New", dataCount: isAllLoanData.filter((item) => item.status === "new").length, color: "bg-blue-600" },
        { title: "Allocated", dataCount: isAllLoanData.filter((item) => item.status === "allocated").length, color: "bg-green-400" },
        { title: "Canceled", dataCount: isAllLoanData.filter((item) => item.status === "canceled").length, color: "bg-red-600" }
    ]

    return (
        <div className="flex flex-col h-screen">
            <SubTitle subTitleName="Loan Requests"></SubTitle>
            <DataMeasure dataMeasure={dataMeasure}></DataMeasure>
            <div className="hidden sm:inline"><FilterLoan setFilterInfo={setFilterInfo} selectInfo={modelInfo} filterItems={filterTitle}></FilterLoan></div>
            <div className="flex-1">
                {isLoading
                    ?
                    <div className="flex items-center justify-center h-full py-5 bg-[#f7f9f4]">
                        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[#e6ecde] shadow-md mx-8 w-full h-full animate-pulse">
                            <div className="w-10 h-10 border-4 border-[#b8c4aa] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-[#55624c] text-lg font-medium tracking-wide">Loading...</p>
                        </div>
                    </div>
                    :
                    <Suspense fallback={<div>Loading table...</div>}>
                        <TableGridLoanReq
                            formTitle="Loan Requests"
                            tableTitle={tableTitle}
                            tableContent={isLoanData}
                            pushQuery={"loan_id"}
                            dragDropLink="importvehicle"
                            buttonLink="addloanrequest"
                        >
                            <LoanReqPopModal
                                fetchData={fetchVehicleDetail}
                                modelInfo={modelInfo}
                                popupWindowInfo={popupWindowInfo}
                                actionDelete={handleDetele}
                                actionEdit={handleEdit}
                            ></LoanReqPopModal>
                        </TableGridLoanReq>
                    </Suspense>
                }
            </div>
        </div>
    )
}

export default LoanReq