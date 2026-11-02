# 제품 관리 웹 (로컬 전용)

Supabase의 `products` 테이블을 조회·검색·추가·삭제하는 React 앱입니다. 내 PC에서만 씁니다.

## 실행 순서

1. **Node.js LTS 설치** (https://nodejs.org). 설치 후 터미널을 새로 열어 `node -v` 가 나오는지 확인합니다.
2. **Supabase 테이블 준비:** `db/제품_DB_schema.sql` → `db/제품_DB_seed.sql` 순서로 이미 실행해 둔 상태여야 합니다.
3. **환경 변수 설정:** `.env.example`을 복사해 `.env.local`로 이름을 바꾸고, Supabase 대시보드 > Project Settings > API 에서 값을 채웁니다.
4. **패키지 설치 및 실행:**

```bash
cd web
npm install
npm run dev
```

5. 터미널에 나온 주소(보통 http://localhost:5173)를 브라우저로 엽니다.

## 참고

- `.env.local`은 git에 올라가지 않도록 `.gitignore`에 들어 있습니다. 키를 코드에 직접 쓰지 마세요.
- 표 아래 검색창은 상품코드, 상품명, 카테고리, 원산지, 설명, 알레르기정보에서 찾습니다.
- 삭제는 확인 창을 한 번 거친 뒤 실행됩니다.
- 조회·추가·삭제가 안 되면 Supabase의 RLS(행 수준 보안) 설정을 확인하세요. RLS가 켜져 있으면 anon 역할의 select/insert/delete 정책이 필요합니다. 로컬 실습용이라면 해당 테이블의 RLS를 끄는 방법도 있습니다.
