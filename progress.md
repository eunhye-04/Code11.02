# 진행 기록

## 2026-11-02 — 제품 DB(엑셀) 구성

- 결과 파일: `db/제품_DB.xlsx`
- 시트 구성
  - `제품` (10건, 13개 필드): 상품코드, 상품명, 카테고리, 원산지, 용량, 가격(원), 설명, 보관유형, 보관기간(개봉 전), 개봉 후 보관, 알레르기정보, 주의사항, 판매시기
  - `배송정책` (7항목): 당일 배송 지역, 당일 배송 주문 마감, 그 외 지역 배송, 무료 배송 기준, 3만원 미만 배송비, 신선 식품 발송, 금요일 주문
- 데이터 출처: `docs/dummy/products/` 가상 상품 문서 10건
- 문서에 없는 값은 빈칸으로 둠. 보관유형은 보관 설명을 바탕으로 분류한 값이라 검토 필요
- 생성 방식: PowerShell로 xlsx(OOXML) 직접 작성. XML 구조와 행 수만 확인. Excel에서 열어 보지는 않음
- 사용자 확정: 이 구성으로 사용
- 다음 단계: 제품 추가 시 `제품` 시트에 행 추가
- 빈칸 재확인(판매시기·개봉 후 보관·원산지·보관기간): 제품 문서 10건에 해당 값이 없어 빈칸 유지. 문서에 있는 값(예: 참외 판매시기 4~7월)은 이미 채워진 상태
- Supabase 이전: 관리는 Supabase에서 함. 실행은 사용자가 직접 함. 빈칸은 NULL
  - `db/제품_DB_schema.sql`: 테이블 2개(`products`, `shipping_policy`) 정의. 먼저 실행
  - `db/제품_DB_seed.sql`: 데이터만(제품 10건, 배송정책 7항목). 다음에 실행. `on conflict do nothing`으로 여러 번 실행해도 중복 오류가 나지 않음
  - 조회 쿼리 `db/제품_DB_queries.sql` 추가: 알레르기 정보가 있는 상품 조회(예상 3건: P-0113, P-0402, P-0421). 알레르기 필드의 `미확인` 값은 제외하도록 조건 추가
  - 웹 앱 `web/` 추가(React + Vite + supabase-js): 조회·검색·추가·삭제. 실행 방법은 `web/README.md`. Node.js v26.13.0 설치(winget), `npm install` 및 `npm run build` 성공. `web/.env.local` 생성(URL: 프로젝트 ref `erdnmvprubhpnmvzrnhh`, anon 키). anon 키로 products 조회 시 결과 0건(RLS 정책 때문으로 추정, 확인 필요). 해결: `db/제품_DB_policies.sql` (anon select/insert/delete 정책) 실행. service_role 키는 웹에 넣지 않기로 결정
  - 오류 기록: 시드를 이미 한 번 실행한 상태에서 다시 실행해 `products_pkey` 중복 오류 발생(P-0113). 이후 시드에 `on conflict` 추가
