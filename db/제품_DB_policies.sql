-- 웹 앱(anon 키)이 제품 테이블을 읽고, 추가하고, 삭제하도록 허용하는 정책
-- 로컬 실습용. Supabase SQL Editor에서 한 번 실행
-- service_role 키는 웹 앱에 넣지 않음
-- 이미 같은 이름의 정책이 있으면 오류가 나므로, 그 경우 해당 줄만 건너뛰기

alter table products enable row level security;

create policy "anon read products" on products
  for select to anon using (true);

create policy "anon insert products" on products
  for insert to anon with check (true);

create policy "anon delete products" on products
  for delete to anon using (true);
