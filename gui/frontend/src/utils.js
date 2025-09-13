import * as constants from "./consts";
import {EmptyString, SeparateItemsWith} from "./consts";

export function randomStringGenerator() {
    return (Math.random() + 1).toString(36).substring(7);
}

export function splitAuthors(authorNames) {
    const authors = authorNames.split(constants.MultiAuthorSeparator)

    let authorValue = EmptyString;
    for (let i = 0; i < authors.length; i++) {
        authorValue += authors[i]
        if (i !== authors.length - 1) {
            authorValue += SeparateItemsWith;
        }
    }
    authorValue.trim();

    return authorValue;
}

export function formatDate(date) {
    const d = new Date(date);
    return d.getFullYear();
}

// Eg. we need this format for the DB: "2016-01-01T00:00:00Z"
export function formatPublishDate(year) {
    return `${year}-01-01T00:00:00Z`;
}

export function implode(arr, implodeChar = SeparateItemsWith) {
    if (arr.length === 0) return EmptyString;
    if (arr.length === 1) return arr[0];
    return arr.slice(0, -1).join(", ") + implodeChar + arr[arr.length - 1];
}