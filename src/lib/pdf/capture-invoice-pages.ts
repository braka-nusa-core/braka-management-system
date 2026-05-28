import html2canvas from "html2canvas";
import type {
  CaptureInvoicePagesOptions,
  CapturedInvoicePageCanvas,
  CapturedInvoicePageImage,
} from "@/types/invoice-print";

const DEFAULT_OPTIONS: Required<CaptureInvoicePagesOptions> = {
  scale: 2,
  backgroundColor: "#FFFFFF",
  imageTimeoutMs: 15000,
  waitAfterFontsMs: 60,
  waitAfterImagesMs: 80,
  useDevicePixelRatio: true,
};

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

async function waitForFontsReady(waitAfterFontsMs: number) {
  if ("fonts" in document && "ready" in document.fonts) {
    await document.fonts.ready;
  }

  await delay(waitAfterFontsMs);
}

async function waitForImageElement(
  image: HTMLImageElement,
  timeoutMs: number
) {
  if (image.complete && image.naturalWidth > 0) {
    return;
  }

  await Promise.race([
    new Promise<void>((resolve, reject) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener(
        "error",
        () => reject(new Error(`Failed to load image: ${image.currentSrc || image.src}`)),
        { once: true }
      );
    }),
    new Promise<void>((_, reject) => {
      window.setTimeout(() => {
        reject(
          new Error(`Timed out waiting for image: ${image.currentSrc || image.src}`)
        );
      }, timeoutMs);
    }),
  ]);
}

async function waitForImagesReady(
  pages: HTMLElement[],
  timeoutMs: number,
  waitAfterImagesMs: number
) {
  const images = pages.flatMap((page) =>
    Array.from(page.querySelectorAll("img"))
  );

  await Promise.all(images.map((image) => waitForImageElement(image, timeoutMs)));
  await delay(waitAfterImagesMs);
}

async function waitForRenderStability(
  pages: HTMLElement[],
  options: Required<CaptureInvoicePagesOptions>
) {
  await waitForFontsReady(options.waitAfterFontsMs);
  await waitForImagesReady(pages, options.imageTimeoutMs, options.waitAfterImagesMs);
  await nextFrame();
  await nextFrame();
}

function getEffectiveScale(options: Required<CaptureInvoicePagesOptions>) {
  if (!options.useDevicePixelRatio) {
    return options.scale;
  }

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return Math.min(3, Math.max(options.scale, Math.min(dpr, 2)));
}

function getSortedPages(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>('[data-invoice-print-page="true"]')
  ).sort((left, right) => {
    const leftPage = Number(left.dataset.pageNumber ?? "0");
    const rightPage = Number(right.dataset.pageNumber ?? "0");
    return leftPage - rightPage;
  });
}

export async function captureInvoicePagesToCanvas(
  root: HTMLElement,
  options: CaptureInvoicePagesOptions = {}
): Promise<CapturedInvoicePageCanvas[]> {
  const resolved = { ...DEFAULT_OPTIONS, ...options };
  const pages = getSortedPages(root);

  if (pages.length === 0) {
    throw new Error("No printable invoice pages were found for capture.");
  }

  await waitForRenderStability(pages, resolved);

  const scale = getEffectiveScale(resolved);
  const captures: CapturedInvoicePageCanvas[] = [];

  for (const page of pages) {
    const pageNumber = Number(page.dataset.pageNumber ?? captures.length + 1);
    const canvas = await html2canvas(page, {
      backgroundColor: resolved.backgroundColor,
      scale,
      useCORS: true,
      allowTaint: false,
      logging: false,
      imageTimeout: resolved.imageTimeoutMs,
      removeContainer: true,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
      width: Math.ceil(page.getBoundingClientRect().width),
      height: Math.ceil(page.getBoundingClientRect().height),
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    });

    captures.push({
      pageNumber,
      width: canvas.width,
      height: canvas.height,
      canvas,
    });
  }

  return captures;
}

export async function captureInvoicePagesToImages(
  root: HTMLElement,
  options: CaptureInvoicePagesOptions = {}
): Promise<CapturedInvoicePageImage[]> {
  const canvases = await captureInvoicePagesToCanvas(root, options);

  return canvases.map(({ pageNumber, width, height, canvas }) => ({
    pageNumber,
    width,
    height,
    dataUrl: canvas.toDataURL("image/png"),
  }));
}
