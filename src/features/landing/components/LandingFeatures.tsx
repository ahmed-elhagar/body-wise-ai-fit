import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Utensils, Dumbbell, Target, TrendingUp, Users, Zap, Shield, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export const LandingFeatures = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      iconBg: '#3B82F6',
      title: "AI-Powered Insights",
      description: "Get personalized recommendations based on your unique fitness profile, goals, and progress patterns.",
      bgColor: '#F0F9FF',
      borderColor: '#BFDBFE'
    },
    {
      icon: <Utensils className="w-8 h-8 text-white" />,
      iconBg: '#10B981',
      title: "Smart Nutrition",
      description: "Customized meal plans that adapt to your dietary preferences, cultural background, and nutritional needs.",
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0'
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-white" />,
      iconBg: '#8B5CF6',
      title: "Adaptive Workouts",
      description: "Dynamic exercise programs that evolve with your fitness level, available equipment, and time constraints.",
      bgColor: '#F5F3FF',
      borderColor: '#C4B5FD'
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      iconBg: '#F59E0B',
      title: "Goal Tracking",
      description: "Set, monitor, and achieve your fitness goals with intelligent progress tracking and milestone celebrations.",
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      iconBg: '#EF4444',
      title: "Progress Analytics",
      description: "Comprehensive insights into your fitness journey with detailed analytics and predictive modeling.",
      bgColor: '#FEF2F2',
      borderColor: '#FECACA'
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      iconBg: '#06B6D4',
      title: "Community Support",
      description: "Connect with like-minded individuals, share achievements, and get motivated by community challenges.",
      bgColor: '#ECFEFF',
      borderColor: '#A5F3FC'
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      iconBg: '#EC4899',
      title: "Real-Time Adaptation",
      description: "Your plans automatically adjust based on your performance, schedule changes, and lifestyle factors.",
      bgColor: '#FDF2F8',
      borderColor: '#FBCFE8'
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      iconBg: '#6366F1',
      title: "Privacy & Security",
      description: "Your health data is protected with enterprise-grade security and complete privacy controls.",
      bgColor: '#EEF2FF',
      borderColor: '#C7D2FE'
    }
  ];

  return (
    <section id="features-section" className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-white via-brand-primary-50/30 to-brand-secondary-50/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 lg:w-48 lg:h-48 bg-brand-primary-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 lg:w-56 lg:h-56 bg-brand-secondary-100 rounded-full blur-3xl opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Enhanced Section header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-brand-primary-100 border border-brand-primary-200 rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-5 h-5 text-brand-primary-600" />
            <span className="text-sm lg:text-base font-semibold text-brand-primary-700">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-neutral-800 mb-6 leading-tight">
            Everything You Need for
            <br />
            <span className="bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 bg-clip-text text-transparent">
              Fitness Success
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-brand-neutral-600 max-w-4xl mx-auto leading-relaxed">
            Discover how FitFatta's AI-powered features transform your approach to health and fitness
          </p>
        </div>

        {/* Enhanced Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-md rounded-3xl p-6 lg:p-8 border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 relative overflow-hidden"
              style={{
                borderColor: feature.borderColor,
                backgroundColor: feature.bgColor
              }}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: feature.iconBg }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-brand-neutral-800 mb-3 group-hover:text-brand-primary-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-brand-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* New CTA section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Experience These Features?
            </h3>
            <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already transforming their lives with FitFatta's AI-powered platform.
            </p>
            <Button 
              size="xl" 
              className="bg-white text-brand-primary-700 hover:bg-white/95 font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => navigate('/auth')}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Enhanced Trust metrics */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="text-3xl lg:text-4xl font-bold text-brand-primary-600 mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
            <div className="text-brand-neutral-600 font-medium">Active Users</div>
          </div>
          <div className="group">
            <div className="text-3xl lg:text-4xl font-bold text-brand-secondary-600 mb-2 group-hover:scale-110 transition-transform duration-300">95%</div>
            <div className="text-brand-neutral-600 font-medium">Success Rate</div>
          </div>
          <div className="group">
            <div className="text-3xl lg:text-4xl font-bold text-brand-accent-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-brand-neutral-600 font-medium">AI Support</div>
          </div>
          <div className="group">
            <div className="text-3xl lg:text-4xl font-bold text-brand-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">4.9★</div>
            <div className="text-brand-neutral-600 font-medium">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};
