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
    question: "What is Rate my Locum?",
    answer: "Rate My Locum is like TripAdvisor for locums — a platform where pharmacists, dispensers, and other healthcare locums can review and rate workplaces and agencies, so others know what to expect before booking a shift."
  },
  {
    question: "What is a Locum?",
    answer: "A locum is a professional (like a pharmacist, doctor, optometrist, or dispenser) who temporarily fills in for someone else at a clinic, pharmacy, or healthcare facility."
  },
  {
    question: "How do I create an account?",
    answer: "Click the 'Sign Up' button in the top right corner of any page. Fill out the registration form with your email address, create a password, and you're all set!"
  },
  {
    question: "Is my information kept private?",
    answer: "Yes, your personal information is kept confidential. Only your submitted reviews and ratings will be visible to other users, and you can choose to post anonymously."
  },
  {
    question: "How do I submit a review?",
    answer: "Simply navigate to the 'Submit a Review' page, search for the workplace or agency you want to review, and fill out the review form with your ratings and comments."
  },
  {
    question: "Can employers see who reviewed their workplace?",
    answer: "No, all reviews are kept anonymous from employers to protect locums' identities and ensure honest feedback without fear of repercussions."
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
      const res = await apiRequest("POST", "/api/questions", data);
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">Frequently Asked Questions</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Find answers to common questions about Rate My Locum, or submit your own question below.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto mb-16">
        <Accordion type="single" collapsible value={expanded} onValueChange={setExpanded} className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-200">
              <AccordionTrigger className="text-left font-medium text-lg py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Question submission form */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-slate-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Ask a Question</h2>
        
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
                      <Input placeholder="John Smith" {...field} />
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
                      <Input placeholder="you@example.com" {...field} />
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
                      className="min-h-32" 
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Submit Anonymously</FormLabel>
                    <FormDescription>
                      Your name will not be displayed with your question if answered on the site.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
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