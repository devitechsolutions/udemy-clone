import React from 'react';
import { BookmarkPlus, Download, Share2, MessageCircle } from 'lucide-react';
import { BentoCard } from './BentoCard';

interface QuickActionsCardProps {
  onBookmark?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onDiscussion?: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onBookmark,
  onDownload,
  onShare,
  onDiscussion
}) => {
  const actions = [
    {
      icon: BookmarkPlus,
      label: 'Bookmark',
      color: 'text-orange-600 bg-orange-50 hover:bg-orange-100',
      onClick: onBookmark
    },
    {
      icon: Download,
      label: 'Download',
      color: 'text-green-600 bg-green-50 hover:bg-green-100',
      onClick: onDownload
    },
    {
      icon: Share2,
      label: 'Share',
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
      onClick: onShare
    },
    {
      icon: MessageCircle,
      label: 'Discuss',
      color: 'text-orange-600 bg-orange-50 hover:bg-orange-100',
      onClick: onDiscussion
    }
  ];

  return (
    <BentoCard className="p-3 sm:p-4 lg:p-6 h-full">
      <div className="space-y-3 sm:space-y-4 h-full flex flex-col">
        <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${action.color} flex flex-col items-center justify-center`}
            >
              <action.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mb-1 sm:mb-2" />
              <div className="text-xs sm:text-xs lg:text-sm font-medium">{action.label}</div>
            </button>
          ))}
        </div>
      </div>
    </BentoCard>
  );
};