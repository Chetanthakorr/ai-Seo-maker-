import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ModuleContainer } from './components/ModuleContainer';
import { ModuleType } from './types';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.CONTENT_GAP);

  const renderModule = () => {
    switch (activeModule) {
      case ModuleType.CONTENT_GAP:
        return (
          <ModuleContainer
            module={ModuleType.CONTENT_GAP}
            title="AI Content Gap Analyzer"
            description="Identify missed opportunities by comparing your site against a competitor. Uncover high-value keywords you are missing."
            inputs={[
              { name: 'myUrl', label: 'Your Website URL', placeholder: 'https://example.com', type: 'url' },
              { name: 'competitorUrl', label: 'Competitor URL', placeholder: 'https://competitor.com', type: 'url' }
            ]}
          />
        );
      case ModuleType.TECHNICAL_AUDIT:
        return (
          <ModuleContainer
            module={ModuleType.TECHNICAL_AUDIT}
            title="SEO Health Doctor"
            description="Perform a comprehensive technical SEO audit. Enter a URL for analysis using Google Search data."
            inputs={[
              { name: 'url', label: 'Website URL to Audit', placeholder: 'https://example.com', type: 'url' }
            ]}
          />
        );
      case ModuleType.SERP_PLANNER:
        return (
          <ModuleContainer
            module={ModuleType.SERP_PLANNER}
            title="AI SERP Domination Planner"
            description="Generate a 3-6 month strategic plan to dominate search results for your niche."
            inputs={[
              { name: 'goal', label: 'Niche or Main Goal', placeholder: 'e.g. "Best Vegan Shoes" or "SaaS CRM Software"', type: 'text' }
            ]}
          />
        );
      case ModuleType.KEYWORD_CLUSTER:
        return (
          <ModuleContainer
            module={ModuleType.KEYWORD_CLUSTER}
            title="AI Keyword Cluster Generator"
            description="Turn a seed topic into organized keyword clusters with search intent and difficulty estimates."
            inputs={[
              { name: 'topic', label: 'Seed Topic or Keywords', placeholder: 'e.g. "Digital Marketing" or "Home Renovation"', type: 'text' }
            ]}
          />
        );
      case ModuleType.LOCAL_SEO:
        return (
          <ModuleContainer
            module={ModuleType.LOCAL_SEO}
            title="AI Local SEO Booster"
            description="Optimize for local search. Get GMB strategies, local keywords, and citation plans."
            inputs={[
              { name: 'city', label: 'Target City', placeholder: 'e.g. "Austin, TX"', type: 'text' },
              { name: 'businessType', label: 'Business Type', placeholder: 'e.g. "Plumber" or "Coffee Shop"', type: 'text' }
            ]}
          />
        );
      case ModuleType.COMPETITOR_ANALYSIS:
        return (
          <ModuleContainer
            module={ModuleType.COMPETITOR_ANALYSIS}
            title="Competitor Reverse Engineering"
            description="Deep dive into a competitor's strategy. Understand their content, backlinks, and weaknesses."
            inputs={[
              { name: 'competitorUrl', label: 'Competitor URL', placeholder: 'https://competitor.com', type: 'url' }
            ]}
          />
        );
      default:
        return <div>Select a module</div>;
    }
  };

  return (
    <Layout activeModule={activeModule} onModuleChange={setActiveModule}>
      {renderModule()}
    </Layout>
  );
};

export default App;
