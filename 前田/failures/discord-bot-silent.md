# Discord Botがメッセージを受信できなかった原因

## 何が起きたか

Discord Botが正常に接続（オンライン表示）しているのに、チャンネルに投稿されたメッセージの内容を一切読めなかった。`message.content` が常に空文字列。

## 原因

**Message Content Intent が有効になっていなかった。**

Discord Developer Portal で「Privileged Gateway Intents」の中にある「Message Content Intent」を明示的にONにしないと、Botはメッセージ本文を受け取れない。

2022年9月以降、Discord APIの仕様変更でこれが必須になった。

## 教訓

- Botが接続成功 ≠ メッセージが読める。Intent設定は別レイヤー
- `message.content === ""` のデバッグで「送信側の問題？」と誤認しがち。実際はBot側の権限不足
- Discord Developer Portal → Bot → Privileged Gateway Intents → **Message Content Intent** をONにする
- コードだけでなく、外部サービスの管理画面の設定も疑う

## 修正方法

1. [Discord Developer Portal](https://discord.com/developers/applications) を開く
2. 対象Botのアプリケーションを選択
3. 左メニュー「Bot」→ 「Privileged Gateway Intents」セクション
4. 「Message Content Intent」をONにする
5. 「Save Changes」

## 補足

同様に `Server Members Intent` や `Presence Intent` も、必要な機能に応じてONにする必要がある。デフォルトは全部OFFなので注意。
