import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const rootDir = process.cwd();
const publicImagesDir = path.join(rootDir, 'public', 'images');
const outputRoot = path.join(publicImagesDir, 'mobile-frames');
const maxWidth = Number(process.env.MOBILE_FRAME_WIDTH || 900);
const quality = Number(process.env.MOBILE_FRAME_QUALITY || 72);

const sequences = [
  { name: 'hero-intro', source: 'heroframes', start: 1, sourceCount: 80, outputCount: 40 },
  { name: 'hero-healthcare', source: 'healthcarejpgframes', start: 1, sourceCount: 80, outputCount: 40 },
  { name: 'hero-ecommerce', source: 'e-commercejpgFrames', start: 1, sourceCount: 64, outputCount: 32 },
  { name: 'hero-hrms', source: 'hrmsjpgframes', start: 1, sourceCount: 80, outputCount: 40 },
  { name: 'hero-cta', source: 'heroframes', start: 161, sourceCount: 80, outputCount: 40 },
  { name: 'industry-semiconductor', source: 'semiconductorframes', start: 1, sourceCount: 80, outputCount: 40 },
  { name: 'industry-healthcare', source: 'healthcarejpgframes', start: 1, sourceCount: 80, outputCount: 40 },
  { name: 'industry-ecommerce', source: 'e-commercejpgFrames', start: 1, sourceCount: 64, outputCount: 32 },
  { name: 'industry-hrms', source: 'hrmsjpgframes', start: 1, sourceCount: 80, outputCount: 40 },
  { name: 'industry-custom', source: 'websiteandsoftwareframes', start: 1, sourceCount: 80, outputCount: 40 },
  { name: 'process-semiconductor', source: 'semiconductorframes', start: 1, sourceCount: 240, outputCount: 72 },
];

const frameName = (index) => `ezgif-frame-${String(index).padStart(3, '0')}.jpg`;
const outputName = (index) => `frame-${String(index).padStart(3, '0')}.webp`;

const pickSourceIndex = ({ start, sourceCount, outputCount }, outputIndex) => {
  if (outputCount <= 1) return start;
  return start + Math.round((outputIndex * (sourceCount - 1)) / (outputCount - 1));
};

async function generateSequence(sequence) {
  const outputDir = path.join(outputRoot, sequence.name);
  await fs.mkdir(outputDir, { recursive: true });

  const frames = [];
  for (let outputIndex = 0; outputIndex < sequence.outputCount; outputIndex += 1) {
    const sourceIndex = pickSourceIndex(sequence, outputIndex);
    const sourcePath = path.join(publicImagesDir, sequence.source, frameName(sourceIndex));
    const outputPath = path.join(outputDir, outputName(outputIndex + 1));

    await sharp(sourcePath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toFile(outputPath);

    frames.push({
      frame: `/images/mobile-frames/${sequence.name}/${outputName(outputIndex + 1)}`,
      source: `/images/${sequence.source}/${frameName(sourceIndex)}`,
    });
  }

  return {
    name: sequence.name,
    format: 'webp',
    maxWidth,
    quality,
    sourceCount: sequence.sourceCount,
    outputCount: sequence.outputCount,
    frames,
  };
}

async function main() {
  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(outputRoot, { recursive: true });

  const manifest = {
    generatedAt: new Date().toISOString(),
    sequences: [],
  };

  for (const sequence of sequences) {
    manifest.sequences.push(await generateSequence(sequence));
  }

  await fs.writeFile(
    path.join(outputRoot, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  );

  const totalFrames = manifest.sequences.reduce((sum, sequence) => sum + sequence.outputCount, 0);
  console.log(`Generated ${totalFrames} mobile cinematic frames in ${path.relative(rootDir, outputRoot)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
