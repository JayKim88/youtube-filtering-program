import React, { useState, useCallback } from "react";
import { Search, Filter, YoutubeIcon, ExternalLink } from "lucide-react";
import { useYouTubeStore } from "../stores/youtubeStore";
import { useDebounce } from "../hooks/useDebounce";
import { extractChannelId } from "../utils";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ChannelInfo from "./ChannelInfo";
import ChannelSearchResults from "./ChannelSearchResults";
import type { YouTubeChannel } from "../types";

// 검색 옵션들
const SORT_OPTIONS = [
  { value: "date", label: "업로드 날짜" },
  { value: "viewCount", label: "조회수" },
  { value: "rating", label: "평점" },
  { value: "relevance", label: "관련성" },
];

const VIDEO_LENGTH_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "short", label: "4분 미만" },
  { value: "medium", label: "4-20분" },
  { value: "long", label: "20분 이상" },
];

const RESULT_COUNT_OPTIONS = [
  { value: "10", label: "10개" },
  { value: "25", label: "25개" },
  { value: "50", label: "50개" },
  { value: "100", label: "100개" },
];

const FilterForm: React.FC = () => {
  const {
    filters,
    setFilters,
    searchVideos,
    searchChannels,
    selectChannel,
    clearChannelSelection,
    status,
    channels,
    selectedChannel,
  } = useYouTubeStore();

  const [channelInput, setChannelInput] = useState("");
  const [channelError, setChannelError] = useState<string | null>(null);
  const [isLoadingChannel, setIsLoadingChannel] = useState(false);
  const [searchMode, setSearchMode] = useState<"general" | "channel">(
    "general"
  );

  // 디바운스된 채널 검색
  const debouncedChannelSearch = useDebounce(channelInput, 500);

  // 채널 검색 처리
  const handleChannelSearch = useCallback(async () => {
    if (!channelInput.trim()) {
      setChannelError("채널명, URL 또는 ID를 입력해주세요.");
      return;
    }

    setIsLoadingChannel(true);
    setChannelError(null);

    try {
      // URL이나 ID인지 확인
      const channelId = extractChannelId(channelInput);
      if (channelId) {
        // 직접 채널 ID로 검색
        await searchChannels(channelId);
      } else {
        // 키워드로 채널 검색
        await searchChannels(channelInput);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "채널 검색 중 오류가 발생했습니다.";
      setChannelError(errorMessage);
    } finally {
      setIsLoadingChannel(false);
    }
  }, [channelInput, searchChannels]);

  // 채널 선택 처리
  const handleSelectChannel = useCallback(
    (channel: YouTubeChannel) => {
      selectChannel(channel);
      setChannelInput("");
      setChannelError(null);
      setSearchMode("channel");
    },
    [selectChannel]
  );

  // 채널 초기화
  const clearChannel = useCallback(() => {
    setChannelInput("");
    setChannelError(null);
    clearChannelSelection();
    setSearchMode("general");
  }, [clearChannelSelection]);

  // 필터 변경 처리
  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      setFilters({ [key]: value });
    },
    [setFilters]
  );

  // 검색 실행
  const handleSearch = useCallback(() => {
    searchVideos(searchMode);
  }, [searchVideos, searchMode]);

  // 검색 모드 변경
  const handleSearchModeChange = useCallback(
    (mode: "general" | "channel") => {
      setSearchMode(mode);
      if (mode === "general") {
        clearChannelSelection();
      }
    },
    [clearChannelSelection]
  );

  // 디바운스된 채널 검색 실행
  React.useEffect(() => {
    if (debouncedChannelSearch && debouncedChannelSearch.length > 2) {
      searchChannels(debouncedChannelSearch);
    }
  }, [debouncedChannelSearch, searchChannels]);

  return (
    <div className="space-y-8">
      {/* 채널 검색 섹션 */}
      <section className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
            <YoutubeIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">채널 검색</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <YoutubeIcon className="w-4 h-4" />
              채널명, URL 또는 ID
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={channelInput}
                onChange={setChannelInput}
                placeholder="예: '김철수' 또는 'https://youtube.com/@channelname'"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleChannelSearch();
                  }
                }}
              />
              <Button
                onClick={handleChannelSearch}
                disabled={isLoadingChannel || !channelInput.trim()}
                loading={isLoadingChannel}
                className="min-w-fit"
              >
                채널 검색
              </Button>
              {selectedChannel && (
                <Button variant="secondary" onClick={clearChannel}>
                  초기화
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              채널명, youtube.com/channel/ID, youtube.com/@username, @username,
              직접 채널 ID 모두 지원
            </p>
          </div>

          {channelError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700">
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">{channelError}</span>
              </div>
            </div>
          )}

          {channels.length > 0 && !selectedChannel && (
            <ChannelSearchResults
              channels={channels}
              onSelectChannel={handleSelectChannel}
              selectedChannelId={filters.channelId}
              isLoading={isLoadingChannel}
            />
          )}

          {selectedChannel && (
            <ChannelInfo
              channel={selectedChannel}
              isLoading={isLoadingChannel}
            />
          )}
        </div>
      </section>

      {/* 검색 필터 섹션 */}
      <section className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
            <Filter className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">검색 필터 설정</h2>
        </div>

        {/* 검색 모드 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            검색 모드
          </label>
          <div className="flex gap-2">
            <Button
              variant={searchMode === "general" ? "primary" : "outline"}
              onClick={() => handleSearchModeChange("general")}
              size="sm"
            >
              일반 검색
            </Button>
            <Button
              variant={searchMode === "channel" ? "primary" : "outline"}
              onClick={() => handleSearchModeChange("channel")}
              size="sm"
              disabled={!selectedChannel}
            >
              채널 내 검색
            </Button>
          </div>
          {searchMode === "channel" && selectedChannel && (
            <p className="text-sm text-gray-600 mt-2">
              선택된 채널:{" "}
              <span className="font-medium">{selectedChannel.title}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 검색 키워드 */}
          <div className="lg:col-span-2">
            <Input
              label="검색 키워드"
              value={filters.keyword}
              onChange={(value) => handleFilterChange("keyword", value)}
              placeholder={
                searchMode === "channel"
                  ? "채널 내에서 검색할 키워드"
                  : "검색하고 싶은 키워드를 입력하세요"
              }
              required
            />
            {searchMode === "channel" &&
              selectedChannel &&
              filters.channelId && (
                <p className="mt-2 text-sm text-gray-500">
                  현재 '
                  <span className="font-semibold text-red-600">
                    {selectedChannel.title}
                  </span>
                  ' 채널 내에서 검색 중입니다. 일반 검색을 원하시면 위의 '일반
                  검색' 버튼을 클릭해주세요.
                </p>
              )}
          </div>

          {/* 최소 조회수 */}
          <div>
            <Input
              label="최소 조회수"
              type="number"
              value={filters.minViews}
              onChange={(value) => handleFilterChange("minViews", value)}
              placeholder="100000"
            />
          </div>

          {/* 최대 구독자 수 */}
          <div>
            <Input
              label="최대 구독자 수"
              type="number"
              value={filters.maxSubscribers}
              onChange={(value) => handleFilterChange("maxSubscribers", value)}
              placeholder="1000000"
            />
          </div>

          {/* 정렬 기준 */}
          <div>
            <Select
              label="정렬 기준"
              options={SORT_OPTIONS}
              value={filters.sortBy}
              onChange={(value) => handleFilterChange("sortBy", value)}
            />
          </div>

          {/* 영상 길이 */}
          <div>
            <Select
              label="영상 길이"
              options={VIDEO_LENGTH_OPTIONS}
              value={filters.videoLength}
              onChange={(value) => handleFilterChange("videoLength", value)}
            />
          </div>

          {/* 검색 결과 개수 */}
          <div>
            <Select
              label="검색 결과 개수"
              options={RESULT_COUNT_OPTIONS}
              value={filters.resultCount}
              onChange={(value) => handleFilterChange("resultCount", value)}
            />
          </div>
        </div>

        {/* 검색 버튼 */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSearch}
            loading={status === "loading"}
            disabled={status === "loading"}
            size="lg"
          >
            <Search className="w-5 h-5 mr-2" />
            {searchMode === "channel" ? "채널 내 검색" : "영상 검색"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FilterForm;
