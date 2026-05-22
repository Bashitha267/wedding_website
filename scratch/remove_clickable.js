const fs = require('fs');

fs.readdirSync('app/templates').forEach(t => {
    if(t === 'car' || t === 'ceylon') return;
    try {
        const path = 'app/templates/'+t+'/page.tsx';
        let text = fs.readFileSync(path, 'utf8');

        // Replace the "View on Google Maps" clickable link logic with an empty string
        text = text.replace(/\{loc\?\.address\?\.startsWith\('http'\) \? <a href=\{loc\.address\} target="_blank" style=\{\{ textDecoration: 'underline', color: 'inherit' \}\}>View on Google Maps<\/a> :/g, "{loc?.address?.startsWith('http') ? '' :");
        
        text = text.replace(/\{activeLocation\.address\?\.startsWith\('http'\) \? <a href=\{activeLocation\.address\} target="_blank" style=\{\{ textDecoration: 'underline', color: 'inherit' \}\}>View on Google Maps<\/a> :/g, "{activeLocation.address?.startsWith('http') ? '' :");

        text = text.replace(/\{churchLocation\?\.address\?\.startsWith\('http'\) \? <a href=\{churchLocation\.address\} target="_blank" style=\{\{ textDecoration: 'underline', color: 'inherit' \}\}>View on Google Maps<\/a> :/g, "{churchLocation?.address?.startsWith('http') ? '' :");

        fs.writeFileSync(path, text);
        console.log('Fixed link display in', t);
    } catch(e) {
        console.error('Failed', t, e);
    }
});
