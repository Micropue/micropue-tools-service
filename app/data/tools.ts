export interface ToolCategory {
  code: string
  name: string
}

export interface Tool {
  slug: string
  name: string
  description: string
  /** Category code, e.g. "02" */
  category: string
  /** Component name under app/components/tools/, absent = coming soon */
  component?: string
}

export const categories: ToolCategory[] = [
  { code: '01', name: 'Text' },
  { code: '02', name: 'Developer' },
  { code: '03', name: 'Image' },
  { code: '04', name: 'Convert' },
  { code: '05', name: 'Math' },
  { code: '06', name: 'QR & Barcode' },
  { code: '07', name: 'Files' },
  { code: '08', name: 'Browser' },
  { code: '09', name: 'Time' },
  { code: '10', name: 'Design' },
  { code: '11', name: 'Security' }
]

export const tools: Tool[] = [
  // 01 Text
  { slug: 'case-converter', name: 'Case Converter', description: 'Uppercase, lowercase, title case and sentence case, live.', category: '01', component: 'CaseConverter' },
  { slug: 'text-dedupe', name: 'Text Dedupe', description: 'Remove duplicate lines, keep the first or last occurrence.', category: '01', component: 'TextDedupe' },
  { slug: 'text-sort', name: 'Text Sort', description: 'Sort lines alphabetically, numerically or by length; pinyin for Chinese.', component: 'TextSort', category: '01' },
  { slug: 'whitespace-cleaner', name: 'Whitespace Cleaner', description: 'Trim lines, collapse spaces and remove blank or invisible characters.', component: 'WhitespaceCleaner', category: '01' },
  { slug: 'character-counter', name: 'Character Counter', description: 'Count characters, words, lines, letters, digits and CJK.', category: '01', component: 'CharCounter' },
  { slug: 'text-diff', name: 'Text Diff', description: 'Compare two texts and highlight added and removed lines.', category: '01', component: 'TextDiff' },
  { slug: 'text-reverse', name: 'Text Reverse', description: 'Reverse the whole text, each line or the word order.', component: 'TextReverse', category: '01' },
  { slug: 'escape-tool', name: 'Escape / Unescape', description: 'HTML entities, URL, Unicode and JSON string escaping.', component: 'EscapeTool', category: '01' },
  { slug: 'markdown-preview', name: 'Markdown Preview', description: 'Live Markdown preview with copyable source.', component: 'MarkdownPreview', category: '01' },
  { slug: 'lorem-generator', name: 'Lorem Ipsum', description: 'Generate placeholder text by paragraphs, sentences or words.', component: 'LoremGenerator', category: '01' },

  // 02 Developer
  { slug: 'json-formatter', name: 'JSON Formatter', description: 'Beautify, minify and validate JSON with error position.', category: '02', component: 'JsonFormatter' },
  { slug: 'json-converter', name: 'JSON Converter', description: 'Convert JSON to YAML, CSV or TypeScript types.', component: 'JsonConverter', category: '02' },
  { slug: 'base64', name: 'Base64', description: 'Encode and decode UTF-8 text and files as Base64.', category: '02', component: 'Base64Tool' },
  { slug: 'url-codec', name: 'URL Encoder', description: 'encodeURIComponent, decode and parse query parameters.', category: '02', component: 'UrlCodec' },
  { slug: 'jwt-decoder', name: 'JWT Decoder', description: 'Read header, payload and expiry. Signature is not verified.', component: 'JwtDecoder', category: '02' },
  { slug: 'uuid-generator', name: 'UUID Generator', description: 'Generate UUID v4 in batches.', category: '02', component: 'UuidTool' },
  { slug: 'timestamp', name: 'Timestamp Converter', description: 'Unix seconds or milliseconds to dates, local and UTC.', category: '02', component: 'TimestampTool' },
  { slug: 'regex-tester', name: 'Regex Tester', description: 'Test patterns, highlight matches and inspect capture groups.', category: '02', component: 'RegexTester' },
  { slug: 'code-formatter', name: 'Code Formatter', description: 'Beautify and minify HTML, CSS and JavaScript.', component: 'CodeFormatter', category: '02' },
  { slug: 'color-converter', name: 'Color Converter', description: 'Convert HEX, RGB, HSL and HSV with a picker.', category: '02', component: 'ColorConverter' },
  { slug: 'hash-generator', name: 'Hash Generator', description: 'SHA-1, SHA-256, SHA-384 and SHA-512 via Web Crypto.', category: '02', component: 'HashTool' },
  { slug: 'html-entities', name: 'HTML Entities', description: 'Encode and decode HTML special characters.', component: 'HtmlEntities', category: '02' },
  { slug: 'css-gradient', name: 'CSS Gradient', description: 'Build linear or radial gradients with a live preview.', component: 'CssGradient', category: '02' },
  { slug: 'box-shadow', name: 'Box Shadow', description: 'Design single or layered box shadows and copy the CSS.', component: 'BoxShadow', category: '02' },
  { slug: 'border-radius', name: 'Border Radius', description: 'Tune each corner independently and copy the CSS.', component: 'BorderRadius', category: '02' },
  { slug: 'flexbox-generator', name: 'Flexbox Generator', description: 'Configure direction, alignment and gap with a preview.', component: 'FlexboxGenerator', category: '02' },
  { slug: 'grid-generator', name: 'Grid Generator', description: 'Configure columns, rows and gaps with a preview.', component: 'GridGenerator', category: '02' },
  { slug: 'data-uri', name: 'Data URI', description: 'Convert images to Data URIs and back.', component: 'DataUriTool', category: '02' },

  // 03 Image
  { slug: 'image-convert', name: 'Image Converter', description: 'Convert PNG, JPEG and WebP locally in the browser.', component: 'ImageConvert', category: '03' },
  { slug: 'image-compress', name: 'Image Compressor', description: 'Adjust format and quality, compare before and after size.', component: 'ImageCompress', category: '03' },
  { slug: 'image-resize', name: 'Image Resize', description: 'Resize by pixels or percentage, optionally lock the ratio.', component: 'ImageResize', category: '03' },
  { slug: 'image-crop', name: 'Image Crop', description: 'Free crop or 1:1, 4:3, 16:9 and 3:2 ratios.', component: 'ImageCrop', category: '03' },
  { slug: 'image-rotate', name: 'Image Rotate', description: 'Rotate by 90/180/270 degrees and flip horizontally or vertically.', component: 'ImageRotate', category: '03' },
  { slug: 'image-rounded', name: 'Image Rounded', description: 'Round image corners and export transparent PNG.', component: 'ImageRounded', category: '03' },
  { slug: 'image-watermark', name: 'Image Watermark', description: 'Add local text watermarks with color, opacity and rotation.', component: 'ImageWatermark', category: '03' },
  { slug: 'image-color-picker', name: 'Image Color Picker', description: 'Pick pixel colors from an image and copy HEX, RGB or HSL.', component: 'ImageColorPicker', category: '03' },
  { slug: 'image-base64', name: 'Image Base64', description: 'Convert images to Data URIs and preview Base64 images.', component: 'DataUriTool', category: '03' },
  { slug: 'image-info', name: 'Image Info', description: 'File name, format, dimensions and size; EXIF when readable.', component: 'ImageInfo', category: '03' },
  { slug: 'image-stitch', name: 'Image Stitch', description: 'Join multiple images horizontally or vertically.', component: 'ImageStitch', category: '03' },
  { slug: 'image-blur', name: 'Image Blur', description: 'Blur or pixelate an image and download the result.', component: 'ImageBlur', category: '03' },

  // 04 Convert
  { slug: 'radix-converter', name: 'Radix Converter', description: 'Binary, octal, decimal and hexadecimal conversion.', component: 'RadixConverter', category: '04' },
  { slug: 'ascii-converter', name: 'ASCII Converter', description: 'Convert between ASCII codes and characters.', component: 'AsciiConverter', category: '04' },
  { slug: 'unicode-converter', name: 'Unicode Converter', description: 'Look up and convert Unicode code points.', component: 'UnicodeConverter', category: '04' },
  { slug: 'length-converter', name: 'Length Converter', description: 'mm, cm, m, km, in, ft and px (with DPI notes).', component: 'LengthConverter', category: '04' },
  { slug: 'area-converter', name: 'Area Converter', description: 'mm², cm², m², km², in² and ft².', component: 'AreaConverter', category: '04' },
  { slug: 'volume-converter', name: 'Volume Converter', description: 'mL, L, m³, cm³ and gal.', component: 'VolumeConverter', category: '04' },
  { slug: 'weight-converter', name: 'Weight Converter', description: 'mg, g, kg, t, oz and lb.', component: 'WeightConverter', category: '04' },
  { slug: 'temperature-converter', name: 'Temperature Converter', description: 'Celsius, Fahrenheit and Kelvin.', component: 'TemperatureConverter', category: '04' },
  { slug: 'data-size-converter', name: 'Data Size Converter', description: 'Bits and bytes with 1000 and 1024 bases.', component: 'DataSizeConverter', category: '04' },
  { slug: 'base-calculator', name: 'Base Calculator', description: 'Arithmetic across number bases with sign handling.', component: 'BaseCalculator', category: '04' },

  // 05 Math
  { slug: 'calculator', name: 'Calculator', description: 'Basic arithmetic with parentheses and percentages.', component: 'Calculator', category: '05' },
  { slug: 'scientific-calculator', name: 'Scientific Calculator', description: 'Trigonometry, logs and powers with angle or radian mode.', component: 'ScientificCalculator', category: '05' },
  { slug: 'percentage', name: 'Percentage Calculator', description: 'Percent of a number, growth rate and percent change.', component: 'PercentageCalculator', category: '05' },
  { slug: 'date-diff', name: 'Date Difference', description: 'Days, weeks and months between two dates.', component: 'DateDiff', category: '05' },
  { slug: 'date-add', name: 'Date Add', description: 'Add or subtract days from a date.', component: 'DateAdd', category: '05' },
  { slug: 'bmi', name: 'BMI Calculator', description: 'Height and weight based BMI, not medical advice.', component: 'BmiCalculator', category: '05' },
  { slug: 'mean-median-mode', name: 'Mean / Median / Mode', description: 'Summary statistics for a list of numbers.', component: 'MeanMedianMode', category: '05' },
  { slug: 'variance', name: 'Variance & Std Dev', description: 'Population and sample variance and standard deviation.', component: 'Variance', category: '05' },
  { slug: 'random-number', name: 'Random Number', description: 'Generate numbers in a range, with or without repeats.', component: 'RandomNumber', category: '05' },
  { slug: 'lottery', name: 'Random Picker', description: 'Pick one or more entries from a list.', component: 'Lottery', category: '05' },

  // 06 QR & Barcode
  { slug: 'qr-generator', name: 'QR Code Generator', description: 'Create QR codes for text and URLs locally.', component: 'QrGenerator', category: '06' },
  { slug: 'qr-wifi', name: 'Wi-Fi QR Code', description: 'Share network credentials as a QR code.', component: 'QrWifi', category: '06' },
  { slug: 'qr-vcard', name: 'vCard QR Code', description: 'Contact details as a QR code.', component: 'QrVcard', category: '06' },
  { slug: 'qr-email', name: 'Email QR Code', description: 'Pre-filled email QR codes.', component: 'QrEmail', category: '06' },
  { slug: 'qr-reader', name: 'QR Reader', description: 'Decode QR images locally in the browser.', component: 'QrReader', category: '06' },
  { slug: 'qr-style', name: 'QR Styling', description: 'Adjust QR colors and error correction.', component: 'QrStyle', category: '06' },
  { slug: 'barcode-generator', name: 'Barcode Generator', description: 'Code 128 and EAN-13 with length and checksum checks.', component: 'BarcodeGenerator', category: '06' },

  // 07 Files
  { slug: 'file-hash', name: 'File SHA-256', description: 'Compute SHA hashes locally without uploading.', component: 'FileHash', category: '07' },
  { slug: 'file-info', name: 'File Info', description: 'File name, type, size and last modified time.', component: 'FileInfo', category: '07' },
  { slug: 'text-preview', name: 'Text File Preview', description: 'Read TXT, JSON, CSV, XML, HTML, CSS and MD files.', component: 'TextPreview', category: '07' },
  { slug: 'csv-viewer', name: 'CSV Viewer', description: 'Preview, search and sort CSV tables locally.', component: 'CsvViewer', category: '07' },
  { slug: 'csv-json', name: 'CSV ↔ JSON', description: 'Convert CSV to JSON and back with quoted fields.', component: 'CsvJson', category: '07' },
  { slug: 'encoding-detect', name: 'Encoding Detector', description: 'Detect UTF-8 and BOM variants (a best-effort guess).', component: 'EncodingDetect', category: '07' },
  { slug: 'batch-rename', name: 'Batch Rename', description: 'Preview rename rules; browsers cannot rename files directly.', component: 'BatchRename', category: '07' },
  { slug: 'zip', name: 'Zip / Unzip', description: 'Create or extract ZIP archives in the browser.', component: 'ZipTool', category: '07' },
  { slug: 'file-merge', name: 'File Merge', description: 'Merge text files with a custom separator.', component: 'FileMerge', category: '07' },
  { slug: 'file-diff', name: 'File Diff', description: 'Compare two text files line by line.', component: 'FileDiff', category: '07' },

  // 08 Browser
  { slug: 'ua-parser', name: 'User-Agent Parser', description: 'Browser, OS and device hints from the UA string.', component: 'UaParser', category: '08' },
  { slug: 'browser-info', name: 'Browser Info', description: 'Language, timezone, screen and CPU details.', component: 'BrowserInfo', category: '08' },
  { slug: 'screen-info', name: 'Screen Info', description: 'Screen resolution and pixel ratio.', component: 'ScreenInfo', category: '08' },
  { slug: 'viewport', name: 'Viewport Info', description: 'Live viewport size.', component: 'ViewportInfo', category: '08' },
  { slug: 'connection', name: 'Connection Info', description: 'What the browser exposes about the network.', component: 'ConnectionInfo', category: '08' },
  { slug: 'http-status', name: 'HTTP Status Codes', description: 'Reference for 1xx to 5xx status codes.', component: 'ReferenceTool', category: '08' },
  { slug: 'mime-types', name: 'MIME Types', description: 'Common MIME types reference.', component: 'ReferenceTool', category: '08' },
  { slug: 'ports', name: 'Common Ports', description: 'Common network port reference.', component: 'ReferenceTool', category: '08' },
  { slug: 'html-chars', name: 'HTML Characters', description: 'HTML special character reference.', component: 'ReferenceTool', category: '08' },
  { slug: 'shortcuts', name: 'Browser Shortcuts', description: 'Common browser keyboard shortcuts.', component: 'ReferenceTool', category: '08' },

  // 09 Time
  { slug: 'stopwatch', name: 'Stopwatch', description: 'Precise local stopwatch.', component: 'Stopwatch', category: '09' },
  { slug: 'countdown', name: 'Countdown', description: 'Countdown timer with local notification options.', component: 'CountdownTimer', category: '09' },
  { slug: 'multi-timer', name: 'Multi Timer', description: 'Run several timers at once.', component: 'MultiTimer', category: '09' },
  { slug: 'pomodoro', name: 'Pomodoro', description: 'Focus and break cycles.', component: 'Pomodoro', category: '09' },
  { slug: 'timezone', name: 'Time Zones', description: 'Compare times across IANA timezones.', component: 'TimezoneTool', category: '09' },
  { slug: 'schedule-diff', name: 'Schedule Diff', description: 'Difference between two date-times.', component: 'ScheduleDiff', category: '09' },
  { slug: 'fullscreen-clock', name: 'Fullscreen Clock', description: 'Large clock for a second screen.', component: 'FullscreenClock', category: '09' },
  { slug: 'alarm', name: 'Alarm', description: 'Browser alarm; timers may not fire when the page is closed.', component: 'AlarmTool', category: '09' },
  { slug: 'work-duration', name: 'Work Duration', description: 'Total work or study time calculator.', component: 'WorkDuration', category: '09' },

  // 10 Design
  { slug: 'color-picker', name: 'Color Picker', description: 'Pick a color and copy HEX, RGB or HSL.', component: 'ColorPicker', category: '10' },
  { slug: 'palette', name: 'Palette Generator', description: 'Complementary, analogous and triadic palettes.', component: 'PaletteGenerator', category: '10' },
  { slug: 'animation-preview', name: 'CSS Animation Preview', description: 'Tune animation parameters with a live preview.', component: 'AnimationPreview', category: '10' },
  { slug: 'typography', name: 'Typography Preview', description: 'Preview font sizes, weights and line heights.', component: 'TypographyPreview', category: '10' },
  { slug: 'css-units', name: 'CSS Units', description: 'px, rem, em, vw, vh, dvh reference.', component: 'CssUnits', category: '10' },
  { slug: 'svg-preview', name: 'SVG Preview', description: 'Render SVG source safely.', component: 'SvgPreview', category: '10' },
  { slug: 'svg-optimizer', name: 'SVG Optimizer', description: 'Optimize SVG markup with a proper parser.', component: 'SvgOptimizer', category: '10' },

  // 11 Security
  { slug: 'password-generator', name: 'Password Generator', description: 'Cryptographically secure passwords with character options.', category: '11', component: 'PasswordTool' },
  { slug: 'password-strength', name: 'Password Strength', description: 'Local strength estimate; nothing is uploaded.', component: 'PasswordStrength', category: '11' },
  { slug: 'random-string', name: 'Random String', description: 'Custom charset and length, with secure randomness.', component: 'RandomString', category: '11' },
  { slug: 'token-generator', name: 'Random Token', description: 'One-off local tokens; not an authentication service.', component: 'TokenGenerator', category: '11' }
]

export const readyTools = tools.filter(tool => tool.component)
