// トップの通話デモ（VoiceDemo.astro）で流す場面。ページを開くたびにひとつ選ばれる。
// 「いろいろな集まりで使えます」（UseCases.astro）にも同じ順で並び、押すとその場面に切り替わる。
// 画面を見ているのは「えび」（マイクミュート）で、もう一人が「みかん」。

export type SceneLine = { user: 'ebi' | 'mikan'; text: string };

export type VoiceScene = {
    /** 「いろいろな集まりで使えます」に出す名前 */
    label: string;
    /** はなこを呼ぶボイスチャンネル */
    channel: string;
    /** サイドバーに並ぶ、もうひとつのボイスチャンネル */
    other: string;
    /** はなこを呼ぶ前の会話。みかん → えび の順 */
    initial: [string, string];
    /** はなこが読み上げる会話 */
    lines: SceneLine[];
};

export const voiceScenes: VoiceScene[] = [
    {
        label: '🎮 ゲーム実況',
        channel: 'ゲーム部屋',
        other: '作業部屋',
        initial: ['そろそろ始めよっか', 'はなこ呼ぶね！'],
        lines: [
            { user: 'mikan', text: 'ボス戦いくよー' },
            { user: 'ebi', text: 'ミュートだけど聞いてるよ〜' },
            { user: 'ebi', text: '回復まかせて！' },
            { user: 'mikan', text: 'ナイス〜！おつかれさま' },
        ],
    },
    {
        label: '🌙 深夜の雑談',
        channel: '深夜の雑談',
        other: '寝落ち部屋',
        initial: ['まだ起きてる人〜？', 'いるよ、はなこ呼ぶね'],
        lines: [
            { user: 'mikan', text: 'なんか眠れなくてさ' },
            { user: 'ebi', text: '家族が寝てるから声は出せないけど、いるよ' },
            { user: 'ebi', text: 'あったかいお茶いれてきた' },
            { user: 'mikan', text: 'いいね、それ飲んだら寝よっか' },
        ],
    },
    {
        label: '📖 勉強会',
        channel: '勉強会',
        other: '休憩室',
        initial: ['じゃあ25分集中しよう', 'はなこ呼んでおくね'],
        lines: [
            { user: 'mikan', text: '終わったら答え合わせしよ' },
            { user: 'ebi', text: '図書館なのでチャットで参加します' },
            { user: 'ebi', text: '問3、解けた！' },
            { user: 'mikan', text: 'すごい、あとで解き方教えて' },
        ],
    },
    {
        label: '🎵 作業通話',
        channel: '作業通話',
        other: '雑談部屋',
        initial: ['今日もがんばろ〜', 'はなこ呼ぶね！'],
        lines: [
            { user: 'mikan', text: 'BGMかけてもいい？' },
            { user: 'ebi', text: 'どうぞ〜、こっちはチャットで' },
            { user: 'ebi', text: 'イラスト1枚描けた！' },
            { user: 'mikan', text: 'えらい！見せて見せて' },
        ],
    },
    {
        label: '🎲 TRPG',
        channel: 'TRPG卓',
        other: '雑談部屋',
        initial: ['GMです、そろそろ始めます', 'ロールプレイはチャットでやるね'],
        lines: [
            { user: 'mikan', text: '扉の奥から、かすかな物音がします' },
            { user: 'ebi', text: '聞き耳を振ります' },
            { user: 'ebi', text: '成功！何が聞こえる？' },
            { user: 'mikan', text: '足音が、こちらに近づいてくる……' },
        ],
    },
    {
        label: '🍜 飯テロ部',
        channel: '飯テロ部',
        other: '雑談部屋',
        initial: ['今日の晩ごはん報告会〜', 'はなこ呼ぶね！'],
        lines: [
            { user: 'mikan', text: 'カレー作った！' },
            { user: 'ebi', text: '食べながらなのでチャットで失礼' },
            { user: 'ebi', text: 'こっちはラーメンすすってます' },
            { user: 'mikan', text: 'おいしそう、おなかすいてきた' },
        ],
    },
    {
        label: '💼 リモート会議',
        channel: '定例ミーティング',
        other: '雑談部屋',
        initial: ['では定例を始めます', '読み上げBotを呼びますね'],
        lines: [
            { user: 'mikan', text: '進捗はどうですか？' },
            { user: 'ebi', text: 'カフェにいるので文字で失礼します' },
            { user: 'ebi', text: '資料は今日中に出せます' },
            { user: 'mikan', text: '了解です、ありがとうございます' },
        ],
    },
    {
        label: '🐈 猫を愛でる会',
        channel: '猫を愛でる会',
        other: '雑談部屋',
        initial: ['今日の猫ちゃん見せて〜', 'はなこ呼ぶね'],
        lines: [
            { user: 'mikan', text: 'うちの子、いまお昼寝中' },
            { user: 'ebi', text: '猫がひざで寝てて動けない……' },
            { user: 'ebi', text: 'なので文字で参加です' },
            { user: 'mikan', text: 'それは動けないね笑' },
        ],
    },
];
