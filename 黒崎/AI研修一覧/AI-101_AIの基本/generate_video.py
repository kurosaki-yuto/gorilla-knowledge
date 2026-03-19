#!/usr/bin/env python3
"""
AI-101 動画生成スクリプト
スライド画像 + AI音声ナレーション → MP4動画

必要ツール:
  - LibreOffice (soffice) ... PPTX → PDF
  - pdftoppm (poppler) ... PDF → PNG
  - edge-tts ... テキスト → 音声
  - ffmpeg ... 画像 + 音声 → 動画
"""

import asyncio
import json
import os
import subprocess
import sys
from pathlib import Path

# === 設定 ===
BASE_DIR = Path(__file__).parent
PPTX_FILE = BASE_DIR / "スライド.pptx"
OUTPUT_VIDEO = BASE_DIR / "動画.mp4"
TEMP_DIR = BASE_DIR / "_temp_video"
VOICE = "ja-JP-NanamiNeural"  # Microsoft Edge日本語女性音声
RATE = "+5%"  # 少し速め

# === ナレーション台本（スライド番号 → テキスト） ===
NARRATIONS = {
    1: "この動画では、AIとは何か、どんな種類があるのか、そして皆さんの業務にどう関係するのかを10分で解説します。ITの知識がなくても大丈夫です。一緒に見ていきましょう。",

    2: "今日のゴールは3つです。1つ目、AIとは何かを一言で説明できるようになること。2つ目、AIの3つの種類を区別できること。3つ目、自分の業務でAIが使えそうな場面をイメージできること。この3つを押さえれば、AIの基本はバッチリです。",

    3: "まず、AIって結局なんなのか。一言で言うと、「人間がやっていた判断を、コンピュータにやらせる技術」です。たとえば人間は、メールを見て「これはスパムだな」と判断しますよね。AIも同じことをやります。ただし、人間のように「考えている」わけではありません。大量のメールデータからパターンを学習して、「このパターンに当てはまるからスパムだ」と判定しているだけです。ここが大事なポイントです。AIは魔法ではなく、あくまでデータに基づくパターン認識の技術です。だからデータがなければAIは何もできませんし、学習したパターンの外のことには対応できません。",

    4: "AIには大きく分けて3つの種類があります。ルールベースAI、機械学習AI、そして生成AI。これから1つずつ見ていきますが、まずはこの3つがあるんだということだけ頭に入れてください。",

    5: "1つ目のルールベースAI。これは人間が「もしこうならこうする」というルールを全部書いてあげるタイプです。身近な例でいうと、会社のチャットボット。「営業時間は?」と聞くと「9時から18時です」と返ってくる。あれはAIが考えているんじゃなくて、人間が事前にQ&Aを全部登録しているんです。メリットは動きが予測できること。「なぜこの答えになったか」を説明できます。デメリットは、ルールに書いていないことには一切対応できないこと。想定外の質問が来ると「すみません、わかりません」になります。",

    6: "2つ目の機械学習AI。これはルールを人間が書くのではなく、AIがデータから自分でパターンを見つけるタイプです。たとえば売上予測。過去3年分の販売データをAIに食べさせると、「この時期にこの商品が売れやすい」というパターンを自動的に見つけて、来月の売上を予測してくれます。人間が気づかなかったパターンまで発見できるのが強みです。Amazonの「この商品を買った人はこちらも買っています」もこの技術です。皆さんも日常的にお世話になっているはずです。デメリットは、なぜその答えになったかの説明が難しいこと。いわゆるブラックボックスになりがちです。",

    7: "3つ目が、今いちばん注目されている生成AIです。ChatGPTやClaudeが代表例ですね。これまでのAIは「分類する」「予測する」が中心でしたが、生成AIは「新しく作る」ことができます。文章を書く、画像を作る、プログラムコードを生成する。これが2022年末から爆発的に広がりました。皆さんの業務で言えば、メールの下書き、議事録の要約、企画書のたたき台作成。こういった「ゼロから作る作業」を大幅にスピードアップできるのが生成AIの最大のメリットです。",

    8: "ここで3つの種類を整理しましょう。ルールベースは人間がルールを書く。機械学習はデータからパターンを学ぶ。生成AIはデータから学んで新しいものを作る。それぞれ得意なことが違うので、目的に応じて使い分けることが大切です。",

    9: "では、皆さんの業務ではどう使えるのか。大きく4つの場面があります。1つ目、文書作成。メールの下書き、報告書の要約、外国語の翻訳。毎日やっている作業ですよね。2つ目、情報整理。会議の議事録を自動で作ったり、大量のデータを分類したり。3つ目、アイデア出し。企画のブレストやキャッチコピーの案出し。ゼロから考えるより、AIに叩き台を出させてから選ぶほうが速い。4つ目、調査やリサーチ。市場調査の情報をまとめたり、競合の動きを整理したり。ここで大事なのは、「AIに全部任せる」のではなく、「AIに下書きさせて、人間が確認して仕上げる」という使い方が基本だということです。",

    10: "AIを使い始める前に、3つだけ注意点を押さえてください。1つ目、機密情報を入れないこと。ChatGPTなどの外部サービスに、お客様の個人情報や社内の機密データを入力してはいけません。必ず会社のAI利用ルールを確認してください。2つ目、答えを鵜呑みにしないこと。AIは自信たっぷりに間違えることがあります。これをハルシネーションと言います。AIの出力は必ず人間が確認してから使いましょう。3つ目、著作権に注意すること。AIが作った文章や画像の著作権は、まだ法的にグレーな部分があります。そのまま外部に出す場合は、上長に相談してください。",

    11: "今日のまとめです。AIとは人間の判断をコンピュータにやらせる技術。種類はルールベース、機械学習、生成AIの3つ。業務では下書き、要約、アイデア出し、リサーチに特に有効。そして機密情報を入れない、答えを鵜呑みにしない、著作権に注意する。この4つを覚えておいてください。",

    12: "お疲れさまでした。このあと確認テストがあります。5問中4問正解で修了です。今の内容を思い出しながら挑戦してみてください。",
}


async def generate_audio(slide_num: int, text: str, output_path: Path):
    """edge-ttsで音声生成"""
    import edge_tts
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(str(output_path))
    print(f"  [音声] スライド{slide_num}: {output_path.name}")


def pptx_to_images(pptx_path: Path, output_dir: Path):
    """PPTX → PDF → PNG画像"""
    pdf_path = output_dir / "slides.pdf"

    # PPTX → PDF (LibreOffice)
    print("[変換] PPTX → PDF ...")
    soffice_paths = [
        "/Applications/LibreOffice.app/Contents/MacOS/soffice",
        "soffice",
        "libreoffice",
    ]
    soffice = None
    for p in soffice_paths:
        if os.path.exists(p) or subprocess.run(["which", p], capture_output=True).returncode == 0:
            soffice = p
            break

    if not soffice:
        print("ERROR: LibreOffice が見つかりません")
        sys.exit(1)

    subprocess.run([
        soffice, "--headless", "--convert-to", "pdf",
        "--outdir", str(output_dir), str(pptx_path)
    ], check=True, capture_output=True)

    # 出力ファイル名を特定
    pdf_candidates = list(output_dir.glob("*.pdf"))
    if not pdf_candidates:
        print("ERROR: PDF変換に失敗しました")
        sys.exit(1)
    actual_pdf = pdf_candidates[0]
    if actual_pdf != pdf_path:
        actual_pdf.rename(pdf_path)

    # PDF → PNG (pdftoppm)
    print("[変換] PDF → PNG ...")
    subprocess.run([
        "pdftoppm", "-png", "-r", "300", str(pdf_path),
        str(output_dir / "slide")
    ], check=True)

    images = sorted(output_dir.glob("slide-*.png"))
    print(f"  [画像] {len(images)}枚のスライド画像を生成")
    return images


def create_video(images: list, audio_dir: Path, output_path: Path):
    """画像 + 音声 → MP4動画"""
    print("[動画] 結合中 ...")

    # 各スライドの動画パーツを作成
    parts = []
    concat_list = audio_dir / "concat.txt"

    for i, img_path in enumerate(images):
        slide_num = i + 1
        audio_path = audio_dir / f"slide_{slide_num:02d}.mp3"
        part_path = audio_dir / f"part_{slide_num:02d}.mp4"

        if not audio_path.exists():
            print(f"  WARNING: スライド{slide_num}の音声がありません、スキップ")
            continue

        # 音声の長さを取得
        result = subprocess.run([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "json", str(audio_path)
        ], capture_output=True, text=True)
        duration = float(json.loads(result.stdout)["format"]["duration"])

        # 前後に0.5秒ずつ余白を追加
        total_duration = duration + 1.0

        # 画像 + 音声 → パーツ動画
        subprocess.run([
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(img_path),
            "-i", str(audio_path),
            "-c:v", "libx264",
            "-tune", "stillimage",
            "-c:a", "aac", "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-vf", f"scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
            "-t", str(total_duration),
            "-af", f"adelay=500|500,apad=pad_dur=0.5",
            str(part_path)
        ], check=True, capture_output=True)

        parts.append(part_path)
        print(f"  [パーツ] スライド{slide_num}: {total_duration:.1f}秒")

    # パーツを結合
    with open(concat_list, "w") as f:
        for part in parts:
            f.write(f"file '{part}'\n")

    subprocess.run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat_list),
        "-c", "copy",
        str(output_path)
    ], check=True, capture_output=True)

    # 動画の長さを取得
    result = subprocess.run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "json", str(output_path)
    ], capture_output=True, text=True)
    total = float(json.loads(result.stdout)["format"]["duration"])
    print(f"\n[完成] {output_path}")
    print(f"  総尺: {int(total // 60)}分{int(total % 60)}秒")


async def main():
    # 一時ディレクトリ作成
    TEMP_DIR.mkdir(exist_ok=True)
    audio_dir = TEMP_DIR / "audio"
    audio_dir.mkdir(exist_ok=True)

    # Step 1: スライド → 画像
    images = pptx_to_images(PPTX_FILE, TEMP_DIR)

    # スライド画像をプレビュー用にコピー
    preview_dir = BASE_DIR / "スライド画像"
    preview_dir.mkdir(exist_ok=True)
    for img in images:
        import shutil
        dest = preview_dir / f"スライド{img.stem.split('-')[-1].lstrip('0') or '0'}.png"
        shutil.copy2(img, dest)
    print(f"  [プレビュー] {preview_dir} にコピー済み")

    # Step 2: ナレーション音声生成
    print("\n[音声生成] edge-tts でナレーション生成中 ...")
    tasks = []
    for slide_num, text in NARRATIONS.items():
        audio_path = audio_dir / f"slide_{slide_num:02d}.mp3"
        tasks.append(generate_audio(slide_num, text, audio_path))

    await asyncio.gather(*tasks)

    # Step 3: 画像 + 音声 → 動画
    print("\n[動画生成] ffmpeg で結合中 ...")
    create_video(images, audio_dir, OUTPUT_VIDEO)

    print("\n=== 完了 ===")
    print(f"動画: {OUTPUT_VIDEO}")
    print(f"スライド画像: {preview_dir}")


if __name__ == "__main__":
    asyncio.run(main())
