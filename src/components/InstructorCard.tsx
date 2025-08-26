import React from 'react';
import { Star, Users, Award } from 'lucide-react';
import { BentoCard } from './BentoCard';

interface InstructorCardProps {
  instructor: {
    name: string;
    avatar: string;
    rating: number;
    studentsCount: number;
  };
}

export const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  return (
    <BentoCard className="p-3 sm:p-4 lg:p-6 h-full">
      <div className="space-y-3 sm:space-y-4 h-full flex flex-col">
        
        {/* Header */}
        <div className="flex items-center space-x-3">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">{instructor.name}</h3>
            <p className="text-xs sm:text-xs lg:text-sm text-gray-500">Course Instructor</p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 sm:space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Rating</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-900">{instructor.rating}/5</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Students</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-900">
              {instructor.studentsCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm lg:text-base font-medium rounded-lg sm:rounded-xl transition-colors">
          View Profile
        </button>
      </div>
    </BentoCard>
  );
};