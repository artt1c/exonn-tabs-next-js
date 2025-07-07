import React, {FC} from 'react';
import {ITab} from "@/models/ITab";
import {useSortable} from "@dnd-kit/sortable";
import {Transform} from "node:stream";
import {TabsTrigger} from "@/components/ui/tabs";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu";
import {Pin} from "lucide-react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";


type TabProps ={
  tab:ITab;
  onTogglePin: () => void;
}

const Tab:FC<TabProps> = ({tab, onTogglePin}) => {

  const {attributes, listeners, setNodeRef, transition} = useSortable({ id: tab.id, disabled: tab.pinned });

  const style: React.CSSProperties = {
    transform: Transform.toString(),
    transition,
  };

  return (
    <ContextMenu>

      <ContextMenuTrigger asChild>

        <HoverCard>
          <HoverCardTrigger asChild>

            <TabsTrigger
              ref={setNodeRef}
              style={style}
              value={tab.id}
              className={cn(
                'box-content h-4 min-w-4 group relative flex items-center text-sm leading-none hover:bg-(-hover) bg-background px-5 py-4 text-(--secondary-foreground) font-medium border-t-(--border)',
                tab.pinned
                  ? 'w-6' : '',
              )}
              {...attributes}
              {...(tab.pinned ? {} : listeners)}
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

              {tab.pinned ? (
                <></>
              ) : (
                <span className='ml-2 p-[1px] border-r'>{tab.label}</span>
              )}
            </TabsTrigger>

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


      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          onSelect={onTogglePin}
        >
          <Pin size={14} className="ml-1" /> Tab anpinnen
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Tab;