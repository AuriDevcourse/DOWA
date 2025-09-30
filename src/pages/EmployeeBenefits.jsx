import React from "react";
import { Gift, Heart, Plane, GraduationCap, Coffee, Zap, Shield, TrendingUp } from "lucide-react";

export default function EmployeeBenefits() {
  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance coverage for you and your family",
      items: [
        "Medical, dental, and vision insurance",
        "Mental health support",
        "Gym membership reimbursement",
        "Annual health check-ups"
      ],
      color: "red"
    },
    {
      icon: Plane,
      title: "Time Off",
      description: "Work-life balance is important to us",
      items: [
        "25 days paid vacation",
        "10 public holidays",
        "Sick leave policy",
        "Parental leave"
      ],
      color: "blue"
    },
    {
      icon: GraduationCap,
      title: "Learning & Development",
      description: "Invest in your professional growth",
      items: [
        "Annual learning budget",
        "Conference attendance",
        "Online course subscriptions",
        "Mentorship programs"
      ],
      color: "purple"
    },
    {
      icon: Coffee,
      title: "Office Perks",
      description: "Make your work environment comfortable",
      items: [
        "Free snacks and beverages",
        "Modern office equipment",
        "Standing desks available",
        "Casual dress code"
      ],
      color: "orange"
    },
    {
      icon: Zap,
      title: "Flexible Working",
      description: "Work in a way that suits you best",
      items: [
        "Hybrid work model",
        "Flexible hours",
        "Remote work options",
        "Work from anywhere policy"
      ],
      color: "green"
    },
    {
      icon: Shield,
      title: "Financial Benefits",
      description: "Secure your financial future",
      items: [
        "Competitive salary",
        "Performance bonuses",
        "Pension plan",
        "Stock options"
      ],
      color: "yellow"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Advance your career with us",
      items: [
        "Clear career paths",
        "Regular performance reviews",
        "Internal mobility",
        "Leadership development"
      ],
      color: "indigo"
    },
    {
      icon: Gift,
      title: "Additional Perks",
      description: "Extra benefits to make you smile",
      items: [
        "Team building events",
        "Birthday celebrations",
        "Employee referral bonus",
        "Discount programs"
      ],
      color: "pink"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: "border-red-500/30 hover:border-red-500/50",
      blue: "border-blue-500/30 hover:border-blue-500/50",
      purple: "border-purple-500/30 hover:border-purple-500/50",
      orange: "border-orange-500/30 hover:border-orange-500/50",
      green: "border-green-500/30 hover:border-green-500/50",
      yellow: "border-yellow-500/30 hover:border-yellow-500/50",
      indigo: "border-indigo-500/30 hover:border-indigo-500/50",
      pink: "border-pink-500/30 hover:border-pink-500/50"
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClasses = (color) => {
    const colors = {
      red: "text-red-400",
      blue: "text-blue-400",
      purple: "text-purple-400",
      orange: "text-orange-400",
      green: "text-green-400",
      yellow: "text-yellow-400",
      indigo: "text-indigo-400",
      pink: "text-pink-400"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gift className="w-10 h-10 text-pink-400" />
              <h1 className="text-4xl font-bold text-glass">Employee Benefits</h1>
            </div>
            <p className="text-glass-subtle text-lg">
              We care about our team members and their well-being
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`glass-card rounded-2xl p-6 border-2 ${getColorClasses(benefit.color)} transition-all duration-300 hover:transform hover:scale-105`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`glass-morphism rounded-xl p-3 ${getIconColorClasses(benefit.color)}`}>
                  <benefit.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-white/70">{benefit.description}</p>
                </div>
              </div>
              
              <ul className="space-y-2">
                {benefit.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-white/80 text-sm flex items-start gap-2">
                    <span className={`mt-1 ${getIconColorClasses(benefit.color)}`}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="glass-card rounded-3xl p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Questions About Benefits?
          </h2>
          <p className="text-glass-muted mb-6">
            Reach out to HR for more information about our employee benefits package
          </p>
          <button className="glass-morphism px-6 py-3 rounded-full text-white font-medium hover:opacity-80 transition-all duration-300 flex items-center gap-2 mx-auto">
            <Heart className="w-5 h-5" />
            Contact HR Team
          </button>
        </div>

      </div>
    </div>
  );
}
