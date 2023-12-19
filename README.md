# AskDoc - 분석과정 흐름 구현

## 목차

In the project directory, you can run:

## 실행방법

```bash
# 실행 방법

초기 설정
> yarn install

리액트 실행
> yarn start

스켈레톤 UI 노출 시
> window.receiveMessage({cmd: 'analyzeFiles', body: {
    userId:'1',
    files:[{
        fileId:'1',
        fileRevision:1,
        fileName:'test.pdf',
        size:2312195
    }]
}});
```
<br>

## 프로젝트 소개

GPT API를 이용한 문서 분석을 위한 문서의 내용 분석의 Flow를 개발합니다.(채팅 제외)

1. 문서의 ID를 토대로 문서의 분석 현황을 조회(분석 상태는 총 5가지)
2. 문서 분석 현황에 따라 보여지는 페이지 UI가 다름
   - 문서 상태에 따라 생략하는 페이지 발생
   - (ex) 1-5까지의 페이지 중 2까지 했다면 다음 조회에서는 3부터 시작)
3. 에러 처리에 따른 각 별개의 팝업을 출력

<br>

### 사용 기술
 **React**, **Typescript**, **MSW v2**, **Yarn**, **redux toolkit**,

<br>

### 아키텍처
 - multi-layered 아키텍처 사용

<pre>
📦src
 ┣ 📜App.tsx
 ┣ 📜index.tsx
 ┣ 📂api //API 관련 파일
 ┣ 📂components
 ┃ ┣ 📂askDoc //askDoc에서만 사용하는 컴포넌트
 ┃ ┃ ┣ 📂modals // askDoc에서만 사용하는 모달들 정리
 ┃ ┃ ┗ 📂analyzeStep // 문서 분석 순서 Funnel 컴포넌트들
 ┣ 📂error //에러 상수 정의
 ┣ 📂pages // 페이지 컴포넌트들
 ┣ 📂mocks // MSW 모킹 폴더
 ┣ 📂img // 이미지 정적파일 모음
 ┣ 📂locale // 다국어 json 파일들 모음
 ┃ ┣ 📂AskDocStep // AskDoc용 하위 페이지들
 ┃ ┃ ┣ 📜AskDocLoading.tsx
 ┃ ┃ ┣ 📜Chat.tsx
 ┃ ┃ ┣ 📜CheckDocHistory.tsx
 ┃ ┃ ┣ 📜ConfirmDoc.tsx
 ┃ ┃ ┣ 📜ProgressAnalysisDoc.tsx
 ┃ ┃ ┗ 📜StartAnalysisDoc.tsx
 ┃ ┗ 📜AskDocHome.jsx
 ┣ 📂store //리덕스 스토어
 ┃ ┗ 📂slices //리덕스 slice들 정의
 ┣ 📂util //유틸 파일
 ┣ 📂style //글로벌 스타일 파일 정의
</pre>

<br>

### 데모 영상

- 프로젝트 흐름


<video controls width=60% src="https://github.com/Wanted-PreOnboarding/pre-onboarding-assignment-week-4-1-team-1/assets/68778883/f6dfa341-16b7-4b30-b04a-f90a010396f1" ></video>


- 문서 분석 이력 있음

<video controls width=60% src="https://github.com/Wanted-PreOnboarding/pre-onboarding-assignment-week-4-1-team-1/assets/68778883/0b4b956c-ec6b-4029-a481-03e985ff3803" ></video>


- 분석단계 1단계 완료였을 시


<video controls width=60% src="https://github.com/Wanted-PreOnboarding/pre-onboarding-assignment-week-4-1-team-1/assets/68778883/8bd93b28-db68-474c-bc0a-dc7c765b4927
" ></video>


- 분석단계 2단계 완료였을 시

<video controls width=60% src="https://github.com/Wanted-PreOnboarding/pre-onboarding-assignment-week-4-1-team-1/assets/68778883/a59856bd-9d15-45be-b50e-c3f647b508c5" ></video>


- 분석단계 3단계 완료였을 시

<video controls width=60% src="https://github.com/Wanted-PreOnboarding/pre-onboarding-assignment-week-4-1-team-1/assets/68778883/bd306577-43b5-4d46-9bc5-934a09470e75" ></video>


- 문서 분석이 기존에 전부 완료되었을 시

<video controls width=60% src="https://github.com/Wanted-PreOnboarding/pre-onboarding-assignment-week-4-1-team-1/assets/68778883/ec153235-7286-435c-9d15-dc98865e14a3" ></video>


- 문서 분석 에러 시


<video controls width=60% src="https://github.com/Wanted-PreOnboarding/pre-onboarding-assignment-week-4-1-team-1/assets/68778883/0c83589c-8526-4d38-8ad2-00b6ed073dc0" ></video>


## 코드 설명

### useGetAskDocFiles.tsx
- 초기 클라이언트에서 받아온 문서 정보를 가지고 분석 현황 조회하는 Hook
- `isInit` flag는 프로젝트에서 Bridge가 정상적으로 등록 되었음을 알려주는 변수
- `filesSelector의 isSuccess`는 클라이언트에서 문서 정보를 정상적으로 받아옴을 알려주는 변수

<br>

### useModal.tsx
- 전역 상태로 관리된 모달을 컨트롤할 수 있는 Hook

<br>

### usePollingExtractText.tsx
- 데이터 폴링을 확인하는 Hook

<br>

### useAskDocErrorHandler.tsx
- 각 흐름 중 에러처리 팝업을 컨트롤하기 위한 예외처리 hook

<br>

### useErrorHandle.tsx
- 진행중 프로젝트에서 잡히지 않는 예외처리를 처리하는 hook


<br>

### AskDocLoading 페이지
- 스켈레톤 UI를 보여주며 문서 분석 현황을 조회 후 각 상태에 따른 페이지 이동 처리


<br>

### ProgressAnalysisDoc.tsx
- 문서 분석을 하는 각 API의 흐름을 파악하기 쉽게 퍼널 형태로 관리