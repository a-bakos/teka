import * as constants from "./consts";

export function randomStringGenerator() {
    return (Math.random() + 1).toString(36).substring(7);
}

export function splitAuthors(authorNames) {
    const authors = authorNames.split(constants.MultiAuthorSeparator)

    let authorValue = "";
    for (let i = 0; i < authors.length; i++) {
        authorValue += authors[i]
        if (i !== authors.length - 1) {
            authorValue += ", ";
        }
    }
    authorValue.trim();

    return authorValue;
}

export function formatDate(date) {
    const d = new Date(date);
    return d.getFullYear();
}