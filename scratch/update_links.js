const fs = require('fs');
const path = require('path');

const templatesDir = path.join('c:/Users/nimes/Desktop/wedding/app/templates');
const templateDirs = fs.readdirSync(templatesDir);

for (const dir of templateDirs) {
    const pagePath = path.join(templatesDir, dir, 'page.tsx');
    if (!fs.existsSync(pagePath)) continue;

    let content = fs.readFileSync(pagePath, 'utf8');
    let original = content;

    // Replace <a href="https://maps.app.goo.gl/example" ...>VIEW LOCATION</a>
    content = content.replace(/<a([^>]*)href="https:\/\/maps\.app\.goo\.gl\/example"([^>]*)>([\s\S]*?VIEW LOCATION[\s\S]*?)<\/a>/g, (match, p1, p2, p3) => {
        return `<a${p1}href={loc?.address?.includes('http') ? loc.address : \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent((loc?.name || '') + ' ' + (loc?.address || ''))}\`}${p2}>${p3}</a>`;
    });

    // Replace href={loc?.mapUrl || "#"} ... VIEW LOCATION
    content = content.replace(/href=\{loc\?\.mapUrl\s*\|\|\s*[^}]+\}([^>]*>[\s\S]*?VIEW LOCATION)/g, (match, p1) => {
        return `href={loc?.address?.includes('http') ? loc.address : \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent((loc?.name || '') + ' ' + (loc?.address || ''))}\`}${p1}`;
    });

    if (content !== original) {
        fs.writeFileSync(pagePath, content);
        console.log('Updated', pagePath);
    }
}
