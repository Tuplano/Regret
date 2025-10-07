"use client";

import { useEffect, useRef, useState } from "react";

type LayerOption = { name: string; src: string };

export default function MemeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  const [background, setBackground] = useState("#0e0e0e");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [selectedBase, setSelectedBase] = useState("/assets/base/1.png");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  // Static visual states
  const [scale, setScale] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHandle, setShowHandle] = useState(true);

  // Ref states for performance
  const posRef = useRef({ x: 60, y: 60 });
  const scaleRef = useRef(1);
  const draggingRef = useRef(false);
  const resizingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const initialScaleRef = useRef(1);
  const initialDistanceRef = useRef(1);

  const assets: Record<"base", LayerOption[]> = {
    base: [
      { name: "Base 1", src: "/assets/base/1.png" },
      { name: "Base 2", src: "/assets/base/2.png" },
    ],
  };

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selectedBase;
    img.onload = () => (baseImageRef.current = img);
  }, [selectedBase]);

  useEffect(() => {
    if (!backgroundImage) {
      bgImageRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = backgroundImage;
    img.onload = () => (bgImageRef.current = img);
  }, [backgroundImage]);

  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const chars = text.split("");
    const lines: string[] = [];
    let current = "";
    for (let i = 0; i < chars.length; i++) {
      const test = current + chars[i];
      if (ctx.measureText(test).width > maxWidth && current !== "") {
        lines.push(current);
        current = chars[i];
        if (lines.length >= 2) break;
      } else current = test;
    }
    if (lines.length < 2) lines.push(current);
    for (let i = 0; i < lines.length && i < 2; i++) {
      const lineY = y + i * lineHeight;
      ctx.strokeText(lines[i], x, lineY);
      ctx.fillText(lines[i], x, lineY);
    }
  }

  const getLineCount = (
    text: string,
    maxWidth: number,
    ctx: CanvasRenderingContext2D
  ) => {
    const chars = text.split("");
    let lines = 1;
    let current = "";
    for (let i = 0; i < chars.length; i++) {
      const test = current + chars[i];
      if (ctx.measureText(test).width > maxWidth && current !== "") {
        lines++;
        current = chars[i];
      } else current = test;
      if (lines >= 2) break;
    }
    return lines;
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    const value = e.target.value.toUpperCase();
    const canvas = canvasRef.current;
    if (!canvas) return setter(value);
    const ctx = canvas.getContext("2d");
    if (!ctx) return setter(value);
    ctx.font = "bold 64px Impact, Arial, sans-serif";
    const maxWidth = canvas.width - 80;
    if (getLineCount(value, maxWidth, ctx) <= 2) setter(value);
  };

  // DRAW LOOP — runs independently, smooth 60 FPS
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const DPR = Math.max(1, window.devicePixelRatio || 1);
    const w = 840;
    const h = 840;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    ctx.scale(DPR, DPR);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Background
      if (bgImageRef.current) {
        const bg = bgImageRef.current;
        const canvasRatio = w / h;
        const imgRatio = bg.width / bg.height;
        let drawWidth, drawHeight, offsetX, offsetY;
        if (imgRatio > canvasRatio) {
          drawHeight = h;
          drawWidth = bg.width * (h / bg.height);
          offsetX = (w - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = w;
          drawHeight = bg.height * (w / bg.width);
          offsetX = 0;
          offsetY = (h - drawHeight) / 2;
        }
        ctx.drawImage(bg, offsetX, offsetY, drawWidth, drawHeight);
      } else {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);
      }

      // Base image
      if (baseImageRef.current) {
        const base = baseImageRef.current;
        const { x, y } = posRef.current;
        const size = 300 * scaleRef.current * 2;
        ctx.save();
        if (isFlipped) {
          ctx.translate(x * 2 + size / 2, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(base, -size / 2, y * 2, size, size);
        } else ctx.drawImage(base, x * 2, y * 2, size, size);
        ctx.restore();

        if (showHandle) {
          ctx.save();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.fillStyle = "rgba(255,255,255,0.15)";
          ctx.fillRect(x * 2 + size - 20, y * 2 + size - 20, 20, 20);
          ctx.strokeRect(x * 2 + size - 20, y * 2 + size - 20, 20, 20);
          ctx.restore();
        }
      }

      // Text
      ctx.textAlign = "center";
      ctx.font = "bold 64px Impact, Arial, sans-serif";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 8;
      ctx.lineJoin = "round";
      const maxWidth = w - 80;
      const lineHeight = 70;
      if (topText.trim()) wrapText(ctx, topText, w / 2, 100, maxWidth, lineHeight);
      if (bottomText.trim()) {
        const totalHeight = getLineCount(bottomText, maxWidth, ctx) * lineHeight;
        const startY = h - 100 - totalHeight + lineHeight;
        wrapText(ctx, bottomText, w / 2, startY, maxWidth, lineHeight);
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [background, topText, bottomText, isFlipped, showHandle, backgroundImage]);

  const isInResizeHandle = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const cssSize = rect.width;
    const logicalToCss = cssSize / 420;
    const size = 300 * scaleRef.current * logicalToCss;
    const handleSize = 24;
    const handleX = posRef.current.x * logicalToCss + size;
    const handleY = posRef.current.y * logicalToCss + size;
    return (
      x >= handleX - handleSize &&
      x <= handleX + handleSize &&
      y >= handleY - handleSize &&
      y <= handleY + handleSize
    );
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const px = e.clientX;
    const py = e.clientY;
    if (isInResizeHandle(px, py)) {
      resizingRef.current = true;
      const x = px - rect.left;
      const y = py - rect.top;
      const centerX = posRef.current.x + 150 * scaleRef.current;
      const centerY = posRef.current.y + 150 * scaleRef.current;
      const dx = (x / (rect.width / 420)) - centerX;
      const dy = (y / (rect.height / 420)) - centerY;
      initialDistanceRef.current = Math.sqrt(dx * dx + dy * dy) || 1;
      initialScaleRef.current = scaleRef.current;
    } else {
      draggingRef.current = true;
      offsetRef.current = {
        x: e.clientX - rect.left - posRef.current.x * (rect.width / 420),
        y: e.clientY - rect.top - posRef.current.y * (rect.height / 420),
      };
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
    resizingRef.current = false;
    setScale(scaleRef.current);
  };

  let lastMove = 0;
  const handlePointerMove = (e: React.PointerEvent) => {
    const now = performance.now();
    if (now - lastMove < 16) return; // throttle to ~60fps
    lastMove = now;

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleFactor = rect.width / 420;

    if (resizingRef.current) {
      const centerX = posRef.current.x + 150 * initialScaleRef.current;
      const centerY = posRef.current.y + 150 * initialScaleRef.current;
      const logicalX = (e.clientX - rect.left) / scaleFactor;
      const logicalY = (e.clientY - rect.top) / scaleFactor;
      const dx = logicalX - centerX;
      const dy = logicalY - centerY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      const newScale = Math.max(
        0.3,
        Math.min(3, initialScaleRef.current * (currentDistance / initialDistanceRef.current))
      );
      scaleRef.current = newScale;
    } else if (draggingRef.current) {
      const newX = (e.clientX - rect.left - offsetRef.current.x) / scaleFactor;
      const newY = (e.clientY - rect.top - offsetRef.current.y) / scaleFactor;
      posRef.current = { x: Math.max(0, newX), y: Math.max(0, newY) };
    }

    const overHandle = isInResizeHandle(e.clientX, e.clientY);
    canvasRef.current.style.cursor = overHandle
      ? "nwse-resize"
      : draggingRef.current
      ? "grabbing"
      : "grab";
  };

  const toggleFlip = () => setIsFlipped((s) => !s);

  const exportImage = () => {
    setShowHandle(false);
    requestAnimationFrame(() => {
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = 840;
      exportCanvas.height = 840;
      const ctx = exportCanvas.getContext("2d")!;
      if (bgImageRef.current) {
        const bg = bgImageRef.current;
        const canvasRatio = 1;
        const imgRatio = bg.width / bg.height;
        let drawWidth, drawHeight, offsetX, offsetY;
        if (imgRatio > canvasRatio) {
          drawHeight = 840;
          drawWidth = bg.width * (840 / bg.height);
          offsetX = (840 - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = 840;
          drawHeight = bg.height * (840 / bg.width);
          offsetX = 0;
          offsetY = (840 - drawHeight) / 2;
        }
        ctx.drawImage(bg, offsetX, offsetY, drawWidth, drawHeight);
      } else {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, 840, 840);
      }

      if (baseImageRef.current) {
        ctx.save();
        const { x, y } = posRef.current;
        const size = 300 * scaleRef.current * 2;
        if (isFlipped) {
          ctx.translate(x * 2 + size / 2, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(baseImageRef.current, -size / 2, y * 2, size, size);
        } else ctx.drawImage(baseImageRef.current, x * 2, y * 2, size, size);
        ctx.restore();
      }

      ctx.textAlign = "center";
      ctx.font = "bold 64px Impact, Arial, sans-serif";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 8;
      const maxWidth = 840 - 80;
      const lineHeight = 70;
      if (topText.trim()) wrapText(ctx, topText, 420, 100, maxWidth, lineHeight);
      if (bottomText.trim()) {
        const totalHeight = getLineCount(bottomText, maxWidth, ctx) * lineHeight;
        const startY = 840 - 100 - totalHeight + lineHeight;
        wrapText(ctx, bottomText, 420, startY, maxWidth, lineHeight);
      }

      const link = document.createElement("a");
      link.download = "regret_meme.png";
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
      setTimeout(() => setShowHandle(true), 200);
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center text-white overflow-hidden p-4 select-none">
      <div className="flex flex-col md:flex-row w-full h-full gap-4">
        {/* Sidebar */}
        <aside className="w-full md:w-64 md:border-r border-white/10 flex flex-col justify-between p-4 md:p-6 bg-transparent">
          <div>
            <h1 className="text-2xl font-light mb-5 tracking-wide text-center md:text-left">
              Meme Generator
            </h1>

            <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
              Base Options
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {assets.base.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedBase(item.src)}
                  className={`group relative cursor-pointer rounded-xl border border-white/10 overflow-hidden bg-white/5 hover:bg-white/10 transition p-1 ${
                    selectedBase === item.src ? "ring-2 ring-white/40" : ""
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-full h-16 object-contain mx-auto p-2"
                  />
                  <div className="absolute bottom-0 w-full text-center text-[10px] py-1 bg-black/40 backdrop-blur-sm text-gray-300">
                    {item.name}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 mt-6">
              <span className="text-sm text-gray-400">Background</span>
              <input
                type="color"
                value={background}
                onChange={(e) => {
                  setBackground(e.target.value);
                  setBackgroundImage(null);
                }}
                className="w-10 h-10 rounded-md cursor-pointer border-none outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-400 block mb-1">
                Upload Background
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      setBackgroundImage(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="block w-full text-xs text-gray-300 bg-white/5 border border-white/10 rounded-lg p-2"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs text-gray-400 mb-2">
              Tips: Drag to move. Resize handle bottom-right.
            </p>
            <div className="flex gap-2">
              <button
                onClick={toggleFlip}
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sm"
              >
                Flip
              </button>
              <button
                onClick={exportImage}
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sm"
              >
                Export
              </button>
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 flex flex-col items-center justify-start p-2 md:p-6">
          <div
            className="relative w-full max-w-[420px] aspect-square rounded-2xl border border-white/10 bg-black/30 shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center justify-center mx-auto"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <canvas
              ref={canvasRef}
              width={840}
              height={840}
              style={{ width: "100%", height: "100%" }}
              className="rounded-2xl object-contain touch-none"
            />
          </div>

          <div className="mt-4 w-full max-w-[420px] space-y-3">
            <input
              type="text"
              placeholder="Top Text"
              value={topText}
              onChange={(e) => handleTextChange(e, setTopText)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/30"
            />
            <input
              type="text"
              placeholder="Bottom Text"
              value={bottomText}
              onChange={(e) => handleTextChange(e, setBottomText)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
