const fs = require('fs');

fs.readdirSync('app/templates').forEach(t => {
    if(t === 'car' || t === 'ceylon') return;
    try {
        const path = 'app/templates/'+t+'/page.tsx';
        let text = fs.readFileSync(path, 'utf8');

        // 1. Remove the entire div containing the iframe
        text = text.replace(/<div[^>]*>\s*<iframe[\s\S]*?<\/iframe>\s*<\/div>/g, '');
        
        // 1b. For templates where iframe might not be wrapped in a div (just in case), or minimal template which has an activeLocation iframe
        text = text.replace(/<iframe[\s\S]*?<\/iframe>/g, '');

        // 2. Hide or format the raw URL in the address paragraph
        // We look for {loc?.address} or {loc?.address || ...} inside a tag (usually <p> or <div>)
        // Since different templates use different tags for the address, let's just do a smart regex or just leave the raw text there,
        // Actually, replacing `{loc?.address}` with `{loc?.address?.startsWith('http') ? <a href={loc.address} target="_blank" style={{ textDecoration: 'underline', color: 'inherit' }}>View on Map</a> : loc?.address}`
        // We must also handle `{loc?.address || 'Some Fallback'}`
        
        text = text.replace(/>\{loc\?\.address\}</g, ">{loc?.address?.startsWith('http') ? <a href={loc.address} target=\"_blank\" style={{ textDecoration: 'underline', color: 'inherit' }}>View on Google Maps</a> : loc?.address}<");
        text = text.replace(/>\{loc\?\.address \|\| '([^']+)'\}</g, ">{loc?.address?.startsWith('http') ? <a href={loc.address} target=\"_blank\" style={{ textDecoration: 'underline', color: 'inherit' }}>View on Google Maps</a> : (loc?.address || '$1')}<");
        
        // For minimal template which uses activeLocation.address
        text = text.replace(/>\{activeLocation\.address\}</g, ">{activeLocation.address?.startsWith('http') ? <a href={activeLocation.address} target=\"_blank\" style={{ textDecoration: 'underline', color: 'inherit' }}>View on Google Maps</a> : activeLocation.address}<");

        // For christian template which uses churchLocation.address directly
        text = text.replace(/>\s*\{churchLocation\.address\}\s*</g, ">{churchLocation?.address?.startsWith('http') ? <a href={churchLocation.address} target=\"_blank\" style={{ textDecoration: 'underline', color: 'inherit' }}>View on Google Maps</a> : churchLocation?.address}<");
        
        // Remove empty lines left behind by the removed iframe divs
        text = text.replace(/\n\s*\n\s*\n/g, '\n\n');

        fs.writeFileSync(path, text);
        console.log('Removed map from', t);
    } catch(e) {
        console.error('Failed', t, e);
    }
});
