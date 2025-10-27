"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CheckCircleIcon, XCircleIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"

interface ScrapingResult {
  company: string
  jobsFound: number
  status: "success" | "error" | "no-jobs"
  search_url: string
}

interface ScrapingResultsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  results: ScrapingResult[]
}

export function ScrapingResultsDialog({ open, onOpenChange, results }: ScrapingResultsDialogProps) {
  const totalJobs = results.reduce((sum, r) => sum + r.jobsFound, 0)
  const successfulScrapes = results.filter((r) => r.status === "success").length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Scraping Results</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4 space-y-4">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
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

              <div className="mt-3">
                {result.status === "success" && (
                  <a
                    href={result.search_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline flex items-center gap-1"
                  >
                    View Jobs
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
                )}

                {result.status === "error" && (
                  <div className="text-sm text-red-600 mt-1">Failed to fetch jobs. Please try again.</div>
                )}

                {result.status === "no-jobs" && (
                  <div className="text-sm text-muted-foreground mt-1">No job openings found.</div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>

        <Separator />

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {totalJobs} total jobs across {successfulScrapes} companies
            </div>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
