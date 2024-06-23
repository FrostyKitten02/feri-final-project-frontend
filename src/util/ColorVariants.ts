export default class ColorVariants {
    static getFocus = (color: string | undefined): string => {
        const colorVariants: Record<string, string> = {
            DEFAULT: 'focus:ring-teal-500',
            primary: 'focus:ring-primary',
            secondary: 'focus:ring-secondary'
        }
        return colorVariants[color ?? "DEFAULT"]
    }

    static getText = (color: string | undefined): string => {
        const colorVariants: Record<string, string> = {
            DEFAULT: 'text-teal-500',
            primary: 'text-primary',
            secondary: 'text-secondary'
        }
        return colorVariants[color ?? "DEFAULT"]
    }
}