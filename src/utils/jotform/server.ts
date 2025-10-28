// curl -X GET "https://eu-api.jotform.com/form/{formID}/questions?apiKey={apiKey}"
import Jotform from "jotform"

async function JotformServer() {
    const JOTFORM_API_KEY = process.env.NEXT_PUBLIC_JOTFORM_KEY
    const JOTFORM_FORM_ID = process.env.NEXT_PUBLIC_FORM_ID
    if (!JOTFORM_API_KEY || !JOTFORM_FORM_ID) return

    const client = new Jotform(JOTFORM_API_KEY, { baseURL: "https://eu-api.jotform.com" })
    const answers = await client.form.getSubmissions(JOTFORM_FORM_ID, {})
    return answers
}

export default JotformServer