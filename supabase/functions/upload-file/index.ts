import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const expiryTime = formData.get('expiryTime')
    const downloadLimit = formData.get('downloadLimit')

    if (!file || !expiryTime || !downloadLimit) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const fileExt = file.name.split('.').pop()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // Calculate expiration time
    const hours = parseInt(expiryTime.toString())
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + hours)

    // Insert file metadata into database
    const { data: fileData, error: dbError } = await supabase
      .from('files')
      .insert({
        filename: file.name,
        file_path: filePath,
        content_type: file.type,
        size: file.size,
        max_downloads: downloadLimit === 'unlimited' ? -1 : parseInt(downloadLimit.toString()),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      // If database insert fails, clean up the uploaded file
      await supabase.storage.from('files').remove([filePath])
      throw dbError
    }

    return new Response(
      JSON.stringify({ 
        message: 'File uploaded successfully',
        fileId: fileData.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to upload file', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})