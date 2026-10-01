// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeExternalLinks from 'rehype-external-links';

// GitHub Pages（https://ebycow.github.io/hanako-bot/）で公開する
export default defineConfig({
    site: 'https://ebycow.github.io',
    base: '/hanako-bot',
    // terms.html / privacy.html のURLを変えないため、ディレクトリではなくファイルとして出力する
    build: { format: 'file' },
    // 改行を含む空白を詰めると「<code>/plz</code> を打つと」の空白が消えるため、圧縮しない
    compressHTML: false,
    markdown: {
        processor: unified({
            // 規約の文面を勝手に書き換えない（"" や -- を飾り文字に変換しない）
            smartypants: false,
            // 外部リンクは新しいタブで開く
            rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener'] }]],
        }),
    },
});
