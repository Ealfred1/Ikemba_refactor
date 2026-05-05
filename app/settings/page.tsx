'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

type SavedAddress = {
    id: string;
    label: string;
    is_default: boolean;
    street_address: string;
    building_number: string | null;
    area: string | null;
    city: string;
    state: string;
    landmark: string | null;
    delivery_notes: string | null;
    recipient_name: string | null;
    recipient_phone: string | null;
    created_at: string;
};

type ProfileData = {
    full_name: string | null;
    phone: string | null;
};

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createBrowserSupabaseClient();

    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<ProfileData>({ full_name: '', phone: '' });
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
    const [addressForm, setAddressForm] = useState({
        label: '',
        street_address: '',
        area: '',
        landmark: '',
        delivery_notes: '',
        recipient_name: '',
        recipient_phone: '',
    });

    const loadUserData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login?redirect=/settings');
            return;
        }

        setUser(user);

        const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', user.id)
            .single();

        if (profileData) {
            setProfile({
                full_name: profileData.full_name || '',
                phone: profileData.phone || '',
            });
        }

        const { data: addressesData } = await supabase
            .from('saved_addresses')
            .select('*')
            .eq('user_id', user.id)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (addressesData) {
            setAddresses(addressesData);
        }

        setIsLoading(false);
    }, [supabase, router]);

    useEffect(() => {
        requestAnimationFrame(() => {
            loadUserData();
        });
    }, [loadUserData]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        if (!user) return;

        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                full_name: profile.full_name || null,
                phone: profile.phone || null,
            })
            .eq('id', user.id);

        if (updateError) {
            setError(updateError.message);
        } else {
            setSuccess('Profile updated successfully.');
        }

        setIsSaving(false);
    };

    const handleChangePassword = async () => {
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess('Password changed successfully.');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    const handleSaveAddress = async () => {
        if (!user) return;

        if (!addressForm.label || !addressForm.street_address) {
            setError('Label and street address are required.');
            return;
        }

        setIsSaving(true);
        setError(null);

        if (editingAddress) {
            const { error } = await supabase
                .from('saved_addresses')
                .update({
                    label: addressForm.label,
                    street_address: addressForm.street_address,
                    area: addressForm.area || null,
                    landmark: addressForm.landmark || null,
                    delivery_notes: addressForm.delivery_notes || null,
                    recipient_name: addressForm.recipient_name || null,
                    recipient_phone: addressForm.recipient_phone || null,
                })
                .eq('id', editingAddress.id);

            if (error) {
                setError(error.message);
            } else {
                setSuccess('Address updated.');
                setShowAddressForm(false);
                setEditingAddress(null);
                setAddressForm({ label: '', street_address: '', area: '', landmark: '', delivery_notes: '', recipient_name: '', recipient_phone: '' });
                await loadUserData();
            }
        } else {
            const { error } = await supabase
                .from('saved_addresses')
                .insert({
                    user_id: user.id,
                    label: addressForm.label,
                    street_address: addressForm.street_address,
                    area: addressForm.area || null,
                    landmark: addressForm.landmark || null,
                    delivery_notes: addressForm.delivery_notes || null,
                    recipient_name: addressForm.recipient_name || null,
                    recipient_phone: addressForm.recipient_phone || null,
                    is_default: addresses.length === 0,
                });

            if (error) {
                setError(error.message);
            } else {
                setSuccess('Address saved.');
                setShowAddressForm(false);
                setAddressForm({ label: '', street_address: '', area: '', landmark: '', delivery_notes: '', recipient_name: '', recipient_phone: '' });
                await loadUserData();
            }
        }

        setIsSaving(false);
    };

    const handleDeleteAddress = async (id: string) => {
        const { error } = await supabase
            .from('saved_addresses')
            .delete()
            .eq('id', id);

        if (error) {
            setError(error.message);
        } else {
            setSuccess('Address deleted.');
            await loadUserData();
        }
    };

    const handleSetDefault = async (id: string) => {
        if (!user) return;

        await supabase
            .from('saved_addresses')
            .update({ is_default: false })
            .eq('user_id', user.id);

        const { error } = await supabase
            .from('saved_addresses')
            .update({ is_default: true })
            .eq('id', id);

        if (error) {
            setError(error.message);
        } else {
            await loadUserData();
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const startEditAddress = (addr: SavedAddress) => {
        setEditingAddress(addr);
        setAddressForm({
            label: addr.label,
            street_address: addr.street_address,
            area: addr.area || '',
            landmark: addr.landmark || '',
            delivery_notes: addr.delivery_notes || '',
            recipient_name: addr.recipient_name || '',
            recipient_phone: addr.recipient_phone || '',
        });
        setShowAddressForm(true);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-8 h-8 border-4 border-lekki-lime border-t-transparent rounded-full animate-spin" />
                </div>
            </main>
        );
    }

    const initial = profile.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?';

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />

            <div className="pt-28 pb-24 px-6 md:px-12">
                <div className="container mx-auto max-w-5xl">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-3 mb-8 text-xs font-black text-foreground/30 uppercase tracking-tight">
                        <Link href="/" className="hover:text-lekki-lime transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground/60">Settings</span>
                    </nav>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-serif text-foreground tracking-tighter">Settings</h1>
                            <p className="text-foreground/30 text-xs font-black mt-3 uppercase tracking-tight">Manage your account and delivery details</p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="px-6 py-3 border border-border text-xs font-black text-foreground/40 rounded-md hover:border-red-500/30 hover:text-red-500/60 transition-all uppercase tracking-tight"
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Success/Error */}
                    {(error || success) && (
                        <div className={`p-4 text-xs font-bold rounded-md mb-8 ${error ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-lekki-lime/10 border border-lekki-lime/20 text-lekki-lime'}`}>
                            {error || success}
                        </div>
                    )}

                    {/* Profile Card */}
                    <div className="bg-surface rounded-md border border-border overflow-hidden mb-8">
                        {/* Profile Header */}
                        <div className="p-8 md:p-12 border-b border-border bg-gradient-to-r from-lekki-lime/5 to-transparent">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-lekki-lime/10 flex items-center justify-center text-lekki-lime text-2xl font-antonio font-bold border-2 border-lekki-lime/20">
                                    {initial}
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif text-foreground tracking-tighter">
                                        {profile.full_name || 'Your Profile'}
                                    </h3>
                                    <p className="text-sm text-foreground/40 font-medium">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="p-8 md:p-12">
                            <div className="space-y-8">
                                <div className="space-y-3 group">
                                    <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Full Name</label>
                                    <input
                                        value={profile.full_name || ''}
                                        onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                                        type="text"
                                        className="w-full bg-transparent border-b-2 border-border py-4 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                        placeholder="Ikemba Efe"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3 group">
                                        <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Email</label>
                                        <input
                                            value={user?.email || ''}
                                            disabled
                                            type="email"
                                            className="w-full bg-transparent border-b-2 border-border py-4 focus:outline-none text-foreground/20 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-3 group">
                                        <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Phone</label>
                                        <div className="flex items-center border-b-2 border-border focus-within:border-lekki-lime transition-colors">
                                            <span className="text-foreground/30 font-bold text-sm py-4 pr-3 select-none">+234</span>
                                            <input
                                                value={profile.phone || ''}
                                                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                                type="tel"
                                                className="flex-1 bg-transparent py-4 focus:outline-none text-foreground font-medium placeholder:text-foreground/20"
                                                placeholder="0701 242 8801"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="py-4 px-8 bg-lekki-lime text-lekki-black font-black rounded-md hover:bg-white transition-all text-center active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3 uppercase tracking-tight text-sm"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-lekki-black/20 border-t-lekki-black rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Profile'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Password Card */}
                    <div className="bg-surface rounded-md border border-border p-8 md:p-12 mb-8">
                        <h2 className="text-xl font-serif text-foreground mb-8 tracking-tighter">Change Password</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 group">
                                <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">New Password</label>
                                <input
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    type="password"
                                    className="w-full bg-transparent border-b-2 border-border py-4 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                    placeholder="At least 6 characters"
                                />
                            </div>
                            <div className="space-y-3 group">
                                <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Confirm Password</label>
                                <input
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    type="password"
                                    className="w-full bg-transparent border-b-2 border-border py-4 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                    placeholder="Re-enter password"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleChangePassword}
                            className="py-4 px-8 bg-lekki-lime text-lekki-black font-black rounded-md hover:bg-white transition-all text-center active:scale-[0.98] uppercase tracking-tight text-sm mt-8"
                        >
                            Update Password
                        </button>
                    </div>

                    {/* Addresses Card */}
                    <div className="bg-surface rounded-md border border-border overflow-hidden">
                        <div className="p-8 md:p-12 border-b border-border flex items-center justify-between">
                            <h2 className="text-xl font-serif text-foreground tracking-tighter">Saved Addresses</h2>
                            <button
                                onClick={() => {
                                    setShowAddressForm(true);
                                    setEditingAddress(null);
                                    setAddressForm({ label: '', street_address: '', area: '', landmark: '', delivery_notes: '', recipient_name: '', recipient_phone: '' });
                                }}
                                className="px-6 py-3 bg-lekki-lime text-lekki-black text-xs font-black rounded-md hover:bg-white transition-all uppercase tracking-tight active:scale-[0.98]"
                            >
                                + Add Address
                            </button>
                        </div>

                        {showAddressForm && (
                            <div className="p-8 md:p-12 border-b border-border bg-lekki-lime/5">
                                <h3 className="text-sm font-black text-lekki-lime uppercase tracking-tight mb-6">
                                    {editingAddress ? 'Edit Address' : 'New Address'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-3 group">
                                        <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Label</label>
                                        <input
                                            value={addressForm.label}
                                            onChange={(e) => setAddressForm(prev => ({ ...prev, label: e.target.value }))}
                                            type="text"
                                            className="w-full bg-transparent border-b-2 border-border py-3 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                            placeholder="Home, Office, etc."
                                        />
                                    </div>
                                    <div className="space-y-3 group">
                                        <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Area</label>
                                        <input
                                            value={addressForm.area}
                                            onChange={(e) => setAddressForm(prev => ({ ...prev, area: e.target.value }))}
                                            type="text"
                                            className="w-full bg-transparent border-b-2 border-border py-3 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                            placeholder="Lekki Phase 1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 group mb-6">
                                    <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Street Address</label>
                                    <input
                                        value={addressForm.street_address}
                                        onChange={(e) => setAddressForm(prev => ({ ...prev, street_address: e.target.value }))}
                                        type="text"
                                        className="w-full bg-transparent border-b-2 border-border py-3 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                        placeholder="11b Shafi Sule St"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-3 group">
                                        <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Landmark</label>
                                        <input
                                            value={addressForm.landmark}
                                            onChange={(e) => setAddressForm(prev => ({ ...prev, landmark: e.target.value }))}
                                            type="text"
                                            className="w-full bg-transparent border-b-2 border-border py-3 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                            placeholder="Near the roundabout"
                                        />
                                    </div>
                                    <div className="space-y-3 group">
                                        <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Recipient Phone</label>
                                        <input
                                            value={addressForm.recipient_phone}
                                            onChange={(e) => setAddressForm(prev => ({ ...prev, recipient_phone: e.target.value }))}
                                            type="tel"
                                            className="w-full bg-transparent border-b-2 border-border py-3 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                            placeholder="+234..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 group mb-8">
                                    <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Delivery Notes</label>
                                    <input
                                        value={addressForm.delivery_notes}
                                        onChange={(e) => setAddressForm(prev => ({ ...prev, delivery_notes: e.target.value }))}
                                        type="text"
                                        className="w-full bg-transparent border-b-2 border-border py-3 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                        placeholder="Call when you arrive, security desk, etc."
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleSaveAddress}
                                        disabled={isSaving}
                                        className="py-3 px-6 bg-lekki-lime text-lekki-black font-black rounded-md text-xs uppercase tracking-tight hover:bg-white transition-all disabled:opacity-20 active:scale-[0.98]"
                                    >
                                        {isSaving ? 'Saving...' : editingAddress ? 'Update' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddressForm(false);
                                            setEditingAddress(null);
                                        }}
                                        className="py-3 px-6 border border-border text-foreground/40 font-black rounded-md text-xs uppercase tracking-tight hover:border-foreground/20 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="p-8 md:p-12">
                            {addresses.length === 0 && !showAddressForm && (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-black text-foreground/20 uppercase tracking-tight">No saved addresses yet</p>
                                    <p className="text-xs text-foreground/30 mt-2">Add an address for faster checkout</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className={`p-6 rounded-md border transition-all ${addr.is_default ? 'border-lekki-lime/30 bg-lekki-lime/5' : 'border-border bg-background hover:border-foreground/10'} group`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm font-black text-foreground">{addr.label}</span>
                                                    {addr.is_default && (
                                                        <span className="text-[9px] font-black text-lekki-lime uppercase tracking-tight bg-lekki-lime/10 px-2 py-0.5 rounded-full">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-foreground/50 font-medium">{addr.street_address}{addr.area ? `, ${addr.area}` : ''}</p>
                                                {addr.landmark && (
                                                    <p className="text-[10px] text-foreground/30 mt-1">Landmark: {addr.landmark}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!addr.is_default && (
                                                    <button
                                                        onClick={() => handleSetDefault(addr.id)}
                                                        className="text-[10px] font-black text-lekki-lime/60 hover:text-lekki-lime uppercase"
                                                    >
                                                        Default
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => startEditAddress(addr)}
                                                    className="text-[10px] font-black text-foreground/40 hover:text-foreground uppercase"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    className="text-[10px] font-black text-red-500/60 hover:text-red-500 uppercase"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
