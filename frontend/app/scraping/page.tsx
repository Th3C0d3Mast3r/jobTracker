"use client"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ScrapingResultsDialog } from "@/components/scraping-results-dialog"
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"

interface Company {
  id: string
  name: string
  logo: string
  category: "MAANG" | "Tech Giants" | "Startups" | "Finance" | "Other"
  website: string
  description: string
  isActive: boolean
}

const companies: Company[] = [
  // MAANG Companies
  {
    id: "meta",
    name: "Meta",
    logo: "/meta-logo-abstract.png",
    category: "MAANG",
    website: "meta.com/careers",
    description: "Social media and metaverse technology",
    isActive: true,
  },
  {
    id: "apple",
    name: "Apple",
    logo: "/apple-logo.png",
    category: "MAANG",
    website: "jobs.apple.com",
    description: "Consumer electronics and software",
    isActive: true,
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "/amazon-logo.png",
    category: "MAANG",
    website: "amazon.jobs",
    description: "E-commerce and cloud computing",
    isActive: true,
  },
  {
    id: "netflix",
    name: "Netflix",
    logo: "/netflix-inspired-logo.png",
    category: "MAANG",
    website: "jobs.netflix.com",
    description: "Streaming entertainment service",
    isActive: true,
  },
  {
    id: "google",
    name: "Google",
    logo: "/google-logo.png",
    category: "MAANG",
    website: "careers.google.com",
    description: "Search engine and cloud services",
    isActive: true,
  },
  // Tech Giants
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "/microsoft-logo.png",
    category: "Tech Giants",
    website: "careers.microsoft.com",
    description: "Software and cloud computing",
    isActive: true,
  },
  {
    id: "tesla",
    name: "Tesla",
    logo: "/tesla-logo.png",
    category: "Tech Giants",
    website: "tesla.com/careers",
    description: "Electric vehicles and clean energy",
    isActive: true,
  },
  {
    id: "uber",
    name: "Uber",
    logo: "/provider-logos/uber.png",
    category: "Tech Giants",
    website: "uber.com/careers",
    description: "Ride-sharing and delivery platform",
    isActive: true,
  },
  {
    id: "airbnb",
    name: "Airbnb",
    logo: "/airbnb-logo-inspired-abstract.png",
    category: "Tech Giants",
    website: "careers.airbnb.com",
    description: "Online marketplace for lodging",
    isActive: true,
  },
  // Startups
  {
    id: "stripe",
    name: "Stripe",
    logo: "/stripe-logo.png",
    category: "Startups",
    website: "stripe.com/jobs",
    description: "Online payment processing",
    isActive: true,
  },
  {
    id: "notion",
    name: "Notion",
    logo: "/notion-logo.png",
    category: "Startups",
    website: "notion.so/careers",
    description: "Productivity and note-taking software",
    isActive: true,
  },
  {
    id: "figma",
    name: "Figma",
    logo: "/figma-logo.png",
    category: "Startups",
    website: "figma.com/careers",
    description: "Collaborative design platform",
    isActive: true,
  },
  // Finance
  {
    id: "goldman",
    name: "Goldman Sachs",
    logo: "/goldman-sachs-logo.png",
    category: "Finance",
    website: "goldmansachs.com/careers",
    description: "Investment banking and financial services",
    isActive: true,
  },
  {
    id: "jpmorgan",
    name: "JPMorgan Chase",
    logo: "/jp-morgan-logo.png",
    category: "Finance",
    website: "careers.jpmorgan.com",
    description: "Banking and financial services",
    isActive: true,
  },
]

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

export default function ScrapingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [scrapingResults, setScrapingResults] = useState<ScrapingResult[]>([])
  const [isScrapingDialogOpen, setIsScrapingDialogOpen] = useState(false)
  const [loadingCompanies, setLoadingCompanies] = useState<Set<string>>(new Set())

  const categories = ["all", "MAANG", "Tech Giants", "Startups", "Finance", "Other"]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || company.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleScrapeCompany = async (company: Company) => {
    setLoadingCompanies((prev) => new Set(prev).add(company.id))

    // Simulate scraping delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 2000))

    // Mock scraping results
    const mockResults: ScrapingResult = {
      company: company.name,
      jobsFound: Math.floor(Math.random() * 50) + 1,
      status: Math.random() > 0.1 ? "success" : Math.random() > 0.5 ? "no-jobs" : "error",
      jobs: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => ({
        title: [
          "Software Engineer",
          "Frontend Developer",
          "Backend Engineer",
          "Full Stack Developer",
          "Data Scientist",
          "Product Manager",
          "DevOps Engineer",
          "Mobile Developer",
        ][Math.floor(Math.random() * 8)],
        location: ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Remote"][
          Math.floor(Math.random() * 5)
        ],
        department: ["Engineering", "Product", "Data", "Design", "Marketing"][Math.floor(Math.random() * 5)],
        url: `https://${company.website}/job-${i + 1}`,
      })),
    }

    setScrapingResults((prev) => {
      const filtered = prev.filter((result) => result.company !== company.name)
      return [...filtered, mockResults]
    })

    setLoadingCompanies((prev) => {
      const newSet = new Set(prev)
      newSet.delete(company.id)
      return newSet
    })
  }

  const handleScrapeAll = async () => {
    const activeCompanies = filteredCompanies.filter((c) => c.isActive)
    setScrapingResults([])

    for (const company of activeCompanies) {
      await handleScrapeCompany(company)
    }

    setIsScrapingDialogOpen(true)
  }

  const getCompanyStatus = (companyId: string) => {
    const result = scrapingResults.find((r) => r.company === companies.find((c) => c.id === companyId)?.name)
    if (loadingCompanies.has(companyId)) return "loading"
    if (!result) return "idle"
    return result.status
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Job Discovery</h1>
              <p className="text-muted-foreground">Discover new opportunities from top companies</p>
            </div>
            <Button onClick={handleScrapeAll} className="flex items-center gap-2" disabled={loadingCompanies.size > 0}>
              <MagnifyingGlassIcon className="h-4 w-4" />
              {loadingCompanies.size > 0 ? "Scraping..." : "Scrape All Active"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{companies.length}</div>
                <div className="text-sm text-muted-foreground">Total Companies</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{companies.filter((c) => c.isActive).length}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{scrapingResults.length}</div>
                <div className="text-sm text-muted-foreground">Scraped</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {scrapingResults.reduce((sum, result) => sum + result.jobsFound, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Jobs Found</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCompanies.map((company) => {
              const status = getCompanyStatus(company.id)
              const result = scrapingResults.find((r) => r.company === company.name)

              return (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={company.logo || "/placeholder.svg"}
                          alt={`${company.name} logo`}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-foreground">{company.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {company.category}
                          </Badge>
                        </div>
                      </div>

                      {status === "loading" && <ClockIcon className="h-5 w-5 text-yellow-500 animate-spin" />}
                      {status === "success" && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                      {status === "error" && <XCircleIcon className="h-5 w-5 text-red-500" />}
                      {status === "no-jobs" && <XCircleIcon className="h-5 w-5 text-gray-500" />}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{company.description}</p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <GlobeAltIcon className="h-4 w-4" />
                      <span>{company.website}</span>
                    </div>

                    {result && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium text-foreground">
                          {result.status === "success" && `${result.jobsFound} jobs found`}
                          {result.status === "no-jobs" && "No jobs available"}
                          {result.status === "error" && "Scraping failed"}
                        </div>
                        {result.status === "success" && result.jobs.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Latest: {result.jobs[0].title} - {result.jobs[0].location}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleScrapeCompany(company)}
                        disabled={status === "loading"}
                        className="flex-1"
                      >
                        {status === "loading" ? "Scraping..." : "Scrape Jobs"}
                      </Button>
                      <Button size="sm" variant="outline">
                        <BuildingOfficeIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredCompanies.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">No companies match your search criteria</div>
              </CardContent>
            </Card>
          )}
        </div>

        <ScrapingResultsDialog
          open={isScrapingDialogOpen}
          onOpenChange={setIsScrapingDialogOpen}
          results={scrapingResults}
        />
      </DashboardLayout>
    </AuthGuard>
  )
}
