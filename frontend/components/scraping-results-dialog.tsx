"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CheckCircleIcon, XCircleIcon, ExternalLinkIcon } from "@heroicons/react/24/outline"

interface ScrapingResult {
  company: string
  jobsFound: number
  status: "success" | "error" | "no-jobs"
  jobs: Array<{
    title: string
    location: string
    department: string
    url: string
  }>
}

interface ScrapingResultsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  results: ScrapingResult[]
}

export function ScrapingResultsDialog({ open, onOpenChange, results }: ScrapingResultsDialogProps) {
  const totalJobs = results.reduce((sum, result) => sum + result.jobsFound, 0)
  const successfulScrapes = results.filter((r) => r.status === "success").length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Scraping Results</DialogTitle>
          <DialogDescription>
            Found {totalJobs} jobs across {successfulScrapes} companies
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{result.company}</h3>
                    {result.status === "success" && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                    {result.status === "error" && <XCircleIcon className="h-5 w-5 text-red-500" />}
                    {result.status === "no-jobs" && <XCircleIcon className="h-5 w-5 text-gray-500" />}
                  </div>
                  <Badge
                    variant={result.status === "success" ? "default" : "secondary"}
                    className={
                      result.status === "success"
                        ? "bg-green-500 hover:bg-green-600"
                        : result.status === "error"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gray-500 hover:bg-gray-600"
                    }
                  >
                    {result.status === "success" && `${result.jobsFound} jobs`}
                    {result.status === "no-jobs" && "No jobs"}
                    {result.status === "error" && "Error"}
                  </Badge>
                </div>

                {result.status === "success" && result.jobs.length > 0 && (
                  <div className="space-y-2">
                    {result.jobs.slice(0, 3).map((job, jobIndex) => (
                      <div key={jobIndex} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-foreground">{job.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {job.location} • {job.department}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={job.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLinkIcon className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                    {result.jobs.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center py-2">
                        +{result.jobs.length - 3} more jobs
                      </div>
                    )}
                  </div>
                )}

                {result.status === "error" && (
                  <div className="text-sm text-red-600">
                    Failed to scrape jobs from this company. Please try again later.
                  </div>
                )}

                {result.status === "no-jobs" && (
                  <div className="text-sm text-muted-foreground">No job openings found at this time.</div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {totalJobs} total jobs found from {results.length} companies
            </div>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
