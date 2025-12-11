'use client'

import { useAppContext } from "@/app/components/context"

const LogPage = () => {
    const { isCurrentUser } = useAppContext()
    return (
        <div>Log Page</div>
    )
}

export default LogPage