import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎨 MAPEO DE REEMPLAZO DE COLORES
const COLOR_REPLACEMENTS = {
    // Blue → Primary (Celeste)
    'blue-50': 'primary-50',
    'blue-100': 'primary-100',
    'blue-200': 'primary-200',
    'blue-300': 'primary-300',
    'blue-400': 'primary-400',
    'blue-500': 'primary-500',
    'blue-600': 'primary-600',
    'blue-700': 'primary-700',
    'blue-800': 'primary-800',
    'blue-900': 'primary-900',

    // Purple/Violet → Accent (Cyan para empresas/CTAs)
    'purple-50': 'accent-300',
    'purple-100': 'accent-300',
    'purple-200': 'accent-400',
    'purple-300': 'accent-400',
    'purple-400': 'accent-400',
    'purple-500': 'accent-500',
    'purple-600': 'accent-600',
    'purple-700': 'accent-700',
    'purple-800': 'accent-700',
    'purple-900': 'accent-700',

    'violet-50': 'accent-300',
    'violet-100': 'accent-300',
    'violet-200': 'accent-400',
    'violet-300': 'accent-400',
    'violet-400': 'accent-400',
    'violet-500': 'accent-500',
    'violet-600': 'accent-600',
    'violet-700': 'accent-700',

    // Gradientes específicos (deben ir ANTES de los colores individuales)
    'from-blue-600 to-purple-600': 'from-primary-500 to-accent-500',
    'from-purple-600 to-blue-600': 'from-accent-500 to-primary-500',
    'from-blue-500 to-blue-600': 'from-primary-500 to-primary-600',
    'from-purple-500 to-purple-600': 'from-accent-500 to-accent-600',
    'from-blue-600/10 to-purple-600/10': 'from-primary-500/10 to-accent-500/10',
    'from-blue-900 to-slate-900': 'from-secondary-900 via-secondary-800 to-secondary-900',
    'from-blue-50 via-white to-purple-50': 'from-secondary-50 via-white to-primary-50',
};

// 🔍 Función para buscar archivos recursivamente
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const filePath = path.join(dirPath, file);

        if (fs.statSync(filePath).isDirectory()) {
            // Ignorar node_modules y otras carpetas
            if (!['node_modules', '.git', 'build', 'dist', '.next'].includes(file)) {
                arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
            }
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts')) {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}

// 🎨 Función para reemplazar colores en un archivo
function replaceColorsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let replacementCount = 0;

    // Reemplazar cada patrón de color
    Object.entries(COLOR_REPLACEMENTS).forEach(([oldColor, newColor]) => {
        const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);

        if (matches) {
            content = content.replace(regex, newColor);
            modified = true;
            replacementCount += matches.length;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${path.relative(process.cwd(), filePath)} - ${replacementCount} reemplazos`);
        return replacementCount;
    }

    return 0;
}

// 🚀 EJECUTAR
console.log('\n🎨 Actualizando colores en toda la aplicación...\n');

const srcPath = path.join(__dirname, '../src');
const files = getAllFiles(srcPath);

let totalFiles = 0;
let totalReplacements = 0;

files.forEach((file) => {
    const count = replaceColorsInFile(file);
    if (count > 0) {
        totalFiles++;
        totalReplacements += count;
    }
});

console.log(`\n✨ ¡Completado!`);
console.log(`📁 Archivos modificados: ${totalFiles}`);
console.log(`🎨 Total de reemplazos: ${totalReplacements}\n`);
console.log(`💡 Ahora todos los colores están centralizados en:`);
console.log(`   - tailwind.config.js (para Tailwind)`);
console.log(`   - src/index.css (variables CSS)\n`);
