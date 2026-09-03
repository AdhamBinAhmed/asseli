'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ZoomIn, ZoomOut, Download, ShieldCheck } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CertificateViewerProps {
  batchUrl: string;
  isImage?: boolean;
}

export function CertificateViewer({ batchUrl, isImage = false }: CertificateViewerProps) {
  const t = useTranslations('LabAnalysis');
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState<number>();

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      {/* Viewer header */}
      <div className="flex items-center justify-between gap-4 px-6 py-5 md:px-8">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-amber-100">{t('certTitle')}</h2>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-amber-100/70 transition-colors hover:bg-white/10 hover:text-amber-100"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-amber-100/70 transition-colors hover:bg-white/10 hover:text-amber-100"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <a
            href={batchUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('download')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#2a1608] transition-transform hover:scale-105"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Document */}
      <motion.div
        className="flex min-h-[520px] w-full items-start justify-center overflow-auto border-y border-white/10 bg-black/30 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {isImage ? (
          <motion.img src={batchUrl} alt={t('certTitle')} style={{ scale }} className="origin-top rounded-lg object-contain shadow-2xl" />
        ) : (
          <Document
            file={batchUrl}
            className="flex flex-col items-center gap-4"
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="animate-pulse py-24 text-amber-100/50">{t('loading')}</div>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={scale}
                className="overflow-hidden rounded-lg shadow-2xl"
              />
            ))}
          </Document>
        )}
      </motion.div>

      {/* Verified badge */}
      <div className="flex flex-col items-center p-8 text-center">
        <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <h3 className="text-lg font-bold text-amber-50">{t('verifiedTitle')}</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-amber-100/55">{t('verifiedDesc')}</p>
      </div>
    </div>
  );
}
