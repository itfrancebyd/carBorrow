import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service key 才能写入数据库
)

function extractHref(html: string): string | null {
  const match = html.match(/href="([^"]+)"/)
  return match ? match[1] : null
}

// Next.js App Router receive POST request from webhook
export async function POST(request: Request) {
  try {
    console.log("🚀 ~ POST ~ request:", request)
    const contentType = request.headers.get("content-type") || ""
    let data: Record<string, string> = {}

    if (contentType.includes("application/json")) {
      data = await request.json()
      console.log("🚀 ~ POST ~ data:", data)
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData()
      data = Object.fromEntries(formData) as Record<string, string>
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      )
    }

    // ✅ Clean up keys: remove `{}` from Jotform field names
    const cleaned = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key.replace(/[{}]/g, ""), value])
    )
    console.log("🚀 ~ POST ~ cleaned:", cleaned)

    // Jotform webhook
    const formatted = {
      request_date: cleaned.dateDemande,
      applicant: cleaned.demandeur,
      applicant_department: cleaned.departementDemandeur,
      loan_start_date: cleaned.dureeDu,
      loan_end_date: cleaned.dureeDe,
      loan_intended: cleaned.objPret,
      loan_reason: cleaned.preciserPret,
      driver_name: cleaned.nomConducteur,
      license_no: cleaned.numPermis,
      licence_obtained_date: cleaned.dateDobtention,
      licence_issue_city: cleaned.typeA83,
      licence_expiration_date: cleaned.date,
      prefered_model: cleaned.modele,
      licence_photo: extractHref(cleaned.fileUpload),
      applicant_declaration: extractHref(cleaned.televerserLe),
      manager_approval: extractHref(cleaned.accordDu),
      submission_id: cleaned.id103,
    }

    // write to Supabase
    const { data: inserted, error } = await supabase
      .from('loan_requests')
      .insert([formatted])
      .select("id")
      .single()

    if (error) {
      console.error('Supabase insert error:', error.message)
      return Response.json({ error: error.message }, { status: 500 })
    }

    const loan_id = inserted.id
    console.log("🚀 ~ POST ~ loan_id:", loan_id)

    console.log('✅ New Jotform entry saved to Supabase')
    return Response.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
