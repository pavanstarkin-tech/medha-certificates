import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { renderCertificateToCanvas } from './certificateRenderer';

/**
 * Downloads a single certificate as PNG image
 */
export async function downloadCertificatePNG(participant, config) {
  const offscreenCanvas = document.createElement('canvas');
  await renderCertificateToCanvas(offscreenCanvas, participant, config);
  
  const cleanName = (participant.fullName || 'Certificate').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_${participant.certId || 'Certificate'}.png`;

  offscreenCanvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, filename);
    }
  }, 'image/png');
}

/**
 * Downloads a single certificate as high-resolution PDF
 */
export async function downloadCertificatePDF(participant, config) {
  const offscreenCanvas = document.createElement('canvas');
  await renderCertificateToCanvas(offscreenCanvas, participant, config);

  const imgData = offscreenCanvas.toDataURL('image/jpeg', 0.95);
  
  // A4 Landscape: 297mm x 210mm
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
  
  const cleanName = (participant.fullName || 'Certificate').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_${participant.certId || 'Certificate'}.pdf`;
  pdf.save(filename);
}

/**
 * Batch generate certificates into a ZIP file containing PDFs or PNGs
 */
export async function generateBatchZIP(participants, config, format = 'pdf', onProgress = () => {}) {
  const zip = new JSZip();
  const folder = zip.folder(`Hackathon_Certificates_${config.eventName ? config.eventName.replace(/[^a-zA-Z0-9_-]/g, '_') : 'Export'}`);
  
  const total = participants.length;
  const offscreenCanvas = document.createElement('canvas');

  for (let i = 0; i < total; i++) {
    const p = participants[i];
    await renderCertificateToCanvas(offscreenCanvas, p, config);

    const safeName = `${String(i + 1).padStart(3, '0')}_${(p.fullName || 'Participant').replace(/[^a-zA-Z0-9_-]/g, '_')}_${p.certId || ''}`;

    if (format === 'pdf') {
      const imgData = offscreenCanvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      const pdfBlob = pdf.output('blob');
      folder.file(`${safeName}.pdf`, pdfBlob);
    } else {
      const dataUrl = offscreenCanvas.toDataURL('image/png');
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      folder.file(`${safeName}.png`, base64Data, { base64: true });
    }

    onProgress({
      current: i + 1,
      total,
      percent: Math.round(((i + 1) / total) * 100),
      currentName: p.fullName
    });

    // Small microtask yield so browser stays responsive and UI updates
    if (i % 3 === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    onProgress({
      current: total,
      total,
      percent: 100,
      status: `Compressing ZIP archive: ${Math.round(metadata.percent)}%`
    });
  });

  const zipFilename = `Hackathon_Certificates_${new Date().toISOString().slice(0, 10)}.zip`;
  saveAs(content, zipFilename);
}
