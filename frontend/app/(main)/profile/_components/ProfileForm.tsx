"use client"

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, ProfileValues } from '@/schema/profile.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from '@/types/user'
import { User as UserIcon, Mail, MapPin, Building2, Hash, Globe, Save, Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { useUpdateProfileMutation } from '@/services/userApi'

interface ProfileFormProps {
    user?: User
}

const ProfileForm = ({ user }: ProfileFormProps) => {
    const [updateProfile, { isLoading, data }] = useUpdateProfileMutation();
    console.log(data);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            address: user?.address || "",
            city: user?.city || "",
            postcode: user?.postcode || "",
            country: user?.country || "",
            profileImage: user?.profileimage || "",
        }
    });

    useEffect(() => {
        if (user) {
            setValue("name", user.name || "");
            setValue("address", user.address || "");
            setValue("city", user.city || "");
            setValue("postcode", user.postcode || "");
            setValue("country", user.country || "");
            setValue("profileImage", user.profileimage || "");
        }
    }, [user, setValue]);

    const profileImageWatch = watch("profileImage");

    const profileImageUrl = profileImageWatch instanceof File
        ? URL.createObjectURL(profileImageWatch)
        : profileImageWatch || user?.profileimage || "";

    const onSubmit = async (data: ProfileValues) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("address", data.address);
        formData.append("city", data.city);
        formData.append("postcode", data.postcode);
        formData.append("country", data.country);

        if (data.profileImage instanceof File) {
            formData.append("profileimage", data.profileImage);
        }
        try {
            await updateProfile(formData).unwrap();
            toast.success("Profile updated successfully");
        } catch (error: unknown) {
            const err = error as { data: { message: string } };
            toast.error(err?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="space-y-8">
            {/* PROFILE HEADER / AVATAR PREVIEW */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-linear-to-l from-secondary/30 to-transparent p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="relative group">
                    <div className="h-32 w-32 relative rounded-full ring-4 ring-primary/10 overflow-hidden bg-gray-100 flex items-center justify-center transform transition-transform">
                        {profileImageUrl ? (
                            <Image width={200} height={200} src={profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <UserIcon size={48} className="text-gray-300" />
                        )}
                        <label htmlFor="profileImage" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={24} className="text-white" />
                        </label>
                    </div>
                    <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setValue("profileImage", file);
                            }
                        }}
                    />
                </div>
                <div className="text-center md:text-left space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900">{user?.name || "Guest User"}</h2>
                    <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                        <Mail size={14} /> {user?.email || "guest@example.com"}
                    </p>
                    <div className="pt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                            {user?.role?.toUpperCase() || "CUSTOMER"}
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN: Basic Info */}
                    <Card className="lg:col-span-1 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <UserIcon size={18} className="text-primary" />
                                Basic Details
                            </CardTitle>
                            <CardDescription>Update your public information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-bold text-gray-700">Display Name</Label>
                                <div className="relative">
                                    <Input
                                        id="name"
                                        placeholder="Your Name"
                                        className="h-11 pl-10 focus:ring-primary/20"
                                        {...register("name")}
                                    />
                                    <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address (Fixed)</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        value={user?.email || "guest@example.com"}
                                        readOnly
                                        className="h-11 pl-10 bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                    />
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                <p className="text-[10px] text-gray-400 italic">Email cannot be changed for security</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* RIGHT COLUMN: Address Info */}
                    <Card className="lg:col-span-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MapPin size={18} className="text-primary" />
                                Delivery Address
                            </CardTitle>
                            <CardDescription>Your saved shipping information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-sm font-bold text-gray-700">Street Address</Label>
                                <Input
                                    id="address"
                                    placeholder="Enter full address"
                                    className="h-11 focus:ring-primary/20"
                                    {...register("address")}
                                />
                                {errors.address && <p className="text-xs text-red-500 font-medium">{errors.address.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-sm font-bold text-gray-700 text-gray-700">City</Label>
                                    <div className="relative">
                                        <Input
                                            id="city"
                                            placeholder="City"
                                            className="h-11 pl-10 focus:ring-primary/20"
                                            {...register("city")}
                                        />
                                        <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {errors.city && <p className="text-xs text-red-500 font-medium">{errors.city.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="postcode" className="text-sm font-bold text-gray-700">Postcode</Label>
                                    <div className="relative">
                                        <Input
                                            id="postcode"
                                            placeholder="Zip/Postcode"
                                            className="h-11 pl-10 focus:ring-primary/20"
                                            {...register("postcode")}
                                        />
                                        <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {errors.postcode && <p className="text-xs text-red-500 font-medium">{errors.postcode.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-sm font-bold text-gray-700">Country</Label>
                                <div className="relative">
                                    <Input
                                        id="country"
                                        placeholder="Country"
                                        className="h-11 pl-10 focus:ring-primary/20"
                                        {...register("country")}
                                    />
                                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.country && <p className="text-xs text-red-500 font-medium">{errors.country.message}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => window.location.reload()}
                        className="px-6 h-11"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="px-10 h-11 font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                        {
                            !isLoading ? <Save size={18} /> : <Loader2 className="animate-spin" size={18} />
                        }
                        {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ProfileForm
