import { getDbConnection } from "./db";
import { validate as isUuid } from "uuid";
export async function getSummaries(userId:string) {

    const sql= await getDbConnection();
    const summaries = await sql`SELECT * from pdf_summaries where user_id = ${userId} ORDER BY created_at DESC`;
    return summaries;
    
}

export async function getSummaryById(id:string){
    try {
        if (!isUuid(id)) {
            console.error("Invalid UUID: ", id);
            return null; // Return null instead of querying the database
        }
        
        const sql = await getDbConnection();

        const [summary] = await sql`SELECT id,
                                    user_id,
                                    title,
                                    original_file_url,
                                    summary_text,
                                    created_at,
                                    updated_at,
                                    status,
                                    file_name,
                                    LENGTH(summary_text)-LENGTH(REPLACE(summary_text,' ',''))+1 as word_count 
                                    from pdf_summaries 
                                    where id=${id}`;
        return summary;
    } catch (error) {
        console.error("Error fetching summary by id ",error);
        return null;
    }
}