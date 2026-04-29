# アプリ名：OnetouchLog

## 前提

研究室の先輩を顧客として、4人チームでWebアプリケーションを開発しました。  
私はチームリーダー兼プロジェクトマネージャーとして、
- メンバーの得意分野を考慮した役割分担
- 開発進行管理
- 毎週の教員・顧客への進捗報告

を担当し、認識のズレを防ぎながら開発を進めました。

---

## 概要
OneTouchLogは、作業時間をワンクリックで記録・管理できるWebアプリケーションです。  
タスク名、作業の開始・終了時間、作業時間、休憩時間、作業中のメモ、タスクの評価を管理し、過去の記録の確認や削除が可能です。

---

## 背景・目的
日々の作業時間や内容を手軽に記録できる仕組みが必要だと感じ、本アプリを開発しました。  
特に「記録のしやすさ」と「継続的に使えるシンプルなUI」を重視しています。

---

## 主な機能

- 作業開始・終了の記録
- 作業時間の自動計測
- 休憩機能
- タスク名の登録・再利用
- メモ・評価の記録
- 作業記録一覧の表示
- 作業記録の削除機能

---

## 実行方法

以下の手順でローカル環境で動作させることができます。
```bash
git clone https://github.com/InoueHaruto42/OnetouchLog.git
cd OnetouchLog
chmod +x gradlew
./gradlew bootRun
```
また、ブラウザで以下にアクセスしてください。
```text
http://localhost:8080
```
---

## 技術スタック

- バックエンド：Java / Spring Boot
- フロントエンド：HTML / CSS / JavaScript
- データベース：H2 Database
- ORM：Spring Data JPA（Hibernate）
- ビルドツール：Gradle

---

## システム構成

Frontend（JavaScript）  
↓  
REST API（Spring Boot Controller）  
↓  
Repository（JPA）  
↓  
Database（H2）

---

## ディレクトリ構成

```text
src
└── main
    ├── java/com/example/onetouch
    │   ├── controller
    │   ├── entity
    │   └── repository
    │
    └── resources
        ├── application.properties
        └── static
            ├── index
            ├── record
            ├── complete
            ├── history
            └── common
```
---

## 工夫した点

- 作業時間から休憩時間を除外するロジックをフロント側で実装
- localStorageを用いた画面間データ連携
- タスクをDBで管理し、再利用可能に設計
- 時刻表示（分単位）と作業時間（秒単位）を分けてUXを向上
- 削除機能を追加し、実用性を向上

## 改善点

- ユーザー管理機能の追加（ログイン機能）
- 作業記録の編集機能の実装
- UI/UXの改善（デザインの調整）
