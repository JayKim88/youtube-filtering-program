import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  searchYouTubeVideos,
  searchChannelVideos,
  searchChannelsByKeyword,
  type YouTubeVideo,
  type YouTubeChannel,
} from "../services/youtubeApi";
import type { SearchFilters, ApiStatus } from "../types";

interface YouTubeState {
  // 상태
  videos: YouTubeVideo[];
  channels: YouTubeChannel[];
  selectedChannel: YouTubeChannel | null;
  filters: SearchFilters;
  status: ApiStatus;
  error: string | null;

  // 액션
  setFilters: (filters: Partial<SearchFilters>) => void;
  searchVideos: (searchMode?: "general" | "channel") => Promise<void>;
  searchChannels: (query: string) => Promise<void>;
  selectChannel: (channel: YouTubeChannel) => void;
  clearChannelSelection: () => void;
  clearResults: () => void;
  setError: (error: string | null) => void;
}

const initialFilters: SearchFilters = {
  keyword: "",
  maxSubscribers: "",
  minViews: "100000",
  sortBy: "date",
  videoLength: "all",
  resultCount: "50",
  channelId: "",
};

export const useYouTubeStore = create<YouTubeState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      videos: [],
      channels: [],
      selectedChannel: null,
      filters: initialFilters,
      status: "idle",
      error: null,

      // 액션들
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      searchVideos: async (searchMode = "general") => {
        const { filters, selectedChannel } = get();

        // 검색 모드에 따라 채널 ID 설정
        let searchFilters = { ...filters };

        if (searchMode === "general") {
          // 일반 검색 모드: 채널 ID 제거
          searchFilters.channelId = "";
          set({ selectedChannel: null });
        } else if (searchMode === "channel" && selectedChannel) {
          // 채널 검색 모드: 선택된 채널 ID 사용
          searchFilters.channelId = selectedChannel.id;
        }

        if (!searchFilters.keyword.trim() && !searchFilters.channelId) {
          set({
            error: "검색 키워드 또는 채널을 입력해주세요.",
            status: "error",
          });
          return;
        }

        set({ status: "loading", error: null });

        try {
          let results: YouTubeVideo[];

          if (searchFilters.channelId) {
            results = await searchChannelVideos(
              searchFilters.channelId,
              searchFilters
            );
          } else {
            results = await searchYouTubeVideos(searchFilters);
          }

          set({
            videos: results,
            status: "success",
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "검색 중 오류가 발생했습니다.";

          set({
            videos: [],
            status: "error",
            error: errorMessage,
          });
        }
      },

      searchChannels: async (query: string) => {
        if (!query.trim()) {
          set({ channels: [] });
          return;
        }

        set({ status: "loading", error: null });

        try {
          const results = await searchChannelsByKeyword(query);
          set({
            channels: results,
            videos: [],
            selectedChannel: null,
            status: "success",
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "채널 검색 중 오류가 발생했습니다.";

          set({
            channels: [],
            status: "error",
            error: errorMessage,
          });
        }
      },

      selectChannel: async (channel: YouTubeChannel) => {
        set({ selectedChannel: channel });

        // 채널이 선택되면 자동으로 해당 채널의 영상을 검색
        const { filters } = get();
        const updatedFilters = { ...filters, channelId: channel.id };

        set({ filters: updatedFilters });

        // 채널 영상 검색
        set({ status: "loading", error: null });

        try {
          const results = await searchChannelVideos(channel.id, updatedFilters);
          set({
            videos: results,
            status: "success",
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "채널 검색 중 오류가 발생했습니다.";

          set({
            videos: [],
            status: "error",
            error: errorMessage,
          });
        }
      },

      clearChannelSelection: () => {
        set((state) => ({
          selectedChannel: null,
          filters: { ...state.filters, channelId: "" },
        }));
      },

      clearResults: () => {
        set({
          videos: [],
          channels: [],
          selectedChannel: null,
          status: "idle",
          error: null,
        });
      },

      setError: (error) => {
        set({ error, status: error ? "error" : "idle" });
      },
    }),
    {
      name: "youtube-store",
    }
  )
);
