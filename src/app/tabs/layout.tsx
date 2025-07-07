import React from "react";
import NavigationTabs from "@/components/NavigationTabs";
import {tabsData} from "@/data/tabs";
// import {Metadata} from "next";

// export const generateMetadata = async ({params}: {params: {id: string}}): Promise<Metadata> => {
//   const user = await getUserById(params.id)
//   console.log(user)
//   return {title: user.username}
// }

type Props = { children: React.ReactNode }
const TabsLayout = ({ children }: Props) => {

  return (
    <div className='flex flex-col h-full'>
      <NavigationTabs initTabs={tabsData} persistOrder/>
      <section className='p-5 box-border grow'>
        {children}
      </section>
    </div>
  );
};

export default TabsLayout;