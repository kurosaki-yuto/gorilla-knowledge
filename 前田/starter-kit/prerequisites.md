# Step 1: 前提条件の確認

## 必須ソフトウェア

以下がインストールされていることを確認する。

### Node.js（18以上）

```bash
node --version
# v18.x.x 以上であればOK
```

**未インストールの場合:**
```bash
# macOS（Homebrew）
brew install node

# または nvm（推奨：バージョン管理が楽）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Python（3.10以上）

```bash
python3 --version
# Python 3.10.x 以上であればOK
```

**未インストールの場合:**
```bash
# macOS
brew install python@3.12
```

### Git

```bash
git --version
```

**未インストールの場合:**
```bash
brew install git
```

### npm（Node.jsに付属）

```bash
npm --version
```

## 推奨ソフトウェア

| ツール | 用途 | インストール |
|--------|------|-------------|
| VS Code | エディタ | `brew install --cask visual-studio-code` |
| Discord | チーム連絡 | `brew install --cask discord` |
| jq | JSON整形 | `brew install jq` |

## 確認コマンド（一括）

```bash
echo "=== 環境チェック ===" && \
echo "Node.js: $(node --version 2>/dev/null || echo '未インストール')" && \
echo "npm: $(npm --version 2>/dev/null || echo '未インストール')" && \
echo "Python: $(python3 --version 2>/dev/null || echo '未インストール')" && \
echo "Git: $(git --version 2>/dev/null || echo '未インストール')"
```

全て表示されればStep 2へ進む。
