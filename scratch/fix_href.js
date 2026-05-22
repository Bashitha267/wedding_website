const fs = require('fs');

const files = [
    'aviation', 'fusion', 'outback', 'scrapbook', 'sydney', 'weddingwalk'
];

files.forEach(t => {
    try {
        const path = 'app/templates/'+t+'/page.tsx';
        let text = fs.readFileSync(path, 'utf8');

        // Replace href="#" with href={loc?.address || '#'} where it's near the location block
        text = text.replace(/<a href="#"/g, '<a href={loc?.address || "#"}');
        
        fs.writeFileSync(path, text);
        console.log('Fixed href in', t);
    } catch(e) {
        console.error('Failed', t, e);
    }
});
