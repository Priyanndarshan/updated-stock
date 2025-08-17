"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, User, Shield, Bell, Globe, CreditCard, Key, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { UserProfileService, UserSettings as UserSettingsType, UserSecurity as UserSecurityType, BillingInfo as BillingInfoType, LoginHistory as LoginHistoryType } from '../../services/userProfileService';

export default function AccountSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sample user ID - in a real app, this would come from authentication
  const sampleUserId = 'e44341c1-477a-41b3-8f66-f887f05838bf';

  const [settings, setSettings] = useState<UserSettingsType | null>(null);
  const [security, setSecurity] = useState<UserSecurityType | null>(null);
  const [billing, setBilling] = useState<BillingInfoType | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryType[]>([]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch all user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        const userData = await UserProfileService.getAllUserData(sampleUserId);
        
        if (userData) {
          setSettings(userData.settings);
          setSecurity(userData.security);
          setBilling(userData.billing);
          setLoginHistory(userData.loginHistory);
        }
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Here you would typically make an API call to change the password
      // For now, we'll just update the security record
      if (security) {
        const success = await UserProfileService.updateUserSecurity(sampleUserId, {
          last_password_change: new Date().toISOString()
        });
        
        if (success) {
          // Refresh security data
          const updatedSecurity = await UserProfileService.getUserSecurity(sampleUserId);
          if (updatedSecurity) {
            setSecurity(updatedSecurity);
          }
        }
      }
      
      alert('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingToggle = async (setting: keyof UserSettingsType, value: boolean) => {
    if (!settings) return;
    
    try {
      const updatedSettings = { ...settings, [setting]: value };
      const success = await UserProfileService.updateUserSettings(sampleUserId, updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const handleSettingChange = async (setting: keyof UserSettingsType, value: string) => {
    if (!settings) return;
    
    try {
      const updatedSettings = { ...settings, [setting]: value };
      const success = await UserProfileService.updateUserSettings(sampleUserId, updatedSettings);
      
      if (success) {
        setSettings(updatedSettings);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!settings || !security || !billing) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Unable to load settings data</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security settings</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <select 
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select 
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                  <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                  <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
                  <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                  <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                  <option value="UTC+1 (Central European)">UTC+1 (Central European)</option>
                  <option value="UTC+5:30 (India)">UTC+5:30 (India)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select 
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="theme">Theme</Label>
                <select 
                  id="theme"
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="Light">Light</option>
                  <option value="Dark">Dark</option>
                  <option value="Auto">Auto (System)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive important updates via email</p>
              </div>
              <Switch 
                checked={settings.email_notifications}
                onCheckedChange={(checked) => handleSettingToggle('email_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-600">Receive urgent alerts via SMS</p>
              </div>
              <Switch 
                checked={settings.sms_notifications}
                onCheckedChange={(checked) => handleSettingToggle('sms_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications in your browser</p>
              </div>
              <Switch 
                checked={settings.push_notifications}
                onCheckedChange={(checked) => handleSettingToggle('push_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                <p className="text-sm text-gray-600">Receive promotional content and offers</p>
              </div>
              <Switch 
                checked={settings.marketing_emails}
                onCheckedChange={(checked) => handleSettingToggle('marketing_emails', checked)}
              />
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
          <CardContent className="space-y-6">
            {/* Password Change */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter your current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter your new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePasswordChange} 
                  disabled={isSaving}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Two-Factor Authentication */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">2FA Status</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={security.two_fa_enabled ? "text-green-600 border-green-600" : "text-red-600 border-red-600"}>
                    {security.two_fa_enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {security.two_fa_enabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Login History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Login History</h3>
              <div className="space-y-3">
                {loginHistory.length > 0 ? (
                  loginHistory.map((login, index) => (
                    <div key={login.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{login.device} - {login.browser}</p>
                        <p className="text-sm text-gray-600">{login.location} • {new Date(login.login_time).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={index === 0 ? "secondary" : "outline"}>
                        {index === 0 ? 'Current' : 'Recent'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No login history available
                  </div>
                )}
              </div>
              
              <Button variant="outline" className="mt-4 w-full">
                View All Login History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                <p className="text-sm text-gray-600">Control who can see your profile information</p>
              </div>
              <select 
                value={settings.profile_visibility}
                onChange={(e) => handleSettingChange('profile_visibility', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Activity Status</h4>
                <p className="text-sm text-gray-600">Show when you're online and active</p>
              </div>
              <Switch 
                checked={settings.activity_status}
                onCheckedChange={(checked) => handleSettingToggle('activity_status', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Data Sharing</h4>
                <p className="text-sm text-gray-600">Allow us to use your data to improve services</p>
              </div>
              <Switch 
                checked={settings.data_sharing}
                onCheckedChange={(checked) => handleSettingToggle('data_sharing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing & Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing & Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Current Plan</h4>
                <p className="text-sm text-gray-600">{billing.current_plan} - ${billing.plan_price}/{billing.billing_cycle}</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Next Billing Date</h4>
                <p className="text-sm text-gray-600">{new Date(billing.next_billing_date).toLocaleDateString()}</p>
              </div>
              <Button variant="outline" size="sm">
                Manage Billing
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Payment Method</h4>
                <p className="text-sm text-gray-600">{billing.payment_method} •••• •••• •••• {billing.card_last_four}</p>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h4 className="font-medium text-red-900">Delete Account</h4>
                <p className="text-sm text-red-700">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
