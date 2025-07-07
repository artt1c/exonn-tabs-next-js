import React from "react";

export type ITab = {
  id: string;
  label: string;
  icon: React.ReactNode | string;
  href: string;
  content: React.ReactNode;
  pinned?: boolean;
};