import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { properties } from '../data/properties'

// 物件一覧画面（ログイン必須）
export default function PropertiesPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

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

      <ul className="property-list">
        {properties.map((property) => (
          <li key={property.id} className="property-card">
            <h2>{property.name}</h2>
            {/* 家賃は3桁区切りで表示する */}
            <p className="rent">家賃：{property.rent.toLocaleString('ja-JP')}円/月</p>
            <p className="area">エリア：{property.area}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
