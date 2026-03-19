# Cronジョブが参照先スクリプト不在で無限エラーを吐いた話

## 何が起きたか

Notion同期用のCronジョブが以下のエラーを毎回吐いていた：

```
Error: Cannot find module '/Users/nobu/openclaw-os/notion/sync-jobs.js'
```

エラーログが延々と蓄積され、ログファイルが肥大化。

## 原因

システムを旧環境（`~/openclaw-os/`）から新環境（`~/.openclaw/`）に移行した際、Cronジョブの参照パスが旧環境のままになっていた。スクリプト本体は移行済みだったが、Cron定義のパスが更新されていなかった。

## 教訓

- **環境移行時はCron/LaunchAgentのパスも全て更新する**
- 参照先が存在しないCronは無限にエラーを吐き続ける。ログ肥大化の原因になる
- 移行チェックリストに「Cronジョブの参照パス確認」を必ず入れる
- 移行後は `crontab -l` や LaunchAgent の plist を全部チェックする

## 関連

同じ移行で、LaunchAgent（macOSのサービス管理）でも「サービスが見つからない」エラーが発生。

```
Could not find service 'ai.openclaw.gateway'
```

サービス登録も旧パスのままだった。**パス依存の設定は全て洗い出す必要がある。**
