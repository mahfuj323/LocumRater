import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { StarRating } from "@/components/ui/star-rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Plus, Building2, Users } from "lucide-react";

// Workplace schema
const workplaceSchema = z.object({
  name: z.string().min(3, "Workplace name is required"),
  city: z.string().min(2, "City is required"),
  postcode: z.string().min(2, "Postcode is required"),
  address: z.string().min(5, "Address is required"),
  type: z.string().min(1, "Type is required"),
  phone: z.string().optional(),
});

// Workplace Review schema
const workplaceReviewSchema = z.object({
  workplaceId: z.number(),
  rating: z.number().min(1, "Rating is required"),
  position: z.string().min(1, "Position is required"),
  payRate: z.coerce.number().min(1, "Pay rate is required"),
  paymentTime: z.coerce.number().min(1, "Payment time is required"),
  transport: z.string().min(5, "Transport information is required"),
  facilities: z.string().optional(),
  comments: z.string().min(10, "Comments are required"),
});

// Agency schema
const agencySchema = z.object({
  name: z.string().min(3, "Agency name is required"),
  location: z.string().min(2, "Location is required"),
});

// Agency Review schema
const agencyReviewSchema = z.object({
  agencyId: z.number(),
  rating: z.number().min(1, "Rating is required"),
  payRates: z.string().optional(),
  paymentReliability: z.string().min(1, "Payment reliability is required"),
  communication: z.string().min(1, "Communication rating is required"),
  comments: z.string().min(10, "Comments are required"),
});

export default function RatePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("workplace");
  const [searchTerm, setSearchTerm] = useState("");
  const [rateStep, setRateStep] = useState<"search" | "review">("search");
  const [selectedWorkplace, setSelectedWorkplace] = useState<any>(null);
  const [selectedAgency, setSelectedAgency] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [agencyRating, setAgencyRating] = useState(0);

  // Fetch workplaces
  const { data: workplacesData, isLoading: isLoadingWorkplaces } = useQuery({
    queryKey: ['/api/workplaces'],
  });

  // Fetch agencies
  const { data: agenciesData, isLoading: isLoadingAgencies } = useQuery({
    queryKey: ['/api/agencies'],
  });

  // Add workplace form
  const workplaceForm = useForm<z.infer<typeof workplaceSchema>>({
    resolver: zodResolver(workplaceSchema),
    defaultValues: {
      name: "",
      city: "",
      postcode: "",
      address: "",
      type: "",
      phone: "",
    },
  });

  // Add workplace mutation
  const addWorkplaceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof workplaceSchema>) => {
      const res = await apiRequest("POST", "/api/workplaces", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Workplace added",
        description: "The workplace has been added successfully",
      });
      workplaceForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/workplaces'] });
      setSelectedWorkplace(data);
      setRateStep("review");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add workplace",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Add agency form
  const agencyForm = useForm<z.infer<typeof agencySchema>>({
    resolver: zodResolver(agencySchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  // Add agency mutation
  const addAgencyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof agencySchema>) => {
      const res = await apiRequest("POST", "/api/agencies", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Agency added",
        description: "The agency has been added successfully",
      });
      agencyForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/agencies'] });
      setSelectedAgency(data);
      setRateStep("review");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add agency",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Workplace review form
  const workplaceReviewForm = useForm<z.infer<typeof workplaceReviewSchema>>({
    resolver: zodResolver(workplaceReviewSchema),
    defaultValues: {
      workplaceId: 0,
      rating: 0,
      position: "",
      payRate: 0,
      paymentTime: 0,
      transport: "",
      facilities: "",
      comments: "",
    },
  });

  // Submit workplace review mutation
  const submitWorkplaceReviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof workplaceReviewSchema>) => {
      const res = await apiRequest("POST", `/api/workplaces/${data.workplaceId}/reviews`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Your review has been submitted successfully",
      });
      workplaceReviewForm.reset();
      setRating(0);
      setRateStep("search");
      setSelectedWorkplace(null);
      queryClient.invalidateQueries({ queryKey: ['/api/workplaces'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit review",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Agency review form
  const agencyReviewForm = useForm<z.infer<typeof agencyReviewSchema>>({
    resolver: zodResolver(agencyReviewSchema),
    defaultValues: {
      agencyId: 0,
      rating: 0,
      payRates: "",
      paymentReliability: "",
      communication: "",
      comments: "",
    },
  });

  // Submit agency review mutation
  const submitAgencyReviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof agencyReviewSchema>) => {
      const res = await apiRequest("POST", `/api/agencies/${data.agencyId}/reviews`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Your agency review has been submitted successfully",
      });
      agencyReviewForm.reset();
      setAgencyRating(0);
      setRateStep("search");
      setSelectedAgency(null);
      queryClient.invalidateQueries({ queryKey: ['/api/agencies'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit review",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Handle workplace selection
  const handleSelectWorkplace = (workplace: any) => {
    setSelectedWorkplace(workplace);
    workplaceReviewForm.setValue("workplaceId", workplace.id);
    setRateStep("review");
  };

  // Handle agency selection
  const handleSelectAgency = (agency: any) => {
    setSelectedAgency(agency);
    agencyReviewForm.setValue("agencyId", agency.id);
    setRateStep("review");
  };

  // Handle workplace review submission
  const onSubmitWorkplaceReview = (data: z.infer<typeof workplaceReviewSchema>) => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating for this workplace",
        variant: "destructive",
      });
      return;
    }
    
    submitWorkplaceReviewMutation.mutate({
      ...data,
      rating,
    });
  };

  // Handle agency review submission
  const onSubmitAgencyReview = (data: z.infer<typeof agencyReviewSchema>) => {
    if (agencyRating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating for this agency",
        variant: "destructive",
      });
      return;
    }
    
    submitAgencyReviewMutation.mutate({
      ...data,
      rating: agencyRating,
    });
  };

  // Handle add workplace submission
  const onSubmitAddWorkplace = (data: z.infer<typeof workplaceSchema>) => {
    addWorkplaceMutation.mutate(data);
  };

  // Handle add agency submission
  const onSubmitAddAgency = (data: z.infer<typeof agencySchema>) => {
    addAgencyMutation.mutate(data);
  };

  // Filter workplaces based on search term
  const filteredWorkplaces = workplacesData?.workplaces?.filter((workplace: any) => 
    workplace.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    workplace.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workplace.postcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter agencies based on search term
  const filteredAgencies = agenciesData?.agencies?.filter((agency: any) => 
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (agency.location && agency.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Rate & Review</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Share your experience to help fellow healthcare professionals find great locum opportunities.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className={`cursor-pointer hover:shadow-md transition ${activeTab === 'workplace' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setActiveTab("workplace")}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl mb-2">Rate a Workplace</CardTitle>
            <CardDescription className="mb-4">
              Review a pharmacy, optometry practice, or other healthcare workplace.
            </CardDescription>
            <span className="text-primary mt-auto font-medium">Rate Workplace</span>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer hover:shadow-md transition ${activeTab === 'agency' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setActiveTab("agency")}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl mb-2">Rate an Agency</CardTitle>
            <CardDescription className="mb-4">
              Review a locum agency based on your experience working with them.
            </CardDescription>
            <span className="text-primary mt-auto font-medium">Rate Agency</span>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer hover:shadow-md transition ${activeTab === 'add' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setActiveTab("add")}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl mb-2">Add New Workplace</CardTitle>
            <CardDescription className="mb-4">
              Can't find the workplace you want to review? Add it to our database.
            </CardDescription>
            <span className="text-primary mt-auto font-medium">Add Workplace</span>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v);
        setRateStep("search");
        setSelectedWorkplace(null);
        setSelectedAgency(null);
      }}>
        <TabsList className="hidden">
          <TabsTrigger value="workplace">Rate a Workplace</TabsTrigger>
          <TabsTrigger value="agency">Rate an Agency</TabsTrigger>
          <TabsTrigger value="add">Add New Workplace</TabsTrigger>
        </TabsList>

        {/* Rate Workplace Tab */}
        <TabsContent value="workplace">
          <Card>
            <CardHeader>
              <CardTitle>Rate a Workplace</CardTitle>
              <CardDescription>
                {rateStep === "search" 
                  ? "Search for a workplace or select from the list below"
                  : `You're reviewing: ${selectedWorkplace?.name}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rateStep === "search" ? (
                <>
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search by workplace name or location..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {isLoadingWorkplaces ? (
                    <div className="flex justify-center my-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredWorkplaces?.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {filteredWorkplaces.map((workplace: any) => (
                        <Card 
                          key={workplace.id} 
                          className="cursor-pointer hover:shadow-md transition"
                          onClick={() => handleSelectWorkplace(workplace)}
                        >
                          <CardContent className="p-4">
                            <div className="font-medium">{workplace.name}</div>
                            <div className="text-sm text-slate-500">{workplace.city}, {workplace.postcode}</div>
                            <div className="text-xs text-slate-400 mt-1 capitalize">{workplace.type}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-slate-600 mb-4">Can't find the workplace you're looking for?</p>
                      <Button onClick={() => setActiveTab("add")}>Add a New Workplace</Button>
                    </div>
                  )}
                </>
              ) : (
                <Form {...workplaceReviewForm}>
                  <form onSubmit={workplaceReviewForm.handleSubmit(onSubmitWorkplaceReview)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Workplace</label>
                      <div className="bg-slate-100 p-3 rounded-md">
                        <div className="font-medium">{selectedWorkplace?.name}</div>
                        <div className="text-sm text-slate-500">
                          {selectedWorkplace?.city}, {selectedWorkplace?.postcode}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Overall Rating*</label>
                      <StarRating value={rating} onChange={setRating} size="lg" />
                      {rating === 0 && workplaceReviewForm.formState.isSubmitted && (
                        <p className="text-sm text-red-500 mt-1">Please provide a rating</p>
                      )}
                    </div>

                    <FormField
                      control={workplaceReviewForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Position*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pharmacist">Pharmacist</SelectItem>
                              <SelectItem value="dispenser">Dispenser</SelectItem>
                              <SelectItem value="optometrist">Optometrist</SelectItem>
                              <SelectItem value="technician">Pharmacy Technician</SelectItem>
                              <SelectItem value="assistant">Pharmacy Assistant</SelectItem>
                              <SelectItem value="other">Other Healthcare Professional</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={workplaceReviewForm.control}
                        name="payRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pay Rate (£/hr)*</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={workplaceReviewForm.control}
                        name="paymentTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Time (days)*</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={workplaceReviewForm.control}
                      name="transport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nearby Transport*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe nearby bus stops, train stations, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={workplaceReviewForm.control}
                      name="facilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Facilities</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="E.g. prayer space, accessible facilities, staff room, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={workplaceReviewForm.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>General Comments*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your overall experience, including workplace environment, management, etc."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 flex flex-col sm:flex-row justify-between gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setRateStep("search");
                          setSelectedWorkplace(null);
                        }}
                      >
                        Back to Search
                      </Button>
                      
                      <Button 
                        type="submit" 
                        disabled={submitWorkplaceReviewMutation.isPending}
                      >
                        {submitWorkplaceReviewMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Submit Review
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Agency Tab */}
        <TabsContent value="agency">
          <Card>
            <CardHeader>
              <CardTitle>Rate an Agency</CardTitle>
              <CardDescription>
                {rateStep === "search" 
                  ? "Search for an agency or select from the list below"
                  : `You're reviewing: ${selectedAgency?.name}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rateStep === "search" ? (
                <>
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search by agency name or location..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {isLoadingAgencies ? (
                    <div className="flex justify-center my-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredAgencies?.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {filteredAgencies.map((agency: any) => (
                        <Card 
                          key={agency.id} 
                          className="cursor-pointer hover:shadow-md transition"
                          onClick={() => handleSelectAgency(agency)}
                        >
                          <CardContent className="p-4">
                            <div className="font-medium">{agency.name}</div>
                            <div className="text-sm text-slate-500">{agency.location || "Location not specified"}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-slate-600 mb-4">Can't find the agency you're looking for?</p>
                      <Button onClick={() => setActiveTab("add-agency")}>Add a New Agency</Button>
                    </div>
                  )}
                </>
              ) : (
                <Form {...agencyReviewForm}>
                  <form onSubmit={agencyReviewForm.handleSubmit(onSubmitAgencyReview)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Agency</label>
                      <div className="bg-slate-100 p-3 rounded-md">
                        <div className="font-medium">{selectedAgency?.name}</div>
                        <div className="text-sm text-slate-500">
                          {selectedAgency?.location || "Location not specified"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Overall Rating*</label>
                      <StarRating value={agencyRating} onChange={setAgencyRating} size="lg" />
                      {agencyRating === 0 && agencyReviewForm.formState.isSubmitted && (
                        <p className="text-sm text-red-500 mt-1">Please provide a rating</p>
                      )}
                    </div>

                    <FormField
                      control={agencyReviewForm.control}
                      name="payRates"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Pay Rates Offered</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. £20-30/hr for pharmacists" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={agencyReviewForm.control}
                      name="paymentReliability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Reliability*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent - Always on time</SelectItem>
                              <SelectItem value="good">Good - Usually on time</SelectItem>
                              <SelectItem value="average">Average - Occasionally late</SelectItem>
                              <SelectItem value="poor">Poor - Often late</SelectItem>
                              <SelectItem value="very-poor">Very Poor - Consistently late</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={agencyReviewForm.control}
                      name="communication"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Communication*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="average">Average</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                              <SelectItem value="very-poor">Very Poor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={agencyReviewForm.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>General Comments*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your overall experience with this agency"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 flex flex-col sm:flex-row justify-between gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setRateStep("search");
                          setSelectedAgency(null);
                        }}
                      >
                        Back to Search
                      </Button>
                      
                      <Button 
                        type="submit" 
                        disabled={submitAgencyReviewMutation.isPending}
                      >
                        {submitAgencyReviewMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Submit Review
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add New Workplace/Agency Tab */}
        <TabsContent value="add">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add a New Workplace</CardTitle>
                <CardDescription>
                  Can't find the workplace you want to review? Add it to our database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...workplaceForm}>
                  <form onSubmit={workplaceForm.handleSubmit(onSubmitAddWorkplace)} className="space-y-4">
                    <FormField
                      control={workplaceForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workplace Name*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={workplaceForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City/Town*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={workplaceForm.control}
                        name="postcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postcode*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={workplaceForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={workplaceForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workplace Type*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select workplace type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pharmacy">Pharmacy</SelectItem>
                              <SelectItem value="hospital">Hospital</SelectItem>
                              <SelectItem value="optometry">Optometry Practice</SelectItem>
                              <SelectItem value="dental">Dental Practice</SelectItem>
                              <SelectItem value="other">Other Healthcare Facility</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={workplaceForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full mt-2"
                      disabled={addWorkplaceMutation.isPending}
                    >
                      {addWorkplaceMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Add Workplace
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add a New Agency</CardTitle>
                <CardDescription>
                  Can't find the agency you want to review? Add it to our database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...agencyForm}>
                  <form onSubmit={agencyForm.handleSubmit(onSubmitAddAgency)} className="space-y-4">
                    <FormField
                      control={agencyForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agency Name*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={agencyForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full mt-2"
                      disabled={addAgencyMutation.isPending}
                    >
                      {addAgencyMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Add Agency
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
