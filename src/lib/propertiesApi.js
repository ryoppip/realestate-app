import { supabase } from './supabase'

// 物件テーブル（properties）への CRUD 操作をまとめたモジュール
// どのユーザーの物件を操作できるかは、Supabase 側の RLS ポリシーで制限している

// 画面で使う列
const COLUMNS = 'id, name, rent, area, layout, created_at'

// 一覧取得（SELECT）：新しく登録した順に並べる
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select(COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 新規登録（INSERT）：登録者として userId を記録する
export async function createProperty(userId, property) {
  const { data, error } = await supabase
    .from('properties')
    .insert({ ...property, user_id: userId })
    .select(COLUMNS)
    .single()

  if (error) throw error
  return data
}

// 編集（UPDATE）
export async function updateProperty(id, property) {
  const { data, error } = await supabase
    .from('properties')
    .update(property)
    .eq('id', id)
    .select(COLUMNS)
    .single()

  if (error) throw error
  return data
}

// 削除（DELETE）
export async function deleteProperty(id) {
  const { error } = await supabase.from('properties').delete().eq('id', id)

  if (error) throw error
}
