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
    const answers = body.answers

    const formatted = {
      request_date: answers['9']?.prettyFormat,
      applicant: `${answers['3']?.answer?.first ?? ''} ${answers['3']?.answer?.last ?? ''}`,
      applicant_department: answers['65']?.answer,
      loan_start_date: answers['61']?.prettyFormat,
      loan_end_date: answers['64']?.prettyFormat,
      loan_intended: answers['78']?.answer,
      loan_reason: answers['80']?.answer,
      driver_name: answers['16']?.answer,
      license_no: answers['19']?.answer,
      licence_obtained_date: answers['82']?.prettyFormat,
      licence_issue_city: answers['83']?.answer,
      licence_expiration_date: answers['84']?.prettyFormat,
      prefered_model: answers['88']?.answer,
    }

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
