import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 未ログインのユーザー向けページ（ログイン・会員登録）を囲むコンポーネント
export default function GuestRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="loading">読み込み中...</p>

  // すでにログイン済みなら物件一覧へ移動する
  if (session) return <Navigate to="/properties" replace />

  return children
}
