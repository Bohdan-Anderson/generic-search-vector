import * as pdfjsLib from "pdfjs-dist";
import pdfworker from "pdfjs-dist/build/pdf.worker.min?url";

export async function gettext(pdfData: ArrayBuffer) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfworker;
  const pdf = pdfjsLib.getDocument(pdfData);
  return await pdf.promise.then(async (pdf: any) => {
    const maxPages = pdf.numPages;
    const countPromises = [];
    for (var j = 1; j <= maxPages; j++) {
      const page = pdf.getPage(j);
      countPromises.push(
        page.then(function (page: any) {
          var textContent = page.getTextContent();
          return textContent.then(function (text: any) {
            return text.items
              .map(function (s: any) {
                return s.str;
              })
              .join(" ");
          });
        })
      );
    }
    const results = await Promise.all(countPromises);
    return results;
  });
}
