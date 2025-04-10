import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { Loader2 } from "lucide-react";

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
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                Find & Review <span className="text-primary">Locum Workplaces</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Share your experiences and help fellow healthcare professionals find the best locum opportunities. Rate workplaces and agencies based on real experiences.
              </p>
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
              <div className="rounded-lg shadow-lg overflow-hidden bg-blue-100 aspect-video flex items-center justify-center">
                <svg className="h-24 w-24 text-primary/30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">How Rate My Locum Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Our platform connects healthcare professionals to help them make informed decisions about locum opportunities.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 text-center">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
            <p className="text-slate-600">Sign up to unlock all features and join our community of healthcare professionals.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 text-center">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Search Workplaces</h3>
            <p className="text-slate-600">Find workplaces or agencies by location, role, or rating to discover new opportunities.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 text-center">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
            <p className="text-slate-600">Share your experiences to help others find the right fit and improve workplace conditions.</p>
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
              <p className="text-slate-600">No workplace reviews yet. Be the first to add one!</p>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <StarRating value={5} readOnly />
              </div>
              <blockquote className="text-slate-700 mb-6">
                "Rate My Locum has been a game-changer for my career. I now have reliable information about workplaces before accepting shifts, saving me from bad experiences. The detailed reviews about facilities and payment times are invaluable."
              </blockquote>
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    AM
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-800">Amanda M.</div>
                  <div className="text-sm text-slate-500">Locum Pharmacist, London</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <StarRating value={5} readOnly />
              </div>
              <blockquote className="text-slate-700 mb-6">
                "As a Muslim locum optometrist, knowing which practices have prayer spaces is essential. Rate My Locum makes it easy to find workplaces that accommodate my needs, and the pay rate information helps me negotiate fair compensation."
              </blockquote>
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    MK
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-800">Mohammed K.</div>
                  <div className="text-sm text-slate-500">Locum Optometrist, Manchester</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <StarRating value={4} readOnly />
              </div>
              <blockquote className="text-slate-700 mb-6">
                "I used to waste time with agencies that weren't transparent about payment terms. Now I can see which agencies have good reviews and reliable payment times. The workplace ratings have helped me find great teams to work with too."
              </blockquote>
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    JT
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-800">James T.</div>
                  <div className="text-sm text-slate-500">Locum Dispenser, Bristol</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
