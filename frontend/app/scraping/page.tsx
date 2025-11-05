"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrapingResultsDialog } from "@/components/scraping-results-dialog"
import { companies } from "./companies-data"
import { MagnifyingGlassIcon, ClockIcon } from "@heroicons/react/24/outline"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Footer } from "@/components/footer"

interface ScrapeFilters {
  location?: string
  experience?: string
  skills?: string
  degree?: string
  job_type?: string
  teams?: string
  work_type?: string
  region?: string
  query?: string
}

export default function ScrapingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [filters, setFilters] = useState<ScrapeFilters>({})
  const [scrapingResults, setScrapingResults] = useState<any[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState<Set<string>>(new Set())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFilterChange = (key: keyof ScrapeFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleScrapeCompany = async (companyId: string) => {
    const company = companies.find(c => c.id === companyId)
    if (!company) return

    setLoadingCompanies(prev => new Set(prev).add(companyId))
    setSelectedCompany(companyId)

    try {
      let endpoint = ""
      let body: any = {}

      if (company.id === "google") {
        endpoint = "http://localhost:6500/api/google-jobs"
        body = {
          location: filters.location || "",
          experience: filters.experience || "",
          skills: filters.skills || "",
          degree: filters.degree || "",
          job_type: filters.job_type || "FULL_TIME",
        }
      } else if (company.id === "netflix") {
        endpoint = "http://localhost:6500/api/netflix-jobs"
        body = {
          teams: filters.teams || "",
          work_type: filters.work_type || "",
          region: filters.region || "",
        }
      } else if (company.id === "stripe") {
        endpoint = "http://localhost:6500/api/stripe-jobs"
        body = {
          teams: filters.teams || "",
          query: filters.query || "",
        }
      } else if (company.id === "cloudflare") {
        endpoint = "http://localhost:6500/api/cloudflare-jobs"
        body = {
          location: filters.location || "",
          department: filters.teams || "",
          title: filters.query || "",
        }
      } else if (company.id === "deepmind") {
        endpoint = "http://localhost:6500/api/deepmind-jobs"
        body = {
          keyword: filters.query || "",
        }
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      setScrapingResults(prev => [
        ...prev.filter(r => r.company !== company.name),
        {
          company: company.name,
          jobsFound: data.total_jobs,
          status: data.total_jobs > 0 ? "success" : "no-jobs",
          jobs: data.jobs,
          search_url: data.search_url,
        },
      ])
      setIsDialogOpen(true)
    } catch (err) {
      console.error(err)
      setScrapingResults(prev => [
        ...prev.filter(r => r.company !== company.name),
        {
          company: company.name,
          jobsFound: 0,
          status: "error",
          jobs: [],
          search_url: company.website,
        },
      ])
      setIsDialogOpen(true)
    } finally {
      setLoadingCompanies(prev => {
        const newSet = new Set(prev)
        newSet.delete(companyId)
        return newSet
      })
    }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6 p-6">
          {/* Search */}
          <div className="flex items-center gap-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Company Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {filteredCompanies.map(company => {
              const loading = loadingCompanies.has(company.id)
              const expanded = selectedCompany === company.id
              return (
                <div
                  key={company.id}
                  className="border rounded-lg p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{company.name}</h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                      </Badge>
                    </div>
                    {loading && <ClockIcon className="h-5 w-5 text-yellow-500 animate-spin" />}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground">{company.description}</p>

                  {/* Filters */}
                  {expanded && company.id === "google" && (
                    <div className="space-y-2 mt-2">
                      <Input placeholder="Location" onChange={e => handleFilterChange("location", e.target.value)} />
                      <Input placeholder="INTERN_AND_APPRENTICE, EARLY, MID, ADVANCED, DIRECTOR_PLUS" onChange={e => handleFilterChange("experience", e.target.value)} />
                      <Input placeholder="Skills (comma)" onChange={e => handleFilterChange("skills", e.target.value)} />
                      <Input placeholder="PURSUING_DEGREE, ASSOCIATE, BACHELORS, MASTERS, DOCTORATE" onChange={e => handleFilterChange("degree", e.target.value)} />
                      <Input placeholder="FULL_TIME, PART_TIME, TEMPORARY, INTERN" onChange={e => handleFilterChange("job_type", e.target.value)} />
                    </div>
                  )}
                  {expanded && company.id === "netflix" && (
                    <div className="space-y-2 mt-2">
                      <Input placeholder="Team" onChange={e => handleFilterChange("teams", e.target.value)} />
                      <Input placeholder="Work Type" onChange={e => handleFilterChange("work_type", e.target.value)} />
                      <Input placeholder="Eg, Asia=apac" onChange={e => handleFilterChange("region", e.target.value)} />
                    </div>
                  )}
                  {expanded && company.id === "stripe" && (
                    <div className="space-y-2 mt-2">
                      <Input placeholder="Team" onChange={e => handleFilterChange("teams", e.target.value)} />
                      <Input placeholder="Query Keywords" onChange={e => handleFilterChange("query", e.target.value)} />
                    </div>
                  )}
                  {expanded && company.id === "cloudflare" && (
                    <div className="space-y-2 mt-2">
                      <Input placeholder="Location" onChange={e => handleFilterChange("location", e.target.value)} />
                      <Input placeholder="Department" onChange={e => handleFilterChange("teams", e.target.value)} />
                      <Input placeholder="Job Title / Keywords" onChange={e => handleFilterChange("query", e.target.value)} />
                    </div>
                  )}
                  {expanded && company.id === "deepmind" && (
                    <div className="space-y-2 mt-2">
                      <Input placeholder="Keyword" onChange={e => handleFilterChange("query", e.target.value)} />
                    </div>
                  )}

                  {/* Scrape Button */}
                  <Button
                    onClick={() => handleScrapeCompany(company.id)}
                    disabled={loading}
                  >
                    {loading ? "Scraping..." : "Scrape Jobs"}
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Dialog */}
          <ScrapingResultsDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            results={scrapingResults}
          />
        </div>
        <Footer />
      </DashboardLayout>
    </AuthGuard>
  )
}
