// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeExternalLinks from 'rehype-external-links';

/**
 * Markdown の中の <!-- --> コメントを取り除く（そのままだと公開されるHTMLに残るため）
 * @returns {(tree: any) => void}
 */
function remarkRemoveComments() {
    const isComment = (/** @type {any} */ node) => node.type === 'html' && /^<!--[\s\S]*-->$/.test(node.value.trim());
    const walk = (/** @type {any} */ node) => {
        if (!node.children) return;
        node.children = node.children.filter((/** @type {any} */ child) => !isComment(child));
        node.children.forEach(walk);
    };
    return walk;
}

// GitHub Pages のカスタムドメイン（https://hanako.ebycow.net/）で公開する
export default defineConfig({
    site: 'https://hanako.ebycow.net',
    // terms.html / privacy.html のURLを変えないため、ディレクトリではなくファイルとして出力する
    build: { format: 'file' },
    // 改行を含む空白を詰めると「<code>/plz</code> を打つと」の空白が消えるため、圧縮しない
    compressHTML: false,
    markdown: {
        processor: unified({
            // 規約の文面を勝手に書き換えない（"" や -- を飾り文字に変換しない）
            smartypants: false,
            remarkPlugins: [remarkRemoveComments],
            // 外部リンクは新しいタブで開く
            rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener'] }]],
        }),
    },
});
