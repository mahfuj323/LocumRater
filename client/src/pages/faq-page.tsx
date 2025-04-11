import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// FAQ data
const faqs = [
  {
    question: "What is Rate My Locum?",
    answer: "Rate My Locum is the UK's first platform where locum healthcare professionals (pharmacists, dispensers, optometrists, and others) can rate and review workplaces and agencies they've worked with. Think of it as TripAdvisor or Glassdoor specifically for healthcare locums — giving you insider information before you accept a shift."
  },
  {
    question: "What is a Locum?",
    answer: "A locum (short for 'locum tenens', Latin for 'place holder') is a healthcare professional who temporarily fills in for someone else or covers staffing gaps at clinics, pharmacies, hospitals, or other healthcare facilities. Locums include pharmacists, dispensers, optometrists, dentists, doctors, and other healthcare professionals who work on a temporary or freelance basis."
  },
  {
    question: "Why should I use Rate My Locum?",
    answer: "As a locum, you often have to make quick decisions about where to work, often with limited information. Rate My Locum provides real feedback from other locums about workplaces and agencies, including details about pay rates, transport accessibility, facilities, and general working conditions. This helps you make informed decisions and avoid unpleasant surprises."
  },
  {
    question: "How do I create an account?",
    answer: "Click the 'Sign Up' button in the top right corner of any page. Fill out the registration form with your details, create a password, and you're all set! Registration is free and only takes a minute."
  },
  {
    question: "Is my information kept private?",
    answer: "Yes, your personal information is kept confidential. Only your submitted reviews and ratings will be visible to other users, and you can choose to post anonymously. We never share your contact details with workplaces or agencies."
  },
  {
    question: "How do I submit a review?",
    answer: "After logging in, navigate to the 'Rate' page, search for the workplace or agency you want to review, and fill out the review form with your ratings and comments. Reviews include sections for transport accessibility, payment times, facilities, and more."
  },
  {
    question: "Can employers see who reviewed their workplace?",
    answer: "No, all reviews are kept anonymous from employers to protect locums' identities and ensure honest feedback without fear of repercussions. We believe this anonymity is essential for maintaining the integrity and honesty of reviews."
  },
  {
    question: "What information is included in workplace reviews?",
    answer: "Workplace reviews include ratings and comments on various aspects, including: nearby transport options, pay rates, payment timeliness, special facilities (like parking or break rooms), what locum position was filled, and general comments about the experience."
  },
  {
    question: "How can I search for specific workplace reviews?",
    answer: "Use the search function on our homepage or the dedicated search page. You can search by location, workplace name, or even filter by review ratings to find exactly what you're looking for."
  }
];

// Schema for the question submission form
const questionFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  question: z.string().min(10, "Question must be at least 10 characters").max(1000),
  anonymous: z.boolean().default(false)
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

export default function FAQPage() {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<string | undefined>("item-0");

  // Form setup
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      name: "",
      email: "",
      question: "",
      anonymous: false
    }
  });

  // Mutation for submitting a question
  const questionMutation = useMutation({
    mutationFn: async (data: QuestionFormValues) => {
      const res = await apiRequest("POST", "/api/faq/questions", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Question Submitted",
        description: "Thanks for your question! We'll get back to you soon.",
        variant: "default"
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your question. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Form submission handler
  const onSubmit = (data: QuestionFormValues) => {
    questionMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Find answers to common questions about Rate My Locum, or submit your own question below.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto mb-20">
        <Accordion type="single" collapsible value={expanded} onValueChange={setExpanded} className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-200">
              <AccordionTrigger className="text-left font-medium text-lg py-5 hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-5 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Question submission form */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-slate-200 p-6 md:p-8 relative overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/70"></div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Ask a Question</h2>
        <p className="text-slate-500 mb-6">Can't find what you're looking for? Submit your question below.</p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} className="border-slate-300 focus:border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} className="border-slate-300 focus:border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your question here..." 
                      className="min-h-32 border-slate-300 focus:border-primary" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="anonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-slate-50 p-3 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-slate-700">Submit Anonymously</FormLabel>
                    <FormDescription className="text-slate-500">
                      Your name will not be displayed with your question if answered on the site.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all"
              disabled={questionMutation.isPending}
            >
              {questionMutation.isPending ? "Submitting..." : "Submit Question"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}