import { CertificateViewer } from '@/components/features/lab-viewer/CertificateViewer';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';

export default function LabAnalysisPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start p-8 md:p-16">
      <ScrollFadeIn delay={0.1} className="max-w-4xl w-full text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">Quality & Provenance</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          At Asseli, transparency is as important as purity. Enter your batch number or scan the QR code on your jar to view its specific, independent laboratory analysis certificate.
        </p>
      </ScrollFadeIn>
      
      <ScrollFadeIn delay={0.3} className="w-full">
        {/* Mocking a specific batch URL for demonstration */}
        <CertificateViewer 
          batchUrl="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" 
        />
      </ScrollFadeIn>
    </div>
  );
}
