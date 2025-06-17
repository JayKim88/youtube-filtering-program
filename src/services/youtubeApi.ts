const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  thumbnailUrl: string;
  viewCount: number;
  publishedAt: string;
  duration: string;
  subscriberCount: number;
  description: string;
  url: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  publishedAt: string;
  customUrl?: string;
}

export interface SearchFilters {
  keyword: string;
  maxSubscribers: string;
  minViews: string;
  sortBy: string;
  videoLength: string;
  resultCount: string;
  channelId?: string;
}

// ISO 8601 duration을 초로 변환
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  return hours * 3600 + minutes * 60 + seconds;
}

// 초를 MM:SS 형식으로 변환
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// 채널 URL에서 채널 ID 추출
export function extractChannelId(input: string): string | null {
  // 다양한 채널 URL 형식 지원
  const patterns = [
    /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/@([a-zA-Z0-9_-]+)/,
    /youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
    /^([a-zA-Z0-9_-]{24})$/, // 직접 채널 ID 입력
    /^@([a-zA-Z0-9_-]+)$/, // @username 형식
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// 채널 정보 가져오기 (구독자 수 포함) - 여러 채널용
async function getChannelStats(
  channelIds: string[]
): Promise<Record<string, number>> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API 키가 설정되지 않았습니다.");
    return {};
  }

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/channels?part=statistics&id=${channelIds.join(
        ","
      )}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`채널 정보 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    const channelStats: Record<string, number> = {};

    data.items?.forEach((channel: any) => {
      channelStats[channel.id] = parseInt(
        channel.statistics?.subscriberCount || "0"
      );
    });

    return channelStats;
  } catch (error) {
    console.error("채널 정보 가져오기 실패:", error);
    return {};
  }
}

// 채널 정보 가져오기
export async function getChannelInfo(
  channelId: string
): Promise<YouTubeChannel | null> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YouTube API 키가 설정되지 않았습니다.");
  }

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`채널 정보 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const channel = data.items[0];
    const snippet = channel.snippet;
    const statistics = channel.statistics;

    return {
      id: channel.id,
      title: snippet.title,
      description: snippet.description,
      thumbnailUrl:
        snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || "",
      subscriberCount: parseInt(statistics?.subscriberCount || "0"),
      viewCount: parseInt(statistics?.viewCount || "0"),
      videoCount: parseInt(statistics?.videoCount || "0"),
      publishedAt: snippet.publishedAt,
      customUrl: snippet.customUrl,
    };
  } catch (error) {
    console.error("채널 정보 가져오기 실패:", error);
    throw error;
  }
}

// 채널별 영상 검색
export async function searchChannelVideos(
  channelId: string,
  filters: SearchFilters
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YouTube API 키가 설정되지 않았습니다.");
  }

  try {
    // 채널별 검색 API 호출
    const searchParams = new URLSearchParams({
      part: "snippet",
      channelId: channelId,
      type: "video",
      maxResults: Math.min(parseInt(filters.resultCount), 50).toString(),
      order:
        filters.sortBy === "date"
          ? "date"
          : filters.sortBy === "viewCount"
          ? "viewCount"
          : filters.sortBy === "relevance"
          ? "relevance"
          : "rating",
      key: YOUTUBE_API_KEY,
      regionCode: "KR",
      relevanceLanguage: "ko",
    });

    // 키워드가 있으면 추가
    if (filters.keyword.trim()) {
      searchParams.append("q", filters.keyword);
    }

    // 비디오 길이 필터 추가
    if (filters.videoLength === "short") {
      searchParams.append("videoDuration", "short");
    } else if (filters.videoLength === "long") {
      searchParams.append("videoDuration", "medium");
    }

    const searchResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?${searchParams}`
    );

    if (!searchResponse.ok) {
      throw new Error(`채널 검색 요청 실패: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    // 비디오 ID 추출
    const videoIds = searchData.items.map((item: any) => item.id.videoId);

    // 비디오 상세 정보 가져오기
    const videoDetails = await getVideoDetails(videoIds);

    // 채널 정보 가져오기 (구독자 수용)
    const channelStats = await getChannelStats([channelId]);

    // 데이터 조합 및 필터링
    const videos: YouTubeVideo[] = searchData.items
      .map((item: any) => {
        const videoId = item.id.videoId;
        const channelId = item.snippet.channelId;
        const details = videoDetails[videoId] || {};
        const viewCount = details.viewCount || 0;
        const durationSeconds = parseDuration(details.duration || "PT0S");

        return {
          id: videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          channelId: item.snippet.channelId,
          thumbnailUrl:
            item.snippet.thumbnails?.high?.url ||
            item.snippet.thumbnails?.default?.url ||
            "",
          viewCount: viewCount,
          publishedAt: item.snippet.publishedAt,
          duration: formatDuration(durationSeconds),
          subscriberCount: channelStats[channelId] || 0,
          description: item.snippet.description || "",
          url: `https://www.youtube.com/watch?v=${videoId}`,
        };
      })
      .filter((video: YouTubeVideo) => {
        // 최소 조회수 필터
        if (filters.minViews && video.viewCount < parseInt(filters.minViews)) {
          return false;
        }

        // 최대 구독자 수 필터
        if (
          filters.maxSubscribers &&
          video.subscriberCount > parseInt(filters.maxSubscribers)
        ) {
          return false;
        }

        // 비디오 길이 필터
        if (filters.videoLength !== "all") {
          const durationSeconds = parseDuration(
            videoDetails[video.id]?.duration || "PT0S"
          );
          if (filters.videoLength === "short" && durationSeconds >= 240) {
            // 4분 이상
            return false;
          }
          if (filters.videoLength === "long" && durationSeconds < 240) {
            // 4분 미만
            return false;
          }
        }

        return true;
      });

    return videos;
  } catch (error) {
    console.error("채널 영상 검색 실패:", error);
    throw error;
  }
}

// 비디오 상세 정보 가져오기
async function getVideoDetails(
  videoIds: string[]
): Promise<Record<string, any>> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API 키가 설정되지 않았습니다.");
    return {};
  }

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds.join(
        ","
      )}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`비디오 상세 정보 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    const videoDetails: Record<string, any> = {};

    data.items?.forEach((video: any) => {
      videoDetails[video.id] = {
        duration: video.contentDetails?.duration || "PT0S",
        viewCount: parseInt(video.statistics?.viewCount || "0"),
      };
    });

    return videoDetails;
  } catch (error) {
    console.error("비디오 상세 정보 가져오기 실패:", error);
    return {};
  }
}

export async function searchYouTubeVideos(
  filters: SearchFilters
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error(
      "YouTube API 키가 설정되지 않았습니다. .env 파일에 VITE_YOUTUBE_API_KEY를 추가해주세요."
    );
  }

  if (!filters.keyword.trim()) {
    throw new Error("검색 키워드를 입력해주세요.");
  }

  try {
    const searchParams = new URLSearchParams({
      part: "snippet",
      type: "video",
      maxResults: Math.min(parseInt(filters.resultCount), 50).toString(),
      order:
        filters.sortBy === "date"
          ? "date"
          : filters.sortBy === "viewCount"
          ? "viewCount"
          : filters.sortBy === "relevance"
          ? "relevance"
          : "rating",
      key: YOUTUBE_API_KEY,
      regionCode: "KR",
      relevanceLanguage: "ko",
    });

    if (filters.keyword.trim()) {
      searchParams.append("q", filters.keyword);
    }

    if (filters.videoLength === "short") {
      searchParams.append("videoDuration", "short");
    } else if (filters.videoLength === "medium") {
      searchParams.append("videoDuration", "medium");
    } else if (filters.videoLength === "long") {
      searchParams.append("videoDuration", "long");
    }

    const searchResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?${searchParams}`
    );

    if (!searchResponse.ok) {
      throw new Error(`YouTube 검색 요청 실패: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId);
    const channelIds = Array.from(
      new Set(
        searchData.items.map((item: any) => item.snippet.channelId as string)
      )
    ) as string[];

    const videoDetails = await getVideoDetails(videoIds);
    const channelStats = await getChannelStats(channelIds);

    const videos: YouTubeVideo[] = searchData.items
      .map((item: any) => {
        const videoId = item.id.videoId;
        const channelId = item.snippet.channelId;
        const details = videoDetails[videoId] || {};
        const viewCount = details.viewCount || 0;
        const durationSeconds = parseDuration(details.duration || "PT0S");

        return {
          id: videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          channelId: item.snippet.channelId,
          thumbnailUrl:
            item.snippet.thumbnails?.high?.url ||
            item.snippet.thumbnails?.default?.url ||
            "",
          viewCount: viewCount,
          publishedAt: item.snippet.publishedAt,
          duration: formatDuration(durationSeconds),
          subscriberCount: channelStats[channelId] || 0,
          description: item.snippet.description || "",
          url: `https://www.youtube.com/watch?v=${videoId}`,
        };
      })
      .filter((video: YouTubeVideo) => {
        // 최소 조회수 필터
        if (filters.minViews && video.viewCount < parseInt(filters.minViews)) {
          return false;
        }

        // 최대 구독자 수 필터
        if (
          filters.maxSubscribers &&
          video.subscriberCount > parseInt(filters.maxSubscribers)
        ) {
          return false;
        }

        // 비디오 길이 필터 (추가 검증)
        if (filters.videoLength !== "all") {
          const durationSeconds = parseDuration(
            videoDetails[video.id]?.duration || "PT0S"
          );
          if (filters.videoLength === "short" && durationSeconds >= 240) {
            return false;
          }
          if (filters.videoLength === "long" && durationSeconds < 240) {
            return false;
          }
        }

        return true;
      });

    return videos;
  } catch (error) {
    console.error("YouTube API 호출 실패:", error);
    throw error;
  }
}

// 채널명으로 채널 검색 (한국어 지원 개선)
export async function searchChannelsByKeyword(
  keyword: string
): Promise<YouTubeChannel[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YouTube API 키가 설정되지 않았습니다.");
  }

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&q=${encodeURIComponent(
        keyword
      )}&type=channel&maxResults=10&regionCode=KR&relevanceLanguage=ko&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`채널 검색 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // 채널 ID들 추출
    const channelIds: string[] = [];
    data.items.forEach((item: any) => {
      if (item.id?.channelId) {
        channelIds.push(item.id.channelId);
      }
    });

    // 채널 상세 정보 가져오기
    const channels: YouTubeChannel[] = [];

    for (const channelId of channelIds) {
      try {
        const channel = await getChannelInfo(channelId);
        if (channel) {
          channels.push(channel);
        }
      } catch (error) {
        console.error(`채널 ${channelId} 정보 가져오기 실패:`, error);
      }
    }

    return channels;
  } catch (error) {
    console.error("채널 검색 실패:", error);
    throw error;
  }
}

// 입력이 채널명인지 URL/ID인지 판단
export function isChannelUrlOrId(input: string): boolean {
  return extractChannelId(input) !== null;
}
