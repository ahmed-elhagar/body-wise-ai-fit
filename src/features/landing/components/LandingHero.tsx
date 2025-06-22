import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, Heart, Users, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary-50 via-white to-brand-secondary-50 overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 lg:w-48 lg:h-48 bg-brand-primary-200 rounded-full blur-3xl opacity-30 animate-pulse-soft"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 lg:w-56 lg:h-56 bg-brand-secondary-200 rounded-full blur-3xl opacity-30 animate-pulse-soft"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 lg:w-[600px] lg:h-[600px] bg-brand-accent-100 rounded-full blur-3xl opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-7xl">
        {/* Enhanced Badge */}
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-brand-primary-200 rounded-full px-6 py-3 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <Sparkles className="w-5 h-5 text-brand-primary-600 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-sm lg:text-base font-semibold text-brand-primary-700">AI-Powered Fitness Revolution</span>
        </div>

        {/* Enhanced Main heading with better responsive typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-primary-700 bg-clip-text text-transparent">
            Transform Your
          </span>
          <br />
          <span className="text-brand-neutral-800">Fitness Journey</span>
        </h1>

        {/* Enhanced Subtitle with better spacing */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-brand-neutral-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
          Meet FitFatta, your AI-powered companion for personalized nutrition, smart workouts, and sustainable health goals that adapt to your lifestyle.
        </p>

        {/* Enhanced Feature highlights with better responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-brand-primary-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Target className="w-6 h-6 text-brand-primary-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-brand-neutral-700 font-semibold">Smart Goal Tracking</span>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-brand-secondary-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Heart className="w-6 h-6 text-brand-secondary-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-brand-neutral-700 font-semibold">Personalized Nutrition</span>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-brand-accent-100 shadow-lg hover:shadow-xl transition-all duration-300 group sm:col-span-2 lg:col-span-1">
            <Sparkles className="w-6 h-6 text-brand-accent-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-brand-neutral-700 font-semibold">AI-Generated Workouts</span>
          </div>
        </div>

        {/* Enhanced CTA buttons with better responsive layout */}
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mb-16">
          <Button 
            size="xl" 
            className="group shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white px-8 py-4 text-lg font-semibold"
            onClick={() => navigate('/auth')}
          >
            Start Your Free Journey
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button 
            variant="outline" 
            size="xl"
            className="bg-white/90 backdrop-blur-md hover:bg-white border-2 border-brand-primary-200 hover:border-brand-primary-300 text-brand-primary-700 px-8 py-4 text-lg font-semibold"
            onClick={() => {
              // Scroll to features section first
              const featuresSection = document.querySelector('#features-section');
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/auth');
              }
            }}
          >
            Learn More
          </Button>
        </div>

        {/* Enhanced Stats with better visual hierarchy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="text-3xl lg:text-4xl font-bold text-brand-primary-600 mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
            <div className="text-brand-neutral-600 font-medium">Active Users</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl lg:text-4xl font-bold text-brand-secondary-600 mb-2 group-hover:scale-110 transition-transform duration-300">95%</div>
            <div className="text-brand-neutral-600 font-medium">Success Rate</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl lg:text-4xl font-bold text-brand-accent-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-brand-neutral-600 font-medium">AI Support</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl lg:text-4xl font-bold text-brand-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">4.9★</div>
            <div className="text-brand-neutral-600 font-medium">User Rating</div>
          </div>
        </div>

        {/* New Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-primary-600" />
            <span className="text-sm font-medium text-brand-neutral-700">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-secondary-600" />
            <span className="text-sm font-medium text-brand-neutral-700">Trusted by Professionals</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-accent-600" />
            <span className="text-sm font-medium text-brand-neutral-700">Proven Results</span>
          </div>
        </div>
      </div>
    </section>
  );
};
