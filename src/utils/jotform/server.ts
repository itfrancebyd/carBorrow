// curl -X GET "https://eu-api.jotform.com/form/{formID}/questions?apiKey={apiKey}"
import Jotform from "jotform"

const JOTFORM_API_KEY = process.env.NEXT_PUBLIC_JOTFORM_KEY! //!:Non-null assertion operator非空断言
const JOTFORM_FORM_ID = process.env.NEXT_PUBLIC_FORM_ID!

if (!JOTFORM_API_KEY) throw new Error("Missing JOTFORM_KEY in .env")
if (!JOTFORM_FORM_ID) throw new Error("Missing FORM_ID in .env")

export async function GetForms() {
    if (!JOTFORM_API_KEY || !JOTFORM_FORM_ID) return
    const client = new Jotform(JOTFORM_API_KEY, { baseURL: "https://eu-api.jotform.com" })
    const answers = await client.form.getSubmissions(JOTFORM_FORM_ID, {})
    return answers
}

export async function GetFormById(submissionId: string) {
    if (!JOTFORM_API_KEY || !JOTFORM_FORM_ID) return
    const client = new Jotform(JOTFORM_API_KEY, { baseURL: "https://eu-api.jotform.com" })
    const answersPerForm = await client.submission.get(submissionId)
    return answersPerForm
}

export const fetchJotformSubmissions = async () => {
    const url = `https://eu-api.jotform.com/form/${JOTFORM_FORM_ID}/submissions?apiKey=${JOTFORM_API_KEY}`

    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch Jotform submissions")

    const data = await res.json()
    return data.content || []
}

export interface JotformSubmissionUpdate {
    [key: string]: unknown
}

export const PostJotformSubmissions = async (
    submissionId: string,
    postBody: JotformSubmissionUpdate
): Promise<void> => {
    const url = `https://eu-api.jotform.com/submission/${submissionId}?apiKey=${JOTFORM_API_KEY}`

    try {
        const res: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postBody)
        })
    } catch (error: any) {
        console.error(error.message)
        return error
    }
}

