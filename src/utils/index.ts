import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스들을 안전하게 병합하는 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 숫자를 한국어 형식으로 포맷팅 (예: 1000 -> 1,000)
 */
export function formatNumber(num: number | string): string {
  const number = typeof num === "string" ? parseInt(num, 10) : num;
  return new Intl.NumberFormat("ko-KR").format(number);
}

/**
 * 조회수를 읽기 쉬운 형식으로 변환 (예: 1000000 -> 100만)
 */
export function formatViewCount(viewCount: string | number): string {
  const count =
    typeof viewCount === "string" ? parseInt(viewCount, 10) : viewCount;

  if (count >= 100000000) {
    return `${(count / 100000000).toFixed(1)}억`;
  } else if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}천`;
  }

  return count.toString();
}

/**
 * 구독자 수를 읽기 쉬운 형식으로 변환
 */
export function formatSubscriberCount(
  subscriberCount: string | number
): string {
  const count =
    typeof subscriberCount === "string"
      ? parseInt(subscriberCount, 10)
      : subscriberCount;

  if (count >= 100000000) {
    return `${(count / 100000000).toFixed(1)}억명`;
  } else if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만명`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}천명`;
  }

  return `${count}명`;
}

/**
 * 날짜를 상대적 시간으로 변환 (예: 3일 전)
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "오늘";
  } else if (diffInDays === 1) {
    return "어제";
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks}주 전`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months}개월 전`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years}년 전`;
  }
}

/**
 * YouTube URL에서 채널 ID 추출
 */
export function extractChannelId(url: string): string | null {
  const patterns = [
    /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/@([a-zA-Z0-9_-]+)/,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * 입력값 검증 함수들
 */
export const validators = {
  required: (value: string) =>
    value.trim().length > 0 || "필수 입력 항목입니다.",
  minLength: (min: number) => (value: string) =>
    value.length >= min || `최소 ${min}자 이상 입력해주세요.`,
  maxLength: (max: number) => (value: string) =>
    value.length <= max || `최대 ${max}자까지 입력 가능합니다.`,
  number: (value: string) => /^\d+$/.test(value) || "숫자만 입력해주세요.",
  url: (value: string) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return "올바른 URL 형식이 아닙니다.";
    }
  },
};

/**
 * 디바운스 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
