import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "./breadcrumb";
import { Container } from "./container";
import { ModuleHeader } from "./module-header";

type PageHeaderProps = {
  index: string;
  path: string;
  title: ReactNode;
  lede?: ReactNode;
  breadcrumb?: Crumb[];
  actions?: ReactNode;
  children?: ReactNode;
};

/** Top of every module page: optional breadcrumb, H1 module header, intro slot. */
export function PageHeader({
  index,
  path,
  title,
  lede,
  breadcrumb,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <div className="pt-12 pb-12 md:pt-20 md:pb-16">
      <Container width="wide">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <ModuleHeader
          level={1}
          index={index}
          path={path}
          title={title}
          lede={lede}
          actions={actions}
        />
        {children}
      </Container>
    </div>
  );
}
