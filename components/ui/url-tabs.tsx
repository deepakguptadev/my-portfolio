"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

export type UrlTab = { value: string; label: string; content: ReactNode };

type UrlTabsProps = {
  /** Query parameter that holds the active tab, e.g. "module". */
  param: string;
  tabs: UrlTab[];
  label: string;
  listClassName?: string;
};

function TabsView({
  tabs,
  label,
  value,
  onChange,
  listClassName,
}: Omit<UrlTabsProps, "param"> & { value: string; onChange?: (value: string) => void }) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList aria-label={label} className={listClassName}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="pt-8">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function SyncedTabs({ param, tabs, ...rest }: UrlTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const requested = params.get(param);
  const value = tabs.some((tab) => tab.value === requested) ? requested! : tabs[0].value;

  function onChange(next: string) {
    const query = new URLSearchParams(params);
    if (next === tabs[0].value) query.delete(param);
    else query.set(param, next);
    const search = query.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  return <TabsView tabs={tabs} value={value} onChange={onChange} {...rest} />;
}

/**
 * Tabs whose active value lives in the query string (shareable, back-button
 * friendly). Prerendered with the first tab; the URL takes over on the client.
 */
export function UrlTabs(props: UrlTabsProps) {
  return (
    <Suspense fallback={<TabsView {...props} value={props.tabs[0].value} />}>
      <SyncedTabs {...props} />
    </Suspense>
  );
}
