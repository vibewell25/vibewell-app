"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

// Service form schema
const serviceFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  duration: z.number().min(15, {
    message: "Duration must be at least 15 minutes.",
  }),
  price: z.number().min(1, {
    message: "Price must be at least $1.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  isActive: z.boolean().default(true),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

// Mock service categories
const serviceCategories = [
  "Facial Treatments",
  "Massage Therapy",
  "Hair Styling",
  "Nail Care",
  "Makeup Services",
  "Waxing",
  "Body Treatments",
  "Wellness Coaching",
];

// Mock services data - in a real app, this would come from the database
const mockServices = [
  {
    id: "s1",
    title: "Signature Facial",
    description: "A customized facial treatment designed to address your specific skin concerns. Includes cleansing, exfoliation, extraction, mask, and moisturizing.",
    duration: 60,
    price: 95,
    category: "Facial Treatments",
    isActive: true,
    bookingCount: 42,
  },
  {
    id: "s2",
    title: "Deep Tissue Massage",
    description: "A therapeutic massage that focuses on realigning deeper layers of muscles and connective tissue. Perfect for chronic pain and tension.",
    duration: 90,
    price: 120,
    category: "Massage Therapy",
    isActive: true,
    bookingCount: 38,
  },
  {
    id: "s3",
    title: "Chemical Peel",
    description: "A treatment that uses a chemical solution to remove the top layers of skin, revealing smoother, less wrinkled skin underneath.",
    duration: 45,
    price: 150,
    category: "Facial Treatments",
    isActive: true,
    bookingCount: 27,
  },
  {
    id: "s4",
    title: "Express Facial",
    description: "A quick but effective facial treatment for clients on the go. Includes cleansing, exfoliation, and moisturizing.",
    duration: 30,
    price: 60,
    category: "Facial Treatments",
    isActive: false,
    bookingCount: 15,
  },
];

export default function ProviderServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState(mockServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  // Default form values
  const defaultValues: Partial<ServiceFormValues> = {
    title: "",
    description: "",
    duration: 60,
    price: 0,
    category: "",
    isActive: true,
  };

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: editingService || defaultValues,
  });

  // Reset form when dialog opens/closes or editing service changes
  const resetForm = () => {
    if (editingService) {
      form.reset({
        title: editingService.title,
        description: editingService.description,
        duration: editingService.duration,
        price: editingService.price,
        category: editingService.category,
        isActive: editingService.isActive,
      });
    } else {
      form.reset(defaultValues);
    }
  };

  const openNewServiceDialog = () => {
    setEditingService(null);
    setIsDialogOpen(true);
    resetForm();
  };

  const openEditServiceDialog = (service: any) => {
    setEditingService(service);
    setIsDialogOpen(true);
    resetForm();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingService(null);
  };

  const confirmDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    
    setIsLoading(true);
    
    try {
      // In a real application, this would delete the service from Supabase
      const supabase = createClient();
      
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setServices(services.filter(service => service.id !== serviceToDelete));
      
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service. Please try again.");
    } finally {
      setIsLoading(false);
      setDeleteConfirmOpen(false);
      setServiceToDelete(null);
    }
  };

  const toggleServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      // In a real application, this would update the service status in Supabase
      const supabase = createClient();
      
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setServices(services.map(service => 
        service.id === serviceId ? { ...service, isActive } : service
      ));
      
      toast.success(`Service ${isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error("Error updating service status:", error);
      toast.error("Failed to update service status. Please try again.");
    }
  };

  async function onSubmit(data: ServiceFormValues) {
    setIsLoading(true);
    
    try {
      // In a real application, this would create/update the service in Supabase
      const supabase = createClient();
      
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingService) {
        // Update existing service
        const updatedServices = services.map(service => 
          service.id === editingService.id ? { ...service, ...data } : service
        );
        setServices(updatedServices);
        toast.success("Service updated successfully!");
      } else {
        // Create new service
        const newService = {
          id: `s${services.length + 1}`,
          ...data,
          bookingCount: 0,
        };
        setServices([...services, newService]);
        toast.success("Service created successfully!");
      }
      
      handleDialogClose();
      router.refresh();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-3">Services Management</h1>
          <p className="text-muted-foreground">
            Create and manage the services you offer to clients.
          </p>
        </div>
        <Button onClick={openNewServiceDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </div>
      
      {/* Services List */}
      <div className="space-y-6">
        {services.length > 0 ? (
          services.map((service) => (
            <Card key={service.id} className={`${!service.isActive ? 'opacity-70' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {service.category} • {service.duration} min • ${service.price}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 mr-4">
                      <Switch 
                        id={`service-status-${service.id}`}
                        checked={service.isActive}
                        onCheckedChange={(checked) => toggleServiceStatus(service.id, checked)}
                      />
                      <Label htmlFor={`service-status-${service.id}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditServiceDialog(service)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => confirmDeleteService(service.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{service.description}</p>
                <div className="mt-4 text-sm text-muted-foreground">
                  {service.bookingCount} bookings
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">No services yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first service to start accepting bookings
            </p>
            <Button onClick={openNewServiceDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add New Service
            </Button>
          </div>
        )}
      </div>
      
      {/* Service Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            <DialogDescription>
              {editingService 
                ? "Update the details of your existing service." 
                : "Create a new service to offer to your clients."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Signature Facial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what this service includes and its benefits" 
                        className="min-h-24" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Be detailed about what clients can expect from this service.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={15} 
                          step={15} 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          step={1} 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Service Status
                        </FormLabel>
                        <FormDescription>
                          Active services can be booked by clients
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : editingService ? "Update Service" : "Create Service"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteService}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 