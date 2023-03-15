import { useState } from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createBrowserSupabaseClient, Session } from '@supabase/auth-helpers-nextjs'
import '../styles/globals.css'
import Navbar from '../components/navbar'
import Overlay from '../components/overlay'

function MyApp({
    Component, 
    pageProps 
}: AppProps<{
    initialSession: Session
}>) {
    const [supabaseClient] = useState(() => createBrowserSupabaseClient())
    const [overlay, setOverlay] = useState('')

    return (
        <SessionContextProvider
            supabaseClient={supabaseClient}
            initialSession={pageProps.initialSession}
        >
        <Head>
            <link rel='icon' href='/favicon-red.ico' />
            <link rel='apple-touch-icon' href='/apple-touch-icon-iphone-60x60.png' />
            <link rel='icon' sizes='16x16' href='/favicon-red.png' />
            <link rel='icon' sizes='32x32' href='/favicon-red.png' />
        </Head>
        <div className={`font-poppins min-w-screen flex flex-col
            ${overlay !== '' ? 'h-screen overflow-hidden' : 'h-screen'}`}>
            <Navbar setOverlay={setOverlay} />
            <Component {...pageProps} />
            <Overlay overlay={overlay} setOverlay={setOverlay} />
            <Analytics />
        </div>
        </SessionContextProvider>
    )
}

export default MyApp
