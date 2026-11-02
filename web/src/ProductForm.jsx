import { useState } from 'react'

// 제품 필드 정의 (입력 폼과 표에서 같이 사용)
export const FIELDS = [
  { key: 'product_code', label: '상품코드', required: true },
  { key: 'name', label: '상품명', required: true },
  { key: 'category', label: '카테고리' },
  { key: 'origin', label: '원산지' },
  { key: 'volume', label: '용량' },
  { key: 'price_krw', label: '가격(원)', type: 'number' },
  { key: 'description', label: '설명', wide: true },
  { key: 'storage_type', label: '보관유형', type: 'select', options: ['상온', '냉장', '냉동'] },
  { key: 'shelf_life', label: '보관기간(개봉 전)' },
  { key: 'storage_after_open', label: '개봉 후 보관', wide: true },
  { key: 'allergy_info', label: '알레르기정보', wide: true },
  { key: 'caution', label: '주의사항', wide: true },
  { key: 'sale_period', label: '판매시기' },
]

const EMPTY_FORM = Object.fromEntries(FIELDS.map((f) => [f.key, '']))

// 제품 추가 폼. 저장은 부모(App)가 맡고, 여기서는 입력만 처리
export default function ProductForm({ onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    // 필수 입력 확인
    const missing = FIELDS.filter((f) => f.required && !form[f.key].trim())
    if (missing.length > 0) {
      setFormError(`${missing.map((f) => f.label).join(', ')} 은(는) 꼭 입력해야 합니다.`)
      return
    }

    setFormError('')
    onSubmit(form)
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>제품 추가</h2>

      <div className="form-grid">
        {FIELDS.map((f) => (
          <label key={f.key} className={f.wide ? 'wide' : ''}>
            <span>
              {f.label}
              {f.required && <em> *</em>}
            </span>

            {f.type === 'select' ? (
              <select value={form[f.key]} onChange={(e) => handleChange(f.key, e.target.value)}>
                <option value="">선택 안 함</option>
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : f.wide ? (
              <textarea
                rows={2}
                value={form[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
              />
            ) : (
              <input
                type={f.type === 'number' ? 'number' : 'text'}
                min={f.type === 'number' ? 0 : undefined}
                value={form[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
              />
            )}
          </label>
        ))}
      </div>

      {formError && <p className="error">{formError}</p>}

      <div className="form-actions">
        <button type="button" className="ghost" onClick={onCancel} disabled={saving}>
          취소
        </button>
        <button type="submit" disabled={saving}>
          {saving ? '저장 중...' : '추가'}
        </button>
      </div>
    </form>
  )
}
