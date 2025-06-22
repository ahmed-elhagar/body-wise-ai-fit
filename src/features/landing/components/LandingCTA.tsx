import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, Check, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LandingCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-brand-primary-600 via-brand-secondary-600 to-brand-primary-700 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-0 left-1/4 w-64 h-64 lg:w-96 lg:h-96 bg-white/10 rounded-full blur-3xl animate-pulse-soft"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 lg:w-[500px] lg:h-[500px] bg-white/5 rounded-full blur-3xl animate-pulse-soft"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] bg-brand-accent-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-7xl">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 mb-8 shadow-xl">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <span className="text-sm lg:text-base font-semibold text-white">Ready to Transform?</span>
          </div>

          {/* Enhanced Main heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
            Your Fitness Revolution
            <br />
            <span className="text-white/90 bg-gradient-to-r from-white via-brand-accent-200 to-white bg-clip-text text-transparent">Starts Today</span>
          </h2>

          {/* Enhanced Description */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-10 leading-relaxed max-w-4xl mx-auto">
            Join thousands who've already transformed their lives with FitFatta. 
            Your personalized AI coach is waiting for you.
          </p>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-brand-accent-400 fill-current" />
              ))}
            </div>
            <span className="text-white/80 font-medium">4.9/5 from 10,000+ users</span>
          </div>

          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mb-12">
            <Button 
              size="xl" 
              className="group shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white text-brand-primary-700 hover:bg-white/95 hover:scale-105 px-8 py-4 text-lg font-bold"
              onClick={() => navigate('/auth')}
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-md hover:border-white/60 px-8 py-4 text-lg font-semibold"
              onClick={() => {
                // Scroll to top to show the hero section again
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              See Features
            </Button>
          </div>

          {/* Enhanced Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
              <Check className="w-5 h-5 text-brand-accent-400" />
              <span className="text-white/90 font-medium">No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
              <Check className="w-5 h-5 text-brand-accent-400" />
              <span className="text-white/90 font-medium">14-day free trial</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 sm:col-span-3 lg:col-span-1">
              <Check className="w-5 h-5 text-brand-accent-400" />
              <span className="text-white/90 font-medium">Cancel anytime</span>
            </div>
          </div>

          {/* New testimonial snippet */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/20 max-w-2xl mx-auto">
            <div className="flex items-center gap-1 justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-brand-accent-400 fill-current" />
              ))}
            </div>
            <p className="text-white/90 italic text-lg leading-relaxed mb-4">
              "FitFatta transformed my approach to fitness. The AI recommendations are spot-on, and I've never felt more motivated!"
            </p>
            <div className="text-white/70 font-medium">
              Sarah M. - Lost 25 lbs in 3 months
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
