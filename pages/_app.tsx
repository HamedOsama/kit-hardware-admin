import { Toaster } from 'react-hot-toast'
import type { AppProps } from 'next/app'


import '../styles/globals.css'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
        <Toaster position="top-right" />        
          <Component {...pageProps} />
    </>
  )
}

export default MyApp
