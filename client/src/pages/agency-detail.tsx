import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Separator } from "@/components/ui/separator";
import { Loader2, MapPin, Calendar, Users } from "lucide-react";
import { format } from "date-fns";

export default function AgencyDetail() {
  const { id } = useParams();
  const agencyId = parseInt(id);
  const { user } = useAuth();
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  const {
    data: agencyData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`/api/agencies/${agencyId}`],
    enabled: !isNaN(agencyId),
  });

  if (isNaN(agencyId)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600">Invalid agency ID</h2>
        <p className="mt-4 text-slate-600">The agency ID provided is not valid.</p>
        <Button asChild className="mt-6">
          <Link href="/search">Go to Search</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !agencyData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error loading agency</h2>
        <p className="mt-4 text-slate-600">There was a problem loading the agency details.</p>
        <Button asChild className="mt-6">
          <Link href="/search">Go to Search</Link>
        </Button>
      </div>
    );
  }

  const { agency, reviews, totalReviews, isLimited } = agencyData;
  
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length
    : 0;
  
  // Format reviews for display
  const displayedReviews = reviewsExpanded ? reviews : reviews.slice(0, 3);

  // Get unique payment reliability values
  const paymentReliabilityMap: Record<string, number> = {};
  reviews.forEach((review: any) => {
    const reliability = review.paymentReliability;
    paymentReliabilityMap[reliability] = (paymentReliabilityMap[reliability] || 0) + 1;
  });

  // Get the most common payment reliability
  let mostCommonReliability = "";
  let highestCount = 0;
  
  Object.entries(paymentReliabilityMap).forEach(([reliability, count]) => {
    if (count > highestCount) {
      mostCommonReliability = reliability;
      highestCount = count;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/search">
          <Button variant="ghost" className="text-sm p-0 h-auto mb-4">
            ← Back to Search
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{agency.name}</h1>
            {agency.location && (
              <div className="flex items-center mt-2 text-slate-600">
                <MapPin className="h-4 w-4 mr-1" />
                {agency.location}
              </div>
            )}
            <div className="mt-2 flex items-center">
              <div className="bg-blue-50 text-primary text-sm font-medium py-1 px-3 rounded-full mr-2">
                Agency
              </div>
              {reviews.length > 0 && (
                <div className="flex items-center">
                  <StarRating value={averageRating} readOnly />
                  <span className="ml-1 text-sm text-slate-600">
                    ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="flex items-center gap-2">
              <Link href={`/rate?type=agency&id=${agency.id}`}>
                Rate This Agency
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-slate-600 mb-4">No reviews yet for this agency.</p>
                <Button asChild>
                  <Link href={`/rate?type=agency&id=${agency.id}`}>
                    Be the first to leave a review
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {displayedReviews.map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-sm text-slate-500 flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {format(new Date(review.createdAt), "MMMM d, yyyy")}
                        </div>
                      </div>
                      <StarRating value={review.rating} readOnly />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 my-4 text-sm">
                      {review.payRates && (
                        <div>
                          <span className="font-medium text-slate-700">Pay Rates:</span>
                          <span className="text-slate-600 ml-1">{review.payRates}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-slate-700">Payment Reliability:</span>
                        <span className="text-slate-600 ml-1 capitalize">{review.paymentReliability.replace("-", " ")}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Communication:</span>
                        <span className="text-slate-600 ml-1 capitalize">{review.communication}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <p className="text-slate-700">{review.comments}</p>
                    </div>
                    
                    <div className="mt-4 text-sm text-slate-500 flex items-center">
                      <span>Reviewed by: {review.user.username}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(reviews.length > 3 || isLimited) && (
                <div className="text-center">
                  {!user && isLimited ? (
                    <Button asChild variant="outline">
                      <Link href="/auth">Sign in to see all {totalReviews} reviews</Link>
                    </Button>
                  ) : !reviewsExpanded && reviews.length > 3 ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setReviewsExpanded(true)}
                    >
                      Show all {totalReviews} reviews
                    </Button>
                  ) : reviewsExpanded && (
                    <Button 
                      variant="outline" 
                      onClick={() => setReviewsExpanded(false)}
                    >
                      Show fewer reviews
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agency Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-700 flex items-center">
                    <Users className="h-4 w-4 mr-1.5" />
                    Agency Name
                  </h3>
                  <p className="text-slate-600 mt-1">{agency.name}</p>
                </div>
                
                {agency.location && (
                  <div>
                    <h3 className="font-medium text-slate-700 flex items-center">
                      <MapPin className="h-4 w-4 mr-1.5" />
                      Location
                    </h3>
                    <p className="text-slate-600 mt-1">{agency.location}</p>
                  </div>
                )}
                
                {reviews.length > 0 && (
                  <>
                    <div>
                      <h3 className="font-medium text-slate-700">Overall Rating</h3>
                      <div className="mt-1">
                        <StarRating value={averageRating} readOnly />
                        <span className="text-sm text-slate-600 ml-1">
                          Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                        </span>
                      </div>
                    </div>
                    
                    {mostCommonReliability && (
                      <div>
                        <h3 className="font-medium text-slate-700">Payment Reliability</h3>
                        <p className="text-slate-600 mt-1 capitalize">
                          Most commonly rated as: {mostCommonReliability.replace("-", " ")}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-center mt-4">
                <Button asChild className="w-full">
                  <Link href={`/rate?type=agency&id=${agency.id}`}>
                    Rate This Agency
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
