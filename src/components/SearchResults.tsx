import React from "react";
import { Search, AlertCircle } from "lucide-react";
import { useYouTubeStore } from "../stores/youtubeStore";
import VideoCard from "./VideoCard";

const SearchResults: React.FC = () => {
  const { videos, status } = useYouTubeStore();

  if (status === "loading") {
    return (
      <section className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600 text-lg">
          실제 YouTube 데이터를 검색 중입니다...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          YouTube API를 통해 최신 영상 정보를 가져오고 있습니다.
        </p>
      </section>
    );
  }

  if (status === "idle") {
    return (
      <section className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          실제 YouTube 검색을 시작해보세요
        </h3>
        <p className="text-gray-600">
          위의 필터를 설정하고 검색 버튼을 누르면 실제 YouTube 영상 결과가
          표시됩니다.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          YouTube Data API v3를 사용하여 실시간 데이터를 제공합니다.
        </p>
      </section>
    );
  }

  if (status === "success" && videos.length === 0) {
    return (
      <section className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-gray-600">다른 검색어나 필터 조건을 시도해보세요.</p>
        <p className="text-gray-500 text-sm mt-2">
          필터 조건을 완화하거나 다른 키워드로 검색해보세요.
        </p>
      </section>
    );
  }

  if (status === "success" && videos.length > 0) {
    return (
      <div className="space-y-6 pt-4">
        <section className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              실제 YouTube 검색 결과 ({videos.length}개)
            </h3>
          </div>
          <p className="text-gray-600">
            YouTube Data API를 통해 실시간으로 가져온 영상들입니다. 썸네일을
            클릭하거나 "영상 보기" 버튼을 눌러 유튜브에서 시청하세요.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SearchResults;
