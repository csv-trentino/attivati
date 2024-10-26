import Image from 'next/image'
import csvtrentinoPic from "../assets/images/logo-csvtrentino.png"
import trentovoloPic from "../assets/images/logo-trentovolo.png"
import { APPLE_STORE_URL, GITHUB_URL, GOOGLE_PLAY_URL } from '../consts'

export default function Footer() {
  return (
    <div className="flex flex-col m-4 items-center justify-center md:mx-10 lg:flex-row lg:items-start lg:justify-between gap-4 border-t py-20">

      <div className="flex flex-col items-center justify-center lg:flex-row lg:items-start gap-10 lg:gap-36 ">
        <div className="flex flex-col space-y-4">
          <div>Un progetto di</div>
          <Image src={trentovoloPic} alt="Scarica da App Store" width={128} />
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <div>In collaborazione con</div>
          <Image src={csvtrentinoPic} alt="Scarica da App Store" width={128} />
        </div>

        <div className='text-center lg:text-left'>
          <div>Via Lunelli, 4 - 38121 Trento</div>
          <div>0461 916604</div>
          <div>C.F. 96061940225</div>
          <div>P. IVA 01852790227</div>
        </div>

      </div>

      <div className="flex flex-col items-center lg:flex-row lg:items-start gap-10 mt-10 lg:mt-0">
        <div className="flex flex-col items-center lg:items-start">
          <div className='mb-8'>Scarica l&#39;app</div>
          <a className='underline text-gray-500' href={APPLE_STORE_URL}>Apple Store</a>
          <a className='underline text-gray-500' href={GOOGLE_PLAY_URL}>Google Play</a>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <div className='mb-8'>Link utili</div>
          <a className='underline text-gray-500' href="/terms-of-service">Termini e Condizioni</a>
          <a className='underline text-gray-500' href="/privacy-policy">Privacy Policy</a>
          <a className='underline text-gray-500' href={GITHUB_URL}>Github</a>
        </div>
      </div>

    </div>
  )
}

