// 使い方ガイド（docs.html）の章の並び順。目次・章番号（CHAPTER 01 など）と、
// トップページの「使い方ガイド」の一覧はここから作る。
// 章の本文は src/components/docs/ にあり、id との対応は src/components/docs/Guide.astro に書く
export const chapters = [
    { id: 'start', label: 'はじめる', icon: '👋', summary: 'ボイスチャンネルで/plzと打つだけ。最初の4ステップ。' },
    { id: 'input', label: 'コマンドの打ち方', icon: '⌨️', summary: 'スラッシュ・メンション・>の3通りの書き方。' },
    { id: 'reading', label: '読み上げのしくみ', icon: '🔍', summary: '発言が声になるまでの5つの手順と、読まない発言。' },
    { id: 'dictionary', label: '辞書', icon: '📚', summary: '読み間違える言葉や内輪の呼び名を教える。' },
    { id: 'se', label: 'SE（効果音）', icon: '🎺', summary: 'キーワードで効果音を鳴らす。登録と音量の調整。' },
    { id: 'voice', label: '声と読み方', icon: '🎚️', summary: 'キャラクターの変更と、読み上げる文字数の制限。' },
    { id: 'blacklist', label: 'ブラックリスト', icon: '🛡️', summary: '特定の人の発言を読み上げないようにする。' },
    { id: 'admin', label: '権限と管理', icon: '🔑', summary: 'コマンドを使える人と、Hanakoに必要な権限。' },
    { id: 'commands', label: 'コマンド一覧', icon: '📋', summary: 'すべてのコマンドを、絞り込みながら探せる表。' },
    { id: 'trouble', label: 'FAQ', icon: '💡', summary: '「来ない」「読まない」など、困ったときの対処。' },
] as const;

export type ChapterId = (typeof chapters)[number]['id'];
