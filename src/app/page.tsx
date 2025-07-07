import Link from "next/link";
import {tabsData} from "@/data/tabs";


export default function Home() {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <h2 className='font-bold text-3xl mb-4'>Home page</h2>
      <p>Go to
        <Link
          href={tabsData[0].href}
          className='underline'
        >
          Tabs
        </Link>
      </p>
    </div>
  );
}
