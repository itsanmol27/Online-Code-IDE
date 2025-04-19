import fs from 'fs/promises';
import path from 'path';

async function generateFileTree(directory) {
    const tree = {};

    async function buildTree(currentDir, currentTree) { 
        const files = await fs.readdir(currentDir);

        for (const file of files) {
            const filePath = path.join(currentDir, file);

            let stats;
            try {
                stats = await fs.lstat(filePath);
            } catch (err) {
                continue;
            }

            if (stats.isDirectory()) {
                currentTree[file] = {};
                await buildTree(filePath, currentTree[file]);
            } else {
                currentTree[file] = null;
            }
        }
    }

    await buildTree(directory, tree);
    return tree;
}

export default generateFileTree;
