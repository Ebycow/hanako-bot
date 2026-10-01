"""シート切り出し画像の端に入り込んだ「隣のコマの断片」を消す。

使い方:
    python clean_edges.py IMG... --out OUT_DIR [--diff DIFF_DIR]

アルゴリズムは README.md を参照。
"""
import argparse
import os

import numpy as np
from PIL import Image
from scipy import ndimage

S8 = np.ones((3, 3))  # 8 近傍


def clean(a, alpha_strong=64, alpha_weak=8, edge=3, max_ratio=0.1):
    """RGBA 配列 a から端の断片を消す。消したピクセルのマスクを返す（a は破壊的に変更）。"""
    al = a[:, :, 3]

    # 1. しっかり不透明な画素だけで連結成分を作る（半透明のにじみで本体と断片がつながるのを防ぐ）
    strong = al > alpha_strong
    lab, n = ndimage.label(strong, structure=S8)
    if n == 0:
        return np.zeros_like(strong)
    areas = ndimage.sum(strong, lab, range(1, n + 1))
    main = int(np.argmax(areas)) + 1

    # 2. 本体以外で、画像の端 edge px に触れていて、本体より十分小さい成分 = 断片
    border = np.zeros_like(strong)
    border[:edge, :] = border[-edge:, :] = border[:, :edge] = border[:, -edge:] = True
    candidates = set(np.unique(lab[border])) - {0, main}
    frag_ids = [i for i in candidates if areas[i - 1] < max_ratio * areas[main - 1]]
    if not frag_ids:
        return np.zeros_like(strong)
    frag = np.isin(lab, frag_ids)
    keep = strong & ~frag

    # 3. 断片から半透明画素へ伸ばす。ただし残す部分の近く（2px）には入り込まない
    region = (al > alpha_weak) & ~ndimage.binary_dilation(keep, iterations=2)
    rl, _ = ndimage.label(region, structure=S8)
    kill = np.isin(rl, np.unique(rl[frag & region])) | frag

    # 4. 断片の縁に残るごく薄いにじみを 2px 分だけ追加で消す（本体の 1px 以内は守る）
    kill = (ndimage.binary_dilation(kill, iterations=2)
            & ~ndimage.binary_dilation(keep, iterations=1)
            & (al > 0)) | frag

    a[kill] = 0
    return kill


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('images', nargs='+')
    ap.add_argument('--out', required=True, help='出力先ディレクトリ（元画像は上書きしない）')
    ap.add_argument('--diff', help='消した範囲を赤で塗った確認用 PNG の出力先')
    ap.add_argument('--quality', type=int, default=92, help='WebP 出力時の品質')
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    if args.diff:
        os.makedirs(args.diff, exist_ok=True)

    for path in args.images:
        im = Image.open(path).convert('RGBA')
        a = np.array(im)
        kill = clean(a)
        name = os.path.basename(path)
        if not kill.any():
            print(f'{name}: 断片なし')
            continue
        if name.lower().endswith('.webp'):
            Image.fromarray(a).save(os.path.join(args.out, name), 'WEBP', quality=args.quality, method=6)
        else:
            Image.fromarray(a).save(os.path.join(args.out, name))
        if args.diff:
            d = np.array(im)
            d[..., 3] = np.where(d[..., 3] > 0, 255, 0)
            d[kill] = [255, 0, 0, 255]
            Image.fromarray(d).save(os.path.join(args.diff, os.path.splitext(name)[0] + '.png'))
        print(f'{name}: {int(kill.sum())} px 削除')


if __name__ == '__main__':
    main()
