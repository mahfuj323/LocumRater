import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StarRating } from "@/components/ui/star-rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Building2, Users } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// Search form schema
const searchSchema = z.object({
  location: z.string().optional(),
  role: z.string().optional(),
  rating: z.string().optional(),
  facilities: z.array(z.string()).optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

// Facility options
const facilityOptions = [
  { id: "accessible", label: "Accessible" },
  { id: "prayer-space", label: "Prayer Space" },
  { id: "staff-room", label: "Staff Room" },
  { id: "public-transport", label: "Public Transport" },
  { id: "parking", label: "Parking" },
];

export default function SearchPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("workplaces");
  const [searchParams, setSearchParams] = useState<{
    location?: string;
    role?: string;
    rating?: string;
    facilities?: string;
  }>({});

  // Form for searching
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: "",
      role: "",
      rating: "",
      facilities: [],
    },
  });

  // Fetch workplaces with search params
  const {
    data: workplacesData,
    isLoading: isLoadingWorkplaces,
    isError: workplacesError,
  } = useQuery({
    queryKey: [
      '/api/workplaces',
      searchParams.location,
      searchParams.role,
      searchParams.rating,
      searchParams.facilities,
    ],
    enabled: activeTab === "workplaces",
  });

  // Fetch agencies
  const {
    data: agenciesData,
    isLoading: isLoadingAgencies,
    isError: agenciesError,
  } = useQuery({
    queryKey: ['/api/agencies'],
    enabled: activeTab === "agencies",
  });

  const onSubmit = (data: SearchFormValues) => {
    const params: any = {};
    
    if (data.location && data.location.trim() !== "") {
      params.location = data.location.trim();
    }
    
    if (data.role && data.role !== "") {
      params.role = data.role;
    }
    
    if (data.rating && data.rating !== "") {
      params.rating = data.rating;
    }
    
    if (data.facilities && data.facilities.length > 0) {
      params.facilities = data.facilities.join(",");
    }
    
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div id="search">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Find Workplaces & Agencies</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Search for healthcare workplaces and agencies by location, role, or facility features.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="workplaces" className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>Workplaces</span>
              </TabsTrigger>
              <TabsTrigger value="agencies" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Agencies</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="workplaces">
            <Card className="mb-8">
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="City or postal code" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="All Positions" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">All Positions</SelectItem>
                                <SelectItem value="pharmacist">Pharmacist</SelectItem>
                                <SelectItem value="dispenser">Dispenser</SelectItem>
                                <SelectItem value="optometrist">Optometrist</SelectItem>
                                <SelectItem value="technician">Pharmacy Technician</SelectItem>
                                <SelectItem value="assistant">Pharmacy Assistant</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Rating</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any Rating" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">Any Rating</SelectItem>
                                <SelectItem value="5">5 Stars</SelectItem>
                                <SelectItem value="4">4+ Stars</SelectItem>
                                <SelectItem value="3">3+ Stars</SelectItem>
                                <SelectItem value="2">2+ Stars</SelectItem>
                                <SelectItem value="1">1+ Star</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-1">Facilities:</Label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <FormField
                          control={form.control}
                          name="facilities"
                          render={() => (
                            <div className="flex flex-wrap gap-3">
                              {facilityOptions.map((option) => (
                                <FormField
                                  key={option.id}
                                  control={form.control}
                                  name="facilities"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={option.id}
                                        className="flex flex-row items-start space-x-2 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(option.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value || [], option.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== option.id
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                          {option.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button type="submit">
                        Search Workplaces
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {isLoadingWorkplaces ? (
              <div className="flex justify-center my-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : workplacesError ? (
              <div className="text-center py-12">
                <p className="text-red-500">An error occurred while fetching workplaces.</p>
                <Button variant="outline" onClick={() => form.handleSubmit(onSubmit)()} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : workplacesData?.workplaces?.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Search Results 
                  {workplacesData.isLimited && !user && (
                    <span className="text-sm font-normal text-slate-500 ml-2">
                      (Limited results - <Link href="/auth" className="text-primary hover:underline">sign in</Link> to see all)
                    </span>
                  )}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workplacesData.workplaces.map((workplace: any) => (
                    <Link key={workplace.id} href={`/workplace/${workplace.id}`}>
                      <Card className="cursor-pointer hover:shadow-md transition h-full">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{workplace.name}</h3>
                              <p className="text-slate-500 text-sm">{workplace.city}, UK</p>
                            </div>
                            <div className="bg-blue-50 text-primary text-sm font-medium py-1 px-2 rounded capitalize">
                              {workplace.type}
                            </div>
                          </div>
                          <div className="mb-4">
                            <StarRating value={4} readOnly />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                            <div>
                              <span className="font-medium text-slate-700">Address:</span>
                              <span className="text-slate-600 ml-1">{workplace.address}</span>
                            </div>
                            {workplace.phone && (
                              <div>
                                <span className="font-medium text-slate-700">Phone:</span>
                                <span className="text-slate-600 ml-1">{workplace.phone}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-primary font-medium hover:underline mt-2 text-right">
                            View Details
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">No workplaces found matching your search criteria.</p>
                <Button variant="outline" onClick={() => {
                  form.reset();
                  setSearchParams({});
                }} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="agencies">
            {isLoadingAgencies ? (
              <div className="flex justify-center my-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : agenciesError ? (
              <div className="text-center py-12">
                <p className="text-red-500">An error occurred while fetching agencies.</p>
                <Button variant="outline" onClick={() => setActiveTab("agencies")} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : agenciesData?.agencies?.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Agencies
                  {agenciesData.isLimited && !user && (
                    <span className="text-sm font-normal text-slate-500 ml-2">
                      (Limited results - <Link href="/auth" className="text-primary hover:underline">sign in</Link> to see all)
                    </span>
                  )}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agenciesData.agencies.map((agency: any) => (
                    <Link key={agency.id} href={`/agency/${agency.id}`}>
                      <Card className="cursor-pointer hover:shadow-md transition h-full">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{agency.name}</h3>
                              <p className="text-slate-500 text-sm">{agency.location || "Location not specified"}</p>
                            </div>
                            <div className="bg-blue-50 text-primary text-sm font-medium py-1 px-2 rounded">
                              Agency
                            </div>
                          </div>
                          <div className="mb-4">
                            <StarRating value={4} readOnly />
                          </div>
                          <div className="mt-4 text-sm text-primary font-medium hover:underline text-right">
                            View Agency Details
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">No agencies found in our database yet.</p>
                <Button asChild className="mt-4">
                  <Link href="/rate">Add an Agency</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
