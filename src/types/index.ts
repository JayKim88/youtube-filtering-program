// YouTube API 관련 타입들
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  viewCount: number;
  duration: string;
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

// 검색 필터 타입
export interface SearchFilters {
  keyword: string;
  maxSubscribers: string;
  minViews: string;
  sortBy: "date" | "viewCount" | "rating" | "relevance";
  videoLength: "short" | "medium" | "long" | "all";
  resultCount: string;
  channelId: string;
}

// API 응답 상태 타입
export type ApiStatus = "idle" | "loading" | "success" | "error";

// 컴포넌트 Props 타입들
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export interface InputProps extends BaseComponentProps {
  type?: "text" | "email" | "password" | "number" | "search";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  id?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  id?: string;
}
