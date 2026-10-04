import { ModuleHeader } from "@/components/layout/module-header";
import { Section } from "@/components/layout/section";
import { SystemGraph } from "@/components/viz/graph/system-graph";
import { graphs } from "@/content/graphs";

export function EngineeringDna() {
  return (
    <Section width="wide" aria-labelledby="dna-title">
      <ModuleHeader
        index="02"
        path="/engineering#dna"
        title="Engineering DNA"
        id="dna-title"
        lede="Five principles that shape how I build. Select one to see what it means in practice and which principles it reinforces."
      />
      <SystemGraph graph={graphs.dna} aspectRatio={16 / 10} routing="straight" arrows={false} />
    </Section>
  );
}
