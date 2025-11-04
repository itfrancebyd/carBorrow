import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service key 才能写入数据库
)

// Next.js App Router receive POST request from webhook
export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("🚀 ~ POST ~ body:", body)

    // Jotform webhook

    const formatted = {
      request_date: body.dateDemande,
      applicant: body.demandeur,
      applicant_department: body.departementDemandeur,
      loan_start_date: body.dureeDu,
      loan_end_date: body.dureeDe,
      loan_intended: body.objPret,
      loan_reason: body.preciserPret,
      driver_name: body.nomConducteur,
      license_no: body.numPermis,
      licence_obtained_date: body.dateDobtention,
      licence_issue_city: body.typeA83,
      licence_expiration_date: body.date,
      prefered_model: body.modele
    }
    console.log("🚀 ~ POST ~ formatted:", formatted)

    // write to Supabase
    const { error } = await supabase
      .from('loan_requests')
      .insert([formatted])

    if (error) {
      console.error('Supabase insert error:', error.message)
      return Response.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ New Jotform entry saved to Supabase')
    return Response.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
