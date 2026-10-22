import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ログイン済みのユーザーだけが閲覧できるページを囲むコンポーネント
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  // セッション確認中は判定せず、読み込み表示にする
  if (loading) return <p className="loading">読み込み中...</p>

  // 未ログインならログイン画面へリダイレクトする
  if (!session) return <Navigate to="/login" replace />

  return children
}
