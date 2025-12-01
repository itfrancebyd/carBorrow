import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const formId = process.env.NEXT_PUBLIC_RETURN_ID

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get("content-type") || ""
        let data: Record<string, string> = {}

        if (contentType.includes("application/json")) {
            data = await request.json()
            console.log("🚀 ~ POST ~ data:", data)
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
            const formData = await request.formData()
            data = Object.fromEntries(formData) as Record<string, string>
            console.log("🚀 ~ POST ~ data:", data)
        } else {
            return NextResponse.json(
                { error: "unsupported content type" },
                { status: 400 }
            )
        }
        // remove `{}` from Jotform field names
        const cleaned = Object.fromEntries(
            Object.entries(data).map(([rawKey, value]) => {
                // remove {}
                const keyWithoutBrackets = rawKey.replace(/^\{|\}$/g, "");

                // find part after _
                const parts = keyWithoutBrackets.split("_");
                const finalKey = parts[1] ?? parts[0];

                return [finalKey, value];
            })
        )
        console.log("🚀 ~ POST ~ cleaned:", cleaned)

        const loan_id = cleaned.loanRequest

        const formatted = {
            checkin_location: cleaned.lieuDe,
            checkin_km: cleaned.kilometrage,
            checkin_energy: cleaned.niveauDe,
            checkout_location: cleaned.lieuDe64,
            checkout_km: cleaned.kilometrage60,
            checkout_energy: cleaned.niveauDe61
        }
        console.log("🚀 ~ POST ~ formatted:", formatted)

        // write to Supabase
        const { error } = await supabase
            .from('loan_requests')
            .update([formatted])
            .eq('id', loan_id)
            .select()

        if (error) {
            console.error('Supabase insert error:', error.message)
            return Response.json({ error: error.message }, { status: 500 })
        }
    } catch (err) {
        console.error('Webhook error:', err)
        return Response.json({ error: 'Invalid request' }, { status: 400 })
    }
}