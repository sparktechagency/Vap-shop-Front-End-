'use client';
import { useFollowBrandMutation, useUnfollowBrandMutation } from '@/redux/features/Trending/TrendingApi';
import React from 'react';
import { toast } from 'sonner';
import { Button } from './button';

export default function FollowUnfollow({ user }: any) {
    const [followBrand, { isLoading: isFollowing }] = useFollowBrandMutation();
    const [unfollowBrand, { isLoading: isUnFollowing }] = useUnfollowBrandMutation();

    const handleAction = async (action: 'follow' | 'unfollow', id: string) => {
        try {
            const response = await (action === 'follow' ? followBrand(id) : unfollowBrand(id)).unwrap();
            if (response.ok) {
                toast.success(response.message || `${action === 'follow' ? 'Followed' : 'Unfollowed'} successfully`);
                window.location.reload();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to ${action}`);
        }
    };

    const isLoading = user?.is_following ? isUnFollowing : isFollowing;
    const buttonText = user?.is_following ? 'Unfollow' : 'Follow';

    return (
        <Button
            onClick={() => handleAction(user?.is_following ? 'unfollow' : 'follow', user?.id)}
            variant="outline"
            disabled={isLoading}
        >
            {isLoading ? `${buttonText}ing...` : buttonText}
        </Button>
    );
}
