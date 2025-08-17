"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Shield, Settings, Camera, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { UserProfileService, UserProfile as UserProfileType } from '../../services/userProfileService';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample user ID - in a real app, this would come from authentication
  const sampleUserId = 'e44341c1-477a-41b3-8f66-f887f05838bf';
  
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfileType>>({});

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        
        // Try to get existing profile
        let userProfile = await UserProfileService.getUserProfile(sampleUserId);
        
        if (!userProfile) {
          // If no profile exists, create one with default data
          const success = await UserProfileService.initializeUserData(
            sampleUserId, 
            'alex.thompson@example.com', 
            'Alex Thompson'
          );
          
          if (success) {
            userProfile = await UserProfileService.getUserProfile(sampleUserId);
          }
        }
        
        if (userProfile) {
          setProfile(userProfile);
          setEditedProfile(userProfile);
        }
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSave = async () => {
    if (!profile || !editedProfile) return;
    
    try {
      setIsSaving(true);
      
      const success = await UserProfileService.updateUserProfile(sampleUserId, editedProfile);
      
      if (success) {
        // Refresh profile data
        const updatedProfile = await UserProfileService.getUserProfile(sampleUserId);
        if (updatedProfile) {
          setProfile(updatedProfile);
          setEditedProfile(updatedProfile);
        }
        setIsEditing(false);
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile(profile);
      setIsEditing(false);
    }
  };

  const handleInputChange = (field: keyof UserProfileType, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Unable to load profile data</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Overview Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl bg-teal-100 text-teal-600">
                    {profile.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profile.full_name || 'Full Name'}
                  </h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <p className="text-sm text-gray-500">Pro Trader Account</p>
                </div>

                {/* Profile Completion */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm text-gray-500">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                {/* Security Status */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    <User className="h-3 w-3 mr-1" />
                    Pro Level
                  </Badge>
                  <Badge variant="outline" className="text-gray-600 border-gray-600">
                    Member since {new Date(profile.created_at).getFullYear()}
                  </Badge>
                </div>
              </div>

              {/* Edit Button */}
              <div className="md:ml-auto">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={editedProfile.full_name || ''}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editedProfile.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={editedProfile.phone_number || ''}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editedProfile.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your location"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={editedProfile.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={editedProfile.occupation || ''}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your occupation"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={editedProfile.company || ''}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your company"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Password</h4>
                <p className="text-sm text-gray-600">Last changed {new Date(profile.updated_at).toLocaleDateString()}</p>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 