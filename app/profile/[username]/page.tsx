import { Suspense } from "react";
import ProfileLoadingSkeleton from "@/components/profile/Loading/ProfileLoadingSkeleton";
import ProfilePageClient from "@/components/profile/profile-page-client";


interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<ProfileLoadingSkeleton />}>
      <ProfilePageClient
        username={resolvedParams.username}
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  );
}
