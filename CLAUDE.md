# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

Supabase 認証付きの不動産管理 Web アプリ（realestate-app）。
メールアドレス＋パスワードで会員登録・ログインし、ログイン後に自分が登録した物件の一覧表示・登録・編集・削除ができる。

## 技術スタック

- React + Vite（JavaScript / JSX）
- React Router（画面遷移）
- Supabase（`@supabase/supabase-js`、認証）

## ディレクトリ構成

- `src/lib/supabase.js`：Supabase クライアント（`.env` から接続情報を読み込む）
- `src/contexts/AuthContext.jsx`：ログイン状態の管理（`useAuth` フック）
- `src/components/ProtectedRoute.jsx`：未ログイン時に `/login` へリダイレクト
- `src/components/GuestRoute.jsx`：ログイン済みでログイン・会員登録画面に来たら `/properties` へ移動
- `src/lib/propertiesApi.js`：物件テーブルへの CRUD 操作
- `src/components/PropertyForm.jsx`：物件の新規登録・編集で共通のフォーム
- `src/pages/`：ログイン・会員登録・物件一覧の各画面
- `supabase/migrations/`：Supabase のテーブル定義・RLS ポリシーの SQL

## データベース（Supabase）

- `public.properties`：物件テーブル（物件名 `name`・家賃 `rent`・エリア名 `area`・間取り `layout`・登録者 `user_id`）
- RLS 有効。ログインユーザーは自分が登録した物件（`user_id = auth.uid()`）のみ表示・登録・編集・削除できる。
- このアプリには Publishable key しかないため、SQL は Supabase ダッシュボードの SQL Editor で手動実行する。
- スキーマを変更するときは `supabase/migrations/` に連番の SQL ファイルを追加する。

## 環境変数

- `.env` に `VITE_SUPABASE_URL` と `VITE_SUPABASE_PUBLISHABLE_KEY` を設定する（`.env.example` を参照）。
- `.env` は `.gitignore` で除外済み。コミットしないこと。

## デプロイ（Vercel）

- `vercel.json` で全 URL を `index.html` に書き換え、`/properties` などへの直接アクセスやリロードでも 404 にならないようにしている。
- 環境変数（`VITE_SUPABASE_URL`・`VITE_SUPABASE_PUBLISHABLE_KEY`）は Vercel ダッシュボードで設定する。`vercel.json` には書かない。

## デプロイ情報

- 本番URL：https://realestate-app-sable-six.vercel.app/
- Supabaseプロジェクト名：realestate-app

## 主要コマンド

- 依存関係のインストール：`npm install`
- 開発サーバー起動：`npm run dev`
- ビルド：`npm run build`
- テスト実行：（未導入）

## コーディング規約

- コード中のコメントは日本語で記載する。

## Git 運用ルール

- **コードを変更するたびに、コミットして GitHub にプッシュすること。**
  - 1 つのまとまった変更（機能追加・バグ修正・リファクタリングなど）が完了したら、その都度 `git add` → `git commit` → `git push` まで行う。
  - 変更をローカルに溜め込まない。
- コミット前に、差分（`git status` / `git diff`）を確認し、意図しないファイルが含まれていないかチェックする。
- 機密情報（`.env`、API キー、パスワード、認証情報など）は絶対にコミットしない。`.gitignore` で除外する。
- コミットメッセージは日本語で、変更内容が分かるように簡潔に書く。
  - 例：`物件一覧画面に価格フィルターを追加`
- テストやビルドがある場合は、プッシュ前に通ることを確認する。失敗した場合はプッシュせず、ユーザーに報告する。
- `git push --force`、`git reset --hard` など履歴を破壊する操作は、ユーザーの明示的な許可なしに行わない。
- プッシュに失敗した場合（リモート未設定、認証エラー、コンフリクトなど）は、勝手に回避せずユーザーに状況を報告する。

## 注意事項

- このプロジェクトは OneDrive 配下にあるため、`node_modules` などの大量ファイルは同期の負荷になりうる。必要に応じて OneDrive の同期対象から除外することを検討する。
