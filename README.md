# YouTube 필터링 프로그램

실제 YouTube Data API를 사용하여 원하는 조건으로 유튜브 영상을 검색하고, 특정 채널의 영상도 찾아보는 React 애플리케이션입니다. <b>Bolt 와 Cursor</b> 를 이용하여 작성되었습니다.
![YouTube Filtering Program Screenshot](src/assets/images/image1.png)
![YouTube Filtering Program Screenshot](src/assets/images/image2.png)
![YouTube Filtering Program Screenshot](src/assets/images/image3.png)
![YouTube Filtering Program Screenshot](src/assets/images/image4.png)

## 🚀 주요 기능

- **실시간 YouTube 검색**: YouTube Data API v3를 통한 실시간 영상 검색
- **고급 필터링**: 조회수, 구독자 수, 영상 길이, 정렬 기준 등 다양한 필터 지원
- **채널 검색**: 채널명, URL, ID로 채널을 찾고 해당 채널의 영상 검색
- **반응형 디자인**: 모바일부터 데스크톱까지 모든 디바이스 지원
- **접근성**: WCAG 가이드라인을 준수한 접근성 구현

## 🛠 기술 스택

- **Frontend**: React 18, TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 YouTube API 키를 설정하세요:

```env
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

### 5. 테스트 실행

```bash
# 모든 테스트 실행
npm test

# 테스트 UI 실행
npm run test:ui

# 커버리지 리포트 생성
npm run test:coverage
```

## 🏗 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── ui/             # 재사용 가능한 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── FilterForm.tsx  # 검색 필터 폼
│   ├── SearchResults.tsx # 검색 결과 표시
│   ├── VideoCard.tsx   # 영상 카드 컴포넌트
│   └── ChannelInfo.tsx # 채널 정보 컴포넌트
├── hooks/              # 커스텀 훅
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── stores/             # Zustand 스토어
│   └── youtubeStore.ts
├── services/           # API 서비스
│   └── youtubeApi.ts
├── types/              # TypeScript 타입 정의
│   └── index.ts
├── utils/              # 유틸리티 함수
│   └── index.ts
└── test/               # 테스트 설정
    └── setup.ts
```

## 🎯 주요 컴포넌트

### FilterForm

- 검색 키워드 입력
- 고급 필터 설정 (조회수, 구독자 수, 영상 길이 등)
- 채널 검색 및 선택
- 실시간 검색 결과 표시

### SearchResults

- 검색 결과 목록 표시
- 로딩, 에러, 빈 결과 상태 처리
- 반응형 그리드 레이아웃

### VideoCard

- 영상 정보 표시 (제목, 채널, 조회수, 업로드 날짜)
- 썸네일 다운로드 기능
- YouTube 링크로 이동
- 접근성 지원 (키보드 네비게이션)

## 🔧 개발 가이드라인

### 코드 품질

- TypeScript 엄격 모드 사용
- ESLint 규칙 준수
- 컴포넌트별 테스트 작성
- 접근성 속성 (aria-\*) 사용

### 상태 관리

- 클라이언트 상태: Zustand
- 서버 상태: TanStack Query
- 상태는 명확히 구분: `idle / loading / error / success`

### 스타일링

- TailwindCSS 사용
- 반응형 디자인 기본
- 일관된 색상 및 간격 시스템

### 테스트

- React Testing Library 사용
- 사용자 중심 테스트 작성
- 주요 기능 및 엣지 케이스 커버

## 🧪 테스트

```bash
# 단위 테스트 실행
npm test

# 특정 파일 테스트
npm test Button.test.tsx

# 커버리지 리포트
npm run test:coverage
```

## 📱 반응형 디자인

- **모바일**: 1열 레이아웃
- **태블릿**: 2열 레이아웃
- **데스크톱**: 3열 레이아웃

## ♿ 접근성

- Semantic HTML 사용
- ARIA 속성 적용
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 색상 대비 준수

## 🔒 보안

- API 키는 환경 변수로 관리
- CORS 정책 준수
- 입력값 검증 및 sanitization

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m \\\'Add some AmazingFeature\\\'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

# YouTube Filtering Program

This is a React application that allows you to search for YouTube videos based on various criteria and find videos from specific channels, utilizing the real YouTube Data API. It was developed using **Bolt and Cursor**.

## 🚀 Key Features

- **Real-time YouTube Search**: Live video search via YouTube Data API v3
- **Advanced Filtering**: Supports various filters like view count, subscriber count, video length, and sort order
- **Channel Search**: Find channels by name, URL, or ID, and search for videos within those channels
- **Responsive Design**: Supports all devices from mobile to desktop
- **Accessibility**: Implemented with WCAG guidelines for improved accessibility

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📦 Installation & Usage

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root and set your YouTube API key:

```env
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

### 5. Run Tests

```bash
# Run all tests
npm test

# Run test UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🏗 Project Structure

```
src/
├── components/          # React Components
│   ├── ui/             # Reusable UI Components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── FilterForm.tsx  # Search Filter Form
│   ├── SearchResults.tsx # Display Search Results
│   ├── VideoCard.tsx   # Video Card Component
│   └── ChannelInfo.tsx # Channel Information Component
├── hooks/              # Custom Hooks
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── stores/             # Zustand Store
│   └── youtubeStore.ts
├── services/           # API Services
│   └── youtubeApi.ts
├── types/              # TypeScript Type Definitions
│   └── index.ts
├── utils/              # Utility Functions
│   └── index.ts
└── test/               # Test Configuration
    └── setup.ts
```

## 🎯 Core Components

### FilterForm

- Keyword input for video search
- Advanced filter settings (view count, subscriber count, video length, etc.)
- Channel search and selection
- Displays real-time search results

### SearchResults

- Displays a list of search results
- Handles loading, error, and empty result states
- Responsive grid layout

### VideoCard

- Displays video information (title, channel, view count, upload date)
- Thumbnail download feature
- Link to YouTube video
- Accessibility support (keyboard navigation)

## 🔧 Development Guidelines

### Code Quality

- Strict TypeScript mode usage
- Adherence to ESLint rules
- Component-specific test writing
- Usage of accessibility attributes (aria-\*)

### State Management

- Client state: Zustand
- Server state: TanStack Query
- Clearly distinguishes states: `idle / loading / error / success`

### Styling

- Uses TailwindCSS
- Responsive design by default
- Consistent color and spacing system

### Testing

- Uses React Testing Library
- Writes user-centric tests
- Covers key features and edge cases

## 🧪 Testing

```bash
# Run unit tests
npm test

# Test specific file
npm test Button.test.tsx

# Coverage report
npm run test:coverage
```

## 📱 Responsive Design

- **Mobile**: Single column layout
- **Tablet**: Two-column layout
- **Desktop**: Three-column layout

## ♿ Accessibility

- Uses Semantic HTML
- Applies ARIA attributes
- Supports keyboard navigation
- Screen reader compatibility
- Adheres to color contrast guidelines

## 🔒 Security

- Manages API keys via environment variables
- Adheres to CORS policies
- Input validation and sanitization

## 📄 License

MIT License

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3.  Commit your Changes (\`git commit -m \\\'Add some AmazingFeature\\\'\`)
4.  Push to the Branch (\`git push origin feature/AmazingFeature\`)
5.  Open a Pull Request

## 📞 Contact

If you have any questions about the project, please create an issue.
