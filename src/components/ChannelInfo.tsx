import React from "react";
import { Users, Eye, Video, Calendar, ExternalLink } from "lucide-react";
import { YouTubeChannel } from "../services/youtubeApi";

interface ChannelInfoProps {
  channel: YouTubeChannel | null;
  isLoading: boolean;
}

const ChannelInfo: React.FC<ChannelInfoProps> = ({ channel, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!channel) {
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-start gap-4 mb-6">
        <img
          src={channel.thumbnailUrl}
          alt={channel.title}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {channel.title}
          </h2>
          {channel.customUrl && (
            <a
              href={`https://youtube.com/${channel.customUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              {channel.customUrl}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Users className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-600">구독자</span>
          </div>
          <div className="text-lg font-bold text-red-600">
            {formatNumber(channel.subscriberCount)}
          </div>
        </div>

        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">총 조회수</span>
          </div>
          <div className="text-lg font-bold text-blue-600">
            {formatNumber(channel.viewCount)}
          </div>
        </div>

        <div className="text-center p-3 bg-green-50 rounded-xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Video className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">영상 수</span>
          </div>
          <div className="text-lg font-bold text-green-600">
            {formatNumber(channel.videoCount)}
          </div>
        </div>

        <div className="text-center p-3 bg-purple-50 rounded-xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-600">가입일</span>
          </div>
          <div className="text-sm font-bold text-purple-600">
            {formatDate(channel.publishedAt)}
          </div>
        </div>
      </div>

      {/* 채널 설명 */}
      {channel.description && (
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            채널 소개
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {channel.description.length > 200
              ? `${channel.description.substring(0, 200)}...`
              : channel.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChannelInfo;
