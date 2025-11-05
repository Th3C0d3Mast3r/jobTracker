"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AddJobDialog } from "@/components/add-job-dialog"
import {
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { Footer } from "@/components/footer"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

interface JobApplication {
  id: string
  jobID: string
  company: string
  position: string
  location: string
  salary?: string
  status: "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED"
  appliedDate: string
  lastUpdate: string
  description?: string
}

const statusOrder: JobApplication["status"][] = ["APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"]

const statusConfig = {
  applied: { label: "Applied", color: "bg-gray-500", icon: ClockIcon },
  interviewing: { label: "Interviewing", color: "bg-yellow-500", icon: ClockIcon },
  offered: { label: "Offered", color: "bg-green-500", icon: CheckCircleIcon },
  rejected: { label: "Rejected", color: "bg-red-500", icon: XCircleIcon },
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const [gmailConnected, setGmailConnected] = useState(false)
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddJobOpen, setIsAddJobOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null)
  const [inlineEditId, setInlineEditId] = useState<string | null>(null)
  const [inlineEditData, setInlineEditData] = useState<Partial<JobApplication>>({})

  useEffect(() => {
    const gmailStatus = searchParams.get("gmail")
    if (gmailStatus === "connected") {
      toast.success("✅ Gmail successfully connected!")
      setGmailConnected(true)
      window.history.replaceState({}, document.title, "/dashboard")
    }
  }, [searchParams])

  const refreshMail = async () => {
    try {
      const res = await axios.get("http://localhost:6500/api/mail/sync-now", { withCredentials: true })
      toast.success(res.data?.message || "Mail synced successfully!")
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Mail sync failed!")
    }
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:6500/api/jobs/getUserJobs", {
          withCredentials: true,
        })
        setJobs(res.data)
      } catch (err) {
        console.error("Error fetching jobs:", err)
      }
    }
    fetchJobs()
  }, [])

  const statusCounts = {
    all: jobs.length,
    applied: jobs.filter((j) => j.status.toLowerCase() === "applied").length,
    interviewing: jobs.filter((j) => j.status.toLowerCase() === "interviewing").length,
    offered: jobs.filter((j) => j.status.toLowerCase() === "offered").length,
    rejected: jobs.filter((j) => j.status.toLowerCase() === "rejected").length,
  }

  const handleAddJob = async (newJob: Omit<JobApplication, "id" | "appliedDate" | "lastUpdate">) => {
    try {
      const res = await axios.post(
        "http://localhost:6500/api/jobs/addJob",
        {
          companyName: newJob.company,
          jobTitle: newJob.position,
          location: newJob.location,
          jobDescription: newJob.description,
          jobStatus: newJob.status.toUpperCase(),
          salary: newJob.salary,
          jobID: newJob.jobID,
        },
        { withCredentials: true }
      )

      if (res.data?.job) {
        const job = res.data.job
        setJobs([
          {
            id: job._id,
            company: job.companyName,
            position: job.jobTitle,
            location: job.location,
            status: job.jobStatus.toUpperCase(),
            appliedDate: job.createdAt.split("T")[0],
            lastUpdate: job.updatedAt.split("T")[0],
            description: job.jobDescription,
            salary: job.salary,
            jobID: job.jobID,
          },
          ...jobs,
        ])
      }
    } catch (err) {
      console.error("Error adding job:", err)
    }
  }

  const handleEditJob = async (updatedJob: JobApplication) => {
    try {
      const res = await axios.put(
        `http://localhost:6500/api/jobs/updateJob/${updatedJob.id}`,
        {
          companyName: updatedJob.company,
          jobTitle: updatedJob.position,
          location: updatedJob.location,
          jobDescription: updatedJob.description,
          jobStatus: updatedJob.status.toUpperCase(),
          salary: updatedJob.salary,
        },
        { withCredentials: true }
      )

      // ✅ Instantly update UI (uses local update first)
      setJobs((prev) =>
        prev.map((j) =>
          j.id === updatedJob.id ? { ...j, ...updatedJob } : j
        )
      )

      // 🔄 Then, if server sends fresh job, merge that too (ensures consistency)
      if (res.data?.job) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === updatedJob.id ? { ...j, ...res.data.job } : j
          )
        )
      }

      // ✅ Exit edit mode
      setInlineEditId(null)
    } catch (err) {
      console.error("Error editing job:", err)
    }
  }
  const handleRemoveJob = async (jobId: string) => {
    try {
      await axios.delete(`http://localhost:6500/api/jobs/deleteJob/${jobId}`, { withCredentials: true })
      setJobs(jobs.filter((j) => j.id !== jobId))
    } catch (err) {
      console.error("Error deleting job:", err)
    }
  }

  const connectMail = async () => {
    try {
      const res = await axios.get("http://localhost:6500/api/mail/auth-url", { withCredentials: true })
      if (res.data?.url) window.location.href = res.data.url
    } catch (err) {
      console.error("Connect mail failed", err)
    }
  }

  const cycleStatus = async (job: JobApplication) => {
    const currentIndex = statusOrder.indexOf(job.status)
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]

    try {
      await axios.put(
        `http://localhost:6500/api/jobs/updateJob/${job.id}`,
        { jobStatus: nextStatus },
        { withCredentials: true }
      )
      setJobs(jobs.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j)))
    } catch (err) {
      console.error("Error updating status:", err)
    }
  }

  const filteredJobs =
    statusFilter === "all"
      ? jobs
      : jobs.filter((j) => j.status.toLowerCase() === statusFilter.toLowerCase())

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Job Applications</h1>
              <p className="text-muted-foreground">Track and manage your job application progress</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsAddJobOpen(true)} className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" /> Add Application
              </Button>
              {!gmailConnected ? (
                <Button variant="secondary" onClick={connectMail} className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" /> Automate w/ Mail
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  ✅ Mail Connected
                </span>
              )}
            </div>
          </div>

          {/* Status Filters */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const config = statusConfig[status as keyof typeof statusConfig]
              const isAll = status === "all"
              return (
                <Card
                  key={status}
                  className={`cursor-pointer transition-colors ${
                    statusFilter === status ? "ring-2 ring-primary" : "hover:bg-accent"
                  }`}
                  onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{count}</div>
                    <div className="text-sm text-muted-foreground">
                      {isAll ? "Total" : config?.label || status}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No applications found.
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => {
                const config = statusConfig[job.status.toLowerCase() as keyof typeof statusConfig]
                const StatusIcon = config.icon
                const isEditing = inlineEditId === job.id

                return (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          {/* Editable Fields */}
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                className="border rounded p-1 w-full"
                                value={inlineEditData.position || job.position}
                                onChange={(e) =>
                                  setInlineEditData({ ...inlineEditData, position: e.target.value })
                                }
                              />
                              <input
                                className="border rounded p-1 w-full"
                                value={inlineEditData.company || job.company}
                                onChange={(e) =>
                                  setInlineEditData({ ...inlineEditData, company: e.target.value })
                                }
                              />
                              <textarea
                                className="border rounded p-1 w-full"
                                value={inlineEditData.description || job.description || ""}
                                onChange={(e) =>
                                  setInlineEditData({ ...inlineEditData, description: e.target.value })
                                }
                              />
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">{job.position}</h3>
                                <p className="text-base text-muted-foreground font-medium">{job.company}</p>
                              </div>
                              <button
                                onClick={() => cycleStatus(job)}
                                className={`${config.color} text-white flex items-center gap-1 px-2 py-1 rounded-md transition hover:opacity-90`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {config.label}
                              </button>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>{job.location}</span>
                            {job.salary && <span>{job.salary}</span>}
                            <span>Applied: {new Date(job.appliedDate).toLocaleDateString()}</span>
                            <span>Updated: {new Date(job.lastUpdate).toLocaleDateString()}</span>
                          </div>

                          {job.description && !isEditing && (
                            <p className="text-sm text-muted-foreground mt-2">{job.description}</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  handleEditJob({ ...job, ...inlineEditData })
                                }}
                              >
                                <CheckIcon className="h-4 w-4" /> Save
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setInlineEditId(null)
                                  setInlineEditData({})
                                }}
                              >
                                <XMarkIcon className="h-4 w-4" /> Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setInlineEditId(job.id)
                                  setInlineEditData(job)
                                }}
                              >
                                <PencilIcon className="h-4 w-4" /> Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveJob(job.id)}
                              >
                                REMOVE
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        <Footer />

        <AddJobDialog
          open={isAddJobOpen}
          onOpenChange={setIsAddJobOpen}
          onAddJob={editingJob ? handleEditJob : handleAddJob}
          editingJob={editingJob}
        />
      </DashboardLayout>
    </AuthGuard>
  )
}
