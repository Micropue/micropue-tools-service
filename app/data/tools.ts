export interface ToolCategory {
  code: string
  name: string
}

export interface Tool {
  name: string
  description: string
  /** Category code, e.g. "02" */
  category: string
}

export const categories: ToolCategory[] = [
  { code: '01', name: 'Text' },
  { code: '02', name: 'Image' },
  { code: '03', name: 'Audio' },
  { code: '04', name: 'Video' },
  { code: '05', name: 'Developer' },
  { code: '06', name: 'Network' },
  { code: '07', name: 'Security' },
  { code: '08', name: 'AI' }
]

export const tools: Tool[] = [
  { name: 'JSON Beautify', description: 'Format, validate and minify JSON in one pass.', category: '01' },
  { name: 'Markdown Preview', description: 'Live render Markdown while you type.', category: '01' },
  { name: 'Word Counter', description: 'Count words, characters and reading time.', category: '01' },
  { name: 'Diff Checker', description: 'Compare two texts line by line.', category: '01' },
  { name: 'Case Converter', description: 'camelCase, snake_case, kebab and more.', category: '01' },
  { name: 'Image Compressor', description: 'Shrink PNG, JPEG and WebP without visible loss.', category: '02' },
  { name: 'Background Remover', description: 'Cut out subjects in a single click.', category: '02' },
  { name: 'SVG to PNG', description: 'Export vector files at any resolution.', category: '02' },
  { name: 'ICO Generator', description: 'Build favicons for every platform.', category: '02' },
  { name: 'EXIF Viewer', description: 'Inspect camera metadata hidden in photos.', category: '02' },
  { name: 'Palette Extractor', description: 'Pull a colour palette out of any image.', category: '02' },
  { name: 'Audio Trimmer', description: 'Cut and fade audio right in the browser.', category: '03' },
  { name: 'Speech to Text', description: 'Transcribe meetings and voice notes.', category: '03' },
  { name: 'BPM Detector', description: 'Find the tempo of any track.', category: '03' },
  { name: 'Volume Booster', description: 'Normalise loudness in seconds.', category: '03' },
  { name: 'Video to GIF', description: 'Turn short clips into looping GIFs.', category: '04' },
  { name: 'Subtitle Sync', description: 'Shift and merge SRT files precisely.', category: '04' },
  { name: 'Frame Extractor', description: 'Grab stills from any video file.', category: '04' },
  { name: 'Video Compressor', description: 'Smaller files with the same quality.', category: '04' },
  { name: 'Keyboard Tester', description: 'Check every key and switch.', category: '05' },
  { name: 'Cron Parser', description: 'Explain cron expressions in plain words.', category: '05' },
  { name: 'JWT Debugger', description: 'Decode and verify tokens locally.', category: '05' },
  { name: 'Regex Tester', description: 'Build and debug patterns live.', category: '05' },
  { name: 'Diff Merge', description: 'Resolve text conflicts quickly.', category: '05' },
  { name: 'DNS Lookup', description: 'Inspect records for any domain.', category: '06' },
  { name: 'SSL Checker', description: 'Verify certificates and expiry dates.', category: '06' },
  { name: 'IP Calculator', description: 'Subnet math without mistakes.', category: '06' },
  { name: 'Port Scanner', description: 'See what is open on a host.', category: '06' },
  { name: 'URL Shortener', description: 'Short links with click statistics.', category: '06' },
  { name: 'WHOIS Lookup', description: 'Find domain ownership data.', category: '06' },
  { name: 'Password Generator', description: 'Strong, random, generated offline.', category: '07' },
  { name: 'Hash Generator', description: 'MD5, SHA-1 and SHA-256 digests.', category: '07' },
  { name: 'Base64 Encoder', description: 'Encode files and strings safely.', category: '07' },
  { name: 'UUID Generator', description: 'Bulk IDs in any format you need.', category: '07' },
  { name: 'QR Generator', description: 'Custom QR codes with your logo.', category: '07' },
  { name: 'Prompt Polisher', description: 'Rewrite prompts for better output.', category: '08' },
  { name: 'AI Detector', description: 'Estimate if text was machine made.', category: '08' },
  { name: 'Token Counter', description: 'Count tokens before you send.', category: '08' },
  { name: 'Image Captioner', description: 'Automatic captions for any picture.', category: '08' },
  { name: 'Voice Cloner', description: 'Preview synthetic voices in seconds.', category: '08' }
]
