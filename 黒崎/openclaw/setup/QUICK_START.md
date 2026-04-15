# ⚡ クイックスタート - 3ステップで完了

## 手順1：セットアップスクリプトを実行

以下のコマンドをコピーして、Terminal に貼り付けて実行してください：

```bash
cd ~/Downloads/開発/addness-knowledge/kurosaki/openclaw/crowdsourcing-agent && bash setup.sh
```

実行後、以下の情報を入力してください：
- クラウドワークス のメール＆パスワード
- ココナラ のメール＆パスワード

---

## 手順2：エージェントを実行

セットアップが完了したら：

```bash
cd ~/Downloads/開発/addness-knowledge/kurosaki/openclaw/crowdsourcing-agent && ./run.sh
```

これで、クラウドワークス・ココナラの新着案件を監視して、自動返信が始まります。

---

## 手順3：ログを確認

別の Terminal ウィンドウで：

```bash
tail -f ~/Downloads/開発/addness-knowledge/kurosaki/openclaw/crowdsourcing-agent/logs/responses.log
```

返信状況をリアルタイムで確認できます。

---

## 🎉 完了！

これで、クラウドソーシング自動エージェントが稼働しています。

詳細設定は `SETUP_GUIDE.md` を参照してください。

---

**トラブルが出たら：**
1. `SETUP_GUIDE.md` の「トラブルシューティング」を確認
2. ログファイルで エラーメッセージを確認
3. `.env` ファイルの認証情報が正しいか確認
