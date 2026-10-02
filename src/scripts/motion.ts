// サイト全体の「動きを止める」設定。
// <html class="motion-off"> が付いているあいだ、アニメーションを止める（reveal.css）。
// 初期値は BaseLayout.astro の <head> で決める：保存した設定 → なければ OS の「視差効果を減らす」設定。
// 花びら・タイピング・通話デモなど JavaScript で動かしているものは、onMotionChange で止める・再開する

export const MOTION_STORAGE_KEY = 'hanako-motion';

export const isMotionOff = () => document.documentElement.classList.contains('motion-off');

export const setMotionOff = (off: boolean) => {
    document.documentElement.classList.toggle('motion-off', off);
    try {
        localStorage.setItem(MOTION_STORAGE_KEY, off ? 'off' : 'on');
    } catch {
        // プライベートブラウズなどで保存できなくても、このページの中では切り替わる
    }
    document.dispatchEvent(new CustomEvent('motionchange', { detail: { off } }));
};

export const onMotionChange = (callback: (off: boolean) => void) => {
    document.addEventListener('motionchange', (e) => callback((e as CustomEvent<{ off: boolean }>).detail.off));
};
