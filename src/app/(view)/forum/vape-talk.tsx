import ForumCard from "@/components/core/forum-card";
import { Card } from "@/components/ui/card";
import { group } from "console";
import React from "react";

interface ForumGroup {
  id: number;
  title: string;
  description: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  total_threads: number;
  total_comments: number;
}

interface VapeTalkProps {
  forumGroups?: ForumGroup[];
}

export default function VapeTalk({ forumGroups }: VapeTalkProps) {
  console.log("forumGroups", forumGroups);
  if (!forumGroups || forumGroups.length === 0) {
    return (
      <div className="!py-12">
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

      <Card className="gap-0">
        {forumGroups?.map((group) => (
          <ForumCard
            key={group.id}
            data={{
              id: group.id,
              title: group.title,
              description: group.description,
              user_id: group.user_id,
              created_at: group.created_at,
              updated_at: group.updated_at,
              threads_count: group.total_threads,
              total_threads: group.total_threads,
              total_comments: group.total_comments,
              date: group.created_at,
            }}
            to={`/forum/thread/${group.id}`}
          />
        ))}
      </Card>
    </div>
  );
}


function isNewGroup(createdAt: string): boolean {

  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}


function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}