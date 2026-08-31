import React from 'react';
import Layout from '../components/Layout/Layout';
import TeamGoalsSection from '../components/TeamGoals/TeamGoalsSection';

const TeamGoals: React.FC = () => {
  return (
    <Layout 
      title="Team Goals"
      subtitle="Set and track individual and team monthly goals"
    >
      <TeamGoalsSection />
    </Layout>
  );
};

export default TeamGoals;