import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Copy, Check, Gift, Trophy, RotateCcw, ShieldCheck, AlertCircle, Heart, Lock, ShieldAlert, Loader2 } from 'lucide-react';
import { WinnerClaim, IpClaimRecord } from '../types';
import { claimPrizeWithIp, checkIfIpIsClaimed, getRemainingWinnerSlots, getMyPermanentClaimRecord } from '../utils/storage';
import { fetchClientIp, maskIp } from '../utils/ipTracker';
import { sounds } from '../utils/audio';

interface WinnerScreenProps {
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  heartsRemaining: number;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
}

export const WinnerScreen: React.FC<WinnerScreenProps> = ({
  score,
  totalQuestions,
  timeTakenSeconds,
  heartsRemaining,
  onRestart,
  onOpenLeaderboard,
}) => {
  const [userName, setUserName] = useState('');
  const [claimed, setClaimed] = useState<WinnerClaim | null>(null);
  const [copied, setCopied] = useState(false);
  const [remainingSlots, setRemainingSlots] = useState(getRemainingWinnerSlots());
  
  // IP Restriction states
  const [clientIp, setClientIp] = useState<string>('');
  const [isCheckingIp, setIsCheckingIp] = useState<boolean>(true);
  const [alreadyClaimedRecord, setAlreadyClaimedRecord] = useState<IpClaimRecord | null>(getMyPermanentClaimRecord());
  const [claimError, setClaimError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isPerfectScore = score === totalQuestions;

  useEffect(() => {
    sounds.playVictory();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    // Detect client IP and verify 1-IP restriction status
    fetchClientIp().then(async (ip) => {
      setClientIp(ip);
      const res = await checkIfIpIsClaimed(ip);
      if (res.alreadyClaimed && res.record) {
        setAlreadyClaimedRecord(res.record);
      }
      setIsCheckingIp(false);
    });
  }, []);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setClaimError('');

    try {
      const activeIp = clientIp || (await fetchClientIp());
      const res = await claimPrizeWithIp(userName.trim(), score, timeTakenSeconds, activeIp);

      if (res.success && res.claim) {
        setClaimed(res.claim);
        setRemainingSlots(getRemainingWinnerSlots());
        sounds.playVictory();
        try {
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        } catch {}
      } else if (res.error === 'ALREADY_CLAIMED_BY_IP') {
        if (res.existingRecord) {
          setAlreadyClaimedRecord(res.existingRecord);
        }
        setClaimError('This IP address has already claimed a reward card. 1 claim per IP is permitted.');
        sounds.playWrong();
      } else if (res.error === 'SLOTS_EXHAUSTED') {
        setRemainingSlots(0);
        setClaimError('All 5 reward cards have already been claimed.');
        sounds.playWrong();
      } else {
        setClaimError('Could not process claim. Please try again.');
        sounds.playWrong();
      }
    } catch (err) {
      console.error(err);
      setClaimError('Network error while verifying claim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      sounds.playClick();
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const minutes = Math.floor(timeTakenSeconds / 60);
  const seconds = timeTakenSeconds % 60;

  return (
    <div className="w-full max-w-sm mx-auto h-full flex flex-col justify-center py-2 px-2 animate-fadeIn gap-2 my-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 text-center shadow-sm shrink-0">
        <div className="w-10 h-10 bg-amber-400 text-slate-900 rounded-xl flex items-center justify-center mx-auto mb-1 text-xl font-bold">
          🏆
        </div>

        <h1 className="text-lg font-extrabold uppercase tracking-wide">
          {isPerfectScore ? 'CHAMPION!' : 'QUEST COMPLETED!'}
        </h1>

        {/* Highlighted Final Result */}
        <div className="mt-2 mb-1 inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-sm">
          <span>FINAL RESULT:</span>
          <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded font-extrabold text-xs">{score}/{totalQuestions}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 bg-slate-800 p-2 rounded-xl my-2 text-xs font-bold">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Score</span>
            <span className="text-xs text-white">{score}/{totalQuestions}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Time</span>
            <span className="text-xs text-white">{minutes}m {seconds}s</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Hearts</span>
            <span className="text-xs text-rose-400 flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500 inline" />
              {heartsRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* Prize Claim Box */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        {claimed ? (
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>13-DIGIT CARD CLAIMED</span>
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Congratulations, {claimed.name}!
            </h3>

            {/* Code */}
            <div className="bg-slate-900 text-amber-400 p-4 rounded-xl text-center font-mono font-extrabold text-xl tracking-widest border border-slate-800 select-all">
              {claimed.cardCode}
            </div>

            <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Bound to IP: {maskIp(claimed.ipAddress || clientIp)} (1 claim limit)</span>
            </div>

            <button
              onClick={() => copyToClipboard(claimed.cardCode)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
          </div>
        ) : alreadyClaimedRecord ? (
          /* IP Already Claimed Case (Even after game resets) */
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 px-3 py-1 rounded-full text-[11px] font-extrabold border border-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>1 CLAIM PER IP POLICY ENFORCED</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                This IP address <span className="font-mono font-bold text-slate-900">({maskIp(clientIp || alreadyClaimedRecord.ip)})</span> has already claimed a 13-digit reward card.
              </p>

              {alreadyClaimedRecord.cardCode && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Your Claimed Card Code:
                  </span>
                  <div className="bg-slate-900 text-amber-400 py-2.5 px-3 rounded-lg font-mono font-bold text-sm tracking-wider select-all border border-slate-800">
                    {alreadyClaimedRecord.cardCode}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-slate-500 font-medium">
                To keep the contest fair, each IP address is strictly limited to 1 claim, even when game rounds are reset.
              </p>
            </div>

            {alreadyClaimedRecord.cardCode && (
              <button
                onClick={() => copyToClipboard(alreadyClaimedRecord.cardCode)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>COPIED CODE!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>COPY YOUR CARD CODE</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : !isPerfectScore ? (
          <div className="text-center space-y-2 py-2 bg-amber-50 rounded-xl p-3 border border-amber-200">
            <Gift className="w-7 h-7 text-amber-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">
              Score 10/10 To Unlock Prize Card!
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              You scored {score}/{totalQuestions}. Answer all 10 questions correctly to claim one of the 5 reward cards!
            </p>
          </div>
        ) : remainingSlots > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-emerald-600" />
                Claim 13-Digit Prize Card
              </h3>
              <span className="bg-emerald-50 text-emerald-800 font-bold text-[11px] px-2 py-0.5 rounded-full border border-emerald-200">
                {remainingSlots}/5 Left
              </span>
            </div>

            {/* IP Verification Status badge */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-[10px] text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>IP: <strong className="font-mono text-slate-800">{maskIp(clientIp) || 'Verifying...'}</strong></span>
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-100/70 px-1.5 py-0.5 rounded">
                1 Claim Allowed
              </span>
            </div>

            {claimError && (
              <div className="p-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{claimError}</span>
              </div>
            )}

            <form onSubmit={handleClaim} className="space-y-2">
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name..."
                disabled={isSubmitting || isCheckingIp}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 text-slate-900 text-sm font-semibold rounded-xl px-3.5 py-2.5 outline-none disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={!userName.trim() || isSubmitting || isCheckingIp}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>VERIFYING IP & CLAIMING...</span>
                  </>
                ) : (
                  <span>CLAIM PRIZE CARD</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-2 py-2">
            <AlertCircle className="w-6 h-6 text-rose-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">
              Prize Pool Exhausted (5/5 Reached)
            </h3>
            <p className="text-xs text-slate-500">
              All 5 prize cards have been claimed!
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenLeaderboard}
          className="py-3 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase border border-slate-200 flex items-center justify-center gap-1.5"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>WINNERS WALL</span>
        </button>

        <button
          onClick={onRestart}
          className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
