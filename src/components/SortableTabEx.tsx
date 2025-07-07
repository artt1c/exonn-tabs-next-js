'use client';

import React, { useEffect, useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { usePathname, useRouter } from 'next/navigation';
import { GripVertical, Pin } from 'lucide-react';
import { tabsData } from '@/data/tabs';
import {ITab} from "@/models/ITab";
import {Transform} from "node:stream";
import {cn} from "@/lib/utils";

interface DraggableTabsProps {
  initialTabs?: ITab[];
  persistOrder?: boolean;
}

const DraggableTabs: React.FC<DraggableTabsProps> = ({
                                                       initialTabs = tabsData,
                                                       persistOrder = false,
                                                     }) => {
  const hydratedTabs = React.useMemo(() => {
    if (!persistOrder) return initialTabs;
    if (typeof window === 'undefined') return initialTabs;
    const stored = localStorage.getItem('tabOrder');
    if (!stored) return initialTabs;
    try {
      const ids: string[] = JSON.parse(stored);
      return [
        ...initialTabs.filter((t) => ids.includes(t.id)).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)),
        ...initialTabs.filter((t) => !ids.includes(t.id)),
      ];
    } catch {
      return initialTabs;
    }
  }, [initialTabs, persistOrder]);

  const [tabs, setTabs] = useState<ITab[]>(hydratedTabs.map(tab => ({
    ...tab,
    icon: typeof tab.icon === 'string' ? `/icons/${tab.icon}` : tab.icon
  })));
  const [active, setActive] = useState<string>(hydratedTabs[0]?.id ?? '');

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const current = tabs.find((t) => t.href === pathname);
    if (current) {
      setActive(current.id);
    }
  }, [pathname, tabs]);

  useEffect(() => {
    if (!persistOrder) return;
    if (typeof window === 'undefined') return;
    localStorage.setItem('tabOrder', JSON.stringify(tabs.map((t) => t.id)));
  }, [tabs, persistOrder]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = ({ active: activeDrag, over }: DragEndEvent) => {
    if (!over || activeDrag.id === over.id) return;
    const source = tabs.find((t) => t.id === activeDrag.id);
    const target = tabs.find((t) => t.id === over.id);
    if (!source || !target) return;
    if (source.pinned || target.pinned) return;
    const oldIndex = tabs.findIndex((t) => t.id === activeDrag.id);
    const newIndex = tabs.findIndex((t) => t.id === over.id);
    setTabs((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const togglePin = (id: string) => {
    setTabs((prev) => prev.map((t) => t.id === id ? { ...t, pinned: !t.pinned } : t));
  };

  const sortedTabs = React.useMemo(
    () => [
      ...tabs.filter((t) => t.pinned),
      ...tabs.filter((t) => !t.pinned),
    ],
    [tabs],
  );

  const nonPinnedIds = tabs.filter((t) => !t.pinned).map((t) => t.id);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={nonPinnedIds} strategy={horizontalListSortingStrategy}>
        <Tabs
          value={active}
          onValueChange={(val) => {
            setActive(val);
            const tab = tabs.find((t) => t.id === val);
            if (tab && tab.href !== pathname) {
              router.push(tab.href);
            }
          }}
          className="w-full"
        >
          <TabsList className="flex gap-1 overflow-x-auto rounded-md bg-muted p-1">
            {sortedTabs.map((tab) => (
              <SortableTabEx key={tab.id} tab={tab} onTogglePin={() => togglePin(tab.id)} />
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="p-4">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </SortableContext>
    </DndContext>
  );
};

// ----------------------------------------------------------------------------------------------------

interface SortableTabProps {
  tab: ITab;
  onTogglePin: () => void;
}



export function SortableTabEx({ tab, onTogglePin }: SortableTabProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
  } = useSortable({ id: tab.id, disabled: tab.pinned });

  const style: React.CSSProperties = {
    transform: Transform.toString(),
    transition,
  };

  return (
    <TabsTrigger
      ref={setNodeRef}
      style={style}
      value={tab.id}
      className={cn(
        'group relative flex items-center gap-1 rounded-md px-3 py-1 text-sm',
        tab.pinned
          ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100'
          : 'hover:bg-accent',
      )}
      onContextMenu={(e) => {
        e.preventDefault();
        onTogglePin();
      }}
      {...attributes}
      {...(tab.pinned ? {} : listeners)}
    >
      {typeof tab.icon === 'string' ? (
        <img src={tab.icon} alt="" className="h-4 w-4" />
      ) : (
        tab.icon
      )}
      <span>{tab.label}</span>
      {tab.pinned ? (
        <Pin size={14} className="ml-1" />
      ) : (
        <GripVertical size={14} className="ml-1 cursor-grab group-hover:opacity-70" />
      )}
    </TabsTrigger>
  );
}

export default DraggableTabs;
