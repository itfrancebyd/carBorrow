'use client'

import { useAppContext } from "@/app/components/context"
import TableGridLog from "@/app/components/forms/tableGridLog"
import SubTitle from "@/app/components/subTitle"
import { createClient } from "@/utils/supabase/client"
import { redirect } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

type LogDataProp = {
    id: string
    action_at: string
    user_email: string
    action: string
    target: string
    detail: string
}

const LogPage = () => {
    const [isLogData, setLogData] = useState<LogDataProp[]>([])
    const supabase = createClient()

    // if (isCurrentUser?.user_metadata?.role !== "admin") {
    //     redirect("/")
    // }
    const tableTitle = [
        { key: "action_at", label: "Time" },
        { key: "user_email", label: "User" },
        { key: "action", label: "Action" },
        { key: "target", label: "Target" },
        { key: "detail", label: "Detail Name" }
    ]
    useEffect(() => {
        const getLogs = async () => {
            const { data, error } = await supabase
                .from('logs')
                .select(`
                    id,
                    action_at,
                    user_email,
                    action,
                    target,
                    detail
                `)
            if (error) {
                console.error("Error get logs! " + error)
                return
            }
            setLogData(data)
        }
        getLogs()
    }, [])

    return (
        <div className="flex flex-col h-screen">
            <SubTitle subTitleName="Logs"></SubTitle>
            <div className="flex-1">
                <Suspense fallback={<div>Loading table...</div>}>
                    <TableGridLog formTitle="Logs" tableTitle={tableTitle} tableContent={isLogData} />
                </Suspense>
            </div>
        </div>
    )
}

export default LogPage