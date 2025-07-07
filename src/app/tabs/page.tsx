'use client'

import React from 'react';
import {useRouter} from "next/navigation";
import {tabsData} from "@/data/tabs";

const Tabs = () => {

  const router = useRouter();

  router.push(tabsData[0].href)

  return (
    <div>
      
    </div>
  );
};

export default Tabs;