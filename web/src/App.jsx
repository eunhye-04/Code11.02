import { useEffect, useMemo, useState } from 'react'
import { supabase, isConfigured } from './supabase'
import ProductForm, { FIELDS } from './ProductForm'

// 빈 문자열은 null 로 바꿔서 DB에 저장
function toPayload(form) {
  const payload = {}
  for (const f of FIELDS) {
    const value = form[f.key].trim()
    if (value === '') {
      payload[f.key] = null
    } else if (f.type === 'number') {
      payload[f.key] = Number(value)
    } else {
      payload[f.key] = value
    }
  }
  return payload
}

// 검색 대상 필드 (상품코드, 상품명, 카테고리, 원산지, 설명, 알레르기정보)
const SEARCH_KEYS = ['product_code', 'name', 'category', 'origin', 'description', 'allergy_info']

export default function App() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  // 전체 제품 목록 조회
  async function loadProducts() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('product_code')
    setLoading(false)

    if (error) {
      setError(`조회 실패: ${error.message}`)
      return
    }
    setProducts(data)
  }

  useEffect(() => {
    if (supabase) loadProducts()
  }, [])

  // 검색어가 포함된 제품만 표시 (대소문자 무시)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) =>
      SEARCH_KEYS.some((key) => (p[key] ?? '').toString().toLowerCase().includes(q)),
    )
  }, [products, query])

  // 제품 추가
  async function handleAdd(form) {
    setSaving(true)
    setError('')
    const { error } = await supabase.from('products').insert(toPayload(form))
    setSaving(false)

    if (error) {
      // 기본키 중복 오류 코드(23505)는 알기 쉬운 문구로 바꿈
      setError(
        error.code === '23505'
          ? '이미 있는 상품코드입니다.'
          : `추가 실패: ${error.message}`,
      )
      return
    }
    setShowForm(false)
    loadProducts()
  }

  // 제품 삭제 (확인 후 실행)
  async function handleDelete(product) {
    if (!window.confirm(`"${product.name}"(${product.product_code})을(를) 삭제할까요?`)) return

    setError('')
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('product_code', product.product_code)

    if (error) {
      setError(`삭제 실패: ${error.message}`)
      return
    }
    loadProducts()
  }

  if (!isConfigured) {
    return (
      <main className="container">
        <h1>제품 관리</h1>
        <p className="error">
          Supabase 설정이 없습니다. web/.env.local 파일에 VITE_SUPABASE_URL 과
          VITE_SUPABASE_ANON_KEY 를 넣은 뒤 개발 서버를 다시 실행하세요. (web/README.md 참고)
        </p>
      </main>
    )
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>제품 관리</h1>
        <button onClick={() => setShowForm((v) => !v)} disabled={saving}>
          {showForm ? '닫기' : '제품 추가'}
        </button>
      </header>

      {showForm && (
        <ProductForm
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          saving={saving}
        />
      )}

      <div className="toolbar">
        <input
          type="search"
          placeholder="상품코드, 상품명, 카테고리, 원산지, 알레르기 등으로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="count">
          {filtered.length} / {products.length}건
        </span>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">불러오는 중...</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>상품코드</th>
              <th>상품명</th>
              <th>카테고리</th>
              <th>원산지</th>
              <th>용량</th>
              <th className="num">가격(원)</th>
              <th>보관유형</th>
              <th>알레르기정보</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.product_code}>
                <td>{p.product_code}</td>
                <td>{p.name}</td>
                <td>{p.category ?? '-'}</td>
                <td>{p.origin ?? '-'}</td>
                <td>{p.volume ?? '-'}</td>
                <td className="num">{p.price_krw?.toLocaleString() ?? '-'}</td>
                <td>{p.storage_type ?? '-'}</td>
                <td className="allergy">{p.allergy_info ?? '-'}</td>
                <td>
                  <button className="danger" onClick={() => handleDelete(p)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="muted center">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
