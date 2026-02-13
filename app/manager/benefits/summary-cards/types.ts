import type React from "react";

export interface BenefitSummaryCardProps {
    title: string
    icon: React.ReactNode
    count: number | string
    description: string
}

export interface Benefit {
    id: string;
    name: string;
    description: string;
    type: "health" | "dental" | "vision" | "retirement" | "life" | "disability" | "wellness" | "other";
    provider: string;
    monthlyPrice: number;
    isCompanyProvided: boolean;
    coverage?: string;
}

export interface EmployeeBenefit {
    benefitId: string;
    enrolledDate: string;
    status: "active" | "pending" | "cancelled";
}

// TEMPORARY SOLUTION. REMOVE THIS AFTER FETCHING FROM SUPABASE
export const AVAILABLE_BENEFITS: Benefit[] = [
    // Company Provided Benefits (Free)
    {
        id: "b1",
        name: "Basic Health Insurance",
        description: "Comprehensive health coverage including preventive care, hospitalization, and prescription drugs",
        type: "health",
        provider: "BlueCross BlueShield",
        monthlyPrice: 0,
        isCompanyProvided: true,
        coverage: "Employee Only"
    },
    {
        id: "b2",
        name: "Basic Dental Insurance",
        description: "Coverage for routine cleanings, exams, and basic dental procedures",
        type: "dental",
        provider: "Delta Dental",
        monthlyPrice: 0,
        isCompanyProvided: true,
        coverage: "Employee Only"
    },
    {
        id: "b3",
        name: "Basic Life Insurance",
        description: "Life insurance coverage equal to 1x annual salary",
        type: "life",
        provider: "MetLife",
        monthlyPrice: 0,
        isCompanyProvided: true,
        coverage: "$85,000"
    },
    {
        id: "b4",
        name: "401(k) Retirement Plan",
        description: "Company matches up to 4% of your contributions",
        type: "retirement",
        provider: "Fidelity",
        monthlyPrice: 0,
        isCompanyProvided: true,
        coverage: "4% match"
    },

    // Optional Paid Benefits
    {
        id: "b5",
        name: "Premium Health Insurance",
        description: "Enhanced health coverage with lower deductibles and copays, includes specialist visits",
        type: "health",
        provider: "BlueCross BlueShield",
        monthlyPrice: 150,
        isCompanyProvided: false,
        coverage: "Employee + Family"
    },
    {
        id: "b6",
        name: "Family Dental Coverage",
        description: "Extend dental coverage to spouse and dependents",
        type: "dental",
        provider: "Delta Dental",
        monthlyPrice: 45,
        isCompanyProvided: false,
        coverage: "Employee + Family"
    },
    {
        id: "b7",
        name: "Vision Insurance",
        description: "Coverage for eye exams, glasses, and contact lenses",
        type: "vision",
        provider: "VSP",
        monthlyPrice: 12,
        isCompanyProvided: false,
        coverage: "Employee Only"
    },
    {
        id: "b8",
        name: "Family Vision Insurance",
        description: "Vision coverage for employee and dependents",
        type: "vision",
        provider: "VSP",
        monthlyPrice: 28,
        isCompanyProvided: false,
        coverage: "Employee + Family"
    },
    {
        id: "b9",
        name: "Short-term Disability",
        description: "Income protection for temporary disabilities (60% of salary)",
        type: "disability",
        provider: "Guardian",
        monthlyPrice: 35,
        isCompanyProvided: false,
        coverage: "60% salary replacement"
    },
    {
        id: "b10",
        name: "Long-term Disability",
        description: "Income protection for extended disabilities (60% of salary)",
        type: "disability",
        provider: "Guardian",
        monthlyPrice: 55,
        isCompanyProvided: false,
        coverage: "60% salary replacement"
    },
    {
        id: "b11",
        name: "Supplemental Life Insurance",
        description: "Additional life insurance up to 5x annual salary",
        type: "life",
        provider: "MetLife",
        monthlyPrice: 25,
        isCompanyProvided: false,
        coverage: "Up to 5x salary"
    },
    {
        id: "b12",
        name: "Wellness Program",
        description: "Access to gym memberships, fitness classes, and wellness coaching",
        type: "wellness",
        provider: "Wellness Corp",
        monthlyPrice: 20,
        isCompanyProvided: false,
        coverage: "Full access"
    },
    {
        id: "b13",
        name: "Legal Services Plan",
        description: "Legal consultation and document preparation services",
        type: "other",
        provider: "LegalShield",
        monthlyPrice: 18,
        isCompanyProvided: false,
        coverage: "Unlimited consultations"
    },
    {
        id: "b14",
        name: "Pet Insurance",
        description: "Health insurance coverage for your pets",
        type: "other",
        provider: "Healthy Paws",
        monthlyPrice: 40,
        isCompanyProvided: false,
        coverage: "Up to 2 pets"
    }
];