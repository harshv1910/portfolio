import './globals.css'

import localFont from 'next/font/local'
import { Playfair_Display } from 'next/font/google'
import Navbar from './components/Navbar.jsx'

/* Local Fonts */

const greatVibes = localFont({
  src: '../fonts/GreatVibes-Regular.ttf',
  display: 'swap',
  variable: '--font-great-vibes',
})

const helvetica = localFont({
  src: [
    {
      path: '../fonts/Helvetica.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Helvetica-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-helvetica',
})

/* Google Font */

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
})

export const metadata = {
  title: 'Edit Wizard | Freelance Video Editor & Graphic Designer',
  description:
    'Portfolio of Harsh Varlani - Freelance Video Editor and Graphic Designer.',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${helvetica.variable} ${greatVibes.variable} ${playfair.variable}`}
    >
      <body className="antialiased font-sans">
        <Navbar/>
        {children}
      </body>
    </html>
  )
}
