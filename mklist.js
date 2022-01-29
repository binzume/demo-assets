const fs = require('fs');
const path = require('path');
const targets = ['images', 'videos', 'models', 'README.md'];
const types = {
    '.vrm': 'application/vrm',
    '.glb': 'model/gltf-binary',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.mp4': 'video/mp4',
    '.md': 'text/plain',
};

let files = [];
function traverse(file) {
    let stats = fs.statSync(file);
    if (stats.isDirectory()) {
        fs.readdirSync(file).map(f => file + '/' + f).forEach(traverse);
    } else if (types[path.extname(file)] && !file.match(/_thumb\.jpg$/)) {
        let thumb = file.replace(/\.[^\.]+$/, '_thumb.jpg');
        let thumbExists = fs.existsSync(thumb);
        files.push({
            name: path.basename(file),
            path: file,
            url: file,
            size: stats.size,
            updatedTime: stats.mtime,
            type: types[path.extname(file)],
            thumbnailUrl: thumbExists ? thumb : null,
        });
    }
}
targets.forEach(traverse);
console.log(JSON.stringify({ name: 'Demo assets', items: files }));
