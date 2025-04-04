'use client'
import { Card } from "../ui/card";
import { MotionDiv } from "../common/motion-wrapper";
import ProgressBar from "../summaries/progress-bar";
import { NavigationControls } from "../summaries/navigation-controls";
import { Skeleton } from "@/components/ui/skeleton";

const SectionTitleSkeleton = () => (
    <div className="flex flex-col gap-2 mb-6 sticky top-0 pt-2 pb-4 bg-background/80 backdrop-blur-xs z-10">
        <Skeleton className="h-6 sm:h-8 lg:h-10 w-3/4 mx-auto rounded-lg" />
    </div>
);

const ContentSectionSkeleton = () => (
    <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
    </div>
);

export function LoadingSkeleton() {
    return (
        <Card className="relative px-2 h-[500px] sm:h-[600px] lg:h-[700px] w-[90%] sm:w-[500px] lg:w-[600px] max-w-full overflow-hidden bg-gradient-to-br from-background via-background/95 to-rose-400 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-700 p-4">

            <ProgressBar sections={[]} currentSection={0} />

            <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full overflow-y-auto scrollbar-hide pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24"
            >
                <div className="px-3 sm:px-6">
                    <SectionTitleSkeleton />
                    <ContentSectionSkeleton />
                </div>
            </MotionDiv>

            <NavigationControls 
                currentSection={0} 
                totalSection={3} 
                onPrevious={() => {}} 
                onNext={() => {}} 
                onSectionSelect={() => {}} 
            />
                
        </Card>
    );
}
