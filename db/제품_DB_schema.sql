-- 제품 DB 테이블 정의 (Supabase)
-- 실행 순서: 이 파일 → db/제품_DB_seed.sql
-- 데이터는 시드 파일에만 있음

-- ============================================================
-- 1. 제품 테이블
-- ============================================================
create table if not exists products (
  product_code       text primary key,            -- 상품코드
  name               text not null,               -- 상품명
  category           text,                        -- 카테고리
  origin             text,                        -- 원산지
  volume             text,                        -- 용량
  price_krw          integer,                     -- 가격(원)
  description        text,                        -- 설명
  storage_type       text check (storage_type in ('상온', '냉장', '냉동')),  -- 보관유형 (검토 필요)
  shelf_life         text,                        -- 보관기간(개봉 전)
  storage_after_open text,                        -- 개봉 후 보관
  allergy_info       text,                        -- 알레르기정보
  caution            text,                        -- 주의사항
  sale_period        text                         -- 판매시기
);

comment on table products is '가상 상품 제품 DB (실습용)';

-- ============================================================
-- 2. 배송정책 테이블
-- ============================================================
create table if not exists shipping_policy (
  item               text primary key,            -- 항목
  content            text not null               -- 내용
);

comment on table shipping_policy is '배송 정책 (실습용)';
