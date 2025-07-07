import React, {FC} from 'react';
import {ITab} from "@/models/ITab";
import {useSortable} from "@dnd-kit/sortable";
import {TabsTrigger} from "@/components/ui/tabs";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu";
import {Pin} from "lucide-react";
import {CSS} from "@dnd-kit/utilities";
import HoverLayout from "@/components/layout/HoverLayout";


type TabProps ={
  tab:ITab;
  active: boolean
  onTogglePin: () => void;
}

const Tab:FC<TabProps> = ({tab, active, onTogglePin}) => {

  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({ id: tab.id, disabled: tab.pinned });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ContextMenu>

      <ContextMenuTrigger>
        <HoverLayout tab={tab}>
          <TabsTrigger
            ref={setNodeRef}
            style={style}
            value={tab.id}
            className={cn(
              'box-content h-4 min-w-4 group relative flex items-center text-sm leading-none hover:bg-(-hover) bg-background px-5 py-4 text-(--secondary-foreground) font-medium border-t-(--border)',
              active ? 'bg-secondary text-(--primary) border-t-3 border-t-(--border-secondary)' : '',
              tab.pinned
                ? 'w-3' : '',
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
        </HoverLayout>
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