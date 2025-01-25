// This is copied from another project of mine so I hope it works :3

import React from "react";
import hljs from "highlight.js";

function parseHyperlinkText(text) {
    if (text == null || text === "")
        return [React.createElement(React.Fragment, null)];
    const regex = /(\[(.*?)]\((.*?)\))|([^\[]+)/g;
    const parts = text.match(regex);
    if (!parts)
        return [React.createElement(React.Fragment, null)];
    if (parts.length > 1) {
        const linkRegex = /\[(.*?)]\((.*?)\)/g;
        return parts.map((part, index) => {
            let subParts = part.split(linkRegex).filter(x => x != undefined && x != "");
            if (subParts.length > 1) {
                return React.createElement("a", { key: index, href: subParts[1] }, subParts[0]);
            }
            return React.createElement("span", { key: index }, subParts[0]);
        });
    }
    return [React.createElement(React.Fragment, null, parts)];
}
function parseDefaultText(text) {
    if (text == null || text === "")
        return [React.createElement(React.Fragment, null)];
    const regex = /$\n|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|~~[^~]+~~|\|\|[^|]+\|\||[^*_~\|\n]+|\*|_|~|\|/gm;
    const parts = text.match(regex);
    if (!parts)
        return [React.createElement(React.Fragment, null)];
    return parts.map((part, index) => {
        const styles = [];
        if (part.match(/$\n/m))
            return React.createElement("br", { key: index });
        if (part.match(/\*\*[^*]+\*\*/))
            styles.push("bold");
        else if (part.match(/\*[^*]+\*/))
            styles.push("italic");
        if (part.match(/\*\*\*[^*]+\*\*\*/))
            styles.push("italic");
        if (part.match(/__[^_]+__/))
            styles.push("underlined");
        if (part.match(/~~[^_]+~~/))
            styles.push("strikethrough");
        if (part.match(/\|\|[^|]+\|\|/))
            styles.push("spoiler");
        if (styles.length > 0) {
            part = part.replace(/\*\*/g, "").replace(/\*/g, "").replace(/__/g, "").replace(/~~/g, "").replace(/\|\|/g, "");
            let result = React.createElement(React.Fragment, null, parseHyperlinkText(part));
            styles.forEach(style => {
                if (style === "bold")
                    result = React.createElement("b", null, result);
                else if (style === "italic")
                    result = React.createElement("i", null, result);
                else if (style === "underlined")
                    result = React.createElement("u", null, result);
                else if (style === "strikethrough")
                    result = React.createElement("s", null, result);
                else if (style === "spoiler")
                    result = React.createElement("span", { className: "spoiler" }, result);
            });
            if (result)
                return result;
        }
        return React.createElement(React.Fragment, null, parseHyperlinkText(part));
    });
}
function parseCodeBlockText(text) {
    text = text.replaceAll("```", "");
    const languages = text.match(/^.*$/m);
    const language = languages ? languages[0] : "plaintext";
    const highlightedText = hljs.highlight(text, { language: language }).value;
    const regex = /$\n|[^\n]+/gm;
    const parts = highlightedText.match(regex);
    if (!parts)
        return [React.createElement(React.Fragment, null)];
    const output = parts.map((part, index) => {
        if (part.match(/$\n/m)) {
            if (index == 0)
                return;
            return React.createElement("br", { key: index });
        }
        return React.createElement("span", { dangerouslySetInnerHTML: { __html: part, } });
    });
    return [React.createElement("code", null, output)];
}
export function parseFormattedText(text) {
    if (text == null || text === "")
        return React.createElement("span", null);
    const codeBoxRegex = /(```(?:[^`]|`(?!``))*```|[^`]+)/gm;
    const richTextRegex = /^-.+$\n|^>.+$\n|.+\n?/gm;
    const parts = text.match(codeBoxRegex);
    if (!parts)
        return React.createElement(React.Fragment, null);
    let output = parts.map((part, index) => {
        if (part.match(/```(?:[^`]|`(?!``))*```/))
            return React.createElement("span", { key: index }, parseCodeBlockText(part));
        let newParts = part.match(richTextRegex);
        if (!newParts)
            return React.createElement(React.Fragment, null);
        return newParts.map((part, index) => {
            if (part.match(/^-.+$\n/gm))
                return React.createElement("li", { key: index }, parseDefaultText(part.replace(/^- /, "")));
            if (part.match(/^>.+$\n/gm))
                return React.createElement("span", { className: "blockquote", key: index }, parseDefaultText(part.replace(/^> /, " ")));
            return React.createElement("span", { key: index }, parseDefaultText(part));
        });
    });
    return React.createElement("span", null, output);
}
