import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Capture an on-page element and download it as a multi-page A4 PDF.
 * Returns true on success.
 */
export async function exportToPdf(elementId: string, filename: string): Promise<boolean> {
  const el = document.getElementById(elementId);
  if (!el) {
    console.error(`exportToPdf: element with id "${elementId}" not found`);
    return false;
  }

  // Force a light background snapshot for legibility regardless of theme.
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const imgData = canvas.toDataURL("image/png");

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    pdf.addPage();
    position = margin - (imgHeight - heightLeft);
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  return true;
}
