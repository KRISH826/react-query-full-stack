export function renderTemplate(template: string, variables: Record<string, any>) {
    let result = template

    for (const key in variables) {
        result = result.replace(
            new RegExp(`{{${key}}}`, "g"),
            variables[key] ?? ""
        )
    }

    return result
}