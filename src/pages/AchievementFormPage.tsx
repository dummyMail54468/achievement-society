
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAchievements } from '../context/AchievementContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Hackathon",
  "Competition",
  "Research",
  "Project",
  "Internship",
  "Award",
  "Certification",
  "Other"
];

const AchievementFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAchievementById, createAchievement, updateAchievement } = useAchievements();
  
  const isEditMode = !!id;
  const existingAchievement = isEditMode ? getAchievementById(id) : undefined;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    date: new Date(),
    tags: '',
    links: '',
    collaborators: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Fill form with existing achievement data if in edit mode
    if (existingAchievement) {
      setFormData({
        title: existingAchievement.title,
        description: existingAchievement.description,
        category: existingAchievement.category,
        imageUrl: existingAchievement.imageUrl || '',
        date: new Date(existingAchievement.date),
        tags: existingAchievement.tags?.join(', ') || '',
        links: existingAchievement.links?.join('\n') || '',
        collaborators: existingAchievement.collaborators?.join(', ') || '',
      });
    }
  }, [existingAchievement]);
  
  // Check if user is authorized to edit
  useEffect(() => {
    if (isEditMode && existingAchievement && user && existingAchievement.userId !== user.id) {
      // Redirect if not the author
      navigate('/');
    }
  }, [isEditMode, existingAchievement, user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date
      }));
    }
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!user) {
        throw new Error('You must be logged in to create or edit achievements');
      }
      
      setLoading(true);
      setError('');
      
      // Process tags, links and collaborators
      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : undefined;
      
      const links = formData.links
        ? formData.links.split('\n').map(link => link.trim()).filter(link => link)
        : undefined;
      
      const collaborators = formData.collaborators
        ? formData.collaborators.split(',').map(name => name.trim()).filter(name => name)
        : undefined;
      
      if (isEditMode && existingAchievement) {
        await updateAchievement(existingAchievement.id, {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          imageUrl: formData.imageUrl || undefined,
          date: formData.date,
          tags,
          links,
          collaborators,
        });
        
        navigate(`/achievement/${existingAchievement.id}`);
      } else {
        await createAchievement({
          userId: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          imageUrl: formData.imageUrl || undefined,
          date: formData.date,
          tags,
          links,
          collaborators,
        });
        
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isEditMode ? 'Edit Achievement' : 'Post New Achievement'}
          </CardTitle>
          <CardDescription>
            {isEditMode 
              ? 'Update your achievement details' 
              : 'Share your accomplishments with the community'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., First Place in Hackathon 2023"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your achievement..."
                rows={5}
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input 
                id="imageUrl" 
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Paste a direct link to an image showcasing your achievement
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input 
                id="tags" 
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="AI, Web Development, Design (comma separated)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="links">Links</Label>
              <Textarea 
                id="links" 
                name="links"
                value={formData.links}
                onChange={handleChange}
                placeholder="Enter links to your project, one per line"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collaborators">Collaborators</Label>
              <Input 
                id="collaborators" 
                name="collaborators"
                value={formData.collaborators}
                onChange={handleChange}
                placeholder="Team member names (comma separated)"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Posting...'}
              </>
            ) : isEditMode ? 'Update Achievement' : 'Post Achievement'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AchievementFormPage;
