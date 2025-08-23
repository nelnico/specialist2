"use client";
import { SpecialistReviewSummary } from "../data/specialist-types";

interface SpecialistReviewsProps {
  reviewSummary: SpecialistReviewSummary;
}

const SpecialistReviews = ({ reviewSummary }: SpecialistReviewsProps) => {
  // model here will be SpecialistReviewSummary

  return (
    <div className="border p-4">{JSON.stringify(reviewSummary, null, 2)}</div>
  );
};

export default SpecialistReviews;
