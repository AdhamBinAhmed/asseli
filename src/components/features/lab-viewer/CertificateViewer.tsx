'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ZoomIn, ZoomOut, Download, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CertificateViewerProps {
  batchUrl: string;
  isImage?: boolean;
}

export function CertificateViewer({ batchUrl, isImage = false }: CertificateViewerProps) {
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState<number>();
  
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  return (
    <div className="relative flex flex-col items-center bg-card p-6 rounded-2xl shadow-lg border border-border w-full max-w-4xl mx-auto">
      <div className="flex w-full justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">Batch Analysis Certificate</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut} aria-label="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn} aria-label="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" aria-label="Download">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <motion.div 
        className="overflow-auto border border-border bg-muted rounded-lg w-full min-h-[500px] flex justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {isImage ? (
          <motion.img 
            src={batchUrl} 
            alt="Batch Analysis Certificate" 
            style={{ scale }}
            className="origin-center object-contain"
          />
        ) : (
          <Document 
            file={batchUrl} 
            className="flex flex-col items-center gap-4"
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="animate-pulse text-muted-foreground">Loading Certificate...</div>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page 
                key={`page_${index + 1}`} 
                pageNumber={index + 1} 
                scale={scale} 
                className="shadow-sm"
              />
            ))}
          </Document>
        )}
      </motion.div>
      
      <div className="mt-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg">Verified Authentic</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">This batch has been independently tested in certified laboratories to guarantee 100% purity and origin.</p>
      </div>
    </div>
  );
}
