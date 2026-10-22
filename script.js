(() => {
  const $ = id => document.getElementById(id);
  const imageInput = $('imageInput'), dropZone = $('dropZone'), fileInfo = $('fileInfo');
  const fileName = $('fileName'), emptyState = $('emptyState'), asciiOutput = $('asciiOutput');
  const density = $('density'), densityValue = $('densityValue'), charset = $('charset');
  const contrast = $('contrast'), contrastValue = $('contrastValue'), invert = $('invert'), glow = $('glow');
  const workCanvas = $('workCanvas'), workCtx = workCanvas.getContext('2d', { willReadFrequently: true });
  const exportCanvas = $('exportCanvas'), exportCtx = exportCanvas.getContext('2d');
  const toast = $('toast'), langToggle = $('langToggle');

  /* ---------- Translations ---------- */
  // \u2066 ... \u2069 keeps symbol-only strings left-to-right inside Persian text.
  const I18N = {
    en: {
      pageTitle: 'Enzo Studio — Turn photos into text art',
      metaDesc: 'Turn any photo into detailed ASCII art in your browser. Free, private, and easy to export.',
      langBtn: 'فارسی', langLabel: 'تغییر زبان به فارسی',
      topNote: 'Runs locally in your browser', howLink: 'How it works',
      eyebrow: 'CREATIVE CODE / IMAGE LAB',
      h1a: 'Your photos,', h1b: 'reimagined in text.',
      heroCopy: 'Transform any image into a detailed field of characters. Tune the texture, color, and density — then export your creation.',
      imageSource: 'Image source', tagInput: 'INPUT',
      dropTitle: 'Drop an image here', or: 'or', browse: 'browse files',
      formats: 'JPG, PNG, WEBP · processed on your device',
      removeImage: 'Remove image',
      density: 'Character density', less: 'Less detail', more: 'More detail', columns: 'columns',
      charset: 'Character set',
      optClassic: 'Classic — .:-=+*#%@', optDetailed: 'Detailed — full spectrum',
      optBlocks: 'Block shades — ░▒▓█', optBinary: 'Binary — 0 / 1',
      optSoft: 'Soft — .oO@', optLetters: 'Letters — ASCIIART',
      colorMode: 'Color mode', modeMono: 'Monochrome', modeColor: 'Original color', modeGreen: 'Terminal',
      contrast: 'Contrast',
      invert: 'Invert brightness', invertSub: 'Swap light and dark characters',
      glow: 'Glow effect', glowSub: 'Subtle terminal-style glow',
      reset: 'Reset settings',
      livePreview: 'Live preview', liveRender: 'LIVE RENDER',
      emptyTitle: 'Your canvas is waiting.', emptyText: 'Upload a photo to start creating.',
      noImage: 'NO IMAGE LOADED', cells: 'CELLS', chars: 'CHARACTERS',
      exportPng: 'Export PNG', exportTxt: 'Export .TXT', copy: 'Copy ASCII art',
      privacy: 'Your image never leaves your device. No upload, no account, no tracking.',
      howTitle: 'From pixels to poetry.',
      how1n: '01 / INPUT', how1t: 'Choose a photo', how1p: 'Portraits, pets, architecture, and high-contrast images work beautifully.',
      how2n: '02 / TRANSFORM', how2t: 'Shape the texture', how2p: 'Adjust character density, contrast, and color to find your own visual style.',
      how3n: '03 / EXPORT', how3t: 'Make it yours', how3p: 'Save a shareable PNG or export the raw characters as a text file.',
      footerA: 'Made for curious minds.', footerB: '100% client-side.',
      invalidFile: 'Please choose a valid image file.', openFail: 'This image could not be opened.',
      pngFail: 'PNG export failed.', pngOk: 'PNG exported successfully.', txtOk: 'Text file exported.',
      copyOk: 'ASCII art copied to clipboard.', copyFail: 'Clipboard access unavailable. Export the .TXT file instead.',
      resetOk: 'Settings reset.'
    },
    fa: {
      pageTitle: 'Enzo Studio — تبدیل عکس به هنر متنی',
      metaDesc: 'هر عکسی را در مرورگر خود به هنر ASCII تبدیل کنید. رایگان، خصوصی و آسان برای خروجی گرفتن.',
      langBtn: 'EN', langLabel: 'Switch language to English',
      topNote: 'اجرا به‌صورت محلی در مرورگر شما', howLink: 'نحوه‌ی کار',
      eyebrow: 'کدنویسی خلاقانه / آزمایشگاه تصویر',
      h1a: 'عکس‌های شما،', h1b: 'بازآفرینی‌شده با متن.',
      heroCopy: 'هر تصویری را به میدانی از کاراکترها تبدیل کنید. بافت، رنگ و تراکم را تنظیم کنید و اثرتان را خروجی بگیرید.',
      imageSource: 'منبع تصویر', tagInput: 'ورودی',
      dropTitle: 'تصویر را اینجا رها کنید', or: 'یا', browse: 'انتخاب فایل',
      formats: 'JPG، PNG، WEBP · پردازش روی دستگاه شما',
      removeImage: 'حذف تصویر',
      density: 'تراکم کاراکتر', less: 'جزئیات کمتر', more: 'جزئیات بیشتر', columns: 'ستون',
      charset: 'مجموعه کاراکتر',
      optClassic: 'کلاسیک — \u2066.:-=+*#%@\u2069', optDetailed: 'دقیق — طیف کامل',
      optBlocks: 'سایه‌های بلوکی — \u2066░▒▓█\u2069', optBinary: 'باینری — \u20660 / 1\u2069',
      optSoft: 'نرم — \u2066.oO@\u2069', optLetters: 'حروف — \u2066ASCIIART\u2069',
      colorMode: 'حالت رنگ', modeMono: 'تک‌رنگ', modeColor: 'رنگ اصلی', modeGreen: 'ترمینال',
      contrast: 'کنتراست',
      invert: 'معکوس‌کردن روشنایی', invertSub: 'جابه‌جایی کاراکترهای روشن و تیره',
      glow: 'افکت درخشش', glowSub: 'درخشش ملایم به سبک ترمینال',
      reset: 'بازنشانی تنظیمات',
      livePreview: 'پیش‌نمایش زنده', liveRender: 'رندر زنده',
      emptyTitle: 'بوم شما آماده است.', emptyText: 'برای شروع، یک عکس آپلود کنید.',
      noImage: 'تصویری بارگذاری نشده', cells: 'خانه', chars: 'کاراکتر',
      exportPng: 'خروجی PNG', exportTxt: 'خروجی TXT', copy: 'کپی هنر ASCII',
      privacy: 'تصویر شما هرگز از دستگاهتان خارج نمی‌شود. بدون آپلود، بدون حساب کاربری، بدون ردیابی.',
      howTitle: 'از پیکسل تا شعر.',
      how1n: '01 / ورودی', how1t: 'یک عکس انتخاب کنید', how1p: 'پرتره، حیوانات خانگی، معماری و تصاویر پرکنتراست نتیجه‌ی بسیار خوبی می‌دهند.',
      how2n: '02 / تبدیل', how2t: 'بافت را شکل دهید', how2p: 'تراکم کاراکتر، کنتراست و رنگ را تنظیم کنید تا سبک تصویری خودتان را پیدا کنید.',
      how3n: '03 / خروجی', how3t: 'مال خودتان کنید', how3p: 'یک PNG قابل‌اشتراک ذخیره کنید یا کاراکترها را به‌صورت فایل متنی خروجی بگیرید.',
      footerA: 'ساخته‌شده برای ذهن‌های کنجکاو.', footerB: 'کاملاً سمت کاربر.',
      invalidFile: 'لطفاً یک فایل تصویری معتبر انتخاب کنید.', openFail: 'این تصویر باز نشد.',
      pngFail: 'خروجی PNG ناموفق بود.', pngOk: 'PNG با موفقیت ذخیره شد.', txtOk: 'فایل متنی ذخیره شد.',
      copyOk: 'هنر ASCII کپی شد.', copyFail: 'دسترسی به کلیپ‌بورد ممکن نیست. به‌جای آن خروجی TXT بگیرید.',
      resetOk: 'تنظیمات بازنشانی شد.'
    }
  };
  let lang = 'en';
  const t = key => I18N[lang][key];

  // Characters are ordered from empty (dark) to dense (bright),
  // so bright pixels become dense characters on the dark canvas.
  const CHARSETS = {
    classic: ' .:-=+*#%@',
    detailed: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
    blocks: ' ░▒▓█',
    binary: ' 01',
    soft: ' .oO@',
    letters: ' ASCIIART'
  };
  const CELL_ASPECT = 0.57;

  let sourceImage = null, currentFileName = 'ascii-art', mode = 'mono';
  let asciiLines = [], asciiText = '', colorRows = [], renderCols = 0, renderRows = 0;
  let renderTimer = null, toastTimer = null;

  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }
  function safeName(name) {
    return name.replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '') || 'ascii-art';
  }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function setExportEnabled(on) {
    $('downloadPng').disabled = $('downloadTxt').disabled = $('copyText').disabled = !on;
  }
  function download(blob, name) {
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  /* ---------- Labels / language ---------- */
  function updateLabels() {
    densityValue.textContent = `${density.value} ${t('columns')}`;
    contrastValue.textContent = `${(Number(contrast.value) / 100).toFixed(2)}×`;
  }
  function updateStatus() {
    if (!sourceImage || !renderRows) {
      $('dimensions').textContent = t('noImage');
      $('charCount').textContent = `0 ${t('chars')}`;
      return;
    }
    $('dimensions').textContent = `${renderCols} × ${renderRows} ${t('cells')}`;
    $('charCount').textContent = `${(renderCols * renderRows).toLocaleString('en-US')} ${t('chars')}`;
  }
  function applyLang(next) {
    lang = I18N[next] ? next : 'en';
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.title = t('pageTitle');
    $('metaDesc').setAttribute('content', t('metaDesc'));
    langToggle.textContent = t('langBtn');
    langToggle.setAttribute('aria-label', t('langLabel'));
    try { localStorage.setItem('enzo-lang', lang); } catch (e) { /* storage may be blocked */ }
    updateLabels(); updateStatus();
  }
  langToggle.addEventListener('click', () => applyLang(lang === 'en' ? 'fa' : 'en'));

  /* ---------- Loading images ---------- */
  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) { notify(t('invalidFile')); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      sourceImage = img;
      currentFileName = safeName(file.name);
      fileName.textContent = file.name;
      fileInfo.hidden = false; emptyState.hidden = true; asciiOutput.hidden = false;
      setExportEnabled(true);
      render();
    };
    img.onerror = () => { URL.revokeObjectURL(url); notify(t('openFail')); };
    img.src = url;
  }
  imageInput.addEventListener('change', e => { loadFile(e.target.files[0]); });
  $('removeImage').addEventListener('click', () => {
    clearTimeout(renderTimer);
    sourceImage = null; imageInput.value = '';
    fileInfo.hidden = true; emptyState.hidden = false; asciiOutput.hidden = true;
    asciiOutput.textContent = ''; asciiText = ''; asciiLines = []; colorRows = [];
    renderCols = 0; renderRows = 0;
    setExportEnabled(false);
    updateStatus();
  });

  ['dragenter', 'dragover'].forEach(evt => dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.add('dragging'); }));
  ['dragleave', 'drop'].forEach(evt => dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.remove('dragging'); }));
  dropZone.addEventListener('drop', e => loadFile(e.dataTransfer.files[0]));
  window.addEventListener('dragover', e => e.preventDefault());
  window.addEventListener('drop', e => e.preventDefault());

  /* ---------- Rendering ---------- */
  function render() {
    if (!sourceImage) return;
    clearTimeout(renderTimer);
    renderTimer = setTimeout(() => {
      const cols = Number(density.value);
      const ratio = sourceImage.naturalHeight / sourceImage.naturalWidth;
      const rows = Math.max(1, Math.round(cols * ratio * CELL_ASPECT));
      workCanvas.width = cols; workCanvas.height = rows;
      workCtx.imageSmoothingQuality = 'high';
      workCtx.fillStyle = '#000';
      workCtx.fillRect(0, 0, cols, rows);
      workCtx.drawImage(sourceImage, 0, 0, cols, rows);
      const pixels = workCtx.getImageData(0, 0, cols, rows).data;

      const chars = CHARSETS[charset.value] || CHARSETS.classic;
      const contrastFactor = Number(contrast.value) / 100;
      const inverted = invert.checked;
      const lines = [], colors = [];

      for (let y = 0; y < rows; y++) {
        let line = '';
        const colorLine = [];
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
          let lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          lum = clamp((lum - 0.5) * contrastFactor + 0.5, 0, 1);
          if (inverted) lum = 1 - lum;
          line += chars[Math.round(lum * (chars.length - 1))];
          colorLine.push([r, g, b]);
        }
        lines.push(line); colors.push(colorLine);
      }

      asciiLines = lines; asciiText = lines.join('\n'); colorRows = colors;
      renderCols = cols; renderRows = rows;

      asciiOutput.style.color = mode === 'green' ? '#c2ff62' : '#d8d9df';
      asciiOutput.classList.toggle('glow', glow.checked && mode !== 'color');
      if (mode === 'color') paintColoredPreview(lines, colors);
      else asciiOutput.textContent = asciiText;
      updateStatus();
    }, 10);
  }

  function paintColoredPreview(lines, colors) {
    const frag = document.createDocumentFragment();
    lines.forEach((line, y) => {
      for (let x = 0; x < line.length; x++) {
        const span = document.createElement('span');
        span.textContent = line[x];
        const [r, g, b] = colors[y][x];
        span.style.color = `rgb(${r},${g},${b})`;
        if (glow.checked) span.style.textShadow = `0 0 4px rgba(${r},${g},${b},.35)`;
        frag.appendChild(span);
      }
      if (y < lines.length - 1) frag.appendChild(document.createTextNode('\n'));
    });
    asciiOutput.replaceChildren(frag);
  }

  [density, charset, contrast, invert, glow].forEach(el => el.addEventListener('input', () => { updateLabels(); render(); }));

  $('colorMode').addEventListener('click', e => {
    const button = e.target.closest('[data-mode]');
    if (!button) return;
    mode = button.dataset.mode;
    document.querySelectorAll('.segment').forEach(b => b.classList.toggle('active', b === button));
    render();
  });

  $('reset').addEventListener('click', () => {
    density.value = 110; charset.selectedIndex = 0; contrast.value = 115;
    invert.checked = false; glow.checked = true; mode = 'mono';
    document.querySelectorAll('.segment').forEach(b => b.classList.toggle('active', b.dataset.mode === 'mono'));
    updateLabels(); render(); notify(t('resetOk'));
  });

  /* ---------- Export ---------- */
  function drawExport() {
    if (!sourceImage || !asciiLines.length) return false;
    const cols = renderCols, rows = asciiLines.length;
    const fontSize = clamp(Math.floor(2400 / cols), 10, 20);
    const cellW = fontSize * 0.6, cellH = cellW / CELL_ASPECT;
    exportCanvas.width = Math.ceil(cols * cellW);
    exportCanvas.height = Math.ceil(rows * cellH);
    exportCtx.fillStyle = '#08090d';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.font = `${fontSize}px "Courier New", monospace`;
    exportCtx.textBaseline = 'top';
    exportCtx.direction = 'ltr';
    const useGlow = glow.checked;
    for (let y = 0; y < rows; y++) {
      const line = asciiLines[y];
      for (let x = 0; x < cols; x++) {
        const ch = line[x];
        if (ch === ' ') continue;
        let fill;
        if (mode === 'color') { const [r, g, b] = colorRows[y][x]; fill = `rgb(${r},${g},${b})`; }
        else if (mode === 'green') fill = '#c2ff62';
        else fill = '#e5e6eb';
        exportCtx.fillStyle = fill;
        if (useGlow && mode !== 'mono') { exportCtx.shadowColor = fill; exportCtx.shadowBlur = 3; }
        else exportCtx.shadowBlur = 0;
        exportCtx.fillText(ch, x * cellW, y * cellH);
      }
    }
    exportCtx.shadowBlur = 0;
    return true;
  }

  $('downloadPng').addEventListener('click', () => {
    if (!drawExport()) return;
    exportCanvas.toBlob(blob => {
      if (!blob) { notify(t('pngFail')); return; }
      download(blob, `${currentFileName}-ascii.png`);
      notify(t('pngOk'));
    }, 'image/png');
  });
  $('downloadTxt').addEventListener('click', () => {
    if (!asciiText) return;
    download(new Blob([asciiText], { type: 'text/plain;charset=utf-8' }), `${currentFileName}-ascii.txt`);
    notify(t('txtOk'));
  });
  $('copyText').addEventListener('click', async () => {
    if (!asciiText) return;
    try { await navigator.clipboard.writeText(asciiText); notify(t('copyOk')); }
    catch (e) { notify(t('copyFail')); }
  });

  /* ---------- Init ---------- */
  let saved = null;
  try { saved = localStorage.getItem('enzo-lang'); } catch (e) { /* ignore */ }
  const browserLang = (navigator.language || '').toLowerCase().startsWith('fa') ? 'fa' : 'en';
  applyLang(saved || browserLang);
})();
