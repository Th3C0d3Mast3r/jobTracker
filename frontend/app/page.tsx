import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  BriefcaseIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-foreground">JobTracker</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Track Your Job Applications
            <span className="text-muted-foreground"> Effortlessly</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            A minimalistic, interface to organize and monitor your job search progress. Keep track of
            applications, statuses, and discover new opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base px-8 py-3">
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-3 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-lg">Simple tools to streamline your job search</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-border/50 hover:border-border transition-colors">
            <CardContent className="p-6 text-center">
              <ChartBarIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Application Tracking</h3>
              <p className="text-muted-foreground">
                Monitor all your job applications in one clean, organized dashboard with status updates.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-border transition-colors">
            <CardContent className="p-6 text-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Job Discovery</h3>
              <p className="text-muted-foreground">
                Discover new opportunities from top companies including MAANG and other leading employers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-border transition-colors">
            <CardContent className="p-6 text-center">
              <BriefcaseIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Status Management</h3>
              <p className="text-muted-foreground">
                Keep track of application stages from applied to interview to offer with visual indicators.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Status Preview Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Track Every Stage</h2>
          <p className="text-muted-foreground text-lg">Visual status indicators for your applications</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <ClockIcon className="h-4 w-4" />
            Applied
          </Badge>
          <Badge variant="default" className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600">
            <ClockIcon className="h-4 w-4" />
            In Review
          </Badge>
          <Badge variant="default" className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600">
            <ClockIcon className="h-4 w-4" />
            Interview
          </Badge>
          <Badge variant="default" className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600">
            <CheckCircleIcon className="h-4 w-4" />
            Offer
          </Badge>
          <Badge variant="destructive" className="flex items-center gap-2 px-4 py-2">
            <XCircleIcon className="h-4 w-4" />
            Rejected
          </Badge>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of job seekers who are organizing their applications with JobTracker.
          </p>
          <Button asChild size="lg" className="text-base px-8 py-3">
            <Link href="/auth">Start Tracking Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 JobTracker. Built for job seekers, by job seekers.</p>
        </div>
      </footer>
    </div>
  )
}
