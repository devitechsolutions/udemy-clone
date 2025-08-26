import React from 'react';
import { Award, Trophy, Target, Zap, Flame, Star, Crown, Medal, BookOpen, Clock } from 'lucide-react';
import { BentoCard } from './BentoCard';

interface AchievementCardProps {
  completedLessons: number;
  totalLessons: number;
  streak?: number;
  totalWatchTime?: number; // in minutes
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ 
  completedLessons, 
  totalLessons,
  streak = 0,
  totalWatchTime = 0
}) => {
  const achievements = [
    {
      id: 'first-lesson',
      icon: Target,
      title: 'First Step',
      description: 'Started your learning journey',
      unlocked: completedLessons >= 1,
      color: 'text-green-600 bg-green-100',
      glowColor: 'shadow-green-200',
      points: 10,
      category: 'milestone'
    },
    {
      id: 'quick-learner',
      icon: Zap,
      title: 'Quick Learner',
      description: 'Completed 3 lessons',
      unlocked: completedLessons >= 3,
      color: 'text-blue-600 bg-blue-100',
      glowColor: 'shadow-blue-200',
      points: 25,
      category: 'progress'
    },
    {
      id: 'dedicated',
      icon: BookOpen,
      title: 'Dedicated Student',
      description: 'Completed 5 lessons',
      unlocked: completedLessons >= 5,
      color: 'text-purple-600 bg-purple-100',
      glowColor: 'shadow-purple-200',
      points: 50,
      category: 'progress'
    },
    {
      id: 'streak-master',
      icon: Flame,
      title: 'On Fire!',
      description: '3-day learning streak',
      unlocked: streak >= 3,
      color: 'text-orange-600 bg-orange-100',
      glowColor: 'shadow-orange-200',
      points: 30,
      category: 'streak'
    },
    {
      id: 'time-master',
      icon: Clock,
      title: 'Time Master',
      description: '2+ hours of learning',
      unlocked: totalWatchTime >= 120,
      color: 'text-indigo-600 bg-indigo-100',
      glowColor: 'shadow-indigo-200',
      points: 40,
      category: 'time'
    },
    {
      id: 'halfway-hero',
      icon: Medal,
      title: 'Halfway Hero',
      description: 'Reached 50% completion',
      unlocked: completedLessons >= Math.ceil(totalLessons / 2),
      color: 'text-yellow-600 bg-yellow-100',
      glowColor: 'shadow-yellow-200',
      points: 75,
      category: 'milestone'
    },
    {
      id: 'almost-there',
      icon: Star,
      title: 'Almost There',
      description: '80% course completion',
      unlocked: completedLessons >= Math.ceil(totalLessons * 0.8),
      color: 'text-pink-600 bg-pink-100',
      glowColor: 'shadow-pink-200',
      points: 100,
      category: 'milestone'
    },
    {
      id: 'course-master',
      icon: Crown,
      title: 'Course Master',
      description: 'Completed the entire course',
      unlocked: completedLessons >= totalLessons,
      color: 'text-amber-600 bg-amber-100',
      glowColor: 'shadow-amber-200',
      points: 200,
      category: 'completion'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
  
  // Calculate progress to next achievement
  const getProgressToNext = () => {
    if (!nextAchievement) return 100;
    
    switch (nextAchievement.id) {
      case 'first-lesson':
        return (completedLessons / 1) * 100;
      case 'quick-learner':
        return (completedLessons / 3) * 100;
      case 'dedicated':
        return (completedLessons / 5) * 100;
      case 'streak-master':
        return (streak / 3) * 100;
      case 'time-master':
        return (totalWatchTime / 120) * 100;
      case 'halfway-hero':
        return (completedLessons / Math.ceil(totalLessons / 2)) * 100;
      case 'almost-there':
        return (completedLessons / Math.ceil(totalLessons * 0.8)) * 100;
      case 'course-master':
        return (completedLessons / totalLessons) * 100;
      default:
        return 0;
    }
  };

  const progressToNext = Math.min(getProgressToNext(), 100);

  return (
    <BentoCard className="p-3 sm:p-4 h-full overflow-hidden">
      <div className="space-y-2 sm:space-y-3 h-full flex flex-col">
        
        {/* Header with Points */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Achievements</h3>
          </div>
          <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-600" />
            <span className="text-xs font-bold text-yellow-700">{totalPoints}</span>
          </div>
        </div>

        {/* Achievement Progress */}
        <div className="flex-1 flex flex-col justify-center space-y-2 sm:space-y-3">
          
          {/* Current Achievement or Next Goal */}
          {nextAchievement ? (
            <div className="space-y-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mx-auto transition-all duration-300 ${
                nextAchievement.unlocked 
                  ? `${nextAchievement.color} ${nextAchievement.glowColor} shadow-lg scale-110` 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <nextAchievement.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  nextAchievement.unlocked ? '' : 'text-gray-400'
                }`} />
              </div>
              
              <div className="text-center space-y-1">
                <div className="text-xs sm:text-sm font-medium text-gray-900">
                  {nextAchievement.title}
                </div>
                <div className="text-xs text-gray-500">
                  {nextAchievement.description}
                </div>
                
                {/* Progress Bar to Next Achievement */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {Math.round(progressToNext)}% complete
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text">
                  Master Achieved!
                </div>
                <div className="text-xs text-gray-500">All achievements unlocked</div>
              </div>
            </div>
          )}
        </div>

        {/* Achievement Counter */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Award className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">Unlocked</span>
          </div>
          <span className="text-xs font-semibold text-gray-700">
            {unlockedAchievements.length}/{achievements.length}
          </span>
        </div>

        {/* Streak Indicator */}
        {streak > 0 && (
          <div className="flex items-center justify-center space-x-1 bg-gradient-to-r from-orange-50 to-red-50 px-2 py-1 rounded-lg">
            <Flame className="w-3 h-3 text-orange-500" />
            <span className="text-xs font-medium text-orange-700">{streak} day streak!</span>
          </div>
        )}
      </div>
    </BentoCard>
  );
};