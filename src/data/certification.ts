// Hanako認定資格（certification.html。ジョークのページ）の資格と模擬試験の問題。
// 問題の正解は Bot 本体（Ebycow/hanako）の実際の動きに合わせている。
// 返事の文言やコマンドを変えたら、ここも合わせて変更すること。上限の数字は limits.ts から参照する。
import { limits, fmt } from './limits';

export const examCode = 'HNK-C01';
/** 1回の模擬試験で出す問題の数 */
export const examQuestionCount = 10;
/** 合格ライン。スコアは 100〜1000 点 */
export const passScore = 720;

/** 正解数をスコアに直す（全問不正解でも 100 点もらえる） */
export const toScore = (correct: number, total: number) => Math.round(100 + (900 * correct) / total);

export interface Tier {
    code: string;
    /** 見出しではこの2つの間で折り返す（「プロフェッショ/ナル」のように語の途中で切らないため） */
    nameParts: [string, string];
    name: string;
    english: string;
    /** この点数以上で認定する */
    minScore: number;
    image: string;
    audience: string;
    skills: string[];
}

// トップページの料金の「なかよし度」と同じ3段階にしている。低い順に並べる
const tierDefinitions: Omit<Tier, 'name'>[] = [
    {
        code: 'HCA',
        nameParts: ['はじめまして', 'アソシエイト'],
        english: 'Hanako Certified Associate',
        minScore: passScore,
        image: 'hanako-hello.webp',
        audience: '実務経験：/plz を1回以上',
        skills: ['はなこを呼んで、帰せる', '長い読み上げを止められる', '「イか略。」を聞き流せる'],
    },
    {
        code: 'HCP',
        nameParts: ['なかよし', 'プロフェッショナル'],
        english: 'Hanako Certified Professional',
        minScore: 910,
        image: 'hanako-studying.webp',
        audience: '実務経験：辞書に推しの名前を教育済み',
        skills: ['辞書で内輪の言葉を教えられる', 'SEキーワードの副作用を説明できる', '恩赦と大赦を使い分けられる'],
    },
    {
        code: 'HCE',
        nameParts: ['相棒', 'エキスパート'],
        english: 'Hanako Certified Expert',
        minScore: 1000,
        image: 'hanako-seibai.webp',
        audience: '実務経験：不問。ただし全問正解',
        skills: ['みねうちの条件を説明できる', '「イか略。」の表記を暗唱できる', '本番の判断を /ask に任せない'],
    },
];

export const tiers: Tier[] = tierDefinitions.map((tier) => ({ ...tier, name: tier.nameParts.join('') }));

/** スコアに対応する資格（不合格なら undefined） */
export const tierForScore = (score: number) => tiers.findLast((t) => score >= t.minScore);

// 受験できる試験はまだない。「準備中」のまま公開し続ける
export const specialties = [
    { name: '成敗スペシャリティ', note: '/seibai の間合いを極める' },
    { name: 'イか略スペシャリティ', note: '切られた続きを想像で補う' },
    { name: '草原スペシャリティ', note: 'SEキーワードの巻き添えを防ぐ' },
    { name: '恩赦スペシャリティ', note: '国の行事と間違えない' },
];

// href は学習先。使い方ガイドの章か、トップページのセクション
export const domains = [
    { id: 'summon', label: '呼び出しと退出', href: 'docs.html#start' },
    { id: 'reading', label: '読み上げのしくみ', href: 'docs.html#reading' },
    { id: 'dictionary', label: '辞書', href: 'docs.html#dictionary' },
    { id: 'se', label: 'SE（効果音）', href: 'docs.html#se' },
    { id: 'admin', label: '権限とブラックリスト', href: 'docs.html#admin' },
    { id: 'business', label: 'ビジネス価値と運', href: './#pricing' },
] as const;

export type DomainId = (typeof domains)[number]['id'];

export interface Question {
    domain: DomainId;
    /** 問題文・選択肢・解説の中の `〜` はコードとして表示する */
    stem: string;
    answer: string;
    wrong: [string, string, string];
    note: string;
}

export const questions: Question[] = [
    // 呼び出しと退出
    {
        domain: 'summon',
        stem: 'ある企業では、雑談用のボイスチャンネルでチャットを読み上げたいと考えています。運用上のオーバーヘッドが最も少ない方法はどれですか。',
        answer: 'ボイスチャンネルに入った状態で、読み上げたいテキストチャンネルで `/plz` を打つ',
        wrong: [
            '読み上げ専任の担当者を、24時間365日のシフトで配置する',
            '全員にマイクを配り、テキストチャットを廃止する',
            '読み上げ用のボイスチャンネルを、リージョンごとに冗長化する',
        ],
        note: '`/plz` はだれでも使えます。自分がボイスチャンネルに入っていないと「通話チャンネルに参加してから呼んでね！」と言われます。',
    },
    {
        domain: 'summon',
        stem: 'メンバー全員がボイスチャンネルから退出し、はなこだけが残りました。最も適切な対応はどれですか。',
        answer: '何もしない。はなこが自動で退出する',
        wrong: [
            'はなこが寂しくないよう、当番を決めて誰かが残る',
            'ボイスチャンネルごと削除して、作り直す',
            '障害として扱い、24時間以内に報告書を提出する',
        ],
        note: 'ボイスチャンネルにはなこだけが残ると、自動で退出します。おかげで安心して眠れるそうです。',
    },
    {
        domain: 'summon',
        stem: 'メンテナンスの再起動で、はなこがボイスチャンネルから切断されました。読み上げを再開するために必要な手順はどれですか。',
        answer: '特に必要ない。再起動のあと、元のボイスチャンネルに自動で戻る',
        wrong: [
            '全メンバーで一度退出し、入り直す',
            'サーバーの管理者が手動でフェイルオーバーを実行する',
            '`/plz` を3回続けて打つ',
        ],
        note: '再起動のあとは、元のボイスチャンネルに自動で戻って読み上げを再開します。呼び直す必要はありません。',
    },

    // 読み上げのしくみ
    {
        domain: 'reading',
        stem: '文字数制限を超えた発言の最後に、はなこが読み上げる文言はどれですか。表記まで正確に選んでください。',
        answer: '「イか略。」',
        wrong: ['「以下略。」', '「いか略。」', '「イカ略。」'],
        note: 'カタカナの「イ」に、ひらがなの「か」です。ソースコードには「発音が(・∀・)ｲｲ!!」というコメントが添えられています。',
    },
    {
        domain: 'reading',
        stem: '発言に `https://youtu.be/abc` が含まれていました。はなこは、この部分をどのように読みますか。',
        answer: 'URL全体を、ひとことで「ユーアールエル」と読む',
        wrong: [
            '「エイチティーティーピーエス」から一文字ずつ、最後まで読む',
            'リンク先の動画を再生する',
            'リンク先のタイトルを取得して読む',
        ],
        note: 'URLは「ユーアールエル」に置き換えてから読みます。一文字ずつ読まれないので、通話の平和が保たれます。',
    },
    {
        domain: 'reading',
        stem: '読み上げ対象のチャンネルに、次の発言がありました。はなこが読み上げるものはどれですか。',
        answer: '人間のメンバーによる「こんにちは」という発言',
        wrong: ['`>` で始まる発言', 'ほかのBotの発言', '画像だけで本文のない発言'],
        note: '`>` で始まる発言はコマンドとして扱い、ほかのBotの発言と、本文のない発言は読みません。',
    },
    {
        domain: 'reading',
        stem: '長文が投下され、読み上げが終わりません。はなこをボイスチャンネルに残したまま、今の読み上げと、順番待ちの読み上げをすべて止める方法はどれですか。',
        answer: '`/seibai` を打つ',
        wrong: [
            '`/bye` で帰してから、`/plz` で呼び直す',
            '最後まで聞く。それが礼儀である',
            '長文を書いた人に、続きを音読してもらう',
        ],
        note: '`/seibai` はだれでも使えます。成功すると「戯け者 余の顔を見忘れたか」と返ってきます。',
    },
    {
        domain: 'reading',
        stem: 'はなこがボイスチャンネルにいて、何も読み上げていないときに `/seibai` を打ちました。はなこの返事はどれですか。',
        answer: '「安心せい、みねうちにゃ…」',
        wrong: ['「戯け者 余の顔を見忘れたか」', '「斬り捨て御免」', '「読み上げる音声が見つかりません（404）」'],
        note: '斬る相手がいないときは、みねうちで済ませます。「戯け者 余の顔を見忘れたか」は、本当に止めたときの返事です。',
    },

    // 辞書
    {
        domain: 'dictionary',
        stem: `${limits.wordLengthMax + 1}文字の単語を教育しようとしました。はなこの返事はどれですか。`,
        answer: `「もじながすぎわろたwwww ${limits.wordLengthMax}文字を超える教育はできません」`,
        wrong: ['「入力値が不正です（E_WORD_TOO_LONG）」', '「一文字教育はできないよ」', '「担当部署に確認します」'],
        note: `辞書の単語は${limits.wordLengthMin}〜${limits.wordLengthMax}文字です。超えると笑われます。`,
    },
    {
        domain: 'dictionary',
        stem: '1つのサーバーの辞書に登録できる単語の数の上限はどれですか。',
        answer: `${fmt(limits.dictionaryEntries)}件`,
        wrong: [
            `${fmt(limits.dictionaryEntries / 10)}件`,
            `${fmt(limits.dictionaryEntries * 10)}件`,
            'エンタープライズ契約を結ぶと無制限',
        ],
        note: `上限は${fmt(limits.dictionaryEntries)}件です。エンタープライズ契約はありません。`,
    },
    {
        domain: 'dictionary',
        stem: '`/dictionary-clear` を実行しました。辞書をすべて消す前に、はなこが確認する言葉はどれですか。',
        answer: '「ほんとうにけすのですか？ こうかいしませんね？」',
        wrong: [
            '「この操作は取り消せません。続行しますか？(y/N)」',
            '「稟議書の番号を入力してください」',
            '「白紙に戻すにゃ！」',
        ],
        note: 'スラッシュコマンドでは「実行する」のボタンで、テキストでは `--force` を付けて確定します。',
    },

    // SE
    {
        domain: 'se',
        stem: 'SEのキーワードに「草」を登録しました。「草原に行きたい」という発言は、どのように再生されますか。',
        answer: '「草」でSEが鳴ってから、「原に行きたい」と読む',
        wrong: [
            '「草原」は別の単語なので、SEは鳴らない',
            'SEが鳴り、発言の残りは読まない',
            'はなこが「くさはら」か「そうげん」かを尋ねる',
        ],
        note: 'キーワードが発言の一部に含まれていれば鳴ります。だから草原でも鳴ります。',
    },
    {
        domain: 'se',
        stem: '次のうち、SEとして登録できる音声ファイルはどれですか。',
        answer: `長さ${limits.seSeconds / 2}秒・サイズ${limits.seFileMB / 2}MBの .mp3`,
        wrong: [
            `長さ${limits.seSeconds / 2}秒・サイズ${limits.seFileMB + 1}MBの .mp3`,
            `長さ${limits.seSeconds + 30}秒・サイズ${limits.seFileMB / 2}MBの .wav`,
            `長さ${limits.seSeconds / 2}秒・サイズ${limits.seFileMB / 2}MBの .flac`,
        ],
        note: `対応しているのは .wav と .mp3 で、1ファイル${limits.seFileMB}MB、${limits.seSeconds}秒までです。`,
    },
    {
        domain: 'se',
        stem: `サーバーのSEの保存容量が上限の${limits.seStorageGB}GBに達しました。何が起きますか。`,
        answer: '新しいSEを登録できなくなる。登録済みのSEは消えない',
        wrong: [
            '古いSEから順に自動で消える',
            '上位のストレージプランに自動で切り替わり、請求が発生する',
            'すべてのSEの音質が下がる',
        ],
        note: '登録済みのSEは消しません。上位のプランも請求もありません。',
    },

    // 権限とブラックリスト
    {
        domain: 'admin',
        stem: '最小権限の原則を意識して、モデレーターに `/blacklist-add` を任せることにしました。このコマンドを使える初期の権限はどれですか。',
        answer: 'メンバーをタイムアウト',
        wrong: ['サーバー管理', '権限は不要で、だれでも使える', 'はなこへの貢ぎ物'],
        note: 'ブラックリストの追加・除外・一覧は「メンバーをタイムアウト」、全解除は「サーバー管理」が初期の権限です。',
    },
    {
        domain: 'admin',
        stem: 'ブラックリストの全員を一度に解除する、日本語のテキストコマンドはどれですか。',
        answer: '大赦',
        wrong: ['恩赦', '沈黙', '放免'],
        note: '1人を解除するのが「恩赦」、全員を解除するのが「大赦」です。追加は「沈黙」、一覧は「名簿」です。',
    },
    {
        domain: 'admin',
        stem: 'サーバーの管理者が `/limit number:0` を実行しました。読み上げはどうなりますか。',
        answer: '文字数制限が解除され、最後まで読むようになる',
        wrong: [
            '何も読まなくなる',
            'すべての発言を「イか略。」とだけ読む',
            '0文字は指定できないので、エラーになる',
        ],
        note: `0は「制限なし」の意味です。上限を決めるときは${fmt(limits.readLimitMax)}文字まで指定できます。`,
    },

    // ビジネス価値と運
    {
        domain: 'business',
        stem: 'メンバー300人のコミュニティが、最もコスト効率の高いプランを選ぼうとしています。正しい説明はどれですか。',
        answer: 'どのなかよし度でも料金は¥0で、使える機能も同じ',
        wrong: [
            'なかよし度Lv.3の年間契約が最も割安',
            '300人を超えるとボリュームディスカウントが適用される',
            '営業担当者に見積もりを依頼する必要がある',
        ],
        note: 'どれだけ使いこなしても、ずっと無料です。営業担当者はいません。',
    },
    {
        domain: 'business',
        stem: 'ある企業が、本番リリースの可否を `/ask` で判断しようとしています。`/ask` の回答の根拠として正しいものはどれですか。',
        answer: '運。コマンドの説明にも「運を天に任せます」と書かれている',
        wrong: ['過去の会話を学習したAIの推論', '有識者会議の答申', 'サーバーの管理者の意向'],
        note: '「はい」と「いいえ」は半々の確率で決まります。本番リリースの判断には、別の方法をおすすめします。',
    },
    {
        domain: 'business',
        stem: 'はなこの声を実際に作っているのはどれですか。',
        answer: '別に動いている音声サーバー（Ebyroidなど）',
        wrong: ['はなこ本人の声帯', 'ボイスチャンネルにいる誰か', 'Discordの標準機能'],
        note: 'はなこ自身は音声を作りません。「えびろいどがいないと、わたし喋れないの。」とのことです。',
    },
];

/** 出題範囲の各分野が、問題全体に占める割合（%） */
export const domainWeights = domains.map((domain) => ({
    ...domain,
    weight: Math.round((questions.filter((q) => q.domain === domain.id).length / questions.length) * 100),
}));
