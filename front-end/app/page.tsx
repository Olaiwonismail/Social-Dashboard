"use client"

import Link from "next/link"
import { ArrowRight, BarChart2, Instagram, TwitterIcon as TikTok, Youtube, User } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth" // Assuming this hook exists in your project

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if user is already logged in and tries to access landing page
  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth/signup")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-bold text-lg sm:text-xl">CreatorMetrics</span>
          </div>
          <div className="space-x-2 sm:space-x-4">
            {user ? (
              // Show these buttons when user is logged in
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-sm sm:text-base">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="sm" variant="outline" className="text-sm sm:text-base gap-2">
                    <User className="h-4 w-4" />
                    My Account
                  </Button>
                </Link>
              </>
            ) : (
              // Show these buttons when user is not logged in
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-sm sm:text-base">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="text-sm sm:text-base">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Analytics that grow your creator business
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto">
            Get powerful insights across all your social platforms in one dashboard. Make data-driven decisions to
            increase engagement and revenue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button size="lg" className="gap-2 w-full sm:w-auto" onClick={handleGetStarted}>
              {user ? "Go to Dashboard" : "Get Started"} <ArrowRight className="h-4 w-4" />
            </Button>
            {!user && (
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Log in to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/50 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
            All your platforms in one place
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-background p-4 sm:p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-pink-100 flex items-center justify-center mb-3 sm:mb-4">
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-pink-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Instagram Analytics</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Track engagement, reach, and growth across posts, stories, and your profile.
              </p>
            </div>

            <div className="bg-background p-4 sm:p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center mb-3 sm:mb-4">
                <Youtube className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">YouTube Metrics</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Analyze view time, subscriber growth, and revenue from your video content.
              </p>
            </div>

            <div className="bg-background p-4 sm:p-6 rounded-lg shadow-sm flex flex-col items-center text-center sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none md:mx-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3 sm:mb-4">
                <TikTok className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">TikTok Performance</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Measure viral potential, audience demographics, and content performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Only show to non-logged in users */}
      {!user && (
        <section className="py-12 sm:py-16 md:py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to grow your audience?</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
              Join thousands of creators who use CreatorMetrics to make data-driven decisions.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Personalized CTA for logged-in users */}
      {user && (
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Welcome back!</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
              Continue analyzing your creator metrics and growing your audience.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm sm:text-base">
          <p>© 2025 CreatorMetrics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
