
export default class TextUtil {
    static replaceSpaces (value: string): string{
        return value.replace(/ /g, "-");
    }
}
