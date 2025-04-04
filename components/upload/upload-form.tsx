'use client';
import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner"
import { generatePdfSummary, storePdfSummaryAction } from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from "./loading-skeleton";



const schema = z.object({
    file:z.instanceof(File,{message:"Invalid File"}).refine((file)=>file.size <= 20*1024*1024,"File size must be less than 20MB")
    .refine((file)=> file.type.startsWith("application/pdf"),"File must be a PDF"),

});

export default function UploadForm(){

    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsloading] = useState(false);
    const router = useRouter();

    const { startUpload,routeConfig } = useUploadThing(
        'pdfUploader',{
            onClientUploadComplete:()=> {
                console.log('uploaded successfully!');
            },
            onUploadError:(err)=>{
                console.log('error occured while uploading',err);
                toast("Error occured while uploading",{description:err.message});
            },
            onUploadBegin:(data)=> {
                console.log('upload has begun for ',data);
            },
        }
    );

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        try {
            setIsloading(true);
            const formData = new FormData(e.currentTarget);
            const file = formData.get('file') as File;

            //validating the fileds
            const validatedFields = schema.safeParse({file});
            console.log(validatedFields);
            if(!validatedFields.success){
                
                toast("❌ Something went wrong",{
                    description:validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid File",
                });
                setIsloading(false);
                return ;
            }
            
            toast("📄 Uploading PDF...",{ description:"We are uploading your PDF!"})
            
            //upload the file to uploadthing
            try {
                const uploadResponse = await startUpload([file]);
                console.log("✅ Upload response:", uploadResponse);
              } catch (error) {
                console.error("❌ Error during startUpload:", error);
                setIsloading(false);
                return;
              }
              
            // console.log("✅ Upload response:", uploadResponse);
            // if(!uploadResponse) {
                
            //     toast("Something went wrong",{
            //         description:"Please use a different file"
            //     })
            //     setIsloading(false);
            //     return;
            // }
            toast("📄 Processing PDF...",{description:"Hang tight! Our AI is reading through your document! ✨"})
            
            // const uploadedFileUrl = uploadResponse[0].serverData.fileUrl;
            const uploadedFileUrl = uploadResponse?.[0]?.serverData?.fileUrl;

            if (!uploadedFileUrl) {
                toast("❌ File upload failed", {
                    description: "We couldn’t retrieve the file URL. Try again."
                });
                setIsloading(false);
                return;
            }

            //parse the pdf using langchain
            const result = await generatePdfSummary({
                fileUrl:uploadedFileUrl,
                fileName: file.name,
            });
            // summarise the pdf using AI
            const { data = null, message = null } =result || {};

            if(data){
                let storeResult:any;
                toast("📄 Saving PDF...",{description:"Hang tight! We are saving your summary! ✨"});
                
                if(data.summary){
                    storeResult = await storePdfSummaryAction({
                    
                        summary: data.summary,
                        fileUrl: uploadedFileUrl,
                        title: data.title,
                        fileName:file.name,
                    });
                }

                toast("✨ Summary saved!",{
                    description:"Your PDF has been successfully summarized and saved!!"
                });

                formRef.current?.reset();
                
                //REDIRECT LOGIC

                router.push(`/summaries/${storeResult.data.id}`);
            }
            
            // save the summary to the database
            // redirect to the summary page
        } catch (error) {
            setIsloading(false);
            console.error("Error Occured",error)
            formRef.current?.reset();
            setIsloading(false);

        }finally{
            setIsloading(false);
        }

        
        
    };
    return <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto ">
       <UploadFormInput isLoading = {isLoading} ref={formRef} onSubmit={handleSubmit} />{
        isLoading && (
            <>
                <div className="realtive">
                    <div 
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"    
                    >
                        <div className="w-full border-t border-gray-200 dark:border-gray-800 "/>

                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-background px-3 text-muted-foreground text-sm ">
                            Processing
                        </span>

                    </div>

                </div>
                <LoadingSkeleton />
            </>
        )
       }
    </div>
}