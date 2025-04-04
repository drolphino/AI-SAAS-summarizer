'use server';

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
    userId?: string;
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string;
}

// **Generate PDF Summary**
export async function generatePdfSummary(uploadResponse: [{
    serverData: {
        userId: string;
        file: {
            url: string;
            name: string;
        };
    };
}]) {
    if (!uploadResponse) {
        return {
            success: false,
            message: "File upload failed",
            data: null,
        };
    }

    const {
        serverData: {
            userId,
            file: { url: pdfUrl, name: fileName },
        },
    } = uploadResponse[0];

    if (!pdfUrl) {
        return {
            success: false,
            message: "File upload failed",
            data: null,
        };
    }

    try {
        const pdfText = await fetchAndExtractPdfText(pdfUrl);
        console.log({ pdfText });

        let summary;
        try {
            summary = await generateSummaryFromGemini(pdfText);
            console.log({ summary });
        } catch (error) {
            console.error("Gemini API Error:", error);

            // **Handle Rate Limits**
            if (error instanceof Error && error.message.includes("RATE_LIMIT_EXCEEDED")) {
                try {
                    console.log("Switching to OpenAI for summary...");
                    summary = await generateSummaryFromOpenAI(pdfText);
                } catch (openAIError) {
                    console.error("OpenAI API failed:", openAIError);
                    throw new Error("Failed to generate summary with available AI providers");
                }
            }
        }

        if (!summary) {
            return {
                success: false,
                message: "Failed to generate summary",
                data: null,
            };
        }

        const formattedFileName = formatFileNameAsTitle(fileName);

        return {
            success: true,
            message: "Summary Generated Successfully",
            data: {
                title: formattedFileName,
                summary,
            },
        };

    } catch (error) {
        console.error("Error processing PDF:", error);
        return {
            success: false,
            message: "Error processing file",
            data: null,
        };
    }
}

// **Save PDF Summary to Database**
async function savePdfSummary({ userId, fileUrl, summary, title, fileName }: PdfSummaryType) {
    try {
        const sql = await getDbConnection();
        const [savedSummary] = await sql`
            INSERT INTO pdf_summaries (
                user_id, 
                original_file_url, 
                summary_text, 
                title, 
                file_name 
            ) 
            VALUES (
                ${userId},
                ${fileUrl},
                ${summary},
                ${title},
                ${fileName}
            ) RETURNING id, summary_text;
        `;

        return savedSummary;

    } catch (error) {
        console.error("Error saving PDF summary:", error);
        throw error;
    }
}

// **Store PDF Summary Action**
export async function storePdfSummaryAction({ userId, fileUrl, summary, title, fileName }: PdfSummaryType) {
    let savedSummary: any;

    try {
        const authUser = await auth();
        if (!authUser?.userId) {
            return {
                success: false,
                message: "User not found",
            };
        }

        // **Use Authenticated User ID**
        savedSummary = await savePdfSummary({
            userId: authUser.userId,
            fileUrl,
            summary,
            title,
            fileName
        });

        if (!savedSummary) {
            return {
                success: false,
                message: "Failed to save PDF Summary",
            };
        }

    } catch (error) {
        console.error("Error saving summary:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Error saving PDF summary",
        };
    }

    revalidatePath(`/summaries/${savedSummary.id}`);

    return {
        success: true,
        message: "PDF summary saved successfully",
        data: {
            id: savedSummary.id,
        },
    };
}
