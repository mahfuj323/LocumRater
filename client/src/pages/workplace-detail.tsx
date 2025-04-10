import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Separator } from "@/components/ui/separator";
import { Loader2, MapPin, Phone, Calendar, Clock, Building2 } from "lucide-react";
import { format } from "date-fns";

export default function WorkplaceDetail() {
  const { id } = useParams();
  const workplaceId = parseInt(id);
  const { user } = useAuth();
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  const {
    data: workplaceData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`/api/workplaces/${workplaceId}`],
    enabled: !isNaN(workplaceId),
  });

  if (isNaN(workplaceId)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600">Invalid workplace ID</h2>
        <p className="mt-4 text-slate-600">The workplace ID provided is not valid.</p>
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

  if (isError || !workplaceData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error loading workplace</h2>
        <p className="mt-4 text-slate-600">There was a problem loading the workplace details.</p>
        <Button asChild className="mt-6">
          <Link href="/search">Go to Search</Link>
        </Button>
      </div>
    );
  }

  const { workplace, reviews, totalReviews, isLimited } = workplaceData;
  
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length
    : 0;
  
  // Format reviews for display
  const displayedReviews = reviewsExpanded ? reviews : reviews.slice(0, 3);

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
            <h1 className="text-3xl font-bold text-slate-800">{workplace.name}</h1>
            <div className="flex items-center mt-2 text-slate-600">
              <MapPin className="h-4 w-4 mr-1" />
              {workplace.address}, {workplace.city}, {workplace.postcode}
            </div>
            {workplace.phone && (
              <div className="flex items-center mt-1 text-slate-600">
                <Phone className="h-4 w-4 mr-1" />
                {workplace.phone}
              </div>
            )}
            <div className="mt-2 flex items-center">
              <div className="bg-blue-50 text-primary text-sm font-medium py-1 px-3 rounded-full capitalize mr-2">
                {workplace.type}
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
              <Link href={`/rate?type=workplace&id=${workplace.id}`}>
                Rate This Workplace
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
                <p className="text-slate-600 mb-4">No reviews yet for this workplace.</p>
                <Button asChild>
                  <Link href={`/rate?type=workplace&id=${workplace.id}`}>
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
                        <div className="font-semibold capitalize">{review.position}</div>
                        <div className="text-sm text-slate-500 flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {format(new Date(review.createdAt), "MMMM d, yyyy")}
                        </div>
                      </div>
                      <StarRating value={review.rating} readOnly />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 my-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">Pay Rate:</span>
                        <span className="text-slate-600 ml-1">£{review.payRate}/hr</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Payment Time:</span>
                        <span className="text-slate-600 ml-1">{review.paymentTime} days</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Transport:</span>
                        <span className="text-slate-600 ml-1">{review.transport}</span>
                      </div>
                      {review.facilities && (
                        <div>
                          <span className="font-medium text-slate-700">Facilities:</span>
                          <span className="text-slate-600 ml-1">{review.facilities}</span>
                        </div>
                      )}
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
              <CardTitle className="text-lg">Workplace Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-700 flex items-center">
                    <Building2 className="h-4 w-4 mr-1.5" />
                    Type
                  </h3>
                  <p className="text-slate-600 mt-1 capitalize">{workplace.type}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-slate-700 flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    Location
                  </h3>
                  <p className="text-slate-600 mt-1">{workplace.address}</p>
                  <p className="text-slate-600">{workplace.city}, {workplace.postcode}</p>
                </div>
                
                {workplace.phone && (
                  <div>
                    <h3 className="font-medium text-slate-700 flex items-center">
                      <Phone className="h-4 w-4 mr-1.5" />
                      Contact
                    </h3>
                    <p className="text-slate-600 mt-1">{workplace.phone}</p>
                  </div>
                )}
                
                {reviews.length > 0 && (
                  <div>
                    <h3 className="font-medium text-slate-700 flex items-center">
                      <Clock className="h-4 w-4 mr-1.5" />
                      Average Payment Time
                    </h3>
                    <p className="text-slate-600 mt-1">
                      {Math.round(reviews.reduce((acc: number, review: any) => acc + review.paymentTime, 0) / reviews.length)} days
                    </p>
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-center mt-4">
                <Button asChild className="w-full">
                  <Link href={`/rate?type=workplace&id=${workplace.id}`}>
                    Rate This Workplace
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
