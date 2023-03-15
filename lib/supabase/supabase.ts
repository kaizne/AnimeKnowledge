import { createClient } from '@supabase/supabase-js'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(url, key)

const incrementPlays = async (slug: string) => {
    const { data, error } = await supabase
        .rpc('increment_plays', { _slug: slug })
}

const incrementRequests = async (slug: string) => {
    const { data, error } = await supabase
        .rpc('increment_requests', { _slug: slug })
}

export { supabase, incrementPlays, incrementRequests }
