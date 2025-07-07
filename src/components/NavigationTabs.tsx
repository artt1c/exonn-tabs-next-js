'use client';

import React, {FC, useEffect, useMemo, useState} from 'react';
import {ITab} from "@/models/ITab";
import {usePathname, useRouter} from "next/navigation";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import {Tabs, TabsList} from "@/components/ui/tabs";
import {getStoreTabs} from "@/lib/getStoreTabs";
import Tab from "@/components/Tab";

type TabsDataProps = {
  initTabs :ITab[];
  persistOrder?: boolean;
}

const NavigationTabs:FC<TabsDataProps> = ({initTabs, persistOrder = false}) => {

  // Store tabs
  const storedTabs: ITab[] = useMemo(() =>
    getStoreTabs(persistOrder, initTabs),
    [initTabs, persistOrder]);


  // Add path for img icon if icon = string
  const tabWithFullIconPath = (tabs:ITab[]):ITab[] => {
    return tabs.map((tab:ITab) => ({
      ...tab,
      icon: typeof tab.icon === 'string' ? `/icons/${tab.icon}` : tab.icon
    }))
  }

  // STATES
  const [tabs, setTabs] = useState<ITab[]>(tabWithFullIconPath(storedTabs));
  const [activeTab, setActiveTab] = useState<string>(storedTabs[0].id ?? '');

  const router = useRouter();
  const pathname = usePathname();


  // USE EFFECTS
  useEffect(() => {
    const current = tabs.find((tab) => tab.href === pathname)

    if (current) setActiveTab(current.id);
  }, [pathname, tabs]);

  useEffect(() => {
    if (!persistOrder) return;
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('tabState', JSON.stringify(tabs.map(({ id, pinned }) => ({ id, pinned }))));
  }, [tabs, persistOrder]);



  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Drag handle
  const handleDragEnd = (event:DragEndEvent) => {
    const {active, over} = event

    if (!over || active.id === over.id) return;

    const source = tabs.find(tab => tab.id === active.id);
    const target = tabs.find(tab => tab.id === over.id);

    if (!source || !target) return;
    if (source.pinned || target.pinned) return;


    setTabs(()=> {
      const oldIndex = tabs.findIndex(tab => tab.id === active.id);
      const newIndex = tabs.findIndex(tab => tab.id === over.id);

      return arrayMove(tabs, oldIndex, newIndex);
    });
  }

  const togglePin = (id:string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, pinned: !tab.pinned } : tab));
  }

  // Sort tabs
  const sortedTabs = useMemo(() => [
      ...tabs.filter(tab => tab.pinned),
      ...tabs.filter(tab => !tab.pinned),
  ], [tabs])

  const nonPinnedIds = tabs
    .filter(tab => !tab.pinned)
    .map(tab => tab.id)


  return (
    <nav>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={nonPinnedIds}
          strategy={horizontalListSortingStrategy}
        >

          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              const tab = tabs.find(tab => tab.id === val)

              if (tab && tab.href !== pathname) router.push(tab.href);
            }}
          >
            {/*TABS LIST*/}
            <TabsList className="h-auto flex max-w-dvw md:max-w-full overflow-hidden rounded-md bg-muted p-1">
              {
                sortedTabs.map(tab => (
                  <Tab key={tab.id} tab={tab} onTogglePin={() => togglePin(tab.id)}/>
                ))
              }
            </TabsList>
          </Tabs>

        </SortableContext>
      </DndContext>
    </nav>
  );
};

export default NavigationTabs;