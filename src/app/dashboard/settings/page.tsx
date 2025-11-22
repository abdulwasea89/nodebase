"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Mail, Trash2, LogOut, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
    });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/user/update", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            // Update session
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: formData.name,
                    email: formData.email,
                },
            });

            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!showDeleteConfirm) {
            setShowDeleteConfirm(true);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/user/delete", {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete account");
            }

            // Sign out and redirect
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            alert("Failed to delete account");
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Settings</h3>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Update your personal information
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={isLoading}
                                placeholder="Your name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex gap-2 items-center">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={isLoading}
                                    placeholder="your@email.com"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Note: Email is linked to your Google account and may not be changeable
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Account Actions */}
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible actions for your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">Sign Out</p>
                            <p className="text-sm text-muted-foreground">Sign out of your account</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
                        <div>
                            <p className="font-medium text-destructive">Delete Account</p>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all associated data
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {showDeleteConfirm && (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Trash2 className="mr-2 h-4 w-4" />
                                {showDeleteConfirm ? "Confirm Delete" : "Delete Account"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
