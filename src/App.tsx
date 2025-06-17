import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { YoutubeIcon, Sparkles } from "lucide-react";
import FilterForm from "./components/FilterForm";
import SearchResults from "./components/SearchResults";
import { useYouTubeStore } from "./stores/youtubeStore";

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// API 키 알림 컴포넌트
const ApiKeyNotice: React.FC = () => {
  if (import.meta.env.VITE_YOUTUBE_API_KEY) return null;

  return (
    <section
      className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8"
      role="alert"
      aria-labelledby="api-key-notice-title"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-yellow-500 p-2 rounded-lg">
          <YoutubeIcon className="w-5 h-5 text-white" />
        </div>
        <h3
          id="api-key-notice-title"
          className="text-lg font-bold text-yellow-800"
        >
          YouTube API 키 설정 필요
        </h3>
      </div>
      <p className="text-yellow-700 mb-4">
        실제 YouTube 데이터를 사용하려면 YouTube Data API v3 키가 필요합니다.
      </p>
      <div className="bg-white rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold mb-2">설정 방법:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              Google Cloud Console
            </a>
            에서 프로젝트 생성
          </li>
          <li>YouTube Data API v3 활성화</li>
          <li>API 키 생성</li>
          <li>
            프로젝트 루트에{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">.env</code> 파일
            생성
          </li>
          <li>
            <code className="bg-gray-100 px-2 py-1 rounded">
              VITE_YOUTUBE_API_KEY=your_api_key_here
            </code>{" "}
            추가
          </li>
        </ol>
      </div>
    </section>
  );
};

// 에러 메시지 컴포넌트
const ErrorMessage: React.FC<{ error: string }> = ({ error }) => (
  <section
    className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
    role="alert"
    aria-labelledby="error-message-title"
  >
    <div className="flex items-center gap-3">
      <div className="bg-red-500 p-2 rounded-lg">
        <YoutubeIcon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 id="error-message-title" className="text-lg font-bold text-red-800">
          오류 발생
        </h3>
        <p className="text-red-700">{error}</p>
      </div>
    </div>
  </section>
);

// 로딩 상태 컴포넌트
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
    <span className="ml-3 text-gray-600">검색 중...</span>
  </div>
);

// 메인 앱 컴포넌트
const AppContent: React.FC = () => {
  const { status, error } = useYouTubeStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-2xl">
              <YoutubeIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              YouTube 필터링 프로그램
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            실제 YouTube Data API를 사용하여 원하는 조건으로 유튜브 영상을
            검색하고, 특정 채널의 영상도 찾아보세요.
          </p>
        </header>

        {/* API Key Notice */}
        <ApiKeyNotice />

        {/* Error Message */}
        {error && <ErrorMessage error={error} />}

        {/* Filter Form */}
        <FilterForm />

        {/* Loading State */}
        {status === "loading" && <LoadingSpinner />}

        {/* Search Results */}
        <SearchResults />
      </div>
    </div>
  );
};

// 루트 앱 컴포넌트
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
