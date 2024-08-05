interface ColorPalette {
    [key: string]: {
        [key: string]: string | {
            [key: string]: string;
        } | string;
    };
}
export declare const getCombinations: (colors: ColorPalette) => string[];
export declare const colorClasses: string[];
export declare const variantColorClasses: string[];
export {};
