import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import ProgressRail from "@/components/ProgressRail";
import StageSection from "@/components/StageSection";
import Footer from "@/components/Footer";
import Figure from "@/components/Figure";

import PipelineDiagram from "@/components/pipeline/PipelineDiagram";
import DatasetDonut from "@/components/charts/DatasetDonut";
import AugmentationGrid from "@/components/charts/AugmentationGrid";
import ThresholdExplorer from "@/components/charts/ThresholdExplorer";
import TrainingCurves from "@/components/charts/TrainingCurves";
import ModelComparisonChart from "@/components/charts/ModelComparisonChart";
import AttentionMapDemo from "@/components/charts/AttentionMapDemo";
import ManifoldScatter from "@/components/charts/ManifoldScatter";
import PerClassChart from "@/components/charts/PerClassChart";
import ConfusionMatrixGrid from "@/components/charts/ConfusionMatrixGrid";
import AblationChart from "@/components/charts/AblationChart";
import Roadmap from "@/components/charts/Roadmap";

import { stages } from "@/data/project";

const byId = Object.fromEntries(stages.map((s) => [s.id, s]));

export default function Home() {
  return (
    <main id="top" className="relative">
      <Nav />
      <ProgressRail />
      <Hero />

      <StageSection stage={byId["introduction"]} />
      <StageSection stage={byId["problem"]} reverse />
      <StageSection
        stage={byId["dataset"]}
        visual={<Figure><DatasetDonut /></Figure>}
      />
      <StageSection
        stage={byId["preprocessing"]}
        reverse
        visual={<Figure><AugmentationGrid /></Figure>}
      />

      <StageSection
        stage={byId["architecture"]}
        visual={<Figure caption="Click any block to inspect that stage of the pipeline."><PipelineDiagram /></Figure>}
      />
      <StageSection
        stage={byId["fisher-attention"]}
        reverse
        visual={<Figure><ThresholdExplorer /></Figure>}
      />
      <StageSection
        stage={byId["curvature-pooling"]}
        visual={<Figure><ManifoldScatter /></Figure>}
      />
      <StageSection
        stage={byId["info-bottleneck"]}
        reverse
        visual={<Figure><TrainingCurves /></Figure>}
      />

      <StageSection
        stage={byId["training"]}
        visual={<Figure><TrainingCurves /></Figure>}
      />
      <StageSection
        stage={byId["validation"]}
        reverse
        visual={<Figure><TrainingCurves /></Figure>}
      />
      <StageSection
        stage={byId["evaluation"]}
        visual={<Figure><ModelComparisonChart /></Figure>}
      />
      <StageSection
        stage={byId["explainability"]}
        reverse
        visual={<Figure><AttentionMapDemo /></Figure>}
      />
      <StageSection
        stage={byId["results"]}
        visual={
          <div className="flex flex-col gap-6">
            <Figure><ConfusionMatrixGrid /></Figure>
            <Figure><PerClassChart /></Figure>
          </div>
        }
      />
      <StageSection
        stage={byId["ablation"]}
        reverse
        visual={<Figure><AblationChart /></Figure>}
      />
      <StageSection
        stage={byId["conclusion"]}
        visual={<Roadmap />}
      />

      <Footer />
    </main>
  );
}
