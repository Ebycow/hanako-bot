# Hanako 公式サイト

https://ebycow.github.io/hanako-bot/ のソースです。[Astro](https://astro.build/) で作っています。

## 開発

Node.js 22.12 以上が必要です。

```sh
npm install
npm run dev      # http://localhost:4321/hanako-bot/ で確認
npm run check    # 型チェック
npm run build    # dist/ に出力
```

## 公開

`master` に push すると、GitHub Actions（`.github/workflows/deploy.yml`）がビルドして `gh-pages` ブランチに push し、そのまま GitHub Pages に公開されます。`gh-pages` ブランチを直接編集する必要はありません。

## どこを直せばいいか

| 直したいもの | ファイル |
| --- | --- |
| コマンドの追加・変更（09章の表、08章の権限の図、コマンド数） | `src/data/commands.ts` |
| 辞書やSEの上限などの数字 | `src/data/limits.ts` |
| ドキュメントの各章 | `src/components/docs/*.astro`（章の順番と目次は `src/components/home/Docs.astro`） |
| トップページの各セクション | `src/components/home/*.astro`（並び順は `src/pages/index.astro`） |
| ヘッダー・フッター | `src/components/SiteHeader.astro`、`src/components/SiteFooter.astro` |
| 利用規約・プライバシーポリシーの本文 | `src/content/terms.md`、`src/content/privacy.md` |
| 規約ページの見出し・制定日 | `src/pages/terms.astro`、`src/pages/privacy.astro` |
| スタイル（1か所でしか使わないもの） | 各コンポーネントの `<style>` |
| スタイル（色などの変数、ボタン・カードなど共通の部品） | `src/styles/`（読み込み順は `global.css`） |
| 画像 | `public/assets/` |

Bot 本体（[Ebycow/hanako](https://github.com/Ebycow/hanako)）でコマンドや上限値を変えたときは、`src/data/` の2ファイルも合わせて更新してください。
