import React, {FC} from 'react';
import {tabsData} from "@/data/tabs";
import {notFound} from "next/navigation";

type Props = {
  params: {
    tab: string;
  }
}

const TabPage:FC<Props> = async ({params}) => {
  const {tab:tabParams} = await params;
  const tab = tabsData.find(tab => tab.href.endsWith(tabParams));

  if (!tab) return notFound()

  return (
    <div className='h-full bg-(--background) rounded-2xl p-2 text-center'>
      {tab.content}
    </div>
  );
};

export default TabPage;