import mammoth from "mammoth";
import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import PdfParse from "pdf-parse-debugging-disabled";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      // "application/vnd.oasis.opendocument.text",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX files are allowed." },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // For now, return a placeholder response
    // In a real implementation, you would:
    // 1. Upload the file to a service like AWS S3 or process it directly
    // 2. Use a library like pdf-parse for PDFs or mammoth for DOCX
    // 3. Extract text content from the file
    // 4. Return the extracted text

    const placeholderText = `This is a placeholder for the extracted text from ${file.name}. 
    
    In a real implementation, this would contain the actual text content extracted from your uploaded file.
    
    The file processing would include:
    - PDF text extraction using pdf-parse or similar
    - DOCX text extraction using mammoth or similar
    - Proper error handling for corrupted files
    - Text cleaning and formatting`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    if (file.type === "application/pdf") {
      const pdfData = await PdfParse(buffer);
      extractedText = pdfData.text;
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      extractedText = "Unsupported file type for extraction.";
    }

    if (!extractedText.trim()) {
      extractedText = "No readable text found in this document.";
    }

    return NextResponse.json({
      text: extractedText,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
