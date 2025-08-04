/* eslint-disable @typescript-eslint/no-unused-vars */
import ForumCard from "@/components/core/forum-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

interface ForumGroup {
  id: number;
  title: string;
  description: string;
  type: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  threads_count: number;
  total_threads: number;
  total_comments: number;
}

interface VapeTalkProps {
  forumGroups?: ForumGroup[];
}

export default function VapeTalk({ forumGroups = [] }: VapeTalkProps) {
  if (!forumGroups || !Array.isArray(forumGroups) || forumGroups.length === 0) {
    return (
      <div className="!py-12 w-full">
        <Card className="gap-0">
          <div className="w-full flex justify-center items-center p-8">
            <p>No forum groups available</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="!py-12">
      <div className="flex justify-end items-center mb-12">
        <Button variant="outline" asChild>
          <Link href="/forum/create">Create Community</Link>
        </Button>
      </div>
      <Card className="gap-0">
        {forumGroups.map((group) => {
          if (!group || typeof group !== 'object') return null;

          return (
            <ForumCard
              key={group.id}
              data={{
                id: group.id,
                title: group.title || 'Untitled',
                description: group.description || '',
                type: group.type || 'public',
                user_id: group.user_id || 0,
                created_at: group.created_at || new Date().toISOString(),
                updated_at: group.updated_at || new Date().toISOString(),
                threads_count: group.threads_count || 0,
                total_threads: group.total_threads || 0,
                total_comments: group.total_comments || 0,
                date: group.created_at || new Date().toISOString(),
              }}
              to={`/forum/thread/${group.id}`}
            />
          );
        })}
      </Card>
    </div>
  );
}