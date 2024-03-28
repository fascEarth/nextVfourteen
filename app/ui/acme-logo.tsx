import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-tight text-white`}
    >
       {/*<GlobeAltIcon className="h-12 w-12 rotate-[15deg]" /> */}
      <Image src="/fascearth2.png" alt="Acme Logo" className="rounded-xl" width={40} height={40} />
      <p className="text-[44px]">FascEarth</p>
    </div>
  );
}
