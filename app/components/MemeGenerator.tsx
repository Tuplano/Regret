"use client";

import { useEffect, useRef, useState } from "react";

interface LayerOption {
  name: string;
  src: string;
}

export default function MemeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  const [background, setBackground] = useState("#0e0e0e");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [selectedBase, setSelectedBase] = useState("/assets/base/1.png");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  const [position, setPosition] = useState({ x: 60, y: 60 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [initialScale, setInitialScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(0);
  const [showHandle, setShowHandle] = useState(true);

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
    const words = text.split("");
    const lines: string[] = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i];
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && currentLine !== "") {
        lines.push(currentLine);
        currentLine = words[i];
        if (lines.length >= 2) break;
      } else {
        currentLine = testLine;
      }
    }
    if (lines.length < 2) lines.push(currentLine);

    for (let i = 0; i < lines.length && i < 2; i++) {
      const lineY = y + i * lineHeight;
      ctx.strokeText(lines[i], x, lineY);
      ctx.fillText(lines[i], x, lineY);
    }
  }

  function getLineCount(
    text: string,
    maxWidth: number,
    ctx: CanvasRenderingContext2D
  ) {
    const words = text.split("");
    let lines = 1;
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i];
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && currentLine !== "") {
        lines++;
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
      if (lines >= 2) break;
    }
    return lines;
  }

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setText: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value.toUpperCase();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = "bold 64px Impact, Arial, sans-serif";
    const maxWidth = canvas.width - 80;
    if (getLineCount(value, maxWidth, ctx) <= 2) {
      setText(value);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

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

      if (baseImageRef.current) {
        const base = baseImageRef.current;
        const size = 300 * scale * 2;
        const x = position.x * 2;
        const y = position.y * 2;

        ctx.save();
        if (isFlipped) {
          ctx.translate(x + size / 2, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(base, -size / 2, y, size, size);
        } else {
          ctx.drawImage(base, x, y, size, size);
        }
        ctx.restore();

        if (showHandle) {
          ctx.save();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.fillStyle = "rgba(255,255,255,0.15)";
          ctx.fillRect(x + size - 20, y + size - 20, 20, 20);
          ctx.strokeRect(x + size - 20, y + size - 20, 20, 20);
          ctx.restore();
        }
      }

      ctx.textAlign = "center";
      ctx.font = "bold 64px Impact, Arial, sans-serif";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 8;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 1.5;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      const maxWidth = w - 80;
      const lineHeight = 70;

      if (topText.trim()) wrapText(ctx, topText, w / 2, 100, maxWidth, lineHeight);
      if (bottomText.trim()) {
        const totalHeight =
          getLineCount(bottomText, maxWidth, ctx) * lineHeight;
        const startY = h - 100 - totalHeight + lineHeight;
        wrapText(ctx, bottomText, w / 2, startY, maxWidth, lineHeight);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [background, topText, bottomText, position, scale, isFlipped, showHandle]);

  const isInResizeHandle = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = 300 * scale;
    const handleSize = 20;
    const handleX = position.x + size;
    const handleY = position.y + size;
    return (
      x >= handleX - handleSize &&
      x <= handleX + handleSize &&
      y >= handleY - handleSize &&
      y <= handleY + handleSize
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isInResizeHandle(e)) {
      setResizing(true);
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = position.x + 150 * scale;
      const centerY = position.y + 150 * scale;
      const dx = x - centerX;
      const dy = y - centerY;
      setInitialDistance(Math.sqrt(dx * dx + dy * dy));
      setInitialScale(scale);
    } else {
      setDragging(true);
      const rect = canvasRef.current!.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left - position.x,
        y: e.clientY - rect.top - position.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (resizing) {
      const centerX = position.x + 150 * initialScale;
      const centerY = position.y + 150 * initialScale;
      const dx = x - centerX;
      const dy = y - centerY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      const scaleFactor = currentDistance / initialDistance;
      setScale(Math.max(0.3, Math.min(3, initialScale * scaleFactor)));
    } else if (dragging) {
      setPosition({
        x: e.clientX - rect.left - offset.x,
        y: e.clientY - rect.top - offset.y,
      });
    }

    if (canvasRef.current) {
      canvasRef.current.style.cursor = isInResizeHandle(e)
        ? "nwse-resize"
        : dragging
        ? "grabbing"
        : "grab";
    }
  };

  const toggleFlip = () => setIsFlipped((prev) => !prev);

  const exportImage = () => {
    setShowHandle(false);
    requestAnimationFrame(() => {
      const link = document.createElement("a");
      link.download = "regret_meme.png";
      link.href = canvasRef.current!.toDataURL("image/png");
      link.click();
      setTimeout(() => setShowHandle(true), 200);
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center text-white overflow-hidden p-4 select-none">
      <div className="flex flex-col md:flex-row w-full h-full">
        <aside className="w-full md:w-64 md:border-r border-white/10 flex flex-col justify-between p-6">
          <div>
            <h1 className="text-2xl font-light mb-8 tracking-wide text-center md:text-left">
              Meme Generator
            </h1>

            <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
              Base Options
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {assets.base.map((item) => (
                <div
                  key={item.name}
                  onClick={() => setSelectedBase(item.src)}
                  className={`group relative cursor-pointer rounded-xl border border-white/10 overflow-hidden bg-white/5 hover:bg-white/10 transition ${
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
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 mt-6">
              <span className="text-sm text-gray-400">Background</span>
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
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
        </aside>

        <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
          <div
            className="relative w-[80%] max-w-[420px] aspect-square rounded-2xl border border-white/10 bg-black/30 shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              width={840}
              height={840}
              style={{ width: "420px", height: "420px" }}
              className="rounded-2xl object-contain w-full h-full"
            />
          </div>

          <button
            onClick={toggleFlip}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sm mt-2"
          >
            Flip Base Image
          </button>

          <div className="mt-6 w-full max-w-[400px] space-y-3">
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

          <div className="mt-3 flex gap-3">
            <button
              onClick={exportImage}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sm"
            >
              Export PNG
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
