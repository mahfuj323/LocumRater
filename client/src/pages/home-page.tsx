import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { Loader2 } from "lucide-react";
import logo from "../assets/logo.png";
import pharmacyMap from "../assets/pharmacy-map.png";

export default function HomePage() {
  // Temporarily disable auth check to get the app running
  const user = null;
  
  // Define types for our API response
  interface WorkplacesResponse {
    workplaces: Array<{
      id: number;
      name: string;
      city: string;
      type: string;
    }>;
    isLimited: boolean;
  }
  
  const { data: workplacesData, isLoading: isLoadingWorkplaces } = useQuery<WorkplacesResponse>({
    queryKey: ['/api/workplaces'],
  });

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-violet-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="mb-8">
                <div className="flex flex-col md:flex-row items-center mb-6">
                  <img 
                    src={logo} 
                    alt="Rate My Locum Logo" 
                    className="h-24 md:h-36 mb-3 md:mb-0"
                  />
                  <div className="md:ml-6 md:max-w-lg">
                    <p className="text-slate-700 font-medium text-center md:text-left text-sm md:text-base lg:text-lg">
                      The UK's first platform where locum pharmacists, dispensers, optometrists, and other healthcare professionals can rate and review workplaces and agencies.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-4 mb-8">
                <div className="flex items-start">
                  <span className="text-primary font-bold text-xl mr-2">1.</span>
                  <div>
                    <h3 className="text-xl font-semibold">Add a Workplace</h3>
                    <p className="text-slate-600">Submit the name and location of the pharmacy, clinic, or optician you worked at—even if it's not already in the system.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-primary font-bold text-xl mr-2">2.</span>
                  <div>
                    <h3 className="text-xl font-semibold">Leave a Review</h3>
                    <p className="text-slate-600">Use our structured template to rate pay, transport links, facilities, payment times, and more.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-primary font-bold text-xl mr-2">3.</span>
                  <div>
                    <h3 className="text-xl font-semibold">Help the Community</h3>
                    <p className="text-slate-600">Your insights help other locums make informed choices—and avoid nightmare shifts.</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/rate">Submit a Review</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/search">Search Workplaces</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg shadow-lg overflow-hidden bg-gradient-to-br from-white to-blue-50 aspect-video flex items-center justify-center">
                <img 
                  src={pharmacyMap} 
                  alt="Pharmacy location map with ratings" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Why Rate My Locum Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Rate My Locum?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Because your time matters. No more walking into stressful environments or unclear expectations. Get honest insights before you commit.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className="flex items-center mb-4">
              <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold">Create an Account</h3>
            </div>
            <p className="text-slate-600 ml-14">Sign up to unlock all features and join our community of healthcare professionals.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className="flex items-center mb-4">
              <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold">Search Workplaces</h3>
            </div>
            <p className="text-slate-600 ml-14">Find workplaces or agencies by location, role, or rating to discover new opportunities.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className="flex items-center mb-4">
              <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold">Rate & Review</h3>
            </div>
            <p className="text-slate-600 ml-14">Share your experiences to help others find the right fit and improve workplace conditions.</p>
          </div>
        </div>
      </div>
      
      {/* Featured Reviews */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Featured Workplace Reviews</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">See what other locums are saying about workplaces near you. {!user && "Create an account to see all reviews."}</p>
          </div>
          
          {isLoadingWorkplaces ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : workplacesData?.workplaces?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workplacesData.workplaces.map((workplace: any) => (
                <Link key={workplace.id} href={`/workplace/${workplace.id}`}>
                  <Card className="cursor-pointer hover:shadow-md transition">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{workplace.name}</h3>
                          <p className="text-slate-500 text-sm">{workplace.city}, UK</p>
                        </div>
                        <div className="bg-blue-50 text-primary text-sm font-medium py-1 px-2 rounded">
                          {workplace.type === 'pharmacy' ? 'Pharmacy' : 
                          workplace.type === 'optometry' ? 'Optometry' : 
                          workplace.type === 'hospital' ? 'Hospital' : 'Healthcare'}
                        </div>
                      </div>
                      <div className="mb-4">
                        <StarRating value={4} readOnly />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div>
                          <span className="font-medium text-slate-700">Location:</span>
                          <span className="text-slate-600 ml-1">{workplace.city}</span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700">Type:</span>
                          <span className="text-slate-600 ml-1 capitalize">{workplace.type}</span>
                        </div>
                      </div>
                      <div className="text-sm text-primary font-medium hover:underline mt-2 text-right">
                        View Details
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">Coming soon! Sign up to see and add workplace reviews.</p>
            </div>
          )}
          
          {workplacesData?.isLimited && (
            <div className="mt-10 text-center">
              <p className="text-slate-600 mb-4">Want to see more reviews? Sign up for free access to all reviews.</p>
              <Button asChild variant="outline">
                <Link href="/auth">
                  View All Reviews
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="bg-gradient-to-br from-violet-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">What Our Users Say</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Hear from healthcare professionals who have used Rate My Locum to find great workplaces.</p>
          </div>
          
          <div className="text-center py-8">
            <p className="text-slate-600 mb-6">Real testimonials from locum healthcare professionals coming soon.</p>
            <Button asChild variant="outline">
              <Link href="/auth">Sign Up to Leave a Review</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
