import React, {FC} from 'react';
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import Image from "next/image";
import {ITab} from "@/models/ITab";

type Props = {
  children: React.ReactNode;
  tab: ITab
}

const HoverLayout:FC<Props> = ({children, tab}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>

      <HoverCardContent
        className='flex w-fit !p-4'
      >
        {typeof tab.icon === 'string' ? (
          <Image
            src={tab.icon}
            alt={tab.label}
            width={16}
            height={16}
          />
        ) : (
          tab.icon
        )}
        <span className='ml-2 p-[1px] border-r'>{tab.label}</span>
      </HoverCardContent>

    </HoverCard>
  );
};

export default HoverLayout;