# 채용 과제

## Prerequisites

아래 환경에서 개발되었습니다.

- Bun v1.2.8
- Node.js v20.19.0

## Getting Started

### 1. Repository Clone

```
git clone https://github.com/sjhong98/realteeth-exercise
cd realteeth-exercise
```

### 2. Install Dependencies

```
bun install
```

### 3. Environment Variables

프로젝트 루트 경로에 `.env.local` 파일을 생성하고 아래 값을 설정합니다.

```
VITE_OPENWEATHER_API_KEY=53b3f12562e7cefd2446a68c7dd85ca2
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc2tna2RzdXdjZGlxeXRjdmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjQ2NjIsImV4cCI6MjA3NTI0MDY2Mn0.LdXjhkOUAyKuFhuaPt2nZHhNvkYhtzpRn3dP2Papc5s
```

### 4. Run Development Server

```
bun dev
```

브라우저에서 아래 주소로 접속합니다.

```
http://localhost:5173
```

<br />

# 구현한 기능에 대한 설명

## Features

### 1. 위치 검색

- 위치 입력 시, 검색어가 포함된 지역 리스트를 표시합니다.
    - 주어진 korea_district 파일을 이용하였습니다.
    - debounce를 적용하여 입력 종료 200ms 후에 필터링하도록 구현하였습니다.
    - 검색 결과 없을 경우 '검색 결과가 없습니다' 표시
- 검색 결과에서 원하는 지역을 선택하면 해당 지역 페이지로 이동합니다.
    - useNavigate과 useParams 사용하여 새로고침 없이 URL params를 상태 변수처럼 사용

### 2. 날씨 정보 표시

- 선택된 지역의 날씨 정보를 표시합니다.
    - vWorld 디지털 트윈 국토에서 제공하는 Geocoder 2.0 API 사용하여 주소 → 좌표 변환
    - openWeatherMap API의 One Call 3.0 API 사용하여 좌표의 날씨 데이터 패치
    - 데이터 로딩 중 UI 및 응답값 없을 경우 검색 결과 없음 UI 표시
    - Tanstack Query 5분 간격으로 캐싱, 주기적 리패칭 동작하도록 설정
    - 표시 항목: 현재 날씨 / 최고·최저 기온 / 시간대별 날씨 (24시간)
- 지역 미선택 시, 현재 위치 확인 권한을 요청하고 현재 지역의 날씨 정보를 표시합니다.
    - 좌표로 날씨 데이터 패치
    - 좌표 → 주소 역변환하여 현재 좌표의 지역명 표시
    - 권한 미승인 시 날씨 패널 미표시

### 3. 즐겨찾기

- 원하는 지역을 즐겨찾기에 추가할 수 있습니다.
    - 지역 선택 후 상단의 북마크 버튼으로 즐겨찾기 상태를 Toggle 할 수 있습니다.
    - 최대 6개 지역까지 추가가 가능합니다.
    - 즐겨찾기 데이터는 LocalStorage에 저장됩니다.
- 지역 별칭을 설정할 수 있습니다.
    - 지역 선택 - 즐겨찾기 추가 시, 장소 별칭 입력창이 표시됩니다.
    - 입력창에 입력 후 저장 시 별칭이 업데이트 됩니다.
- 즐겨찾기된 지역별 현재 날씨를 표시합니다.
    - 지역명 / 별칭 / 현재 날씨 / 최저 · 최고 기온
    - 지역 클릭 시 해당 페이지로 이동

<br />

# 기술적 의사결정 및 이유

## 1. FSD 아키텍처 적용

FSD 아키텍처를 처음 접하면서 가장 어려웠던 것은 Layer 별로 역할과 경계를 구분하는 일이었습니다. 이에 공식 문서를 포함한 많은 레퍼런스들을 참고하며 제 나름의 정의를 해내고자 하였습니다.

### app

프로젝트를 전역으로 감싸는 요소들 (router/provider 등)

- providers/QueryProvider.tsx
- router.tsx 등

### pages

URL 구조와 동일하게 구성. UI 구성 위주, 최소한의 로직.

### widgets

도메인 경계가 약한 상태에서 entity/feature 조합한 완성형 use-case.

- bookmark-location-panel: 즐겨찾기된 지역들의 날씨 패치하여 표시
- weather-display-panel: 선택된 날씨 표시 및 북마크 관련 기능 제공

### features

도메인 내에서 짧은 흐름의 use-case 단위로 쪼갠 단위.

유저 인터랙션, 동사, 행동을 담당.

- manage-location-bookmark: 북마크 토글, 별칭 업데이트 등 북마크 관련 use-case
- search-location: 지역 검색어 입력, 검색 결과 표시 등 지역 검색 관련 use-case

### entities

도메인 내에서 변하지 않는 interface 단위.

가리키는 대상들, 명사, 개념을 담당

- location-bookmark: 북마크된 데이터 관련 비즈니스 모델
- weather: 날씨 데이터 관련 비즈니스 모델

### shared

전역에서 사용될 수 있는 요소들

### 1-1. Feature와 Entity의 경계 정하기

처음 FSD 아키텍처를 접했을 때는 feature와 entity를 단순히 '동사와 명사', 혹은 단방향 의존성 상위/하위 레이어로 인식했습니다.

이후 더 많은 레퍼런스를 찾아보며 두 레이어 간 차이를 보다 명확하게 인식할 수 있었습니다. 그 중에서 이 관계를 가장 명확하게 나타낼 수 있는 방법은 feature → use-case, entity → 비즈니스 모델이라는 개념이었습니다.

feature는 도메인(slice) 내 영역에서 짧은 단위의 use-case, 즉 연결된 맥락의 행위 단위로 분리하고 재사용이 가능하도록 구성하였습니다. entity는 도메인 내에서 비즈니스 모델을 표시하기 위한 interface 단위로 분리하였습니다. 

이를 프로젝트에 적용하여 각각 다음과 같이 구성하였습니다.

**feature**

```
features/
├── manage-location-bookmark/
│   ├── 북마크와 북마크된 지역들의 별칭 관련 인터렉션을 다룹니다.
│   ├── model/
│   │   └── useUpdateBookmark.tsx
│   │       └── 북마크, 별칭의 인터렉션 기반 CUD use-case를 다룹니다.
│   └── ui/
│       ├── BookmarkToggleButton.tsx
│       │   └── 북마크 on-off라는 use-case를 다룹니다.
│       └── WeatherTitleUpdateForm.tsx
│           └── 별칭 업데이트라는 use-case를 다룹니다.
└── search-location/
    ├── 장소 검색이라는 인터렉션을 다룹니다.
    ├── model/
    │   ├── useCurrentDistrict.ts
    │   │   └── 현재 위치 기반 주소 찾기라는 use-case를 다룹니다.
    │   └── useSearchLocation.ts
    │       └── 지역 선택 이벤트라는 use-case를 다룹니다.
    └── ui/
        └── SearchLocationForm.tsx
            └── '검색어 입력→결과 표시→지역 선택'이라는 use-case를 다룹니다.
```

**entity**

```
entities/
├── location/
│   ├── 좌표 ↔ 주소 데이터라는 비즈니스 모델을 다룹니다.
│   └── api/
│       └── locationApi.ts
│           └── API 통신을 통해 데이터를 가져옵니다.
├── location-bookmark/
│   ├── 북마크된 지역 리스트 데이터라는 비즈니스 모델을 다룹니다.
│   ├── model/
│   │   ├── bookmarkContext.tsx
│   │   └── useBookmark.tsx
│   │       └── 데이터를 조회하고 전역 상태로 다룹니다.
│   └── ui/
│       └── LocationBookmarkCard.tsx
│           └── 데이터를 표시할 UI interface를 다룹니다.
└── weather/
    ├── '지역별 날씨 데이터'라는 비즈니스 모델을 다룹니다.
    ├── api/
    │   └── weatherApi.ts
    │       └── API 통신을 통해 데이터를 가져옵니다.
    ├── model/
    │   └── useWeather.tsx
    │       └── tanstack query를 통해 데이터를 관리합니다.
    └── ui/
        ├── CurrentLocationInfo.tsx
        ├── CurrentWeatherInfo.tsx
        ├── HourlyWeatherList.tsx
        └── ... (데이터를 표시할 UI interface들)
```

### 1-2. feature/entity와 widget의 경계 정하기

feature, entity를 각 성격에 맞게 정리하자, widget의 성격 역시 보다 명확하게 이해할 수 있었습니다. feature이 도메인에 한정된 짧은 단위의 use-case라고 한다면, widget은 도메인에 한정되지 않은 완성된 use-case라고 이해하였습니다. 

즉, 다른 도메인에 접근할 수 없었고 재사용성을 염두에 둔 feature와 entity와 달리, 여러 도메인의 feature와 entity을 결합할 수 있는 단계이자, 재사용성이 매우 낮은 결합체가 widget이라고 보았습니다.

따라서 다음과 같이 widget을 구성하였습니다.

**widgets**

```
widgets/
├── bookmark-location-panel/
│   ├── 즐겨찾기 된 지역들을 표시 + 각 지역의 날씨 표시
│   ├── model/
│   │   └── useBookmarkLocationWeather.ts
│   └── ui/
│       └── BookmarkLocationPanel.tsx
└── weather-display-panel/
    ├── 선택된 지역의 날씨 표시 + 즐겨찾기 toggle 버튼 + 즐겨찾기 별칭 관리
    └── ui/
        └── WeatherDisplayPanel.tsx
```

### 1-3. Public API 패턴

FSD 아키텍처의 목적이 유지보수성을 향상하고 파일을 찾기 쉽게 만드는데 있으며, 공식 문서에서도 public API 패턴을 제안하고 있었기 때문에, Public API 패턴을 적용했습니다. index 파일을 두고 해당 레벨의 파일들의 출입구 역할을 하도록 함으로써 외부에서 import 시에 내부 구조를 알 필요가 없고, segment 단위로 명시하지 않아도 되도록 구조화하였습니다.

**feature**

- manage-location-bookmark
    - model/index: model 내부 파일 전체를 export
    - ui/index: ui 내부 파일 전체를 export
    - index: segment 전체를 export

**사용**

```typescript
import { useBookmarkLocationWeather } from "@/widgets/bookmark-location-panel"
```

## 2. Supabase Edge Function 이용한 Proxy

openWeatherMap의 geocoding API 이용하여 주소 → 좌표 변환을 시도했으나, 한글 검색으로는 결과가 부정확하다는 판단 하에 다른 api를 탐색하였습니다. 카카오, 네이버, vWorld 등 좌표 변환 open api를 찾았고, 이 중에서 권한 신청 등의 절차가 최소화되어 있는 vWorld 디지털 트윈 국토 api를 채택하였습니다.

해당 API 연동 과정에서, openWeatherMap API와 달리, 브라우저에서 호출 시에 CORS 정책 미허용으로 인한 요청 차단 문제가 발생하였습니다.

이에 server-to-server 통신을 위해 API를 구현하되, 별도 서버 구축이 필요 없는 Supabase Edge Function을 선택하였고, client - Edge Function - vWorld 단계로 CORS 정책의 영향을 받지 않고 API를 활용할 수 있도록 구현하였습니다.

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ...

Deno.serve(async (req: Request) => {
  // ...

  try {
    const { type = 'coordinate', city, x, y }: ReqPayload = await req.json();

    const url = `https://api.vworld.kr/req/address?service=address&request=${type === 'coordinate' ? 'getCoord' : 'getAddress'}&key=758C373B-E98F-3173-851E-D94FB8579E02&type=PARCEL&${type === 'coordinate' ? `address=${encodeURIComponent(city)}` : `point=${x},${y}`}`;
    const res = await fetch(url);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
```

## 3. Tanstack Query 날씨 데이터 패칭 전략

### 3-1. 캐싱과 리패칭

본 프로젝트는 날씨라는 실시간성 데이터를 핵심 도메인으로 다루는 서비스로, 

- 사용자가 체감할 수 있는 실시간성
- 불필요한 네트워크 요청을 줄이고 UX를 개선하는 성능 효율

이 두 가지 요소 사이의 트레이드오프를 고려한 데이터 패칭 전략이 필요했습니다. 

### gcTime

5분간 캐시를 유지하도록 함으로써, 짧은 시간 내에 동일 지역을 재조회할 경우 즉각적인 결과를 반환하도록 했습니다.

### refetchInterval

사용자가 날씨 페이지를 계속 열어두고 있는 경우, 일정 주기로 날씨 데이터가 갱신된다면 실시간성을 향상할 수 있을 것이라고 판단했습니다. 이에 수동 새로고침 없이도 5분 주기로 날씨 데이터를 갱신하도록 설정했습니다.

이를 통해 네트워크 요청 수를 제한하여 성능을 최적화하면서도, 체감 가능한 실시간성을 확보하고자 했습니다.

### 3-2. 병렬 API 콜

또, API 호출 1회당 1곳의 날씨 데이터만 가져올 수 있었기 때문에, 최대 7번의 API 콜을 한 번에 수행해야하는 케이스가 있었습니다. 

이에 최대한 수행 시간을 줄이고자, useQueries를 사용하여 각각의 queryFn들이 병렬로 실행되도록 구현하였습니다.

## 4. Tailwind CSS breakpoint prefix 이용한 반응형 구현

본 프로젝트는 데스크탑과 모바일 환경을 모두 지원하는 반응형 UI가 요구되었고, 이에 tailwind CSS breakpoint prefix를 이용했습니다. 
lg: prefix를 사용하여, 1024px을 기준으로 데스크탑 UI와 모바일 UI를 구분하였습니다.

기술 선택 이유는 다음과 같습니다.

### 1. 코드 간결성

추가적인 분기 로직이 필요한 useMediaQuery 방식이나, CSS media query 방식에 비해 'lg:'라는 짧은 접두어로 구현이 가능하므로, 코드 간결성이 높습니다.

또한 별도 위치나 파일을 찾을 필요 없이, 클래스 레벨에서 구현되므로 가독성이 향상됩니다.

### 2. 성능 최적화

useMediaQuery와 같은 JS 로직을 통해 분기되는 UI가 버벅임 등 성능 문제가 있는데 비해, CSS 레벨에서 실행되는 tailwind는 성능 상 이점이 있었습니다.

### 3. 환경 간 UI의 갭이 크지 않음

구상한 디자인의 데스크탑 UI와 모바일 UI 간의 갭이 크지 않았습니다.

레이아웃이 다르거나, 많은 요소가 다를 경우에는 오히려 가독성과 코드 복잡도를 높일 수 있지만, 충분히 구현 가능한 정도의 갭이라 판단했습니다.

## 5. LocalStorage 활용

본 프로젝트는 회원 가입이나 로그인 기능이 없는 구조로, 사용자별 데이터를 계정 단위로 서버에 저장할 수 없는 환경이었기에, 즐겨찾기 지역 리스트 데이터를 로컬 스토리지에 저장했습니다.

<br />

# 사용한 기술 스택

## 핵심 프레임워크 & 언어

- React
- Typescript

## 빌드 도구 & 개발 환경

- vite
- Cursor IDE

## 상태 관리 & 데이터 페칭

- @tanstack/react-query
- Axios
- Context API

## 라우팅

- React-router-dom

## 스타일링

- Tailwind CSS
- Material UI (icon)

## 유틸리티 라이브러리

- Dayjs
