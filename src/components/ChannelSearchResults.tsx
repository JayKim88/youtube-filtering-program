import React from "react";
import { Users, Video, Check } from "lucide-react";
import { YouTubeChannel } from "../services/youtubeApi";

interface ChannelSearchResultsProps {
  channels: YouTubeChannel[];
  onSelectChannel: (channel: YouTubeChannel) => void;
  selectedChannelId?: string;
  isLoading: boolean;
}

const ChannelSearchResults: React.FC<ChannelSearchResultsProps> = ({
  channels,
  onSelectChannel,
  selectedChannelId,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (channels.length === 0) {
    return null;
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">검색된 채널들</h3>
      <div className="space-y-3">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
              selectedChannelId === channel.id
                ? "border-red-500 bg-red-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
            onClick={() => onSelectChannel(channel)}
          >
            <img
              src={channel.thumbnailUrl}
              alt={channel.title}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 truncate">
                  {channel.title}
                </h4>
                {selectedChannelId === channel.id && (
                  <Check className="w-4 h-4 text-red-500" />
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{formatNumber(channel.subscriberCount)} 구독자</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  <span>{formatNumber(channel.videoCount)} 영상</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectChannel(channel);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedChannelId === channel.id
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {selectedChannelId === channel.id ? "선택됨" : "선택"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelSearchResults;
