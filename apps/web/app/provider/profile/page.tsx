"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Metadata } from "next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  bio: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  specialties: z.string().min(2, {
    message: "Specialties must be at least 2 characters.",
  }),
  experience: z.string().min(1, {
    message: "Years of experience is required.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
  twitter: z.string().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Mock provider data - in a real app, this would come from the database
const defaultValues: Partial<ProfileFormValues> = {
  displayName: "Sarah Johnson",
  bio: "Licensed esthetician with over 8 years of experience specializing in facial treatments and skincare regimens. Passionate about helping clients achieve their best skin.",
  location: "San Francisco, CA",
  specialties: "Facials, Chemical Peels, Microdermabrasion",
  experience: "8",
  phone: "(415) 555-1234",
  email: "sarah@vibewell.com",
  website: "https://sarahjohnson.com",
  instagram: "sarahjskincare",
  facebook: "sarahjohnsonskincare",
  twitter: "sarahjskin",
};

export default function ProviderProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    
    try {
      // In a real application, this would update the provider profile in Supabase
      const supabase = createClient();
      
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-3">Provider Profile</h1>
        <p className="text-muted-foreground">
          Manage your professional profile information and online presence.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="media">Photos & Media</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your professional profile details that will be visible to clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your professional name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="specialties"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialties</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Facials, Massage, Hair Styling" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="" disabled>Select years of experience</option>
                              {[...Array(30)].map((_, i) => (
                                <option key={i + 1} value={(i + 1).toString()}>
                                  {i + 1} {i === 0 ? "year" : "years"}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell clients about your background, expertise, and approach" 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourwebsite.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Social Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input placeholder="username or page name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter</FormLabel>
                            <FormControl>
                              <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Photos & Media</CardTitle>
              <CardDescription>
                Upload photos of your work, your space, and yourself to showcase your services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Profile Photo</h3>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Button variant="outline" className="mb-2">Upload New Photo</Button>
                      <p className="text-sm text-muted-foreground">
                        Recommended: Square image, at least 400x400px
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Portfolio Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="aspect-square rounded-md bg-muted flex items-center justify-center relative overflow-hidden">
                        {item < 5 ? (
                          <img 
                            src={`https://images.unsplash.com/photo-${1550000000 + item * 100}?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600`} 
                            alt={`Portfolio ${item}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-border rounded-md p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-sm text-muted-foreground">Add Image</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline">Upload More Images</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="credentials">
          <Card>
            <CardHeader>
              <CardTitle>Credentials & Certifications</CardTitle>
              <CardDescription>
                Add your professional credentials, licenses, and certifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Licenses</h3>
                    <Button variant="outline" size="sm">Add License</Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Esthetician License</h4>
                        <p className="text-sm text-muted-foreground">License #EST12345 • California • Expires Dec 2024</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="border-t p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Massage Therapist License</h4>
                        <p className="text-sm text-muted-foreground">License #MT67890 • California • Expires Mar 2025</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Certifications</h3>
                    <Button variant="outline" size="sm">Add Certification</Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Advanced Skincare Specialist</h4>
                        <p className="text-sm text-muted-foreground">International Dermal Institute • Completed 2019</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="border-t p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Chemical Peel Specialist</h4>
                        <p className="text-sm text-muted-foreground">American Academy of Facial Esthetics • Completed 2020</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Education</h3>
                    <Button variant="outline" size="sm">Add Education</Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Diploma in Esthetics</h4>
                        <p className="text-sm text-muted-foreground">San Francisco Institute of Esthetics • 2015</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 