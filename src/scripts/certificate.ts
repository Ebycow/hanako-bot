// 模擬試験の合格者に渡す認定証を canvas に描く。
// そのまま Discord に貼れるよう、HTML ではなく画像として作る。
// 名前や結果はこのブラウザの中だけで使い、どこにも送らない
import { examCode, type Tier } from '../data/certification';

const WIDTH = 1200;
const HEIGHT = 848;
const CENTER = WIDTH / 2;

export interface Certificate {
    name: string;
    tier: Tier;
    score: number;
    /** 認定番号（照会できる台帳はない） */
    number: string;
    issuedOn: string;
    /** 右下に描くはなこの絵 */
    art: HTMLImageElement;
}

/** 認定番号を作る（例：HNK-2026-7K3F9Q） */
export const newCertificateNumber = (date: Date) => {
    const random = Math.random().toString(36).slice(2, 8).padEnd(6, '0').toUpperCase();
    return `HNK-${date.getFullYear()}-${random}`;
};

/** width に収まるよう、文字を小さくしながら描く */
const fitText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, font: (size: number) => string, size: number) => {
    let fitted = size;
    ctx.font = font(fitted);
    while (ctx.measureText(text).width > width && fitted > 12) {
        fitted -= 2;
        ctx.font = font(fitted);
    }
    ctx.fillText(text, x, y);
};

export const drawCertificate = async (canvas: HTMLCanvasElement, cert: Certificate) => {
    const css = getComputedStyle(document.documentElement);
    const color = (name: string) => css.getPropertyValue(name).trim();
    const family = css.getPropertyValue('--font').trim();
    const font = (size: number, weight = 700) => `${weight} ${size}px ${family}`;

    const title = '認定証';
    const nameLine = `${cert.name} 様`;
    const body = ['上記の者は、読み上げBot「はなこ」に関する知識を有し、',`試験 ${examCode} において ${cert.score} 点を取得したことを、ここに認定します。`];
    const details = [`認定番号　${cert.number}`, `発行日　　${cert.issuedOn}`, '有効期限　次に /bye されるまで'];
    const stampChars = ['は', 'な', 'こ'];
    const notice = '※ この認定証はジョークです。実在の資格ではなく、法的な効力もありません。';

    // Webフォントは使う文字だけ読み込まれるので、描く文字を先に読み込んでおく（失敗してもシステムフォントで描ける）
    const allText = [title, nameLine, ...body, ...details, ...stampChars, notice, cert.tier.name, cert.tier.english].join('');
    await Promise.all([500, 700, 900].map((weight) => document.fonts.load(font(16, weight), allText).catch(() => {})));

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d')!;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // 用紙と二重のふち
    ctx.fillStyle = color('--surface');
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = color('--pink-soft');
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.roundRect(26, 26, WIDTH - 52, HEIGHT - 52, 34);
    ctx.stroke();
    ctx.strokeStyle = color('--border-strong');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(46, 46, WIDTH - 92, HEIGHT - 92, 20);
    ctx.stroke();

    // 見出し
    ctx.fillStyle = color('--pink-ink');
    ctx.font = font(20, 900);
    ctx.fillText('HANAKO CERTIFICATION PROGRAM', CENTER, 112);
    ctx.font = font(74, 900);
    ctx.fillText(title, CENTER, 198);

    // 宛名
    ctx.fillStyle = color('--text');
    fitText(ctx, nameLine, CENTER, 300, 760, (size) => font(size, 900), 50);
    ctx.strokeStyle = color('--pink-soft');
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(CENTER - 320, 322);
    ctx.lineTo(CENTER + 320, 322);
    ctx.stroke();

    // 本文
    ctx.fillStyle = color('--text-muted');
    ctx.font = font(23, 500);
    body.forEach((line, i) => ctx.fillText(line, CENTER, 376 + i * 38));

    // 資格の名前
    ctx.fillStyle = color('--pink-deep');
    ctx.font = font(46, 900);
    ctx.fillText(cert.tier.name, CENTER, 512);
    ctx.fillStyle = color('--text-dim');
    ctx.font = font(21, 700);
    ctx.fillText(cert.tier.english, CENTER, 548);

    // 発行の情報
    ctx.textAlign = 'left';
    ctx.fillStyle = color('--text-muted');
    ctx.font = font(20, 500);
    details.forEach((line, i) => ctx.fillText(line, 96, 640 + i * 34));

    // 発行者とハンコ（はなこ印）
    ctx.textAlign = 'center';
    ctx.fillStyle = color('--text');
    ctx.font = font(18, 700);
    ctx.fillText('Hanako認定委員会', 648, 664);
    ctx.font = font(23, 900);
    ctx.fillText('委員長　はなこ', 648, 700);

    const red = color('--red');
    ctx.save();
    ctx.translate(792, 672);
    ctx.rotate(-0.14);
    ctx.strokeStyle = red;
    ctx.fillStyle = red;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 54, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = font(27, 900);
    stampChars.forEach((char, i) => ctx.fillText(char, 0, -19 + i * 29));
    ctx.restore();

    ctx.drawImage(cert.art, 880, 536, 256, 256);

    ctx.fillStyle = color('--text-dim');
    ctx.font = font(16, 500);
    ctx.fillText(notice, 470, 778);
};
