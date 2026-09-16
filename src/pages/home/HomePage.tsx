import React from 'react';
import { Hero, HeroProps } from './components/hero';
import FeaturesSection from './components/FeaturesSection';

export interface HomePageProps extends HeroProps { }

export const HomePage: React.FC<HomePageProps> = (props) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <Hero {...props} />
      <FeaturesSection />

    </div>
  );
};

export const Home = HomePage;
export default HomePage;
