'use client';
import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Sparkles, ChevronRight, Moon, Shield } from 'lucide-react';

const NavigationBar = ({ activeView, onNavigate }) => {
  const featureCards = [
    { id: 'people-counter', title: 'People Counter', icon: Users, description: 'See real-time occupancy of places & analytics' },
    { id: 'safekeep', title: 'Safekeep', icon: ShieldCheck, description: 'Identify unattended items left by guests' },
    { id: 'cleantrack', title: 'Cleantrack', icon: Sparkles, description: 'Timely Track and alert housekeeping' },
  ];

  return (
    <div className="mb-2">
      <div className="grid grid-cols-3 gap-4">
        {featureCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeView === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className={`relative rounded-lg p-5 overflow-hidden cursor-pointer group ${isActive ? 'border-2 border-active' : ''}`}
            >
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #8BA7FF 14%, #B0C2F9 87%, #BECEFF 100%)'
                    : 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
                  opacity: isActive ? 0.35 : 0.1,
                }}
              ></div>

              <div className="relative mb-3 flex items-center gap-1">
                <span className="text-muted text-xs">smart</span>
                <Shield className="w-3 h-3 text-muted" />
              </div>

              <div className="relative flex items-start justify-between pl-8">
                <div className="flex items-start gap-3 flex-1">
                  <div className="bg-foreground/10 rounded-lg p-2">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground font-semibold text-[17px] mb-1">{card.title}</h3>
                    <p className="text-muted text-[11px] leading-relaxed max-w-40">{card.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted shrink-0 ml-2" />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-muted text-xs mt-4">Smart features | Powered by AI</p>
    </div>
  );
};

export default NavigationBar;
