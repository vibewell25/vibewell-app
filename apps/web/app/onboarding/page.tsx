"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
    interests: [] as string[],
    skinType: "",
    concerns: [] as string[],
    preferredServices: [] as string[],
    bio: "",
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    },
  });
  
  const [loading, setLoading] = useState(false);
  const totalSteps = 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: string, value: string) => {
    setFormData((prev) => {
      const current = [...(prev[category as keyof typeof prev] as string[])];
      if (current.includes(value)) {
        return {
          ...prev,
          [category]: current.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [category]: [...current, value],
        };
      }
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: keyof typeof formData.notificationPreferences) => {
    setFormData((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key],
      },
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }
      
      // Update the user's profile in the database
      const { error } = await supabase
        .from("profiles")
        .update({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          birthDate: formData.birthDate,
          bio: formData.bio,
          interests: formData.interests,
          skinType: formData.skinType,
          concerns: formData.concerns,
          preferredServices: formData.preferredServices,
          notificationPreferences: formData.notificationPreferences,
          onboardingCompleted: true,
        })
        .eq("userId", user.id);

      if (error) throw error;
      
      // Redirect to dashboard
      router.push("/dashboard");
      
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl">Personal Information</CardTitle>
              <CardDescription>
                Let's get to know you better. This information helps us personalize your experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                />
                <p className="text-xs text-muted-foreground">
                  We'll use this for appointment confirmations and updates.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Date of Birth</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  You must be 18 years or older to use VibeWell.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">About You (Optional)</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                />
              </div>
            </CardContent>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl">Your Interests</CardTitle>
              <CardDescription>
                Tell us what you're interested in so we can personalize your recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-base">What wellness categories are you interested in?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {["Skincare", "Hair Care", "Makeup", "Massage", "Nails", "Spa", "Fitness", "Nutrition", "Mental Wellness"].map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleCheckboxChange("interests", interest)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={interest} className="text-sm font-normal">
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-base">What's your skin type?</Label>
                  <RadioGroup
                    value={formData.skinType}
                    onValueChange={(value: string) => handleRadioChange("skinType", value)}
                    className="grid grid-cols-2 gap-2 mt-3"
                  >
                    {["Normal", "Dry", "Oily", "Combination", "Sensitive", "Not Sure"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={`skin-${type}`} />
                        <Label htmlFor={`skin-${type}`} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-base">What are your primary skin or beauty concerns?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {[
                      "Acne", "Aging", "Dark Spots", "Dryness", "Redness", 
                      "Uneven Texture", "Fine Lines", "Sensitive Skin", "Hair Loss",
                      "Damaged Hair", "Stress Relief", "Muscle Tension"
                    ].map((concern) => (
                      <div key={concern} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={concern}
                          checked={formData.concerns.includes(concern)}
                          onChange={() => handleCheckboxChange("concerns", concern)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={concern} className="text-sm font-normal">
                          {concern}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl">Service Preferences</CardTitle>
              <CardDescription>
                Help us understand which services you're most interested in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Which services would you like to explore?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {[
                      "Facials", "Massages", "Hair Styling", "Hair Coloring", "Manicure", 
                      "Pedicure", "Waxing", "Lash Extensions", "Makeup Application", 
                      "Skin Treatments", "Body Treatments", "Wellness Coaching"
                    ].map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={service}
                          checked={formData.preferredServices.includes(service)}
                          onChange={() => handleCheckboxChange("preferredServices", service)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={service} className="text-sm font-normal">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl">Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you'd like to receive updates and reminders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive appointment reminders, special offers, and updates
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        checked={formData.notificationPreferences.email}
                        onChange={() => handleNotificationChange("email")}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get real-time updates on your mobile device
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="push-notifications"
                        checked={formData.notificationPreferences.push}
                        onChange={() => handleNotificationChange("push")}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications" className="text-base">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive text message reminders for appointments
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sms-notifications"
                        checked={formData.notificationPreferences.sms}
                        onChange={() => handleNotificationChange("sms")}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">You're almost done!</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete your profile to get personalized recommendations and a better experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30 py-10">
      <div className="container max-w-4xl">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center">
              <img src="/logo.svg" alt="VibeWell" className="h-10" />
            </div>
          </Link>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[...Array(totalSteps)].map((_, idx) => (
              <div key={idx} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    idx + 1 <= step
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx + 1 <= step ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                </div>
                {idx < totalSteps - 1 && (
                  <div
                    className={`h-1 w-10 ${
                      idx + 1 < step ? "bg-primary" : "bg-muted"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Card className="border-none shadow-md">
          {renderStep()}
          <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
            <Button 
              variant="outline" 
              disabled={step === 1} 
              onClick={prevStep}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button 
              onClick={nextStep}
              disabled={loading}
            >
              {loading ? (
                "Saving..."
              ) : step === totalSteps ? (
                "Complete Setup"
              ) : (
                <>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 