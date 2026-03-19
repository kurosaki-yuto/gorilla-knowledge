# gorilla-knowledge

ゴリラチームのナレッジベースです。各メンバーが学んだこと・知見・Tipsなどを蓄積していきます。

## ディレクトリ構成

```
gorilla-knowledge/
├── 前田/
├── 黒崎/
├── 野田/
├── 松本/
└── 内村/
```

各メンバーは **自分のディレクトリ** にナレッジを追加していってください。

## Git ワークフロー（重要）

**main ブランチに直接プッシュしないでください。** 必ずブランチを切ってプルリクエスト（PR）経由でマージします。

### 手順

```bash
# 1. 最新の main を取得
git checkout main
git pull origin main

# 2. 自分の作業ブランチを作成（名前は自由、例: 黒崎/aws-tips）
git checkout -b 黒崎/aws-tips

# 3. 自分のディレクトリ内でファイルを作成・編集
#    ※ 他のメンバーのディレクトリは編集しない

# 4. コミット
git add 黒崎/
git commit -m "AWSのTipsを追加"

# 5. リモートにプッシュ
git push origin 黒崎/aws-tips

# 6. GitHub 上でプルリクエストを作成 → main にマージ
```

### ルール

- **ブランチ名**: `名前/トピック` の形式にする（例: `前田/react-hooks`, `野田/docker-tips`）
- **自分のディレクトリだけ編集する**: 他のメンバーのディレクトリを触るとコンフリクトの原因になります
- **作業前に必ず `git pull origin main`**: 最新の状態から始めることでコンフリクトを防ぎます
- **困ったら `git status` で確認**: 今どの状態にいるか分からなくなったらまず確認

### よくあるトラブルと対処

```bash
# プッシュが拒否された場合（他の人のマージが先に入った）
git checkout main
git pull origin main
git checkout 自分のブランチ名
git rebase main
git push origin 自分のブランチ名 --force-with-lease

# どうしても分からなくなったら
git stash          # 今の変更を一時退避
git checkout main  # main に戻る
git pull origin main
git checkout -b 新しいブランチ名
git stash pop      # 退避した変更を戻す
```

## Claude Code での作業の始め方

作業を始める前に、**自分のディレクトリの内容を Claude Code に読み込ませてから**スタートしてください。

```
# 例: 黒崎の場合

# 1. まず自分のディレクトリを参照させる
「黒崎/ ディレクトリの中身を確認して」

# 2. その後、ナレッジの追加・編集を依頼する
「〇〇について学んだことをまとめて」

# 3. 完了したらコミット＆プッシュを依頼
「コミットしてプッシュして」
```

こうすることで、既存のナレッジと重複しない形で新しい知見を追加できます。
