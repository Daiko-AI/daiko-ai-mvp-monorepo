"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AlphaWalletProvider } from "@/features/alphaWallet/AlphaWalletProvider";
import type { ProposalSelect } from "@daiko-ai/shared";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ProposalCard } from "./proposal-card";

type ProposalListProps = {
  initialProposals: ProposalSelect[];
};

export const ProposalListComponent: React.FC<ProposalListProps> = ({ initialProposals }) => {
  const [proposals, setProposals] = useState(initialProposals);
  const [expiringProposals, setExpiringProposals] = useState<string[]>([]);
  // 通知済みの期限切れproposalを追跡するためのRef
  const notifiedExpiredProposalsRef = useRef<Set<string>>(new Set());

  // 期限切れのプロポーザルを自動的に削除するエフェクト
  useEffect(() => {
    const checkExpiration = () => {
      const now = new Date();
      const notifiedIds = notifiedExpiredProposalsRef.current;

      // 期限切れが近いプロポーザルを特定（30秒以内）
      const aboutToExpire = proposals
        .filter(
          (p) =>
            p.expiresAt && p.expiresAt.getTime() - now.getTime() < 30000 && p.id && !expiringProposals.includes(p.id),
        )
        .map((p) => p.id!)
        .filter((id): id is string => id !== undefined);

      if (aboutToExpire.length > 0) {
        setExpiringProposals((prev) => [...prev, ...aboutToExpire]);
      }

      // 期限切れのプロポーザルをフィルタリング
      const updatedProposals = proposals.filter((proposal) => {
        if (!proposal.expiresAt) return true;
        return proposal.expiresAt.getTime() > now.getTime();
      });

      // 期限切れのプロポーザルが見つかった場合のみ更新
      if (updatedProposals.length !== proposals.length) {
        const expiredProposals = proposals.filter((p) => !updatedProposals.some((up) => up.id === p.id));

        // 少し遅延を入れて、アニメーションが見えるようにする
        setTimeout(() => {
          setProposals(updatedProposals);

          // 期限切れになったプロポーザルをトースト通知 (まだ通知していないもののみ)
          expiredProposals.forEach((p) => {
            if (p.id && !notifiedIds.has(p.id)) {
              toast.error(`Proposal expired`, {
                description: `The proposal "${p.title}" has expired and been removed.`,
              });
              notifiedIds.add(p.id);
            }
          });

          // 期限切れリストからも削除
          setExpiringProposals((prev) => prev.filter((id) => !expiredProposals.some((p) => p.id === id)));
        }, 1000); // 1秒の遅延
      }
    };

    // 初回実行
    checkExpiration();

    // 5秒ごとにチェック（より頻繁にチェックして20秒の期限を逃さないように）
    const intervalId = setInterval(checkExpiration, 5000);

    return () => clearInterval(intervalId);
  }, [proposals, expiringProposals]);

  const handleRemoveProposal = (id: string) => {
    setProposals(proposals.filter((proposal) => proposal.id !== id));
    setExpiringProposals((prev) => prev.filter((propId) => propId !== id));
  };

  return (
    <AlphaWalletProvider>
      {proposals.length > 0 ? (
        <div className="flex flex-col space-y-3">
          {proposals
            .filter((proposal) => proposal.id !== undefined)
            .map((proposal) => (
              <div key={proposal.id!} className="transition-all duration-1000">
                <ProposalCard proposal={proposal} onRemove={handleRemoveProposal} />
              </div>
            ))}
        </div>
      ) : (
        <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 p-8 text-center">
          <p className="mb-2 text-lg font-semibold text-white">No active proposals</p>
          <p className="text-sm text-gray-400">
            All proposals have been reviewed. Check back later for new suggestions.
          </p>
        </div>
      )}
    </AlphaWalletProvider>
  );
};

export const ProposalList = Object.assign(ProposalListComponent, {
  Skeleton: () => (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  ),
});
