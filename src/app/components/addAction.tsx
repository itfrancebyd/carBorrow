import { createClient } from "@/utils/supabase/client"

type AddActionProps = {
    action_at: Date
    user_email: string
    action: string
    target: string
    detail: string
}

const AddAction = async ({ action_at, user_email, action, target, detail }: AddActionProps) => {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('logs')
        .insert([
            { action_at, user_email, action, target, detail },
        ])
        .select()
    if (error) {
        console.error("error:", error)
        return
    }
}

export default AddAction