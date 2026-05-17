(() => {
  const canvas = document.getElementById("card");
  const ctx = canvas.getContext("2d");
  const input = document.getElementById("name");
  const downloadBtn = document.getElementById("download");
  const boldToggle = document.getElementById("bold");

  const bg = new Image();
  bg.crossOrigin = "anonymous";
  bg.src = "assets/card.jpeg";

  let ready = false;
  let currentName = "";

  // Ensure font is loaded before first paint
  const fontReady = (document.fonts && document.fonts.load)
    ? document.fonts.load('700 80px "Taleeq"').then(() => document.fonts.load('400 80px "Taleeq"'))
    : Promise.resolve();

  bg.onload = async () => {
    canvas.width = bg.naturalWidth;
    canvas.height = bg.naturalHeight;
    await fontReady;
    ready = true;
    render();
  };

  function render() {
    if (!ready) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const name = currentName.trim();
    if (!name) return;

    // Position: under the central circle, roughly lower-middle of the card
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.84;

    // Auto-fit font size
    const maxWidth = canvas.width * 0.7;
    let fontSize = Math.round(canvas.width * 0.05);
    const minSize = Math.round(canvas.width * 0.022);

    // نفس درجة الرمادي الخفيف للتاريخ في أسفل البطاقة
    ctx.fillStyle = "#9a9a9a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = "rtl";

    do {
      const weight = boldToggle && boldToggle.checked ? 700 : 400;
      ctx.font = `${weight} ${fontSize}px "Taleeq", "Segoe UI", Tahoma, sans-serif`;
      const w = ctx.measureText(name).width;
      if (w <= maxWidth) break;
      fontSize -= 2;
    } while (fontSize > minSize);

    ctx.fillText(name, cx, cy);
  }

  let fadeTimer = null;
  function scheduleRender() {
    canvas.classList.add("fading");
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      currentName = input.value;
      render();
      canvas.classList.remove("fading");
    }, 140);
  }

  input.addEventListener("input", scheduleRender);
  if (boldToggle) boldToggle.addEventListener("change", () => { currentName = input.value; render(); });

  downloadBtn.addEventListener("click", () => {
    if (!ready) return;
    // Ensure latest name is rendered
    currentName = input.value;
    render();

    const safe = (input.value.trim() || "بطاقة-عيد")
      .replace(/[\\/:*?"<>|]+/g, "")
      .replace(/\s+/g, "-");
    const link = document.createElement("a");
    link.download = `عيد-أضحى-مبارك-${safe}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  });

  bg.onerror = () => {
    ctx.fillStyle = "#fee";
    ctx.fillRect(0, 0, canvas.width || 800, canvas.height || 600);
    ctx.fillStyle = "#900";
    ctx.font = "20px sans-serif";
    ctx.fillText("تعذّر تحميل الصورة", 20, 40);
  };
})();
