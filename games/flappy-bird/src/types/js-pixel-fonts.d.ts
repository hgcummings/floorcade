declare module 'js-pixel-fonts' {
    interface Fonts {
        sevenPlus: Font;
        slumbers: Font;
    }
    
    interface Font {
    }

    type Color = [number, number, number];

    export const fonts: Fonts;

    export function renderPixels(text: string, font: Font);

    export function renderImage(text: string, font: Font, options: { foreground: Color, background: Color, scale?: number });
}
