# Excel Side by Side

엑셀(xlsx/xls) 또는 CSV 파일을 업로드해서 두 열을 나란히 비교하며 편집하는
웹 앱입니다. 영어/한국어 번역 검토처럼, 셀 하나에 긴 텍스트가 들어있어
스프레드시트에서 두 셀을 동시에 보기 어려운 경우를 위해 만들었습니다.

## 기능

- xlsx / xls / csv 업로드
- 비교할 두 열 선택
- 두 열을 나란히 놓고 동기화된 스크롤로 훑어보기
- 셀 내용 직접 편집 (여러 줄 텍스트도 잘림 없이 표시)
- 편집한 내용을 xlsx 파일로 다운로드

모든 처리는 **브라우저 안에서만** 이루어집니다. 파일이 서버로 전송되거나
저장되지 않으며, 새로고침하면 작업 내용이 사라집니다.

## 개발

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

## 배포

Vercel에 그대로 배포 가능한 표준 Next.js 앱입니다 (별도 설정 불필요).

## 기술 스택

- Next.js (App Router) + TypeScript + Tailwind CSS
- [SheetJS (`xlsx`)](https://www.npmjs.com/package/xlsx) — 스프레드시트 파싱/생성
- [`react-window`](https://www.npmjs.com/package/react-window) — 대용량 행 목록 가상 스크롤
