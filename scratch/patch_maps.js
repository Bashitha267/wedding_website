const fs = require('fs');

fs.readdirSync('app/templates').forEach(t => {
    if(t === 'christian' || t === 'minimal' || t === 'car' || t === 'ceylon') return;
    try {
        const path = 'app/templates/'+t+'/page.tsx';
        let text = fs.readFileSync(path, 'utf8');
        
        // 1. Fix the mapped array so that the first item (main location) always has a dummy fallback
        text = text.replace(/data\?\.location,\s*data\?\.churchLocation/, "data?.location || { name: 'The Grand Venue', address: '123 Dream Avenue, Celebration City' }, \n                data?.churchLocation");
        
        // 2. Fix the iframe src to correctly embed Google Maps dynamically
        text = text.replace(/<iframe[^>]*src=[^>]*width=/g, `<iframe
                      src={\`https://maps.google.com/maps?q=\${encodeURIComponent((loc?.name || 'Venue') + ' ' + (loc?.address && !loc?.address.includes('http') ? loc.address : ''))}&t=&z=14&ie=UTF8&iwloc=&output=embed\`}
                      width=`);
                      
        fs.writeFileSync(path, text);
        console.log('Patched map for', t);
    } catch(e) {
        console.error('Failed', t, e);
    }
});
