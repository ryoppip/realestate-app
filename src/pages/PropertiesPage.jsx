import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PropertyForm from '../components/PropertyForm'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/propertiesApi'

// 物件一覧画面（ログイン必須）
export default function PropertiesPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // 編集中の物件ID（編集していないときは null）
  const [editingId, setEditingId] = useState(null)

  // 画面表示時に Supabase から物件一覧を取得する
  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err) => setError('物件一覧の取得に失敗しました：' + err.message))
      .finally(() => setLoading(false))
  }, [])

  // 新規登録：登録した物件を一覧の先頭に追加する
  const handleCreate = async (values) => {
    const created = await createProperty(user.id, values)
    setProperties((prev) => [created, ...prev])
  }

  // 編集：更新後の内容で一覧の該当物件を置き換える
  const handleUpdate = async (id, values) => {
    const updated = await updateProperty(id, values)
    setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)))
    setEditingId(null)
  }

  // 削除：確認ダイアログで OK のときだけ削除する
  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return

    setError('')
    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
    } catch (err) {
      setError('削除に失敗しました：' + err.message)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="page">
      <header className="header">
        <h1>物件一覧</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            ログアウト
          </button>
        </div>
      </header>

      <section className="panel">
        <h2>物件を登録する</h2>
        <PropertyForm submitLabel="登録する" onSubmit={handleCreate} />
      </section>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="empty">登録された物件はまだありません。</p>
      ) : (
        <ul className="property-list">
          {properties.map((property) => (
            <li key={property.id} className="property-card">
              {editingId === property.id ? (
                // 編集中のカードはフォームに切り替える
                <PropertyForm
                  initialValues={property}
                  submitLabel="更新する"
                  onSubmit={(values) => handleUpdate(property.id, values)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <h2>{property.name}</h2>
                  {/* 家賃は3桁区切りで表示する */}
                  <p className="rent">家賃：{property.rent.toLocaleString('ja-JP')}円/月</p>
                  <p className="area">エリア：{property.area}</p>
                  <p className="layout">間取り：{property.layout}</p>
                  <div className="card-actions">
                    <button className="secondary-button" onClick={() => setEditingId(property.id)}>
                      編集
                    </button>
                    <button className="danger-button" onClick={() => handleDelete(property)}>
                      削除
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
