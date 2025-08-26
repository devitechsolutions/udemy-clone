import React from 'react';
import { TrendingUp, Award, Clock, Target } from 'lucide-react';
import { BentoCard } from './BentoCard';
import { Progress } from '../types';

interface ProgressCardProps {
  progress?: Progress;
  totalLessons: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ progress, totalLessons }) => {
  const completedLessons = progress?.completedLessons.length || 0;
  const progressPercentage = progress?.progressPercentage || 0;
  const remainingLessons = totalLessons - completedLessons;

  return (
    <BentoCard className="p-3 sm:p-4 lg:p-6 h-full">
      <div className="space-y-3 sm:space-y-4 h-full flex flex-col">
        
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">Your Progress</h3>
            <p className="text-xs sm:text-xs lg:text-sm text-gray-500">Keep up the great work!</p>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center justify-center flex-1">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                className="text-orange-500 transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">{progressPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
          <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl">
            <div className="text-sm sm:text-base lg:text-lg font-bold text-green-600">{completedLessons}</div>
            <div className="text-xs sm:text-xs lg:text-sm text-green-600 font-medium">Completed</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-orange-50 rounded-lg sm:rounded-xl">
            <div className="text-sm sm:text-base lg:text-lg font-bold text-orange-600">{remainingLessons}</div>
            <div className="text-xs sm:text-xs lg:text-sm text-orange-600 font-medium">Remaining</div>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};