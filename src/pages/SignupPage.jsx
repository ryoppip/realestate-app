import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// 会員登録画面
export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    // メールアドレスとパスワードで会員登録する
    const { data, error } = await supabase.auth.signUp({ email, password })

    setSubmitting(false)
    if (error) {
      setError('会員登録に失敗しました：' + error.message)
      return
    }

    if (data.session) {
      // メール確認が不要な設定の場合は、そのままログイン状態になる
      navigate('/properties', { replace: true })
    } else {
      // メール確認が必要な設定の場合は、確認メールの案内を表示する
      setMessage('確認メールを送信しました。メール内のリンクを開いてから、ログインしてください。')
    }
  }

  return (
    <div className="auth-container">
      <h1>会員登録</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          パスワード（6文字以上）
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '登録する'}
        </button>
      </form>
      <p className="auth-link">
        すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
      </p>
    </div>
  )
}
