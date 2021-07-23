// python3 -m http.server 8000 --bind 127.0.0.1

function getListSection(tag) {
    let bookmarks = document.getElementById('Bookmarks');
    let section = document.querySelector(`[data-tag="${ tag }"]`);
    if (!section) {
        let list = document.getElementById('List');
        let clone = list.content.cloneNode(true);
        let header = clone.querySelector('h2');
        section = clone.querySelector('section');
        section.setAttribute('data-tag', tag);
        header.textContent = tag;
        bookmarks.appendChild(clone);
    }
    return section;
}

fetch(`pb.json`)
    .then(response => response.json())
    .then((data) => {
        data.forEach(el => {
            let template = document.getElementById('Item');
            el.tags.split(' ')
            .filter(t => {
                return t.trim() !== '';
            })
            .forEach((t) => {
                let section = getListSection(t);
                let clone = template.content.cloneNode(true);
                let list = section.querySelector(`ul`);
                let anchor = clone.querySelector('a');
                anchor.textContent = el.description;
                anchor.setAttribute('href', el.href);
                list.appendChild(clone);
            });
        });
    });