// Bot 本体（Ebycow/hanako）の上限値。
// Bot 側で値を変えたら、ここも合わせて変更すること。サイト中の数字はすべてここから参照している。
export const limits = {
    /** 辞書の登録数（src/domain/model/commands/word_create_command.js） */
    dictionaryEntries: 200,
    /** SEの登録数（src/domain/model/commands/foley_create_command.js） */
    seEntries: 10000,
    /** SE 1ファイルのサイズ（MB） */
    seFileMB: 2,
    /** SE 1ファイルの長さ（秒） */
    seSeconds: 60,
    /** SEのURLの長さ（文字） */
    seUrlLength: 300,
    /** 文字数制限 /limit の最大値（src/domain/model/commands/limit_command.js） */
    readLimitMax: 2000,
    /** SE正規化の初期値（src/domain/model/commands/se_normalize_command.js） */
    seNormalizeDefault: 50,
} as const;

/** 10000 → "10,000" */
export const fmt = (n: number) => n.toLocaleString('ja-JP');
