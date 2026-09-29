import React from 'react';
import { Hero, HeroProps } from './components/hero';
import FeaturesSection from './components/FeaturesSection';
import Cards from './components/cards'; // 1. Cambiado a PascalCase

export interface HomePageProps extends HeroProps { }

export const HomePage: React.FC<HomePageProps> = (props) => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Hero {...props} />
      <Cards {...props} />
      <FeaturesSection />
    </div>
  );
};

export const Home = HomePage;
export default HomePage;