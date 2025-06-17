import React, { useCallback } from "react";
import { ExternalLink, Download, Calendar, Eye, User } from "lucide-react";
import { formatViewCount, formatRelativeTime } from "../utils";
import Button from "./ui/Button";
import type { YouTubeVideo } from "../types";

interface VideoCardProps {
  video: YouTubeVideo;
}

const VideoCard: React.FC<VideoCardProps> = React.memo(({ video }) => {
  const handleDownloadThumbnail = useCallback(async () => {
    try {
      // CORS 문제를 피하기 위해 프록시 서버를 사용
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        video.thumbnailUrl
      )}`;

      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error("썸네일 다운로드 실패");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${video.title
        .substring(0, 50)
        .replace(/[^a-zA-Z0-9가-힣\s]/g, "")}_thumbnail.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("썸네일 다운로드 실패:", error);
      // 대안: 새 탭에서 이미지 열기
      window.open(video.thumbnailUrl, "_blank");
    }
  }, [video.thumbnailUrl, video.title]);

  const handleVideoClick = useCallback(() => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank");
  }, [video.id]);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src =
        "https://images.pexels.com/photos/4022088/pexels-photo-4022088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
      console.error("Failed to load thumbnail:", video.thumbnailUrl);
    },
    [video.thumbnailUrl]
  );

  return (
    <article className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="relative group">
        <img
          src={video.thumbnailUrl}
          alt={`${video.title} 썸네일`}
          className="w-full h-48 object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-3">
            <Button
              onClick={handleVideoClick}
              variant="primary"
              size="sm"
              className="rounded-full p-3"
              aria-label="유튜브에서 보기"
            >
              <ExternalLink className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleDownloadThumbnail}
              variant="secondary"
              size="sm"
              className="rounded-full p-3"
              aria-label="썸네일 다운로드"
            >
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-medium">
          {video.duration}
        </div>
      </div>

      <div className="p-6">
        <h3
          className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 hover:text-red-600 transition-colors cursor-pointer"
          onClick={handleVideoClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleVideoClick();
            }
          }}
        >
          {video.title}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-medium truncate">
              {video.channelTitle}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span>조회수 {formatViewCount(video.viewCount)}회</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>{formatRelativeTime(video.publishedAt)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleVideoClick}
            variant="primary"
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            영상 보기
          </Button>
          <Button onClick={handleDownloadThumbnail} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            썸네일
          </Button>
        </div>
      </div>
    </article>
  );
});

export default VideoCard;
