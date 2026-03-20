'use client'

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BenefitDetailsProps } from "../types";
import { BENEFIT_ICONS } from "../constant";
import { getOptionalBenefits, updateBenefit, deleteBenefit } from "@/lib/supabase/benefits";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, CircleMinus } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useAddBenefit } from "@/hooks/use-add-benefit";

export function OptionalBenefitDetails({ title, value }: BenefitDetailsProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-white">{title}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}

export default function OptionalBenefitsGrid() {
    const [optional_benefits, setOptionalBenefits] = useState<Awaited<ReturnType<typeof getOptionalBenefits>>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editOpenId, setEditOpenId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState({ benefit: "", tag: "", description: "", provider: "", monthly_cost: 0, coverage: "" });
    const [deleteOpenId, setDeleteOpenId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        benefit, setBenefit,
        tag, setTag,
        description, setDescription,
        provider, setProvider,
        monthlyCost, setMonthlyCost,
        coverage, setCoverage,
        loading,
        open, setOpen,
        handleAddBenefit,
    } = useAddBenefit("OPTIONAL")

    useEffect(() => {
        getOptionalBenefits()
            .then(setOptionalBenefits)
            .catch((err) => {
                console.error('Failed to fetch optional benefits:', err);
                setError('Failed to load benefits');
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <Card className="mt-8 bg-purple-100 border-purple-400">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Optional Benefits</CardTitle>
                        <CardDescription>Employees can enroll in these benefits (cost deducted from paycheck)</CardDescription>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-purple-400">
                                <Plus className="w-4 h-4" />
                                Add Optional Benefit
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Benefit</DialogTitle>
                                <DialogDescription>Enter benefit details to add it to the system</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="addBenefitName">Benefit Name</Label>
                                    <Input
                                        id="addBenefitName"
                                        placeholder="Health Insurance"
                                        value={benefit}
                                        onChange={(e) => setBenefit(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="addBenefitTag">Tag</Label>
                                    <Select value={tag} onValueChange={setTag}>
                                        <SelectTrigger id="addBenefitTag">
                                            <SelectValue placeholder="Choose..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Health">Health</SelectItem>
                                            <SelectItem value="Dental">Dental</SelectItem>
                                            <SelectItem value="Vision">Vision</SelectItem>
                                            <SelectItem value="Retirement">Retirement</SelectItem>
                                            <SelectItem value="Life">Life</SelectItem>
                                            <SelectItem value="Disability">Disability</SelectItem>
                                            <SelectItem value="Wellness">Wellness</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="addBenefitDescription">Description</Label>
                                    <Input
                                        id="addBenefitDescription"
                                        placeholder="Comprehensive health coverage..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="addBenefitProvider">Provider</Label>
                                    <Input
                                        id="addBenefitProvider"
                                        placeholder="BlueCross BlueShield"
                                        value={provider}
                                        onChange={(e) => setProvider(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="addBenefitCost">Monthly Cost</Label>
                                    <Input
                                        id="addBenefitCost"
                                        type="number"
                                        placeholder="0"
                                        value={monthlyCost}
                                        onChange={(e) => setMonthlyCost(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="addBenefitCoverage">Coverage</Label>
                                    <Input
                                        id="addBenefitCoverage"
                                        placeholder="Up to $1,000,000"
                                        value={coverage}
                                        onChange={(e) => setCoverage(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={async () => {
                                        const success = await handleAddBenefit();
                                        if (!success) return;

                                        try {
                                            const updated = await getOptionalBenefits();
                                            setOptionalBenefits(updated ?? []);
                                            setError(null);
                                        } catch {
                                            setError("Benefit was added, but failed to refresh list.");
                                        }
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? "Adding..." : "Add Benefit"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            {isLoading && (
                <div aria-live="polite" className="text-sm text-muted-foreground">Loading optional benefits...</div>
            )}


            {error && (
                <div role="alert" className="text-sm text-destructive">{error}</div>
            )}

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optional_benefits.map((b) => {
                    const Icon = BENEFIT_ICONS[b.tag as keyof typeof BENEFIT_ICONS] ?? BENEFIT_ICONS.Other;
                    if (!Icon) return null;

                    return (
                        <div key={b.id}>
                            {/* Delete confirmation dialog */}
                            <Dialog
                                open={deleteOpenId === b.id}
                                onOpenChange={(open) => setDeleteOpenId(open ? b.id : null)}
                            >
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete Benefit</DialogTitle>
                                        <DialogDescription>Confirm deletion of benefit from the system</DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="default" onClick={() => setDeleteOpenId(null)}>Cancel</Button>
                                        <Button
                                            variant="destructive"
                                            disabled={isSubmitting}
                                            onClick={async () => {
                                                setIsSubmitting(true);
                                                try {
                                                    await deleteBenefit(b.id);
                                                    setOptionalBenefits((prev) => prev.filter((item) => item.id !== b.id));
                                                    setDeleteOpenId(null);
                                                    setError(null);
                                                } catch {
                                                    setError("Failed to delete benefit.");
                                                } finally {
                                                    setIsSubmitting(false);
                                                }
                                            }}
                                        >
                                            {isSubmitting ? "Deleting..." : "Delete"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Edit dialog — triggered by clicking the card */}
                            <Dialog
                                open={editOpenId === b.id}
                                onOpenChange={(open) => {
                                    if (open) {
                                        setEditValues({
                                            benefit: b.benefit,
                                            tag: b.tag,
                                            description: b.description ?? "",
                                            provider: b.provider ?? "",
                                            monthly_cost: b.monthly_cost ?? 0,
                                            coverage: b.coverage ?? "",
                                        });
                                        setEditOpenId(b.id);
                                    } else {
                                        setEditOpenId(null);
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Card className="hover:bg-purple-50 hover:border-purple-300 transition-all hover:cursor-pointer">
                                        <CardContent>
                                            <div className="flex items-start gap-4">
                                                <div className="shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                                    <Icon className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h3 className="font-semibold text-lg">{b.benefit}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-right">
                                                                <div className="text-lg font-bold text-purple-600">
                                                                    ${b.monthly_cost} <span className="text-xs text-purple-300">/month</span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="text-red-400 hover:text-red-600 transition-colors"
                                                                onClick={(e) => { e.stopPropagation(); setDeleteOpenId(b.id); }}
                                                            >
                                                                <CircleMinus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-zinc-300 mb-3">{b.description}</p>
                                                    <div className="space-y-1 text-sm">
                                                        <OptionalBenefitDetails title="Provider:" value={b.provider || ""} />
                                                        {b.coverage && (
                                                            <OptionalBenefitDetails title="Coverage:" value={b.coverage} />
                                                        )}
                                                        <OptionalBenefitDetails
                                                            title="Type:"
                                                            value={b.type.charAt(0).toUpperCase() + b.type.slice(1)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Benefit</DialogTitle>
                                        <DialogDescription>Update benefit details</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="editBenefitName">Benefit Name</Label>
                                            <Input
                                                id="editBenefitName"
                                                value={editValues.benefit}
                                                onChange={(e) => setEditValues((v) => ({ ...v, benefit: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="editBenefitTag">Tag</Label>
                                            <Select value={editValues.tag} onValueChange={(val) => setEditValues((v) => ({ ...v, tag: val }))}>
                                                <SelectTrigger id="editBenefitTag">
                                                    <SelectValue placeholder="Choose..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Health">Health</SelectItem>
                                                    <SelectItem value="Dental">Dental</SelectItem>
                                                    <SelectItem value="Vision">Vision</SelectItem>
                                                    <SelectItem value="Retirement">Retirement</SelectItem>
                                                    <SelectItem value="Life">Life</SelectItem>
                                                    <SelectItem value="Disability">Disability</SelectItem>
                                                    <SelectItem value="Wellness">Wellness</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="editBenefitDescription">Description</Label>
                                            <Input
                                                id="editBenefitDescription"
                                                value={editValues.description}
                                                onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="editBenefitProvider">Provider</Label>
                                            <Input
                                                id="editBenefitProvider"
                                                value={editValues.provider}
                                                onChange={(e) => setEditValues((v) => ({ ...v, provider: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="editBenefitCost">Monthly Cost</Label>
                                            <Input
                                                id="editBenefitCost"
                                                type="number"
                                                value={editValues.monthly_cost}
                                                onChange={(e) => setEditValues((v) => ({ ...v, monthly_cost: Number(e.target.value) }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="editBenefitCoverage">Coverage</Label>
                                            <Input
                                                id="editBenefitCoverage"
                                                value={editValues.coverage}
                                                onChange={(e) => setEditValues((v) => ({ ...v, coverage: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            className="bg-purple-400"
                                            disabled={isSubmitting}
                                            onClick={async () => {
                                                setIsSubmitting(true);
                                                try {
                                                    await updateBenefit(b.id, editValues);
                                                    setOptionalBenefits((prev) =>
                                                        prev.map((item) =>
                                                            item.id === b.id ? { ...item, ...editValues } : item
                                                        )
                                                    );
                                                    setEditOpenId(null);
                                                    setError(null);
                                                } catch {
                                                    setError("Failed to update benefit.");
                                                } finally {
                                                    setIsSubmitting(false);
                                                }
                                            }}
                                        >
                                            {isSubmitting ? "Updating..." : "Update Benefit"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    )
}