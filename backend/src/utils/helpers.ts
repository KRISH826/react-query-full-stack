export const toArray = (value: string | string[] | undefined): string[] => {
    if (!value) {
        return [];
    }
    if (Array.isArray(value)) {
        return value;
    }
    return [value];
}
