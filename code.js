const article = document.querySelector("*");

if(article) {
    const text = article.textContent;

    if(text.match("violence").length > 0) {
        const badge = document.createElement("p");
        badge.classList.add("color-secondary-text", "type--caption");
        badge.textContent = "!! May contain topics of violence. !!";
        article.querySelector("h1").insertAdjacentElement("afterend", badge);
    }
}
