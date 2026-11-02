-- 제품 DB 조회 쿼리 모음 (Supabase SQL Editor에서 실행)
-- 실행 순서: 스키마 → 시드 이후 사용

-- ============================================================
-- 1. 알레르기 정보가 있는 상품
--    제외: '알레르기 유발 물질 없음'만 적힌 상품, 알레르기 필드가 '미확인'인 상품
--    (글루텐 없음·왁스 없음 같은 문구만 있는 경우는 포함됨)
-- ============================================================
select
  product_code,
  name,
  allergy_info
from products
where allergy_info is not null
  and allergy_info not like '%알레르기 유발 물질 없음%'
  and allergy_info not like '%미확인%'
order by product_code;

-- 예상 결과(미확인 값이 없을 때): P-0113(대구사과칩), P-0402(서문시장 납작만두), P-0421(경산 대추칩)

-- ============================================================
-- 2. 특정 알레르기 물질로 조회 (예: 견과류)
--    '~' 자리에 찾을 물질명을 넣어 사용
-- ============================================================
-- select product_code, name, allergy_info
-- from products
-- where allergy_info like '%견과류%'
-- order by product_code;
