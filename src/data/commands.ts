// コマンド一覧（09章の表、08章の権限の図、ヒーローのコマンド数はすべてここから作る）。
// Bot 本体（Ebycow/hanako の src/domain/model/commands/）にコマンドを足したら、ここにも追加すること。

export type Permission = 'everyone' | 'moderator' | 'admin';

export const permissions: Record<Permission, { label: string; tier: string; icon: string }> = {
    everyone: { label: '—', tier: 'だれでも', icon: '👥' },
    moderator: { label: 'メンバーをタイムアウト', tier: 'モデレーター', icon: '🛡️' },
    admin: { label: 'サーバー管理', tier: 'サーバー管理者', icon: '👑' },
};

export interface Command {
    /** スラッシュコマンド名（先頭の / なし） */
    name: string;
    /** 表の「機能」列 */
    description: string;
    /** 表に出す引数の例（例：「置換前 置換後」） */
    usage?: string;
    /** テキストコマンドの別名。空ならスラッシュコマンドのみ */
    aliases: string[];
    permission: Permission;
}

export interface CommandGroup {
    label: string;
    commands: Command[];
}

export const commandGroups: CommandGroup[] = [
    {
        label: '🗣️ 読み上げ',
        commands: [
            { name: 'plz', description: 'ボイスチャンネルに参加', aliases: ['お願い', 'plz', 'summon', 's'], permission: 'everyone' },
            { name: 'bye', description: 'ボイスチャンネルから退出', aliases: ['さようなら', 'bye', 'b'], permission: 'everyone' },
            { name: 'seibai', description: '読み上げを中止', aliases: ['成敗', 'seibai', 'stop'], permission: 'everyone' },
            { name: 'limit', description: '文字数制限（0で解除）', usage: '30', aliases: ['制限', 'limit', 'readlimit'], permission: 'admin' },
            { name: 'speaker', description: '読み上げキャラクター変更', usage: '名前', aliases: ['キャラクター変更', 'speaker'], permission: 'everyone' },
        ],
    },
    {
        label: '📚 辞書',
        commands: [
            { name: 'teach', description: '単語を教育', usage: '置換前 置換後', aliases: ['教育', 'teach', 'mk', 'wbook-add'], permission: 'everyone' },
            { name: 'forget', description: '単語を忘却', usage: '単語', aliases: ['忘却', 'forget', 'rm', 'wbook-delete'], permission: 'everyone' },
            { name: 'dictionary', description: '辞書の一覧', aliases: ['辞書', 'dictionary', 'dic', 'wbook-list'], permission: 'everyone' },
            { name: 'dictionary-clear', description: '辞書を全削除', aliases: ['白紙', 'alldelete', 'wbook-alldel'], permission: 'admin' },
        ],
    },
    {
        label: '🎺 SE（効果音）',
        commands: [
            { name: 'se-add', description: 'SEを追加（URLまたはファイル添付）', usage: 'キーワード', aliases: ['音声教育', 'se-add'], permission: 'everyone' },
            { name: 'se-del', description: 'SEを削除', usage: 'キーワード', aliases: ['音声忘却', 'se-delete', 'se-del'], permission: 'everyone' },
            { name: 'se-list', description: 'SEの一覧', aliases: ['音声辞書', '音声一覧', 'se-dic', 'se-list'], permission: 'everyone' },
            { name: 'se-search', description: 'SEを検索', usage: 'キーワード', aliases: ['se?'], permission: 'everyone' },
            { name: 'se-rename', description: 'SEの名前変更', usage: '旧 新', aliases: ['音声名置換', 'se-rename'], permission: 'everyone' },
            { name: 'se-normalize', description: 'SE音量の正規化（0〜100）', usage: '80', aliases: ['SE正規化', 'se-normalize', 'senorm'], permission: 'admin' },
        ],
    },
    {
        label: '🛡️ ブラックリスト',
        commands: [
            { name: 'blacklist-add', description: 'ユーザーを追加', usage: '@user', aliases: ['沈黙', 'blacklist-add'], permission: 'moderator' },
            { name: 'blacklist-remove', description: 'ユーザーを除外', usage: '@user', aliases: ['恩赦', 'blacklist-remove'], permission: 'moderator' },
            { name: 'blacklist-show', description: '一覧を表示', aliases: ['名簿', 'blacklist-show'], permission: 'moderator' },
            { name: 'blacklist-clear', description: '全員を解除', aliases: ['大赦', 'blacklist-clear'], permission: 'admin' },
        ],
    },
    {
        label: '✨ その他',
        commands: [
            { name: 'help', description: 'ヘルプ', aliases: ['使い方', 'help'], permission: 'everyone' },
            { name: 'ask', description: '質問（はい／いいえで答えます）', aliases: ['質問', 'ask'], permission: 'everyone' },
            { name: 'text-commands', description: 'テキストコマンドの有効・無効', aliases: [], permission: 'admin' },
        ],
    },
];

export const allCommands = commandGroups.flatMap((g) => g.commands);
